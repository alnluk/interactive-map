// Ініціалізація карти
var map = L.map('map').setView([41.8781, -87.6298], 12);
L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', { subdomains: ['mt0', 'mt1', 'mt2', 'mt3'] }).addTo(map);

// Масив для збереження користувачів
let clinicians = [];

// Додавання нового користувача
document.getElementById("new-clinician-btn").addEventListener("click", function () {
    document.getElementById("clinician-form").classList.toggle("hidden");
});

document.getElementById("create-clinician").addEventListener("click", function () {
    let name = document.getElementById("clinician-name").value.trim();
    let role = document.getElementById("clinician-role").value;
    
    if (name === "") {
        alert("Будь ласка, введіть ім'я!");
        return;
    }

    let clinician = { name: name, role: role, polygon: null };
    clinicians.push(clinician);
    updateClinicianList();
    
    // Ховаємо форму після створення
    document.getElementById("clinician-form").classList.add("hidden");
    document.getElementById("clinician-name").value = "";
});

// Оновлення списку користувачів
function updateClinicianList() {
    let list = document.getElementById("clinician-list");
    list.innerHTML = ""; // Очищаємо список

    clinicians.forEach((clinician, index) => {
        let div = document.createElement("div");
        div.classList.add("clinician-item");
        div.innerHTML = `
            <span>${clinician.name} (${clinician.role})</span>
            <button onclick="startPolygon(${index})">...</button>
        `;
        list.appendChild(div);
    });
}

// Початок створення полігону для користувача
function startPolygon(index) {
    alert(`Тепер можна створювати полігон для ${clinicians[index].name}`);
}
