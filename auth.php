<?php

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function do_session_start() {
    
    $post_array = filter_input_array(INPUT_POST);
    
    if (!isset($post_array["user"]) || !isset($post_array["password"])) { return FALSE; }

    $cnx = new mysqli(DB_SERVER, DB_USER, DB_PASSWD, "", DB_SERVER_PORT);
    if (!$cnx->connect_error) {
        if ($cnx->select_db(DB_NAME)) {

            $stmnt = sprintf("select id, usuario, tipo, descripcion from usuario where usuario = '%s' and clave = '%s'", $post_array["user"], 
                    md5($post_array["password"]));
            $res = $cnx->query($stmnt);

            if ($res) {
                $row = $res->fetch_assoc();
                $res->free();

                $_SESSION['name']            = "sistram";
                $_SESSION['login_user']      = $row["usuario"];
                $_SESSION['login_user_id']   = $row["id"];
                $_SESSION['login_user_desc'] = $row["descripcion"];
                $_SESSION['login_user_type'] = $row["tipo"];
                $_SESSION["last_activity"]   = time();

                return isset($row["id"]);

            }
            else {
                throw new Exception(sprintf("Error: %s", $cnx->error));
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

function check_session_started() {
        
    $user = $_SESSION["login_user"];
    
    if (!isset($user)) { return FALSE; }
    
    $cnx = new mysqli(DB_SERVER, DB_USER, DB_PASSWD, "", DB_SERVER_PORT);
    if (!$cnx->connect_error) {
        if ($cnx->select_db(DB_NAME)) {
            
            $stmnt = sprintf("select usuario from usuario where usuario = '%s'", $user);
            $res = $cnx->query($stmnt);

            if ($res) {
                $row = $res->fetch_assoc();
                $res->free();
                
                return isset($row["usuario"]);
            }
            else {
                throw new Exception(sprintf("Error: %s", $cnx->error));
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

function check_session_active() {
    return (isset($_SESSION["last_activity"]) && (time() - $_SESSION["last_activity"]) < 60);
}

// Main ========================================================================

require 'common.php';

$url_dest_txt = "";
try {
    session_start();

    if (!check_session_started()) {
        if (!do_session_start()) {
            if (basename($_SERVER["PHP_SELF"]) == "login.php") {
                $url_dest_txt = "";
            }
            else {
                $url_dest_txt = "Location: login.php";
            }
        }
        elseif (basename($_SERVER["PHP_SELF"]) == "login.php") {
            $url_dest_txt = "Location: index.php"; 
        }
    }
    elseif (basename($_SERVER["PHP_SELF"]) == "login.php") {
        $url_dest_txt = "Location: index.php"; 
    }
}
catch (Exception $ex) {
    $err = $ex->getMessage;
    $url_dest_txt = "Location: login.php";
}
finally {
    if ($url_dest_txt) {
        header($url_dest_txt);
    }
}