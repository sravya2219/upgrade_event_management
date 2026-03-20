// ===============================
// IndexedDB Setup
// ===============================
let db;

let request = indexedDB.open("UpgradEventsDB", 1); // Keep version 1

request.onupgradeneeded = function (e) {
    db = e.target.result;

    // Only create store if it doesn't exist
    if (!db.objectStoreNames.contains("events")) {
        let store = db.createObjectStore("events", { keyPath: "id" });
        store.createIndex("name", "name", { unique: false });
        store.createIndex("category", "category", { unique: false });
    }
};

request.onsuccess = function (e) {
    db = e.target.result;
    console.log("Database opened successfully");

    // Load events on page
    if (typeof displayEvents === "function") displayEvents();
};

request.onerror = function () {
    console.log("Database failed to open");
};

// ===============================
// Admin Check
// ===============================
if (!localStorage.getItem("admin")) {
    alert("Please login first");
    window.location = "login.html";
}

function logout() {
    localStorage.removeItem("admin");
    window.location = "login.html";
}

// ===============================
// Add Event
// ===============================
function addEvent(e) {
    e.preventDefault();

    let id = document.getElementById("id").value;
    let name = document.getElementById("name").value;
    let category = document.getElementById("category").value;
    let date = document.getElementById("date").value;
    let time = document.getElementById("time").value;
    let url = document.getElementById("url").value;

    let tx = db.transaction("events", "readwrite");
    let store = tx.objectStore("events");

    let request = store.add({ id, name, category, date, time, url });

    request.onsuccess = function () {
        alert("Event Added");
        displayEvents();
        e.target.reset();
    };

    request.onerror = function () {
        alert("Event ID already exists!");
    };
}

// ===============================
// Display Events
// ===============================
function displayEvents() {
    let list = document.getElementById("eventList");
    if (!list) return;

    list.innerHTML = "";

    let tx = db.transaction("events", "readonly");
    let store = tx.objectStore("events");

    store.openCursor().onsuccess = function (e) {
        let cursor = e.target.result;
        if (cursor) {
            let ev = cursor.value;

            list.innerHTML += `
                <div class="event-card">
                    <h3>${ev.name}</h3>
                    <p>ID: ${ev.id}</p>
                    <p>Category: ${ev.category}</p>
                    <p>Date: ${ev.date}</p>
                    <p>Time: ${ev.time}</p>
                    <button onclick="window.open('${ev.url}', '_blank')" class="join-btn">Join Event</button>
                    <button onclick="deleteEvent('${ev.id}')" class="delete-btn">Delete</button>
                </div>
            `;
            cursor.continue();
        }
    };
}

// ===============================
// Delete Event
// ===============================
function deleteEvent(id) {
    let tx = db.transaction("events", "readwrite");
    let store = tx.objectStore("events");

    let request = store.delete(id);

    request.onsuccess = function () {
        alert("Event Deleted");
        displayEvents();
    };
}

// ===============================
// Search Event
// ===============================
function searchEvent() {
    let type = document.getElementById("searchType").value;
    let value = document.getElementById("searchValue").value.toLowerCase();
    let list = document.getElementById("eventList");
    list.innerHTML = "";

    if (type === "" || value === "") {
        alert("Please select type and enter value");
        return;
    }

    let tx = db.transaction("events", "readonly");
    let store = tx.objectStore("events");

    store.openCursor().onsuccess = function (e) {
        let cursor = e.target.result;
        if (cursor) {
            let ev = cursor.value;
            let match = false;

            if (type === "id" && ev.id.toString().includes(value)) match = true;
            if (type === "name" && ev.name.toLowerCase().includes(value)) match = true;
            if (type === "category" && ev.category.toLowerCase().includes(value)) match = true;

            if (match) {
                list.innerHTML += `
                    <div class="event-card">
                        <h3>${ev.name}</h3>
                        <p>ID: ${ev.id}</p>
                        <p>Category: ${ev.category}</p>
                        <p>Date: ${ev.date}</p>
                        <p>Time: ${ev.time}</p>
                        <button onclick="window.open('${ev.url}', '_blank')" class="join-btn">Join Event</button>
                        <button onclick="deleteEvent('${ev.id}')" class="delete-btn">Delete</button>
                    </div>
                `;
            }

            cursor.continue();
        } else {
            // reset search fields
            document.getElementById("searchType").value = "";
            document.getElementById("searchValue").value = "";
        }
    };
}
