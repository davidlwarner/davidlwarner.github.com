/* iOS scrollpane jQuery plugin, v1.0
 * ==================================
 *
 * (c) 2011 Dave Gurnell
 * http://boxandarrow.com
 *
 * Distributed under the Creative Commons Attribution 3.0 Unported licence:
 * http://creativecommons.org/licenses/by/3.0/
 */


/* Initialise a scrollpane. Use this on HTML like:
 *
 *    <div id="viewport">
 *      <div>First page</div>
 *      <div>Second page</div>
 *      <div>Third page</div>
 *    </div>
 *
 *    $("#viewport").scrollPane();
 *
 * The method wil automatically position and resize the pages
 * so they're the same size as the viewport. Touching and dragging
 * on the pages will flip between them in the style of the iOS home 
 * screen. Options:
 *
 *  - direction: "horizontal" or "vertical", default "horizontal"
 *
 *      The scroll direction.
 *
 *  - deadzone: int, default 25
 *
 *      Distance the user has to drag before a page transition is
 *      triggered. Avoids accidental page transitions caused by
 *      brushing against the screen.
 *
 *  - draggable: boolean, default true
 *
 *      Setting this to false disables the touch gestures. This is
 *      useful if you only want to transition using the $().showpage()
 *      method (see bottom of the file).
 *
 *  - setupCss: boolean, default true
 *
 *      Whether to edit the CSS rules for the viewport and pages.
 *      Set this to false to do your own layout, but bear in mind the
 *      plugin only works if the pages are the same size as the viewport.
 *
 *      Note that this option does not affect whether the method sets
 *      -webkit-transition and -webkit-transform on the viewport.
 *
 *  - onscroll: (int int int -> void), default empty function
 *
 *      Callback function that gets invoked whenever the page scrolls. 
 *      Use this to hook up animations and status indicators elsewhere
 *      on the page. 
 *
 *      Arguments to the function are:
 *
 *        - pos : int
 *
 *          the (typically negative) position that we're scrolling to, in pixels
 *
 *        - page : real
 *
 *          the (typically positive, possibly fractional) position that we're
 *          scrolling to, in units of a page
 *
 *        - duration : int
 *
 *          the number of milliseconds we're going to take to get there
 *
 *   - onscrollfinish: (int int -> void), default empty function
 *  
 *       Callback function that gets invoked when the viewport settles on a
 *       new page. pos and page arguments are the same as for onscroll.
 *
 */
