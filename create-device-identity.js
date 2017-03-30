'use strict';
var iothub = require('azure-iothub');
const uuidV4 = require('uuid/v4');

var connectionString = 'HostName={AppHostName};SharedAccessKeyName={YourSharedAccessKeyName};SharedAccessKey={YourSharedAccessKey}';

var registry = iothub.Registry.fromConnectionString(connectionString);

function createDevice(deviceID){
    var device = new iothub.Device(null);
    device.deviceId = deviceID;
    registry.create(device, function(err, deviceInfo, res) {
      if (err) {
        registry.get(device.deviceId, printDeviceInfo);
      }
      if (deviceInfo) {
        printDeviceInfo(err, deviceInfo, res)
      }
    });
}

function printDeviceInfo(err, deviceInfo, res) {
  if (deviceInfo) {
    console.log('Device ID: ' + deviceInfo.deviceId);
    console.log('Device key: ' + deviceInfo.authentication.symmetricKey.primaryKey);
  }
}

function createID(){
    console.log("Creating ID for device...");

    var deviceID = uuidV4();
    console.log(deviceID);

    return deviceID;
}

module.exports = {
    createID: createID
}
