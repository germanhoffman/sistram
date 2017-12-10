<?php

function get_parameters() {
    global $action;
    global $table;
    global $list_start_pos;
    global $list_size;
    global $post_array, $get_array;
    
    $action = filter_input(INPUT_GET, "action"); 
    if (!$action) {
        $action = filter_input(INPUT_POST, "action");
        if (!$action) {
            $action = "list";  
        }
    }
    $table          = filter_input(INPUT_GET, "table");  if (!$table)  { $table  = "orden"; }
    $list_start_pos = filter_input(INPUT_GET, "jtStartIndex", FILTER_VALIDATE_INT); if (!$list_start_pos) { $list_start_pos = 0; }
    $list_size      = filter_input(INPUT_GET, "jtPageSize",   FILTER_VALIDATE_INT); if (!$list_size)      { $list_size      = 10; }
    $post_array     = filter_input_array(INPUT_POST);
    $get_array      = filter_input_array(INPUT_GET);
}

function get_option_list() {
    global $table, $get_array;
    
    $result  = [];
    
    $filter_field = $get_array["filter_field"];
    $filter_value = $get_array[$filter_field];

    if ($table === "zona") {
        $filter_value[0] = $get_array[$filter_field[0]];
        $filter_value[1] = $get_array[$filter_field[1]];
        $stmnt = sprintf("call `sp_%s_select-list`(%d, %d)", $table, $filter_value[0], $filter_value[1]);
    }
    elseif ($table === "usuario" && $filter_field && isset($filter_value)) {
        if (is_array($filter_value)) {
            $value_aux = sprintf("'%s'", implode(',', $filter_value));
        }
        else {
            $value_aux = $filter_value;
        }
        $stmnt = sprintf("call `sp_%s_select-list`(%s)", $table, $value_aux);
    }
    elseif ($filter_field && isset($filter_value)) {
        $stmnt = sprintf("call `sp_%s_select-list`(%d)", $table, $filter_value);
    }
    elseif ($table === "taller" || $table === "cliente") {
        $stmnt = sprintf("call `sp_%s_select-list`(%d, %d)", $table, $_SESSION["login_user_type"], $_SESSION["login_user_id"]);        
    }
    else {
        $stmnt = sprintf("call `sp_%s_select-list`()", $table);        
    }
    
    $res = mysql_query($stmnt);

    if (is_resource($res)) {
    
        while ($row = mysql_fetch_array($res)) {
            $result[] = array('Value'=>$row["id"], 'DisplayText'=>$row["data"]);
        }
        mysql_free_result($res);
    }
    else {
        throw new Exception(sprintf("Problemas ejecutando consulta '%s' [\"%s\"]", $stmnt, mysql_error()));
    }

    return $result;        
}

function get_cant() {
    global $table, $list_start_pos, $list_size, $get_array, $post_array;
     
    $filter_field = $get_array["filter_field"];
    $filter_value = $get_array[$filter_field];
    $filter_text = $post_array["filter_text"];
    
    $stmnt = "set @cant = 1; ";
    if (mysql_query($stmnt)) {
        if ($table === "orden" || $table === "cliente" || $table === "vehiculo" || $table === "presupuesto" || 
            $table === "orden_detalle" || $table === "novedad") {
            $stmnt = sprintf("call `sp_%s_select-range`(%d, %d, '%s', %d, '%s', %d, %d, @cant); ", $table, $list_start_pos, $list_size, 
                $filter_field, $filter_value, $filter_text, $_SESSION["login_user_type"], $_SESSION["login_user_id"]);        
        }
        else {
            $stmnt = sprintf("call `sp_%s_select-range`(%d, %d, '%s', %d, '%s', @cant); ", $table, $list_start_pos, $list_size, 
                $filter_field, $filter_value, $filter_text);
        }
        if (mysql_query($stmnt)) {
            $stmnt = "select @cant as cant; ";
            $res = mysql_query($stmnt);
            
            if (is_resource($res)) {
                $row = mysql_fetch_array($res, MYSQL_ASSOC);
                $result = $row["cant"];
                mysql_free_result($res);
            }
            else {
                throw new Exception(sprintf("Problemas ejecutando consulta '%s' [\"%s\"]", $stmnt, mysql_error()));
            }
        }
        else {
            throw new Exception(sprintf("Problemas ejecutando consulta '%s' [\"%s\"]", $stmnt, mysql_error()));        
        }
    }
    else {
        throw new Exception(sprintf("Problemas ejecutando consulta '%s' [\"%s\"]", $stmnt, mysql_error()));        
    }
    return $result;
}

