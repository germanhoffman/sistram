/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

String.prototype.nl2br = function() {
	return this.replace(/(\r\n|\n\r|\r|\n)/g, "<br />");
}

function print_repuestos(data_repuestos) {

    var i = 0;
    
    var subt_header_visible = "table-cell";
    var subt_row_visible = "table-row";
    var col_span = 6;
    
	if (is_ot !== 0) {
		subt_header_visible = "none";
		subt_row_visible = "none";
		col_span = 4;
	}
	
	$("#header_subtotal_repuestos,#header_desc_repuestos").css("display", subt_header_visible);
	$("#header_costo_repuesto").css("display", subt_header_visible);
	
    $("#row_subtotal_repuestos").css("display", subt_row_visible);

    if (data_repuestos && data_repuestos.data && (data_repuestos.data.length > 0)) {
	    for (i = 0; i < data_repuestos.data.length; i++) {
	        
	        var costo_aux = (is_ot === 0)?data_repuestos.data[i].costo:'';
	        var desc_aux  = data_repuestos.data[i].descuento + '%';
	        var valor_aux = (is_ot === 0)?data_repuestos.data[i].valor:'';
	        
	        $('#tabla_repuestos').find('tr:last').before(
	            '<tr class="c2"><td class="c27" colspan="1" rowspan="1" style="border-left-style: none;"><p class="c0" style="text-align: left; "><span class="c1" style="font-style: normal;" >' +
	            data_repuestos.data[i].repuesto + '&nbsp;-&nbsp;Marca:&nbsp;' + data_repuestos.data[i].marca +
	            '</span></p></td><td class="c4" colspan="1" rowspan="1" style="display: ' + subt_header_visible + ';"><p class="c0" style="text-align: right; "><span class="c1" style="font-style: normal;">' +
	            costo_aux +
	            '</span></p></td><td class="c4" colspan="1" rowspan="1"><p class="c0" style="text-align: right; "><span class="c1" style="font-style: normal;">' +
	            data_repuestos.data[i].cantidad +
	            '</span></p></td><td class="c43" colspan="1" rowspan="1"><p class="c0" style="text-align: center; font-style: normal;"><span class="c1"  style="font-style: normal;">' +
	            data_repuestos.data[i].tipo +
	            '</span></p></td><td class="c11" colspan="1" rowspan="1" style="display: ' + subt_header_visible + ';"><p class="c0" style="text-align: right; font-style: normal;"><span class="c1"  style="font-style: normal;">' +
	            desc_aux +
	            '</span></p></td><td class="c21" colspan="1" rowspan="1" style="display: ' + subt_header_visible + '; border-right-style: none;"><p class="c0" style="text-align: right; font-style: normal;"><span class="c1"  style="font-style: normal;">' +
	            valor_aux +
	            '</span></p></td></tr>');    
	    }
    }
    else {
    	$('#tabla_repuestos').find('tr:last').before(
    			'<tr class="c2"><td class="c27" colspan="' + col_span + 
    			'" rowspan="1" style="border-left-style: none;"><p class="c0" style="text-align: left; ">' +
    			'<span class="c1" style="font-style: normal;" >' + 
    			'Sin informaci&oacute;n' +
    			'</span></p></td></tr>');    	
    }
        
    $('#repuestos_subtotal').html((is_ot === 0)?data_repuestos.sub.toFixed(2).toString():'');
        
    total += data_repuestos.sub;
}

function get_repuestos(o_id, p_id) {
    
    if (p_id > 0) {
        var data_obj = {
            action: 'repuestos_stored',
            presupuesto: p_id
        };
    }
    else {
        var data_obj = {
            action: 'repuestos_preview',
            id: o_id
        };
    }

    $.ajax({
        //url: mainPage + "?action=repuestos&id=" + o_id + '&descuento=' + descuento, 
        url: presupuesto_main_page,
        //data: 'action=repuestos_preview&id=' + o_id + '&presupuesto=' + presupuesto,
        data: $.param(data_obj),
        type: 'POST',
        async: false, 
        success: 
            function(result) {
                var res = JSON.parse(result);
                if (res.Result.toString() !== "ERROR") {
                    if (res.Result.repuestos) {
                        print_repuestos(res.Result.repuestos);
                    }
                }
                else {
                    $("#error_dialog").html("<p>Problemas generando presupuesto: <br>" + res.Message + "</p>");
                    $(function() {
                        $("#error_dialog").dialog({
                            modal: true,
                            buttons: {
                              Ok: function() {
                                $( this ).dialog( "close" );
                              }
                            }
                          });
                    });
                }
            },
        error:
            function(result) {
                $("#error_dialog").html("<p>Problemas generando presupuesto: <br>" + result.statusText + "</p>");
                $(function() {
                    $("#error_dialog").dialog({
                        modal: true,
                        buttons: {
                          Ok: function() {
                            $( this ).dialog( "close" );
                          }
                        }
                      });
                });
            }
    });    
}

