<?php
include("db/dataHandler.php");

//TODO:
class SimpleLogic
{
    private $dh;
    function __construct()
    {
        $this->dh = new DataHandler();
    }

    function handleRequest($method, $param)
    {
        switch ($method) {
            case "queryAppointments":
                $res = $this->dh->queryAppointments();
                break;
            case "getAppointment":
                $res = $this->dh->getAppointment($param);
                break;
            case "getDates":
                $res = $this->dh->getDates($param);
                break;
            case "writeUser":
                $res = $this->dh->writeUser($param);
                break;
            case "userData":
                $res = $this->dh->userData($param);
                break;
            default:
                $res = null;
                break;
        }
        return $res;
    }
}
