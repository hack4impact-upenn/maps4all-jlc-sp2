// This JS file is for the map and list view creations on the homepage of the
// Maps4All site for the user. This example requires the Places library. Include
// the libraries=places parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

var map;
var markers = [];
var infowindow;
var focusZoom = 17;

/*
 * Initializes the map, the corresponding list of resources and search
 * functionality on the resources
 */
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 39.949, lng: -75.181}, // TODO(#52): Do not hardcode this.
    zoom: focusZoom,
  });

  infowindow = new google.maps.InfoWindow();
  initLocationSearch(map);
  initResourceSearch();

  $.get('/get-resources').done(function(resourcesString) {
    var resources = JSON.parse(resourcesString);
    populateMarkers(resources);
  });

  google.maps.event.addListenerOnce(map, 'idle', function() {
    populateListDiv();
  });
}

/*
 * Initialize searching on the map by location input.
 * When entering a new location, re-center and zoom the map onto that location
 * and create a custom location marker.
 */
function initLocationSearch(map) {
  var input = document.getElementById('pac-input');
  var autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.bindTo('bounds', map);

  autocomplete.addListener('place_changed', function() {
    infowindow.close();
    var place = autocomplete.getPlace();
    if (!place.geometry) {
      window.alert("Autocomplete's returned place contains no geometry");
      return;
    }
    map.setCenter(place.geometry.location);
    map.setZoom(focusZoom);

    var address = '';
    if (place.address_components) {
      address = [
        ((place.address_components[0] &&
          place.address_components[0].short_name) || ''),
        ((place.address_components[1] &&
          place.address_components[1].short_name) || ''),
        ((place.address_components[2] &&
          place.address_components[2].short_name) || '')
      ].join(' ');
    }

    var marker = new google.maps.Marker({
      map: map,
      position: place.geometry.location,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 8,
        strokeColor: 'grey',
        fillColor: 'black',
        fillOpacity: 1,
      },
    });

    // Show marker info bubble for searched location
    var locationMarkerTemplate = $("#locationmarker-template").html();
    var compiledLocMarkerTemplate = Handlebars.compile(locationMarkerTemplate);
    var context = {
      name: place.name,
      address: address,
    };
    var locationMarkerInfo = compiledLocMarkerTemplate(context);

    infowindow.setContent(locationMarkerInfo);
    infowindow.open(map, marker);
  });
}

/*
 * Initialize searching on the map by resource name input
 */
function initResourceSearch() {
  $('#resources-form').submit(function(e) {
    e.preventDefault();
    var query = $('#resources-input').val();
    var endpoint = '/search-resources/'+query;
    if (query.length == 0) {
        endpoint = '/get-resources';
    }
    $.get(endpoint).done(function(resourcesString) {
      for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
      }
      markers = [];
      var resources = JSON.parse(resourcesString);
      if (resources.length != 0) {
        populateMarkers(resources);
      }
      populateListDiv();
    });
  });
}

/*
 * Create markers for each resource and add them to the map
 * Expand the map to show all resources
 */
function populateMarkers(resources) {
  for (var i = 0; i < resources.length; i++) {
    create_marker(resources[i]);
  }

  var bounds = new google.maps.LatLngBounds();
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
    bounds.extend(markers[i].getPosition());
  }

  map.fitBounds(bounds);
  map.setCenter(bounds.getCenter());
}

/*
 * Create a marker for each resource and handle clicking on a marker.
 * Handle clicking on more information for a resource
 */
function create_marker(resource){
  var markerToAdd = new google.maps.Marker({
    map: map
  });
  latLng = new google.maps.LatLng(resource.latitude, resource.longitude);
  markerToAdd.setPosition(latLng);
  markerToAdd.setVisible(true);
  markerToAdd.title = resource.name;
  markerToAdd.address = resource.address;
  markerToAdd.json_data = {
    csrf_token: $('meta[name="csrf-token"]').prop('content'),
    data: resource.name
  };
  var values = [];
  values.push(markerToAdd.json_data);
  async.each(values,
    function(value, callback){
      markerToAdd.addListener('click', function() {
        $("#map").show();
        $("#resource-info").hide();

        // Show marker info bubble for clicked marker
        var markerTemplate = $("#marker-template").html();
        var compiledMarkerTemplate = Handlebars.compile(markerTemplate);
        var context = {
          name: resource.name,
          address: resource.address,
        };
        var markerInfo = compiledMarkerTemplate(context);

        if (infowindow) {
          infowindow.close();
        }
        infowindow = new google.maps.InfoWindow({
          content: markerInfo
        });
        infowindow.open(map, markerToAdd);
        map.setCenter(markerToAdd.getPosition());
        map.setZoom(focusZoom);

        // Marker to detailed resource information view
        $(".more-info").click(function() {
          // get descriptor information
          $.get('get-associations/' + resource.id).done(function(associations) {
            $("#map").hide();
            $("#resource-info").empty();
            $("#resource-info").show();

            var associationObject = JSON.parse(associations);
            var descriptors = [];
            for (var key in associationObject) {
              var descriptor = {
                key: key,
                value: associationObject[key],
              };
              descriptors.push(descriptor);
            }

            // Detailed resource information view
            var resourceTemplate = $("#resource-template").html();
            var compiledResourceTemplate = Handlebars.compile(resourceTemplate);
            var context = {
              name: resource.name,
              address: resource.address,
              suggestionUrl: 'suggestion/' + resource.id,
              descriptors: descriptors,
            };
            var resourceInfo = compiledResourceTemplate(context);
            $("#resource-info").html(resourceInfo);

            // Set handlers and populate DOM elements from resource template
            // Can only reference elements in template after compilation
            $('#back-button').click(function() {
              $("#map").show();
              $("#resource-info").hide();
            });

            // Map for single resource on detailed resource info page
            var singleMap = new google.maps.Map(
              document.getElementById('single-map'),
              {
                center: markerToAdd.getPosition(),
                zoom: focusZoom,
              }
            );
            var singleMarker = new google.maps.Marker({
              position: markerToAdd.getPosition(),
              map: singleMap,
            });
          }).fail(function() {});
        });
      });
      callback();
    }, function() {
         markers.push(markerToAdd)
    }
  );
}

/*
 * Show a corresponding list of resources adjacent to the map
 */
function populateListDiv() {
  var markersToShow = markers;
  $("#list").empty();

  var listResources = [];
  $.each(markersToShow, function(i, markerToShow) {
    var listResource = {
      name: markerToShow.title,
      address: markerToShow.address,
    };
    listResources.push(listResource);
  });

  var listTemplate = $("#listview-template").html();
  var compiledListTemplate = Handlebars.compile(listTemplate);
  var context = {
    resource: listResources,
  };
  var listView = compiledListTemplate(context);
  $("#list").html(listView);

  // Can only add handlers to elements in template after compilation
  $(".list-resource").each(function(i, element) {
    element.addEventListener('click', function() {
      google.maps.event.trigger(markersToShow[i], 'click');
    });
  });
}
