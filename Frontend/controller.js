//Starting point for JQuery init
$(document).ready(function () {
    console.log("doc ready");
    loadAppointments();
    $("#current").hide();
});

$(document).on('click','#insertdata',function(){
    $.ajax({
        //TODO: vote 
    })
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
                        $("#appointments ol").append(txt);
                        if(inPast(response[i][5])){
                            let date = new Date(response[i][5]);
                            let line = $("<p></p>").text("Das Appointment vom "+date+" ist bereits abgelaufen.");
                            txt2.append(line);
                            txt.append(txt2);
                            break;
                        }
                    } else { //Weitere Infos als Details anzeigen
                    var line = $("<p></p>").text(response[i][j]);
                     txt2.append(line);
                     txt.append(txt2);
                    }
            }
            //Button anlegen, mit dem man alle Termine anzeigen kann
            var button = $("<button></button>").text("Termin voten");
                        button.attr("onclick", "vote('"+response[i][0]+"',this)");
                        button.addClass("vote-button");
                        $("#appointments ol").append(button).append($("<br>"));
        }
    },
        error: function(response){
            console.log("didnt work");
            console.log(response);
        }
        
    });
}

function inPast($date){
    var selectedDate = new Date($date);
    var now = new Date();
    now.setHours(0,0,0,0);
    if (selectedDate < now) {
      console.log("Selected date is in the past");
      return true;
    } else {
      console.log("Selected date is NOT in the past");
      return false;
    }
}

function vote($title, $this){
    console.log("starting dates vote");
    $("#current").show();
    $.ajax({
        type: "GET",
        url: "../SimpleServer/serviceHandler.php",
        cache: false,
        data: {method: "getDates", param: $title},
        dataType: "json",
        success: function(response){
            console.log(response);

            
            $this.remove();

            //Objekt durchgehn und alle Datume anzeigen
            let i = 0;
            Object.keys(response).forEach(key => {
                if(response[key]!=null){ //nur Termine die es gibt auslesen
                if(key!="ID"){ //ID nicht ausgeben
                    let txt = $("<p></p>").text(response[key]);
                    //checkbox, id ist die wievielte Zeile es ist, class ist zu welche ID es gehört
                    let check =  $("<input type='checkbox'/>").addClass("checkbox").appendTo(txt);
                $("#current").append(txt);
                }
                console.log(key, response[key]);
                }
                ++i;
              });
              //Button machen, mit dem man Votes in die datenbank schreibt
              let butt = $("<button></button>").addClass("cute-button").text("Vote abgeben").attr("id", "insertdata").appendTo($("#current"));

              
        },
        error: function(response){
            console.log(response);
        }
    })
}


    

