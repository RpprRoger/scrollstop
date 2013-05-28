/*
 *  Project: scrollstop
 *  Description: Fires an event on the element which the cursor ends on
 *  Author: Robert Preus-MacLaren <rob@neontribe.co.uk>
 *  License: https://github.com/RpprRoger/scrollstop/blob/master/license.md
 */

// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;(function ( $ ) {

    var props = [ '', '-x', '-y' ],
        re = /^(?:auto|scroll)$/i,
        timer = $.noop,
        moveTimer = $.noop,
        mouse = {};

    $.expr[':'].scrollable = function( el ) {
        var scrollable = false,
            $el = $(el);

        $.each( props, function(i,v){
            return !( scrollable = scrollable || re.test( $el.css( 'overflow' + v ) ) );
        });

        // If offsetWidth is greater than the clientWidth we have a scrollbar
        return scrollable && ( el.offsetWidth > el.clientWidth || el.offsetHeight > el.clientHeight );
    };

    $('body').on( 'mousemove', function( evt ) {
        clearTimeout( moveTimer );
        
        moveTimer = setTimeout(function() {
            mouse.x = evt.pageX || 0;
            mouse.y = evt.pageY || 0;
        }, 100);
    });

    $('body').on( 'mousewheel', function( evt ) {
        clearTimeout( timer );
        
        timer = setTimeout(function() {
            var $scroll = $(evt.target).parents(':scrollable'),
                $target;

            // TODO: make this faster/better
            $scroll.children().each( function() {
                var $this = $(this),
                    offset = $this.offset(),
                    boundsX = offset.top + $this.outerHeight(),
                    boundsY = offset.left + $this.outerWidth();
                if( mouse.y > offset.top && mouse.y < boundsX && mouse.x > offset.left && mouse.x < boundsY ) {
                    $target = $this;
                    return false;
                };
            });

            // Attempt to wait for the browser to update its render
            setTimeout(function() {
                $target && $target.trigger( 'scrollstop', [$target] );
            }, 0);

        }, 400);

    });

})( jQuery );