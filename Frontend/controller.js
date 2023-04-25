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
                    if(j==0){ //Titel als Summary anzeigen
                        var txt = $("<summary></summary>").text(response[i][j]);
                        txt.attr("id", response[i][0]);
                        $("#appointments ol").append(txt);
                        
                    } else { //Weitere Infos als Details anzeigen
                    var line = $("<p></p>").text(response[i][j]);
                     txt2.append(line);
                     txt.append(txt2);
                    }
            }
            var button = $("<button></button>").text("Termin voten");
                        button.attr("onclick", "vote('"+response[i][0]+"',this)");
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

function vote($title, $this){
    console.log("starting dates vote");
    $.ajax({
        type: "GET",
        url: "../SimpleServer/serviceHandler.php",
        cache: false,
        data: {method: "getDates", param: $title},
        dataType: "json",
        success: function(response){
            console.log(response);

            $this.remove();
            var header = $("<h3></h3>").text("Ausgewähltes Appointment:");
            $("#current").append(header);

            //Objekt durchgehn und alle Datume anzeigen
            Object.keys(response).forEach(key => {
                if(key!="ID"){
                    var txt = $("<p></p>").text(response[key]);
                $("#current").append(txt);
                console.log(key, response[key]);
                }
                
              });
              
        },
        error: function(response){
            console.log(response);
        }
    })
}
