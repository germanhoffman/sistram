/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

Number.prototype.round = function (places) {
	return +(Math.round(this + "e+" + places)  + "e-" + places);
}

var get_total_orden = function(event, data) {
	
	var user_type = parseInt(session_data.login_user_type)
	var result = -1;
	var orden_id;
	
	if ($.isArray(data.record)) {
		orden_id = data.record[0].orden;
	}
	else {
		orden_id = data.record.orden;
	}
	
	$.ajax({
		async: false,
		type: "POST",
		url: "presupuesto.php",
		data: {action: 'total_orden', id: orden_id, tipo_costo: (user_type === 2)?2:1},
		success: function(data) {
			result = data.Result.total_orden;
		},
		dataType: 'json'
	});
    
	if (result != -1) {
        $("#orden_table").jtable('updateRecord', {
        	clientOnly: true,
        	animationsEnabled: false,
        	record: {
        		id: orden_id,
        		total_orden: result
        	}
        });
	}	
}

function show_table_orden() {
    
    var user_type = parseInt(session_data.login_user_type);
    
    $('#orden_table').jtable({
        jqueryuiTheme: true,
        messages: spanishMessages,
        title: 'Listado de Ordenes',
        paging: true,
        pageSize: 50,
        sorting: false,
        openChildAsAccordion: true,
        actions: {
            listAction: mainPage + '?action=list&table=orden',
            createAction: (user_type === 3)?mainPage + '?action=create&table=orden':null,
            updateAction: (user_type === 3)?mainPage + '?action=update&table=orden':null,
            deleteAction: (user_type === 3)?mainPage + '?action=delete&table=orden':null
        },
        fields: {
            novedad: {
                title: '',
                width: '5px',
                sorting: false,
                edit: false,
                create: false,
                columnResizable: false,
                type: (user_type === 1)?'hidden':'',
                display: function (ordenData) {
                    
                    if (parseInt(ordenData.record.od_estado) === 100 ||
                    	parseInt(ordenData.record.od_estado) === 106 ||	
                        parseInt(ordenData.record.od_estado) === 202) {
                                        
                        var $img = $('<img src="images/novedades.png" title="Novedades" style="cursor: pointer;"/>');

                        $img.click(function () {

                            $('#orden_table').jtable('openChildTable', $img.closest('tr'),
                            {
                                jqueryuiTheme: true,
                                messages: spanishMessages,
                                title: 'Orden #' + ordenData.record.id + ' - Novedades',
                                paging: true,
                                pageSize: 10,
                                sorting: false,
                                toolbar: {
                                    items: [{
                                        icon: 'images/add.png',
                                        text: 'Agregar',
                                        click: function () {
                                            //perform your custom job...
                                            $('#novedades-orden-div').dialog('option', 'orden_id', ordenData.record);
                                            $('#novedades-orden-div').dialog('open');
                                        }
                                    }]
                                },
                                actions: {
                                    listAction: mainPage + '?action=list&table=orden_novedad&filter_field=orden&orden=' + 
                                            ordenData.record.id,
                                    //createAction: mainPage + '?action=create&table=orden_novedad',
                                    deleteAction: mainPage + '?action=delete&table=orden_novedad'
                                },
                                fields: {
                                    id: {
                                        key: true,
                                        type: 'hidden',
                                        list: false
                                    },
                                    orden: {
                                        type: 'hidden',
                                        list: false,
                                        create: false,
                                        edit: false
                                    },
                                    novedad: {
                                        type: 'hidden',
                                        list: false,
                                        create: false,
                                        edit: false
                                    },
                                    fecha: {
                                        title: 'Fecha',
                                        type: 'date',
                                        width: '10%'
                                    },
                                    descripcion: {
                                        title: 'Descripci&oacute;n',
                                        width: '40%'                                        
                                    },
                                    observaciones: {
                                        title: 'Observaciones',
                                        width: '50%'
                                    }
                                }
                            }, function (data) { //opened handler
                                currentChildTable = data.childTable;
                                data.childTable.jtable('load');
                            });
                        });
                    }
                    else {
                        var $img = $('<img src="images/novedades2.png" title="Novedades" style="cursor: default;"/>');
                    }

                    //Return image to show on the person row
                    return $img;
                }
            },
            trabajo: {
                title: '',
                width: '5px',
                sorting: false,
                edit: false,
                create: false,
                columnResizable: false,
                type: (user_type === 1)?'hidden':'',
                display: function (ordenData) {
                    
                    if (parseInt(ordenData.record.od_estado) === 100 ||
                    	parseInt(ordenData.record.od_estado) === 106 ||	
                        parseInt(ordenData.record.od_estado) === 202) {
                        var $img = $('<img src="images/trabajo.png" title="Trabajos" style="cursor: pointer;"/>');

                        $img.click(function () {
                            $('#orden_table').jtable('openChildTable', $img.closest('tr'),
                            {
                                jqueryuiTheme: true,
                                messages: spanishMessages,
                                title: 'Orden #' + ordenData.record.id + ' - Trabajos',
                                paging: true,
                                pageSize: 10,
                                sorting: false,
                                actions: {
                                    listAction: mainPage + '?action=list&table=orden_trabajo&filter_field=orden&orden=' + 
                                            ordenData.record.id,
                                    createAction: mainPage + '?action=create&table=orden_trabajo',
                                    updateAction: mainPage + '?action=update&table=orden_trabajo',
                                    deleteAction: mainPage + '?action=delete&table=orden_trabajo'
                                },
                                fields: {
                                    id: {
                                        key: true,
                                        type: 'hidden',
                                        list: false
                                    },
                                    orden: {
                                        list: true,
                                        type: 'hidden',
                                        defaultValue: ordenData.record.id
                                    },
                                    /*fecha: {
                                        title: 'Fecha',
                                        width: '20%',
                                        listClass: 'column_text_center',
                                        edit: false,
                                        create: false
                                    },*/
                                    trabajo: {
                                        title: 'Tarea',
                                        width: '40%',
                                        type: 'textarea'
                                    },
                                    tipo: {
                                        title: 'Tipo',
                                        width: '10%',
                                        options: mainPage + '?action=options&table=trabajo'
                                    },
                                    costo1: {
                                    	title: 'Costo',
                                    	width: '10%',
                                    	type: (user_type === 3)?'text':'hidden',
                                    	edit: false,
                                    	create: false,
                                    	listClass: 'column_number'
                                    },
                                    costo2: {
                                    	title: 'Costo',
                                    	width: '10%',
                                    	type: (user_type === 2)?'text':'hidden',
                                    	edit: false,
                                    	create: false,
                                    	listClass: 'column_number'
                                    },
                                    cantidad: {
                                        title: 'Cantidad',
                                        width: '10%',
                                        listClass: 'column_number'
                                    },
                                    observaciones: {
                                        title: 'Observaciones',
                                        width: '30%',
                                        type: 'textarea'
                                    }
                                },
                                recordAdded: get_total_orden,
                        		recordUpdated: get_total_orden,
                        		recordDeleted: get_total_orden,
                            }, function (data) { //opened handler
                                data.childTable.jtable('load');
                            });
                        });
                    }
                    else {
                        var $img = $('<img src="images/trabajo2.png" title="Trabajos" style="cursor: default;"/>');
                    }
                   
                    //Return image to show on the person row
                    return $img;
                }
            },
            repuesto: {
                title: '',
                width: '5px',
                sorting: false,
                edit: false,
                create: false,
                columnResizable: false,
                type: (user_type === 1)?'hidden':'',
                display: function (ordenData) {
                    
                    if (parseInt(ordenData.record.od_estado) === 100  ||
                    	parseInt(ordenData.record.od_estado) === 106 ||
                    	parseInt(ordenData.record.od_estado) === 202) {

                        var $img = $('<img src="images/repuesto.png" title="Repuestos" style="cursor: pointer;"/>');
                        $img.click(function () {
                            $('#orden_table').jtable('openChildTable', $img.closest('tr'),
                            {
                                jqueryuiTheme: true,
                                messages: spanishMessages,
                                title: 'Orden #' + ordenData.record.id + ' - Respuestos',
                                paging: true,
                                pageSize: 10,
                                sorting: false,
                                actions: {
                                    listAction: mainPage + '?action=list&table=orden_repuesto&filter_field=orden&orden=' + ordenData.record.id,
                                    createAction: mainPage + '?action=create&table=orden_repuesto',
                                    updateAction: mainPage + '?action=update&table=orden_repuesto',
                                    deleteAction: mainPage + '?action=delete&table=orden_repuesto'
                                },
                                fields: {
                                    id: {
                                        key: true,
                                        type: 'hidden',
                                        list: false
                                    },
                                    orden: {
                                        list: true,
                                        type: 'hidden',
                                        defaultValue: ordenData.record.id
                                    },
                                    nombre: {
                                        title: 'Repuesto',
                                        width: '35%'
                                    },
                                    marca: {
                                    	title: 'Marca',
                                    	width: '35%'
                                    },
                                    valor: {
                                        title: 'Costo',
                                        width: '10%',
                                        listClass: 'column_number'
                                    },
                                    cantidad: {
                                        title: 'Cantidad',
                                        width: '5%',
                                        listClass: 'column_number'
                                    },
                                    tipo: {
                                        title: 'Tipo',
                                        width: '15%',
                                        options: [{Value: '1', DisplayText: 'Alternativo'},
                                        	      {Value: '0', DisplayText: 'Original' },
                                        	      {Value: '2', DisplayText: 'Otro' }]
                                    }
                                },
                                recordAdded: get_total_orden,
                        		recordUpdated: get_total_orden,
                        		recordDeleted: get_total_orden,                                
                            }, function (data) { //opened handler
                                data.childTable.jtable('load');
                            });
                        });
                    }
                    else {
                        var $img = $('<img src="images/repuesto2.png" title="Repuestos" style="cursor: default;"/>');
                    }
                    //Return image to show on the person row
                    return $img;
                }
            },
            p_tipo: {
                list: false,
                edit: false,
                create: false,
                type: 'hidden',
            },
            presupuesto_gen: {
                title: '',
                width: '5px',
                sorting: false,
                edit: false,
                create: false,
                columnResizable: false,
                type: (user_type === 1)?'hidden':'',
                display: function (ordenData) {
                    
                    if (parseInt(ordenData.record.od_estado) === 100 ||
                        parseInt(ordenData.record.od_estado) === 202 ||
                        parseInt(ordenData.record.od_estado) === 106 ||
                        (parseInt(ordenData.record.p_tipo) === 1 &&
                         parseInt(user_type) === 3)){
                    
                        var $img = $('<img src="images/presupuesto3.png" title="Vista previa presupuesto" style="cursor: pointer;" />');

                        $img.click(function () {
                            
                            var costo = (user_type === 2)?2:1;
                            
                            if (user_type === 3) {
                                $("#dialog-bonificacion").data('orden', ordenData.record.id);
                                $("#dialog-bonificacion").data('costo', costo);
                                $("#dialog-bonificacion").dialog('option', 'title', 'Orden #' + ordenData.record.id + 
                                        ' - Presupuesto bonificación')
                                $("#dialog-bonificacion").dialog('open');
                            }
                            else {
                                preview_presupuesto(ordenData.record.id, costo, 0);
                            }
                        });
                    }
                    else {
                        var $img = $('<img src="images/presupuesto4.png" title="Vista previa presupuesto" style="cursor: default;" />');
                    }
                    //Return image to show on the person row
                    return $img;
                }
            },
            otr_gen: {
                title: '',
                width: '5px',
                sorting: false,
                edit: false,
                create: false,
                columnResizable: false,
                type: (user_type === 1)?'hidden':'',
                display: function (ordenData) {
                    
                    if (parseInt(user_type) !== 1 && 
                    	((parseInt(ordenData.record.od_estado) >= 100 && parseInt(ordenData.record.od_estado) <= 104) ||
                    	parseInt(ordenData.record.od_estado) === 106 ||		
                        parseInt(ordenData.record.od_estado) === 202)) {
                    
                        var $img = $('<img src="images/print.png" title="Imprimir OT/R" style="cursor: pointer;" />');

                        $img.click(function () {
                        	$("#ot-remito-div").data("orden_id", ordenData.record.id);
                        	$("#ot-remito-div").data("orden_status", ordenData.record.od_estado);
                        	$("#ot-remito-div").data("orden_pid", ordenData.record.p_id);
                        	$("#ot-remito-div").dialog("option", "title", "Imprimir - Orden: " + ordenData.record.id);
                        	$("#ot-remito-div").dialog("open");
                            //preview_ot(ordenData.record.id);
                        });
                    }
                    else {
                        var $img = $('<img src="images/print2.png" title="Imprimir OT/R" style="cursor: default;" />');
                    }
                    //Return image to show on the person row
                    return $img;
                }
            },
            orden_action: {
                title: '',
                width: '5px',
                sorting: false,
                edit: false,
                create: false,
                columnResizable: false,
                type: (user_type === 1)?'hidden':'',
                display: function (ordenData) {
                    
                    var $img = null;
                    var next_action_status;
                   
                    switch (parseInt(ordenData.record.od_estado)) {
                        case 102: // APROBADA
                            $img = $('<img src="images/start.png" title="Presupuesto aprobado. Iniciar trabajos" style="cursor: pointer;" />');
                            next_action_status = "iniciar_trabajos"; 
                            break;
                        case 103: // EN PROGRESO
                            $img = $('<img src="images/aceptar.png" title="Finalizar trabajos" style="cursor: pointer;" />');
                            next_action_status = "finalizar_trabajos";
                            break;
                        case 104: // TERMINADA
                            if (parseInt(user_type) === 3) { 
                                $img = $('<img src="images/cerrar.png" title="Trabajos finalizados. Cerrar orden" style="cursor: pointer;" />');
                                next_action_status = "cerrar_orden";
                            }
                            break;
                        case 105: // TERMINADA
                        case 200: // CANCELADA
                            if (parseInt(user_type) === 3) { 
                                $img = $('<img src="images/undo.png" title="Orden cerrada. Reabrir" style="cursor: pointer;" />');
                                next_action_status = "reabrir_orden";
                            }
                            break;    
                    }
                    
                    if ($img !== null) {
                        $img.click(function () {
                            
                            $('#observaciones-gen-div').data('orden_data', ordenData.record);
                            $('#observaciones-gen-div').data('next_action_status', next_action_status);
                            $('#observaciones-gen-div').dialog('open');

                        });
                    }

                    //Return image to show on the person row
                    return $img;
                }
            },
            id: {
                key: true,
                list: true,
                edit: false,
                create: false,
                title: '#',
                listClass: 'column_number',
                visibility: 'fixed'
            },
            fecha: {
            	list: false,
            	edit: false,
            	create: false
            },
            hora: {
            	list: false,
            	edit: false,
            	create: false
            },
            fecha_hora: {
            	title: 'Fecha',
            	list: true,
            	edit: false,
            	create: false,
            	listClass: 'column_text_center',
            	visibility: 'fixed',
            	display: function(data) {
            		return "<div><span style='white-space: nowrap;'>" + data.record.fecha + 
            			"</span><br><span style='white-space: nowrap;'>" + data.record.hora + "</span></div>";
            	}            	
            },
            taller: {
                title: 'Taller',
                width: '20%',
                options: mainPage + '?action=options&table=taller',
                visibility: 'fixed'
            },
            cliente: {
                title: 'Cliente',
                width: '20%',
                options: mainPage + '?action=options&table=cliente',
                visibility: 'fixed'
            },
            zona: {
                title: 'Zona',
                width: '20%',
                visibility: 'fixed',
                dependsOn: ['taller','cliente'],
                options: function (data) {
                    if (data.source === 'list') {
                        return mainPage + '?action=options&table=zona&filter_field[0]=cliente&filter_field[1]=taller&cliente=0&taller=0';
                    }
                    else {
                        return mainPage + '?action=options&table=zona&filter_field[0]=cliente&filter_field[1]=taller&cliente=' + 
                                data.dependedValues.cliente + '&taller=' + data.dependedValues.taller;
                    }
                }
            },
            vehiculo: {
                title: 'Vehiculo',
                width: '20%',
                visibility: 'fixed',
                dependsOn: 'cliente',
                options: function (data) {
                    if (data.source === 'list') {
                        return mainPage + '?action=options&table=vehiculo&filter_field=cliente&cliente=0';
                    }
                    else {
                        return mainPage + '?action=options&table=vehiculo&filter_field=cliente&cliente=' + 
                                data.dependedValues.cliente;
                    }
                }
            },
            odometro: {
                title: 'Odometro',
                width: '10%',
                visibility: 'fixed',
                listClass: 'column_number'
            },
            interno: {
                title: 'Interno',
                width: '10%',
                visibility: 'fixed',
                listClass: 'column_number'                
            },
            referencia: {
                title: 'Referencia',
                width: '10%',
                visibility: 'fixed'
            },
            /*novedades: {
                title: 'Novedades',
                width: '20%',
                type: 'textarea',
                visibility: 'fixed'
            },*/
            /*estado: {
                title: 'Estado',
                width: '10%',
                options: mainPage + '?action=options&table=estado',
                create: false,
                edit: false,
                listClass: 'column_text_center',
                visibility: 'fixed'
            },*/
            od_estado: {
                title: 'Estado',
                width: '10%',
                options: mainPage + '?action=options&table=estado',
                create: false,
                edit: false,
                listClass: 'column_text_center',
                visibility: 'fixed'                
            },
            presupuesto: {
                title: 'Presupuesto',
                width: '15%',
                //options: mainPage + '?action=options&table=estado',
                create: false,
                edit: false,
                listClass: 'column_text_center',
                visibility: 'fixed'                
            },
            factura: {
            	title: 'Factura',
            	width: '10%',
            	listClass: 'column_text_center',
            	visibility: 'fixed',
            	display: function(data) {
            		if ($.trim(data.record.factura) === "" && 
            				(parseInt(data.record.od_estado) === 104 || parseInt(data.record.od_estado) == 105)) {
            			return "<div style='color: red; border-radius: 5px; " +
            				"padding: 5px; border: 1px solid red; font-weight: bold;'>SIN<br>FACTURAR</div>";
            		} 
            		else {
            			return data.record.factura;
            		}
            	}
            },
            observaciones: {
                title:'Observaciones',
                list: true,
                edit: true,
                name: 'observaciones',
                type: 'textarea'
            },
            costo_total: {
            	title: 'Costo',
            	width: '10%',
            	visibility: 'fixed',
            	listClass: 'column_number'            		
            },
            total_orden: {
            	create: false,
            	edit: false,            	
            	title: 'Total',
            	width: '10%',
            	visibility: 'fixed',
            	listClass: 'column_number'
            },
            indice_ganancia: {
            	create: false,
            	edit: false,            	
            	title: '&Iacute;ndice',
            	width: '10%',
            	visibility: 'fixed',
            	listClass: 'column_number',
            	display: function (ordenData) {
            		
            		var result = 0; 
            		
                  	if (ordenData.record.total_orden > 0 && ordenData.record.costo_total > 0) {
                  		result = (ordenData.record.total_orden - ordenData.record.costo_total)*100/ordenData.record.costo_total;
                	}
                  	
                  	var back_color = "lime";
                  	var text_color = "black";
                  	if (result <= 3) {
              			back_color = "red";
              			text_color = "white";                  		
                  	} 
                  	else if (result > 3 && result <= 15) {
              			back_color = "yellow";
              			text_color = "black";                  		
                  	}
            		            		
            		return "<div style='border-radius: 5px; color: " + text_color + " ; background-color: " + back_color + "; padding: 5px; '>" + 
            			result.round(0) + "%</div>";
            	}
            },
            pobservaciones: {
            	list: false,
            	edit: false,
            	create: false,
            	visibility: 'hidden'
            },
            presupuesto_listado: {
                title: '',
                width: '5px',
                sorting: false,
                edit: false,
                create: false,
                columnResizable: false,
                visibility: 'fixed',
                display: function (ordenData) {
                    var $img = $('<img src="images/presupuesto2.png" title="Presupuestos generados" style="cursor: pointer;"/>');
                    $img.click(function () {
                        $('#orden_table').jtable('openChildTable', $img.closest('tr'),
                        {
                            jqueryuiTheme: true,
                            messages: spanishMessages,
                            title: 'Orden #' + ordenData.record.id + ' - Presupuestos generados',
                            paging: true,
                            pageSize: 10,
                            sorting: false,
                            ajaxSettings: {
                                type: 'POST',
                                dataType: 'json'
                            },
                            actions: {
                                listAction: mainPage + '?action=list&table=presupuesto&filter_field=orden&orden=' + 
                                        ordenData.record.id
                                //updateAction: 'presupuesto.php'
                            },
                            fields: {
                                id: {
                                    key: true,
                                    list: true,
                                    edit: false,
                                    create: false,
                                    title: 'No.',
                                    listClass: 'column_number',
                                    width: '12px',
                                    visibility: 'fixed'
                                },
                                fecha_generado: {
                                    title: 'Generado',
                                    width: '20%',
                                    listClass: 'column_text_center',
                                    visibility: 'fixed'                                    
                                },
                                fecha_actualizado: {
                                    title: 'Modificado',
                                    width: '20%',
                                    listClass: 'column_text_center',
                                    visibility: 'fixed'                                    
                                },
                                orden: {
                                    type: 'hidden'
                                },
                                usuario_gen: {
                                    title: 'Generado por',
                                    width: '20%',
                                    options: mainPage + '?action=options&table=usuario&filter_field=tipo&tipo=\'\'',
                                    listClass: 'column_text_center',
                                    type: (user_type === 3)?'text':'hidden',
                                    visibility: 'fixed'
                                },
                                usuario_act: {
                                    title: 'Modificado por',
                                    width: '20%',
                                    options: mainPage + '?action=options&table=usuario&filter_field=tipo&tipo=\'\'',
                                    listClass: 'column_text_center',
                                    type: (user_type === 3)?'text':'hidden',
                                    visibility: 'fixed'
                                },
                                p_tipo: {
                                    title: 'Tipo',
                                    width: '20%',
                                    options: { '1': 'Taller', '2': 'Administrador' },
                                    listClass: 'column_text_center',
                                    type: (user_type === 3)?'':'hidden',
                                    visibility: 'fixed'
                                },
                                estado: {
                                    title: 'Estado',
                                    width: '20%',
                                    options: { '1': 'Pendiente', '2': 'Aprobado', '3': 'Rechazado' },
                                    listClass: 'column_text_center',
                                    visibility: 'fixed'
                                },
                                observaciones: {
                                    title: 'Observaciones',
                                    width: '60%',
                                    visibility: 'fixed'
                                },
                                visualizar: {
                                    title: '',
                                    width: '5px',
                                    sorting: false,
                                    edit: false,
                                    create: false,
                                    columnResizable: false,
                                    //type: (user_type === 1)?'hidden':'',
                                    display: function (presupuestoData) {

                                        var $img = $('<img src="images/presupuesto3.png" title="Ver el presupuesto" style="cursor: pointer;" />');

                                        $img.click(function () {

                                            $.ajax({
                                                type: "POST",
                                                url: "presupuesto_plantilla.php", 
                                                data: 'presupuesto=' + presupuestoData.record.id + '&id=' + 
                                                        presupuestoData.record.orden,
                                                async: false, 
                                                success: 
                                                    function(result) {
                                                        
                                                        var buttons = {
                                                            Imprimir: function() {
                                                                alert("Imprimir presupuesto!");
                                                                $("<form method='post' action='presupuesto_plantilla.php' target='_blank'>" +
                                                                        "<input type='hidden' name='presupuesto' value='" + presupuestoData.record.id + "' />" +
                                                                        "<input type='hidden' name='id' value='" + presupuestoData.record.orden + "' />" +
                                                                        "<input type='hidden' name='tipo' value='full' /></form>").appendTo('body').submit();
                                                            },
                                                            Cerrar: function() {
                                                                $( this ).dialog( 'close' );
                                                            }
                                                        };
                                                        
                                                        $('#preview-presupuesto-div').dialog('option', 'buttons', buttons);
                                                        $('#preview-presupuesto-div').dialog('option', 'title', 'Presupuesto #' + presupuestoData.record.id);
                                                        $('#preview-presupuesto-div').html(result);                                            
                                                        $('#preview-presupuesto-div').dialog('open');
                                                    },
                                                error:
                                                    function(result) {
                                                        alert("Error al cambiar clave. " + result.statusText);
                                                    }
                                            });                        
                                        });
                                        //Return image to show on the person row
                                        return $img;
                                    }
                                },
                                aprobar: {
                                    title: '',
                                    width: '5px',
                                    sorting: false,
                                    edit: false,
                                    create: false,
                                    columnResizable: false,
                                    //type: (user_type === 1)?'hidden':'',
                                    display: function (presupuestoData) {
                                        
                                        var $img = null;
                                        
                                        if (presupuestoData.record.estado === '1') {
                                            var $img = $('<img src="images/aceptar.png" title="Click para aprobar presupuesto" style="cursor: pointer;" />');

                                            $img.click(function() {
                                                curChildTable.jtable('updateRecord', {
                                                    url: 'presupuesto.php',
                                                    record: {
                                                        action: 'aprobar',
                                                        id: presupuestoData.record.id,
                                                        observaciones: 'Presupuesto para orden aprobado'
                                                    },
                                                    success: 
                                                        function(result) {
                                                            if (result.Result !== "ERROR") {
                                                                
                                                                alert("Presupuesto #" + presupuestoData.record.id + " aprobado!!!");

                                                                var cur_row = $("#orden_table").jtable('getRowByKey',
                                                                    presupuestoData.record.orden);
                                                                    
                                                                $("#orden_table").jtable('closeChildTable', cur_row);
                                                                
                                                                $("#orden_table").jtable('updateRecord', {
                                                                    clientOnly: true,
                                                                    record: {
                                                                        id: presupuestoData.record.orden,
                                                                        od_estado: 102,
                                                                        presupuesto: presupuestoData.record.id + ' - Aprobado'
                                                                    }
                                                                });
                                                            }
                                                            else {
                                                                alert("Problemas al intentar aprobar presupuesto #" + presupuestoData.record.id +
                                                                        ". " + result.Message);                                                                
                                                            }
                                                        }
                                                }); 
                                            });
                                        }
                                        else {
                                            var $img = $('<img src="images/aceptar2.png" />');
                                        }
                                        
                                        return $img;
                                    }
                                },                                
                                rechazar: {
                                    title: '',
                                    width: '5px',
                                    sorting: false,
                                    edit: false,
                                    create: false,
                                    columnResizable: false,
                                    //type: (user_type === 1)?'hidden':'',
                                    display: function (presupuestoData) {

                                        if (presupuestoData.record.estado === '1') {
                                            var $img = $('<img src="images/rechazar.png" title="Click para rechazar presupuesto" style="cursor: pointer;" />');

                                            $img.click(function () {
                                                curChildTable.jtable('updateRecord', {
                                                    url: 'presupuesto.php',
                                                    record: {
                                                        action: 'rechazar',
                                                        id: presupuestoData.record.id,
                                                        observaciones: 'Presupuesto para orden rechazado'
                                                    },
                                                    success: 
                                                        function(result) {
                                                            if (result.Result !== "ERROR") {
                                                                alert("Presupuesto #" + presupuestoData.record.id + " rechazado!!!");
                                                                var cur_row = $("#orden_table").jtable('getRowByKey',
                                                                    presupuestoData.record.orden);
                                                                    
                                                                $("#orden_table").jtable('closeChildTable', cur_row);
                                                                
                                                                $("#orden_table").jtable('updateRecord', {
                                                                    clientOnly: true,
                                                                    record: {
                                                                        id: presupuestoData.record.orden,
                                                                        od_estado: 202,
                                                                        presupuesto: presupuestoData.record.id + ' - Rechazado'
                                                                    }
                                                                });
                                                            }
                                                            else {
                                                                alert("Problemas al intentar rechazar presupuesto #" + presupuestoData.record.id +
                                                                        ". " + result.Message);                                                                
                                                            }
                                                        }
                                                }); 
                                            });
                                        }
                                        else {
                                            var $img = $('<img src="images/rechazar2.png" />');
                                        }
                                        
                                        return $img;
                                    }
                                }                                
                            }
                        }, function (data) { //opened handler
                            curChildTable = data.childTable;
                            curChildTable.jtable('load');
                            //data.childTable.jtable('load');
                        });
                    });
                    //Return image to show on the person row
                    return $img;
                }
            },
            detalle: {
                title: '',
                width: '5px',
                sorting: false,
                edit: false,
                create: false,
                columnResizable: false,
                visibility: 'fixed',
                display: function (ordenData) {
                    var $img = $('<img src="images/detalle.png" title="Seguimiento" style="cursor: pointer;"/>');
                    $img.click(function () {
                        //var user_type = parseInt(session_data.login_user_type);
                        
                        $('#orden_table').jtable('openChildTable', $img.closest('tr'),
                        {
                            jqueryuiTheme: true,
                            messages: spanishMessages,
                            title: 'Orden #' + ordenData.record.id + ' - Seguimiento',
                            paging: true,
                            pageSize: 10,
                            sorting: false,
                            actions: {
                                listAction: mainPage + '?action=list&table=orden_detalle&filter_field=orden&orden=' + 
                                        ordenData.record.id
                            },
                            fields: {
                                id: {
                                    key: true,
                                    type: 'hidden',
                                    list: false
                                },
                                orden: {
                                    list: false,
                                    type: 'hidden'
                                },
                                fecha: {
                                    title: 'Fecha',
                                    width: '20%',
                                    listClass: 'column_text_center',
                                    visibility: 'fixed'
                                },
                                estado: {
                                    title: 'Estado',
                                    width: '20%',
                                    options: mainPage + '?action=options&table=estado',
                                    visibility: 'fixed'
                                },
                                observaciones: {
                                    title: 'Observaciones',
                                    width: '60%',
                                    type: 'textarea',
                                    visibility: 'fixed'
                                },
                                usuario: {
                                    title: 'Usuario',
                                    width: '20%',
                                    options: mainPage + '?action=options&table=usuario&filter_field=tipo&tipo=\'\'',
                                    listClass: 'column_text_center',
                                    type: (user_type === 3)?'':'hidden',
                                    visibility: 'fixed'                                    
                                },
                                tipo: {
                                    title: 'Tipo',
                                    width: '20%',
                                    options: { 1: 'Cliente', 2: 'Taller', 3: 'Administrador' },
                                    listClass: 'column_text_center',
                                    type: (user_type === 3)?'':'hidden',
                                    visibility: 'fixed'
                                }
                            }
                        }, function (data) { //opened handler
                            data.childTable.jtable('load');
                        });
                    });
                    //Return image to show on the person row
                    return $img;
                }
            },
            cancel: {
                title: '',
                width: '5px',
                sorting: false,
                edit: false,
                create: false,
                columnResizable: false,
                type: (user_type === 3)?'':'hidden',
                display: function (ordenData) {
                    
                    var $img = null;
                    
                    if ($.inArray(parseInt(ordenData.record.od_estado), [105, 200]) === -1) { // Orden no cerrada ni cancelada se puede cancelar
                        $img = $('<img src="images/rechazar.png" title="Cancelar orden" style="cursor: pointer;" />');

                        $img.click(function () {

                            $('#observaciones-gen-div').data('orden_data', ordenData.record);
                            $('#observaciones-gen-div').data('next_action_status', 'cancelar_orden');
                            $('#observaciones-gen-div').dialog('open');
                            
                            /*if (user_type !== 3) {
                                $('#costo_span').css({'visibility':'hidden', display: ''});

                                $('#costo1').prop('checked', true);

                                $('#presupuesto-form').submit();
                            }
                            else {
                                $('#dialog-form').dialog( "open" );
                            }*/
                        });
                    }
                    else {
                        $img = $('<img src="images/rechazar2.png" title="Cancelar orden" style="cursor: default;" />');
                    }

                    //Return image to show on the person row
                    return $img;
                }
            }            
        }
    });
    
    //Re-load records when user click 'load records' button.
    $('#ordenSearchButton').click(function (e) {
        e.preventDefault();
        
        $('#orden_table').jtable('load', {
            filter_text: $('#filter_text_orden').val()
        });
    });

    //Load all records when page is first shown
    $('#ordenSearchButton').click();
        
    //$('#orden_table').jtable('load');
}

