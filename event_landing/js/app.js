var __app = angular.module('LandingApp', ['ngFileUpload', 'gridster', 'ui.tinymce']);

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

function getBase64(file, cb) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
        cb(null, reader.result);
    };
    reader.onerror = function (error) {
        cb(error, null);
        handleFileLoadErr(error);
    };
}

function handleFileLoadErr(err){
    console.log(err);
    alert('Ошибка загрузки изображения');
}

var backgrounds = [
    {
        title: 'Без фона',
        image: ''
    }, {
        title: 'Ковёр',
        image: 'images/polygon-bg/cover.png'
    }, {
        title: 'Углы',
        image: 'images/polygon-bg/corners.png'
    }, {
        title: 'Чили',
        image: 'images/polygon-bg/chile.png'
    }, {
        title: 'Геймпад',
        image: 'images/polygon-bg/gamepad.png'
    }, {
        title: 'Орнамент',
        image: 'images/polygon-bg/ornaments.png'
    }, {
        title: 'Руны',
        image: 'images/polygon-bg/runes.png'
    }, {
        title: 'Звезды',
        image: 'images/polygon-bg/stars.png'
    }, {
        title: 'Трип',
        image: 'images/polygon-bg/trip.png'
    }, {
        title: 'Следы',
        image: 'images/polygon-bg/ufo.png'
    }, {
        title: 'Стол',
        image: 'images/polygon-bg/table.png'
    }, {
        title: 'Радуги',
        image: 'images/polygon-bg/rainbows.png'
    }, {
        title: 'Площадь',
        image: 'images/polygon-bg/squares.png'
    }, {
        title: 'Чешуя',
        image: 'images/polygon-bg/helmet.png'
    }, {
        title: 'Дизайн',
        image: 'images/polygon-bg/design.png'
    }, {
        title: 'Деревня',
        image: 'images/polygon-bg/village.png'
    }, {
        title: 'Калейдоскоп',
        image: 'images/polygon-bg/caleidoscope.png'
    }, {
        title: 'Полигон',
        image: 'images/polygon-bg/green.jpg'
    }, {
        title: 'Кометы',
        image: 'images/polygon-bg/comets.png'
    }, {
        title: 'Направления',
        image: 'images/polygon-bg/directions.png'
    }, {
        title: 'Треугольники',
        image: 'images/polygon-bg/triangles.png'
    }, {
        title: 'Трубы',
        image: 'images/polygon-bg/pipes.png'
    }, {
        title: 'Спирали',
        image: 'images/polygon-bg/spirals.png'
    }
];

