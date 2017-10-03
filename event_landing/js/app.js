var __app = angular.module('LandingApp', ['ngFileUpload', 'gridster', 'ui.tinymce', 'ngSanitize']);


var search_data = searchToObject();

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

window.base64_in_progress = 0;
window.no_saved_data = false;

function handleFileLoadErr(err) {
    console.log(err);
    alert('Ошибка загрузки изображения');
}


function rgbToHex(r, g, b) {
    function componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }

    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}


var backgrounds = [
    {
        title: 'Без фона',
        image: ''
    }, {
        title: 'Ковёр',
        image: '/event_landing/images/polygon-bg/cover.png'
    }, {
        title: 'Углы',
        image: '/event_landing/images/polygon-bg/corners.png'
    }, {
        title: 'Чили',
        image: '/event_landing/images/polygon-bg/chile.png'
    }, {
        title: 'Геймпад',
        image: '/event_landing/images/polygon-bg/gamepad.png'
    }, {
        title: 'Орнамент',
        image: '/event_landing/images/polygon-bg/ornaments.png'
    }, {
        title: 'Руны',
        image: '/event_landing/images/polygon-bg/runes.png'
    }, {
        title: 'Звезды',
        image: '/event_landing/images/polygon-bg/stars.png'
    }, {
        title: 'Трип',
        image: '/event_landing/images/polygon-bg/trip.png'
    }, {
        title: 'Следы',
        image: '/event_landing/images/polygon-bg/ufo.png'
    }, {
        title: 'Стол',
        image: '/event_landing/images/polygon-bg/table.png'
    }, {
        title: 'Радуги',
        image: '/event_landing/images/polygon-bg/rainbows.png'
    }, {
        title: 'Площадь',
        image: '/event_landing/images/polygon-bg/squares.png'
    }, {
        title: 'Чешуя',
        image: '/event_landing/images/polygon-bg/helmet.png'
    }, {
        title: 'Дизайн',
        image: '/event_landing/images/polygon-bg/design.png'
    }, {
        title: 'Деревня',
        image: '/event_landing/images/polygon-bg/village.png'
    }, {
        title: 'Калейдоскоп',
        image: '/event_landing/images/polygon-bg/caleidoscope.png'
    }, {
        title: 'Полигон',
        image: '/event_landing/images/polygon-bg/green.jpg'
    }, {
        title: 'Кометы',
        image: '/event_landing/images/polygon-bg/comets.png'
    }, {
        title: 'Направления',
        image: '/event_landing/images/polygon-bg/directions.png'
    }, {
        title: 'Треугольники',
        image: '/event_landing/images/polygon-bg/triangles.png'
    }, {
        title: 'Трубы',
        image: '/event_landing/images/polygon-bg/pipes.png'
    }, {
        title: 'Спирали',
        image: '/event_landing/images/polygon-bg/spirals.png'
    }
];