function get_list_range() {
    global $table, $list_start_pos, $list_size, $get_array, $post_array;
    
    $result  = array();

    $filter_field = $get_array["filter_field"];
    $filter_value = $get_array[$filter_field];
    $filter_text  = $post_array["filter_text"];

    mysql_query("set @cant = -1;");
    
    if ($table === "orden" || $table === "cliente" || $table === "vehiculo" || 
        $table === "presupuesto"  || $table === "orden_detalle" || $table === "novedad") {
        $stmnt = sprintf("call `sp_%s_select-range`(%d, %d, '%s', %d, '%s', %d, %d, @cant)", $table, $list_start_pos, $list_size, 
            $filter_field, $filter_value, $filter_text, $_SESSION["login_user_type"], $_SESSION["login_user_id"]);        
    }
    else {
        $stmnt = sprintf("call `sp_%s_select-range`(%d, %d, '%s', %d, '%s', @cant)", $table, $list_start_pos, $list_size, 
            $filter_field, $filter_value, $filter_text);
    }
    
    //echo ($stmnt);
    
    $res = mysql_query($stmnt);

    if (is_resource($res)) {
    
        while ($row = mysql_fetch_array($res)) {
            $result[] = $row;
        }
        mysql_free_result($res);
    }
    else {
        throw new Exception(sprintf("Problemas ejecutando consulta '%s' [\"%s\"]", $stmnt, mysql_error()));
    }

    return $result;    
}

