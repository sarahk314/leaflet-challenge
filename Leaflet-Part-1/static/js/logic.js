/// From 01-Ins_Basic_Map
// Initial map object
let myMap = L.map("map", {
  center: [37.59, -109.74],
  zoom: 5

});

// Add a tile layer 
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Assign copied URL as variable
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"


// Assign marker color
// Leaflet color codes
// https://github.com/pointhi/leaflet-color-markers
// Blue #3274A3
// Gold #C1A32D
// Red #982E40
// Green #31882A
// Violet #742E98
// Black #313131

function markercolor(depth) {
    if (depth < 10) return "#3274A3";
    else if (depth < 30) return "#C1A32D";
    else if (depth < 50) return "#982E40";
    else if (depth < 70) return "#31882A";
    else if (depth < 90) return "#742E98";
    else return "#313131";
};


// Assign marker size
function markersize(magnitude) {
    return magnitude * 2000;
};


// Loops and loops
d3.json(url).then((data) => {

    console.log(data);

    let features = data.features;

    console.log("Features", features);
    console.log("Magnitude", features[0].properties.mag);
    console.log("Time", features[0].properties.time);
    console.log("Coordinates", features[0].geometry.coordinates);
    console.log("Latitude", features[0].geometry.coordinates[0]);
    console.log("Longitude", features[0].geometry.coordinates[1]);
    console.log("Depth", features[0].geometry.coordinates[2]);
    
    let location = [];
    for (let i=0; i<features.length; i++) {

        let lat = features[i].geometry.coordinates[0];
        let lon = features[i].geometry.coordinates[1];

        location.push([lon, lat]);
    };

    console.log("Locations", location);


    for (let j=0; j<location.length; j++) {

        let mag = features[j].properties.mag;
        let depth = features[j].geometry.coordinates[2];

        L.circle(location[j], {
            fillOpacity: 0.75,
            color: markercolor(depth),
            fillColor: markercolor(depth),
            radius: markersize(mag),
        }).bindPopup(`<h3> Coordinates: ${location[j]}</h3> 
        <hr> 
        <p> Magntitude: ${mag} </p>
        <p> Depth: ${depth} </p>`).addTo(myMap);
    };


    // Legend

    let legend = L.control({position: "bottomright"});

    legend.onAdd = () => {

        let div = L.DomUtil.create("div", "info legend");
        bins = [-10, 10, 30, 50, 70, 90];

        div.innerHTML += "<h3 style='text-align: center'>Depth</h3>"

        for (let i=0; i<bins.length; i++) {
            div.innerHTML +=
            '<i style="background:' + markercolor(bins[i] + 1) + '"></i> ' +
            bins[i] + (bins[i + 1] ? '&ndash;' + bins[i + 1] + '<br>' : '+');
        }
        return div;
    };
    legend.addTo(myMap);

});


