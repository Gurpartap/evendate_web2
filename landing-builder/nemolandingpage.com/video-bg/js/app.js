var __app = angular.module('LandingApp', ['ngFileUpload', 'gridster']);

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}


__app.controller('WholeWorldController', function ($scope) {


    $scope.data = {
        main_description: '17 - 19 декабря в Москве соберутся представители event индустрии, чтобы поделиться друг с другом опытом и рассказать, как же зарабатывать больше на своих событиях с помощью платформы Evendate. Кроме продажи билетов за биткоины мы теперь даже умеем генерировать лендинги для событий, где в принципе больше уже ничего не надо.',
        header: {
            title: 'Узнай будущее event индустрии от тех, кто уже в будущем',
            subtitle: 'Продавай больше билетов с Evendate',
            location_addresses: '17 - 19 декабря, 2017, Москва, Сколково',
            description: ''
        },
        speakers: {
            title: 'Спикеры',
            subtitle: 'Только лидеры индустрии, только самые крутые разработчики (все из Evendate) и самые крутые event-менеджеры.',
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
                    },
                    onDropComplete: function (index, obj, evt) {
                        console.log(index, obj, evt);
                    },
                    onDragComplete: function (index, obj, evt) {
                        console.log(index, obj, evt);
                    }
                };
                setTimeout(function () {
                    updateHeroTabs()
                }, 200);
            },
            enabled: true,
            gridOptions: {
                columns: 4, // the width of the grid, in columns
                pushing: true, // whether to push other items out of the way on move or resize
                floating: true, // whether to automatically float items up so they stack (you can temporarily disable if you are adding unsorted items with ng-repeat)
                swapping: false, // whether or not to have items of the same size switch places instead of pushing down if they are the same size
                width: 'auto', // can be an integer or 'auto'. 'auto' scales gridster to be the full width of its containing element
                colWidth: 'auto', // can be an integer or 'auto'.  'auto' uses the pixel width of the element divided by 'columns'
                rowHeight: '600', // can be an integer or 'match'.  Match uses the colWidth, giving you square widgets.
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
                    handle: '.drag-icon', // optional selector for drag handle
                    start: function (event, $element, widget) {
                        console.log(event, $element, widget)
                    }, // optional callback fired when drag is started,
                    drag: function (event, $element, widget) {
                        console.log(event, $element, widget)
                    }, // optional callback fired when item is moved,
                    stop: function (event, $element, widget) {
                        console.log(event, $element, widget)
                    } // optional callback fired when item is finished dragging
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
                        this.items[item_uuid] = {
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
            itemsGridOtions:{
                columns: 1,
                rowHeight: '200', // can be an integer or 'match'.  Match uses the colWidth, giving you square widgets.
                pushing: true, // whether to push other items out of the way on move or resize
                floating: true, // whether to automatically float items up so they stack (you can temporarily disable if you are adding unsorted items with ng-repeat)
                swapping: false, // whether or not to have items of the same size switch places instead of pushing down if they are the same size
                width: 'auto', // can be an integer or 'auto'. 'auto' scales gridster to be the full width of its containing element
                colWidth: 'auto', // can be an integer or 'auto'.  'auto' uses the pixel width of the element divided by 'columns'
                margins: [80, 10], // the pixel distance between each widget
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
                    handle: '.drag-icon', // optional selector for drag handle
                    start: function (event, $element, widget) {
                        console.log(event, $element, widget)
                    }, // optional callback fired when drag is started,
                    drag: function (event, $element, widget) {
                        console.log(event, $element, widget)
                    }, // optional callback fired when item is moved,
                    stop: function (event, $element, widget) {
                        console.log(event, $element, widget)
                    } // optional callback fired when item is finished dragging
                }

            },
            gridOptions: {
                columns: 5, // the width of the grid, in columns
                pushing: true, // whether to push other items out of the way on move or resize
                floating: true, // whether to automatically float items up so they stack (you can temporarily disable if you are adding unsorted items with ng-repeat)
                swapping: false, // whether or not to have items of the same size switch places instead of pushing down if they are the same size
                width: 'auto', // can be an integer or 'auto'. 'auto' scales gridster to be the full width of its containing element
                colWidth: 'auto', // can be an integer or 'auto'.  'auto' uses the pixel width of the element divided by 'columns'
                rowHeight: '85', // can be an integer or 'match'.  Match uses the colWidth, giving you square widgets.
                margins: [80, 10], // the pixel distance between each widget
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
                    handle: '.drag-icon', // optional selector for drag handle
                    start: function (event, $element, widget) {
                        console.log(event, $element, widget)
                    }, // optional callback fired when drag is started,
                    drag: function (event, $element, widget) {
                        console.log(event, $element, widget)
                    }, // optional callback fired when item is moved,
                    stop: function (event, $element, widget) {
                        console.log(event, $element, widget)
                    } // optional callback fired when item is finished dragging
                }
            }
        },
        testimonials: {
            title: 'Отзывы',
            subtitle: 'Добавляйте отзывы ваших клиентов и их фотографии, например',
            items: [],
            addItem: function () {
                this.items.push({
                    text: 'Отзыв',
                    name: 'Имя',
                    image: './images/default.jpg',
                    details: 'Компания',
                    uuid: guid()
                })
            }
        },
        gallery: {
            title: 'Галлерея',
            subtitle: 'Добавляйте фотографии за прошлые года или фотографии помещений',
            items: [],
            addItem: function () {

            }

        },
        tickets: {
            enabled: true
        },
        sponsors: {
            title: 'Галлерея',
            become_a_sponsor: 'Стать партнером',
            become_a_sponsor_enabled: true
        },
        faq: {
            title: 'FAQ',
            subtitle: 'Ответы на часто задаваемые вопросы',
            items: [],
            addItem: function () {
                this.items.push({
                    question: 'Вопрос?',
                    answer: 'Ответ на вопрос.',
                    uuid: guid()
                });
            }

        },
        map: {},
    };
    $scope.setGlobalColor = function (val) {
        console.log(val);
    }
});


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
