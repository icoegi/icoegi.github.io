// Script for map
// Maps can be changed: look here https://leafletjs.com/
var map = L.map('map')

// standard map
// L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
// }).addTo(map);

// black map
// L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
//     maxZoom: 18,
//     attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a> contributors'
// }).addTo(map);

// simple map
var positron = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attribution">CARTO</a>'
}).addTo(map);

// Fetch cities data from CSV file
fetch('cities.csv')
.then(response => response.text())
.then(data => {
    // Parse CSV data
    const cities = [];
    const x_coords = [];
    const y_coords = [];
    const rows = data.trim().split('\n');
    rows.forEach(row => {
        const columns = row.split(',');
        x_coord = parseFloat(columns[1]);
        y_coord = parseFloat(columns[2]);
        const city = {
            name: columns[0].trim(),
            coords: [x_coord, y_coord],
            photo: "polaroids/".concat(columns[0].replace(/\s/g, ""), ".jpg")
        };
        cities.push(city);
        x_coords.push(x_coord);
        y_coords.push(y_coord);
    });

    // Center map on the available coordinates
    x_center = (Math.max(...x_coords) - Math.min(...x_coords)) / 2 + Math.min(...x_coords);
    y_center = (Math.max(...y_coords) - Math.min(...y_coords)) / 2 + Math.min(...y_coords);
    map.setView([x_center, y_center], 6);

    // Define custom icon
    var customIcon = L.icon({
        iconUrl: "marker.png",
        iconSize: [32, 32], // size of the icon
        iconAnchor: [16, 32], // point of the icon which will correspond to marker's location
        popupAnchor: [0, -32] // point from which the popup should open relative to the iconAnchor
    });

    // Draw markers and trajectories
    cities.forEach(city => {
        var marker = L.marker(city.coords, { icon: customIcon }).addTo(map);
        marker.bindPopup("<b>" + city.name.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase()) + "</b><br><img src='" + city.photo + "' width='200'>", {
            keepInView: true // Ensure popup stays in view
        });
    });

    // Example trajectory
    // var trajectory = L.polyline([cities[0].coords, cities[1].coords], {color: 'red'}).addTo(map);
})
.catch(error => console.error('Error fetching CSV file:', error));
