var __app = angular.module('LandingApp', ['ngFileUpload']);

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}


__app.controller('HeaderController', function ($scope) {
    $scope.title = 'Learn About the Future of the Design Industry from Experts';
    $scope.subtitle = 'Conference for Designers';
    $scope.location_addresses = '17 - 19 December, 2015 in Sylhet, BD';
    $scope.description = 'Freemium pitch hypotheses success learning curve hackathon pivot growth hacking branding interaction design agile development iPhone. Analytics client partnership deployment startup. Alpha seed round gen-z client. Termsheet user experience.';

})
    .controller('SpeakersController', ['$scope', 'Upload', '$timeout', function ($scope, Upload, $timeout) {
        $scope.title = 'Speakers';
        $scope.subtitle = 'Use story ideate thought leader thought leader physical computing user centered design viral ship it earned media';
        $scope.rows = [];
        $scope.addRow = function () {
            $scope.rows.push({
                items: [],
                addItem: function () {
                    this.items.push({
                        name: 'Имя',
                        company_name: 'Название компании',
                        description: 'Описание',
                        image: './images/default.jpg',
                        uuid: guid()
                    });
                    setTimeout(function(){
                        updateHeroTabs()
                    }, 200);
                }
            });
        };

        $scope.addRow();
        setInterval(function () {
            console.log($scope.items);
        }, 1500);
    }])
    .controller('ScheduleController', function ($scope) {
        $scope.title = 'Schedule';
        $scope.subtitle = 'User story ideate thought leader thought leader physical computing user centered design viral ship it earned media';
        $scope.days = [];
        $scope.addDay = function ($event) {
            $scope.days.push({
                name: 'Введите название',
                items: [],
                uuid: guid(),
                addItem: function(){
                    this.items.push({
                        time: '00:00',
                        text_1 : 'Пример',
                        text_2 : 'Пример',
                        title : 'Заголовок',
                        description : '',
                        uuid: guid()
                    });
                }
            });
            $('.days-tab-link:last').click();
            $event.preventDefault();

        }
    })
    .controller('TestimonialsController', function ($scope) {
        $scope.title = 'Testimonials';
        $scope.subtitle = 'User story ideate thought leader thought leader physical computing user centered design viral ship it earned media';
        $scope.days = [
            {}
        ];
        $scope.addDay = function (data) {
            $scope.items.push({
                name: data.name,
                company_name: data.company_name,
                description: data.description,
                image: data.image
            })
        }
    })
    .controller('GalleryController', function ($scope) {
        $scope.title = 'Last Year Recap';
        $scope.subtitle = 'User story ideate thought leader thought leader physical computing user centered design viral ship it earned media';
        $scope.images = [
            {}
        ];
        $scope.addDay = function (data) {
            $scope.items.push({
                name: data.name,
                company_name: data.company_name,
                description: data.description,
                image: data.image
            })
        }
    })
    .controller('SponsorsController', function ($scope) {
        $scope.title = 'Our Sponsors';
        $scope.subtitle = 'User story ideate thought leader thought leader physical computing user centered design viral ship it earned media';
        $scope.images = [
            {}
        ];
        $scope.addDay = function (data) {
            $scope.items.push({
                name: data.name,
                company_name: data.company_name,
                description: data.description,
                image: data.image
            })
        }
    })
    .controller('FAQController', function ($scope) {
        $scope.title = 'FAQs';
        $scope.subtitle = 'User story ideate thought leader thought leader physical computing user centered design viral ship it earned media';
        $scope.images = [
            {}
        ];
        $scope.addDay = function (data) {
            $scope.items.push({
                name: data.name,
                company_name: data.company_name,
                description: data.description,
                image: data.image
            })
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