function show_table_novedad() {
    
    var user_type = parseInt(session_data.login_user_type);
    var user_id = parseInt(session_data.login_user_id);
    
    $('#novedad_table').jtable({
        jqueryuiTheme: true,
        messages: spanishMessages,
        title: 'Novedades',
        paging: true,
        pageSize: 50,
        sorting: false,
        actions: {
            listAction:   mainPage + '?action=list&table=novedad',
            createAction: mainPage + '?action=create&table=novedad',
            updateAction: mainPage + '?action=update&table=novedad',
            deleteAction: mainPage + '?action=delete&table=novedad'
        },
        fields: {
            id: {
                key: true,
                list: true,
                edit: false,
                create: false,
                title: 'No.',
                listClass: 'column_number',
                width: '12px',
                columnResizable: false,
                visibility: 'fixed',
                type: 'hidden'
            },
            fecha: {
                title: 'Fecha',
                width: '10%',
                visibility: 'fixed',
                listClass: 'column_text_center',
                edit: false,
                create: false,
                type: 'date'
            },
            cliente_id: {
                title: 'Cliente',
                width: '20%',
                options: mainPage + '?action=options&table=cliente',
                visibility: 'fixed'
            },
            vehiculo: {
                title: 'Veh&iacute;culo',
                width: '10%',
                visibility: 'fixed',
                dependsOn: 'cliente_id',
                options: function (data) {
                    if (data.source === 'list') {
                        return mainPage + '?action=options&table=vehiculo&filter_field=cliente&cliente=0';
                    }
                    else {
                        return mainPage + '?action=options&table=vehiculo&filter_field=cliente&cliente=' + 
                                data.dependedValues.cliente_id;
                    }
                },
                listClass: 'column_text_center'
            },
            odometro: {
                title: 'Od&oacute;metro',
                width: '20%',
                listClass: 'column_number',
                visibility: 'fixed'
            },
            descripcion: {
                title: 'Novedad',
                width: '30%',
                visibility: 'fixed'                
            },
            usuario_id: {
                title: 'Usuario',
                width: '20%',
                visibility: 'fixed',
                edit: false,
                create: false,
                options: mainPage + '?action=options&table=usuario&filter_field=tipo&tipo=\'\''
            },
            orden: {
                title: 'Orden',
                width: '30%',
                listClass: 'column_number',
                visibility: 'fixed',
                edit: false,
                create: false
            },
            observaciones: {
                title: 'Observaciones',
                width: '40%',
                visibility: 'fixed',
                type: 'textarea'
            }
        }
    });
    //Re-load records when user click 'load records' button.
    $('#novedadSearchButton').click(function (e) {
        e.preventDefault();
        $('#novedad_table').jtable('load', {
            filter_text: $('#filter_text_novedad').val()
        });
    });

    //Load all records when page is first shown
    $('#novedadSearchButton').click();
}

