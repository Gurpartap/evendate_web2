__STATES['add_organization'] = AddOrganization;
__STATES['edit_organization'] = AddOrganization;

function AddOrganization($view) {
    var $wrapper = $view.find('.page_wrapper'),
        organization_id = __STATES.entityId;

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

        $view.find('#add_organization_submit').off('click.Submit').on('click.Submit', submitEditOrganization);

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

    function submitEditOrganization() {
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
                                showNotifier({text: 'Пожалуйста, добавьте обложку организации', status: false})
                            });
                        }
                        is_valid = false;
                    }
                });
            }
            return is_valid;
        }

        var $form = $view.find("#add-organization-form"),
            data = {
                organization_id: null,
                name: null,
                short_name: null,
                type_id: null,
                background_filename: null,
                logo_filename: null,
                default_address: null,
                location: null,
                description: null,
                site_url: null,
                vk_url: null,
                facebook_url: null,
                email: null,
                filenames: {
                    background: null,
                    logo: null
                }
            },
            form_data = $form.serializeForm(),
            url = form_data.organization_id ? '/api/v1/organizations/' + form_data.organization_id : '/api/v1/organizations/',
            method = form_data.organization_id ? 'PUT' : 'POST',
            valid_form = formValidation($form, !!(form_data.organization_id));

        if (valid_form) {
            $.extend(true, data, form_data);

            data.filenames = {
                background: data.background_filename,
                logo: data.logo_filename
            };

                $.ajax({
                    url: url,
                    data: JSON.stringify(data),
                    contentType: 'application/json',
                    method: method,
                    success: function (res) {
                        socket.emit('utils.updateImages');
                        ajaxHandler(res, function (res_data) {
                            socket.on('utils.updateImagesDone', function(){
                                window.location.href = '/organization/' + res_data.organization_id;
                            });


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
    var local_storage;
    try {
        local_storage = JSON.parse(window.localStorage.getItem('organization_info'));
    } catch (e) {
        local_storage = {}
    }

    var additional_fields = $.extend({
        header_text: 'Новый организатор'
    }, local_storage, true);

    window.localStorage.removeItem('open_add_organization');
    window.localStorage.removeItem('organization_info');

    $wrapper.html(tmpl('add-organization-page', additional_fields));

    if (typeof organization_id === 'undefined') {
        $wrapper.html(tmpl('add-organization-page', additional_fields));
        initEditEventPage($view);
        Modal.bindCallModal($view);
        initOrganizationTypes();
    } else {
        var url = '/api/v1/organizations/' + organization_id;
        $.ajax({
            url: url,
            method: 'GET',
            data: {
                fields: 'description,site_url,default_address,vk_url,facebook_url,email'
            },
            success: function (res) {
                ajaxHandler(res, function (data) {
                    data = Array.isArray(data) ? data[0] : data;
                    additional_fields.header_text = 'Редактирование организации';

                    if (data.background_img_url) {
                        additional_fields.background_filename = data.background_img_url.split('/').reverse()[0];
                    }
                    if (data.img_url) {
                        additional_fields.logo_filename = data.img_url.split('/').reverse()[0];
                    }

                    $.extend(true, additional_fields, data);
                    $wrapper.html(tmpl('add-organization-page', additional_fields));

                    initEditEventPage($view);
                    initOrganizationTypes(data.organization_type_id);

                    if (data.background_img_url && data.img_url) {
                        $view.find('.CallModal').removeClass('-hidden').on('crop', function (event, cropped_src, crop_data) {
                            var $button = $(this),
                                $parent = $button.closest('.EditEventImgLoadWrap'),
                                $preview = $parent.find('.EditEventImgPreview'),
                                $data_url = $parent.find('.DataUrl');
                            $data_url.val('data.source').data('source', $preview.attr('src')).trigger('change');
                            $preview.attr('src', cropped_src);
                            $button.data('crop_data', crop_data);
                        });
                    }
                    Modal.bindCallModal($view);

                    if (data.img_url) {
                        toDataUrl(data.img_url, function (base64_string) {
                            $view.find('#add_organization_img_src').val(base64_string ? base64_string : null);
                        });
                    }
                    if (data.background_img_url) {
                        toDataUrl(data.background_img_url, function (base64_string) {
                            $view.find('#add_organization_background_src').val(base64_string ? base64_string : null);
                        });
                    }

                }, ajaxErrorHandler);
            }
        });
    }
}