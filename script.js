// Ініціалізація карти
var map = L.map('map').setView([41.8781, -87.6298], 12);
L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', { subdomains: ['mt0', 'mt1', 'mt2', 'mt3'] }).addTo(map);

// Перевірка наявності карти
console.log("Карта успішно завантажена!");

// Перевірка користувача
var currentUser = null;
function setUser() {
    var username = document.getElementById("username").value.trim();
    if (username === "") {
        alert("Будь ласка, введіть ваше ім'я!");
        return;
    }
    currentUser = username;
    document.getElementById("current-user").innerText = "Користувач: " + username;
    console.log("Користувач вибраний:", username);
}

// Група для вибраних доріг
var selectedRoads = [];
var roadLayer = L.geoJSON(null, {
    style: function () { return { color: "yellow", weight: 5 }; }, // Початковий колір доріг
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
                console.log("Додана дорога:", feature.properties.name);
            } else {
                selectedRoads = selectedRoads.filter(r => r !== layer);
                this.setStyle({ color: "yellow", weight: 5 }); // Видалення з вибору
                console.log("Видалена дорога:", feature.properties.name);
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
            console.log("Дороги завантажені:", data);
            roadLayer.addData(data);
        })
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
    polygonCoords.push(polygonCoords[0]); // Закриваємо контур

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

// Кнопка для збереження полігону
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