function show_table_taller() {
    
    $('#taller_table').jtable({
        jqueryuiTheme: true,
        messages: spanishMessages,
        title: 'Talleres',
        paging: true,
        pageSize: 50,
        sorting: false,
        openChildAsAccordion: true,
        /*recordUpdated: function(event, data){
            //after record insertion, reload the records
            //$('#taller_table').jtable('load');
        },*/
        actions: {
            listAction: mainPage + '?action=list&table=taller',
            createAction: mainPage + '?action=create&table=taller',
            updateAction: mainPage + '?action=update&table=taller',
            deleteAction: mainPage + '?action=delete&table=taller'
        },
        fields: {
            /*detalle: {
                title: '',
                width: '5px',
                sorting: false,
                edit: false,
                create: false,
                columnResizable: false,
                visibility: 'fixed',
                display: function (recordData) {
                    var $img = $('<img src="images/detalle1.png" title="Detalle" style="cursor: pointer;"/>');
                    $img.click(function () {
                        $('#taller_table').jtable('openChildTable', $img.closest('tr'),
                        {
                            jqueryuiTheme: true,
                            messages: spanishMessages,
                            title: 'Ordenes taller \'' + recordData.record.nombre + '\'',
                            paging: true,
                            pageSize: 10,
                            sorting: false,
                            actions: {
                                listAction: mainPage + '?action=list&table=orden&filter_field=taller&taller=' + 
                                        recordData.record.id
                            },
                            fields: {
                                id: {
                                    list: true,
                                    title: 'No.',
                                    width: '12px',
                                    listClass: 'column_number',
                                    visibility: 'fixed'
                                },
                                cliente: {
                                    title: 'Cliente',
                                    width: '40%',
                                    options: mainPage + '?action=options&table=cliente',
                                    visibility: 'fixed'
                                },
                                vehiculo: {
                                    title: 'Vehiculo',
                                    width: '40%',
                                    dependsOn: 'cliente',
                                    visibility: 'fixed',
                                    options: function (data) {
                                        if (data.source === 'list') {
                                            return mainPage + '?action=options&table=vehiculo&filter_field=cliente&cliente=0';
                                        }
                                        else {
                                            return mainPage + '?action=options&table=vehiculo&filter_field=cliente&cliente=' + 
                                                    data.dependedValues.cliente;
                                        }
                                    }
                                },
                                estado: {
                                    title: 'Estado',
                                    width: '20%',
                                    options: mainPage + '?action=options&table=estado',
                                    listClass: 'column_text_center',
                                    visibility: 'fixed'
                                }
                            }
                        }, function (data) { //opened handler
                            data.childTable.jtable('load');
                        });
                    });
                    //Return image to show on the person row
                    return $img;
                }
            },*/
            id: {
                key: true,
                list: true,
                edit: false,
                create: false,
                title: 'No.',
                listClass: 'column_number',
                width: '12px',
                columnResizable: false,
                visibility: 'fixed'
            },
            nombre: {
                title: 'Nombre',
                width: '10%',
                visibility: 'fixed'
            },
            direccion: {
                title: 'Dirección',
                width: '25%',
                visibility: 'fixed'
            },
            localidad: {
                title: 'Localidad',
                width: '10%',
                visibility: 'fixed'
            },
            provincia: {
                title: 'Provincia',
                width: '10%',
                visibility: 'fixed'
            },
            cpa: {
                title:'CP',
                width: '5%',
                visibility: 'fixed'
            },
            telefono: {
                title: 'Teléfono',
                width: '10%',
                visibility: 'fixed'
            },
            cuit: {
                title:'CUIT',
                width: '5%',
                visibility: 'fixed'
            },
            descripcion: {
                title: 'Comentarios',
                width: '25%',
                type: 'textarea',
                visibility: 'fixed'
            },
            usuario: {
                title: '',
                width: '5px',
                sorting: false,
                edit: false,
                create: false,
                visibility: 'fixed',
                //columnResizable: false,
                display: function (recordData) {
                    var $img = $('<img src="images/user1.png" title="Usuarios" style="cursor: pointer; "/>');
                    $img.click(function () {
                        $('#taller_table').jtable('openChildTable', $img.closest('tr'),
                        {
                            jqueryuiTheme: true,
                            messages: spanishMessages,
                            title: 'Usuarios taller \'' + recordData.record.nombre + '\'',
                            paging: true,
                            pageSize: 10,
                            sorting: false,
                            actions: {
                                listAction: mainPage + '?action=list&table=usuario_taller&filter_field=taller&taller=' + recordData.record.id,
                                createAction: mainPage + '?action=create&table=usuario_taller',
                                deleteAction: mainPage + '?action=delete&table=usuario_taller'
                            },
                            fields: {
                                id: {
                                    key: true,
                                    list: false,
                                    create: false,
                                    edit: false,
                                    title: 'No.',
                                    width: '12px',
                                    listClass: 'column_number',
                                    visibility: 'fixed'
                                },
                                taller: {
                                    list: true,
                                    type: 'hidden',
                                    defaultValue: recordData.record.id,
                                    visibility: 'fixed'
                                },
                                usuario: {
                                    title: 'Usuario',
                                    width: '25%',
                                    visibility: 'fixed',
                                    options: function (data) {
                                        if (data.source === 'list') {
                                            return mainPage + '?action=options&table=usuario&filter_field=tipo&tipo=0'
                                        }
                                        else {
                                            return mainPage + '?action=options&table=usuario&filter_field=tipo&tipo=2'
                                        }
                                    }
                                },
                                descripcion: {
                                    title: 'Descripci&oacute;n',
                                    width: '40%',
                                    edit: false,
                                    create: false,
                                    visibility: 'fixed'
                                },
                                mail: {
                                    title: 'Correo',
                                    width: '35%',
                                    edit: false,
                                    create: false,
                                    visibility: 'fixed'
                                }
                            }
                        }, function (data) { //opened handler
                            data.childTable.jtable('load');
                        });
                    });
                    //Return image to show on the person row
                    return $img;
                }
            }
            /*fecha_alta: {
                title: 'Alta',
                create: false,
                edit: false
            },
            fecha_cambio: {
                title: 'Modificado',
                create: false,
                edit: false,
                list: true
            },
            fecha_baja: {
                title: 'Baja',
                create: false,
                edit: false
            },*/
        }
    });
    //Re-load records when user click 'load records' button.
    $('#tallerSearchButton').click(function (e) {
        e.preventDefault();
        $('#taller_table').jtable('load', {
            filter_text: $('#filter_text_taller').val()
        });
    });

    //Load all records when page is first shown
    $('#tallerSearchButton').click();
}

