let db;

// Open DB with version 1
let request = indexedDB.open("UpgradEventsDB", 1);

request.onupgradeneeded = function(event) {
    db = event.target.result;

    // Create store only if it doesn't exist
    if (!db.objectStoreNames.contains("events")) {
        let store = db.createObjectStore("events", { keyPath: "id" });
        store.createIndex("name", "name", { unique: false });
        store.createIndex("category", "category", { unique: false });
        console.log("Object store 'events' created");
    }
};

request.onsuccess = function(event) {
    db = event.target.result;
    console.log("Database opened successfully");
};

request.onerror = function() {
    console.log("Database failed to open");
};
