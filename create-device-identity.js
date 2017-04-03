'use strict';
var iothub = require('azure-iothub');
const uuidV4 = require('uuid/v4');

var connectionString = 'HostName={AppHostName};SharedAccessKeyName={YourSharedAccessKeyName};SharedAccessKey={YourSharedAccessKey}';

var registry = iothub.Registry.fromConnectionString(connectionString);
var deviceMinLat = 20.577952;
var deviceMinLng = -103.453641;
var deviceMaxLat = 20.739824;
var deviceMaxLng = -103.233220;

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

        // Create object in array to store data
        global.simulatedDevices[deviceData.id] = {};

        // Calculate coordinates
        global.simulatedDevices[deviceData.id].data = {};
        global.simulatedDevices[deviceData.id].data.deviceId = deviceData.id;
        global.simulatedDevices[deviceData.id].data.lat = getRandomCoord(deviceMinLat, deviceMaxLat);
        global.simulatedDevices[deviceData.id].data.lng = getRandomCoord(deviceMinLng, deviceMaxLng);
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
            // Delete from global object
            delete global.simulatedDevices[deviceID];
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

function getRandomCoord(min, max) {
    var coord = parseFloat((Math.random() * (max - min) + min).toFixed(4));
    return coord;
}

module.exports = {
    createDevice: createDevice,
    deleteDevice: deleteDevice
}