function add_data() {
    global $table, $post_array;
    
    $result = -1;

    switch ($table) {
        case "orden":
            $stmnt = sprintf("select `fn_%s_insert`(%d, %d, %d, %d, '%s', '%s', %d, '%s', '%15.2f', '%s', %d) as result", $table, 
                    $post_array["vehiculo"], $post_array["cliente"], $post_array["taller"],
                    $post_array["odometro"], $post_array["observaciones"], $post_array["referencia"], 
                    $post_array["zona"], $post_array["interno"], $post_array["costo_total"], $post_array["factura"], $_SESSION["login_user_id"]);
            break;     
        case "novedad":
            $stmnt = sprintf("select `fn_%s_insert`('%s', %d, %d, '%s', %d) as result", $table,
                    $post_array["descripcion"], $post_array["vehiculo"], $post_array["odometro"], 
                    $post_array["observaciones"], $_SESSION["login_user_id"]);
            break;
        case "taller":
            $stmnt = sprintf("select `fn_%s_insert`('%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s') as result", $table,
                    $post_array["nombre"], $post_array["descripcion"], $post_array["direccion"], $post_array["localidad"],
                    $post_array["provincia"], $post_array["cpa"], $post_array["telefono"],$post_array["cuit"]);
            break;
        case "cliente":
            $stmnt = sprintf("select `fn_%s_insert`('%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s') as result", $table,
                    $post_array["nombre"], $post_array["descripcion"], $post_array["direccion"], $post_array["localidad"],
                    $post_array["provincia"], $post_array["cpa"], $post_array["telefono"],$post_array["cuit"]);
            break;
        case "vehiculo":
            $stmnt = sprintf("select `fn_%s_insert`(%d, %d, %d, '%s', '%s', '%s', '%s') as result", $table,
                    $post_array["cliente"], $post_array["marca"], $post_array["modelo"], $post_array["dominio"],
                    $post_array["motor"], $post_array["chasis"],$post_array["anio"]);
            break;
        case "zona":
            $stmnt = sprintf("select `fn_%s_insert`('%s', %15.2f, %15.2f, %15.2f) as result", $table, 
            $post_array["nombre"], $post_array["desc_1"], $post_array["desc_2"], $post_array["desc_3"]);
            break;
        case "zona_cliente_taller":
            $stmnt = sprintf("select `fn_%s_insert`(%d, %d, %d) as result", $table, 
                    $post_array["zona"], $post_array["cliente"], $post_array["taller"]);
            break;
        case "zona_trabajo":
            $stmnt = sprintf("select `fn_%s_insert`(%d, %d, %15.2f, %15.2f) as result", $table, 
                    $post_array["zona"], $post_array["trabajo"], $post_array["costo1"], $post_array["costo2"]);
            break;
        case "marca":
            $stmnt = sprintf("select `fn_%s_insert`('%s') as result", $table, $post_array["marca"]);
            break;
        case "modelo":
            $stmnt = sprintf("select `fn_%s_insert`(%d, '%s') as result", $table, $post_array["marca"], $post_array["modelo"]);
            break;
        case "estado":
            $stmnt = sprintf("select `fn_%s_insert`('%s') as result", $table, $post_array["descripcion"]);
            break;
        case "orden_trabajo":
            $stmnt = sprintf("select `fn_%s_insert`(%d, '%s', %d, %15.2f, '%s') as result", $table, $post_array["orden"],
                    $post_array["trabajo"], $post_array["tipo"], $post_array["cantidad"], $post_array["observaciones"]);
            break;
        case "orden_repuesto":
            $stmnt = sprintf("select `fn_%s_insert`(%d, '%s', '%s', %15.2f, %15.2f, %d) as result", $table, 
            $post_array["orden"], $post_array["nombre"], $post_array["marca"], $post_array["valor"], $post_array["cantidad"], $post_array["tipo"]);
            break;
        case "usuario":
            $stmnt = sprintf("select `fn_%s_insert`('%s', '%s', '%s', %d, '%s') as result", $table, 
                    trim($post_array["usuario"]), md5(trim($post_array["clave"])), $post_array["descripcion"], $post_array["tipo"], $post_array["mail"]);
            break;
        case "usuario_cliente":
            $stmnt = sprintf("select `fn_%s_insert`(%d, %d) as result", $table, 
                    $post_array["usuario"], $post_array["cliente"]);
            break;
        case "usuario_taller":
            $stmnt = sprintf("select `fn_%s_insert`(%d, %d) as result", $table, 
                    $post_array["usuario"], $post_array["taller"]);
            break;
    }
    
    $res = mysql_query($stmnt);
    if (is_resource($res)) {
        $row = mysql_fetch_array($res, MYSQL_ASSOC);
        $result = $row["result"];
        mysql_free_result($res);
    }
    else {
        throw new Exception(sprintf("Problemas ejecutando consulta '%s' [\"%s\"]", $stmnt, mysql_error()));
    }

    return $result;    
}

function get_data_added($p_id) {
    global $table;
    
    $result  = array();

    $stmnt = sprintf("call `sp_%s_select`(%d)", $table, $p_id);
    $res = mysql_query($stmnt);

    if (is_resource($res)) {
    
        $row = mysql_fetch_array($res);
        $result[] = $row;

        mysql_free_result($res);
    }
    else {
        throw new Exception(sprintf("Problemas ejecutando consulta '%s' [\"%s\"]", $stmnt, mysql_error()));
    }

    return $result;        
}