function print_trabajos(data_trabajos) {
    
    var i = 0;
    var subt_header_visible = "table-cell";
    var subt_row_visible = "table-row";
    var col_span = 4;
    
	if (is_ot !== 0) {
		subt_header_visible = "none";
		subt_row_visible = "none";
		col_span = 1;
	}
	
	$("#header_subtotal_mecanica,#header_cant_mecanica,#header_costo_mecanica").css("display", subt_header_visible);
	$("#header_subtotal_pintura,#header_cant_pintura,#header_costo_pintura").css("display", subt_header_visible);
	$("#header_subtotal_chapa,#header_cant_chapa,#header_costo_chapa").css("display", subt_header_visible);

    $("#row_subtotal_mecanica").css("display", subt_row_visible);
    $("#row_subtotal_pintura").css("display", subt_row_visible);
    $("#row_subtotal_chapa").css("display", subt_row_visible);

    if (data_trabajos.Mecanica) {
    	        
        for (i = 0; i < data_trabajos.Mecanica.data.length; i++) {
            $('#tabla_mecanica').find('tr:last').before('<tr class="c2"><td class="c13" colspan="1" rowspan="1">' +
                    '<p class="c0" style="text-align: left; margin-bottom: 1px;"><span class="c1" style="font-style: normal;">' + 
                    data_trabajos.Mecanica.data[i].trabajo + '</span></p>' + 
                    '<p class="c0" style="font-style: normal; text-align: left; margin-top: 1px; margin-left: 5px;"><span class="c1" style="font-style: normal;">' + 
                    data_trabajos.Mecanica.data[i].observaciones.toString().nl2br() + 
                    '</span></p></td><td class="c26" colspan="1" rowspan="1" style="display: ' + subt_header_visible + '">' +
                    '<p class="c0" style="text-align: right;"><span class="c1" style="font-style: normal; ">' + 
                    data_trabajos.Mecanica.data[i].costo + 
                    '</span></p></td><td class="c26" colspan="1" rowspan="1" style="display: ' + subt_header_visible + '">' +
                    '<p class="c0" style="text-align: right;"><span class="c1" style="font-style: normal; ">' + 
                    data_trabajos.Mecanica.data[i].cantidad + 
                    '</span></p></td><td class="c25" colspan="1" rowspan="1" style="display: ' + subt_header_visible + '">' +
                    '<p class="c0" style="text-align: right;"><span class="c1" style="font-style: normal;">' + 
                    ((is_ot === 0)?data_trabajos.Mecanica.data[i].valor:'') + 
                    '</span></p></td></tr>');
    
        }
        
        $('#mecanica_subtotal').html((is_ot === 0)?data_trabajos.Mecanica.sub.toFixed(2).toString():'');
        
        total += data_trabajos.Mecanica.sub;
    }
    else {    	
    	$('#tabla_mecanica').find('tr:last').before('<tr class="c2"><td class="c13" colspan="' + col_span + 
    			'" rowspan="1">' +
                '<p class="c0" style="text-align: left; "><span class="c1" style="font-style: normal;">' +
                'Sin informaci&oacute;n' +
                '</span></p></td></tr>');
    }
    
    if (data_trabajos.Chapa) {
        
        for (i = 0; i < data_trabajos.Chapa.data.length; i++) {
            $('#tabla_chapa').find('tr:last').before('<tr class="c2"><td class="c36" colspan="1" rowspan="1">' +
                    '<p class="c0" style="text-align: left; margin-bottom: 1px;"><span class="c1" style="font-style: normal;">' + 
                    data_trabajos.Chapa.data[i].trabajo + '</span></p>' +
                    '<p class="c0" style="font-style: normal; text-align: left; margin-top: 1px; margin-left: 5px;"><span class="c1" style="font-style: normal;">' + 
                    data_trabajos.Chapa.data[i].observaciones.toString().nl2br() + 
                    '</span></p></td><td class="c26" colspan="1" rowspan="1" style="display: ' + subt_header_visible + '">' +
                    '<p class="c0" style="text-align: right;"><span class="c1" style="font-style: normal; ">' + 
                    data_trabajos.Chapa.data[i].costo + 
                    '</span></p></td><td class="c26" colspan="1" rowspan="1" style="display: ' + subt_header_visible + '">' +
                    '<p class="c0" style="text-align: right;"><span class="c1" style="font-style: normal; ">' + 
                    data_trabajos.Chapa.data[i].cantidad + 
                    '</span></p></td><td class="c34" colspan="1" rowspan="1" style="display: ' + subt_header_visible + '">' +
                    '<p class="c0" style="text-align: right;"><span class="c1" style="font-style: normal;">' + 
                    ((!is_ot)?data_trabajos.Chapa.data[i].valor:'') + 
                    '</span></p></td></tr>');    
        }
        
        $('#chapa_subtotal').html((is_ot === 0)?data_trabajos.Chapa.sub.toFixed(2).toString():'');
        
        total += data_trabajos.Chapa.sub;
    }
    else {    	
    	$('#tabla_chapa').find('tr:last').before('<tr class="c2"><td class="c13" colspan="' + col_span + 
    			'" rowspan="1">' +
                '<p class="c0" style="text-align: left; "><span class="c1" style="font-style: normal;">' +
                'Sin informaci&oacute;n' +
                '</span></p></td></tr>');
    }
    
    if (data_trabajos.Pintura) {

        for (i = 0; i < data_trabajos.Pintura.data.length; i++) {
            $('#tabla_pintura').find('tr:last').before('<tr class="c2"><td class="c41" colspan="1" rowspan="1">' +
                    '<p class="c0" style="text-align: left; margin-bottom: 1px;"><span class="c1" style="font-style: normal;">' + 
                    data_trabajos.Pintura.data[i].trabajo + '</span></p>' + 
                    '<p class="c0" style="font-style: normal; text-align: left; margin-top: 1px; margin-left: 5px;"><span class="c1" style="font-style: normal;">' + 
                    data_trabajos.Pintura.data[i].observaciones.toString().nl2br() + 
                    '</span></p></td><td class="c26" colspan="1" rowspan="1" style="display: ' + subt_header_visible + '">' +
                    '<p class="c0" style="text-align: right;"><span class="c1" style="font-style: normal; ">' + 
                    data_trabajos.Pintura.data[i].costo + 
                    '</span></p></td><td class="c26" colspan="1" rowspan="1" style="display: ' + subt_header_visible + '">' +
                    '<p class="c0" style="text-align: right;"><span class="c1" style="font-style: normal; ">' + 
                    data_trabajos.Pintura.data[i].cantidad + 
                    '</span></p></td><td class="c12" colspan="1" rowspan="1" style="display: ' + subt_header_visible + '">' +
                    '<p class="c0" style="text-align: right;"><span class="c1" style="font-style: normal;">' + 
                    ((!is_ot)?data_trabajos.Pintura.data[i].valor:'') + 
                    '</span></p></td></tr>');
        }
        
        $('#pintura_subtotal').html((is_ot === 0)?data_trabajos.Pintura.sub.toFixed(2).toString():'');
        
        total += data_trabajos.Pintura.sub;
    }
    else {    	
    	$('#tabla_pintura').find('tr:last').before('<tr class="c2"><td class="c13" colspan="' + col_span + 
    			'" rowspan="1">' +
                '<p class="c0" style="text-align: left; "><span class="c1" style="font-style: normal;">' +
                'Sin informaci&oacute;n' +
                '</span></p></td></tr>');
    }
    
}

