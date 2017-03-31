var deviceData;

$(document).ready(function () {

    $("#add-device").on("click", function () {

        $.getJSON("api/create-device", function(data, status){
            deviceData = data;
        })

        .done(function() {
            var newRow = $("<tr id='" + deviceData.id + "'>");
            var cols = "";
            cols += "<td>" + deviceData.id + "</td>";
            cols += "<td>20.4984651</td>"
            cols += "<td>-103.1984156654</td>"
            cols += "<td>32</td>";
            cols += "<td><p data-placement='top' data-toggle='tooltip' title='Start'><button onclick='startDevice(\"" + deviceData.id + "\", \"" + deviceData.key + "\")' class='btn btn-success btn-xs' data-title='Start' ><span class='glyphicon glyphicon-play'></span></button></p></td>";
            cols += "<td><p data-placement='top' data-toggle='tooltip' title='Pause'><button onclick='pauseDevice(\"" + deviceData.id + "\")' class='btn btn-warning btn-xs' data-title='Pause' ><span class='glyphicon glyphicon-pause'></span></button></p></td>";
            cols += "<td><p data-placement='top' data-toggle='tooltip' title='Delete'><button onclick='deleteDevice(\"" + deviceData.id + "\")' class='btn btn-danger btn-xs' data-title='Delete' ><span class='glyphicon glyphicon-trash'></span></button></p></td>";

            newRow.append(cols);
            $("#device-table").append(newRow);
        })

        .fail(function() {
            alert( status );
        });

    });


    $("#start").on("click", function () {
        console.log("Start!");
    });

    $("#pause").on("click", function () {
        console.log("Pause!");
    });

    $("#delete").on("click", function () {
        console.log("Delete!");

    });

    $("#device-table").on("click", "#delete", function (event) {
        console.log("Delete function!");
        $(this).closest("tr").remove();
        counter -= 1
    });


});

function deleteDevice(deviceID){

    $.post("api/delete-device", {deviceID: deviceID}, function(data, status){
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

    $.post("api/start-device", {deviceID: deviceID, deviceKey: deviceKey}, function(data, status){
        if(data == 'OK'){
            console.log("Device " + deviceID + " running...");
            console.log(status);
        }
    })

    .fail(function() {
        alert( "Error starting device." );
    });
}

function pauseDevice(deviceID, deviceKey){

    $.post("api/pause-device", {deviceID: deviceID}, function(data, status){
        if(data == 'OK'){
            console.log("Device " + deviceID + " paused...");
            console.log(status);
        }
    })

    .fail(function() {
        alert( "Error pausing device." );
    });
}