function edit_data() {
    global $table, $post_array;
    
    $result  = FALSE;

    switch ($table) {
        case "orden":
            $stmnt = sprintf("call `sp_%s_update`(%d, %d, %d, %d, %d, '%s', '%s', %d, '%s', '%15.2f', '%s')", $table, 
                    $post_array["id"], $post_array["vehiculo"], $post_array["cliente"], $post_array["taller"],
                    $post_array["odometro"], /*$post_array["estado"],*/ $post_array["observaciones"], $post_array["referencia"], 
                    $post_array["zona"], $post_array["interno"], $post_array["costo_total"], $post_array["factura"]);
            break;            
        case "novedad":
            $stmnt = sprintf("call `sp_%s_update`(%d, '%s', %d, %d, '%s', %d)", $table, $post_array["id"],
                    $post_array["descripcion"], $post_array["vehiculo"], $post_array["odometro"], 
                    $post_array["observaciones"], $_SESSION["login_user_id"]);
            break;
        case "taller":
            $stmnt = sprintf("call `sp_%s_update`(%d, '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s')", $table, 
                    $post_array["id"], $post_array["nombre"], $post_array["descripcion"], $post_array["direccion"], $post_array["localidad"],
                    $post_array["provincia"], $post_array["cpa"], $post_array["telefono"], $post_array["cuit"]);
            break;            
        case "cliente":
            $stmnt = sprintf("call `sp_%s_update`(%d, '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s')", $table, 
                    $post_array["id"], $post_array["nombre"], $post_array["descripcion"], $post_array["direccion"], $post_array["localidad"],
                    $post_array["provincia"], $post_array["cpa"], $post_array["telefono"], $post_array["cuit"]);
            break;            
        case "vehiculo":
            $stmnt = sprintf("call `sp_%s_update`(%d, %d, %d, %d, '%s', '%s', '%s', '%s')", $table,
                    $post_array["id"], $post_array["cliente"], $post_array["marca"], $post_array["modelo"], $post_array["dominio"],
                    $post_array["motor"], $post_array["chasis"],$post_array["anio"]);
            break;
        case "zona":
            $stmnt = sprintf("call `sp_%s_update`(%d, '%s', %15.2f, %15.2f, %15.2f)", $table,
                    $post_array["id"], $post_array["nombre"], $post_array["desc_1"], $post_array["desc_2"],
                    $post_array["desc_3"]);
            break;
        case "zona_cliente_taller":
            $stmnt = sprintf("call `sp_%s_update`(%d, %d, %d, %d)", $table, $post_array["id"], 
                    $post_array["zona"], $post_array["cliente"], $post_array["taller"]);
            break;
        case "zona_trabajo":
            $stmnt = sprintf("call `sp_%s_update`(%d, %d, %d, %15.2f, %15.2f)", $table, $post_array["id"], 
                    $post_array["zona"], $post_array["trabajo"], $post_array["costo1"], $post_array["costo2"]);
            break;
        case "marca":
            $stmnt = sprintf("call `sp_%s_update`(%d, '%s')", $table, $post_array["id"],$post_array["marca"]);
            break;
        case "modelo":
            $stmnt = sprintf("call `sp_%s_update`(%d, %d, '%s')", $table, $post_array["id"], $post_array["marca"], $post_array["modelo"]);
            break;
        case "estado":
            $stmnt = sprintf("call `sp_%s_update`(%d, '%s')", $table, $post_array["id"], $post_array["descripcion"]);
            break;
        case "orden_trabajo":
            $stmnt = sprintf("call `sp_%s_update`(%d, %d, '%s', %d, %15.2f, '%s')", $table, 
                    $post_array["id"], $post_array["orden"],
                    $post_array["trabajo"], $post_array["tipo"], $post_array["cantidad"], $post_array["observaciones"]);
            break;
        case "orden_repuesto":
            $stmnt = sprintf("call `sp_%s_update`(%d, %d, '%s', '%s', %15.2f, %15.2f, %d)", $table, $post_array["id"],
            $post_array["orden"], $post_array["nombre"], $post_array["marca"], $post_array["valor"], $post_array["cantidad"], $post_array["tipo"]);
            break;
        case "usuario":
            $clave = (trim($post_array["clave"]))?md5(trim($post_array["clave"])):"";
            $stmnt = sprintf("call `sp_%s_update`(%d, '%s', '%s', '%s', %d, '%s')", $table, $post_array["id"],
                    trim($post_array["usuario"]), $clave, $post_array["descripcion"], $post_array["tipo"], $post_array["mail"]);
            break;
    }
    
    $res = mysql_query($stmnt);
    if ($res) {
        $result = TRUE;
    }
    else {
        throw new Exception(sprintf("Problemas ejecutando consulta '%s' [\"%s\"]", $stmnt, mysql_error()));
    }

    return $result;        
}

function delete_data() {
    global $table, $post_array;
    
    $result  = FALSE;

    $stmnt = sprintf("call `sp_%s_delete`(%d)", $table, $post_array["id"]);
    
    $res = mysql_query($stmnt);
    if ($res) {
        $result = TRUE;
    }
    else {
        throw new Exception(sprintf("Problemas ejecutando consulta '%s' [\"%s\"]", $stmnt, mysql_error()));
    }

    return $result;        
}

