/*
 * add content from JSON description
 */

var etapes;

$.getJSON("data/etapes.json", function( data ) {
    etapes = data;
    var items = [];
    $.each(data, function (idx, stage) {
      if (idx > 0) {
        items.push('<div class="slide">');
        items.push('  <div class="stage-header">');
        items.push('    Etape n°' + idx + '&nbsp;:<br>');
        items.push('    ' + stage.depart + '<br>');
        items.push('    &rarr; ' + stage.arrivee);
        items.push('  </div>');
        items.push('  <div class="stage-comment">');
        items.push('    ' + stage.date + '<br>');
        items.push('    ' + stage.type + '&nbsp;: ' + stage.distance + '<br>');
        items.push('  </div>');
        items.push('  <div class="stage-img">');
        items.push('    <img src="' + stage.photo + '">');
        items.push('    <div class="img-caption">');
        items.push('      Photographie de <a href="' + stage.lien + '" target="_blank">' + stage.auteur + '</a>');
        items.push('    </div>');
        items.push('  </div>');
        items.push('</div>');
      }
    });
    $('.slide').after(items.join('\r\n'));
});

/*
 * Leaflet map with elevation
 * https://github.com/MrMufflon/Leaflet.Elevation
 */

var map = new L.Map('map');

var url = 'http://otile{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.jpeg',
  attr ='Tiles Courtesy of <a href="http://www.mapquest.com/">MapQuest</a> &mdash; Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
  service = new L.TileLayer(url, {subdomains:"1234",attribution: attr});
map.addLayer(service);

var el = L.control.elevation({
    yAxisMin: 0,
    yAxisMax: 300
});
el.addTo(map);

var g;

function loadStage(index) {

  if (g !== undefined) {
    map.removeLayer(g);
    el.clear();
  }

  g = new L.GPX(etapes[index].gpx, {
    async: true,
     marker_options: {
        startIconUrl: './images/pin-icon-start.png',
        endIconUrl: './images/pin-icon-end.png',
        shadowUrl: './images/pin-shadow.png'
      }
  });
  g.on('loaded', function(e) {
      map.fitBounds(e.target.getBounds());
  });
  g.on("addline",function(e) {
      el.addData(e.line);
  });
  g.addTo(map);
}

/*
 * Full Screen Vertical Scroller
 * https://github.com/lukesnowden/FSVS
 */

var slider;
var currentStage = 0;

function init_slider() {
  /* waiting for etapes JSON to be loaded */
  if (etapes === undefined) {
    setTimeout(init_slider, 100);
    return;
  }
  slider = $.fn.fsvs({
    speed : 500,
    bodyID : 'fsvs-body',
    selector : '> .slide',
    mouseSwipeDisance : 40,
    afterSlide : function(){},
    beforeSlide : function(index){
        $('#stage-' + currentStage).removeClass('tl-active');
        $('#stage-' + index).addClass('tl-active');
        currentStage = index;
        loadStage(index);
    },
    endSlide : function(){},
    mouseWheelEvents : true,
    mouseWheelDelay : false,
    scrollabelArea : 'scrollable',
    mouseDragEvents : true,
    touchEvents : true,
    arrowKeyEvents : true,
    pagination : false,
    nthClasses : false,
    detectHash : true
  });
}

$(document).ready(init_slider);

/*
 * timeline
 */

$(document).ready( function() {
    $('.tl-item[id]').click( function(e) {
        var etape = $(this).attr('id');
        slider.slideToIndex(etape.replace('stage-', ''));
    });
    $('.tl-header').click( function(e) {
        slider.slideToIndex(0);
    });
});

/*
 * lightbox
 */

$(document).ready( function() {
    /* click on image -> copy image source and caption then fadeIn lightbox */
    $('.stage-img img').click( function(e) {
        $('.lightbox-caption').html($(this).next().html());
        $('.lightbox img').attr('src', e.target.src);
        $('.lightbox').fadeIn();
        return false; } );
    /* click on lightbox -> fadeOut */
    $('.lightbox').click( function(e) {
        $('.lightbox').fadeOut();
        return false; } );
});
