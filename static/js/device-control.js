$(document).ready(function () {
    var counter = 1;

    $("#add-device").on("click", function () {
        console.log("Add device!");
        var newRow = $("<tr>");
        var cols = "";
        var deviceID = "XXX" + counter + "-XXXXXXXX";

        cols += "<td>" + deviceID + "</td>";
        cols += "<td>20.4984651</td>"
        cols += "<td>-103.1984156654</td>"
        cols += "<td>32</td>";
        cols += "<td><p data-placement='top' data-toggle='tooltip' title='Start'><button class='btn btn-success btn-xs' data-title='Start' ><span class='glyphicon glyphicon-play'></span></button></p></td>";
        cols += "<td><p data-placement='top' data-toggle='tooltip' title='Pause'><button class='btn btn-warning btn-xs' data-title='Pause' ><span class='glyphicon glyphicon-pause'></span></button></p></td>";
        cols += "<td><p data-placement='top' data-toggle='tooltip' title='Delete'><button onclick='deleteDevice(\"" + deviceID + "\")' class='btn btn-danger btn-xs' data-title='Delete' ><span class='glyphicon glyphicon-trash'></span></button></p></td>";

          newRow.append(cols);
          $("#device-table").append(newRow);
          counter++;
          console.log(newRow);
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
        console.log(deviceID);
}
