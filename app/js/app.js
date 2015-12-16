/*!
 * 
 * Angle - Bootstrap Admin App + jQuery
 * 
 * Author: @themicon_co
 * Website: http://themicon.co
 * License: http://support.wrapbootstrap.com/knowledge_base/topics/usage-licenses
 * 
 */


(function(window, document, $, undefined){

  if (typeof $ === 'undefined') { throw new Error('This application\'s JavaScript requires jQuery'); }

  $(function(){

    // Restore body classes
    // ----------------------------------- 
    var $body = $('body');
    
    // enable settings toggle after restore
    $('#chk-fixed').prop('checked', $body.hasClass('layout-fixed') );
    $('#chk-collapsed').prop('checked', $body.hasClass('aside-collapsed') );
    $('#chk-boxed').prop('checked', $body.hasClass('layout-boxed') );
    $('#chk-float').prop('checked', $body.hasClass('aside-float') );
    $('#chk-hover').prop('checked', $body.hasClass('aside-hover') );


  }); // doc ready


})(window, document, window.jQuery);

// Start Bootstrap JS
// ----------------------------------- 

(function(window, document, $, undefined){

  $(function(){

    // POPOVER
    // ----------------------------------- 

    $('[data-toggle="popover"]').popover();

    // TOOLTIP
    // ----------------------------------- 

    $('[data-toggle="tooltip"]').tooltip({
      container: 'body'
    });

    // DROPDOWN INPUTS
    // ----------------------------------- 
    $('.dropdown input').on('click focus', function(event){
      event.stopPropagation();
    });

  });

})(window, document, window.jQuery);

// Custom jQuery
// ----------------------------------- 

// Start Bootstrap JS
// ----------------------------------- 

(function(window, document, $, undefined){

  $(function(){

    if ( typeof Chart === 'undefined' ) return;

    // random values for demo
    var rFactor = function(){ return Math.round(Math.random()*100); };


  // Line chart
  // ----------------------------------- 

    var lineData = {
        labels : ['January','February','March','April','May','June','July'],
        datasets : [
          {
            label: 'My First dataset',
            fillColor : 'rgba(114,102,186,0.2)',
            strokeColor : 'rgba(114,102,186,1)',
            pointColor : 'rgba(114,102,186,1)',
            pointStrokeColor : '#fff',
            pointHighlightFill : '#fff',
            pointHighlightStroke : 'rgba(114,102,186,1)',
            data : [rFactor(),rFactor(),rFactor(),rFactor(),rFactor(),rFactor(),rFactor()]
          },
          {
            label: 'My Second dataset',
            fillColor : 'rgba(35,183,229,0.2)',
            strokeColor : 'rgba(35,183,229,1)',
            pointColor : 'rgba(35,183,229,1)',
            pointStrokeColor : '#fff',
            pointHighlightFill : '#fff',
            pointHighlightStroke : 'rgba(35,183,229,1)',
            data : [rFactor(),rFactor(),rFactor(),rFactor(),rFactor(),rFactor(),rFactor()]
          }
        ]
      };


    var lineOptions = {
      scaleShowGridLines : true,
      scaleGridLineColor : 'rgba(0,0,0,.05)',
      scaleGridLineWidth : 1,
      bezierCurve : true,
      bezierCurveTension : 0.4,
      pointDot : true,
      pointDotRadius : 4,
      pointDotStrokeWidth : 1,
      pointHitDetectionRadius : 20,
      datasetStroke : true,
      datasetStrokeWidth : 2,
      datasetFill: true,
      responsive: true
    };

    var linectx = document.getElementById("chartjs-linechart").getContext("2d");
    var lineChart = new Chart(linectx).Line(lineData, lineOptions);

  // Bar chart
  // ----------------------------------- 

    var barData = {
        labels : ['January','February','March','April','May','June','July'],
        datasets : [
          {
            fillColor : '#23b7e5',
            strokeColor : '#23b7e5',
            highlightFill: '#23b7e5',
            highlightStroke: '#23b7e5',
            data : [rFactor(),rFactor(),rFactor(),rFactor(),rFactor(),rFactor(),rFactor()]
          },
          {
            fillColor : '#5d9cec',
            strokeColor : '#5d9cec',
            highlightFill : '#5d9cec',
            highlightStroke : '#5d9cec',
            data : [rFactor(),rFactor(),rFactor(),rFactor(),rFactor(),rFactor(),rFactor()]
          }
        ]
    };
    
    var barOptions = {
      scaleBeginAtZero : true,
      scaleShowGridLines : true,
      scaleGridLineColor : 'rgba(0,0,0,.05)',
      scaleGridLineWidth : 1,
      barShowStroke : true,
      barStrokeWidth : 2,
      barValueSpacing : 5,
      barDatasetSpacing : 1,
      responsive: true
    };

    var barctx = document.getElementById("chartjs-barchart").getContext("2d");
    var barChart = new Chart(barctx).Bar(barData, barOptions);

  //  Doughnut chart
  // ----------------------------------- 
    
    var doughnutData = [
          {
            value: 300,
            color: '#7266ba',
            highlight: '#7266ba',
            label: 'Purple'
          },
          {
            value: 50,
            color: '#23b7e5',
            highlight: '#23b7e5',
            label: 'Info'
          },
          {
            value: 100,
            color: '#fad732',
            highlight: '#fad732',
            label: 'Yellow'
          }
        ];

    var doughnutOptions = {
      segmentShowStroke : true,
      segmentStrokeColor : '#fff',
      segmentStrokeWidth : 2,
      percentageInnerCutout : 85,
      animationSteps : 100,
      animationEasing : 'easeOutBounce',
      animateRotate : true,
      animateScale : false,
      responsive: true
    };

    var doughnutctx = document.getElementById("chartjs-doughnutchart").getContext("2d");
    var doughnutChart = new Chart(doughnutctx).Doughnut(doughnutData, doughnutOptions);

  // Pie chart
  // ----------------------------------- 

    var pieData =[
          {
            value: 300,
            color: '#7266ba',
            highlight: '#7266ba',
            label: 'Purple'
          },
          {
            value: 40,
            color: '#fad732',
            highlight: '#fad732',
            label: 'Yellow'
          },
          {
            value: 120,
            color: '#23b7e5',
            highlight: '#23b7e5',
            label: 'Info'
          }
        ];

    var pieOptions = {
      segmentShowStroke : true,
      segmentStrokeColor : '#fff',
      segmentStrokeWidth : 2,
      percentageInnerCutout : 0, // Setting this to zero convert a doughnut into a Pie
      animationSteps : 100,
      animationEasing : 'easeOutBounce',
      animateRotate : true,
      animateScale : false,
      responsive: true
    };

    var piectx = document.getElementById("chartjs-piechart").getContext("2d");
    var pieChart = new Chart(piectx).Pie(pieData, pieOptions);

  // Polar chart
  // ----------------------------------- 
    
    var polarData = [
          {
            value: 300,
            color: '#f532e5',
            highlight: '#f532e5',
            label: 'Red'
          },
          {
            value: 50,
            color: '#7266ba',
            highlight: '#7266ba',
            label: 'Green'
          },
          {
            value: 100,
            color: '#f532e5',
            highlight: '#f532e5',
            label: 'Yellow'
          },
          {
            value: 140,
            color: '#7266ba',
            highlight: '#7266ba',
            label: 'Grey'
          },
        ];

    var polarOptions = {
      scaleShowLabelBackdrop : true,
      scaleBackdropColor : 'rgba(255,255,255,0.75)',
      scaleBeginAtZero : true,
      scaleBackdropPaddingY : 1,
      scaleBackdropPaddingX : 1,
      scaleShowLine : true,
      segmentShowStroke : true,
      segmentStrokeColor : '#fff',
      segmentStrokeWidth : 2,
      animationSteps : 100,
      animationEasing : 'easeOutBounce',
      animateRotate : true,
      animateScale : false,
      responsive: true
    };

    var polarctx = document.getElementById("chartjs-polarchart").getContext("2d");
    var polarChart = new Chart(polarctx).PolarArea(polarData, polarOptions);

  // Radar chart
  // ----------------------------------- 

    var radarData = {
      labels: ['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding', 'Cycling', 'Running'],
      datasets: [
        {
          label: 'My First dataset',
          fillColor: 'rgba(114,102,186,0.2)',
          strokeColor: 'rgba(114,102,186,1)',
          pointColor: 'rgba(114,102,186,1)',
          pointStrokeColor: '#fff',
          pointHighlightFill: '#fff',
          pointHighlightStroke: 'rgba(114,102,186,1)',
          data: [65,59,90,81,56,55,40]
        },
        {
          label: 'My Second dataset',
          fillColor: 'rgba(151,187,205,0.2)',
          strokeColor: 'rgba(151,187,205,1)',
          pointColor: 'rgba(151,187,205,1)',
          pointStrokeColor: '#fff',
          pointHighlightFill: '#fff',
          pointHighlightStroke: 'rgba(151,187,205,1)',
          data: [28,48,40,19,96,27,100]
        }
      ]
    };

    var radarOptions = {
      scaleShowLine : true,
      angleShowLineOut : true,
      scaleShowLabels : false,
      scaleBeginAtZero : true,
      angleLineColor : 'rgba(0,0,0,.1)',
      angleLineWidth : 1,
      pointLabelFontFamily : "'Arial'",
      pointLabelFontStyle : 'bold',
      pointLabelFontSize : 10,
      pointLabelFontColor : '#565656',
      pointDot : true,
      pointDotRadius : 3,
      pointDotStrokeWidth : 1,
      pointHitDetectionRadius : 20,
      datasetStroke : true,
      datasetStrokeWidth : 2,
      datasetFill : true,
      responsive: true
    };

    var radarctx = document.getElementById("chartjs-radarchart").getContext("2d");
    var radarChart = new Chart(radarctx).Radar(radarData, radarOptions);

  });

})(window, document, window.jQuery);

