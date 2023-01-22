// var newYorkCoords = [40.73, -74.0059];
// var mapZoomLevel = 12;

//create the createMap function
function createMap(earthQuakes) {
console.log(earthQuakes)
    //Create the tile layer that will be the background
    let map = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
    console.log(map)
    //Create basemaps to hold the lightmap layer
    let baseMaps = {
            Map: map
        };

    let overlayMaps = {
        earth_quakes: earthQuakes
    }

    //Create the map object 
    let myMap = L.map("map", {
        center: [40.73, -74.0059],
        zoom: 15
    });

    // create a layer control, and pass it baseMaps and overLayMaps
    L.control.layers(baseMaps, overlayMaps).addTo(myMap)}

//Create the createMarkers function.
function createMarkers(response) {
    //Pull the stations property form the response.features
    let quakes = response.features

    //Past to layer, will fill below with leaflet circle layer
    let quakelayer = L.layerGroup();

    //define function to get color for depth
    function depthcolor(x) {
        return x > 90 ? "#de2d26":
                x >= 70 ? "#fc9272":
                x >=50 ? "#fdae6b":
                x >=30 ? "#fec44f":
                x >=10  ? "#fff7bc":
                x >= -10 ? "#2ac25f":
                '#FFEDA0';
        }
        
    //define function that points to marker layer and will get information to fill
    function pointToLayer(geoJsonPoint, latlng) {
        //use circle markers
        return L.circleMarker(latlng);
    }
    
    //style circle markers
    function style(feature) {
        return {
            radius: (feature.properties.mag)*4, 
            color: depthcolor(feature.geometry.coordinates[2])
        }
    }
    
    L.geoJSON(response, {
        pointToLayer,
        style,
    }).addTo(quakelayer)

    createMap(quakelayer)


}

const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"

d3.json(url).then(function(response) {
    createMarkers(response)
    console.log(response)
})