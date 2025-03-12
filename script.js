// Ініціалізація карти
var map = L.map('map').setView([41.8781, -87.6298], 12); // Чикаго, Іллінойс

// Використання Google Maps Default Style
var googleMaps = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    attribution: '&copy; Google Maps'
}).addTo(map);

// Група для вибраних доріг
var selectedRoads = [];
var roadLayer = L.geoJSON(null, {
    style: function () {
        return { color: "yellow", weight: 5 }; // Початковий колір доріг
    },
    onEachFeature: function (feature, layer) {
        layer.on('mouseover', function () {
            this.setStyle({ color: "orange", weight: 7 }); // Підсвітка при наведенні
        });
        layer.on('mouseout', function () {
            if (!selectedRoads.includes(layer)) {
                this.setStyle({ color: "yellow", weight: 5 }); // Повернення стилю
            }
        });
        layer.on('click', function () {
            if (!selectedRoads.includes(layer)) {
                selectedRoads.push(layer);
                this.setStyle({ color: "red", weight: 7 }); // Виділення вибраних доріг
            } else {
                selectedRoads = selectedRoads.filter(r => r !== layer);
                this.setStyle({ color: "yellow", weight: 5 }); // Видалення з вибору
            }
        });
    }
}).addTo(map);

// Функція завантаження доріг
function loadRoads() {
    fetch('roads.geojson')
        .then(response => {
            if (!response.ok) {
                throw new Error("Помилка завантаження roads.geojson");
            }
            return response.json();
        })
        .then(data => {
            console.log("Дороги успішно завантажені", data);
            roadLayer.addData(data);
        })
        .catch(error => console.error("Помилка завантаження доріг:", error));
}

// Кнопка для завершення вибору доріг і створення полігону
var finishButton = L.control({ position: 'topright' });
finishButton.onAdd = function () {
    var div = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
    div.innerHTML = '<button style="background: white; padding: 5px;">Створити полігон</button>';
    div.onclick = function () {
        if (selectedRoads.length < 2) {
            alert("Виберіть хоча б дві дороги!");
            return;
        }

        var polygonCoords = [];
        selectedRoads.forEach(layer => {
            var coords = layer.feature.geometry.coordinates.map(coord => [coord[1], coord[0]]);
            polygonCoords = polygonCoords.concat(coords);
        });

        polygonCoords.push(polygonCoords[0]); // Закриваємо контур

        var polygon = L.polygon(polygonCoords, { color: "blue", weight: 3, fillOpacity: 0.4 }).addTo(map);
        console.log("Скопіюй ці координати в cities.geojson:", JSON.stringify(polygonCoords, null, 2));
        alert("Координати полігону збережено в консолі. Відкрий Console (F12) та скопіюй.");
    };
    return div;
};
finishButton.addTo(map);

// Завантажуємо дороги
loadRoads();
