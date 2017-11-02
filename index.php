<!DOCTYPE html>
<!--
To change this license header, choose License Headers in Project Properties.
To change this template file, choose Tools | Templates
and open the template in the editor.
-->
<?php

    function print_menu_items() {
        
        echo '<ul>';
        
        if ($_SESSION["login_user_type"] != 4) {
            echo '<li><a href="#orden_table">Ordenes</a></li>';
        }
        
        echo '<li><a href="#novedad_table">Novedades</a></li>';
        
        if ($_SESSION["login_user_type"] == 3) {
            echo '<li><a href="#cliente_table">Clientes</a></li>
                  <li><a href="#taller_table">Talleres</a></li>
                  <li><a href="#vehiculo_table">Vehiculos</a></li>
                  <li><a href="#zona_table">Zonas</a></li>
                  <li><a href="#modelo_table">Modelos</a></li>
                  <li><a href="#marca_table">Marcas</a></li>
                  <li><a href="#usuario_table">Usuarios</a></li>
                  <li><a href="#estado_table">Estados</a></li>';
        }
        echo '</ul>';
    }
    
    function print_tables() {
        
        if ($_SESSION["login_user_type"] != 4) {
            echo "<div id='orden_table' style='width: 100%; padding-left: 0px; padding-right: 0px;'>
                    <div style=\"width: 95%; height: auto; display: block; padding: 5px;\">
                        <form> 
                            Buscar: <input type=\"search\" name=\"name\" id=\"filter_text_orden\" />
                            <button type=\"submit\" id=\"ordenSearchButton\">Ir</button>
                        </form>
                    </div>
                </div>";
        }
        
        echo "<div id=\"novedad_table\" style='width: 100%; padding-left: 0px; padding-right: 0px;'>
                <div style=\"width: 95%; height: auto; display: block; padding: 5px;\">
                    <form> 
                        Buscar: <input type=\"search\" name=\"name\" id=\"filter_text_novedad\" />
                        <button type=\"submit\" id=\"novedadSearchButton\">Ir</button>
                    </form>
                </div>                            
            </div>";
            
        if ($_SESSION["login_user_type"] == 3) {
            
            echo "<div id=\"cliente_table\" style='width: 100%; padding-left: 0px; padding-right: 0px;'>
                    <div style=\"width: 95%; height: auto; display: block; padding: 5px;\">
                        <form> 
                            Buscar: <input type=\"search\" name=\"name\" id=\"filter_text_cliente\" />
                            <button type=\"submit\" id=\"clienteSearchButton\">Ir</button>
                        </form>
                    </div>                            
                </div>";
            
            echo "<div id=\"taller_table\" style='width: 100%; padding-left: 0px; padding-right: 0px;'>
                    <div style=\"width: 95%; height: auto; display: block; padding: 5px;\">
                        <form> 
                            Buscar: <input type=\"search\" name=\"name\" id=\"filter_text_taller\" />
                            <button type=\"submit\" id=\"tallerSearchButton\">Ir</button>
                        </form>
                    </div>                            
                </div>";
            
            echo "<div id=\"vehiculo_table\" style='width: 100%; padding-left: 0px; padding-right: 0px;'>
                    <div style=\"width: 95%; height: auto; display: block; padding: 5px;\">
                        <form> 
                            Buscar: <input type=\"search\" name=\"name\" id=\"filter_text_vehiculo\" />
                            <button type=\"submit\" id=\"vehiculoSearchButton\">Ir</button>
                        </form>
                    </div>
                </div>";
            
            echo "<div id=\"zona_table\" style='width: 100%; padding-left: 0px; padding-right: 0px;'>
                    <div style=\"width: 95%; height: auto; display: block; padding: 5px;\">
                        <form> 
                            Buscar: <input type=\"search\" name=\"name\" id=\"filter_text_zona\" />
                            <button type=\"submit\" id=\"zonaSearchButton\">Ir</button>
                        </form>
                    </div>
                </div>";
            
            echo '<div id="modelo_table" style="width: 100%; padding-left: 0px; padding-right: 0px;">
                    <div style="width: 95%; height: auto; display: block; padding: 5px;">
                        <form> 
                            Buscar: <input type="search" name="name" id="filter_text_modelo" />
                            <button type="submit" id="modeloSearchButton">Ir</button>
                        </form>
                    </div>
                </div>'.
                '<div id="marca_table" style="width: 100%; padding-left: 0px; padding-right: 0px;">
                    <div style="width: 95%; height: auto; display: block; padding: 5px;">
                        <form> 
                            Buscar: <input type="search" name="name" id="filter_text_marca" />
                            <button type="submit" id="marcaSearchButton">Ir</button>
                        </form>
                    </div>
                </div>';
            
            echo '<div id="estado_table" style="width: 100%; padding-left: 0px; padding-right: 0px;">
                    <div style="width: 95%; height: auto; display: block; padding: 5px;">
                        <form> 
                            Buscar: <input type="search" name="name" id="filter_text_estado" />
                            <button type="submit" id="estadoSearchButton">Ir</button>
                        </form>
                    </div>
                </div>'.
                 '<div id="usuario_table" style="width: 100%; padding-left: 0px; padding-right: 0px;">
                    <div style="width: 95%; height: auto; display: block; padding: 5px;">
                        <form> 
                            Buscar: <input type="search" name="name" id="filter_text_usuario" />
                            <button type="submit" id="usuarioSearchButton">Ir</button>
                        </form>
                    </div>
                </div>';   
        }            
    }

    // Main ====================================================================
    
    require 'auth.php';
    
