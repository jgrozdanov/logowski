/*

  LOGOWSKi Scripting

*/

( function( $ ) {

  $( document ).ready( function() {
    // activate the parallax

    $( window ).stellar({
      horizontalScrolling: false,
      verticalOffset: 0,
      horizontalOffset: 0
    });

    // animate the let's do it button

    var letsGo = function() {
      var self = $( '.do-it' );
      self.animate( { left: '10px'}, 250, 'easeOutBounce', function() {
        self.animate( { left: '0' }, 250, 'easeOutBounce' );
      });
      
      setTimeout( letsGo, 3000 );
    }; 

    letsGo();

    // make the nav works
    $( '#how-it-works' ).click( function() {
      $.scrollTo( '.how-it-works', 800 );
    });
    $( '#blvd' ).click( function() {
      $.scrollTo( '.boulevard', 800 );
    });
    $( '.do-it' ).click( function() {
      $.scrollTo( '.do-it-form', 800 );
    });

    // carousel
    var setCarousel = function() {
      var STEP = 157;
      var positionLeft = 0;
      var mover = $( '.mover ' );
      var MAX = ( $( '.instagram-photo' ).size() - 4 ) * STEP;

      $( '.arrow.right' ).click( function() {
        positionLeft -= STEP;
        if( positionLeft === -MAX ) {
          mover.stop().animate( { left: 0 }, 250 );
          positionLeft = 0;
        }
        mover.stop().animate( { left: positionLeft }, 250 );
        return false;
      });

      $( '.arrow.left' ).click( function() {
        if( positionLeft === 0 ) {
          return false;
        }
        positionLeft += STEP;
        mover.stop().animate( { left: positionLeft }, 250 );
        return false;
      });
    };


    // instagram shit
    $( '.instagram-photo' ).addClass( 'loading' );

    $.ajax({
      dataType: 'json',
      url: 'https://superkosta.herokuapp.com/instagram',
      crossDomain: true,
      success: function( data, status, xhr ) {
        var insta = JSON.parse( data )
          , pics = insta.data
          , divs = $( '.instagram-photo' )
          , temp
          , background
          , backgroundBig
          , i;

        temp = divs.first();
        for( i = 0; i < 5; i++ ) {
          if( pics[i] ) {
            background = 'url(' + pics[i].images.thumbnail.url + ')';
            backgroundBig = 'url(' + pics[i].images.standard_resolution.url + ')';
          }
          else {
            background = 'white';
            backgroundBig = 'black';
          }
          temp.removeClass( 'loading' ).css( 'background', background ).data( 'big', backgroundBig );
          temp = temp.next();
        }


        var mover = $( '.mover' );
        for( i = 5; i < pics.length; i++ ) {
          background = 'url(' + pics[i].images.thumbnail.url + ')';
          backgroundBig = 'url(' + pics[i].images.standard_resolution.url + ')';
          $( '<div class="instagram-photo"></div>' ).appendTo( mover )
            .css( 'background', background ).data( 'big', backgroundBig );
        }

        $( '.instagram-photo' ).click( function() {
          $( 'body' ).css( 'overflow', 'hidden' );
          $( '.instagram-big' ).css( 'background', $( this ).data( 'big' ) );
          $( '.overlay' ).show();
        });

        setCarousel();
      }
    });

    $( '.overlay' ).click( function() {
      $( this ).hide();
      $( 'body' ).css( 'overflow', 'auto' );
    });
    
  });

}( jQuery ));


