let db;

let request = indexedDB.open("UpgradEventsDB", 1);

request.onsuccess = function (e) {
    db = e.target.result;

    loadEvents();
};

function loadEvents() {

    let container = document.getElementById("homeEvents");

    if (!container) return;

    container.innerHTML = "";

    let tx = db.transaction(["events"], "readonly");

    let store = tx.objectStore("events");

    store.openCursor().onsuccess = function (e) {

        let cursor = e.target.result;

        if (cursor) {

            let ev = cursor.value;

            container.innerHTML += `

<div class="col-12 col-md-6 col-lg-4">

<div class="card p-3 mt-3 shadow-sm">

<h5>${ev.name}</h5>

<p>${ev.category}</p>

<p>${ev.date}</p>

<p>${ev.time}</p>

<a href="register.html?id=${ev.id}" class="btn btn-primary">
Register
</a>

</div>

</div>

`;

            cursor.continue();
        }

    };

}