// Chartist
// ----------------------------------- 

(function(window, document, $, undefined){

  $(function(){

    if ( typeof Chartist === 'undefined' ) return;

    // Bar bipolar
    // ----------------------------------- 
    var data1 = {
      labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10'],
      series: [
        [1, 2, 4, 8, 6, -2, -1, -4, -6, -2]
      ]
    };

    var options1 = {
      high: 10,
      low: -10,
      height: 280,
      axisX: {
        labelInterpolationFnc: function(value, index) {
          return index % 2 === 0 ? value : null;
        }
      }
    };

    new Chartist.Bar('#ct-bar1', data1, options1);

    // Bar Horizontal
    // ----------------------------------- 
    new Chartist.Bar('#ct-bar2', {
      labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      series: [
        [5, 4, 3, 7, 5, 10, 3],
        [3, 2, 9, 5, 4, 6, 4]
      ]
    }, {
      seriesBarDistance: 10,
      reverseData: true,
      horizontalBars: true,
      height: 280,
      axisY: {
        offset: 70
      }
    });

    // Line
    // ----------------------------------- 
    new Chartist.Line('#ct-line1', {
      labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      series: [
        [12, 9, 7, 8, 5],
        [2, 1, 3.5, 7, 3],
        [1, 3, 4, 5, 6]
      ]
    }, {
      fullWidth: true,
      height: 280,
      chartPadding: {
        right: 40
      }
    });


    // SVG Animation
    // ----------------------------------- 

    var chart1 = new Chartist.Line('#ct-line3', {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      series: [
        [1, 5, 2, 5, 4, 3],
        [2, 3, 4, 8, 1, 2],
        [5, 4, 3, 2, 1, 0.5]
      ]
    }, {
      low: 0,
      showArea: true,
      showPoint: false,
      fullWidth: true,
      height: 300
    });

    chart1.on('draw', function(data) {
      if(data.type === 'line' || data.type === 'area') {
        data.element.animate({
          d: {
            begin: 2000 * data.index,
            dur: 2000,
            from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
            to: data.path.clone().stringify(),
            easing: Chartist.Svg.Easing.easeOutQuint
          }
        });
      }
    });


    // Slim animation
    // ----------------------------------- 


    var chart = new Chartist.Line('#ct-line2', {
      labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
      series: [
        [12, 9, 7, 8, 5, 4, 6, 2, 3, 3, 4, 6],
        [4,  5, 3, 7, 3, 5, 5, 3, 4, 4, 5, 5],
        [5,  3, 4, 5, 6, 3, 3, 4, 5, 6, 3, 4],
        [3,  4, 5, 6, 7, 6, 4, 5, 6, 7, 6, 3]
      ]
    }, {
      low: 0,
      height: 300
    });

    // Let's put a sequence number aside so we can use it in the event callbacks
    var seq = 0,
      delays = 80,
      durations = 500;

    // Once the chart is fully created we reset the sequence
    chart.on('created', function() {
      seq = 0;
    });

    // On each drawn element by Chartist we use the Chartist.Svg API to trigger SMIL animations
    chart.on('draw', function(data) {
      seq++;

      if(data.type === 'line') {
        // If the drawn element is a line we do a simple opacity fade in. This could also be achieved using CSS3 animations.
        data.element.animate({
          opacity: {
            // The delay when we like to start the animation
            begin: seq * delays + 1000,
            // Duration of the animation
            dur: durations,
            // The value where the animation should start
            from: 0,
            // The value where it should end
            to: 1
          }
        });
      } else if(data.type === 'label' && data.axis === 'x') {
        data.element.animate({
          y: {
            begin: seq * delays,
            dur: durations,
            from: data.y + 100,
            to: data.y,
            // We can specify an easing function from Chartist.Svg.Easing
            easing: 'easeOutQuart'
          }
        });
      } else if(data.type === 'label' && data.axis === 'y') {
        data.element.animate({
          x: {
            begin: seq * delays,
            dur: durations,
            from: data.x - 100,
            to: data.x,
            easing: 'easeOutQuart'
          }
        });
      } else if(data.type === 'point') {
        data.element.animate({
          x1: {
            begin: seq * delays,
            dur: durations,
            from: data.x - 10,
            to: data.x,
            easing: 'easeOutQuart'
          },
          x2: {
            begin: seq * delays,
            dur: durations,
            from: data.x - 10,
            to: data.x,
            easing: 'easeOutQuart'
          },
          opacity: {
            begin: seq * delays,
            dur: durations,
            from: 0,
            to: 1,
            easing: 'easeOutQuart'
          }
        });
      } else if(data.type === 'grid') {
        // Using data.axis we get x or y which we can use to construct our animation definition objects
        var pos1Animation = {
          begin: seq * delays,
          dur: durations,
          from: data[data.axis + '1'] - 30,
          to: data[data.axis + '1'],
          easing: 'easeOutQuart'
        };

        var pos2Animation = {
          begin: seq * delays,
          dur: durations,
          from: data[data.axis + '2'] - 100,
          to: data[data.axis + '2'],
          easing: 'easeOutQuart'
        };

        var animations = {};
        animations[data.axis + '1'] = pos1Animation;
        animations[data.axis + '2'] = pos2Animation;
        animations['opacity'] = {
          begin: seq * delays,
          dur: durations,
          from: 0,
          to: 1,
          easing: 'easeOutQuart'
        };

        data.element.animate(animations);
      }
    });

    // For the sake of the example we update the chart every time it's created with a delay of 10 seconds
    chart.on('created', function() {
      if(window.__exampleAnimateTimeout) {
        clearTimeout(window.__exampleAnimateTimeout);
        window.__exampleAnimateTimeout = null;
      }
      window.__exampleAnimateTimeout = setTimeout(chart.update.bind(chart), 12000);
    });



  });

})(window, document, window.jQuery);

