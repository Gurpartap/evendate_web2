__STATES['add_organization'] = AddOrganization;

function AddOrganization($view) {
    var $wrapper = $view.find('.page_wrapper'),
        event_id = __STATES.entityId;

    function initEditEventPage($view) {

        function bindLoadByURLButton() {
            $view.find('.LoadByURLButton').not('-Handled_LoadByURLButton').on('click', function () {
                var $this = $(this),
                    $input = $('#' + $this.data('load_input'));
                $this.data('url', $input.val());
                window.current_load_button = $this;
                socket.emit('image.getFromURL', $input.val());
                window.paceOptions = {
                    catchupTime: 10000,
                    maxProgressPerFrame: 1,
                    ghostTime: Number.MAX_SAFE_INTEGER,
                    checkInterval: {
                        checkInterval: 10000
                    },
                    eventLag: {
                        minSamples: 1,
                        sampleCount: 30000000,
                        lagThreshold: 0.1
                    }
                }; //хз зачем, все равно не работает
                Pace.restart();
            }).addClass('-Handled_LoadByURLButton');
        }

        function handleImgUpload($context, source, filename) {
            var $parent = $context.closest('.EditEventImgLoadWrap'),
                $preview = $parent.find('.EditEventImgPreview'),
                $file_name_text = $parent.find('.FileNameText'),
                $file_name = $parent.find('.FileName'),
                $data_url = $parent.find('.DataUrl'),
                $button = $parent.find('.CallModal');

            $preview.attr('src', source);
            $file_name_text.html('Загружен файл:<br>' + filename);
            $file_name.val(filename);
            $button
                .data('source_img', source)
                .on('crop', function (event, cropped_src, crop_data) {
                    $preview.attr('src', cropped_src);
                    $button.data('crop_data', crop_data);
                    $data_url.val('data.source').data('source', $preview.attr('src')).trigger('change');
                })
                .trigger('click.CallModal');
        }


        bindSelect2($view);
        bindTabs($view);
        limitInputSize();
        bindRippleEffect();
        bindFileLoadButton();
        bindLoadByURLButton();

        $view.find('.EditEventDefaultAddress').off('click.defaultAddress').on('click.defaultAddress', function () {
            var $this = $(this);
            $this.closest('.form_group').find('input').val($this.data('default_address'))
        });

        $view.find('#edit_event_delayed_publication').off('change.DelayedPublication').on('change.DelayedPublication', function () {
            $view.find('.DelayedPublication').toggleStatus('disabled');
        });

        $view.find('#edit_event_registration_required').off('change.RequireRegistration').on('change.RequireRegistration', function () {
            $view.find('.RegistrationTill').toggleStatus('disabled');
        });

        $view.find('#edit_event_free').off('change.FreeEvent').on('change.FreeEvent', function () {
            $view.find('.MinPrice').toggleStatus('disabled');
        });

        $view.find('.MinPrice').find('input').inputmask({
            'alias': 'numeric',
            'autoGroup': false,
            'digits': 2,
            'digitsOptional': true,
            'placeholder': '0',
            'rightAlign': false
        });

        socket.on('image.getFromURLDone', function (response) {
            if (response.error) {
                showNotifier({text: response.error, status: false});
            } else {
                handleImgUpload(window.current_load_button, response.data, response.filename);
            }
        });

        $view.find('.LoadImg').off('change.LoadImg').on('change.LoadImg', function (e) {
            var $this = $(e.target),
                files = e.target.files;

            if (files.length == 0) return false;
            for (var i = 0, f; f = files[i]; i++) {
                var reader = new FileReader();
                if (!f.type.match('image.*'))    continue;
                reader.onload = (function (the_file) {
                    return function (e) {
                        handleImgUpload($this, e.target.result, the_file['name']);
                    };
                })(f);
                reader.readAsDataURL(f);
            }

        });

        $view.find('#edit_event_to_public_vk').off('change.PublicVK').on('change.PublicVK', function () {
            var $vk_post_wrapper = $view.find('#edit_event_vk_publication'),
                $vk_post_content = $vk_post_wrapper.children();
            if ($(this).prop('checked')) {
                $vk_post_wrapper.height($vk_post_content.height());
            } else {
                $vk_post_wrapper.height(0);
            }
            $vk_post_wrapper.toggleStatus('disabled');

            $vk_post_content.find('.DeleteImg').off('click.DeleteImg').on('click.DeleteImg', function () {
                $(this).closest('.EditEventImgLoadWrap').find('input').val('').end().find('img').attr('src', '');
                toggleVkImg();
            })

        });

        $view.find('#edit_event_submit').off('click.Submit').on('click.Submit', submitEditEvent);

    }

    function initOrganizationTypes(selected_id) {
        $.ajax({
            url: '/api/v1/organizations/types',
            method: 'GET',
            success: function (res) {
                ajaxHandler(res, function (data) {
                    var $wrapper = $view.find('.EditEventOrganizations'),
                        organizations_options = $(),
                        $select = $wrapper.find('#add_organization_type');

                    data.forEach(function (organization) {
                        organizations_options = organizations_options.add(tmpl('option', {
                            val: organization.id,
                            display_name: organization.name
                        }));
                    });

                    $select.append(organizations_options).select2({
                        containerCssClass: 'form_select2',
                        dropdownCssClass: 'form_select2_drop'
                    });
                    if (selected_id) {
                        $select.select2('val', selected_id);
                    }
                    if (organizations_options.length > 1) {
                        $wrapper.removeClass('-hidden');
                    } else {
                        $wrapper.addClass('-hidden');
                    }
                }, ajaxErrorHandler)
            }
        });
    }

    function submitEditEvent() {
        function formValidation($form, for_edit) {
            var is_valid = true,
                $times = $form.find('#edit_event_different_time').prop('checked') ? $form.find('[class^="TableDay_"]') : $form.find('.MainTime');

            $form.find(':required').not(':disabled').each(function () {
                var $this = $(this),
                    max_length = $this.data('maxlength');
                if ($this.val() === "" || (max_length && $this.val().length > max_length)) {
                    if (is_valid) {
                        $('body').stop().animate({scrollTop: Math.ceil($this.offset().top - 150)}, 1000, 'swing');
                    }
                    handleErrorField($this);
                    is_valid = false;
                }
            });

            $times.each(function () {
                var $row = $(this),
                    start = $row.find('.StartHours').val() + $row.find('.StartMinutes').val(),
                    end = $row.find('.EndHours').val() + $row.find('.EndMinutes').val();
                if (start > end) {
                    if (is_valid) {
                        $('body').stop().animate({scrollTop: Math.ceil($row.offset().top - 150)}, 1000, 'swing');
                    }
                    showNotifier({text: 'Начальное время не может быть меньше конечного', status: false});
                    is_valid = false;
                }
            });

            if (!for_edit) {
                $form.find('.DataUrl').each(function () {
                    var $this = $(this);
                    if ($this.val() === "") {
                        if (is_valid) {
                            $('body').stop().animate({scrollTop: Math.ceil($this.closest('.EditEventImgLoadWrap').offset().top - 150)}, 1000, 'swing', function () {
                                showNotifier({text: 'Пожалуйста, добавьте к событию обложку', status: false})
                            });
                        }
                        is_valid = false;
                    }
                });
            }
            return is_valid;
        }

        var $form = $view.find("#edit-event-form"),
            data = {
                event_id: null,
                title: null,
                image_vertical: null,
                image_horizontal: null,
                organization_id: null,
                location: null,
                description: null,
                detail_info_url: null,
                different_time: null,
                dates: null,
                tags: null,
                registration_required: null,
                registration_till: null,
                is_free: null,
                min_price: null,
                delayed_publication: null,
                public_at: null,
                filenames: {
                    vertical: null,
                    horizontal: null
                }
            },
            form_data = $form.serializeForm(),
            tags = form_data.tags ? form_data.tags.split(',') : null,
            url = form_data.event_id ? '/api/v1/events/' + form_data.event_id : '/api/v1/events/',
            method = form_data.event_id ? 'PUT' : 'POST',
            valid_form = formValidation($form, !!(form_data.event_id));

        if (valid_form) {
            $.extend(true, data, form_data);

            data.tags = tags;
            data.filenames = {
                vertical: data.filename_vertical,
                horizontal: data.filename_horizontal
            };
            if (data.registration_required) {
                data.registration_till = "" + data.registration_till_date + 'T' + data.registration_till_time_hours + ':' + data.registration_till_time_minutes + ':00'
            }
            if (data.delayed_publication) {
                data.public_at = "" + data.public_at_date + 'T' + data.public_at_time_hours + ':' + data.public_at_time_minutes + ':00'
            }

            data.dates = [];
            if (data.different_time) {
                var selected_days_rows = $('.SelectedDaysRows').children();

                selected_days_rows.each(function () {
                    var $this = $(this);
                    data.dates.push({
                        event_date: $this.find('.DatePicker').data('selected_day'),
                        start_time: $this.find('.StartHours').val() + ':' + $this.find('.StartMinutes').val(),
                        end_time: $this.find('.EndHours').val() + ':' + $this.find('.EndMinutes').val()
                    });
                });
            } else {
                var MainCalendar = $('.EventDatesCalendar').data('calendar'),
                    $main_time = $('.MainTime'),
                    start_time = $main_time.find('.StartHours').val() + ':' + $main_time.find('.StartMinutes').val(),
                    end_time = $main_time.find('.EndHours').val() + ':' + $main_time.find('.EndMinutes').val();

                MainCalendar.selected_days.forEach(function (day) {
                    data.dates.push({
                        event_date: day,
                        start_time: start_time,
                        end_time: end_time
                    })
                });
            }


            $.ajax({
                url: url,
                data: JSON.stringify(data),
                contentType: 'application/json',
                method: method,
                success: function (res) {
                    ajaxHandler(res, function (res_data) {/*
                     if(data.event_id){
                     $('body').stop().animate({scrollTop:0}, 1000, 'swing', function() {
                     showNotification('Событие успешно обновлено', 3000);
                     });
                     } else {
                     $view.find('#edit_event_event_id').val(res_data.event_id);
                     $('body').stop().animate({scrollTop:0}, 1000, 'swing', function() {
                     showNotification('Событие успешно добавлено', 3000);
                     });
                     }*/

                        if ($view.find('#edit_event_to_public_vk').prop('checked')) {
                            socket.emit('vk.post', {
                                guid: data.vk_group,
                                event_id: data.event_id ? data.event_id : res_data.event_id,
                                message: data.vk_post,
                                image: {
                                    base64: data.vk_image_src,
                                    filename: data.vk_image_filename
                                },
                                link: data.detail_info_url
                            });
                        }
                        window.location = '/event/' + res_data.event_id;

                    }, function (res) {
                        if (res.text) {
                            showNotifier({text: res.text, status: false});
                        } else {
                            ajaxErrorHandler(res);
                        }
                    });
                }
            });
        }

    }

    $wrapper.empty();
    var local_storage = JSON.parse(window.localStorage.getItem('organization_info')),
        additional_fields = $.extend({
            header_text: 'Новый организатор'
        }, local_storage, true);


    $wrapper.html(tmpl('add-organization-page', additional_fields));
    initEditEventPage($view);
    Modal.bindCallModal($view);
    initOrganizationTypes();
}