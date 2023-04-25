//Starting point for JQuery init
$(document).ready(function () {
    console.log("doc ready");
    loadAppointments();
});

//Test mit Appointments anzeigen
function loadAppointments() {
    console.log("loading appointments");
    $.ajax({
        type: "GET",
        url: "../SimpleServer/serviceHandler.php",
        cache: false,
        data: {method: "queryAppointments", param: " "},
        dataType: "json",
        success: function (response) {
            console.log(response);
            
            for(let i=0; i<response.length;i++){
                var txt2 = $("<details></details>");
                for(let j=0; j<6; j++){
                    if(j==0){
                        var txt = $("<summary></summary>").text(response[i][j]);
                        $("#appointments ol").append(txt);
                        
                    } else {
                    var line = $("<p></p>").text(response[i][j]);
                     txt2.append(line);
                     txt.append(txt2);
                    }

                $("#appointments ol").append(txt);
            }
            var button = $("<button></button>").text("Termin voten");
                        button.attr("onclick", "vote('"+response[i][0]+"')");
                        $("#appointments ol").append(button).append($("<br>"));
            $("#appointments ol").append("------------------------");
        }
    },
        error: function(response){
            console.log("didnt work");
            console.log(response);
        }
        
    });
}

function vote($title){
    console.log("starting dates vote");
    $.ajax({
        type: "GET",
        url: "../SimpleServer/serviceHandler.php",
        cache: false,
        data: {method: "getDates", param: $title},
        dataType: "json",
        success: function(response){
            console.log(response);
        },
        error: function(response){
            console.log(response);
        }
    })
}