// TRANSLATION
// ----------------------------------- 

(function(window, document, $, undefined){

  var preferredLang = 'en';
  var pathPrefix    = 'i18n'; // folder of json files
  var packName      = 'site';
  var storageKey    = 'jq-appLang';

  $(function(){

    if ( ! $.fn.localize ) return;

    // detect saved language or use default
    var currLang = $.localStorage.get(storageKey) || preferredLang;
    // set initial options
    var opts = {
        language: currLang,
        pathPrefix: pathPrefix,
        callback: function(data, defaultCallback){
          $.localStorage.set(storageKey, currLang); // save the language
          defaultCallback(data);
        }
      };

    // Set initial language
    setLanguage(opts);

    // Listen for changes
    $('[data-set-lang]').on('click', function(){

      currLang = $(this).data('setLang');

      if ( currLang ) {
        
        opts.language = currLang;

        setLanguage(opts);

        activateDropdown($(this));
      }

    });
    

    function setLanguage(options) {
      $("[data-localize]").localize(packName, options);
    }

    // Set the current clicked text as the active dropdown text
    function activateDropdown(elem) {
      var menu = elem.parents('.dropdown-menu');
      if ( menu.length ) {
        var toggle = menu.prev('button, a');
        toggle.text ( elem.text() );
      }
    }

  });

})(window, document, window.jQuery);


/**=========================================================
 * Module: notify.js
 * Create toggleable notifications that fade out automatically.
 * Based on Notify addon from UIKit (http://getuikit.com/docs/addons_notify.html)
 * [data-toggle="notify"]
 * [data-options="options in json format" ]
 =========================================================*/