function iniciar_trabajos() {
    global $post_array;
    
    $result = FALSE;
    
    $stmnt = sprintf("call `sp_orden_start-jobs`(%d, '%s', %d, @estado)", $post_array["id"], $post_array["st_observaciones"],
            $_SESSION["login_user_id"]);
    $res = mysql_query($stmnt);
    if ($res) {
        if ($res = mysql_query("select @estado as estado")) {
            $row = mysql_fetch_array($res, MYSQL_ASSOC);
            $result["od_estado"] = $row["estado"];
            $result["id"] = $post_array["id"];
        }
    }
    else {
        throw new Exception(sprintf("Problemas ejecutando comando '%s' [\"%s\"]", $stmnt, mysql_error()));        
    }
    
    return $result;
}

function finalizar_trabajos() {
    global $post_array;
    
    $result = FALSE;
    
    $stmnt = sprintf("call `sp_orden_finish-jobs`(%d, '%s', %d, @estado)", $post_array["id"], $post_array["st_observaciones"],
            $_SESSION["login_user_id"]);
    $res = mysql_query($stmnt);
    if ($res) {
        if ($res = mysql_query("select @estado as estado")) {
            $row = mysql_fetch_array($res);
            $result["od_estado"] = $row["estado"];
            $result["id"] = $post_array["id"];
        }
    }
    else {
        throw new Exception(sprintf("Problemas ejecutando comando '%s' [\"%s\"]", $stmnt, mysql_error()));        
    }
    
    return $result;
}

function cerrar_orden() {
    global $post_array;
    
    $result = FALSE;
    
    $stmnt = sprintf("call `sp_orden_close`(%d, '%s', %d, @estado)", $post_array["id"], $post_array["st_observaciones"],
            $_SESSION["login_user_id"]); 
    $res = mysql_query($stmnt);
    if ($res) {
        if ($res = mysql_query("select @estado as estado")) {
            $row = mysql_fetch_array($res);
            $result["od_estado"] = $row["estado"];
            $result["id"] = $post_array["id"];
        }
    }
    else {
        throw new Exception(sprintf("Problemas ejecutando comando '%s' [\"%s\"]", $stmnt, mysql_error()));        
    }
    
    return $result;
}

function cancelar_orden() {
    global $post_array;
    
    $result = FALSE;
    
    $stmnt = sprintf("call `sp_orden_cancel`(%d, '%s', %d, @estado)", $post_array["id"], $post_array["st_observaciones"],
            $_SESSION["login_user_id"]);
    $res = mysql_query($stmnt);
    if ($res) {
        if ($res = mysql_query("select @estado as estado")) {
            $row = mysql_fetch_array($res);
            $result["od_estado"] = $row["estado"];
            $result["id"] = $post_array["id"];
        }
    }
    else {
        throw new Exception(sprintf("Problemas ejecutando comando '%s' [\"%s\"]", $stmnt, mysql_error()));        
    }
    
    return $result;
}

function reabrir_orden() {
    global $post_array;
    
    $result = FALSE;
    
    $stmnt = sprintf("call `sp_orden_reabrir`(%d, '%s', %d, @estado)", $post_array["id"], $post_array["st_observaciones"],
        $_SESSION["login_user_id"]);
    $res = mysql_query($stmnt);
    if ($res) {
        if ($res = mysql_query("select @estado as estado")) {
            $row = mysql_fetch_array($res);
            $result["od_estado"] = $row["estado"];
            $result["id"] = $post_array["id"];
        }
    }
    else {
        throw new Exception(sprintf("Problemas ejecutando comando '%s' [\"%s\"]", $stmnt, mysql_error()));
    }
    
    return $result;
}

function agregar_novedades() {
    global $post_array;
    
    $result = FALSE;
    
    $list_values = [];
    foreach ($post_array["novedad"] as $value) {
        $list_values[] = sprintf("(%d, %d)", $post_array["orden"], $value);
    } 
    
    $list_values_txt = implode(",", $list_values);
    
    $stmnt = sprintf("insert into orden_novedad (orden, novedad) values %s", $list_values_txt);
    $res = mysql_query($stmnt);
    if ($res) {
        $result = TRUE;
    }
    else {
        throw new Exception(sprintf("Problemas ejecutando comando '%s' [\"%s\"]", $stmnt, mysql_error()));        
    }
    
    return $result;
}