__app.controller('WholeWorldController', ['$scope', 'Upload', '$timeout', function ($scope, Upload, $timeout) {

    $scope.edit_mode = search_data.edit;
    $scope.hide_loader = false;
    $scope.backgrounds = backgrounds;
    var initializing = true;

    $scope.intro = {
        steps: [
            'Добро пожаловать в редактор страницы события. Основная информация о событии уже представлена на странице. Информацию в любом блоке можно редактировать после нажатия на текст.',
            'Кнопки управления расположены в правом верхнем углу каждой из секций.',
            'При необходимости секцию с информацией можно скрыть.',
            'Добавьте блок в секцию.',
            'Общие настройки страницы расположены в левой панели.',
            'Цветовое оформление можно выбрать из заранее предопределенных или выбрать любой цвет в палитре',
            'Изменения вступают в силу для пользователей только после сохранения.'
        ]
    };

    $scope.$watch('data', function () {
        window.no_saved_data = true;
    }, true);

    $scope.data = {
        color_scheme: [0, 205, 175],
        accent_color_scheme: [0, 205, 145],
        overlay_opacity: 60,
        gallery_overlay_opacity: 60,
        default_img: './images/default.jpg',
        main_background: null,
        gallery_background: null,
        selected_bgs: {
            main: '',
            gallery: ''
        },
        main_description: '',
        main: {
            url: search_data.id,
            bad_url: null,
            vk_url: null,
            facebook_url: null,
            instagram_url: null,
            yandex_metrica_id: null,
            google_analytics_id: null,
            vk_retargeting_id: null,
            facebook_retargeting_id: null
        },
        header: {
            title: '',
            subtitle: '',
            location_addresses: '',
            description: '',
            background_base64: null,
            imageChange: function ($files, $file) {
                var _header = this;
                getBase64($file, function (err, res) {
                    if (res) {
                        _header.background_base64 = res;
                        $scope.data.main_background = res;
                    }
                });
            }
        },
        speakers: {
            title: 'Спикеры',
            subtitle: 'Подзаголовок',
            items: {},
            imageChange: function ($files, $file, $newFiles, $duplicateFiles, $invalidFiles, $event, item_uuid) {
                getBase64($file, function (err, res) {
                    $scope.data.speakers.items[item_uuid].base64_image = res;
                    $scope.data.speakers.items[item_uuid].image = null;
                });
            },
            addItem: function () {
                var uuid = guid();
                this.items[uuid] = {
                    name: 'Имя',
                    company_name: 'Название компании',
                    description: 'Описание',
                    image: './images/default.jpg',
                    uuid: uuid
                };
            },
            removeItem: function (uuid) {
                delete this.items[uuid];
            },
            enabled: true,
            toggleEnabled: function ($event) {
                this.enabled = !this.enabled;
                $event.preventDefault();
                return false;
            },
            gridOptions: {
                columns: 12, // the width of the grid, in columns
                pushing: false, // whether to push other items out of the way on move or resize
                floating: false, // whether to automatically float items up so they stack (you can temporarily disable if you are adding unsorted items with ng-repeat)
                swapping: false, // whether or not to have items of the same size switch places instead of pushing down if they are the same size
                width: 'auto', // can be an integer or 'auto'. 'auto' scales gridster to be the full width of its containing element
                colWidth: 'auto', // can be an integer or 'auto'.  'auto' uses the pixel width of the element divided by 'columns'
                rowHeight: '55', // can be an integer or 'match'.  Match uses the colWidth, giving you square widgets.
                margins: [50, 10], // the pixel distance between each widget
                outerMargin: true, // whether margins apply to outer edges of the grid
                sparse: false, // "true" can increase performance of dragging and resizing for big grid (e.g. 20x50)
                isMobile: false, // stacks the grid items if true
                mobileBreakPoint: 600, // if the screen is not wider that this, remove the grid layout and stack the items
                mobileModeEnabled: true, // whether or not to toggle mobile mode when screen width is less than mobileBreakPoint
                minColumns: 1, // the minimum columns the grid must have
                minRows: 1, // the minimum height of the grid, in rows
                maxRows: 100,
                defaultSizeX: 1, // the default width of a gridster item, if not specifed
                defaultSizeY: 1, // the default height of a gridster item, if not specified
                minSizeX: 3, // minimum column width of an item
                maxSizeX: null, // maximum column width of an item
                minSizeY: 7, // minumum row height of an item
                maxSizeY: null, // maximum row height of an item
                resizable: {
                    enabled: true,
                },
                draggable: {
                    enabled: true, // whether dragging items is supported
                    handle: '.drag-icon' // optional selector for drag handle
                }
            }
        },
        schedule: {
            title: 'Расписание',
            subtitle: 'Подзаголовок',
            days: {},
            days_count: 0,
            addDay: function ($event) {
                var day_uuid = guid();
                this.days[day_uuid] = {
                    name: 'День ' + (++this.days_count),
                    items: {},
                    uuid: day_uuid
                };

                setTimeout(function () {
                    $('.days-tab-link:last').click();
                }, 200);
                $event.preventDefault();
            },
            removeDay: function (uuid) {
                delete this.days[uuid];
                this.days_count--;
            },
            addDayItem: function (day_uuid) {
                var item_uuid = guid(),
                    _day = this.days[day_uuid];
                _day.items[item_uuid] = {
                    time: '00:00',
                    text_1: 'Зал #0',
                    text_2: 'Спикер #0',
                    title: 'Заголовок',
                    description: '',
                    uuid: item_uuid
                };
            },
            removeDayItem: function (day_uuid, uuid) {
                delete this.days[day_uuid].items[uuid];
            },
            enabled: true,
            toggleEnabled: function ($event) {
                this.enabled = !this.enabled;
                $event.preventDefault();
                return false;
            },
            itemsGridOptions: {
                columns: 1,
                rowHeight: '200', // can be an integer or 'match'.  Match uses the colWidth, giving you square widgets.
                pushing: true, // whether to push other items out of the way on move or resize
                floating: true, // whether to automatically float items up so they stack (you can temporarily disable if you are adding unsorted items with ng-repeat)
                swapping: false, // whether or not to have items of the same size switch places instead of pushing down if they are the same size
                width: 'auto', // can be an integer or 'auto'. 'auto' scales gridster to be the full width of its containing element
                colWidth: 'auto', // can be an integer or 'auto'.  'auto' uses the pixel width of the element divided by 'columns'
                margins: [10, 10], // the pixel distance between each widget
                outerMargin: true, // whether margins apply to outer edges of the grid
                sparse: false, // "true" can increase performance of dragging and resizing for big grid (e.g. 20x50)
                isMobile: false, // stacks the grid items if true
                mobileBreakPoint: 600, // if the screen is not wider that this, remove the grid layout and stack the items
                mobileModeEnabled: true, // whether or not to toggle mobile mode when screen width is less than mobileBreakPoint
                minColumns: 1, // the minimum columns the grid must have
                minRows: 1, // the minimum height of the grid, in rows
                maxRows: 100,
                defaultSizeX: 1, // the default width of a gridster item, if not specifed
                defaultSizeY: 1, // the default height of a gridster item, if not specified
                minSizeX: 1, // minimum column width of an item
                maxSizeX: null, // maximum column width of an item
                minSizeY: 1, // minumum row height of an item
                maxSizeY: null, // maximum row height of an item
                resizable: {
                    enabled: false,
                },
                draggable: {
                    enabled: true, // whether dragging items is supported
                    handle: '.drag-icon' // optional selector for drag handle
                }

            },
            gridOptions: {
                columns: 12, // the width of the grid, in columns
                pushing: false, // whether to push other items out of the way on move or resize
                floating: false, // whether to automatically float items up so they stack (you can temporarily disable if you are adding unsorted items with ng-repeat)
                swapping: false, // whether or not to have items of the same size switch places instead of pushing down if they are the same size
                width: 'auto', // can be an integer or 'auto'. 'auto' scales gridster to be the full width of its containing element
                colWidth: 'auto', // can be an integer or 'auto'.  'auto' uses the pixel width of the element divided by 'columns'
                rowHeight: '90', // can be an integer or 'match'.  Match uses the colWidth, giving you square widgets.
                margins: [40, 40], // the pixel distance between each widget
                outerMargin: true, // whether margins apply to outer edges of the grid
                sparse: false, // "true" can increase performance of dragging and resizing for big grid (e.g. 20x50)
                isMobile: false, // stacks the grid items if true
                mobileBreakPoint: 600, // if the screen is not wider that this, remove the grid layout and stack the items
                mobileModeEnabled: true, // whether or not to toggle mobile mode when screen width is less than mobileBreakPoint
                minColumns: 3, // the minimum columns the grid must have
                minRows: 1, // the minimum height of the grid, in rows
                maxRows: 100,
                defaultSizeX: 3, // the default width of a gridster item, if not specifed
                defaultSizeY: 1, // the default height of a gridster item, if not specified
                minSizeX: 3, // minimum column width of an item
                maxSizeX: null, // maximum column width of an item
                minSizeY: 1, // minumum row height of an item
                maxSizeY: null, // maximum row height of an item
                resizable: {
                    enabled: true
                },
                draggable: {
                    enabled: true, // whether dragging items is supported
                    handle: '.drag-icon' // optional selector for drag handle
                }
            }
        },
        testimonials: {
            title: 'Отзывы',
            subtitle: 'Подзаголовок',
            items: {},
            imageChange: function ($files, $file, $newFiles, $duplicateFiles, $invalidFiles, $event, item_uuid) {
                getBase64($file, function (err, res) {
                    $scope.data.testimonials.items[item_uuid].base64_image = res;
                    $scope.data.testimonials.items[item_uuid].image = null;
                });
            },
            addItem: function () {
                var item_uuid = guid();
                this.items[item_uuid] = {
                    text: 'Отзыв',
                    name: 'Имя',
                    image: './images/default.jpg',
                    details: 'Компания',
                    uuid: item_uuid
                };
            },
            removeItem: function (uuid) {
                delete this.items[uuid];

            },
            toggleEnabled: function ($event) {
                this.enabled = !this.enabled;
                $event.preventDefault();
                return false;
            },
            enabled: true,
            gridOptions: {
                columns: 12, // the width of the grid, in columns
                pushing: false, // whether to push other items out of the way on move or resize
                floating: false, // whether to automatically float items up so they stack (you can temporarily disable if you are adding unsorted items with ng-repeat)
                swapping: false, // whether or not to have items of the same size switch places instead of pushing down if they are the same size
                width: 'auto', // can be an integer or 'auto'. 'auto' scales gridster to be the full width of its containing element
                colWidth: 'auto', // can be an integer or 'auto'.  'auto' uses the pixel width of the element divided by 'columns'
                rowHeight: '55', // can be an integer or 'match'.  Match uses the colWidth, giving you square widgets.
                margins: [40, 10], // the pixel distance between each widget
                outerMargin: true, // whether margins apply to outer edges of the grid
                sparse: false, // "true" can increase performance of dragging and resizing for big grid (e.g. 20x50)
                isMobile: false, // stacks the grid items if true
                mobileBreakPoint: 600, // if the screen is not wider that this, remove the grid layout and stack the items
                mobileModeEnabled: true, // whether or not to toggle mobile mode when screen width is less than mobileBreakPoint
                minColumns: 1, // the minimum columns the grid must have
                minRows: 1, // the minimum height of the grid, in rows
                maxRows: 100,
                defaultSizeX: 1, // the default width of a gridster item, if not specifed
                defaultSizeY: 1, // the default height of a gridster item, if not specified
                minSizeX: 3, // minimum column width of an item
                maxSizeX: null, // maximum column width of an item
                minSizeY: 8, // minumum row height of an item
                maxSizeY: null, // maximum row height of an item
                resizable: {
                    enabled: true
                },
                draggable: {
                    enabled: true, // whether dragging items is supported
                    handle: '.drag-icon' // optional selector for drag handle
                }
            }
        },
        custom: {
            title: 'Свой блок',
            subtitle: 'Подзаголовок',
            toggleEnabled: function ($event) {
                this.enabled = !this.enabled;
                $event.preventDefault();
                return false;
            },
            tinymce_options: {
                selector: '.textarea-html',
                language: 'ru',
                language_url: 'js/langs/ru.js',
                theme: 'modern',
                invalid_elements: 'script',
                plugins: [
                    'advlist autolink lists link image charmap preview hr anchor pagebreak',
                    'searchreplace wordcount visualblocks visualchars code fullscreen',
                    'media nonbreaking save table contextmenu',
                    'template paste textcolor colorpicker textpattern imagetools codesample toc'
                ],
                toolbar1: 'preview media | undo redo | insert | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image| forecolor backcolor | codesample',
                image_advtab: true
            },
            html: '',
            enabled: true
        },
        gallery: {
            title: 'Галерея',
            subtitle: 'Подзаголовок',
            items: {},
            itemImageChange: function ($files, $file, $newFiles, $duplicateFiles, $invalidFiles, $event, item_uuid) {
                getBase64($file, function (err, res) {
                    $scope.data.gallery.items[item_uuid].base64_image = res;
                    $scope.data.gallery.items[item_uuid].image = null;
                });
            },
            enabled: true,
            background_base64: null,
            imageChange: function ($files, $file) {
                var _gallery = this;
                getBase64($file, function (err, res) {
                    if (res) {
                        _gallery.background_base64 = res;
                        $scope.data.gallery_background = res;
                    }
                });
            },
            addItem: function () {
                var item_uuid = guid();
                this.items[item_uuid] = {
                    title: 'Описание изображения',
                    image: './images/default.jpg',
                    uuid: item_uuid
                };
            },
            removeItem: function (item_uuid) {
                delete this.items[item_uuid];
            },
            toggleEnabled: function ($event) {
                this.enabled = !this.enabled;
                $event.preventDefault();
                return false;
            },
            gridOptions: {
                columns: 12, // the width of the grid, in columns
                pushing: false, // whether to push other items out of the way on move or resize
                floating: false, // whether to automatically float items up so they stack (you can temporarily disable if you are adding unsorted items with ng-repeat)
                swapping: false, // whether or not to have items of the same size switch places instead of pushing down if they are the same size
                width: 'auto', // can be an integer or 'auto'. 'auto' scales gridster to be the full width of its containing element
                colWidth: 'auto', // can be an integer or 'auto'.  'auto' uses the pixel width of the element divided by 'columns'
                rowHeight: 'match', // can be an integer or 'match'.  Match uses the colWidth, giving you square widgets.
                margins: [30, 40], // the pixel distance between each widget
                outerMargin: true, // whether margins apply to outer edges of the grid
                sparse: false, // "true" can increase performance of dragging and resizing for big grid (e.g. 20x50)
                isMobile: false, // stacks the grid items if true
                mobileBreakPoint: 600, // if the screen is not wider that this, remove the grid layout and stack the items
                mobileModeEnabled: true, // whether or not to toggle mobile mode when screen width is less than mobileBreakPoint
                minColumns: 3, // the minimum columns the grid must have
                minRows: 1, // the minimum height of the grid, in rows
                maxRows: 100,
                defaultSizeX: 4, // the default width of a gridster item, if not specifed
                defaultSizeY: 4, // the default height of a gridster item, if not specified
                minSizeX: 1, // minimum column width of an item
                maxSizeX: null, // maximum column width of an item
                minSizeY: 1, // minumum row height of an item
                maxSizeY: null, // maximum row height of an item
                resizable: {
                    enabled: true,
                    // handles: ['n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw'],
                    // start: function(event, $element, widget) {}, // optional callback fired when resize is started,
                    // resize: function(event, $element, widget) {}, // optional callback fired when item is resized,
                    // stop: function(event, $element, widget) {} // optional callback fired when item is finished resizing
                },
                draggable: {
                    enabled: true, // whether dragging items is supported
                    handle: '.drag-icon' // optional selector for drag handle
                }
            }

        },
        tickets: {
            title: 'Купить билеты',
            enabled: true
        },
        sponsors: {
            title: 'Партнеры',
            become_a_sponsor: 'Стать партнером',
            toggler_text: 'Убрать кнопку',
            imageChange: function ($files, $file, $newFiles, $duplicateFiles, $invalidFiles, $event, item_uuid) {
                getBase64($file, function (err, res) {
                    $scope.data.sponsors.items[item_uuid].base64_image = res;
                    $scope.data.sponsors.items[item_uuid].image = null;
                });
            },
            toggleEnabled: function ($event) {
                $event.preventDefault();
                this.enabled = !this.enabled;
                return false;
            },
            openFeedbackModal: function () {
                if (!$scope.edit_mode) {
                    $('#myModal').modal();
                }
            },
            items: {},
            toggleBecomeASponsor: function () {
                this.become_a_sponsor_enabled = !this.become_a_sponsor_enabled;
                this.toggler_text = this.become_a_sponsor_enabled ? 'Убрать кнопку' : 'Показать кнопку';
            },
            enabled: true,
            addItem: function () {
                var item_uuid = guid();
                this.items[item_uuid] = {
                    image: 'images/clients/logo-1-dark.png',
                    uuid: item_uuid
                };
            },
            removeItem: function (item_uuid) {
                delete this.items[item_uuid];
            },
            become_a_sponsor_enabled: true,
            gridOptions: {
                columns: 12, // the width of the grid, in columns
                pushing: true, // whether to push other items out of the way on move or resize
                floating: true, // whether to automatically float items up so they stack (you can temporarily disable if you are adding unsorted items with ng-repeat)
                swapping: false, // whether or not to have items of the same size switch places instead of pushing down if they are the same size
                width: 'auto', // can be an integer or 'auto'. 'auto' scales gridster to be the full width of its containing element
                colWidth: 'auto', // can be an integer or 'auto'.  'auto' uses the pixel width of the element divided by 'columns'
                rowHeight: '55', // can be an integer or 'match'.  Match uses the colWidth, giving you square widgets.
                margins: [40, 40], // the pixel distance between each widget
                outerMargin: true, // whether margins apply to outer edges of the grid
                sparse: false, // "true" can increase performance of dragging and resizing for big grid (e.g. 20x50)
                isMobile: false, // stacks the grid items if true
                mobileBreakPoint: 600, // if the screen is not wider that this, remove the grid layout and stack the items
                mobileModeEnabled: true, // whether or not to toggle mobile mode when screen width is less than mobileBreakPoint
                minColumns: 1, // the minimum columns the grid must have
                minRows: 1, // the minimum height of the grid, in rows
                maxRows: 100,
                defaultSizeX: 1, // the default width of a gridster item, if not specifed
                defaultSizeY: 1, // the default height of a gridster item, if not specified
                minSizeX: 1, // minimum column width of an item
                maxSizeX: null, // maximum column width of an item
                minSizeY: 2, // minumum row height of an item
                maxSizeY: null, // maximum row height of an item
                resizable: {
                    enabled: $scope.edit_mode,
                },
                draggable: {
                    enabled: true, // whether dragging items is supported
                    handle: '.drag-icon' // optional selector for drag handle
                }
            }
        },
        faq: {
            title: 'FAQ',
            subtitle: 'Подзаголовок',
            items: {},
            addItem: function () {
                var item_uuid = guid();
                this.items[item_uuid] = ({
                    question: 'Вопрос?',
                    answer: 'Ответ на вопрос.',
                    uuid: guid(),
                    sizeX: 2
                });
            },
            removeItem: function (item_uuid) {
                delete this.items[item_uuid];
            },
            toggleEnabled: function ($event) {
                $event.preventDefault();
                this.enabled = !this.enabled;
                return false;
            },
            enabled: true,
            gridOptions: {
                columns: 4, // the width of the grid, in columns
                pushing: true, // whether to push other items out of the way on move or resize
                floating: true, // whether to automatically float items up so they stack (you can temporarily disable if you are adding unsorted items with ng-repeat)
                swapping: false, // whether or not to have items of the same size switch places instead of pushing down if they are the same size
                width: 'auto', // can be an integer or 'auto'. 'auto' scales gridster to be the full width of its containing element
                colWidth: 'auto', // can be an integer or 'auto'.  'auto' uses the pixel width of the element divided by 'columns'
                rowHeight: '140', // can be an integer or 'match'.  Match uses the colWidth, giving you square widgets.
                margins: [50, 10], // the pixel distance between each widget
                outerMargin: true, // whether margins apply to outer edges of the grid
                sparse: false, // "true" can increase performance of dragging and resizing for big grid (e.g. 20x50)
                isMobile: false, // stacks the grid items if true
                mobileBreakPoint: 600, // if the screen is not wider that this, remove the grid layout and stack the items
                mobileModeEnabled: true, // whether or not to toggle mobile mode when screen width is less than mobileBreakPoint
                minColumns: 1, // the minimum columns the grid must have
                minRows: 1, // the minimum height of the grid, in rows
                maxRows: 100,
                defaultSizeX: 1, // the default width of a gridster item, if not specifed
                defaultSizeY: 1, // the default height of a gridster item, if not specified
                minSizeX: 1, // minimum column width of an item
                maxSizeX: null, // maximum column width of an item
                minSizeY: 1, // minumum row height of an item
                maxSizeY: null, // maximum row height of an item
                resizable: {
                    enabled: $scope.edit_mode,
                },
                draggable: {
                    enabled: true, // whether dragging items is supported
                    handle: '.drag-icon' // optional selector for drag handle
                }
            },
        },
        map: {
            title: 'Карта',
            toggleEnabled: function () {
                this.enabled = !this.enabled;
                return false;
            },
            enabled: true,
        },
    };

    $scope.sendFeedback = function () {
        $('.feedback-modal-btn').addClass('disabled').prop('disabled', 'disabled');
        var showError = function (err) {
            $('.feedback-modal-error').removeClass('hidden');
            $('.feedback-modal-error .text').text(err.responseJSON.text);
        };
        $('.feedback-modal-error, .feedback-modal-success').addClass('hidden');
        $.ajax({
            url: '/api/v1/organizations/' + $scope.event.organization_id + '/feedback',
            type: 'POST',
            data: $('.feedback-form').serializeArray(),
            success: function (res) {
                if (res.status) {
                    $('.feedback-form, .feedback-modal-btn.send-btn').addClass('hidden');
                    $('.feedback-modal-success').removeClass('hidden');
                    $('.feedback-modal-success .text').text(res.text);
                } else {
                    showError(res);
                }
            },
            error: showError,
            complete: function () {
                $('.feedback-modal-btn').removeClass('disabled').removeProp('disabled');
            }
        });
    };


    $scope.$watch('data.main_background', function () {
        if ($scope.data.main_background && $scope.data.main_background.$ngfBlobUrl) {
            $scope.setHeaderImage($scope.data.main_background.$ngfBlobUrl);
        }
    });

    $scope.checkAlias = function () {
        if ((/^([a-zA-Z\-_0-9]+)$/gmi.test($scope.data.main.url) === false)
            || (parseInt($scope.data.main.url) == $scope.data.main.url && $scope.data.main.url != search_data.id)
        ) {
            $scope.data.main.bad_url = true;
            $scope.data.main.bad_url_text = 'В URL допускаются только цифры, латинские буквы, знаки тире и нижнее подчеркивание';
        } else {
            $scope.data.main.bad_url = null;
            $.ajax({
                url: '/api/v1/events/' + search_data.id + '/landing/url',
                data: {url: $scope.data.main.url},
                success: function (res) {
                    $scope.data.main.bad_url = !res.status;
                    $scope.data.main.bad_url_text = res.text;
                    $scope.$apply();
                }
            })
        }
    };

    $scope.saveLandingData = function () {
        NProgress.start();
        var ajaxData = function () {
            $.ajax({
                url: '/api/v1/events/' + search_data.id + '/landing/',
                type: 'POST',
                data: {data: JSON.stringify($scope.data)},
                complete: function () {
                    NProgress.done();
                    window.no_saved_data = false;
                }
            })
        };

        if (window.base64_in_progress !== 0) {
            window.save_interval = setInterval(function () {
                if (window.base64_in_progress !== 0) return;
                NProgress.inc();
                ajaxData();
                clearInterval(window.save_interval);
            }, 500);
        } else {
            ajaxData();
        }
    };

    $scope.$watch('data.gallery_background', function () {
        if ($scope.data.gallery_background && $scope.data.gallery_background.$ngfBlobUrl) {
            $scope.setGalleryImage($scope.data.gallery_background.$ngfBlobUrl);
        }
    });

    $scope.updateBackgroundSuggests = function (tags) {
        var tag_names = [];
        tags.forEach(function (tag) {
            tag_names.push(tag.name);
        });

        $.ajax({
            url: 'https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20170823T192011Z.3984130a921181f9.56b3c6ebe6a18a055a69c8075b8561332f4163bd&lang=en&text=' + tag_names.join('%0A'),
            success: function (data) {
                if (data.text) {
                    var keywords = data.text[0].split('\n');
                    keywords.forEach(function (keyword) {
                        $.ajax({
                            url: 'https://api.unsplash.com/search/photos?page=1&per_page=5&client_id=9176ef748f4aece74e3532d1d706c8f4b9884cc5e85453bc68517df1f00f2e2d&query=' + keyword,
                            success: function (unsplash) {
                                if (unsplash.results && unsplash.results.length !== 0) {
                                    unsplash.results.forEach(function (image) {
                                        var __image = image.urls;
                                        __image.title = keyword;
                                        __image.image = __image.full;
                                        __image.user = image.user;
                                        $scope.backgrounds.push(__image);
                                        $scope.$apply();
                                    });
                                }
                            }
                        });
                    })
                }
            }
        })
    };

    $scope.logger = function (data) {
        console.log(data);
    };

    $scope.setHeaderImage = function (url, file) {
        $('.polygon-bg').css('background-image', 'url(' + url + ')');
        $scope.data.main_background = url;
    };

    $scope.setGalleryImage = function (url) {
        $('.recap-gallery.dark-image-bg').css('background-image', 'url(' + url + ')');
        $scope.data.gallery_background = url;
    };

    $scope.setGlobalColor = function (val) {
        $scope.data.color_scheme = [val.r, val.g, val.b];
        $scope.data.accent_color_scheme = [val.r, val.g, val.b - 30];
        var html = document.getElementsByTagName('html')[0];
        html.style.setProperty("--base-num", $scope.data.color_scheme.join(', '));
        html.style.setProperty("--accent-num", $scope.data.accent_color_scheme.join(', '));
        evendateWidget.setColor(rgbToHex(val.r, val.g, val.b));
    };

    $scope.setOverlayOpacity = function () {
        var html = document.getElementsByTagName('html')[0];
        html.style.setProperty("--overlay-opacity", (100 - $scope.data.overlay_opacity) / 100);
    };

    $scope.setGalleryOverlayOpacity = function () {
        var html = document.getElementsByTagName('html')[0];
        html.style.setProperty("--gallery-opacity", (100 - $scope.data.gallery_overlay_opacity) / 100);
    };

    function getBase64(file, cb) {
        if (file instanceof Blob === false) return cb(null, null);
        window.base64_in_progress++;
        NProgress.start();
        file.upload = Upload.upload({
            url: '/event_images/landings/',
            data: {file: file, event_id: search_data.id}
        });

        file.upload.then(function (response) {
            $timeout(function () {
                if (--window.base64_in_progress === 0) {
                    NProgress.done();
                }
                cb(null, response.data);
            });
        }, function (response) {
            if (response.status > 0)
                alert(response.status + ': ' + response.data);
        }, function (evt) {
            file.progress = Math.min(100, parseInt(100.0 *
                evt.loaded / evt.total));
            NProgress.set(file.progress / 100);
        });


    }

    $.ajax({
        url: '/api/v1/events/' + search_data['id'] + '?fields=tags,latitude,longitude,description,ticketing_available,registration_available,landing_data,location,image_horizontal_url,registration_required,registration_locally,organization_name,ticketing_available,registration_available',
        success: function (res) {
            var event = res.data[0];
            $scope.event = event;
            initMapBig(event);
            if (!event.landing_data) {
                var colorThief = new ColorThief(),
                    colorSync = colorThief.getColorAsync(event.image_horizontal_url, function (color) {
                        $scope.setGlobalColor({r: color[0], g: color[1], b: color[2]})
                    });
                $scope.data.header.subtitle = event.title;
                $scope.data.header.title = event.organization_name;
                $scope.data.header.location_addresses = event.location;
                $scope.data.main_description = event.description;

                if (event.ticketing_available) {
                    $scope.data.tickets.title = 'Купить билеты';
                } else if (event.registration_available) {
                    $scope.data.tickets.title = 'Регистрация'
                } else {
                    $scope.data.tickets.enabled = false;
                }
                $scope.$apply();
                if ($scope.edit_mode) {
                    $scope.intro_instance = introJs();
                    $scope.intro_instance.onchange(function (targetElement) {
                        var current_step = $(targetElement).data('step');
                        if (current_step == 6) {
                            $('.main-settings-btn').click();
                        }

                    });
                    $scope.intro_instance.setOptions({
                        'nextLabel': 'Вперед',
                        'prevLabel': 'Назад',
                        'skipLabel': 'Пропустить',
                        'doneLabel': 'Закрыть',
                    });
                }
            } else if (event.landing_data) {
                var _data = JSON.parse(event.landing_data);
                $.each(_data, function (key, value) {
                    if ($.type(value) === 'object') {
                        $.each(value, function (key_l2, val_l2) {
                            if ($.type($scope.data[key][key_l2]) !== 'function' &&
                                !Array.isArray(val_l2)) {
                                $scope.data[key][key_l2] = val_l2;
                            }
                        });
                    } else {
                        $scope.data[key] = value;
                    }
                });
                $scope.setGalleryOverlayOpacity();
                $scope.setOverlayOpacity();
                var color = $scope.data.color_scheme;
                $scope.setGlobalColor({r: color[0], g: color[1], b: color[2]});
                if ($scope.data.main_background) {
                    $scope.setHeaderImage($scope.data.main_background);
                }
                if ($scope.data.gallery_background) {
                    $scope.setGalleryImage($scope.data.gallery_background);
                }
                $scope.$apply();
            }
            if (!$scope.edit_mode) {
                $('[contenteditable]').prop('contenteditable', 'false');
                $('a[href="#"]').on('click', function (e) {
                    e.preventDefault();
                    return false;
                });
                $('.lightbox').nivoLightbox();
                $('.days-tab-link:first').click();
                $scope.data.sponsors.gridOptions.resizable.enabled = false;
                $scope.data.faq.gridOptions.resizable.enabled = false;
                $scope.data.speakers.gridOptions.resizable.enabled = false;
            } else {
                window.no_saved_data = false;
                $scope.updateBackgroundSuggests(event.tags);
                $scope.$apply();
            }


            $timeout(function () {
                $scope.hide_loader = true;
                $scope.intro_instance.start();
            });
        }
    });

    if (!$scope.edit_mode) {
        $('[contenteditable]').prop('contenteditable', 'false');
    }

    $timeout(function () {
        evendateWidget.setHeight();
        $('#evendate-widget-' + search_data.id).get(0).onload = function () {
            evendateWidget.setColor(rgbToHex($scope.data.color_scheme[0], $scope.data.color_scheme[1], $scope.data.color_scheme[2]));
        };
        $('#current-url').val(window.location.href);


        $('#myModal').on('show.bs.modal', function () {
            $('.feedback-modal-error, .feedback-modal-success').addClass('hidden');
            $('.feedback-form, .feedback-modal-btn.send-btn').removeClass('hidden');

        });
    });

}]);

