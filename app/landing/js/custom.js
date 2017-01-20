/********************************** 
   Author: Symbiotic-Themes
   Theme: Chappi (App Landingpage)
   Version: 1.0.1  
**********************************/



      // Preloader Website
      $(window).load(function() { 
         $('#loader-wrapper').delay(450).fadeOut(); 
         $('#loader').delay(750).fadeOut('slow');
      });

$(document).ready(function() {     
    

      // Sticky Navabr
      $("header").before($(".top-bar").clone().addClass("slidedown"));
      $(window).on("scroll", function () {
         $("body").toggleClass("slide-menu", ($(window).scrollTop() > 600));
      });
      
      
      //--------------------------------------------

      
      // One Page Navigation	   
	    $.scrollIt({	   
	      scrollTime: 1400,
	      easing: 'easeInOutExpo',
	      topOffset: -20,
	    });
      
      
      //--------------------------------------------
      
      
      // Phone Carousel            
      var mySwiper = $('.swiper-container').swiper({
      
         mode:'horizontal',
         loop: true,
         speed: 950,
         effect: 'coverflow',
         slidesPerView: getSlide(),
         grabCursor: true,
         nextButton: '.arrow-right',
         prevButton: '.arrow-left',
         coverflow: {
              rotate: -30,
              stretch: 10,
              depth: 120,
              modifier: 1,
              slideShadows: false
          }
         
      });    
      
      // Set number of slide based on device width
      $(window).resize(function() {
           var wW = $(window).width();
           if (wW < 601) {
               mySwiper.params.slidesPerView = 1;
           } else {
               mySwiper.params.slidesPerView = 3;
           }
           //mySwiper.reInit();
      });
      
      
      //-----------------------------------------------
      
      
      // Intro Carousel
      $("#carousel").owlCarousel({
         items: 3,
         itemsDesktop: [1199,3],
         itemsDesktopSmall: [991,2],
         slideSpeed: 800,
         navigation: true,
         navigationText: ["<i class='fa fa-angle-left'></i>","<i class='fa fa-angle-right'></i>"],
         pagination: true,
      });
      
      // Gallery Carousel
      $("#carousel-gallery").owlCarousel({
         items: 4,
         itemsDesktop: [1199,4],
         itemsDesktopSmall: [991,3],
         itemsTablet: [768,3],
         slideSpeed: 800,
         navigation: true,
         navigationText: ["<i class='fa fa-angle-left'></i>","<i class='fa fa-angle-right'></i>"],
         pagination: true,
      });
      
      // Testimonials Carousel
      $("#testi-carousel").owlCarousel({
         items: 1,
         itemsDesktop: [1199,1],
         itemsDesktopSmall: [991,1],
         itemsTablet: [768,1],
         slideSpeed: 800,
         navigation: true,
         navigationText: ["<i class='fa fa-angle-left'></i>","<i class='fa fa-angle-right'></i>"],
         pagination: true,
         autoHeight: true,
      });
      
      //-----------------------------------------------
      
      
      // Tooltip
      $('[data-toggle="tooltip"]').tooltip()
      
      
      //-----------------------------------------------
      
      
      // Gallery 
      $('#carousel-gallery').magnificPopup({
        delegate: 'a', 
        type: 'image',
        gallery:{
          enabled:true
        }
      });
      
      
      //----------------------------------------------
      
      
      // Animation on Scroll
      var wow = new WOW(
        {
          boxClass:     'wow',      // animated element css class (default is wow)
          animateClass: 'animated', // animation css class (default is animated)
          offset:       0,          // distance to the element when triggering the animation (default is 0)
          mobile:       false,       // trigger animations on mobile devices (default is true)
          live:         false        // act on asynchronously loaded content (default is true)
        }
      );
      wow.init();
      
      
      //----------------------------------------------
      
      
      // Parallax
      $.stellar({
         horizontalOffset: 0,
         verticalOffset: 0,
         responsive: false,
         horizontalScrolling: false,
      });     
      
      
      //----------------------------------------------
      
      
      // Mailchimp 
      $('#subscribe-btn').on('click', function(){
          var email = $('#mc-email').val()
          if (!isValidEmailAddress(email)) {
              $(".subscribe.contact-message").stop(true).html('<i class="fa fa-warning"></i> E-mail адрес неправильный.').css("color","#ef4b4b");
              $("input#mc-email").focus().addClass("error");
          }else{
              $(".subscribe.contact-message").html('<i class="fa fa-check"></i> Спасибо! Мы будем держать Вас в курсе').css("color","#29b94f");
              socket.emit('utils.feedback', {
                  type: 'subscribe',
                  email: email
              });
          }

      });
      
      //---------------------------------------------
      
      
      // Particles
      $('.particles header').particleground({
          dotColor: '#fff',
          lineColor: '#fff'
      });
      
      
      //----------------------------------------------
      
      
      // Mobile Navi Click
      $('nav a').on('click', function(){ 
       if($('.navbar-toggle').css('display') !='none'){
           $(".navbar-toggle").trigger( "click" );
       }
      });
      
      
      //----------------------------------------------
      
      
      // Scroll Up
      $('.scrollup, .logo a').click(function(){
          $("html, body").animate({ scrollTop: 0 }, 1200, 'easeInOutExpo');
          return false;
      });
      
      
      //----------------------------------------------      
      
      
      // Contact Form
      $("#contactform").submit(function(event) {
          
           $("#contactform").find(".input-field").removeClass("error");

           event.preventDefault();
           event.stopImmediatePropagation();

           var name = $("#contactname").val();
           var email = $("#contactemail").val();
           var message = $("#contactmessage").val();
           var organizationname = $("#organizationname").val();

           if (name == "") {
               $(".feebdack.contact-message").stop(true).html('<i class="fa fa-warning"></i> Все поля обязательны.').css("color","#ef4b4b");
               $("input#contactname").focus().addClass("error");
           } else if( email == ""){
               $(".feebdack.contact-message").stop(true).html('<i class="fa fa-warning"></i> Все поля обязательны.').css("color","#ef4b4b");
               $("input#contactemail").focus().addClass("error");
           } else if (!isValidEmailAddress(email)) {
               $(".feebdack.contact-message").stop(true).html('<i class="fa fa-warning"></i> E-mail адрес неправильный.').css("color","#ef4b4b");
               $("input#contactemail").focus().addClass("error");
           } else if( message == ""){
               $(".feebdack.contact-message").stop(true).html('<i class="fa fa-warning"></i> Все поля обязательны.').css("color","#ef4b4b");
               $("textarea#contactmessage").focus().addClass("error");
           } else {
               socket.emit('utils.feedback', {
                   'contactEmail': email,
                   'organization': organizationname,
                   'type': 'organization',
                   'contactName': name,
                   'contactMessage': message
               });
               $(".feebdack.contact-message").html('<i class="fa fa-check"></i> Спасибо за ваше сообщение!').css("color","#29b94f");
               $('#contactname').val('');
               $('#contactemail').val('');
               $('#contactmessage').val('');
               $('#organizationname').val('');
           }
      });

       
      
 
});

// E-mail validation
function isValidEmailAddress(emailAddress) {
  var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
  return pattern.test(emailAddress);
}

// Phone Slider Function
function getSlide() {
    var wW = $(window).width();
    if (wW < 601) {
        return 1;
    }
    return 3;
}
