<?php

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

require 'auth.php';

try {
    $result["Result"] = $_SESSION; 
} 
catch (Exception $ex) {
    $result["Result"] = "ERROR"; 
    $result["Message"] = $ex->getMessage();
} 
finally {
    echo json_encode($result);
}
