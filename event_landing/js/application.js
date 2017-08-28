$(document).ready(function () {
    "use strict";

    /******************** NAVBAR ********************/
    var animationProp = $('.navbar-nemo'); //Navbar wraper

    if (matchMedia('only screen and (min-width: 768px)').matches && animationProp.hasClass('navbar-transparent')) {
        var scrollPos = $(this).scrollTop(),
            animationEndPos = 150, //At the point background add
            logo = animationProp.find('.navbar-brand img');

        //if visitor refresh on the middle of the document
        if (scrollPos > animationEndPos) {
            animationProp.removeClass('navbar-transparent');
            logo.attr('src', 'images/logo-alt.png');
        }

        //toggle existing class
        $(document).scroll(function () {
            scrollPos = $(this).scrollTop();

            if (scrollPos > animationEndPos) {
                animationProp.removeClass('navbar-transparent');

                //change logo into black
                logo.attr('src', 'images/logo-alt.png');
            } else {
                animationProp.addClass('navbar-transparent');

                //change logo into base
                logo.attr('src', 'images/logo.png');

            }
        });
    }


    /******************** BACKGROUND VIDEO ********************/
    var vidContainer1 = document.querySelector(".video-player");
    var vidContainer2 = document.querySelector(".the-video-2");

    if (vidContainer1 != null) {
        var vid = vidContainer1.querySelector("video");
        var pauseButton = vidContainer1.querySelector("button");

        vid.addEventListener('ended', function () {
            // only functional if "loop" is removed
            vid.pause();
            // to capture IE10
            // vidFade();
        });

        pauseButton.addEventListener("click", function () {
            if (vid.paused) {
                vid.play();
                $(pauseButton).animate({'bottom': '50px', 'opacity': '0.5'});
                $(pauseButton).find('.play').removeClass('active');
                $(pauseButton).find('.pause').addClass('active');

            } else {
                vid.pause();
                $(pauseButton).animate({'bottom': '50%', 'opacity': '1'});
                $(pauseButton).find('.pause').removeClass('active');
                $(pauseButton).find('.play').addClass('active');
            }
        });
    }

    if (vidContainer2 != null) {
        var vid = vidContainer2.querySelector("video");
        var pauseButton = vidContainer2.querySelector("button");

        vid.addEventListener('ended', function () {
            // only functional if "loop" is removed
            vid.pause();
            // to capture IE10
            // vidFade();
        });

        pauseButton.addEventListener("click", function () {
            if (vid.paused) {
                vid.play();
                $(vidContainer2).addClass('playing');
                $(pauseButton).find('.play').removeClass('active');
                $(pauseButton).find('.pause').addClass('active');

            } else {
                vid.pause();
                $(vidContainer2).removeClass('playing');
                $(pauseButton).animate({'bottom': '50%', 'opacity': '1'});
                $(pauseButton).find('.pause').removeClass('active');
                $(pauseButton).find('.play').addClass('active');
            }
        });
    }


    /******************** NAVBAR APPEAR ON SCROLL ********************/
    if (animationProp.hasClass('appear-onscroll')) {
        $(document).scroll(function () {
            var scrollPos = $(this).scrollTop();

            if (scrollPos > 150) {
                animationProp.removeClass('appear-onscroll');
            } else {
                animationProp.addClass('appear-onscroll');
            }
        });
    }


    /******************** ONE PAGE NAVIGATION ********************/
    $('.navbar-nav').onePageNav({
        currentClass: 'active',
        scrollOffset: 74
    });


    /******************** NAVBAR COLLAPSE ON CLICK ********************/
    $('.navbar-nav').on('click', 'a', function (event) {
        /* Act on the event */
        $('.navbar-collapse').collapse('hide');
    });


    /******************** SCREENSHOTS SWIPER ********************/
    var screenShot_1 = new Swiper('#screenshot-1-swiper', {
        autoplay: 3000,
        slidesPerView: 5,
        loop: true,
        centeredSlides: true,
        paginationClickable: true,
        spaceBetween: 15,
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
        pagination: '.swiper-pagination',
        breakpoints: {
            991: {
                slidesPerView: 3
            },

            480: {
                slidesPerView: 1
            }
        }
    });

    /******************** FEATURES SWIPER ********************/
    var features_4 = new Swiper('#features-swiper', {
        autoplay: 3000,
        slidesPerView: 1,
        width: 240,
        loop: true,
        paginationClickable: true,
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
        pagination: '.swiper-pagination'
    });

    /* Click on feature-side-content
     ----------------------------------------------------------------------------- */
    $('.feature-side-content[data-swiper-slide-to]').on('click', function () {
        var el = $(this),
            swipToSlide = el.attr('data-swiper-slide-to');
        $('.feature-side-content.active').removeClass('active');
        el.addClass('active');
        $('#features-swiper')[0].swiper.slideTo(swipToSlide, 500, false);
    });

    /* When slider swipe
     ----------------------------------------------------------------------------- */
    if ($('#features-swiper').length) {
        $('#features-swiper')[0].swiper.on('slideChangeStart', function () {
            var slideIndex = $('#features-swiper')[0].swiper.activeIndex;
            $('.feature-side-content.active').removeClass('active');
            $('.feature-side-content[data-swiper-slide-to="' + slideIndex + '"]').addClass('active');
            if (slideIndex > $('.feature-side-content[data-swiper-slide-to]').length) {
                $('.feature-side-content[data-swiper-slide-to="1"]').addClass('active');
            } else if (slideIndex < 1) {
                $('.feature-side-content[data-swiper-slide-to="' + $('.feature-side-content[data-swiper-slide-to]').length + '"]').addClass('active');
            }
        });
    }


    /******************** TESTIMONIALS ********************/
    var testimonials_1 = new Swiper('.testimonials-1 .testimonials-content', {
        slidesPerView: 1,
        autoplay: 3000,
        slideToClickedSlide: true
    });

    var testimonialsThumb = new Swiper('.testimonials-1 .testimonials-thumb', {
        slidesPerView: 5,
        centeredSlides: true,
        slideToClickedSlide: true,
        slideActiveClass: 'active'
    });

    testimonials_1.params.control = testimonialsThumb;
    testimonialsThumb.params.control = testimonials_1;


    var testimonials_2 = new Swiper('.testimonials-2 .testimonials-content', {
        slidesPerView: 1,
        autoplay: 3000,
        loop: true,
        slideToClickedSlide: true
    });


    /******************** COURSE SLIDER ********************/
    var ourCourse = new Swiper('.course-description .swiper-container', {
        slidesPerView: 3,
        spaceBetween: 30,
        pagination: '.swiper-pagination',
        autoplay: 3000,
        breakpoints: {
            991: {
                slidesPerView: 2
            },

            767: {
                slidesPerView: 1,
                spaceBetween: 15
            }
        }
    });


    /******************** LIGHTBOX ********************/
    $('.lightbox').nivoLightbox();


    /******************** HERO TABS ********************/
    window.updateHeroTabs = function () {
        var bioWidth = $('.container').width();

        $('.hero-tabs .speakers-bio').css('width', bioWidth);

        $('.hero-tabs li [data-target]').off('click').on('click', function (event) {
            event.preventDefault();
            /* Act on the event */

            var loadTarget = $(this).data('target');

            $('.hero-tabs li').removeClass('active');
            $('.hero-tabs .icon-collapsed .svg-icon-minus-06').removeClass('active');
            $('.hero-tabs .icon-collapsed .svg-icon-plus').addClass('active');
            $('.speakers-bio').hide();

            $(this).closest('li').addClass('active');
            $(this).find('.icon-collapsed .svg-icon-plus').removeClass('active');
            $(this).find('.icon-collapsed .svg-icon-minus-06').addClass('active');
            $(loadTarget).fadeIn();
        });
    };
    updateHeroTabs();


// Function for email address validation
    function validateEmail(email) {
        var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
        return re.test(email);
    }


    /*
     |----------------------------------------------------------------------------
     | SUBSCRIBE OR CONTACT FORMS
     |----------------------------------------------------------------------------
     */

    $('.submit-form-popup').on('click', function (event) {
        $(this).fadeOut(300);
    });


    /******************** FIT VIDEO WIDTH ********************/
    $('.video-player').fitVids();


    /******************** PHOTOGRAPHY PORTFOLIO ********************/
    $('#photography-portfolio').mixItUp();


    /******************** FOOD ORDER PROCESS ********************/

});

