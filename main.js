var logs = document.getElementById("log");

function log(message) {
    var entry = document.createElement("li");
    var text = document.createTextNode(message);
    entry.appendChild(text);
    logs.appendChild(entry);
}

log("app loaded");

chrome.usb.getDevices({}, function(devices) {
    if (devices) {
        if (devices.length > 0) {
            for (var i = 0; i < devices.length; i++) {
                var d = devices[i];
                log(["found: ", d.manufacturerName, d.productName, d.serialNumber, d.version].join(" "));
            }
        } else {
            log("No devices found");
        }
    } else {
        log("Permission denied.");
    }
});
