// Ініціалізація карти
var map = L.map('map').setView([41.8781, -87.6298], 12);
L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', { subdomains: ['mt0', 'mt1', 'mt2', 'mt3'] }).addTo(map);

// Змінна для користувача
var currentUser = null;
function setUser() {
    var username = document.getElementById("username").value.trim();
    if (username === "") {
        alert("Будь ласка, введіть ваше ім'я!");
        return;
    }
    currentUser = username;
    document.getElementById("current-user").innerText = "Користувач: " + username;
}

// Група для вибраних доріг
var selectedRoads = [];
var roadLayer = L.geoJSON(null, {
    style: function () { return { color: "yellow", weight: 5 }; },
    onEachFeature: function (feature, layer) {
        layer.on('click', function () {
            if (!selectedRoads.includes(layer)) {
                selectedRoads.push(layer);
                this.setStyle({ color: "red", weight: 7 });
            } else {
                selectedRoads = selectedRoads.filter(r => r !== layer);
                this.setStyle({ color: "yellow", weight: 5 });
            }
        });
    }
}).addTo(map);

// Завантаження доріг
function loadRoads() {
    fetch('roads.geojson')
        .then(response => response.json())
        .then(data => roadLayer.addData(data))
        .catch(error => console.error("Помилка завантаження доріг:", error));
}

// Функція збереження полігону
function savePolygon() {
    if (!currentUser) {
        alert("Будь ласка, введіть ім'я користувача перед створенням полігону!");
        return;
    }
    if (selectedRoads.length < 2) {
        alert("Виберіть хоча б дві дороги!");
        return;
    }

    var polygonCoords = [];
    selectedRoads.forEach(layer => {
        var coords = layer.feature.geometry.coordinates.map(coord => [coord[1], coord[0]]);
        polygonCoords = polygonCoords.concat(coords);
    });
    polygonCoords.push(polygonCoords[0]);

    var newPolygon = {
        type: "Feature",
        properties: { user: currentUser },
        geometry: {
            type: "Polygon",
            coordinates: [polygonCoords]
        }
    };

    console.log("Скопіюйте цей код у `polygons.geojson`:", JSON.stringify(newPolygon, null, 2));
    alert("Полігон збережено! Перевірте Console (`F12`).");
}

// Додаємо кнопку для створення полігону
var saveButton = L.control({ position: 'topright' });
saveButton.onAdd = function () {
    var div = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
    div.innerHTML = '<button style="background: white; padding: 5px;">Зберегти полігон</button>';
    div.onclick = savePolygon;
    return div;
};
saveButton.addTo(map);

// Завантажуємо дороги
loadRoads();
