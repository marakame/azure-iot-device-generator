'use strict';
var iothub = require('azure-iothub');
const uuidV4 = require('uuid/v4');

var connectionString = 'HostName={AppHostName};SharedAccessKeyName={YourSharedAccessKeyName};SharedAccessKey={YourSharedAccessKey}';

var registry = iothub.Registry.fromConnectionString(connectionString);

function createDevice(callback){
    var device = new iothub.Device(null);
    var deviceData = {};

    device.deviceId = createID();
    registry.create(device, function(err, deviceInfo, res) {
      if (err) {
        registry.get(device.deviceId, printDeviceInfo);
        callback(err, deviceInfo);
      }
      if (deviceInfo) {
        printDeviceInfo(err, deviceInfo, res)
        deviceData.id = deviceInfo.deviceId;
        deviceData.key = deviceInfo.authentication.symmetricKey.primaryKey;
      }

      callback(err, deviceData);

    });
}

function deleteDevice(deviceID, callback){
    console.log("Deleting device " + deviceID + "...");

    registry.delete(deviceID, function(err, data) {
        if (err) {
            registry.get(device.deviceId, printDeviceInfo);
            callback(err, data);
        } else {
            callback(err, 'OK');
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
    console.log("ID " + deviceID + " created.");

    return deviceID;
}

module.exports = {
    createDevice: createDevice,
    deleteDevice: deleteDevice
}