function show_table_cliente() {
    
    $('#cliente_table').jtable({
        jqueryuiTheme: true,
        messages: spanishMessages,
        title: 'Clientes',
        paging: true,
        pageSize: 50,
        sorting: false,
        //openChildAsAccordion: true,
        /*recordUpdated: function(event, data){
            //after record insertion, reload the records
            $('#cliente_table').jtable('load');
        },*/
        actions: {
            listAction: mainPage + '?action=list&table=cliente',
            createAction: mainPage + '?action=create&table=cliente',
            updateAction: mainPage + '?action=update&table=cliente',
            deleteAction: mainPage + '?action=delete&table=cliente'
        },
        fields: {
            id: {
                key: true,
                list: true,
                edit: false,
                create: false,
                title: 'No.',
                listClass: 'column_number',
                width: '12px',
                columnResizable: false,
                visibility: 'fixed'
            },
            nombre: {
                title: 'Nombre',
                width: '10%',
                visibility: 'fixed'
            },
            direccion: {
                title: 'Dirección',
                width: '25%',
                visibility: 'fixed'
            },
            localidad: {
                title: 'Localidad',
                width: '15%',
                visibility: 'fixed'
            },
            provincia: {
                title: 'Provincia',
                width: '10%',
                visibility: 'fixed'
            },
            telefono: {
                title: 'Teléfono',
                width: '10%',
                visibility: 'fixed'
            },
            cpa: {
                title:'CP',
                width: '5%',
                visibility: 'fixed'
            },
            cuit: {
                title:'CUIT',
                width: '5%',
                visibility: 'fixed'
            },
            descripcion: {
                title: 'Comentarios',
                width: '20%',
                type: 'textarea',
                visibility: 'fixed'
            },
            usuario: {
                title: '',
                width: '5px',
                sorting: false,
                edit: false,
                create: false,
                columnResizable: false,
                visibility: 'fixed',
                display: function (recordData) {
                    var $img = $('<img src="images/user1.png" title="Usuarios" style="cursor: pointer;"/>');
                    $img.click(function () {
                        $('#cliente_table').jtable('openChildTable', $img.closest('tr'),
                        {
                            jqueryuiTheme: true,
                            messages: spanishMessages,
                            title: 'Usuarios cliente \'' + recordData.record.nombre + '\'',
                            paging: true,
                            pageSize: 10,
                            sorting: false,
                            actions: {
                                listAction: mainPage + '?action=list&table=usuario_cliente&filter_field=cliente&cliente=' + recordData.record.id,
                                createAction: mainPage + '?action=create&table=usuario_cliente',
                                deleteAction: mainPage + '?action=delete&table=usuario_cliente'
                            },
                            fields: {
                                id: {
                                    key: true,
                                    list: false,
                                    create: false,
                                    edit: false,
                                    title: 'No.',
                                    width: '12px',
                                    listClass: 'column_number',
                                    visibility: 'fixed'
                                },
                                usuario: {
                                    title: 'Usuario',
                                    width: '25%',
                                    visibility: 'fixed',
                                    options: function (data) {
                                        if (data.source === 'list') {
                                            return mainPage + '?action=options&table=usuario&filter_field=tipo&tipo=\'\''
                                        }
                                        else {
                                            return mainPage + '?action=options&table=usuario&filter_field=tipo&tipo[0]=1&tipo[1]=4'
                                        }
                                    }
                                },
                                cliente: {
                                    list: true,
                                    type: 'hidden',
                                    visibility: 'fixed',
                                    defaultValue: recordData.record.id
                                },
                                descripcion: {
                                    title: 'Descripci&oacute;n',
                                    width: '50%',
                                    edit: false,
                                    create: false,
                                    visibility: 'fixed'
                                },
                                mail: {
                                    title: 'Correo',
                                    width: '35%',
                                    edit: false,
                                    create: false,
                                    visibility: 'fixed'
                                }
                            }
                        }, function (data) { //opened handler
                            data.childTable.jtable('load');
                        });
                    });
                    //Return image to show on the person row
                    return $img;
                }
            }
            /*fecha_alta: {
                title: 'Alta',
                create: false,
                edit: false
            },
            fecha_cambio: {
                title: 'Modificado',
                create: false,
                edit: false,
                list: true
            },
            fecha_baja: {
                title: 'Baja',
                create: false,
                edit: false
            },*/
        }
    });
    //Re-load records when user click 'load records' button.
    $('#clienteSearchButton').click(function (e) {
        e.preventDefault();
        $('#cliente_table').jtable('load', {
            filter_text: $('#filter_text_cliente').val()
        });
    });

    //Load all records when page is first shown
    $('#clienteSearchButton').click();
}

