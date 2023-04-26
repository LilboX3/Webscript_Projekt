var currentdate; //know the dates to save in
var currentappointment; //the current appointment
var currentUserdata; //load comments with name
var dateInsert; //terminID to insert
//Starting point for JQuery init
$(document).ready(function () {
    console.log("doc ready");
    loadAppointments();
    $("#current").hide();
    $("#createAppointment").hide();
    $("#createbutton").hide();
});

//Appointment Ersteller öffnen, rest schließen!
$(document).on('click', '#newAppointment', function(){
    $("#current").hide();
    $("#appointments").hide();
    $("#newAppointment").hide();
    $("#dateNr").show();
    $("#createAppointment").show();
    $("#createbutton").show();
});

//User Input in die Datenbank schreiben
$(document).on('click','#insertdata',function(){
    $(".vote-button").removeAttr("disabled");
    $("#current").hide();
    $("#current .checkbox").remove();
    $("#current p").remove();
    $("#current .cute-button").remove();

    let input = [currentdate, currentappointment, $("#username").val(), $("#usercomment").val()];
    console.log(input);
    $.ajax({
        type:"GET",
        url: "../SimpleServer/serviceHandler.php",
        cache: false,
        data: {method: "writeUser", param: input},
        dataType: "json",
        success: function(response){
            console.log(response);
            let res = $("<p></p>").text(response);
            res.attr("id", "userResponse");
            res.css("margin-top", "2%");
            $(".col-8").append(res);
        },
        error: function(response){
            console.log(response);
        }
    })
});

//bei klick auf close button die Termine wieder schließen
$(document).on("click", "#close", function(){
    $(".vote-button").removeAttr("disabled");
    $("#current").hide();
    $("#current .checkbox").remove();
    $("#current p").remove();
    $("#current .cute-button").remove();

})

//Test mit Appointments anzeigen
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
            let votebutton = true; //wenn abgelaufen: kein button mehr
            let userArray;

            for(let i=0; i<response.length;i++){
                var txt2 = $("<details></details>").addClass("appointment-details");

                //user daten ausgeben, wenn ablaufdatum noch nicht erreicht
                if(!inPast(response[i][5])){
                    getUserInput(response[i][1]);
                }

                // Title
                var txt = $("<summary></summary>").text(response[i][0]);
                $("#appointments ol").append(txt);

                for(let j=1; j<7; j++){
                    var line = $("<p></p>");
                    // ID
                    if(j==1){
                        line.text();
                    }
                    // Location
                    else if(j==2){
                        line.text("Ort: ");
                        var responseText = $("<span>").text(response[i][j]).addClass("location-class");
                        line.append(responseText);
                    }
                    // Description
                    else if(j==3){
                        line.text("Beschreibung: ");
                        var responseText = $("<span>").text(response[i][j]).addClass("description-class");
                        line.append(responseText);
                    }
                    // Duration
                    else if(j==4){
                        line.text("Dauer: ");
                        var responseText = $("<span>").text(response[i][j]).addClass("duration-class");
                        line.append(responseText);
                    }
                    // Expiry
                    else if(j==5){
                        if(inPast(response[i][5])){
                            votebutton = false;
                            let date = new Date(response[i][5]);
                            let expiredLine = $("<p></p>").text("Das Appointment vom "+date+" ist bereits abgelaufen.");
                            txt2.append(expiredLine);
                            txt.append(txt2);
                            break;
                        } else {
                            line.text("Ablaufsdatum: ");
                            var responseText = $("<span>").text(response[i][j]).addClass("expiry-class");
                            line.append(responseText);
                        }
                    }
                    
                    // TerminID
                    else if(j==6){
                        line.text();
                    }

                    txt2.append(line);
                    txt.append(txt2);
                }
            //wenn es user kommentare usw gibt, diese ausgeben
            userArray = currentUserdata;
        if(userArray!=null){
        let userContainer = $("<div></div>").addClass("user-container");
        for(let i=0; i<userArray.length;i++){
            let name = $("<span></span>").text(userArray[i]["name"]+ ": ").addClass("name");
            let comment = $("<span></span>").text(userArray[i]["comment"]).addClass("comment");
            let div = $("<div></div>").append(name).append(comment);
            userContainer.append(div);
        }
        txt2.append(userContainer);
        }

            
                    
            if(votebutton){
            //Button anlegen, mit dem man alle Termine anzeigen kann
            var button = $("<button></button>").text("Termin voten");
                        button.attr("onclick", "vote('"+response[i][0]+"')");
                        button.addClass("vote-button");
                        $("#appointments ol").append(button).append($("<br>"));
            }
        }
        console.log(currentUserdata);
    },
        error: function(response){
            console.log("didnt work");
            console.log(response);
        }
        
    });
}