function get_resumen() {
    
    global $table, $list_start_pos, $list_size, $get_array, $post_array;
    
    $result  = array();
    
    $stmnt = "call `sp_resumen_estados_1`()";
       
    $res = mysql_query($stmnt);
        
    if (is_resource($res)) {
            
        $result = mysql_fetch_array($res);
        
        mysql_free_result($res);
    }
    else {
        throw new Exception(sprintf("Problemas ejecutando consulta '%s' [\"%s\"]", $stmnt, mysql_error()));
    }
        
    return $result;    
}

// Main ------------------------------------------------------------------------
require 'auth.php';

$result = [];

$list_start_pos = 0;
$list_size = 10;

$post_array = [];
$get_array  = [];

try {
    
    get_parameters();
    
    $cnx = mysql_connect(sprintf("%s:%d", DB_SERVER, DB_SERVER_PORT), DB_USER, DB_PASSWD);

    if (is_resource($cnx)) {
        if (mysql_select_db(DB_NAME, $cnx)) {
            
            //$action = "create"; $table ="orden";
            switch ($action) {
                
                case "list":
                case "print":
                    $tot_list = get_cant();
                    $list = get_list_range();
                    
                    $result["Result"]  = "OK";
                    $result["Records"] = $list;
                    $result["TotalRecordCount"] = $tot_list;
                    
                    break;
                
                case "create":
                    
                    $add_id = add_data();
                    if ($add_id != -1) {
                        
                        $row = get_data_added($add_id);

                        $result["Result"] = "OK";
                        $result["Record"] = $row;
                    }
                    
                    break;
                    
                case "update":
                    
                    if (edit_data()) {                    
                        $result["Result"]  = "OK";
                    }
                    break;
                
                case "delete":
                    
                    if (delete_data()) {                    
                        $result["Result"]  = "OK";
                    }
                    break;
                
                case "options":
                    $list = get_option_list();
                    
                    $result["Result"]  = "OK";
                    $result["Options"] = $list;
                    
                    break;
                
                case "iniciar_trabajos":
                    if ($r = iniciar_trabajos()) {
                        $result["Result"] = "OK";
                        $result["Record"] = $r;
                    }
                    break;
                case "finalizar_trabajos":
                    if ($r = finalizar_trabajos()) {
                        $result["Result"] = "OK";
                        $result["Record"] = $r;
                    }
                    break;
                case "cerrar_orden":
                    if ($r = cerrar_orden()) {
                        $result["Result"] = "OK";
                        $result["Record"] = $r;
                    }
                    break;
                case "cancelar_orden":
                    if ($r = cancelar_orden()) {
                        $result["Result"] = "OK";
                        $result["Record"] = $r;
                    }
                    break;
                case "reabrir_orden":
                    if ($r = reabrir_orden()) {
                        $result["Result"] = "OK";
                        $result["Record"] = $r;
                    }
                    break;
                case "agregar_novedades":
                    if (agregar_novedades()) {
                        $result["Result"] = "OK";
                        $result["Record"] = [];
                    }
                    break;
                case "resumen_estados":
                    if ($r = get_resumen()) {
                        $result["Result"] = "OK";
                        $result["Record"] = $r;
                    }
                    break;
            }
        }
        else {
            throw new Exception(sprintf("Problemas iniciando base de datos '%s' [\"%s\"]", $mysql_db, mysql_error()));
        }
        mysql_close($cnx);
    }
    else {
        throw new Exception(sprintf("Problemas conectando a servidor de base de datos '%s' [\"%s\"]", $mysql_server, mysql_error()));
    }
}
catch(Exception $ex) {

    //Return error message
    $result["Result"] = "ERROR";
    $result["Message"] = $ex->getMessage();
}
finally {
    if ($action != "print") {
        echo json_encode($result);
    }
    else {
            
        print_doc($result["Records"]);
    }       
}