?>

<html>
    <head>
        <meta charset="UTF-8">
        <title>...:: SISTRAM -- Sistema Integral para el Seguimiento de Trabajos Mec&aacute;nicos ::...</title>
        <link href="//code.jquery.com/ui/1.11.4/themes/redmond/jquery-ui.css" rel="stylesheet" type="text/css" />
        <link href="jtable.2.5.0/themes/jqueryui/jtable_jqueryui.css" rel="stylesheet" type="text/css" />
        <link href="default.css" rel="stylesheet" type="text/css" />
        <link rel="icon" href="images/icon_sistram.png" type="image/png" sizes="32x32" />

        <script type="text/javascript" src="//code.jquery.com/jquery-1.11.0.min.js"></script>
        <script type="text/javascript" src="//code.jquery.com/ui/1.11.1/jquery-ui.min.js"></script>
        <script type="text/javascript" src="jtable.2.5.0/jquery.jtable.js"></script>

        <script type="text/javascript" src="js/tables.js"></script>
        <script type="text/javascript" src="js/jquery.fileDownload.js"></script>
        
    </head>
    <body style="background-image: url('images/fondo-body.jpg'); background-repeat: no-repeat;
                    background-attachment: fixed; background-size: cover; background-position: center; ">
        <table style="width: 95%; margin-left: auto; margin-right: auto; border-spacing: 0px; border-collapse: collapse;">
            <tr>
                <td style="padding: 0px; ">
                    <div id="div_fondo_header" style="background-image: url('images/fondo-menu.jpg'); position: relative; background-size: cover;
                         width: 100%; height: 140px; vertical-align: bottom;">
                        <a href="http://www.veyser.com.ar/" target="_blank"><img src="images/logo-veyser.png" alt="Veyser logo" style="margin: 5px; position: absolute; bottom: 0; right: 0; display: table-cell;"></a>
                        <img src="images/logo_sistram.png" alt="Sistram logo" style="margin: 5px; position: absolute; bottom: 0; left: 0; display: table-cell;">
                        <span id="login_user">&#91;<a href="#" onclick="$('#dialog-change-passwd-form').dialog('open');" title="Cambiar clave"><?php echo $_SESSION["login_user_desc"]?></a>&#93;&nbsp;
                            <a href="#" onclick="$('#dialog-confirm').dialog('open');"><img title="Cerrar sesi&oacute;n" src="images/logout1.png" style="position: relative; vertical-align: middle;"></a>
                        </span>
                    </div>
                </td>
            </tr>
            <tr>
                <td style="padding-top: 2px;">
                    <div id="tabs" style="font-size: 12px; min-height: 600px;">
                        <?php print_menu_items(); print_tables(); ?>
                    </div>
            </tr>
            <tr>
                <td style="padding-top: 2px;">
                    <div id="div_fondo_footer" style="background-image: url('images/fondo-menu.jpg'); position: relative; background-size: cover;
                         width: 100%; height: 70px; vertical-align: bottom; padding-top: 5px; vertical-align: top;">
                        <p style="text-align: center; font-family: sans-serif; font-size: 12px; color: white; ">
                            ...:: SISTRAM ::...<br>
                            Sistema Integral para el Seguimiento de Trabajos Mec&aacute;nicos<br>
                            Dise&ntilde;ado y desarrollado por GIH y Veyser S.R.L.<br>
                            Todos los derechos reservados &copy; 2015-2017
                        </p>
                    </div>
                </td>
            </tr>
        </table>
        <!-- Dialogo de confirmacion -->
        <div id="dialog-confirm" title="SISTRAM - Confirmar">
            <p style="font-size: 14px;">
                <span class="ui-icon ui-icon-alert" style="float:left; margin:0 7px 20px 0;"></span>
                Está seguro que desea cerrar la sesión?
            </p>
        </div>
        
        <!-- Dialogo de opciones de presupuesto -->
        <div id="dialog-bonificacion" title="Presupuesto bonificaci&oacute;n" style="padding: 5px 5px 5px 5px; ">
            <fieldset id="dialog-form-fieldset">
                <label for="bonificacion">Bonificaci&oacute;n adicional:</label>&nbsp;
                <input type="number" name="bonificacion" id="bonif" value="0" min=0 max=100 style="text-align: right; width: 40px;" onblur="check_number_range(this, 0, 100);"/>&nbsp;%
                <input type="submit" tabindex="-1" style="position:absolute; top:-1000px">
            </fieldset>
        </div> 
        
        <!-- Dialogo de cambio de clave -->
        <div id="dialog-change-passwd-form" title="SISTRAM - Cambiar clave" >
            <form id="form-change-passwd">
                <fieldset id="dialog-change-passwd-fieldset">
                    <div id="dialog-change-passwd-div">
                        <input type="hidden" name="uid" id="uid" value="<?php echo $_SESSION['login_user_id']; ?>" />    
                        <label for="uname" style="vertical-align: top;">Usuario:</label>&nbsp;
                        <input type="text" name="uname" id="uname" value="<?php echo $_SESSION['login_user']; ?>" style="vertical-align: middle; margin-top: 0px;" disabled="disabled"/>
                        <br><br>
                        <label for="passwd">Clave:</label>&nbsp;
                        <input type="password" name="passwd" id="passwd" value="" style="vertical-align: middle; margin-top: 0px;" />
                        <br><br>
                        <label for="npasswd">Nueva:</label>&nbsp;
                        <input type="password" name="npasswd" id="npasswd" value="" style="vertical-align: middle; margin-top: 0px;"/>
                        <br><br>
                        <label for="rnpasswd">Repetir:</label>&nbsp;
                        <input type="password" name="rnpasswd" id="rnpasswd" value="" style="vertical-align: middle; margin-top: 0px;">
                        <input type="submit" tabindex="-1" style="position:absolute; top:-1000px">
                    </div>    
                </fieldset>
            </form>
        </div>       

        <!-- Dialogo de previsualizacion de presupuesto -->
        <div id="preview-presupuesto-div" >
        </div>
        
        <!-- Dialogo de observaciones para presupuesto -->
        <div id="observaciones-presupuesto-div">
            <textarea id="observaciones-presupuesto" style="width: 100%; height: 100%; -webkit-box-sizing: border-box;
                -moz-box-sizing: border-box; box-sizing: border-box; overflow: hidden; resize: none;"></textarea>
        </div>
        
        <!-- Dialogo de observaciones generales -->    
        <div id="observaciones-gen-div">
            <textarea id="observaciones-gen" style="width: 100%; height: 100%; -webkit-box-sizing: border-box;
                -moz-box-sizing: border-box; box-sizing: border-box; overflow: hidden; resize: none;"></textarea>
        </div>
        
        <!-- Dialogo de asignacion novedades a orden -->
        <div id="novedades-orden-div">
            <div id="alta_orden_novedades_table" style='width: 100%; padding-left: 0px; padding-right: 0px;'>
             </div>
        </div>

        <!-- Dialogo de impresion OT o R -->
        <div id="ot-remito-div" style="padding: 5px 5px 5px 5px; ">
        	<form id="ot-remito-form">
	        	<fieldset id="ot-remito-form-fieldset">
	        		<legend>Elija la opci&oacute;n a imprimir:</legend>
                    <label id="label_tipo_print_ot" for="ot"><input id="ot" type="radio" name="tipo_print" value="1" checked="checked">Orden de trabajo (OT)</label><br>
                    <label id="label_tipo_print_r" for="r"><input id="r" type="radio" name="tipo_print" value="2">Remito (R)</label>
                    <input type="submit" tabindex="-1" style="position:absolute; top:-1000px">
                </fieldset>
            </form>
        </div>
        
    </body>
</html>
