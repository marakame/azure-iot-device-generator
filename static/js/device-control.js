var deviceData;

$(document).ready(function () {

    // On Add devie
    $("#add-device").on("click", function () {

        // Make call to create device and get device data back
        $.getJSON("api/create-device", function(data, status){
            deviceData = data;
        })

        // When done add row to table with the retrieved data
        .done(function() {
            var newRow = $("<tr id='" + deviceData.id + "'>");
            var cols = "";
            cols += "<td>" + deviceData.id + "</td>";
            cols += "<td id='" + deviceData.id + "-status'>Stopped</td>";
            cols += "<td><p data-placement='top' data-toggle='tooltip' title='Start'><button onclick='startDevice(\"" + deviceData.id + "\", \"" + deviceData.key + "\")' class='btn btn-success btn-xs' data-title='Start' ><span class='glyphicon glyphicon-play'></span></button></p></td>";
            cols += "<td><p data-placement='top' data-toggle='tooltip' title='Pause'><button onclick='pauseDevice(\"" + deviceData.id + "\")' class='btn btn-warning btn-xs' data-title='Pause' ><span class='glyphicon glyphicon-pause'></span></button></p></td>";
            cols += "<td><p data-placement='top' data-toggle='tooltip' title='Delete'><button onclick='deleteDevice(\"" + deviceData.id + "\")' class='btn btn-danger btn-xs' data-title='Delete' ><span class='glyphicon glyphicon-trash'></span></button></p></td>";

            newRow.append(cols);
            $("#device-table").append(newRow);
        })

        // On fail alert the user
        .fail(function() {
            alert( status );
        });

    });

    // Log buttons actions for testing
    $("#start").on("click", function () {
        console.log("Start!");
    });

    $("#pause").on("click", function () {
        console.log("Pause!");
    });

    $("#delete").on("click", function () {
        console.log("Delete!");

    });

});

function deleteDevice(deviceID){

    $.post("api/delete-device", {deviceID: deviceID}, function(data, status){
        // If response is OK log result and remove from table
        if(data == 'OK'){
            $("#" + deviceID).remove();
            console.log(data);
            console.log(status);
            console.log("Device " + deviceID + " deleted!");
        }
    })

    .fail(function() {
        alert( "Error deleting device." );
    });
}

function startDevice(deviceID, deviceKey){
    // If reponse is OK log result and update table
    $.post("api/start-device", {deviceID: deviceID, deviceKey: deviceKey}, function(data, status){
        if(data == 'OK'){
            console.log("Device " + deviceID + " running...");
            console.log(status);
            $("#" + deviceID + "-status").html("Running");
        }
    })

    .fail(function() {
        alert( "Error starting device." );
    });
}

function pauseDevice(deviceID, deviceKey){
    // If reponse is OK log result and update table
    $.post("api/pause-device", {deviceID: deviceID}, function(data, status){
        if(data == 'OK'){
            console.log("Device " + deviceID + " paused...");
            console.log(status);
            $("#" + deviceID + "-status").html("Paused");
        }
    })

    .fail(function() {
        alert( "Error pausing device." );
    });
}