$.fn.scrollpane = function(options) {
    options = $.extend({ 
        direction: "horizontal",
        deadzone: 25,
        draggable: true,
        setupCss: true,
        onscroll: function(pos, page, duration) { },
        onscrollfinish: function(pos, page) { }
    }, options);

    return this.each(function () {
      
        // the scroll pane viewport
        // jQuery
        var outerElem = $(this);
        
        // a large div containing the scrolling content
        // jQuery
        var innerElem = $("<div></div>");
        innerElem.append(outerElem.children().remove());
        outerElem.append(innerElem);
        
        // cache these for later
        // natural
        var outerWidth = outerElem.width();
        var outerHeight = outerElem.height();
        
        // boolean
        var horizontal = (options.direction == "horizontal");
        
        // the number of pixels the user has to drag and release to trigger a page transition
        // natural
        var deadzone = Math.max(0, options.deadzone);
        
        // the index of the current page. changed after the user completes each scrolling gesture.
        // integer
        var currentPage = 0;
        
        // width of a page
        // integer
        var scrollUnit = horizontal ? outerWidth : outerHeight;
    
        // x coordinate on the transform. -ve numbers go to the right,
        // so this goes -ve as currentPage goes +ve
        // integer (pixels)
        var currentPos = 0;

        // min and max scroll position:
        // integer (pixels)
        var scrollMax = 0;
        var scrollMin = -scrollUnit * (innerElem.children().length - 1);
    
        // time to settle after touched:
        // natural (ms)
        var settleTime = 500;

        // dragMid and dragEnd are updated each frame of dragging:
        // integer (pixels)
        var dragStart = 0; // touch position when dragging starts
        var dragMid = 0;   // touch position on the last touchmove event
        var dragEnd = 0;   // touch position on this touchmove event
    
        // +1 if dragging in +ve x direction, -1 if dragging in -ve x direction
        // U(-1, +1)
        var dragDir = 0;
        
        if(options.setupCss) {
          outerElem.css({ "position": "relative", "overflow": "hidden" });
    
          // position the pages:
          innerElem.children().each(function(index) {
            $(this).css({ "position" : "absolute",
                          "display"  : "block",
                          "width"    : outerWidth,
                          "height"   : outerHeight })
                   .css(horizontal ? "left" : "top", scrollUnit * index);
          });
        }
        
        // natural natural boolean -> void
        function scrollTo(position, duration, finish) {
            options.onscroll(position, -position/scrollUnit, duration);
            innerElem.css({
                "-webkit-transition": "all " + (duration == 0 ? "0" : duration + "ms"),
                "-webkit-transform": horizontal ?
                    ("translate3d(" + position + "px, 0, 0)") :
                    ("translate3d(0, " + position + "px, 0)") });
            if(finish) {
                window.setTimeout(function() { 
                  options.onscrollfinish(position, -position/scrollUnit, duration);
                });
            }
        }
        
        // Immediately set the 3D transform on the scroll pane.
        // This causes Safari to create OpenGL resources to manage the animation.
        // This sometimes causes a brief flicker, so best to do it at page load
        // rather than waiting until the user starts to drag.
        scrollTo(0, 0, true);

        // set up the menu callback:
        outerElem.data("showpage", function(page) {
            // int
            page = page < 0
                 ? innerElem.children().length + page
                 : page;
                
            currentPos = Math.max(scrollMin, Math.min(scrollMax, -page * scrollUnit));
            currentPage = -currentPos / scrollUnit;
            
            scrollTo(currentPos, settleTime, true);
        });
    
        // bind the touch drag events:
        if(options.draggable) {
            outerElem.bind("touchstart", function(wrap) {
                var evt = wrap.originalEvent;
                if(evt.touches.length == 1) {
                    dragStart = dragEnd = dragMid = horizontal ? evt.touches[0].pageX : evt.touches[0].pageY;
                }
            // bind the touch drag event:
            }).bind("touchmove", function(wrap) {
                var evt = wrap.originalEvent;
                if(evt.touches.length == 1) {
                    dragEnd = horizontal ? evt.touches[0].pageX : evt.touches[0].pageY;
                    dragDir = (dragEnd - dragMid) > 0 ? 1 : -1;
                    currentPos += dragEnd - dragMid;
                    dragMid = dragEnd;
                    scrollTo(currentPos, 0, false);
                }
            // bind the touch end event:
            }).bind("touchend", function(wrap) {
                var evt = wrap.originalEvent;
                
                // boolean
                var reset = Math.abs(dragEnd - dragStart) < deadzone;
                
                // real
                var scrollPage = -1.0 * currentPos / scrollUnit;
                
                // natural
                var nextPage = reset
                             ? currentPage
                             : (dragDir < 0 
                                ? Math.ceil(scrollPage) 
                                : Math.floor(scrollPage));

                // int
                var nextPos = Math.max(scrollMin,
                                       Math.min(scrollMax,
                                                -scrollUnit * nextPage));
     
                currentPos = nextPos;
                currentPage = nextPage;

                scrollTo(nextPos, settleTime, true);
            });
        }
    });
};

// Once you've initialized a scrollpane with $().scrollpane(),
// you can use this method to cause it to programmatically scroll
// to a particular page. Useful for creating a navigation menu, or
// those little dots on Apple-store-style product galleries.
//
// Pages are indexed from 0 upwards. Negative numbers can be used
// to index pages from the right.
//
// int -> jQuery
$.fn.showpage = function(index) {
    var fn = this.data("showpage");
    fn(index);
    return this;
};
