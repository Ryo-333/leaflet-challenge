// Function to determine marker color based on earthquake depth
function getColor(depth) {
    return depth > 300 ? '#ff0000' : // red
           depth > 200 ? '#ff4000' :
           depth > 100 ? '#ff8000' :
           depth > 50  ? '#ffbf00' :
           depth > 20  ? '#ffff00' : // yellow
                         '#00ff00';  // green
}

// Function to determine marker size based on earthquake magnitude
function getRadius(magnitude) {
    return magnitude * 3; // Scale factor to visually represent magnitude
}

// Function to create features for the earthquakes
function createFeatures(earthquakeData) {
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>Magnitude: " + feature.properties.mag + "<br>Depth: " +
        feature.geometry.coordinates[2] + " km</p>");
    }

    var earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                radius: getRadius(feature.properties.mag),
                fillColor: getColor(feature.geometry.coordinates[2]),
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
        },
        onEachFeature: onEachFeature
    });

    createMap(earthquakes);
}

// Function to initialize and create the map w/ legend
function createMap(earthquakes) {
    var streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
    });

    var map = L.map('map', {
        center: [0, 0],
        zoom: 2,
        layers: [streetmap, earthquakes]
    });

    var mapTitle = L.control({ position: 'topleft' });
    mapTitle.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'map-title');
        div.innerHTML = '<h2>Global Earthquake Activity</h2>';
        return div;
    };
    mapTitle.addTo(map);

    var legend = L.control({ position: 'bottomright' });
    legend.onAdd = function (map) {
        // ... existing legend code ...
    };
    legend.addTo(map);
}
// Fetching the earthquake data
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";
d3.json(queryUrl).then(createFeatures);