function getUserInput($id){
    $.ajax({
        type: "GET",
        url: "../SimpleServer/serviceHandler.php",
        cache: false,
        data: {method: "userData", param: $id},
        dataType: "json",
        async: false,
        success: function(response){
            console.log(response);
            currentUserdata = response;
            return response;
        },
        error: function(response){
            console.log(response);
            return response;
        }
    })
}

//überprüfen, ob Ablaufdatum bereits eingetreten ist
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

//Termine zu diesem Appointment anzeigen und Input nehmen
function vote($title){
    $(".vote-button").prop("disabled", "true");
    console.log("starting dates vote");
    $("#userResponse").remove();
    //inputfelder wieder leeren
    $('#username').val('');  
    $('#usercomment').val(''); 
    $("#current").show();

    $.ajax({
        type: "GET",
        url: "../SimpleServer/serviceHandler.php",
        cache: false,
        data: {method: "getDates", param: $title},
        dataType: "json",
        success: function(response){
            console.log(response);
            //Objekt durchgehn und alle Datume anzeigen
            let i = 0;
            currentdate = response["ID"];
            currentappointment = $title;
            $("#current h3").text(currentappointment);

            Object.keys(response).forEach(key => {
                if(response[key]!=null){ //nur Termine die es gibt auslesen
                if(key!="ID"){ //ID nicht ausgeben
                    if(response[key]!="0000-00-00 00:00:00"){
                    let txt = $("<p></p>").text(response[key]);
                    //checkbox, id ist die wievielte Zeile es ist, class ist zu welche ID es gehört
                    let check =  $("<input type='checkbox'/>").addClass("checkbox").appendTo(txt);
                    $("#current").append(txt);
                    }
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

//Appointment Ersteller schließen, rest öffnen!
$(document).on('click', '#closeCreator', function(){
    //$("#current").show();
    $("#appointments").show();
    $("#newAppointment").show();
    $("#createAppointment").hide();
    $("#createbutton").hide();
    $("#newcreator").hide();
    $("#createAppointment .datesinput").remove();
    $('#dateNr').val(''); 
});

//Anzahl an Terminen anzeigen, auswählen
var noDates;
function makeAppointment(){
    noDates = $("#dateNr").val();
    $("#dateNr").hide();
    pickDates(noDates);
}

function pickDates($noDates){
    $("#createbutton").hide();
    let count = $noDates;
    for(let i=0; i<count;i++){
        let date = $("<input type='datetime-local'>").addClass("datesinput");
        date.attr("id", "date"+i);
        $("#createAppointment").append(date);
    }
    //neuer button der dann alles in Datenbank einfügt
    let newbutton = $("<button></button>").text("Appointment eintragen").addClass("cute-button");
    newbutton.attr("id", "newcreator");
    $("#createAppointment").append(newbutton);
}

//ausgewählte daten speichern in Array
function insertDates(){ 
    var insertdates = [null, null, null, null, null];
    for(let i=0; i<noDates;i++){
        insertdates[i] = $("#date"+i).val();
    }
    $.ajax({
        type: "GET",
        url: "../SimpleServer/serviceHandler.php",
        cache: false,
        data: {method: "insertDates", param: insertdates},
        dataType: "json",
        async: false,
        success: function(response){
            console.log(" DIE TERMINID HIER IST: ")
            console.log(response);
            dateInsert = response;
        },
        error: function(response){
            console.log(response);
        }
    })
    
}

//Alle Appointment Daten in der Datenbank speichern
$(document).on('click', '#newcreator', async function(){
    console.log("inserting dates into db");
    insertDates();
    insertAppointment(dateInsert);
});

//in die Datenbank schreiben
function insertAppointment(terminID){
    var insertAppt = [null, null, null, null, null, null];
    insertAppt[0] = $("#appTitle").val();
    insertAppt[1] = $("#appLocation").val();
    insertAppt[2] = $("#appDescription").val();
    insertAppt[3] = $("#appDuration").val();
    insertAppt[4] = $("#appExpiry").val();
    insertAppt[5] = terminID;
    console.log(insertAppt);
    $.ajax({
        type: "GET",
        url: "../SimpleServer/serviceHandler.php",
        cache: false,
        data: {method: "insertAppointment", param: insertAppt},
        dataType: "json",
        async: false,
        success: function(response){
            let res = $("<p></p>").text(response);
            $("#createAppointment").append(res);
            setTimeout(() => {
                document.location.reload();
              }, 3000);
            console.log(response);
        }, 
        error: function(response){
            console.log(response);
        }
    })
}


    

