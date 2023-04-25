<?php
class Appointment {
    public $title;
    public $location;
    public $description;
    public $duration;
    public $dates;

    function __construct($title, $location, $description, $duration, $dates) {
        $this->title = $title;
        $this->location = $location;
        $this->description=$description;
        $this->duration=$duration;
        $this->dates=$dates;
      }
}
?>