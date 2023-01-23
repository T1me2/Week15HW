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
        minZoom: 0,
        maxzoom: 0
    });
    myMap.setView([0,0], 2);

    //create legend for map 
    let legend = L.control({position: 'bottomright'});

    legend.onAdd = function () {

        let div = L.DomUtil.create('div', 'info legend'),
            grades = [-10, 10, 30, 50, 70, 90],
            color = ["#2ac25f", "#fff7bc", "#fec44f", "#fdae6b", "#fc9272", "#de2d26"];

            for (var i = 0; i < grades.length; i++) {
                div.innerHTML +=
                    '<i style="background:' + color[i] + '"></i> ' +
                    grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
            }
        
            return div;
    };


    legend.addTo(myMap);
    
    L.control.layers(baseMaps, overlayMaps).addTo(myMap)}
    

//Create the createMarkers function.
function createMarkers(response) {
    //Pull the stations property form the response.features
    let quakes = response.features

    //Pass to layer, will fill below with leaflet circle layer
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
            radius: (feature.properties.mag)*2, 
            color: depthcolor(feature.geometry.coordinates[2])
        }
    }

    //create fuction that pulls metadata to later be put in popup
    function onEachFeature(feature, layer) {
        layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
    }

    //pass above information into map 
    L.geoJSON(response, {
        pointToLayer,
        style,
        onEachFeature,
    }).addTo(quakelayer)

    createMap(quakelayer)



}

const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"

d3.json(url).then(function(response) {
    createMarkers(response)
    console.log(response)
})

