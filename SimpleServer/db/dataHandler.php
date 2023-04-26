<?php
include("./models/appointment.php");

//TODO:
class DataHandler
{
    private $db_obj;
    //bei DataHandler direkte Verbindung mit Datenbank herstellen
    function __construct()
    {
        $this->db_obj = new mysqli("localhost", "bif2webscriptinguser", "bif2021", "bif2webscriptdb");
        if ($this->db_obj->connect_error) {
            echo "Connection Error: " . $this->db_obj->connect_error;
            exit();
        }
    }

    //TODO: Alle Events aus der Datenbank holen, hier mit demodaten
    public function queryAppointments(){
        /*$res = $this->getDemoData();
        return $res;*/
        $result = array();
        $sql =
        "SELECT * FROM appointment";
        $helper = $this->db_obj->query($sql);
        while ($row = $helper->fetch_array()) {
            array_push($result, $row);
        }
        return $result;
    }
    	
    //? appoint mit diesem titel holen
    public function getAppointment($title){
        $result = array();
        //array_push($result, 404);
        foreach ($this->queryAppointments() as $val) {
            if ($val[0]->title == $title) {
                array_push($result, $val);
            }
        }
        return $result;
    }

    //TODO: Termine für dieses appointment holen
    public function getDates($title){
        $result = array();
        $sql = "SELECT TerminID FROM appointment WHERE Title=?";
        $stmt = $this->db_obj->prepare($sql); 
        $stmt->bind_param("s", $title);
        $stmt->execute();
        $result = $stmt->get_result(); // get the mysqli result
        $terminid = $result->fetch_assoc(); //Hol dir die ID von den Terminen, die zum appointment gehören

        $id = $terminid["TerminID"];
        $sql = "SELECT * FROM termine WHERE ID =?";
        $stmt = $this->db_obj->prepare($sql);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        return $result->fetch_assoc();
    }

    //User Daten in die Datenbank eintragen
    public function writeUser($dateArray){
        if($dateArray[2]==""){ //Wenn kein name eingetragen wurde
            return null;
        }

        $appTitle = $dateArray[1];
        $sql1 = "SELECT ID FROM appointment WHERE Title=?";
        $stmt = $this->db_obj->prepare($sql1); 
        $stmt->bind_param("s", $appTitle);
        $stmt->execute();
        $appID = $stmt->get_result()->fetch_assoc()["ID"];

        $name = $dateArray[2];
        $comment = $dateArray[3];
        $sql2 = "INSERT INTO user (`name`, `comment`, `appointmentID`) VALUES (?,?,?)";
        $statement = $this->db_obj->prepare($sql2); 
        $statement->bind_param("ssi", $name, $comment, $appID);

        if($statement->execute()){
            return "Ihre Daten wurden eingetragen.";
        } else {
            return null;
        }
    }

    //User Daten aus der Datenbank auslesen
    public function userData($appID){
        if($appID==null){
            return "bogus";
        }
        $result = array();
        $appID = intval($appID);
        $sql = "SELECT * FROM user WHERE appointmentID=?";
        $stmt = $this->db_obj->prepare($sql); 
        $stmt->bind_param("i", $appID);
        $stmt->execute();
        $helper = $stmt->get_result();

        while ($row = $helper->fetch_array()) {
            array_push($result, $row);
        }

        return $result;
    }

    //Termine für erstelltes Appointment in db einfügen, zugehörige TerminID zurückgeben für Relation
    public function insertDates($dateArray){
        if($dateArray[0]==null){ //Wenn kein datum eingetragen wurde
            return null;
        }
        $date1 = $dateArray[0];
        $date2 = $dateArray[1];
        $date3 = $dateArray[2];
        $date4 = $dateArray[3];
        $date5 = $dateArray[4];

        $sql = "INSERT INTO termine (`Date1`, `Date2`, `Date3`, `Date4`, `Date5`) VALUES (?,?,?,?,?)";
        $stmt = $this->db_obj->prepare($sql); 
        $stmt->bind_param("sssss", $date1, $date2, $date3, $date4, $date5);

        if($stmt->execute()){
            $sql1 = "SELECT ID FROM termine WHERE Date1=?";
            $stmt = $this->db_obj->prepare($sql1); 
            $stmt->bind_param("s", $date1);
            $stmt->execute();
            $terminid = $stmt->get_result()->fetch_assoc()["ID"];
            return $terminid;
            
            } else {
            return null;
        }

    }

    function insertAppointment($dataArray){
        $title = $dataArray[0];
        $location = $dataArray[1];
        $description = $dataArray[2];
        $duration = $dataArray[3];
        $expiry = $dataArray[4];
        $termin = $dataArray[5];

        $sql = "INSERT INTO appointment (`Title`, `Location`, `Description`, `Duration`, `Expiry`, `TerminID`) VALUES (?,?,?,?,?,?)";
        $stmt = $this->db_obj->prepare($sql); 
        if(!$stmt->bind_param("sssssi", $title, $location, $description, $duration, $expiry, $termin)){
            var_dump($stmt);   
        }

        if($stmt->execute()){
            return "Appointment wurde eingetragen. Die Seite lädt jetzt neu.";
        } else {
            var_dump($stmt);  
            return $stmt->get_result();
        }
    }

    //TODO: get data from database instead
    private static function getDemoData() 
    {
        $demodata = [
            [new Appointment("Kino", "Cineplexx", "Barbie Film zerfetzen", "15-18 Uhr", ["14.05.2023", "15.05.2023"])],
            [new Appointment("Theater", "Burgtheater", "Fuck around and find out", "18-22 Uhr", ["14.06.2023", "15.08.2023"])],
            [new Appointment("Ausflug", "Kahlenberg", "Wandertag!!", "10-16 Uhr", ["11.05.2023", "18.05.2023"])]
        ];
        return $demodata;
    }


    /* vielleicht eine Hilfe?
    public function queryPersons()
    {
        $res =  $this->getDemoData();
        return $res;
    }

    public function queryPersonById($id)
    {
        $result = array();
        foreach ($this->queryPersons() as $val) {
            if ($val[0]->id == $id) {
                array_push($result, $val);
            }
        }
        return $result;
    }

    public function queryPersonByName($name)
    {
        $result = array();
        foreach ($this->queryPersons() as $val) {
            if ($val[0]->lastname == $name) {
                array_push($result, $val);
            }
        }
        return $result;
    }*/

}
