'use strict';
// Require the Azure IoT Hub module
var iothub = require('azure-iothub');
const uuidV4 = require('uuid/v4');

// ***** IMPORTANT ***** //
// Define the connection string
// Substitute values with actual values from your Azure portal
var connectionString = 'HostName={AppHostName};SharedAccessKeyName={YourSharedAccessKeyName};SharedAccessKey={YourSharedAccessKey}';

// Create IoT Hub registry object with the connection string
// The registry has the functions needed for creating and manipulating devices
var registry = iothub.Registry.fromConnectionString(connectionString);

// Set min and max values to the coordinates that will be assigned to the devices
var deviceMinLat = 20.630286;
var deviceMinLng = -103.405237;
var deviceMaxLat = 20.706943;
var deviceMaxLng = -103.297874;

// The createDevice function will call the registry to create the device in the
// Azure IoT Hub, assign initial values to it and save those values to a global
// device array. There are more elegant ways to assign fixed values like the
// coordinates of the device as metadata of such device, however, for demoing
// purposes said values will be stored in the devices array as normal associated
// data.
function createDevice(callback){
    // Create the device object and a variable for holding the data
    var device = new iothub.Device(null);
    var deviceData = {};

    // Create a UUID to identify the device
    device.deviceId = createID();

    // Call the registry to create the device
    registry.create(device, function(err, deviceInfo, res) {
        if (err) {
            registry.get(device.deviceId, printDeviceInfo);
            callback(err, deviceInfo);
        }

        if (deviceInfo) {
            // If we get a successful response, print the data to the console and
            // save the device ID we created and the device primary key to the
            // object that we will send as response.
            // The primary key is necessary to interact with each device and
            // should be protected, however, for this demo we will be sending it
            // to the client apllication so that the application can make
            // a complete call (i.e. with device ID and device primary key)
            // to the backend when requesting a method.
            printDeviceInfo(err, deviceInfo, res)
            deviceData.id = deviceInfo.deviceId;
            deviceData.key = deviceInfo.authentication.symmetricKey.primaryKey;

            // Create object in global array to store the device data which
            // we will use later in the simulation
            global.simulatedDevices[deviceData.id] = {};

            // Calculate coordinates for the device
            global.simulatedDevices[deviceData.id].data = {};
            global.simulatedDevices[deviceData.id].data.deviceId = deviceData.id;
            global.simulatedDevices[deviceData.id].data.lat = getRandomCoord(deviceMinLat, deviceMaxLat);
            global.simulatedDevices[deviceData.id].data.lng = getRandomCoord(deviceMinLng, deviceMaxLng);
        }

        callback(err, deviceData);

        });
    }
// The deleteDevice function will call the registry to delete the device from the
// Azure IoT hub.
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

// Function to print a device info to the console.
function printDeviceInfo(err, deviceInfo, res) {
  if (deviceInfo) {
    console.log('Device ID: ' + deviceInfo.deviceId);
    console.log('Device key: ' + deviceInfo.authentication.symmetricKey.primaryKey);
  }
}

// Function to create an UUID for a device
function createID(){
    console.log("Creating ID for device...");

    var deviceID = uuidV4();
    console.log("ID " + deviceID + " created.");

    return deviceID;
}

// Function to get a random coordinate within the bounds specified
function getRandomCoord(min, max) {
    var coord = parseFloat((Math.random() * (max - min) + min).toFixed(4));
    return coord;
}

// Functions to expose to other modules
module.exports = {
    createDevice: createDevice,
    deleteDevice: deleteDevice
}
