<?php

    function print_head_content($type) {
        if ($type == "full") {
            echo
                "<head>".
                "<title>...:: SISTRAM -- Sistema Integral para el Seguimiento de Trabajos Mec&aacute;nicos -- Presupuesto ::...</title>".
                "<meta content='text/html; charset=UTF-8' http-equiv='content-type'>".
                "<link href='presupuesto_plantilla.css' rel='stylesheet' type='text/css' />".
                "<script type='text/javascript' src='//code.jquery.com/jquery-1.11.0.min.js'></script>".
                "<script type='text/javascript' src='//code.jquery.com/ui/1.11.1/jquery-ui.min.js'></script>".
                "<script type='text/javascript' src='js/presupuesto.js'></script>".
                "<link rel='icon' href='images/icon_sistram.png' type='image/png' sizes='32x32' />".
                "</head>";
        }
        else {
            echo 
                "<head>".
                "<link href='presupuesto_plantilla.css' rel='stylesheet' type='text/css' />".
                "<script type='text/javascript' src='js/presupuesto.js'></script>".
                "</head>";
        }
    }

    // Main ====================================================================

    require 'auth.php';
    
    $ar = filter_input_array(INPUT_POST);
                
?>

<html>
    <?php 
        print_head_content($ar["tipo"]);
    ?>
    <body class="c46">
        <table id="presupuesto_main_table" cellpadding="0" cellspacing="0" class="c16" style="width: 100%;">
            <tbody>
                <tr class="c48">
                    <td class="c9" colspan="1" rowspan="1">
                        <table cellpadding="0" cellspacing="0" class="c8">
                            <tbody>
                                <tr class="c2">
                                    <td class="c31" colspan="1" rowspan="1">
                                        <p class="c5">
                                            <span style="overflow: hidden; display: inline-block; margin: 0.00px 0.00px; border: 0.00px solid #000000; transform: rotate(0.00rad) translateZ(0px); -webkit-transform: rotate(0.00rad) translateZ(0px); width: 232.48px; height: 81.00px;">
                                                <img alt="" src="images/logo-veyser2.png" style="width: 232.48px; height: 81.00px; margin-left: 0.00px; margin-top: 0.00px; transform: rotate(0.00rad) translateZ(0px); -webkit-transform: rotate(0.00rad) translateZ(0px);" title="">
                                            </span>
                                        </p>
                                    </td>
                                    <td class="c47" colspan="1" rowspan="1">
                                        <p class="c5">
                                            <span class="c49" id="tipo_presupuesto">P</span>
                                        </p>
                                    </td>
                                    <td class="c28" colspan="1" rowspan="1">
                                        <p class="c5">
                                            <span class="c3">VEYSER S.R.L.</span>
                                        </p>
                                        <p class="c5">
                                            <span class="c3">Venezuela 2949 (1211AAE)</span>
                                        </p>
                                        <p class="c5">
                                            <span class="c3">Ciudad Aut&oacute;noma de Buenos Aires</span>
                                        </p>
                                        <p class="c5">
                                            <span class="c3">Tel: (011) 4931-2271 L. Rotativas</span>
                                        </p>
                                        <p class="c5">
                                            <span class="c3">e-mail: info@veyser.com.ar</span>
                                        </p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
                <tr class="c33">
                    <td class="c9" colspan="1" rowspan="1">
                        <table cellpadding="0" cellspacing="0" class="c8">
                            <tbody>
                                <tr class="c2">
                                    <td class="c45" colspan="1" rowspan="1" height="auto">
                                        <p class="c7"  style="text-align: left;">
                                            <span class="c3" id="numero_presupuesto"></span>
                                        </p>
                                    </td>
                                    <td class="c45" colspan="1" rowspan="1" height="auto" style="text-align: right;">
                                        <p class="c7">
                                            <span class="c3">Fecha:&nbsp;<span id="fecha_actual"></span></span>
                                        </p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
                <tr class="c2">
                    <td class="c9" colspan="1" rowspan="1" style="padding: .5em .5em .5em .5em; border-top-width: 2px;">
                        <p class="c7">
                            <span class="c3">Datos cliente</span>
                        </p>
                    </td>
                </tr>
                <tr class="c2">
                    <td class="c9" colspan="1" rowspan="1">
                        <table cellpadding="0" cellspacing="0" class="c16">
                            <tbody>
                                <tr class="c2">
                                    <td class="c44" colspan="1" rowspan="1">
                                        <p class="c0">
                                            <span class="c3data" id="cliente"></span>
                                        </p>
                                    </td>
                                    <td class="c15" colspan="1" rowspan="1">
                                        <p class="c0">
                                            <span class="c3data" id="direccion"></span>
                                        </p>
                                    </td>
                                    <td class="c29" colspan="1" rowspan="1">
                                        <p class="c0">
                                            <span class="c3data" id="cuit"></span>
                                        </p>
                                    </td>
                                </tr>
                                <tr class="c2">
                                    <td class="c44" colspan="1" rowspan="1" style="border-bottom: none;">
                                        <p class="c5">
                                            <span class="c19">Raz&oacute;n Social / Nombre y Apellido</span>
                                        </p>
                                    </td>
                                    <td class="c15" colspan="1" rowspan="1" style="border-bottom: none;">
                                        <p class="c5">
                                            <span class="c19">Direcci&oacute;n / Localidad</span>
                                        </p>
                                    </td>
                                    <td class="c29" colspan="1" rowspan="1" style="border-bottom: none;">
                                        <p class="c5">
                                            <span class="c19">CUIT / CUIL / DNI</span>
                                        </p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
                <tr class="c2">
                    <td class="c9" colspan="1" rowspan="1">
                        <table cellpadding="0" cellspacing="0" class="c16">
                            <tbody>
                                <tr class="c2">
                                    <td class="c20" colspan="1" rowspan="1">
                                        <p class="c0">
                                            <span class="c3data" id="taller"></span>
                                        </p>
                                    </td>
                                    <td class="c23" colspan="1" rowspan="1">
                                        <p class="c0">
                                            <span class="c3data" id="zona"></span>
                                        </p>
                                    </td>
                                    <td class="c14" colspan="1" rowspan="1">
                                        <p class="c0">
                                            <span class="c3data" id="interno"></span>
                                        </p>
                                    </td>
                                    <td class="c18" colspan="1" rowspan="1">
                                        <p class="c0">
                                            <span class="c3data" id="referencia"></span>
                                        </p>
                                    </td>
                                </tr>
                                <tr class="c2">
                                    <td class="c20" colspan="1" rowspan="1" style="border-bottom: none;">
                                        <p class="c5">
                                            <span class="c19">Taller</span>
                                        </p>
                                    </td>
                                    <td class="c23" colspan="1" rowspan="1" style="border-bottom: none;">
                                        <p class="c5">
                                            <span class="c19">Zona</span>
                                        </p>
                                    </td>
                                    <td class="c14" colspan="1" rowspan="1" style="border-bottom: none;">
                                        <p class="c5">
                                            <span class="c19">Interno</span>
                                        </p>
                                    </td>
                                    <td class="c18" colspan="1" rowspan="1" style="border-bottom: none;">
                                        <p class="c5">
                                            <span class="c19">Referencia</span>
                                        </p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
                <tr class="c2">
                    <td class="c9" colspan="1" rowspan="1">
                        <table cellpadding="0" cellspacing="0" class="c16">
                            <tbody>
                                <tr class="c2">
                                    <td class="c24" colspan="1" rowspan="1">
                                        <p class="c0">
                                            <span class="c3data" id="dominio"></span>
                                        </p>
                                    </td>
                                    <td class="c24" colspan="1" rowspan="1">
                                        <p class="c0">
                                            <span class="c3data" id="modelo"></span>
                                        </p>
                                    </td>
                                    <td class="c24" colspan="1" rowspan="1">
                                        <p class="c0">
                                            <span class="c3data" id="anio"></span>
                                        </p>
                                    </td>
                                    <td class="c24" colspan="1" rowspan="1">
                                        <p class="c0">
                                            <span class="c3data" id="km"></span>
                                        </p>
                                    </td>
                                </tr>
                                <tr class="c2">
                                    <td class="c24" colspan="1" rowspan="1" style="border-bottom: none;">
                                        <p class="c5">
                                            <span class="c19">Dominio</span>
                                        </p>
                                    </td>
                                    <td class="c24" colspan="1" rowspan="1" style="border-bottom: none;">
                                        <p class="c5">
                                            <span class="c19">Marca / Modelo</span>
                                        </p>
                                    </td>
                                    <td class="c24" colspan="1" rowspan="1" style="border-bottom: none;">
                                        <p class="c5">
                                            <span class="c19">A&ntilde;o </span>
                                        </p>
                                    </td>
                                    <td class="c24" colspan="1" rowspan="1" style="border-bottom: none;">
                                        <p class="c5">
                                            <span class="c19">Km</span>
                                        </p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
                <tr class="c2">
                    <td class="c9" colspan="1" rowspan="1" style="padding: .5em .5em .5em .5em; border-top-width: 2px;">
                        <p class="c7">
                            <span class="c3">Detalle Mano de Obra</span>
                        </p>
                    </td>
                </tr>
                <tr class="c2">
                    <td class="c9" colspan="1" rowspan="1" style="padding: .5em .5em .5em .5em;">
                        <p class="c7">
                            <span class="c1">Mec&aacute;nica</span>
                        </p>
                    </td>
                </tr>
                <tr class="c2">
                    <td class="c9" colspan="1" rowspan="1">
                        <table cellpadding="0" cellspacing="0" class="c16" id="tabla_mecanica">
                            <tbody>
                                <tr class="c2">
                                    <td class="c13" colspan="1" rowspan="1">
                                        <p class="c5">
                                            <span class="c1">Descripci&oacute;n</span>
                                        </p>
                                    </td>
                                    <td class="c26" colspan="1" rowspan="1" id="header_costo_mecanica">
                                        <p class="c5">
                                            <span class="c1">Costo</span>
                                        </p>
                                    </td>
                                    <td class="c26" colspan="1" rowspan="1" id="header_cant_mecanica">
                                        <p class="c5">
                                            <span class="c1">Horas</span>
                                        </p>
                                    </td>
                                    <td class="c25" colspan="1" rowspan="1" id="header_subtotal_mecanica">
                                        <p class="c5">
                                            <span class="c1">Subtotal</span>
                                        </p>
                                    </td>
                                </tr>
                                <tr class="c17" id="row_subtotal_mecanica">
                                    <td class="c35" colspan="3" rowspan="1" style="border-bottom-style: none;">
                                        <p class="c30">
                                            <span class="c1">Subtotal</span>
                                        </p>
                                    </td>
                                    <td class="c25" colspan="1" rowspan="1" style="border-bottom-style: none;">
                                        <p class="c0" style="text-align: right; ">
                                            <span class="c1" id="mecanica_subtotal" style="font-style: normal;"></span>
                                        </p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
                <tr class="c2">
                    <td class="c9" colspan="1" rowspan="1" style="padding: .5em .5em .5em .5em ;">
                        <p class="c7">
                            <span class="c1">Pintura</span>
                        </p>
                    </td>
                </tr>
                <tr class="c2">
                    <td class="c9" colspan="1" rowspan="1">
                        <table cellpadding="0" cellspacing="0" class="c16" id="tabla_pintura">
                            <tbody>
                                <tr class="c2">
                                    <td class="c36" colspan="1" rowspan="1">
                                        <p class="c5">
                                            <span class="c1">Descripci&oacute;n</span>
                                        </p>
                                    </td>
                                    <td class="c26" colspan="1" rowspan="1" id="header_costo_pintura">
                                        <p class="c5">
                                            <span class="c1">Costo</span>
                                        </p>
                                    </td>
                                    <td class="c26" colspan="1" rowspan="1" id="header_cant_pintura">
                                        <p class="c5">
                                            <span class="c1">Pa&ntilde;os</span>
                                        </p>
                                    </td>
                                    <td class="c34" colspan="1" rowspan="1" id="header_subtotal_pintura">
                                        <p class="c5">
                                            <span class="c1">Subtotal</span>
                                        </p>
                                    </td>
                                </tr>
                                <tr class="c17" id="row_subtotal_pintura">
                                    <td class="c40" colspan="3" rowspan="1" style="border-bottom-style: none;">
                                        <p class="c30">
                                            <span class="c1">Subtotal</span>
                                        </p>
                                    </td>
                                    <td class="c34" colspan="1" rowspan="1" style="border-bottom-style: none;">
                                        <p class="c0" style="text-align: right; ">
                                            <span class="c1" id="pintura_subtotal" style="font-style: normal;"></span>
                                        </p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
                <tr class="c2">
                    <td class="c9" colspan="1" rowspan="1" style="padding: .5em .5em .5em .5em ;">
                        <p class="c7">
                            <span class="c1">Chapa</span>
                        </p>
                    </td>
                </tr>
                <tr class="c2">
                    <td class="c9" colspan="1" rowspan="1">
                        <table cellpadding="0" cellspacing="0" class="c16" id="tabla_chapa">
                            <tbody>
                                <tr class="c2">
                                    <td class="c41" colspan="1" rowspan="1">
                                        <p class="c5">
                                            <span class="c1">Descripci&oacute;n</span>
                                        </p>
                                    </td>
                                    <td class="c26" colspan="1" rowspan="1" id="header_costo_chapa">
                                        <p class="c5">
                                            <span class="c1">Costo</span>
                                        </p>
                                    </td>
                                    <td class="c26" colspan="1" rowspan="1" id="header_cant_chapa">
                                        <p class="c5">
                                            <span class="c1">D&iacute;as</span>
                                        </p>
                                    </td>
                                    <td class="c12" colspan="1" rowspan="1" id="header_subtotal_chapa">
                                        <p class="c5">
                                            <span class="c1">Subtotal</span>
                                        </p>
                                    </td>
                                </tr>
                                <tr class="c17" id="row_subtotal_chapa">
                                    <td class="c37" colspan="3" rowspan="1" style="border-bottom-style: none;">
                                        <p class="c30">
                                            <span class="c1">Subtotal</span>
                                        </p>
                                    </td>
                                    <td class="c12" colspan="1" rowspan="1" style="border-bottom-style: none;">
                                        <p class="c0" style="text-align: right; ">
                                            <span class="c1"  id="chapa_subtotal" style="font-style: normal;"></span>
                                        </p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
                <tr class="c2">
                    <td class="c9" colspan="1" rowspan="1" style="padding: .5em .5em .5em .5em ; border-top: #000000 2px solid;">
                        <p class="c7">
                            <span class="c3">Detalle Repuestos</span>
                        </p>
                    </td>
                </tr>
                <tr class="c2">
                    <td class="c9" colspan="1" rowspan="1">
                        <table cellpadding="0" cellspacing="0" class="c16" id="tabla_repuestos">
                            <tbody>
                                <tr class="c2">
                                    <td class="c27" colspan="1" rowspan="1" style="border-top-style: none; border-left-style: none;">
                                        <p class="c5">
                                            <span class="c1">Descripci&oacute;n</span>
                                        </p>
                                    </td>
                                    <td id="header_costo_repuesto" class="c4" colspan="1" rowspan="1" style="border-top-style: none;">
                                        <p class="c5">
                                            <span class="c1">Costo</span>
                                        </p>
                                    </td>
                                    <td class="c4" colspan="1" rowspan="1" style="border-top-style: none;">
                                        <p class="c5">
                                            <span class="c1">Cant</span>
                                        </p>
                                    </td>
                                    <td class="c43" colspan="1" rowspan="1" style="border-top-style: none;">
                                        <p class="c5">
                                            <span class="c1">A/O</span>
                                        </p>
                                    </td>
                                    <td id="header_desc_repuestos" class="c11" colspan="1" rowspan="1" style="border-top-style: none;">
                                        <p class="c5">
                                            <span class="c1">Desc</span>
                                        </p>
                                    </td>
                                    <td id="header_subtotal_repuestos" class="c21" colspan="1" rowspan="1" style="border-top-style: none; border-right-style: none;">
                                        <p class="c5">
                                            <span class="c1">Subtotal C/D</span>
                                        </p>
                                    </td>
                                </tr>
                                <tr id="row_subtotal_repuestos" class="c17">
                                    <td class="c10" colspan="5" rowspan="1" style="border-left-style: none; border-bottom-style: none;">
                                        <p class="c30">
                                            <span class="c1">Subtotal</span>
                                        </p>
                                    </td>
                                    <td class="c21" colspan="1" rowspan="1" style="border-right-style: none; border-bottom-style: none;">
                                        <p class="c0" style="text-align: right;">
                                            <span class="c1" id="repuestos_subtotal" style="font-style: normal;"></span>
                                        </p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
                <tr class="c2">
                    <td class="c9" colspan="1" rowspan="1" style="padding: .5em .5em .5em .5em ; border-top-width: 2px;">
                        <p class="c7">
                            <span class="c3">Novedades</span>
                        </p>
                    </td>
                </tr>
                <tr class="c2">
                    <td class="c9" colspan="1" rowspan="1">
                        <table cellpadding="0" cellspacing="0" class="c16" id="tabla_novedades">
                            <tbody>
                                <tr class="c2">
                                    <td class="c41" style="width: 20%; border: 1px solid black; border-top-style: none; border-left-style: none;">
                                        <span class="c1" style="text-align: center;">Fecha</span>
                                    </td>
                                    <td class="c26" style="width: 40%; border: 1px solid black; border-top-style: none;">
                                        <span class="c1" style="text-align: center;">Descripci&oacute;n</span>
                                    </td> 
                                    <td class="c12" style="width: 40%; border: 1px solid black; border-top-style: none; border-right-style: none;">
                                        <span class="c1" style="text-align: center;">Observaciones</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr><tr class="c2">
                    <td class="c9" colspan="1" rowspan="1" style="padding: .5em .5em .5em .5em ; border-top-width: 2px;">
                        <p class="c7">
                            <span class="c3">Observaciones</span>
                        </p>
                    </td>
                </tr>
                <tr class="c2">
                    <td class="c9" colspan="1" rowspan="1" style="padding: .4em .4em .4em .4em ;">
                        <p class="c0" style="height: auto; text-align: left;">
                            <span class="c3" id="observaciones" style=" font-size: 10pt; font-weight: normal;"></span>
                        </p>
                    </td>
                </tr>
                <tr id="row_totales" class="c2">
                    <td class="c9" colspan="1" rowspan="1">
                        <table cellpadding="0" cellspacing="0" class="c16">
                            <tbody>
                                <tr class="c2">
                                    <td class="c42" colspan="1" rowspan="1">
                                        <p class="c5">
                                            <span class="c3">Subtotal</span>
                                        </p>
                                    </td>
                                    <td class="c32" colspan="1" rowspan="1">
                                        <p class="c5">
                                            <span class="c3">Bonific.</span>
                                        </p>
                                    </td>
                                    <td class="c22" colspan="1" rowspan="1">
                                        <p class="c5">
                                            <span class="c3">Subtotal bonific.</span>
                                        </p>
                                    </td>
                                    <td class="c38" colspan="1" rowspan="1">
                                        <p class="c5">
                                            <span class="c3">IVA 21%</span>
                                        </p>
                                    </td>
                                    <td class="c22" colspan="1" rowspan="1" style="border-left-width: 2px;">
                                        <p class="c5">
                                            <span class="c3" style="font-weight: bold;">Total</span>
                                        </p>
                                    </td>
                                </tr>
                                <tr class="c2">
                                    <td class="c42" colspan="1" rowspan="1">
                                        <p class="c0" style="text-align: right;">
                                            <span class="c3" id="subtotal_final"></span>
                                        </p>
                                    </td>
                                    <td class="c32" colspan="1" rowspan="1">
                                        <p class="c0">
                                            <span class="c3" id="bonif_final"></span>
                                        </p>
                                    </td>
                                    <td class="c22" colspan="1" rowspan="1">
                                        <p class="c0" style="text-align: right;">
                                            <span class="c3" id="subtotal_bonif_final"></span>
                                        </p>
                                    </td>
                                    <td class="c38" colspan="1" rowspan="1">
                                        <p class="c0" style="text-align: right;">
                                            <span class="c3" id="iva_final"></span>
                                        </p>
                                    </td>
                                    <td class="c22" colspan="1" rowspan="1" style="border-left-width: 2px;">
                                        <p class="c0" style="text-align: right;">
                                            <span class="c3" style="font-weight: bold;" id="total_final"></span>
                                        </p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>
        <p class="c6">
            <span></span>
        </p>
        <p class="c6">
            <span></span>
        </p>
        
        <div id="error_dialog" title="Error"></div>
        
        <?php
            printf('<script type="text/javascript">$(document).ready('
                    . 'function() { '
                    . '  is_ot = %d; '
                    . '  get_presupuesto(%d, %d, %d, %d); '
                    . '  var tipo = "%s"; '
                    . '  if (tipo == "full") { '
                    . '    $("#presupuesto_main_table td").css("border", "none"); '
                    . '    $("#presupuesto_main_table p").css("margin", "0px 0px 0px 0px"); '                
                    . '  } '
                    . '}); '
                    . '</script>',
            ($ar["ot"])?$ar["ot"]:0, $ar["id"], $ar["costo"], $ar["bonificacion"], $ar["presupuesto"], $ar["tipo"]);
        
        ?>

    </body>
</html>