__app.controller('WholeWorldController', ['$scope', '$timeout', function ($scope, $timeout) {

    var search_data = searchToObject();
    $scope.edit_mode = search_data.edit;
    $scope.backgrounds = backgrounds;
    var initializing = true;

    $scope.tinymce_options = {
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
        image_advtab: true,

    };


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
        header: {
            title: '',
            subtitle: '',
            location_addresses: '',
            description: '',
            background_base64: null,
            imageChange: function($files, $file){
                var _header = this;
                getBase64($file, function(err, res){
                    if (res){
                        _header.background_base64 = res;
                    }
                });
            }
        },
        speakers: {
            title: 'Спикеры',
            subtitle: '',
            items: {},
            addItem: function () {
                var uuid = guid(),
                    _this = this;
                this.items[uuid] = {
                    name: 'Имя',
                    company_name: 'Название компании',
                    description: 'Описание',
                    image: './images/default.jpg',
                    uuid: uuid,
                    remove: function () {
                        delete _this.items[uuid];
                    }
                };
                setTimeout(function () {
                    updateHeroTabs()
                }, 200);
            },
            enabled: true,
            toggleEnabled: function () {
                this.enabled = !this.enabled;
                return false;
            },
            gridOptions: {
                columns: 4, // the width of the grid, in columns
                pushing: true, // whether to push other items out of the way on move or resize
                floating: true, // whether to automatically float items up so they stack (you can temporarily disable if you are adding unsorted items with ng-repeat)
                swapping: false, // whether or not to have items of the same size switch places instead of pushing down if they are the same size
                width: 'auto', // can be an integer or 'auto'. 'auto' scales gridster to be the full width of its containing element
                colWidth: 'auto', // can be an integer or 'auto'.  'auto' uses the pixel width of the element divided by 'columns'
                rowHeight: '370', // can be an integer or 'match'.  Match uses the colWidth, giving you square widgets.
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
                    enabled: false,
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
        schedule: {
            title: 'Расписание',
            subtitle: 'Можно редактирование расписание на любое количество дней',
            days: {},
            days_count: 0,
            addDay: function ($event) {
                var day_uuid = guid(),
                    _this = this;
                _this.days[day_uuid] = {
                    name: 'День ' + (++this.days_count),
                    items: {},
                    uuid: day_uuid,
                    addItem: function () {
                        var item_uuid = guid(),
                            _day = this;
                        _day.items[item_uuid] = {
                            time: '00:00',
                            text_1: 'Зал #0',
                            text_2: 'Спикер #0',
                            title: 'Заголовок',
                            description: '',
                            uuid: item_uuid,
                            remove: function () {
                                delete _day.items[item_uuid];
                            }
                        };
                    },
                    remove: function () {
                        delete _this.days[day_uuid];
                        _this.days_count--;
                    }
                };

                setTimeout(function () {
                    $('.days-tab-link:last').click();
                }, 200);
                $event.preventDefault();
            },
            enabled: true,
            toggleEnabled: function () {
                this.enabled = !this.enabled;
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
                columns: 5, // the width of the grid, in columns
                pushing: true, // whether to push other items out of the way on move or resize
                floating: true, // whether to automatically float items up so they stack (you can temporarily disable if you are adding unsorted items with ng-repeat)
                swapping: false, // whether or not to have items of the same size switch places instead of pushing down if they are the same size
                width: 'auto', // can be an integer or 'auto'. 'auto' scales gridster to be the full width of its containing element
                colWidth: 'auto', // can be an integer or 'auto'.  'auto' uses the pixel width of the element divided by 'columns'
                rowHeight: '70', // can be an integer or 'match'.  Match uses the colWidth, giving you square widgets.
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
                minSizeY: 1, // minumum row height of an item
                maxSizeY: null, // maximum row height of an item
                resizable: {
                    enabled: false,
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
        testimonials: {
            title: 'Отзывы',
            subtitle: 'Добавляйте отзывы ваших клиентов и их фотографии',
            items: {},
            addItem: function () {
                var item_uuid = guid(),
                    _scope = this;
                _scope.items[item_uuid] = {
                    text: 'Отзыв',
                    name: 'Имя',
                    image: './images/default.jpg',
                    details: 'Компания',
                    uuid: item_uuid,
                    remove: function () {
                        delete _scope.items[item_uuid];
                    }
                };
            },
            toggleEnabled: function () {
                this.enabled = !this.enabled;
                return false;
            },
            enabled: true,
            gridOptions: {
                columns: 3, // the width of the grid, in columns
                pushing: true, // whether to push other items out of the way on move or resize
                floating: true, // whether to automatically float items up so they stack (you can temporarily disable if you are adding unsorted items with ng-repeat)
                swapping: false, // whether or not to have items of the same size switch places instead of pushing down if they are the same size
                width: 'auto', // can be an integer or 'auto'. 'auto' scales gridster to be the full width of its containing element
                colWidth: 'auto', // can be an integer or 'auto'.  'auto' uses the pixel width of the element divided by 'columns'
                rowHeight: '430', // can be an integer or 'match'.  Match uses the colWidth, giving you square widgets.
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
        custom: {
            title: 'Свой блок',
            subtitle: 'Добавляйте любой HTML, кроме тегов script',
            toggleEnabled: function () {
                this.enabled = !this.enabled;
                return false;
            },
            html: '',
            enabled: true
        },
        gallery: {
            title: 'Галлерея',
            subtitle: 'Добавляйте фотографии за прошлые года или фотографии помещений',
            items: {},
            enabled: true,
            background_base64: null,
            imageChange: function($files, $file){
                var _gallery = this;
                getBase64($file, function(err, res){
                    if (res){
                        _gallery.background_base64 = res;
                    }
                });
            },
            addItem: function () {
                var item_uuid = guid(),
                    _scope = this;
                _scope.items[item_uuid] = {
                    title: 'Описание изображения',
                    image: './images/default.jpg',
                    uuid: item_uuid,
                    remove: function () {
                        delete _scope.items[item_uuid];
                    }
                };

            },
            toggleEnabled: function () {
                this.enabled = !this.enabled;
                return false;
            },
            gridOptions: {
                columns: 3, // the width of the grid, in columns
                pushing: true, // whether to push other items out of the way on move or resize
                floating: true, // whether to automatically float items up so they stack (you can temporarily disable if you are adding unsorted items with ng-repeat)
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
            toggleEnabled: function () {
                this.enabled = !this.enabled;
                return false;
            },
            items: {},
            enabled: true,
            addItem: function () {
                var item_uuid = guid(),
                    _scope = this;
                _scope.items[item_uuid] = {
                    image: 'images/clients/logo-1-dark.png',
                    uuid: item_uuid,
                    remove: function () {
                        delete _scope.items[item_uuid];
                    }
                };

            },
            toggleBecomeASponsor: function () {
                this.become_a_sponsor_enabled = !this.become_a_sponsor_enabled;
            },
            become_a_sponsor_enabled: true,
            gridOptions: {
                columns: 6, // the width of the grid, in columns
                pushing: true, // whether to push other items out of the way on move or resize
                floating: true, // whether to automatically float items up so they stack (you can temporarily disable if you are adding unsorted items with ng-repeat)
                swapping: false, // whether or not to have items of the same size switch places instead of pushing down if they are the same size
                width: 'auto', // can be an integer or 'auto'. 'auto' scales gridster to be the full width of its containing element
                colWidth: 'auto', // can be an integer or 'auto'.  'auto' uses the pixel width of the element divided by 'columns'
                rowHeight: '100', // can be an integer or 'match'.  Match uses the colWidth, giving you square widgets.
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
        faq: {
            title: 'FAQ',
            subtitle: 'Ответы на часто задаваемые вопросы',
            items: {},
            addItem: function () {
                var item_uuid = guid(),
                    _this = this;

                _this.items[item_uuid] = ({
                    question: 'Вопрос?',
                    answer: 'Ответ на вопрос.',
                    uuid: guid(),
                    sizeX: 2,
                    remove: function () {
                        delete _this.items[item_uuid];
                    }
                });
            },
            toggleEnabled: function () {
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
                    enabled: true,
                    handles: ['n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw'],
                    // start: function(event, $element, widget) {}, // optional callback fired when resize is started,
                    // resize: function(event, $element, widget) {}, // optional callback fired when item is resized,
                    // stop: function(event, $element, widget) {} // optional callback fired when item is finished resizing
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

    $scope.$watch('data.main_background', function () {
        if ($scope.data.main_background && $scope.data.main_background.$ngfBlobUrl) {
            $scope.setHeaderImage($scope.data.main_background.$ngfBlobUrl);
        }
    });

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
    };

    $scope.setOverlayOpacity = function () {
        var html = document.getElementsByTagName('html')[0];
        html.style.setProperty("--overlay-opacity", (100 - $scope.data.overlay_opacity) / 100);
    };

    $scope.setGalleryOverlayOpacity = function () {
        var html = document.getElementsByTagName('html')[0];
        html.style.setProperty("--gallery-overlay-opacity", (100 - $scope.data.gallery_overlay_opacity) / 100);
    };

    $.ajax({
        url: '/api/v1/events/' + search_data['id'] + '?fields=tags,description,ticketing_available,registration_available,landing_data,location,image_horizontal_url,registration_required,registration_locally,organization_name,ticketing_available,registration_available',
        success: function (res) {
            var event = res.data[0];
            console.log(event);
            if (!event.landing_data) {
                var colorThief = new ColorThief(),
                    colorSync = colorThief.getColorAsync(event.image_horizontal_url, function (color) {
                        $scope.setGlobalColor({r: color[0], g: color[1], b: color[2]})
                    });
                $scope.data.header.subtitle = event.title;
                $scope.data.header.title = event.organization_name;
                $scope.data.header.location_addresses = event.location;
                $scope.data.main_description = event.description;
                $scope.data.main_description = event.description;

                if (event.ticketing_available) {
                    $scope.data.tickets.title = 'Купить билеты';
                } else if (event.registration_available) {
                    $scope.data.tickets.title = 'Регистрация'
                } else {
                    $scope.data.tickets.enabled = false;
                }

                $scope.$apply();
                $scope.updateBackgroundSuggests(event.tags);
            } else if (event.landing_data) {
                $scope.data = event.landing_data;
            }
        }
    });

    if (!$scope.edit_mode) {
        $('[contenteditable]').prop('contenteditable', 'false');
    }

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

    });

    $('.board-settings-btn.main-btn').on('click', function () {
        $('.board-menu.open .panel-close').click();
        var $panel = $('#' + $(this).data('panel-id'));
        $panel.addClass('open').animate({'right': '0'})
    });

    $('.board-settings-btn.gallery-btn').on('click', function () {
        $('.board-menu.open .panel-close').click();
        var $panel = $('#' + $(this).data('panel-id'));
        $panel.addClass('open').animate({'right': '0'})
    });

    $('.main-settings-btn').on('click', function () {
        $('.board-menu.open .panel-close').click();
        var $panel = $('#' + $(this).data('panel-id'));
        $panel.addClass('open').animate({'left': '0'})
    });


});