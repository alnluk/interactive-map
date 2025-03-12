// Ініціалізація карти
var map = L.map('map').setView([41.8781, -87.6298], 10); // Чикаго, Іллінойс

// Використання Google Maps Default Style
var googleMaps = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    attribution: '&copy; Google Maps'
}).addTo(map);

// Завантаження GeoJSON з містами
fetch('cities.geojson')
    .then(response => response.json())
    .then(data => {
        L.geoJSON(data, {
            style: function (feature) {
                return {
                    color: feature.properties.role === "RN" ? "blue" : "red", // Полігон RN синій
                    weight: 2,
                    fillOpacity: 0.3
                };
            },
            onEachFeature: function (feature, layer) {
                let cityName = feature.properties.name || "Невідомо";
                let role = feature.properties.role || "Невідомо";
                
                if (feature.geometry.type === "Polygon") {
                    layer.bindPopup(`<b>${cityName}</b><br>Роль: ${role}`);
                } else {
                    let people = feature.properties.people ? feature.properties.people.join(", ") : "Немає даних";
                    layer.bindPopup(`<b>${cityName}</b><br>Люди: ${people}`);
                }
            }
        }).addTo(map);
    })
    .catch(error => console.error("Помилка завантаження GeoJSON:", error));

// Додаємо інструмент малювання
var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

var drawControl = new L.Control.Draw({
    edit: { featureGroup: drawnItems },
    draw: {
        polygon: true,
        marker: false,
        circle: false,
        rectangle: false,
        polyline: false
    }
});
map.addControl(drawControl);

// Отримання координат після малювання
map.on(L.Draw.Event.CREATED, function (event) {
    var layer = event.layer;
    drawnItems.addLayer(layer);

    var coordinates = layer.getLatLngs()[0].map(coord => [coord.lng, coord.lat]);
    coordinates.push(coordinates[0]); // Закриваємо контур

    console.log("Скопіюй ці координати в cities.geojson:", JSON.stringify(coordinates, null, 2));
    alert("Координати збережено в консолі. Відкрий Console (F12) та скопіюй.");
});
