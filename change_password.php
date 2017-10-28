<?php

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function validate_user($uid, $passwd) {
    
    global $cnx;
    
    $result = -1;

    $stmnt = sprintf("select id from usuario where id = %d and clave = '%s'", $uid, md5($passwd));
    $res = $cnx->query($stmnt);

    if ($res) {
        $row = $res->fetch_assoc();
        $res->free();
        
        if (isset($row["id"])) {
            $result = $row["id"];
        }
        return $result;
    }
    else {
        throw new Exception(sprintf("Error: %s", $cnx->error));
    }            
}

function change_passwd($uid, $npasswd) {
    
    global $cnx;
    
    $clave = md5($npasswd);
    $stmnt = sprintf("call `sp_usuario_update_password`(%d, '%s')", $uid, $clave);
    
    $res = $cnx->query($stmnt);
    if ($res) {
        return TRUE;
    }
    else {
        throw new Exception(sprintf("Error: %s", $cnx->error));
    }
}

// Main ------------------------------------------------------------------------
require 'auth.php';

$result = [];

try {
    $input_params = filter_input_array(INPUT_POST);
    $cnx = new mysqli(DB_SERVER, DB_USER, DB_PASSWD, "", DB_SERVER_PORT);
    if (!$cnx->connect_error) {
        if ($cnx->select_db(DB_NAME)) {
            $uid = validate_user($input_params["uid"], $input_params["passwd"]);
            if ($uid != -1) {
                change_passwd($uid, $input_params["npasswd"]);
                $result["Result"] = "OK";
            }
            else {
                throw new Exception("Error: No existe el usuario o clave incorrecta");
            }
        }
        else {
            throw new Exception(sprintf("Error: %s", $cnx->error));
        }
        $cnx->close();
    }
    else {
        throw new Exception(sprintf("Error: %s", $cnx->connect_error));
    }    
}
catch(Exception $ex) {
    $result["Result"] = "ERROR";
    $result["Message"] = $ex->getMessage();
}
finally {
    echo json_encode($result);
}
