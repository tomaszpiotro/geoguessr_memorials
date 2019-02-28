let panorama;
let minimap;
let minimapMarker;
let marker1;
let marker2;
let marker_image;
let all_places = [
    [51.1013776, 17.029505],
    [51.1092839, 17.0455188],
    [51.1096669, 17.0310542],
    [51.1103073, 17.0459201],
    [51.1079522, 17.0724401],
    [51.1045221, 17.0312853],
    [51.1052206, 17.0292891],
    [51.1141681, 17.0455138],
    [51.1648602, 16.9701021],
    [51.1147042, 17.0438164],
    [52.2147201, 21.0280667],
    [52.1050555, 20.6225437],
    [52.2540087, 20.9991496],
    [52.216256, 20.9883252],
    [52.2403126, 21.0317112],
    [53.0111065, 18.6045905],
    [53.7772201, 20.4753882],
    [53.1206304, 17.9984135],
    [53.122197, 18.0000915],
    [53.0102234, 18.6038189],
    [54.3517284, 18.6532037],
    [54.406551, 18.666904],
];
const all_places2 = all_places.slice();

function get_next_random_place() {
    let index = Math.floor(Math.random() * all_places.length);
    let result = all_places.splice(index)[0];
    if (all_places.length === 0)
        all_places = all_places2.slice();
    return {lat: result[0], lng: result[1]}
}

let coordinates = get_next_random_place();

function distance(lat1, lon1, lat2, lon2) {
    let p = 0.017453292519943295;    // Math.PI / 180
    let c = Math.cos;
    let a = 0.5 - c((lat2 - lat1) * p) / 2 + c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p)) / 2;
    return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
}

function init_button() {
    if (minimapMarker.position)
        document.getElementById('submit-button').disabled = false
}

function makeGuess() {
    document.getElementById('minimapWrapper').style.display = "none";
    panorama = new google.maps.Map(document.getElementById('street-view'), {
        center: coordinates,
        zoom: 8,
        mapTypeId: 'roadmap'
    });
    marker1 = new google.maps.Marker({map: panorama, icon: marker_image, title: "Your guess"});
    marker2 = new google.maps.Marker({map: panorama, title: "original location"});
    marker1.setPosition(minimapMarker.position);
    marker2.setPosition(coordinates);
    let path = new google.maps.Polyline({
        path: [{lat: marker1.getPosition().lat(), lng: marker1.getPosition().lng()},
            {lat: marker2.getPosition().lat(), lng: marker2.getPosition().lng()}],
        geodesic: false,
        strokeColor: '#000000',
        strokeOpacity: 1.0,
        strokeWeight: 2
    });
    let dist = distance(marker1.getPosition().lat(), marker1.getPosition().lng(),
        marker2.getPosition().lat(), marker2.getPosition().lng());

    document.getElementById('distance').textContent = dist.toFixed(2);
    document.getElementById('wrapper').classList.add('final');
    document.getElementById('results').style.display = 'block';

    path.setMap(panorama);
    document.getElementById('submit-button').disabled = true

}

function initialize() {
    panorama = new google.maps.StreetViewPanorama(document.getElementById('street-view'), {
        position: coordinates,
        zoom: 1,
        zoomControl: false,
        addressControl: false,
        showRoadLabels: false
    });
    minimap = new google.maps.Map(document.getElementById("minimap"), {
        center: {lat: 52.979667, lng: 19.765556},
        zoom: 6,
        mapTypeId: 'roadmap'
    });

    minimapMarker = new google.maps.Marker({map: minimap, draggable: true, title: "Drag me!"});

    google.maps.event.addListener(minimap, 'click', function (event) {
        minimapMarker.setPosition(event.latLng);
        init_button();
    });
    document.getElementById('submit-button').addEventListener('click', makeGuess);

    marker_image = {
        url: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
        size: new google.maps.Size(20, 32),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(0, 32)
    };

    document.getElementById('next-button').addEventListener('click', () => {
        minimapMarker.setPosition(null);
        coordinates = get_next_random_place();
        panorama = new google.maps.StreetViewPanorama(document.getElementById('street-view'), {
            position: coordinates,
            zoom: 1,
            zoomControl: false,
            addressControl: false,
            showRoadLabels: false
        });
        document.getElementById('wrapper').classList.remove('final');
        document.getElementById('results').style.display = 'none';
        document.getElementById('minimapWrapper').style.display = "block";
    });
}
