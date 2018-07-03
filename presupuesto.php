<?php

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function current_date() {
    return date("d/m/Y");
}

function current_presupuesto($orden_id) {

    global $cnx;
    
    if ($_SESSION["login_user_type"] == 2)  {
        $presupuesto_tipo = 1;  
    }
    elseif ($_SESSION["login_user_type"] == 3) {
        $presupuesto_tipo = 2;
    }
    else {
        throw new Exception("Problemas generando presupuesto. El usuario no tiene los privilegios necesarios");        
    }
    
    $stmnt = sprintf("select `fn_presupuesto_insert`(%d, %d) as result", $orden_id, $presupuesto_tipo);

    $res = $cnx->query($stmnt);
    if ($res) {
        $row = $res->fetch_assoc();
        $result = $row["result"];
        
        $res->free();

        return $result;
    }
    else {
        throw new Exception(sprintf("Problemas generando presupuesto. Comando: '%s' [\"%s\"]", $stmnt, $cnx->error));
    }        
}

function get_data($id, $preview) {

    global $cnx;
    
    if ($preview) {
        $stmnt = sprintf("call `sp_presupuesto_datos-preview`(%d)", $id);
    }
    else {
        $stmnt = sprintf("call `sp_presupuesto_datos`(%d)", $id);
    }
    $res = $cnx->query($stmnt);

    if ($res) {
    
        while ($row = $res->fetch_assoc()) {
            $result[] = $row;
        }
        $res->free();
    }
    else {
        throw new Exception(sprintf("Problemas procesando presupuesto. Comando: '%s' [\"%s\"]", $stmnt, $cnx->error));
    }

    return $result;        
}

function get_costo_trabajos($orden_id, $costo, $presupuesto_id) {
    
    global $cnx;
    
    $result = [];
    
    if ($presupuesto_id) {
        $stmnt = sprintf("call `sp_presupuesto_costo_trabajos_stored`(%d)", $presupuesto_id);
    } 
    else {
        $stmnt = sprintf("call `sp_presupuesto_costo_trabajos_preview`(%d, %d)", $orden_id, $costo);
    }
    
    $res = $cnx->query($stmnt);

    if ($res) {
    
        while ($row = $res->fetch_assoc()) {
            $result[$row["tipo"]]["data"][] = $row;
            $result[$row["tipo"]]["sub"]  += $row["valor"];
            //$result[$row["trabajo_tipo"]]["sub1"] += $row["subtotal1"];
            //$result[$row["trabajo_tipo"]]["sub2"] += $row["subtotal2"];
        }
        $res->free();
    }
    else {
        throw new Exception(sprintf("Problemas generando/visualizando presupuesto. Comando: '%s' [\"%s\"]", $stmnt, $cnx->error));
    }

    return $result;            
}

function get_costo_repuestos($orden_id, $presupuesto_id) {
    
    global $cnx;
    
    $result = [];
    $result["data"] = [];
    $result["sub"] = 0;
    
    if ($presupuesto_id) {
        $stmnt = sprintf("call `sp_presupuesto_costo_repuestos_stored`(%d)", $presupuesto_id);
    }
    else {
        $stmnt = sprintf("call `sp_presupuesto_costo_repuestos_preview`(%d)", $orden_id);
    }
    
    $res = $cnx->query($stmnt);

    if ($res) {
    
        while ($row = $res->fetch_assoc()) {
            $result["data"][] = $row;
            $result["sub"]  += $row["valor"];
            //$result["sub_desc"] += $row["subtotal_desc"];
        }
        $res->free();
    }
    else {
        throw new Exception(sprintf("Problemas generando presupuesto. Comando: '%s' [\"%s\"]", $stmnt, $cnx->error));
    }

    return $result;            
}

function get_novedades($orden_id) {
    
    global $cnx;
    
    $result["data"] = [];
    
    $stmnt = sprintf("call `sp_novedad_print`(%d)", $orden_id);
    
    $res = $cnx->query($stmnt);
    if ($res) {   
        while ($row = $res->fetch_assoc()) {
            $result["data"][] = $row;
        }
        $res->free();
    }
    else {
        throw new Exception(sprintf("Problemas generando presupuesto. Comando: '%s' [\"%s\"]", $stmnt, $cnx->error));
    }

    return $result;                
}

function get_descuento_zona($orden_id) {

    global $cnx;
    
    $stmnt = sprintf("call `sp_presupuesto_descuento_zona`(%d)", $orden_id);
    $res = $cnx->query($stmnt);

    if ($res) {
    
        $row = $res->fetch_assoc();
        $result["id"]    = $orden_id;
        $result["desc1"] = $row["desc_1"];
        $result["desc2"] = $row["desc_2"];
        $result["desc3"] = $row["desc_3"];

        $res->free();
        
        return $result;            
    
    }
    else {
        throw new Exception(sprintf("Problemas obteniendo descuentos correspondientes. Comando: '%s' [\"%s\"]", $stmnt, $cnx->error));
    }
}

function save_presupuesto($orden, $costo, $observaciones) {
    global $cnx;
    
    $stmnt = sprintf("call `sp_presupuesto_save`(%d, %d, '%s', %d, @presupuesto_id)", $orden, $costo, $observaciones,
            $_SESSION["login_user_id"]);
    if ($cnx->query($stmnt)) {

        $stmnt = "select @presupuesto_id as id;";
        $res = $cnx->query($stmnt);
        if ($res) {
            $row = $res->fetch_assoc();
            $result = $row["id"];

            $res->free();
            
            return $result;               
        }
        else {
            throw new Exception(sprintf("Problemas guardando presupuesto. Comando: '%s' [\"%s\"]", $stmnt, $cnx->error));
        }    
        
    }
    else {
        throw new Exception(sprintf("Problemas guardando presupuesto. Comando: '%s' [\"%s\"]", $stmnt, $cnx->error));
    }    
}

