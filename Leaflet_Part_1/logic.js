
//create the createMap function
function createMap(earthQuakes) {

    //Create the tile layer that will be the background
    let map = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })

    //Create basemaps to hold the lightmap layer
    let baseMaps = {
            map: map
        };

    let overlayMaps = {
        earth_quakes: earthQuakes
    }

    //Create the map object 
    let myMap = L.map("map-id", {
        center: [37.09, -95.71],
        zoom: 5
    });

    // create a layer control, and pass it baseMaps and overLayMaps
    L.control.layer(baseMaps, overlayMaps).addTo(myMap)}

//Create the createMarkers function.
function createMarkers(response) {
    //Pull the stations property form the response.features
    let quakes = response.features

    // initialize an array to hold the earthquake locations
    let quake_locations = []

    //loop through the sations array

    for (var i=0; i < quakes.length; i++) {
        quake_locations.push(
            L.marker([quakes[i].geometry.coordinates]).bindPopup("<h1>" + "magintude: " + quakes[i].properties.mag + "</h1")

        );
    }
    let quakelayer = L.layerGroup(quake_locations);
    createMap(quakelayer);

}

const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"

d3.json(url).then(function(response) {
    createMarkers(response)
})