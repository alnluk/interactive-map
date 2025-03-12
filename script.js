// Ініціалізація карти
var map = L.map('map').setView([41.8781, -87.6298], 10); // Чикаго, Іллінойс

// Додаємо тайли OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Завантаження GeoJSON з містами
fetch('cities.geojson')
    .then(response => response.json())
    .then(data => {
        L.geoJSON(data, {
            onEachFeature: function (feature, layer) {
                let cityName = feature.properties.name;
                let people = feature.properties.people.join(", ");
                layer.bindPopup(`<b>${cityName}</b><br>Люди: ${people}`);
            }
        }).addTo(map);
    });
