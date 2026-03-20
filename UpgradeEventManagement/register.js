let db;

let request = indexedDB.open("UpgradEventsDB", 1);

request.onsuccess = function (e) {
    db = e.target.result;
    showEvent();
};

request.onerror = function () {
    console.log("DB error");
};

function showEvent() {

    let params = new URLSearchParams(window.location.search);
    let id = params.get("id");

    if (!id) {
        alert("Event not found");
        return;
    }

    let tx = db.transaction("events", "readonly");
    let store = tx.objectStore("events");

    let req = store.get(id);

    req.onsuccess = function () {

        let ev = req.result;

        if (!ev) {
            alert("Event not found");
            return;
        }

        document.getElementById("eventId").textContent = ev.id;
        document.getElementById("eventName").textContent = ev.name;
        document.getElementById("eventCategory").textContent = ev.category;
        document.getElementById("eventDate").textContent = ev.date;
        document.getElementById("eventTime").textContent = ev.time;
    };
}

function registerEvent(e) {

    e.preventDefault();

    alert("You are successfully registered to this event!");
    e.target.reset();
}