function show_table_vehiculo() {
    
    $('#vehiculo_table').jtable({
        jqueryuiTheme: true,
        messages: spanishMessages,
        title: 'Vehículos',
        paging: true,
        pageSize: 50,
        sorting: false,
        //openChildAsAccordion: true,
        /*recordUpdated: function(event, data){
            //after record insertion, reload the records
            $('#vehiculo_table').jtable('load');
        },*/
        actions: {
            listAction:   mainPage + '?action=list&table=vehiculo',
            createAction: mainPage + '?action=create&table=vehiculo',
            updateAction: mainPage + '?action=update&table=vehiculo',
            deleteAction: mainPage + '?action=delete&table=vehiculo'
        },
        fields: {
            id: {
                key: true,
                list: true,
                edit: false,
                create: false,
                title: 'No.',
                listClass: 'column_number',
                width: '12px',
                columnResizable: false,
                visibility: 'fixed'
            },
            cliente: {
                title: 'Cliente',
                width: '20%',
                options: mainPage + '?action=options&table=cliente',                
                visibility: 'fixed'
            },
            marca: {
                title: 'Marca',
                width: '10%',
                options: mainPage + '?action=options&table=marca',
                visibility: 'fixed'
            },
            modelo: {
                title: 'Modelo',
                width: '10%',
                dependsOn: 'marca',
                visibility: 'fixed',
                options: function (data) {
                    if (data.source === 'list') {
                        return mainPage + '?action=options&table=modelo&filter_field=marca&marca=0';
                    }
                    else {
                        return mainPage + '?action=options&table=modelo&filter_field=marca&marca=' + 
                                data.dependedValues.marca;
                    }
                }
            },
            dominio: {
                title: 'Dominio',
                width: '10%',
                visibility: 'fixed',
                listClass: 'column_text_center'
            },
            motor: {
                title: 'No. Motor',
                width: '20%',
                visibility: 'fixed',
                listClass: 'column_text_center'
            },
            chasis: {
                title:'No. Chasis',
                width: '20%',
                visibility: 'fixed',
                listClass: 'column_text_center'
            },
            anio: {
                title:'Año',
                width: '10%',
                visibility: 'fixed',
                listClass: 'column_number'
            },
            fecha_alta: {
                title: 'Alta',
                create: false,
                edit: false,
                list: false
            },
            fecha_cambio: {
                title: 'Modificado',
                create: false,
                edit: false,
                list: false
            },
            fecha_baja: {
                title: 'Baja',
                create: false,
                edit: false,
                list: false
            }
        }
    });
    //Re-load records when user click 'load records' button.
    $('#vehiculoSearchButton').click(function (e) {
        e.preventDefault();
        $('#vehiculo_table').jtable('load', {
            filter_text: $('#filter_text_vehiculo').val()
        });
    });

    //Load all records when page is first shown
    $('#vehiculoSearchButton').click();
}