__app.directive("contenteditable", function () {
    return {
        restrict: "A",
        require: "ngModel",
        link: function (scope, element, attrs, ngModel) {

            function read() {
                ngModel.$setViewValue(element.html());
            }

            ngModel.$render = function () {
                element.html(ngModel.$viewValue || "");
            };

            element.bind("blur keyup change", function () {
                scope.$apply(read);
            });
        }
    };
});

$("#html5colorpicker").spectrum({
    allowEmpty: true,
    showInitial: true,
    showInput: true,
    chooseText: "Применить",
    cancelText: "Отмена",
    change: function (color) {
        var scope = angular.element(document.body).scope();
        scope.setGlobalColor(color.toRgb());
    }
});

/* =================================
 ===  EXPAND COLLAPSE            ====
 =================================== */
$(document).ready(function () {
    $('#toggle-switcher').click(function () {
        if ($(this).hasClass('open')) {
            $(this).removeClass('open');
            $('#switch-style').animate({'left': '-220px'});
        } else {
            $(this).addClass('open');
            $('#switch-style').animate({'left': '0'});
        }
    });

    $('.panel-close').on('click', function () {
        var $panel = $(this).parents('.board-menu');
        $panel.removeClass('open');
        if ($panel.hasClass('left-menu')) {
            $panel.animate({'left': '-340'});
        } else {
            $panel.animate({'right': '-340'});
        }

        $('#fab-save').animate({right: 50});

    });

    $('.board-settings-btn.main-btn').on('click', function () {
        $('.board-menu.open .panel-close').click();
        var $panel = $('#' + $(this).data('panel-id'));
        $panel.addClass('open').animate({'right': '0'})
        $('#fab-save').animate({right: 390});
    });

    $('.board-settings-btn.gallery-btn').on('click', function () {
        $('.board-menu.open .panel-close').click();
        var $panel = $('#' + $(this).data('panel-id'));
        $panel.addClass('open').animate({'right': '0'});
        $('#fab-save').animate({right: 390});

    });

    $('.main-settings-btn').on('click', function () {
        $('.board-menu.open .panel-close').click();
        var $panel = $('#' + $(this).data('panel-id'));
        $panel.addClass('open').animate({'left': '0'})
    });


    $(window).on("beforeunload", function (e) {
        var res = (search_data.edit === 'true' && window.no_saved_data)
            ? "Вы уверены, что хотите закрыть вкладку? Несохраненные данные будут потеряны."
            : undefined;
        e.returnValue = res;
        return res;
    });

});