function get_trabajos(o_id, costo, p_id) {
    
    if (p_id > 0) {
        var data_obj = {
            action: 'trabajos_stored',
            presupuesto: p_id
        };
    }
    else {
        var data_obj = {
            action: 'trabajos_preview',
            id: o_id,
            costo: costo
        };
    }
    
    $.ajax({
        url: presupuesto_main_page,
        data: $.param(data_obj),
        type: 'POST',
        async: false, 
        success: 
            function(result) {
                var res = JSON.parse(result);
                if (res.Result.toString() !== "ERROR") {
                    
                    if (res.Result.trabajos) {
                        print_trabajos(res.Result.trabajos);
                    }
                }
                else {
                    $("#error_dialog").html("<p>Problemas generando presupuesto: <br>" + res.Message + "</p>");
                    $(function() {
                        $("#error_dialog").dialog({
                            modal: true,
                            buttons: {
                              Ok: function() {
                                $( this ).dialog( "close" );
                              }
                            }
                          });
                    });
                }
            },
        error:
            function(result) {
                $("#error_dialog").html("<p>Problemas generando presupuesto: <br>" + result.statusText + "</p>");
                $(function() {
                    $("#error_dialog").dialog({
                        modal: true,
                        buttons: {
                          Ok: function() {
                            $( this ).dialog( "close" );
                          }
                        }
                      });
                });
            }
    });    
}