(function($, window, document){
  'use strict';

  var Selector = '[data-notify]',
      autoloadSelector = '[data-onload]',
      doc = $(document);


  $(function() {

    $(Selector).each(function(){

      var $this  = $(this),
          onload = $this.data('onload');

      if(onload !== undefined) {
        setTimeout(function(){
          notifyNow($this);
        }, 800);
      }

      $this.on('click', function (e) {
        e.preventDefault();
        notifyNow($this);
      });

    });

  });

  function notifyNow($element) {
      var message = $element.data('message'),
          options = $element.data('options');

      if(!message)
        $.error('Notify: No message specified');
     
      $.notify(message, options || {});
  }


}(jQuery, window, document));


/**
 * Notify Addon definition as jQuery plugin
 * Adapted version to work with Bootstrap classes
 * More information http://getuikit.com/docs/addons_notify.html
 */

(function($, window, document){

    var containers = {},
        messages   = {},

        notify     =  function(options){

            if ($.type(options) == 'string') {
                options = { message: options };
            }

            if (arguments[1]) {
                options = $.extend(options, $.type(arguments[1]) == 'string' ? {status:arguments[1]} : arguments[1]);
            }

            return (new Message(options)).show();
        },
        closeAll  = function(group, instantly){
            if(group) {
                for(var id in messages) { if(group===messages[id].group) messages[id].close(instantly); }
            } else {
                for(var id in messages) { messages[id].close(instantly); }
            }
        };

    var Message = function(options){

        var $this = this;

        this.options = $.extend({}, Message.defaults, options);

        this.uuid    = "ID"+(new Date().getTime())+"RAND"+(Math.ceil(Math.random() * 100000));
        this.element = $([
            // alert-dismissable enables bs close icon
            '<div class="uk-notify-message alert-dismissable">',
                '<a class="close">&times;</a>',
                '<div>'+this.options.message+'</div>',
            '</div>'

        ].join('')).data("notifyMessage", this);

        // status
        if (this.options.status) {
            this.element.addClass('alert alert-'+this.options.status);
            this.currentstatus = this.options.status;
        }

        this.group = this.options.group;

        messages[this.uuid] = this;

        if(!containers[this.options.pos]) {
            containers[this.options.pos] = $('<div class="uk-notify uk-notify-'+this.options.pos+'"></div>').appendTo('body').on("click", ".uk-notify-message", function(){
                $(this).data("notifyMessage").close();
            });
        }
    };


    $.extend(Message.prototype, {

        uuid: false,
        element: false,
        timout: false,
        currentstatus: "",
        group: false,

        show: function() {

            if (this.element.is(":visible")) return;

            var $this = this;

            containers[this.options.pos].show().prepend(this.element);

            var marginbottom = parseInt(this.element.css("margin-bottom"), 10);

            this.element.css({"opacity":0, "margin-top": -1*this.element.outerHeight(), "margin-bottom":0}).animate({"opacity":1, "margin-top": 0, "margin-bottom":marginbottom}, function(){

                if ($this.options.timeout) {

                    var closefn = function(){ $this.close(); };

                    $this.timeout = setTimeout(closefn, $this.options.timeout);

                    $this.element.hover(
                        function() { clearTimeout($this.timeout); },
                        function() { $this.timeout = setTimeout(closefn, $this.options.timeout);  }
                    );
                }

            });

            return this;
        },

        close: function(instantly) {

            var $this    = this,
                finalize = function(){
                    $this.element.remove();

                    if(!containers[$this.options.pos].children().length) {
                        containers[$this.options.pos].hide();
                    }

                    delete messages[$this.uuid];
                };

            if(this.timeout) clearTimeout(this.timeout);

            if(instantly) {
                finalize();
            } else {
                this.element.animate({"opacity":0, "margin-top": -1* this.element.outerHeight(), "margin-bottom":0}, function(){
                    finalize();
                });
            }
        },

        content: function(html){

            var container = this.element.find(">div");

            if(!html) {
                return container.html();
            }

            container.html(html);

            return this;
        },

        status: function(status) {

            if(!status) {
                return this.currentstatus;
            }

            this.element.removeClass('alert alert-'+this.currentstatus).addClass('alert alert-'+status);

            this.currentstatus = status;

            return this;
        }
    });

    Message.defaults = {
        message: "",
        status: "normal",
        timeout: 5000,
        group: null,
        pos: 'top-center'
    };


    $["notify"]          = notify;
    $["notify"].message  = Message;
    $["notify"].closeAll = closeAll;

    return notify;

}(jQuery, window, document));

/**=========================================================
 * Module: play-animation.js
 * Provides a simple way to run animation with a trigger
 * Targeted elements must have 
 *   [data-animate"]
 *   [data-target="Target element affected by the animation"] 
 *   [data-play="Animation name (http://daneden.github.io/animate.css/)"]
 *
 * Requires animo.js
 =========================================================*/
 
(function($, window, document){
  'use strict';

  var Selector = '[data-animate]';

  $(function() {
    
    var $scroller = $(window).add('body, .wrapper');

    // Parse animations params and attach trigger to scroll
    $(Selector).each(function() {
      var $this     = $(this),
          offset    = $this.data('offset'),
          delay     = $this.data('delay')     || 100, // milliseconds
          animation = $this.data('play')      || 'bounce';
      
      if(typeof offset !== 'undefined') {
        
        // test if the element starts visible
        testAnimation($this);
        // test on scroll
        $scroller.scroll(function(){
          testAnimation($this);
        });

      }

      // Test an element visibilty and trigger the given animation
      function testAnimation(element) {
          if ( !element.hasClass('anim-running') &&
              $.Utils.isInView(element, {topoffset: offset})) {
          element
            .addClass('anim-running');

          setTimeout(function() {
            element
              .addClass('anim-done')
              .animo( { animation: animation, duration: 0.7} );
          }, delay);

        }
      }

    });

    // Run click triggered animations
    $(document).on('click', Selector, function() {

      var $this     = $(this),
          targetSel = $this.data('target'),
          animation = $this.data('play') || 'bounce',
          target    = $(targetSel);

      if(target && target.length) {
        target.animo( { animation: animation } );
      }
      
    });

  });

}(jQuery, window, document));
/**=========================================================
 * Module: utils.js
 * jQuery Utility functions library 
 * adapted from the core of UIKit
 =========================================================*/

