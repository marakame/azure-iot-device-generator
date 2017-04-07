# Azure IoT Device Generator

This project is intended to work as a demo of IoT devices telemetry simulation in the cloud with Azure Web Apps and the Azure IoT Hub and will be presented during the 2017 Technology Conference of UTEG University in Guadalajara. This demo works together with the [IoT Map project](https://github.com/marakame/azure-iot-map) which works as a listener for the data simulated with this app.

## Getting Started

This demo is based on the [Azure docs tutorial for simulating IoT devices with Node.js](https://docs.microsoft.com/en-us/azure/iot-hub/iot-hub-node-node-getstarted), all you need to get started is generating an IoT Hub in Azure, clone the app locally and run it just changing the connection string with your own data as explained in the mentioned tutorial.

### Prerequisites

Having a working Azure IoT Hub , Node.js and optionally the [IoT Map app](https://github.com/marakame/azure-iot-map) to view the results

### Installing

Just clone de project, install the required dependencies with:

```
mpm install
```

and run with:

```
node app.js
```
The app will be available at http://localhost:3001, devices can be created and deleted from the web page and the telemetry simulation for each device can be started and paused from there also.

## Deployment in Azure

The app is ready to be deployed as an Azure web app, if you choose to do so, for the love of God, [use git to deploy your local code](https://docs.microsoft.com/en-us/azure/app-service-web/app-service-deploy-local-git) or use github or Visual Studio but don't try to upload via FTP. It's Hell. You've been warned.

## Acknowledgments

* Ing. Sergio Hernández Hernández for the invitation to create this demo and the opportunity to share it in conference