function print_data(presupuesto_data) {
	
	//alert(JSON.stringify(presupuesto_data));
	
    if (presupuesto_data.data) {    	
    	
    	$('#fecha_actual').html($.datepicker.formatDate('dd-mm-yy', new Date()));
    	
        if (presupuesto_data.data[0].o_id === undefined) {
        	if (is_ot === 2) {
        		$('#numero_presupuesto').html('Remito: ' + presupuesto_data.data[0].id +
        				' [ ' + presupuesto_data.data[0].fecha_alta_ot + ' ]');
        	}
        	else {
        		$('#numero_presupuesto').html('Orden: ' + presupuesto_data.data[0].id + 
        				' [ ' + presupuesto_data.data[0].fecha_alta_ot + ' ]');
        	}                       
        }
        else {
            if (presupuesto_data.data[0].fecha_actualizado !== null) {
                $('#numero_presupuesto').html('Presupuesto: ' + presupuesto_data.data[0].id + ' [ ' + 
                            presupuesto_data.data[0].estado + ': ' +
                            presupuesto_data.data[0].fecha_actualizado + ' ]<br>Orden: ' + 
                            presupuesto_data.data[0].o_id + ' [ ' + presupuesto_data.data[0].fecha_alta_ot + ' ]');
            }
            else {
                $('#numero_presupuesto').html('Presupuesto: ' + presupuesto_data.data[0].id + ' [ ' + 
                            presupuesto_data.data[0].estado + ': ' +
                            presupuesto_data.data[0].fecha_generado + ' ]<br>Orden: ' + 
                            presupuesto_data.data[0].o_id + ' [ ' + presupuesto_data.data[0].fecha_alta_ot + ' ]');
            }   
        }

        $('#cliente').html(presupuesto_data.data[0].cliente_nombre);
        $('#direccion').html(presupuesto_data.data[0].cliente_direccion);
        $('#cuit').html(presupuesto_data.data[0].cliente_cuit);
        $('#taller').html(presupuesto_data.data[0].taller_nombre);
        $('#zona').html(presupuesto_data.data[0].taller_zona);
        $('#referencia').html(presupuesto_data.data[0].referencia);
        $('#dominio').html(presupuesto_data.data[0].vehiculo_dominio);
        $('#modelo').html(presupuesto_data.data[0].vehiculo_marca + ' / ' + presupuesto_data.data[0].vehiculo_modelo);
        $('#anio').html(presupuesto_data.data[0].vehiculo_anio);
        $('#km').html(presupuesto_data.data[0].odometro);
        $('#observaciones').html(presupuesto_data.data[0].observaciones.toString().nl2br());
    }
}

function get_data(o_id, p_id) {

    if (p_id > 0) {
        var data_obj = {
            action: 'data',
            presupuesto: p_id
        };
    }
    else {
        var data_obj = {
            action: 'preview',
            id: o_id
        };
    }
    
    $.ajax({
        //url: mainPage + "?action=data&id=" + o_id, 
        url: presupuesto_main_page,
        data: $.param(data_obj),
        type: 'POST',
        async: false, 
        success: 
            function(result) {
                var res = JSON.parse(result);
                if (res.Result.toString() !== "ERROR") {
                    print_data(res.Result);
                }
                else {
                    $("#error_dialog").html("<p>Problemas generando presupuesto: <br>" + res.Message + "</p>");
                    $(function() {
                        $("#error_dialog").dialog({
                            modal: true,
                            buttons: {
                              Ok: function() {
                                $( this ).dialog( "close" );
                              }
                            }
                          });
                    });
                }
            },
        error:
            function(result) {
                $("#error_dialog").html("<p>Problemas generando presupuesto: <br>" + result.statusText + "</p>");
                $(function() {
                    $("#error_dialog").dialog({
                        modal: true,
                        buttons: {
                          Ok: function() {
                            $( this ).dialog( "close" );
                          }
                        }
                      });
                });
            }
    });    
}