function update_presupuesto($presupuesto, $observaciones, $approve = TRUE) {

    global $cnx;
    
    $stmnt = sprintf("call `sp_presupuesto_update-status`(%d, %d, '%s', %d)", $presupuesto, ($approve)?2:3, $observaciones,
            $_SESSION["login_user_id"]);

    if ($cnx->query($stmnt)) {           
        return TRUE;                
    }
    else {
        throw new Exception(sprintf("Problemas aprobando/rechazando presupuesto. Comando: '%s' [\"%s\"]", $stmnt, $cnx->error));
    }
}

function get_total_orden($orden, $tipo_costo) {
    
    global $cnx;
    
    $result = -1;
    
    $stmnt = sprintf("select ifnull(`fn_orden_total_repuestos`(%d), 0) + ifnull(`fn_orden_total_mano_obra`(%d, %d), 0) as result", $orden, $orden, $tipo_costo);
    $res = $cnx->query($stmnt);
    if ($res) {
        $row = $res->fetch_assoc();
        $result = $row["result"];       
        $res->free();
    }
    else {
        throw new Exception(sprintf("Problemas ejecutando consulta '%s' [\"%s\"]", $stmnt, mysql_error()));
    }
    
    return $result;  
}

function get_total_presupuesto($presupuesto) {
    
    global $cnx;
    
    $result = -1;
    
    $stmnt = sprintf("select ifnull(`fn_presupuesto_total_repuestos`(%d), 0) + 
		ifnull(`fn_presupuesto_total_mano_obra`(%d), 0) as result", $presupuesto, $presupuesto);
    $res = $cnx->query($stmnt);
    if ($res) {
        $row = $res->fetch_assoc();
        $result = $row["result"];       
        $res->free();
    }
    else {
        throw new Exception(sprintf("Problemas ejecutando consulta '%s' [\"%s\"]", $stmnt, mysql_error()));
    }
    
    return $result;  
}

// Main ========================================================================
require 'auth.php';

$result = [];

try {

    $input_params = filter_input_array(INPUT_POST);
    
    /*if (!$input_params["id"]) {
        throw new Exception("Falta la referencia necesaria para procesar el pedido");
    }*/
    
    $cnx = new mysqli(DB_SERVER, DB_USER, DB_PASSWD, "", DB_SERVER_PORT);
    if (!$cnx->connect_error) {
        if ($cnx->select_db(DB_NAME)) {

            switch ($input_params["action"]) {
                case "preview":
                    $result["Result"]["data"] = get_data($input_params["id"], TRUE);
                    break;
                case "data":
                    $result["Result"]["data"] = get_data($input_params["presupuesto"], FALSE);
                    break;
                case "trabajos_preview":
                    $result["Result"]["trabajos"] = get_costo_trabajos($input_params["id"], $input_params["costo"], $input_params["presupuesto"]);
                    break;
                case "repuestos_preview":
                    $result["Result"]["repuestos"] = get_costo_repuestos($input_params["id"], $input_params["presupuesto"]);
                    break;
                case "trabajos_stored":
                    $result["Result"]["trabajos"] = get_costo_trabajos($input_params["id"], $input_params["costo"], $input_params["presupuesto"]);
                    break;
                case "repuestos_stored":
                    $result["Result"]["repuestos"] = get_costo_repuestos($input_params["id"], $input_params["presupuesto"]);
                    break;
                case "novedades":
                    $result["Result"]["novedades"] = get_novedades($input_params["id"]);
                    break;
                case "descuentos":
                    $result["Result"]["data"] = get_descuento_zona($input_params["id"]);
                    break;
                case "presupuesto_save":
                    $result["Result"] = "OK";
                    $result["Record"]["presupuesto"] = save_presupuesto($input_params["id"], $input_params["costo"], 
                            $input_params["pobservaciones"]);
                    $result["Record"]["id"] = $input_params["id"];
                    $result["Record"]["od_estado"] = 101; // PRESUPUESTADA 
                    break;
                case "aprobar":
                    $result["Result"] = (update_presupuesto($input_params["id"], $input_params["observaciones"]))?"OK":"ERROR";
                    $result["Record"]["estado"] = 2;
                    break;
                case "rechazar":
                    $result["Result"] = (update_presupuesto($input_params["id"], $input_params["observaciones"], FALSE))?"OK":"ERROR";
                    $result["Record"]["estado"] = 3;
                    break;
                case "total_orden":
                    $result["Result"]["total_orden"] = get_total_orden($input_params["id"], $input_params["tipo_costo"]);
                    break;
                case "total_presupuesto":
                    $result["Result"]["total_presupuesto"] = get_total_presupuesto($input_params["id"]);
                    break;
            }
        }
        else {
            throw new Exception(sprintf("Problemas iniciando base de datos '%s' [\"%s\"]", $mysql_db, $cnx->error));
        }
        $cnx->close();
    }
    else {
        throw new Exception(sprintf("Problemas conectando a servidor de base de datos '%s' [\"%s\"]", $mysql_server, $cnx->connect_error));
    }

}
catch(Exception $ex) {
    //Return error message
    $result["Result"] = "ERROR";
    $result["Message"] = $ex->getMessage();
}
finally {
    echo json_encode($result);
}

