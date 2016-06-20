function DFU(connectionHandle) {
    this.connection = connectionHandle;
}

DFU.Request = {
    DETACH: 0,
    DNLOAD: 1,
    UPLOAD: 2,
    GETSTATUS: 3,
    CLRSTATUS: 4,
    GETSTATE: 5,
    ABORT: 6;
};



DFU.prototype.getTime = function() {
    this.md380_custom(0x91, 0x01);
    this.md380_custom(0xa2, 0x08);
    var time = this.upload(0, 7);

    return time;
}

DFU.prototype.md380_custom = function(a, b, callback) {
    var self = this;
    var transferInfo = { "requestType": "class",
                         "recipient": "interface",
                         "direction": "out",
                         "request": DFU.Request.DNLOAD,
                         "value": 0,
                         "index": 0,
                         "data": new Uint8Array([a, b]).buffer };
                         
    chrome.usb.controlTransfer(self.connection, transferInfo, function() {
        self.getStatus(function() {
            // TODO: add setTimeout here?
            self.getStatus(function(status) {
                if (status[2] == DFU.State.dfuDNLOAD_IDLE) {
                    self.enterDFUMode(function() { callback(true) });
                } else {
                    callback(false);
                }
            });
        });
    });
}

DFU.prototype.getStatus = function(callback) {
    var transferInfo = { "requestType": "class",
                         "recipient": "interface",
                         "direction": "in",
                         "request": DFU.Request.GETSTATUS,
                         "value": 0,
                         "index": 0,
                         "length": 6,
                         "data": new Uint8Array([]) };
    function unwrappingCallback() {
        // TODO: implement struct.unpack
        var unwrapped = struct.unpack('<BBBBBB', data);
        callback(unwrapped);
    }
    chrome.usb.controlTransfer(this.connection, transferInfo, unwrappingCallback);
}