function print_novedades(data_novedades) {
    
    var i = 0;
    
    if (data_novedades.novedades && (data_novedades.novedades.data.length > 0)) {

        for (i = 0; i < data_novedades.novedades.data.length; i++) {
            
            $('#tabla_novedades').find('tr:last').after('<tr class="c2"><td class="c41" style="width: 20%;">' +
                    '<span class="c1" style="font-style: normal;">' + 
                    data_novedades.novedades.data[i].fecha + 
                    '</span></td><td class="c26" style="width: 40%;>' +
                    '<span class="c1" style="font-style: normal; ">' + 
                    data_novedades.novedades.data[i].descripcion + 
                    '</span></td><td class="c12" style="width: 40%;>' +
                    '<span class="c1" style="font-style: normal;">' + 
                    data_novedades.novedades.data[i].observaciones + 
                    '</span></td></tr>');
        }               
    }
    else {
    	
    	$('#tabla_novedades').find('tr:last').after('<tr class="c2"><td colspan=3 class="c41">' +
                '<span class="c1" style="font-style: normal;">Sin informaci&oacute;n</span></td></tr>');
    }
}

function get_novedades(o_id) {
    
    var data_obj = {
        action: 'novedades',
        id: o_id
    };
    
    $.ajax({
        url: presupuesto_main_page,
        data: $.param(data_obj),
        type: 'POST',
        async: false, 
        success: 
            function(result) {
                var res = JSON.parse(result);
                if (res.Result.toString() !== "ERROR") {
                    print_novedades(res.Result);
                }
                else {
                    $("#error_dialog").html("<p>Problemas generando presupuesto: <br>" + res.Message + "</p>");
                    $(function() {
                        $("#error_dialog").dialog({
                            modal: true,
                            buttons: {
                              Ok: function() {
                                $( this ).dialog( "close" );
                              }
                            }
                          });
                    });
                }
            },
        error:
            function(result) {
                $("#error_dialog").html("<p>Problemas generando presupuesto: <br>" + result.statusText + "</p>");
                $(function() {
                    $("#error_dialog").dialog({
                        modal: true,
                        buttons: {
                          Ok: function() {
                            $( this ).dialog( "close" );
                          }
                        }
                      });
                });
            }
    });        
}

function get_presupuesto(o_id, costo, bonif, p_id) {
    
    var tot_row_visible = "table-row";

	if (is_ot !== 0) {
		tot_row_visible = "none";
	}

	switch(is_ot) {
    	case 1: 
    		$('#tipo_presupuesto').html('OT')
    		break;
    	case 2: 
    		$('#tipo_presupuesto').html('R')
    		break;
    	default: 
    		$('#tipo_presupuesto').html('P')
    }
    
    get_data(o_id, p_id);
    get_trabajos(o_id, costo, p_id);
    get_repuestos(o_id, p_id);   
    get_novedades(o_id);
    
    total_bonif = total  * (1 - bonif / 100);
    iva = total_bonif * .21;
    total_iva = total_bonif + iva;
       
    $("#row_totales").css("display", tot_row_visible);
    
    if (is_ot === 0) {
        $('#subtotal_final').html(total.toFixed(2).toString());
        $('#bonif_final').html(bonif.toString() + '%'); 
        $('#subtotal_bonif_final').html(total_bonif.toFixed(2).toString());
        $('#iva_final').html(iva.toFixed(2).toString());
        $('#total_final').html(total_iva.toFixed(2).toString());
    }
}

// Main ========================================================================

var presupuesto_main_page = "presupuesto.php";
var total = 0, total_bonif = 0, iva = 0, total_iva = 0, presupuesto = 0, is_ot = 1;
