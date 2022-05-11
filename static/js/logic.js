// Store our API endpoint as queryURL
let queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Storing d3.json url query in earthquakesData
earthquakesData = d3.json(queryURL);

// Perform a GET request to the query URL
earthquakesData.then(function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features);

    // console.log(data.features[0].geometry.coordinates[0]);
    // console.log(data.features[0].geometry.coordinates[1]);
    // console.log(data.features[0].geometry.coordinates[2]);
});

// Define a function that we want to run once for each feature in the features array.
function createFeatures(earthquakeData) {
    // This function creates the pop-up tool tip that displays the earthquake information at each marker
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>${feature.properties.place}</h3><hr>
        <p>-Time and Date: ${new Date(feature.properties.time)}
        <br>-Details: <a href="${feature.properties.detail}"">${feature.properties.title}</a></p><hr>
        <h3>-Magnitude: ${feature.properties.mag}</h3>
        <h3>-Depth: ${feature.geometry.coordinates[2]}</h3>`);
    };

    // Enlarges the magnitude of each earthquake
    function magnitudeSize(magnitude) {
        if (magnitude < 0) {
            return 2;
        } else if (magnitude == 0) {
            return 4;
        } else if (magnitude > 0) {
            return magnitude * 8;
        }
    };

    // Determines the depth of each earthquake by represent it as colors
    function depthColor(depth) {
        if (depth > -10 && depth < 10) {
            return "green";
        } else if (depth >= 10 && depth < 30) {
            return "lightgreen";
        } else if (depth >= 30 && depth < 50) {
            return "lightsalmon";
        } else if (depth >= 50 && depth < 70) {
            return "orange";
        } else if (depth >= 70 && depth < 90) {
            return "tomato";
        } else if (depth >= 90) {
            return "red";
        } else {
            return "black";
        }
    };

    // Style function for use with the geoJSON layer
    function style(feature) {
        return {
            radius: magnitudeSize(feature.properties.mag),
            fillColor: depthColor(feature.geometry.coordinates[2]),
            color: "black",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        }
    };

    // Create a GeoJSON layer that contains the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    // Use pointToLayer and L.circleMarker to create the circle markers for each earthquake data in earthquakeData object
    let earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng);  
        },
        style: style
    });

    // Send our earthquakes layer to the createMap function/
    createMap(earthquakes);
};

function createMap(earthquakes) {
    // Base layer map
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    // Topography layer map
    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

    // Dark layer map
    let darkmap = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
	    attribution: '© <a href="https://stadiamaps.com/">Stadia Maps</a>, © <a href="https://openmaptiles.org/">OpenMapTiles</a> © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
    });

    // Create a baseMaps object.
    let baseMaps = {
        "Street Map": street,
        "Topographic Map": topo,
        "Dark Map": darkmap
    };

    // Create an overlay object to hold our overlay.
    let overlayMaps = {
        Earthquakes: earthquakes
    };

    // Create our map, giving it the streetmap and earthquakes layers to display on load.
    let myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 4,
        layers: [street, earthquakes]
    });

    // Create a layer control.
    // Pass it our baseMaps and overlayMaps.
    // Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    // Set up the legend.
    let legend = L.control({ position: "bottomright"});
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
        let magnitudeColor = [0, 1, 2, 3, 4, 5, 6]
        let colorlabel = ["green", "lightgreen", "lightsalmon", "orange", "tomato", "red"]
        var labels = [];

        // Add the minimum and maximum.
        let legendInfo = "<h1>Earthquake Depth Color</h1>" +
        "<div class=\"labels\">" +
            "<div class=\"min\">" + magnitudeColor[0] + "</div>" +
            "<div class=\"max\">" + magnitudeColor[magnitudeColor.length - 1] + "</div>" +
        "</div>";

        div.innerHTML = legendInfo;

        limits.forEach(function(limit, index) {
            labels.push("<li style=\"background-color: " + colorlabel[index] + "\"></li>");
        });

        div.innerHTML += "<ul>" + labels.join("") + "</ul>";
        return div;
    };

    // Adding the legend to the map
    legend.addTo(myMap);

};
  
















// Tried to make the depth of the circle markers change according to the depth size
//
// function geojsonMarkerOptions(feature) {
//     function depthSize(depth) {
//         if (depth == 0) {
//             return 1;
//         } else if (depth > 0) {
//             return depth * 50;
//         } else {
//             return "error";
//         }
//     };

//     for (let i = 0; i < earthquakeData.length; i++) {
//         // console.log(earthquakeData[i].geometry.coordinates[2])

//         var earthMarkers = {
//             radius: depthSize(earthquakeData[i].geometry.coordinates[2]),
//             fillColor: "#ff7800",
//             color: "#000",
//             weight: 1,
//             opacity: 1,
//             fillOpacity: 0.8
//         };
//         return earthMarkers;
//     };

// };