function show_table_marca() {
    
    $('#marca_table').jtable({
        jqueryuiTheme: true,
        messages: spanishMessages,
        title: 'Marcas',
        paging: true,
        pageSize: 50,
        sorting: false,
        actions: {
            listAction:   mainPage + '?action=list&table=marca',
            createAction: mainPage + '?action=create&table=marca',
            updateAction: mainPage + '?action=update&table=marca',
            deleteAction: mainPage + '?action=delete&table=marca'
        },
        fields: {
            id: {
                key: true,
                list: true,
                edit: false,
                create: false,
                title: 'No.',
                listClass: 'column_number',
                width: '12px',
                columnResizable: false,
                visibility: 'fixed'
            },
            marca: {
                title: 'Marca',
                width: '100%',
                visibility: 'fixed'
            }
        }
    });
    //Re-load records when user click 'load records' button.
    $('#marcaSearchButton').click(function (e) {
        e.preventDefault();
        $('#marca_table').jtable('load', {
            filter_text: $('#filter_text_marca').val()
        });
    });

    //Load all records when page is first shown
    $('#marcaSearchButton').click();
}

function show_table_modelo() {
    
    $('#modelo_table').jtable({
        jqueryuiTheme: true,
        messages: spanishMessages,
        title: 'Modelos',
        paging: true,
        pageSize: 50,
        sorting: false,
        actions: {
            listAction:   mainPage + '?action=list&table=modelo',
            createAction: mainPage + '?action=create&table=modelo',
            updateAction: mainPage + '?action=update&table=modelo',
            deleteAction: mainPage + '?action=delete&table=modelo'
        },
        fields: {
            id: {
                key: true,
                list: true,
                edit: false,
                create: false,
                title: 'No.',
                listClass: 'column_number',
                width: '10',
                columnResizable: false,
                visibility: 'fixed'
            },
            marca: {
                title: 'Marca',
                width: '45%',
                options: mainPage + '?action=options&table=marca',
                visibility: 'fixed'
            },
            modelo: {
                title: 'Modelo',
                width: '55%',
                visibility: 'fixed'
            }
        }
    });
    //Re-load records when user click 'load records' button.
    $('#modeloSearchButton').click(function (e) {
        e.preventDefault();
        $('#modelo_table').jtable('load', {
            filter_text: $('#filter_text_modelo').val()
        });
    });

    //Load all records when page is first shown
    $('#modeloSearchButton').click();
}

function show_table_estado() {
    
    $('#estado_table').jtable({
        jqueryuiTheme: true,
        messages: spanishMessages,
        title: 'Estados',
        paging: true,
        pageSize: 50,
        sorting: false,
        openChildAsAccordion: true,
        actions: {
            listAction:   mainPage + '?action=list&table=estado'
            /*createAction: mainPage + '?action=create&table=estado',
            updateAction: mainPage + '?action=update&table=estado',
            deleteAction: mainPage + '?action=delete&table=estado'*/
        },
        fields: {
            id: {
                key: true,
                list: true,
                edit: false,
                create: false,
                title: 'No.',
                listClass: 'column_number',
                width: '20',
                columnResizable: false,
                visibility: 'fixed'
            },
            descripcion: {
                title: 'Estado',
                width: '100%',
                visibility: 'fixed'
            }
        }
    });
    //Re-load records when user click 'load records' button.
    $('#estadoSearchButton').click(function (e) {
        e.preventDefault();
        $('#estado_table').jtable('load', {
            filter_text: $('#filter_text_estado').val()
        });
    });

    //Load all records when page is first shown
    $('#estadoSearchButton').click();
}

function show_table_usuario() {
    
    var local_table = 'usuario';
    
    $('#usuario_table').jtable({
        jqueryuiTheme: true,
        messages: spanishMessages,
        title: 'Usuarios',
        paging: true,
        pageSize: 50,
        sorting: false,
        actions: {
            listAction:   mainPage + '?action=list&table=' + local_table,
            createAction: mainPage + '?action=create&table=' + local_table,
            updateAction: mainPage + '?action=update&table=' + local_table,
            deleteAction: mainPage + '?action=delete&table=' + local_table
        },
        fields: {
            id: {
                key: true,
                list: true,
                edit: false,
                create: false,
                title: 'No.',
                listClass: 'column_number',
                width: '20',
                columnResizable: false,
                visibility: 'fixed'
            },
            usuario: {
                title: 'Usuario',
                width: '20%',
                visibility: 'fixed'
            },
            descripcion: {
                title: 'Descripci&oacute;n',
                width: '30%',
                visibility: 'fixed'
            },
            clave: {
                list: false,
                title: 'Constrase&ntilde;a',
                input: function (data) {
                    return '<input type="text" name="clave" style="width: 140px" value="" />';
                }
            },
            mail: {
                title: 'Correo',
                width: '30%',
                visibility: 'fixed'
            },
            tipo: {
                title: 'Tipo',
                options: { 1: 'Cliente', 2: 'Taller', 3: 'Administrador', 4: 'Cliente (Carga Novedades)' },
                width: '20%',
                visibility: 'fixed'
            }
        }
    });
    //Re-load records when user click 'load records' button.
    $('#usuarioSearchButton').click(function (e) {
        e.preventDefault();
        $('#usuario_table').jtable('load', {
            filter_text: $('#filter_text_usuario').val()
        });
    });

    //Load all records when page is first shown
    $('#usuarioSearchButton').click();
}

function show_table_zona() {
    
    $('#zona_table').jtable({
        jqueryuiTheme: true,
        messages: spanishMessages,
        title: 'Zonas',
        paging: true,
        pageSize: 50,
        sorting: false,
        openChildAsAccordion: true,
        actions: {
            listAction:   mainPage + '?action=list&table=zona',
            createAction: mainPage + '?action=create&table=zona',
            updateAction: mainPage + '?action=update&table=zona',
            deleteAction: mainPage + '?action=delete&table=zona'
        },
        fields: {
            id: {
                key: true,
                list: true,
                edit: false,
                create: false,
                title: 'No.',
                listClass: 'column_number',
                width: '12px',
                columnResizable: false
            },
            nombre: {
                title: 'Nombre',
                width: '70%',
                visibility: 'fixed'
            },
            desc_1: {
                title: 'Desc Original',
                width: '20%',
                visibility: 'fixed',
                listClass: 'column_number'
            },
            desc_2: {
                title: 'Des Alternativo',
                width: '20%',
                visibility: 'fixed',
                listClass: 'column_number'
            },
            desc_3: {
                title: 'Otro',
                width: '20%',
                visibility: 'fixed',
                listClass: 'column_number'
            },
            zt: {
                title: '',
                width: '5em',
                sorting: false,
                edit: false,
                create: false,
                columnResizable: false,
                display: function (recordData) {
                    var $img = $('<img src="images/costo.png" title="Costos" style="cursor: pointer;" />');
                    $img.click(function () {
                        $('#zona_table').jtable('openChildTable', $img.closest('tr'),
                        {
                            jqueryuiTheme: true,
                            messages: spanishMessages,
                            title: 'Costos zona \'' + recordData.record.nombre + '\'',
                            paging: true,
                            pageSize: 10,
                            sorting: false,
                            actions: {
                                listAction: mainPage + '?action=list&table=zona_trabajo&filter_field=zona&zona=' + 
                                        recordData.record.id,
                                createAction: mainPage + '?action=create&table=zona_trabajo',
                                updateAction: mainPage + '?action=update&table=zona_trabajo'
                                //deleteAction: mainPage + '?action=delete&table=zona_trabajo'
                            },
                            fields: {
                                id: {
                                    key: true,
                                    list: false,
                                    type: 'hidden'
                                },
                                zona: {
                                    list: true,
                                    type: 'hidden',
                                    defaultValue: recordData.record.id,
                                    visibility: 'fixed'
                                },
                                trabajo:{
                                    title: 'Tarea',
                                    width: '70%',
                                    options: mainPage + '?action=options&table=trabajo',
                                    visibility: 'fixed'
                                },
                                costo1: {
                                    title: 'Costo',
                                    width: '15%',
                                    visibility: 'fixed',
                                    listClass: 'column_number'
                                },
                                costo2: {
                                    title: 'Costo taller',
                                    width: '15%',
                                    visibility: 'fixed',
                                    listClass: 'column_number'
                                }
                            }
                        }, function (data) { //opened handler
                            data.childTable.jtable('load');
                        });
                    });
                    //Return image to show on the person row
                    return $img;
                }
            },
            zct: {
                title: '',
                width: '5px',
                sorting: false,
                edit: false,
                create: false,
                columnResizable: false,
                visibility: 'fixed',
                display: function (recordData) {
                    var $img = $('<img src="images/zonif.png" title="Zonificaci&oacute;n" style="cursor: pointer;" />');
                    $img.click(function () {
                        $('#zona_table').jtable('openChildTable', $img.closest('tr'),
                        {
                            jqueryuiTheme: true,
                            messages: spanishMessages,
                            title: 'Zonificaci&oacute;n zona \'' + recordData.record.nombre + '\'',
                            paging: true,
                            pageSize: 10,
                            sorting: false,
                            actions: {
                                listAction: mainPage + '?action=list&table=zona_cliente_taller&filter_field=zona&zona=' + 
                                        recordData.record.id,
                                createAction: mainPage + '?action=create&table=zona_cliente_taller',
                                updateAction: mainPage + '?action=update&table=zona_cliente_taller',
                                deleteAction: mainPage + '?action=delete&table=zona_cliente_taller'
                            },
                            fields: {
                                id: {
                                    key: true,
                                    list: false,
                                    type: 'hidden'
                                },
                                zona: {
                                    list: true,
                                    type: 'hidden',
                                    defaultValue: recordData.record.id,
                                    visibility: 'fixed'
                                },
                                cliente: {
                                    title: 'Cliente',
                                    width: '50%',
                                    options: mainPage + '?action=options&table=cliente',
                                    visibility: 'fixed'
                                },
                                taller: {
                                    title: 'Taller',
                                    width: '50%',
                                    options: mainPage + '?action=options&table=taller',
                                    visibility: 'fixed'
                                }
                            }
                        }, function (data) { //opened handler
                            data.childTable.jtable('load');
                        });
                    });
                    //Return image to show on the person row
                    return $img;
                }
            }
        }
    });
    //Re-load records when user click 'load records' button.
    $('#zonaSearchButton').click(function (e) {
        e.preventDefault();
        $('#zona_table').jtable('load', {
            filter_text: $('#filter_text_zona').val()
        });
    });

    //Load all records when page is first shown
    $('#zonaSearchButton').click();
}

