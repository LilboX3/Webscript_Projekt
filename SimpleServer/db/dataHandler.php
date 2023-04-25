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
        $stmt->bind_param($title, $Title);
        $stmt->execute();
        $result = $stmt->get_result(); // get the mysqli result
        $terminid = $result->fetch_assoc(); // fetch data  
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
