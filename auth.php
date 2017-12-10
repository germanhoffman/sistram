<?php

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function do_session_start() {
    
    global $post_array;
    
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

                ini_set("session.gc_maxlifetime", SISTRAM_TIMEOUT);
                session_start();
                
                $_SESSION['name']            = "sistram";
                $_SESSION['login_user']      = $row["usuario"];
                $_SESSION['login_user_id']   = $row["id"];
                $_SESSION['login_user_desc'] = $row["descripcion"];
                $_SESSION['login_user_type'] = $row["tipo"];
                $_SESSION["created"]         = time();
                $_SESSION["last_activity"]   = $_SESSION["created"];

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
    $last_activity = $_SESSION["last_activity"];
    
    if (!isset($user) || !isset($last_activity) || (time() - $last_activity) > SISTRAM_TIMEOUT) { 
        
        session_unset();
        session_destroy();
        
        return FALSE; 
    }
    
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

$post_array = filter_input_array(INPUT_POST);

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
    else {
        
        if (!$post_array["no_activity"]) {
            $_SESSION["last_activity"] = time();
            
            if ((time() - $_SESSION['created']) > RECREATE_SESSION) {
                session_regenerate_id(true);
                $_SESSION['created'] = $_SESSION["last_activity"];
            }
        }
        
        if (basename($_SERVER["PHP_SELF"]) == "login.php") {                        
            $url_dest_txt = "Location: index.php";
        }
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