function show_tables() {
    
    var user_type = parseInt(session_data.login_user_type);
    
    init_confirm_dialog();
    init_presupuesto_dialog();
    init_change_passwd_dialog();
    init_presupuesto_preview_dialog();
    init_observaciones_dialog();
    init_observaciones_gen();
    init_novedades_dialog();
    init_otr_dialog();
    
    show_table_orden();
    show_table_novedad();

    if (user_type === 3) {
        
        show_table_cliente();
        show_table_taller();
        show_table_vehiculo();
        show_table_zona();
        show_table_marca();
        show_table_modelo();
        show_table_estado();
        show_table_usuario();
    }
}

function init_change_passwd_dialog() {
    
    $( "#dialog-change-passwd-form" ).dialog({
      autoOpen: false,
      height: 'auto',
      width: 350,
      modal: true,
      buttons: {
        "Cambiar": function () {
            $('#form-change-passwd').submit();
        },
        Cancel: function() {
          $(this).dialog( "close" );
        }
      }
    }); 
    
    $('#form-change-passwd').submit(
        function(event) {
            if ($('#passwd').val() !== "" && $('#npasswd').val() !== "" && $('#rnpasswd').val() !== "" && $('#npasswd').val() === $('#rnpasswd').val()) {
                $.ajax({
                    type: "POST",
                    url: "change_password.php", 
                    data: $(this).serialize(),
                    async: false, 
                    success: 
                        function(result) {
                            var res = JSON.parse(result);
                            if (res.Result.toString() === "OK") {
                                alert("La clave fue cambiada con éxito!!!");
                                $("#dialog-change-passwd-form").dialog("close");
                            }
                            else {
                                alert("Error al cambiar clave. " + res.Message.toString());
                            }
                        },
                    error:
                        function(result) {
                            alert("Error al cambiar clave. " + result.statusText);
                        }
                });    
            }
            else {
                alert("Ingrese claves correctamente!");
            }                
            event.preventDefault();
        }
    );
}

function init_presupuesto_dialog() {
    
    $( "#dialog-bonificacion" ).dialog({
      autoOpen: false,
      height: 'auto',
      width: 350,
      modal: true,
      buttons: {
        Aceptar: function () {            
            $(this).dialog( "close" );
            preview_presupuesto($.data(this, 'orden'), $.data(this, 'costo'), $('#bonif').val());            
        },
        Cancel: function() {
          $(this).dialog( "close" );
        }
      }
    });     
}

function init_observaciones_dialog() {
    
    // Dialogo para cargar observaciones en la generacion del presupuesto.-
    $( "#observaciones-presupuesto-div" ).dialog({
        autoOpen: false,
        height: 300,
        width: 350,
        modal: true,
        title: 'Observaciones',
        buttons: {
            Aceptar: function () {            
                var rec_ex = {
                    action: 'presupuesto_save',
                    pobservaciones: $('#observaciones-presupuesto').val(),
                    id: $.data(this, 'orden_id'),
                    costo: (parseInt(session_data.login_user_type) === 2)?2:1,
                    bonificacion: 0
                };
                
                $('#orden_table').jtable('updateRecord', {
                    url: 'presupuesto.php',
                    record: rec_ex,
                    success: 
                        function(res) {
                            //var res = JSON.parse(result);
                            if (res.Result !== "ERROR") {
                                $('#observaciones-presupuesto-div').dialog( "close" );
                                $('#preview-presupuesto-div').dialog("close");
                                alert("Presupuesto #" + res.Record.presupuesto + " generado para aprobacion!!!");
                                
                            }
                            else {
                                alert("Error guardando presupuesto. " + res.Message.toString());
                            }
                        },
                    error:
                        function(result) {
                            alert("Error guardando presupuesto. " + result.statusText);
                        }
                });
                
                
            },
            Cancelar: function() {
              $(this).dialog( "close" );
            }
        },
        open: function(event, ui) {
            $(this).dialog('option', 'title', 'Orden #' + $.data(this, 'orden_id') + ' - Presupuesto observaciones');
        },
        close: function (event, ui) {
            $(this).dialog('option', 'title', 'Observaciones');
            $('#observaciones-presupuesto').val('');
        }        
    });     
}

function init_observaciones_gen() {

    $( "#observaciones-gen-div" ).dialog({
        autoOpen: false,
        height: 300,
        width: 350,
        modal: true,
        title: 'Observaciones',
        buttons: {
            Aceptar: function () {
                $('#orden_table').jtable('updateRecord', {
                url: 'sistram.php',
                record: {
                    action: $.data(this, 'next_action_status'),
                    id: $.data(this, 'orden_data').id,
                    observaciones: $("#observaciones-gen").val()
                },
                success: 
                    function(result) {
                        if (result.Result !== "ERROR") {
                            $( "#observaciones-gen-div" ).dialog( "close" );
                            
                            var cur_table_row = $("#orden_table").jtable('getRowByKey', result.Record.id);
                            if (cur_table_row !== null && $("#orden_table").jtable('isChildRowOpen', cur_table_row)) {
                                $("#orden_table").jtable('closeChildRow', cur_table_row);
                                //cur_table_row.find('.jtable-child-table-container').jtable('reload');
                            }
                            
                            alert("Orden #" + result.Record.id + " modificada!!!");
                        }
                        else {
                            alert("Problemas al intentar modificar orden #" + result.Record.id + ". " + result.Message);                                                                
                        }
                    }
                });
            },
            Cancelar: function() {
              $(this).dialog( "close" );
            }
        },
        open: function(event, ui) {
            $(this).dialog('option', 'title', 'Observaciones - Orden #' + $.data(this, 'orden_data').id);
        },
        close: function (event, ui) {
            $(this).dialog('option', 'title', 'Observaciones');
            $('#observaciones-gen').val('');
        }
    });     
}

function init_presupuesto_preview_dialog() {
    $('#preview-presupuesto-div').dialog({
        autoOpen: false,
        resizable: true,
        height: 600,
        width: 800,
        modal: true,
        title: 'Presupuesto - Vista previa'
    });        
}

function init_confirm_dialog() {
    $('#dialog-confirm').dialog({
        autoOpen: false,
        resizable: false,
        height: 200,
        modal: true,
        buttons: {
          Si: function() {
            $( this ).dialog( 'close' );
            window.open("logout.php", "_self");
          },
          No: function() {
            $( this ).dialog( 'close' );
          }
        }
    });    
}

function init_otr_dialog() {
	$("#ot-remito-div").dialog({
		autoOpen: false,
		resizable: false,
		height: 'auto',
		width: 'auto',
		modal: true,
		title: 'Imprimir',
		buttons: {
			Aceptar: function () {
				$(this).dialog('close');
				preview_ot($.data(this, 'orden_id'), $('input[name=tipo_print]:checked').val(), $.data(this, 'orden_pid'));
			},
			Cancelar: function() {
				$(this).dialog('close');
			}
		},
        open: function(event, ui) {
            orden_status = parseInt($.data(this, 'orden_status'));
            //alert('Presupuesto #' + $.data(this, 'orden_pid'));
            if (orden_status === 104 || orden_status === 105) {
            	$('#label_tipo_print_r').show();
            }
            else {
            	$('input#ot').prop('checked', true);
            	$('#label_tipo_print_r').hide();
            }
        }
	});
}

function init_novedades_dialog() {
    
    var orden = -1;
    
    $('#novedades-orden-div').dialog({
        autoOpen: false,
        resizable: true,
        height: 400,
        width: 600,
        modal: true,
        buttons: {
            Aceptar: function () {
                var $novedadesList = $('#alta_orden_novedades_table').jtable('selectedRows');
                var novList = [];
                $novedadesList.each(function() {
                    novList.push($(this).data('record').id);
                });
                
                $.ajax({
                    type: "POST",
                    url: "sistram.php", 
                    data: {action: 'agregar_novedades', orden: orden.id, novedad: novList},
                    async: false, 
                    success: 
                        function(result) {
                            $('#novedades-orden-div').dialog('close');
                            currentChildTable.jtable('load');
                        },
                    error:
                        function(result) {
                            alert("Error al cargar las novedades. " + result.statusText);
                        }
                });
            },
            Cancelar: function() {
              $(this).dialog( "close" );
            }
        },
        open: function(event, ui) {
            orden = $(this).dialog('option', 'orden_id');
            $(this).dialog('option', 'title', 'Orden #' + orden.id + ' - Agregar novedades...');
            $('#alta_orden_novedades_table').jtable('load', {vehiculo: orden.vehiculo});
        }
    });       
    
    var user_type = parseInt(session_data.login_user_type);
    
    $('#alta_orden_novedades_table').jtable({
        jqueryuiTheme: true,
        messages: spanishMessages,
        paging: true,
        pageSize: 50,
        sorting: false,
        selectingCheckboxes: true,
        multiselect: true,
        selecting: true,
        actions: {
            //listAction: mainPage + '?action=list&table=novedad&filter_field=vehiculo&vehiculo=' + 
            //        $('#alta_orden_novedades_table').attr('data-vehiculo')
            listAction: function (postData, jtParams) {
                return $.Deferred(function ($dfd) {
                    $.ajax({
                        url: mainPage, // + '?action=list&table=novedad&filter_field=vehiculo&vehiculo=' +,
                        type: 'GET',
                        dataType: 'json',
                        data: {action: 'list', table: 'novedad', filter_field: 'vehiculo', vehiculo: postData.vehiculo},
                        success: function (data) {
                            $dfd.resolve(data);
                        },
                        error: function () {
                            $dfd.reject();
                        }
                    });
                });
            }
        },
        fields: {
            id: {
                key: true,
                list: true,
                edit: false,
                create: false,
                title: 'No.',
                listClass: 'column_number',
                width: '12px',
                columnResizable: false,
                visibility: 'fixed',
                type: 'hidden'
            },
            fecha: {
                title: 'Fecha',
                width: '10%',
                visibility: 'fixed',
                listClass: 'column_text_center',
                edit: false,
                create: false,
                type: 'date'
            },
            cliente_id: {
                title: 'Cliente',
                width: '20%',
                options: mainPage + '?action=options&table=cliente',
                visibility: 'fixed'
            },
            vehiculo: {
                title: 'Veh&iacute;culo',
                width: '10%',
                visibility: 'fixed',
                dependsOn: 'cliente_id',
                options: function (data) {
                    if (data.source === 'list') {
                        return mainPage + '?action=options&table=vehiculo&filter_field=cliente&cliente=0';
                    }
                    else {
                        return mainPage + '?action=options&table=vehiculo&filter_field=cliente&cliente=' + 
                                data.dependedValues.cliente_id;
                    }
                },
                listClass: 'column_text_center'
            },
            odometro: {
                title: 'Od&oacute;metro',
                width: '20%',
                listClass: 'column_number',
                visibility: 'fixed'
            },
            descripcion: {
                title: 'Novedad',
                width: '30%',
                visibility: 'fixed'                
            },
            observaciones: {
                title: 'Observaciones',
                width: '40%',
                visibility: 'fixed',
                type: 'textarea'
            }
        }
    });
    
    //Re-load records when user click 'load records' button.
    /*$('#novedadSearchButton').click(function (e) {
        e.preventDefault();
        $('#novedad_table').jtable('load', {
            filter_text: $('#filter_text_novedad').val()
        });
    });*/

    //Load all records when page is first shown
    //$('#novedadSearchButton').click();
}

