/*function loadSetUp() {
    var location = localStorage["location"];
    var name = localStorage["name"];
}*/

function save_options() {
    var user_name = document.getElementsByName("name");
    var user_location = document.getElementsByName("location");

    chrome.storage.sync.set({
        name: user_name,
        location: user_location
    }, function() {
        // Notify user options were saved
        var status = document.getElementById("status");
        status.textContent.fontcolor("red"); // y dis not work lol
        status.textContent = "WOO! Saved!";
        setTimeout(function() {
            status.textContent = '';
        }, 750);
    });
}

function restore_options() {
    // Default name = "User" and location = "Stockton, CA"
    chrome.storage.sync.get({
        name: "User",
        location: "Stockton, CA"
    }, function(items) {
        document.getElementsByName("name") = items.name;
        document.getElementsByName("location") = items.location;
    });
}

document.addEventListener("DOMContentLoaded", restore_options);
document.getElementById("save").addEventListener("click", save_options);