function searchToObject() {
    var pairs = window.location.search.substring(1).split("&"),
        obj = {},
        pair,
        i;

    for (i in pairs) {
        if (pairs.hasOwnProperty(i)) {
            if (pairs[i] === "") continue;

            pair = pairs[i].split("=");
            obj[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
        }
    }

    //if url with alis, not event_id
    if (!obj.id) {
        obj.id = window.event_id;
    }

    return obj;
}

/******************** GOOGLE MAP ********************/
function initMapBig(data) {
    var where = {lat: data.latitude, lng: data.longitude};


    function initMap() {

        var map = new google.maps.Map(document.getElementById('mapBig'), {
            zoom: 17,
            center: where,
            scrollwheel: false
        });

        var contentString = '<div class="map-info-window">' +
            '<h3 id="edit3" class="title-text">' + data.title + '</h3>' +
            '<address>' +
            '<p id="edit1">' + data.location + '</p>' +
            '</address>' +
            '</div>';

        var infowindow = new google.maps.InfoWindow({
            content: contentString,
            maxWidth: 318,
            borderRadius: 4,
            backgroundColor: '#ffffff',
            hideCloseButton: true,
            borderWidth: 0,
            shadowStyle: 0,
            disableAutoPan: false
        });

        var marker = new google.maps.Marker({
            position: where,
            map: map,
            title: data.title
        });

        marker.addListener('click', function () {
            infowindow.open(map, marker);
        });
        infowindow.open(map, marker);
    }

    if (data.latitude == null || data.longitude == null) {
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({'address': data.location}, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (status != google.maps.GeocoderStatus.ZERO_RESULTS) {
                    where = results[0].geometry.location;
                    initMap();
                } else {
                    console.log("No results found");
                }
            } else {
                console.log("Geocode was not successful for the following reason: " + status);
            }
        });
    } else {
        initMap();
    }
};
