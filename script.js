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
            style: function (feature) {
                return {
                    color: feature.properties.role === "RN" ? "blue" : "red", // Полігон для медсестри синій
                    weight: 2,
                    fillOpacity: 0.3
                };
            },
            onEachFeature: function (feature, layer) {
                let cityName = feature.properties.name;
                let role = feature.properties.role || "невідомо"; // Додаємо роль (якщо є)
                let people = feature.properties.people ? feature.properties.people.join(", ") : "Немає даних"; // Перевіряємо список людей
                
                if (feature.geometry.type === "Polygon") {
                    layer.bindPopup(`<b>${cityName}</b><br>Роль: ${role}`);
                } else {
                    layer.bindPopup(`<b>${cityName}</b><br>Люди: ${people}`);
                }
            }
        }).addTo(map);
    })
    .catch(error => console.error("Помилка завантаження GeoJSON:", error));