(function($, window, doc){
    'use strict';
    
    var $html = $("html"), $win = $(window);

    $.support.transition = (function() {

        var transitionEnd = (function() {

            var element = doc.body || doc.documentElement,
                transEndEventNames = {
                    WebkitTransition: 'webkitTransitionEnd',
                    MozTransition: 'transitionend',
                    OTransition: 'oTransitionEnd otransitionend',
                    transition: 'transitionend'
                }, name;

            for (name in transEndEventNames) {
                if (element.style[name] !== undefined) return transEndEventNames[name];
            }
        }());

        return transitionEnd && { end: transitionEnd };
    })();

    $.support.animation = (function() {

        var animationEnd = (function() {

            var element = doc.body || doc.documentElement,
                animEndEventNames = {
                    WebkitAnimation: 'webkitAnimationEnd',
                    MozAnimation: 'animationend',
                    OAnimation: 'oAnimationEnd oanimationend',
                    animation: 'animationend'
                }, name;

            for (name in animEndEventNames) {
                if (element.style[name] !== undefined) return animEndEventNames[name];
            }
        }());

        return animationEnd && { end: animationEnd };
    })();

    $.support.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame || function(callback){ window.setTimeout(callback, 1000/60); };
    $.support.touch                 = (
        ('ontouchstart' in window && navigator.userAgent.toLowerCase().match(/mobile|tablet/)) ||
        (window.DocumentTouch && document instanceof window.DocumentTouch)  ||
        (window.navigator['msPointerEnabled'] && window.navigator['msMaxTouchPoints'] > 0) || //IE 10
        (window.navigator['pointerEnabled'] && window.navigator['maxTouchPoints'] > 0) || //IE >=11
        false
    );
    $.support.mutationobserver      = (window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver || null);

    $.Utils = {};

    $.Utils.debounce = function(func, wait, immediate) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };

    $.Utils.removeCssRules = function(selectorRegEx) {
        var idx, idxs, stylesheet, _i, _j, _k, _len, _len1, _len2, _ref;

        if(!selectorRegEx) return;

        setTimeout(function(){
            try {
              _ref = document.styleSheets;
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                stylesheet = _ref[_i];
                idxs = [];
                stylesheet.cssRules = stylesheet.cssRules;
                for (idx = _j = 0, _len1 = stylesheet.cssRules.length; _j < _len1; idx = ++_j) {
                  if (stylesheet.cssRules[idx].type === CSSRule.STYLE_RULE && selectorRegEx.test(stylesheet.cssRules[idx].selectorText)) {
                    idxs.unshift(idx);
                  }
                }
                for (_k = 0, _len2 = idxs.length; _k < _len2; _k++) {
                  stylesheet.deleteRule(idxs[_k]);
                }
              }
            } catch (_error) {}
        }, 0);
    };

    $.Utils.isInView = function(element, options) {

        var $element = $(element);

        if (!$element.is(':visible')) {
            return false;
        }

        var window_left = $win.scrollLeft(),
            window_top  = $win.scrollTop(),
            offset      = $element.offset(),
            left        = offset.left,
            top         = offset.top;

        options = $.extend({topoffset:0, leftoffset:0}, options);

        if (top + $element.height() >= window_top && top - options.topoffset <= window_top + $win.height() &&
            left + $element.width() >= window_left && left - options.leftoffset <= window_left + $win.width()) {
          return true;
        } else {
          return false;
        }
    };

    $.Utils.options = function(string) {

        if ($.isPlainObject(string)) return string;

        var start = (string ? string.indexOf("{") : -1), options = {};

        if (start != -1) {
            try {
                options = (new Function("", "var json = " + string.substr(start) + "; return JSON.parse(JSON.stringify(json));"))();
            } catch (e) {}
        }

        return options;
    };

    $.Utils.events       = {};
    $.Utils.events.click = $.support.touch ? 'tap' : 'click';

    $.langdirection = $html.attr("dir") == "rtl" ? "right" : "left";

    $(function(){

        // Check for dom modifications
        if(!$.support.mutationobserver) return;

        // Install an observer for custom needs of dom changes
        var observer = new $.support.mutationobserver($.Utils.debounce(function(mutations) {
            $(doc).trigger("domready");
        }, 300));

        // pass in the target node, as well as the observer options
        observer.observe(document.body, { childList: true, subtree: true });

    });

    // add touch identifier class
    $html.addClass($.support.touch ? "touch" : "no-touch");

}(jQuery, window, document));


/**===========================================================
 * Templates for jQuery
 * */