function check_search_text(obj, mod) {
    if (obj.tagName === 'INPUT') {
        if (mod === 1) {
            if (obj.value === 'Buscar') {
                obj.value = '';
            }
        }
        else {
            if (obj.value === '') {
                obj.value = 'Buscar';
            }
        }
    }
}

function check_number_range(obj, min, max) {
    if (obj.value < min) {
        obj.value = min;
    }
    else if (obj.value > max) {
        obj.value = max;
    }
    
    return;
}

/*
  jQuery deparam is an extraction of the deparam method from Ben Alman's jQuery BBQ
  http://benalman.com/projects/jquery-bbq-plugin/
*/
(function ($) {
  $.deparam = function (params, coerce) {
    var obj = {},
        coerce_types = { 'true': !0, 'false': !1, 'null': null };
      
    // Iterate over all name=value pairs.
    $.each(params.replace(/\+/g, ' ').split('&'), function (j,v) {
      var param = v.split('='),
          key = decodeURIComponent(param[0]),
          val,
          cur = obj,
          i = 0,
            
          // If key is more complex than 'foo', like 'a[]' or 'a[b][c]', split it
          // into its component parts.
          keys = key.split(']['),
          keys_last = keys.length - 1;
        
      // If the first keys part contains [ and the last ends with ], then []
      // are correctly balanced.
      if (/\[/.test(keys[0]) && /\]$/.test(keys[keys_last])) {
        // Remove the trailing ] from the last keys part.
        keys[keys_last] = keys[keys_last].replace(/\]$/, '');
          
        // Split first keys part into two parts on the [ and add them back onto
        // the beginning of the keys array.
        keys = keys.shift().split('[').concat(keys);
          
        keys_last = keys.length - 1;
      } else {
        // Basic 'foo' style key.
        keys_last = 0;
      }
        
      // Are we dealing with a name=value pair, or just a name?
      if (param.length === 2) {
        val = decodeURIComponent(param[1]);
          
        // Coerce values.
        if (coerce) {
          val = val && !isNaN(val)              ? +val              // number
              : val === 'undefined'             ? undefined         // undefined
              : coerce_types[val] !== undefined ? coerce_types[val] // true, false, null
              : val;                                                // string
        }
          
        if ( keys_last ) {
          // Complex key, build deep object structure based on a few rules:
          // * The 'cur' pointer starts at the object top-level.
          // * [] = array push (n is set to array length), [n] = array if n is 
          //   numeric, otherwise object.
          // * If at the last keys part, set the value.
          // * For each keys part, if the current level is undefined create an
          //   object or array based on the type of the next keys part.
          // * Move the 'cur' pointer to the next level.
          // * Rinse & repeat.
          for (; i <= keys_last; i++) {
            key = keys[i] === '' ? cur.length : keys[i];
            cur = cur[key] = i < keys_last
              ? cur[key] || (keys[i+1] && isNaN(keys[i+1]) ? {} : [])
              : val;
          }
            
        } else {
          // Simple key, even simpler rules, since only scalars and shallow
          // arrays are allowed.
            
          if ($.isArray(obj[key])) {
            // val is already an array, so push on the next value.
            obj[key].push( val );
              
          } else if (obj[key] !== undefined) {
            // val isn't an array, but since a second value has been specified,
            // convert val into an array.
            obj[key] = [obj[key], val];
              
          } else {
            // val is a scalar.
            obj[key] = val;
          }
        }
          
      } else if (key) {
        // No value was defined, so set something meaningful.
        obj[key] = coerce
          ? undefined
          : '';
      }
    });
      
    return obj;
  };
})(jQuery);

function preview_presupuesto(orden, costo, bonificacion) {
    
    $.ajax({
        type: "POST",
        url: "presupuesto_plantilla.php", 
        //data: $('#presupuesto-form').serialize(),
        data: "id=" + orden + "&costo=" + costo + '&bonificacion=' + bonificacion,
        async: false, 
        success: 
            function(result) {

                var buttons = {
                    Generar: function() {   
                        //$('#observaciones-presupuesto-div').data('orden_id', $('#presupuesto_orden_id').val());
                        $('#observaciones-presupuesto-div').data('orden_id', orden);
                        $('#observaciones-presupuesto-div').dialog('open');
                    },
                    Cerrar: function() {
                        $( this ).dialog( 'close' );
                    }
                };

                $('#preview-presupuesto-div').dialog('option', 'buttons', buttons);
                //$('#preview-presupuesto-div').dialog('option', 'title', 'Orden #' + $('#presupuesto_orden_id').val() + ' - Vista previa presupuesto');
                $('#preview-presupuesto-div').dialog('option', 'title', 'Orden #' + orden + ' - Vista previa presupuesto');
                $('#preview-presupuesto-div').html(result);
                //$('#preview-presupuesto-div').data('orden_id', $('#presupuesto_orden_id').val());
                $('#preview-presupuesto-div').data('orden_id', orden);
                $('#preview-presupuesto-div').dialog('open');
            },
        error:
            function(result) {
                alert("Error obtener vista previa de presupuesto. " + result.statusText);
            }
    });                        

}

function preview_ot(orden, ot_tipo, presupuesto) {
    
	// ot_tipo: 1-OT, 2-R
    $.ajax({
        type: "POST",
        url: "presupuesto_plantilla.php", 
        data: {id: orden, ot: ot_tipo, presupuesto: presupuesto},
        async: false, 
        success: 
            function(result) {

                var buttons = {
                    Imprimir: function() {   
                        $("<form method='post' action='presupuesto_plantilla.php' target='_blank'>" +
                            "<input type='hidden' name='id' value='" + orden + "' />" +
                            "<input type='hidden' name='ot' value='" +  ot_tipo + "' />" +
                            "<input type='hidden' name='presupuesto' value='" +  presupuesto + "' />" +
                            "<input type='hidden' name='tipo' value='full' /></form>").appendTo('body').submit();
                    },
                    Cerrar: function() {
                        $( this ).dialog( 'close' );
                    }
                };

                $('#preview-presupuesto-div').dialog('option', 'buttons', buttons);
                $('#preview-presupuesto-div').dialog('option', 'title', 'Orden #' + orden + ' - Imprimir');
                $('#preview-presupuesto-div').html(result);
                $('#preview-presupuesto-div').data('orden_id', orden);
                $('#preview-presupuesto-div').dialog('open');
            },
        error:
            function(result) {
                alert("Error en generacion de orden de trabajo. " + result.statusText);
            }
    });                        

}

// Main ========================================================================

var spanishMessages = {
    serverCommunicationError: 'Ocurrió un error en la comunicación con el servidor.', 
    loadingMessage: 'Cargando...', 
    noDataAvailable: 'No hay datos disponibles!', 
    addNewRecord: 'Agregar', 
    editRecord: 'Modificar', 
    areYouSure: 'Confirmar', 
    deleteConfirmation: 'El registro será eliminado. ¿Está seguro?', 
    save: 'Guardar', 
    saving: 'Guardando', 
    cancel: 'Cancelar', 
    deleteText: 'Eliminar', 
    deleting: 'Eliminando', 
    error: 'Error', 
    close: 'Cerrar', 
    cannotLoadOptionsFor: 'No se pueden cargar las opciones para el campo {0}', 
    pagingInfo: 'Mostrando registros {0} a {1} de {2}', 
    canNotDeletedRecords: 'No se puede borrar registro(s) {0} de {1}!', 
    deleteProggress: 'Eliminando {0} de {1} registros, procesando...', 
    pageSizeChangeLabel: 'Cantidad de registros', //New. Must be localized. 
    gotoPageLabel: 'Ir a página' //New. Must be localized.
};

var session_data = null;

var mainPage = "sistram.php";

var curChildTable = null;

var current_orden_id = -1;

$(document).ready(function() {
    
    $('#tabs').tabs();

    $.ajax({
       url: 'session.php?',
       async: false,
       success: function (result) {
           var res = JSON.parse(result);
            if (res.Result.toString() !== "ERROR") {
                session_data = res.Result;
            }
       }
    });
    
    $(document).scroll(function (e) {

        if ($(".ui-widget-overlay")) //the dialog has popped up in modal view
        {
            //fix the overlay so it scrolls down with the page
            $(".ui-widget-overlay").css({
                position: 'fixed',
                top: '0'
            });

            //get the current popup position of the dialog box
            pos = $(".ui-dialog").position();

            //adjust the dialog box so that it scrolls as you scroll the page
            $(".ui-dialog").css({
                position: 'fixed',
                top: pos.y
            });
        }
    });

    show_tables();
});