function tmpl(template_type, items, addTo, direction){

	var	htmlEntities = function(str) {
			return String(str + '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
		},
		replaceTags = function(html, object){
			$.each(object, function(key, value){
				var key_expr = new RegExp('{'+key+'}', 'gim');
				if ($.type(value) == 'string'){
					value = htmlEntities(value);
				}else if (value instanceof jQuery){
					var _value = [];
					value.each(function(){
						"use strict";
						_value.push(this.outerHTML) ;
					});
					value = _value.join('');
				}else if (value == null){
					value = '';
				}
				html = html ? html.replace(key_expr, value) : '';
			});
			var not_handled_keys = new RegExp(/\{.*?\}/gim);
			html = html ? html.replace(not_handled_keys, '') : '';
			return html;
		},

		result = '',
		html_val = (typeof template_type == 'object') ? template_type.tmpl : $('#tmpl-'+template_type).html(), //Р”РѕР±Р°РІР»СЏСЋ РІРѕР·РјРѕР¶РЅРѕСЃС‚СЊ РїРµСЂРµРґР°С‡Сѓ СЃСЂР°Р·Сѓ С‚РµР»Р° С€Р°Р±Р»РѕРЅР°, Р° РЅРµ СЃРµР»РµРєС‚РѕСЂР°
		comments = new RegExp(/(?:\/\*(?:[\s\S]*?)\*\/)|(?:([\s;])+\/\/(?:.*)$)/gim),
		spaces = new RegExp('\\s{2,}','igm');
	if(html_val === undefined || items === undefined){
		console.group('tmpl_error');
		console.log('error in '+template_type);
		console.log('items', items);
		console.log('addTo', addTo);
		console.log('html_val', html_val);
		console.log('inputs', {template_type: template_type, items:items, addTo:addTo, direction:direction});
		console.groupEnd();
	}
	html_val = html_val ? html_val.replace(comments,'') : '';
	html_val = html_val ? html_val.replace(spaces,'').trim() : '';
	if (Array.isArray(items)){
		var i, items_length = items.length;
		for (i = 0; i < items_length; i++){
			result += replaceTags(html_val, items[i]);
		}
	} else {
		result = replaceTags(html_val, items);
	}
	result = $(result);
	if (addTo == null || addTo == undefined){
		return result;
	}
	if(direction == 'prepend'){
		addTo.prepend(result);
	}else{
		addTo.append(result);
	}
	return result;
}

/**===========================================================
 * Query search part to object
 * */
if (window['moment'] != undefined){
    moment.lang(navigator.language);
}

/**
 * Возвращает единицу измерения с правильным окончанием
 *
 * @param {Number} num      Число
 * @param {Object} cases    Варианты слова {nom: 'час', gen: 'часа', plu: 'часов'}
 * @return {String}
 */
function getUnitsText(num, cases) {
    num = Math.abs(num);

    var word = '';

    if (num.toString().indexOf('.') > -1) {
        word = cases.GEN;
    } else {
        word = (
            num % 10 == 1 && num % 100 != 11
                ? cases.NOM
                : num % 10 >= 2 && num % 10 <= 4 && (num % 100 < 10 || num % 100 >= 20)
                ? cases.GEN
                : cases.PLU
        );
    }

    return word;
}

function searchToObject() {
	var pairs = window.location.search.substring(1).split("&"),
		obj = {},
		pair,
		i;

	for ( i in pairs ) {
        if (pairs.hasOwnProperty(i)){
            if ( pairs[i] === "" ) continue;

            pair = pairs[i].split("=");
            obj[ decodeURIComponent( pair[0] ) ] = decodeURIComponent( pair[1] );
        }
	}

	return obj;
}

function hashToObject() {
	var pairs = window.location.hash.substring(1).split("&"),
		obj = {},
		pair,
		i;
	for ( i in pairs ) {
        if (pairs.hasOwnProperty(i)) {
            if (pairs[i] === '') continue;

            pair = pairs[i].split("=");
            obj[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
        }
	}
	return obj;
}

window.socket = io.connect(':8080');

socket.on('connect', function(){
  $.ajax({
    url: 'api/users/device',
    type: 'PUT',
    data: {
      device_token: socket.id,
      client_type: 'browser'
    },
    success: function(res){
      if (res.status){
        socket.emit('session.set', res.data.token);
      }
    }
  });
});

socket.on('auth', function(data){
  $.ajax({
    url: 'auth.php',
    type: 'POST',
    data: data,
    success: function(res){
      if (res.status){
        if (data.hasOwnProperty('mobile') && data.mobile == true){
          window.location.href = '/mobileAuthDone.php?token=' + data.token + '&email=' + data.email;
        }else{
          window.opener.location = 'timeline';
          if (yaCounter32442130){
            switch(data.type){
              case 'vk':{
                yaCounter32442130.reachGoal('VkAuthDone');
                break;
              }
              case 'facebook':{
                yaCounter32442130.reachGoal('FacebookAuthDone');
                break;
              }
              case 'google':{
                yaCounter32442130.reachGoal('GoogleAuthDone');
                break;
              }
            }
          }

          window.close();
        }
      }else{
        $('.panel-body.loader-demo').text(res.text);
        $('.panel-heading').hide();
      }
    }
  });
});

socket.on('log', function(data){
    console.log(data);
});

socket.on('error.retry', function() {
  $('.panel-body.loader-demo').text('Во время загрузки данных произошла ошибка. Войдите с помощью другой социальной сети или попробуте чуть позже.');
  $('.panel-heading').hide();
});

socket.on('notification', function(data){
  if (!Notify.needsPermission) {
    socket.emit('notification.received', {
      notification_id: data.notification_id
    });
    var myNotification = new Notify(data.note.payload.title, {
      body: data.note.body,
      icon: data.note.icon,
      tag: data.note.payload.event_id,
      timeout: 60,
      notifyClick: function(){
        $("<a>").attr("href", window.location.origin + '/event.php?id=' + data.note.payload.event_id).attr("target", "_blank")[0].click();
        socket.emit('notification.received', {
          notification_id: data.notification_id,
          click_time: moment().format(__C.DATE_FORMAT + ' HH:MM:SS')
        });
      }}
    );

    myNotification.show();
  } else if (Notify.isSupported()) {
    Notify.requestPermission();
  }
});


function showOrganizationalModal(organization_id){
  if (window.organization_is_loading) return;
  window.organization_is_loading = true;
    $.ajax({
        url: 'api/organizations/' + organization_id + '?with_events=true',
        success: function(res){
            var $events = $('<div>'),
                $friends = tmpl('subscribed-users-row', {
                    subscribed_count: res.data.subscribed_count,
                    subscribed_count_text: getUnitsText(res.data.subscribed_count, __C.TEXTS.SUBSCRIBERS)
                }),
                $body = $('body'),
                $modal = $('#organization-modal');


          res.data.friends = $('<div>');
          res.data.all_friends = tmpl('liked-dropdown-wrapper', {event_id: res.data.id});

          if (res.data.subscribed_friends != undefined){
            res.data.subscribed_friends.forEach(function(user, index){
              res.data.all_friends.append(tmpl('liked-dropdown-item', user));
              if (index > 4) return;
              var $friend = tmpl('subscribed-friend', user);
              $friends.prepend($friend);
            });
          }

            if (res.data && res.data.hasOwnProperty('events')){

                res.data.events.forEach(function(event){
                    $events.append(tmpl('short-event', generateEventAttributes(event)));
                });

                $modal.remove();
                res.data.events = $events;
                res.data.subscribed_friends = $friends;
                res.data.site_url_short = res.data.site_url.replace('http://', '');
                $modal = tmpl('organization-modal', $.extend(true, res.data, {
                    subscribe_btn_text: res.data.is_subscribed ? __C.TEXTS.REMOVE_SUBSCRIPTION : __C.TEXTS.ADD_SUBSCRIPTION,
                    subscribe_btn_class: res.data.is_subscribed ? __C.CLASSES.SUBSCRIBE_DELETE : __C.CLASSES.SUBSCRIBE_ADD
                }));

                $modal.find('.modal-subscribe-btn').on('click', function(){
                    var $btn = $(this),
                        org_id = $btn.data('organization-id'),
                        sub_id = $btn.data('subscription-id');
                    if ($btn.hasClass(__C.CLASSES.DISABLED)) return true;

                    $btn.addClass(__C.CLASSES.DISABLED);

                    if ($btn.hasClass(__C.CLASSES.SUBSCRIBE_DELETE)){
                        toggleSubscriptionState(false, sub_id, function(){
                            $btn
                                .toggleClass(__C.CLASSES.SUBSCRIBE_DELETE + ' ' +
                                __C.CLASSES.SUBSCRIBE_ADD + ' ' +
                                __C.CLASSES.DISABLED)
                                .text(__C.TEXTS.ADD_SUBSCRIPTION);
                        });
                      hideOrganizationItem(org_id);
                    }else{
                        toggleSubscriptionState(true, org_id, function(){
                            $btn
                                .toggleClass(__C.CLASSES.SUBSCRIBE_DELETE + ' ' +
                                __C.CLASSES.SUBSCRIBE_ADD + ' ' +
                                __C.CLASSES.DISABLED)
                                .text(__C.TEXTS.REMOVE_SUBSCRIPTION);
                            printSubscribedOrganizations();
                        });
                    }
                });

              //$modal.find('.liked-users').data('friends', res.data.all_friends).on('click', function(){
              //  var $this = $(this),
              //      $all_friends = $('.friends-event-' + res.data.id);
              //
              //  if ($all_friends.hasClass('open')){
              //    $all_friends
              //        .removeClass('open')
              //        .addClass('hidden')
              //        .remove();
              //  }else{
              //    $all_friends.remove();
              //    $all_friends = $this.data('friends');
              //    if ($all_friends.find('li').length == 0) return;
              //
              //    var left_offset = $this.offset().left;
              //    $all_friends
              //        .removeClass('hidden')
              //        .addClass('open')
              //        .css({
              //          top: $this.offset().top + $this.height() + 'px',
              //          left: left_offset + 'px'
              //        })
              //        .prependTo();
              //
              //    $modal.addClass('open').append($all_friends);
              //
              //    $modal.find('.all-friends').slimscroll({
              //          height: window.innerHeight - $this.offset().top - $this.height() - 50,
              //          width: 250
              //    });
              //    $modal.find('.all-friends').parent().addClass('open');
              //  }
              //});

              $modal.find('.short-event').on('click', function(){
                    $modal.find('.event-alone').html(tmpl('whirl-loader', {}));
                    var $this = $(this),
                        $modal_dialog = $modal.find('.modal-dialog'),
                        margin_left;
                    $this.siblings().removeClass(__C.CLASSES.ACTIVE);
                    $this.addClass(__C.CLASSES.ACTIVE);

                    $.ajax({
                        url: '/api/events/' + $this.data('event-id'),
                        success: function(res){

                            var _event = generateEventAttributes(res.data);
                            if (_event.one_day){_event.dates = $('<span>' + _event.day_name.capitalize() + '<br>' + _event.dates + '</span>')}
                            _event.style = _event.dates_range.length > 4 ? 'font-size: 14px;' : '';
                            var $event_content = tmpl('event-modal-content', _event),
                                $event_alone = $modal.find('.event-alone');

                            if ($event_alone.length > 0){
                                $event_alone.html($event_content);
                            }else{
                                $event_alone = tmpl('event-modal', {
                                    event_content: $event_content
                                }).appendTo($modal_dialog);


                                margin_left = (window.innerWidth - EVENT_MODAL_WIDTH - $modal_dialog.width()) / 2;
                                $modal_dialog.css('z-index', 99).animate({
                                    'margin-left': margin_left
                                });
                                $event_alone
                                    .css({
                                        left: margin_left - $modal_dialog.width(),
                                        height: $modal_dialog.height(),
                                        'z-index': 9
                                    })
                                    .animate({
                                        left: $modal_dialog.width() - 3,
                                        opacity: 1
                                    }, 800);
                            }

                            $event_alone.find('.make-favorite-btn').on('click', function(){
                                toggleFavorite($(this), $('.screen-view:not(.hidden)'), true);
                            });

                            $event_alone.find('.social-links i').on('click', function(){
                                var $this = $(this),
                                    _link = tmpl( $this.data('share-type') + '-share-link', _event).attr('href');

                                window.open(_link, 'SHARE_WINDOW',
                                    'status=1,toolbar=0,menubar=0&height=300,width=500');
                            });

                            $event_alone.find('.btn-edit').on('click', function(){
                              showEditEventModal(_event.id);
                            });
                            $event_alone.find('.close').on('click', function(){
                                $event_alone.animate({
                                    left: 0,
                                    opacity: 0
                                }, 600, function(){
                                    $event_alone.remove();
                                });
                                $modal_dialog.attr('style', '');
                            });
                        }
                    });
                });

              $modal
                  .appendTo($body)
                  .on('shown.bs.modal', function(){
                    $modal.find('.modal-body').slimscroll({
                            height: 650
                        });
                  })
                  .on('hide.bs.modal', function(){
                    window.organization_is_loading = false;
                  })
                  .modal();

            }
        }
    });
}

function showSettingsModal(){
    var $modal = $('#settings-modal');
    $modal.remove();

    $.ajax({
        url: '/api/users/settings',
        type: 'GET',
        success: function(res){
            $modal = tmpl('settings-modal', res.data);
            $modal
                .appendTo($('body'))
                .on('shown.bs.modal', function(){
                    if (res.data.hasOwnProperty('show_to_friends')){
                        $modal.find('.show-to-friends').prop('checked', res.data.show_to_friends);
                    }
                    if (res.data.hasOwnProperty('notify_in_browser')){
                        $modal.find('.notify-in-browser').prop('checked', res.data.notify_in_browser);
                    }
                    $modal.find('.notify-in-browser').on('change', function(){
                        var $this = $(this);
                        if ($this.prop('checked')){
                            if (Notify.needsPermission) {
                                Notify.requestPermission(function(){}, function(){
                                    $this.prop('checked', false);
                                    showNotifier({status: false, text: 'Мы не можем включить уведомления в браузере. Вы запретили их для нас :('});
                                });
                            }
                        }
                    })
                })
                .modal();
            $modal
                .find('.save-settings-btn')
                .off('click')
                .on('click', function(){
                    var _data = {};
                    $modal.find('input').each(function(){
                        var $this = $(this);
                        _data[$this.attr('name')] = $this.prop('checked');
                    });

                    Pace.ignore(function(){
                        $.ajax({
                            url: '/api/users/settings',
                            type: 'PUT',
                            data: _data
                        });
                    });
                    $modal.modal('hide');
                }) ;
        }
    });
}

function toggleFavorite($btn, $view, refresh){
    var $liked_count = $btn.parents('.tl-panel-block').find('.liked-users-count-number'),
        $liked_count_text = $btn.parents('.tl-panel-block').find('.liked-users-count-text'),
        _event_id = $btn.data('event-id'),
        _date = $btn.parents('.tl-panel-block').data(__C.DATA_NAMES.DATE),
        params = {
            url: '/api/events/favorites/',
            type: 'POST',
            data: {
                event_id: _event_id
            }
        };

    $btn.toggleClass(__C.CLASSES.NO_BORDERS);
    $btn.text($btn.hasClass(__C.CLASSES.NO_BORDERS) ? __C.TEXTS.REMOVE_FAVORITE : __C.TEXTS.ADD_FAVORITE);
    $view.find('.timeline-' + _event_id + '-' + _date).toggleClass(__C.CLASSES.ACTIVE);

    var new_count;
    if (!$btn.hasClass(__C.CLASSES.NO_BORDERS)){
        params.type = 'DELETE';
        params.url = '/api/events/favorites/' + $btn.data('event-id');
        new_count = parseInt($liked_count.text()) - 1;
        $liked_count.text(new_count);
    }else{
        new_count = parseInt($liked_count.text()) + 1;
        $liked_count.text(new_count);
    }
    $liked_count_text.text(getUnitsText(new_count, __C.TEXTS.FAVORED));

    $.ajax(params)
        .always(function(){
            if (setDaysWithEvents) setDaysWithEvents();
            if (window.location.pathname.replace('/', '') == 'favorites' && refresh == true){
                __STATES.refreshState();
            }
        });
}

$(document).ready(function(){
    window.paceOptions = {
        ajax: false, // disabled
        document: false, // disabled
        eventLag: false, // disabled
        elements: {},
        search_is_active: false,
        search_query: null,
        search_xhr: null
    };
    window.__C = {
            TEXTS:{
                REMOVE_FAVORITE: 'Удалить из избранного',
                ADD_FAVORITE: 'В избранное',
                SUBSCRIBERS:{
                    NOM: ' подписчик',
                    GEN: ' подписчика',
                    PLU: ' подписчиков'
                },
                FAVORED:{
                    NOM: ' участник',
                    GEN: ' участника',
                    PLU: ' участников'
                },
                ADD_SUBSCRIPTION: 'Подписаться',
                REMOVE_SUBSCRIPTION: 'Отписаться'
            },
            DATA_NAMES:{
                DATE: 'date'
            },
            CLASSES: {
                ACTIVE: 'active',
                NO_BORDERS: 'no-borders',
                SUBSCRIBE_ADD: 'btn-pink-empty',
                SUBSCRIBE_DELETE: 'btn-pink',
                DISABLED: 'disabled',
                HIDDEN: 'hidden'
            },
            DATE_FORMAT: 'YYYY-MM-DD',
            IMAGES_PATH: '/events_images',
            STATS: {
              EVENT_VIEW: 'view',
              EVENT_VIEW_DETAIL: 'view_detail',
              EVENT_OPEN_SITE: 'open_site',
              ORGANIZATION_OPEN_SITE: 'open_site',
              EVENT_ENTITY: 'event',
              ORGANIZATION_ENTITY: 'organization'
            },
            ACTION_NAMES: {
              fave:           ['добавил(а) в избранное'],
              unfave:         ['удалил(а) из избранного'],
              subscribe:      ['добавил(а) подписки'],
              unsubscribe:    ['удалил(а) подписки']
            },
            ENTITIES: {
              EVENT: 'event',
              ORGANIZATION: 'organization'
            }
        };
    window.__stats = [];

  window.storeStat = function(entity_id, entity_type, event_type){
    __stats.push({
      entity_id: entity_id,
      entity_type: entity_type,
      event_type: event_type
    });
  };

  setInterval(function(){
    if (__stats.length != 0){
      var batch = __stats;
      __stats = [];
      $.ajax({
        url: '/api/statistics/batch',
        data: JSON.stringify(batch),
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        error: function(){
          debugger;
          __stats.concat(batch);
        }
      });
    }
  }, 15000);
});

function isNotDesktop() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
}