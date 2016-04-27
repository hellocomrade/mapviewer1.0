//dependency on jquery
var loc=window.GLIN.GIS._getScriptLocation();
document.write("<link href='"+loc+"GLINGIS/ribbon/ribbon.css' type='text/css' rel='stylesheet' />");
document.write("<link href='"+loc+"GLINGIS/ribbon/iphone-style-checkboxes.css' type='text/css' rel='stylesheet' />");
document.write("<link href='"+loc+"GLINGIS/jquery.ui.combobox.css' type='text/css' rel='stylesheet' />");
document.write("<link href='"+loc+"GLINGIS/ui.css' type='text/css' rel='stylesheet' />");
document.write("<link href='"+loc+"GLINGIS/icheck/skins/all.css' type='text/css' rel='stylesheet' />");
document.write("<link href='"+loc+"GLINGIS/ribbon/soft_button.css' type='text/css' rel='stylesheet' />");
document.write("<link href='"+loc+"GLINGIS/tablesorter/themes/blue/style.css' type='text/css' rel='stylesheet' />");
document.write("<link href='"+loc+"GLINGIS/jquery.pajinate.css' type='text/css' rel='stylesheet' />");
//document.write("<link href='"+loc+"GLINGIS/datatable194/soft_button.css' type='text/css' rel='stylesheet' />");
GLIN.GIS.UI=(function(ctrlWidth){
    var uiEvent=new GLIN.GIS.Events();
    var toolbar=null;
    var layout=null;
    var innerlayout=null;
    var currentToolId=null;
    var infoDialog=null;
    var promptDialog=null;
    var curMeasure=null;
    var curMeasureSys={"type":null,"unit":'auto',"isMetric":false};
    var westAccordion=null;
    var isUserTriggered=true;
    var currentLyrControlView='list';
    var isLoading=false;
    var DataPaneSize='30%';
    var isSouthResized=false;
    var southHeight=0;
    var updateInfoDialogContent=function(text){
	$('#infocontent').text(text);
    };

    
    var showMeasureDialog=function(title){
	if(infoDialog==null){
	    infoDialog=$(".infovermap").dialog({
						dialogClass:"dialog-no-close",
						resizable:false,
						autoOpen: false,
						width:350,
						height:220,
						show:{
						    effect: "blind",
						    duration: 1000
						},
						 hide: {
						    effect: "explode",
						    duration: 1000
						},
						position: { my: "top", at: "top", of: $("#map") },
						close:function(){curMeasure=null;}
	    });
	    
	}
	infoDialog.dialog("option","title",title);
	var convertmeasure=function(){
	    if(curMeasure!=null&&curMeasure.val>0){
		var from=curMeasure.unit;
		var to=null;
		if(curMeasureSys.isMetric){//metric
		    if(curMeasure.unit=='mi')to=curMeasureSys.unit=='auto'?'km':curMeasureSys.unit
		    else to=curMeasureSys.unit=='auto'?'m':curMeasureSys.unit;
		}
		else{
		    if(curMeasure.unit=='km'){
			to=curMeasureSys.unit=='auto'?'mi':curMeasureSys.unit;
		    }else{
			if(curMeasure.val<0.3048)to=curMeasureSys.unit=='auto'?'in':curMeasureSys.unit;
			else to=curMeasureSys.unit=='auto'?'ft':curMeasureSys.unit;
		    }
		}
		curMeasure.val=GLIN.GIS.Viewer.ConvertFromTo(curMeasure.val,from,to,curMeasure.order);
		curMeasure.unit=to;
		var ord=curMeasure.order>1?"sq":"";
		updateInfoDialogContent(curMeasure.val.toFixed(3)+' '+ord+curMeasure.unit);
	    }	
	}
	var selectunit=function(event,ui){
	    if(ui.item!=null){
	        curMeasureSys.unit=ui.item.value;
	        convertmeasure();
	    }
	};
	var switchunitbox=function(){
	$('.custom-combobox').hide();
	if(curMeasureSys.type=='dist'){
	    if($('#chk_metric').is(':checked')==true||$('#chk_metric').attr('checked')=='checked'){
		if(null==this.comboDistM)
		    this.comboDistM=$('#combo_dist_met').combobox({'select':selectunit});
		this.comboDistM.combobox("open");
		return this.comboDistM.combobox("getcurrentval");
	    }
	    else{
		if(null==this.comboDistE)
		    this.comboDistE=$('#combo_dist_en').combobox({'select':selectunit});
		this.comboDistE.combobox("open");
		return this.comboDistE.combobox("getcurrentval");
	    }
	}
	else if(curMeasureSys.type=='area'){
	     if($('#chk_metric').is(':checked')||$('#chk_metric').attr('checked')=='checked'){
	         if(null==this.comboAreaM)
		     this.comboAreaM=$('#combo_area_met').combobox({'select':selectunit});
		 this.comboAreaM.combobox("open");
		 return this.comboAreaM.combobox("getcurrentval");
	     }
	     else{
		 if(null==this.comboAreaE)
		     this.comboAreaE=$('#combo_area_en').combobox({'select':selectunit});
		 this.comboAreaE.combobox("open");
		 return this.comboAreaE.combobox("getcurrentval");
	     }
	}
	};
	curMeasureSys.unit=switchunitbox();
	$('#chk_metric').iphoneStyle({
	    onChange:function(elem,value){
		curMeasureSys.unit=switchunitbox();
		curMeasureSys.isMetric=value;
		convertmeasure();
		GLIN.GIS.Viewer.SetMeasureToolUnitSys(value);
	    }
	});

	infoDialog.dialog("open");
	
    };
    var hideInfoDialog=function(){
	if(infoDialog)infoDialog.dialog("close");
    };
    var updateLayerLegendUI=function(){
	$('#div_lyr_legend').html('');
	var lyrs=GLIN.GIS.Viewer.GetVisibleLayers();//GetAllLayers();
	if(lyrs!=null&&lyrs.length>0){
	    var table=$('<table>');
	    //table.addClass('popupt');
	    table.css('width','100%');
	    var lurl=null;
	    var html=null;
	    var tr,td;
	    var imghead=null;
	    var label=null;
	    for(var i=lyrs.length-1;i>=0;--i){
		lurl=uiEvent.Invoke("UI_OnLegendUpdate",lyrs[i].name);
		if(false==lurl)continue;
		if(lurl==null){
		    lurl=GLIN.GIS.Viewer.GetLayerLegend(lyrs[i].name,30,30);
		    imghead='<img style="width:30px;height:30px;" src="';
		    label=lyrs[i].name;
		}else{
		    if(lurl.html==null)
		        imghead='<img style="'+lurl.style+'" src="';
		    else
			html=lurl.html;
		    label=lurl.text;
		    lurl=lurl.url;
		}
		if(lurl!=null){
		    tr=$('<tr>');
		    td=$('<td>').html(html!=null?html:imghead+lurl+'" />');
		    tr.append(td);
		    td=$('<td>').html('<span style="font-size:10px;">'+label+'</span></td>');
		    tr.append(td);
		    table.append(tr);
		    html=null;
		}
	    }
	    $('#div_lyr_legend').append(table);
	    uiEvent.Invoke("UI_OnLegendUpdateComplete");
	}
    };
    var layerActivated=function(){
	$('#div_lyr_others').html('');
	var lyrs=GLIN.GIS.Viewer.GetVisibleLayers();
	if(lyrs!=null&&lyrs.length>0){
	    $('#div_lyr_others').append('<table style="width:95%"></table>');
	    for(var i=lyrs.length-1;i>=0;--i){
		if(lyrs[i].usrCtl==false)continue;
		$('#div_lyr_others').children('table').append('<tr><td><a style="padding-left:6px;" target="_blank" href="'+lyrs[i].metalink+'">'+lyrs[i].name+'</a></td><td style="width:10%;"><input type="checkbox" class="chk_lyr_vis" value="'+lyrs[i].name+'" style="margin:0;display:none;" checked="checked"/></td></tr>');
		$('#div_lyr_others').find('.chk_lyr_vis').last().iphoneStyle({onChange:layerVisibilityHandler});
	    }
	    $('#div_lyr_others').find('.chk_lyr_vis').each(function(idx){
		registerCheckboxLoadingEvent($(this));
	    });
	}
	else $('#div_lyr_others').html('<div>No Layer has been turned on.</div>');
    }
    var layerOrder=function(){
	$('#div_lyr_others').html('');
	var lyrs=GLIN.GIS.Viewer.GetVisibleLayers();//GetAllLayers();
        var hasLyr=false;
	if(lyrs!=null&&lyrs.length>0){
	    $('#div_lyr_others').append('<ul class="lyr-sortable"></ul>');
	    var sel=null;
	    for(var i=lyrs.length-1;i>=0;--i){
		if(lyrs[i].isVector)continue;
		hasLyr=true;
		sel=lyrs[i].visible==true?'':' unsortable';
		$('#div_lyr_others').children('ul').append('<li class="ui-state-default'+sel+'" value="'+lyrs[i].name+'"><span class="ui-icon ui-icon-arrowthick-2-n-s"></span>'+lyrs[i].name+'</li>');
	    }
	    if(hasLyr){
	        $('#div_lyr_others').children('ul').sortable({
		items: "li:not(.unsortable)",
		placeholder: "ui-state-highlight",
		start:function(event,ui){
            		var start_pos = ui.item.index();
            		ui.item.data('start_pos', start_pos);
        	},
        	update:function(event,ui){
            		var start_pos = ui.item.data('start_pos');
            		var end_pos = $(ui.item).index();
			if(start_pos==end_pos)return;
			var idx=-1;
			if(end_pos>start_pos)//move down
			    idx=GLIN.GIS.Viewer.GetLayerIndex($(ui.item).prev().attr('value'));
			else
			    idx=GLIN.GIS.Viewer.GetLayerIndex($(ui.item).next().attr('value'));
			//GLIN.GIS.Viewer.ChangeLayerOrder($(ui.item).attr('value'),start_pos-end_pos);
			GLIN.GIS.Viewer.SetLayerIndex($(ui.item).attr('value'),idx);
			//have to update everything for new ordering.
			layerOrder();
        	}
	        });
	        $('#div_lyr_others').children('ul').disableSelection();$('#div_lyr_others').children('ul').find('.unsortable')

	        $('#div_lyr_others').children('ul').find('.unsortable').children('.ui-icon').removeClass('ui-icon');
	        //$('#div_lyr_others').show();
	        //currentLyrControlView='order';
	    }
	    else
		$('#div_lyr_others').append('<h4>No Visible Layer Applied.</h4>');
	}
	else $('#div_lyr_others').append('<h4>No Visible Layer.</h4>');
	$('#div_lyr_others').show();
        currentLyrControlView='order';
    };
    var layerOpacity=function(){
	$('#div_lyr_others').html('');
	var lyrs=GLIN.GIS.Viewer.GetVisibleLayers();
	var hasLyr=false;
	if(lyrs!=null&&lyrs.length>0){
	    $('#div_lyr_others').append('<table style="width:95%"></table>');
	    for(var i=lyrs.length-1;i>=0;--i){
		if(lyrs[i].isVector)continue;
	  	var id='dv_lyrslider'+i;
		$('#div_lyr_others').children('table').append('<tr class="lyr-op-pane"><td style="padding:4px;">'+lyrs[i].name+'</td><td style="width:30%;padding-right:10px;"><div id="'+id+'"></div></td></tr>');
		hasLyr=true;
		$('#'+id).slider({
		    orientation: "horizontal",
		    range: "min",
		    max:100,
		    min:0,
		    value:lyrs[i].opacity,
		    slide: function(event,ui){
			GLIN.GIS.Viewer.SetLayerOpacity($(this).data('lyrname'),ui.value);
		    }
	        });
		$('#'+id).data('lyrname',lyrs[i].name);
	    }
	    if(!hasLyr)$('#div_lyr_others').append('<h4>No Visible Layer Applied.</h4>');
	    //$('#div_lyr_others').show();
	    //currentLyrControlView='opacity';
	}
	else $('#div_lyr_others').append('<h4>No Visible Layer.</h4>');
	$('#div_lyr_others').show();
        currentLyrControlView='opacity';
    };
    var layerSelection=function(){
	$('#div_lyr_others').html('');
	var lyrs=GLIN.GIS.Viewer.GetAllSelectableLayers();
	var lname=GLIN.GIS.Viewer.GetSelectedLayer();
	if(lyrs!=null&&lyrs.length>0){
	    $('#div_lyr_others').append('<div style="padding:6px;"><label style="font-size:10px;font-weight:bold;">Filter By Name:</label><input style="padding-left:4px;margin-left:6px;" type="text" id="txt_lyrsel" /></div>');
	    $('#div_lyr_others').append('<table style="width:95%"></table>');
	    for(var i=lyrs.length-1;i>=0;--i){
	  	var ck=lname==lyrs[i].name?' checked="checked" ':' ';
		$('#div_lyr_others').children('table').append('<tr class="lyr-op-pane"><td style="padding:4px;">'+lyrs[i].name+'</td><td style="width:10%;padding:6px;"><input type="radio" name="rd_lyrsel" class="rd_lyrsel" '+ck+' value="'+lyrs[i].name+'" /></td></tr>');
		
		
	        
		//$('#'+id).data('lyrname',lyrs[i].name);
	    }
	    var preval='';
	    var time=null;
	    var filter=function(t){
		$('#div_lyr_others').children('table').find('tr:not(:contains('+t+'))').hide();
		$('#div_lyr_others').children('table').find('tr:contains('+t+')').show();
	    };
	    $('.rd_lyrsel').iCheck({radioClass: 'iradio_square-blue'});
	    $('.rd_lyrsel').on("ifChanged",function(){
		    $(this).focus();
		    GLIN.GIS.Viewer.SetSelectedLayer($(this).attr('value'),100);
	    });
	    if($.browser.msie){
	        $('#txt_lyrsel').focus(function(){
	        time=setInterval(function(){
					var t=$('#txt_lyrsel').val();
					//console.log(t);
					if(t!=preval){
					    preval=t;
					    filter(t);
					}
				},
		     300);
	        });	    
	        $('#txt_lyrsel').blur(function(){if(time!=null)clearInterval(time);});
	    	        
	        
	    }
	    else
		$('#txt_lyrsel').on('input',function(){filter($('#txt_lyrsel').val());});
	    $('#div_lyr_others').show();
	    currentLyrControlView='selection';
	}
	else $('#div_lyr_others').append('<h4>No Layer is selectable.</h4>');
    };
    var showAccordionTabInLayout=function(idx,title){
	if(layout&&layout.state.west.isClosed)setTimeout(function(){layout.toggle('west');},800);
	if(westAccordion){
	    if(layout.state.west.isClosed)
		setTimeout(function(){
			westAccordion.accordion("option", "active", idx);
			
			
			westAccordion.find("h3").eq(westAccordion.accordion( "option", "active" )).find('.lyrtabtitle').text(title);
		},1200);
	    else{
		westAccordion.accordion("option", "active", idx);
		westAccordion.find("h3").eq(westAccordion.accordion( "option", "active" )).find('.lyrtabtitle').text(title);
	    }
	}
    };
    var updateLayerVisibilityUI=function(){
	$('#div_lyr_vis').find('[type=checkbox]').each(function(idx,chk){
				if(chk!=null)
				    $(chk).prop('checked',GLIN.GIS.Viewer.IsLayerVisible($(chk).prop('value')));
	});
	isUserTriggered=false;
	$('.chk_lyr_vis').iphoneStyle('refresh');
	isUserTriggered=true;
    };
    var toggleClick=function(){
	    if($(this).isEnabled()){//&&1==toolbar.selectedTabIndex){//map tool
		var id=$(this).attr('id');
		if($(this).hasClass('no-toggle')){
		    switch(id){
			case 'btn_zoomfull':
			    //GLIN.GIS.Viewer.RunTool('reset');
			    GLIN.GIS.Viewer.RunTool('zoomfull');
			    break;
			case 'btn_lyrlist':
			    switchControlView('west_accordion');
			    $('.sp_vislyr').show();
			    if($('#chk_vis').is(':checked')){
				layerActivated();
				$('#div_lyr_others').show();
			    }else{
			        updateLayerVisibilityUI();
				$('#div_lyr_others').hide();
			        $('#div_lyr_vis').show();
			    }
			    showAccordionTabInLayout(0,'Layer List');
			    currentLyrControlView='list';
			    break;
			case 'btn_lyrorder':
			    $('#div_lyr_vis').hide();
			    $('.sp_vislyr').hide();
			    switchControlView('west_accordion');
			    showAccordionTabInLayout(0,'Layer Order');
			    layerOrder();
			    break;
			case 'btn_lyrtrans':
			    $('#div_lyr_vis').hide();
			    $('.sp_vislyr').hide();
			    switchControlView('west_accordion');
			    showAccordionTabInLayout(0,'Layer Opacity');
			    layerOpacity();
			    break;
			case 'btn_lyrlegend':
			    updateLayerLegendUI();
			    switchControlView('west_accordion');
			    showAccordionTabInLayout(1);
			    break;
			case 'btn_lyrsel':
			    //innerlayout.toggle('south',true);
			    switchControlView('west_accordion');
			    $('#div_lyr_vis').hide();
			    $('.sp_vislyr').hide();
			    showAccordionTabInLayout(0,'Selectable Layers');
			    layerSelection();
			    break;
			case 'btn_lyrselclr':
			    if(!$('#btn_lyrselclr').hasClass('disabled')){
				$('#btn_lyrselclr').addClass('disabled')
				GLIN.GIS.Viewer.SetSelectedLayer(null);
				$("#dv_datadlp").html('');
				if(innerlayout)innerlayout.close('south',true);
				uiEvent.Invoke("UI_SelectionCleaned");
			    }
			break;
			case 'btn_selrect':
			    hideInfoDialog();
		    	    updateInfoDialogContent('');
		    	    curMeasure=null;
			    GLIN.GIS.Viewer.ActivateTool('select_by_rect');
			    break;
			case 'btn_selpoly':
			    hideInfoDialog();
		    	    updateInfoDialogContent('');
		    	    curMeasure=null;
			    GLIN.GIS.Viewer.ActivateTool('select_by_polygon');
			    break;
			case 'btn_navprev':
			    GLIN.GIS.Viewer.RunTool('navigate-prev');
			break;
			case 'btn_navnext':
			    GLIN.GIS.Viewer.RunTool('navigate-next');
			break;
		    }
		}
		else{   
	            $('#tool-tab').find('.sel').toggleClass('sel');
		    $('#theme-tab').find('.sel').toggleClass('sel');
	            $(this).toggleClass('sel');
		    hideInfoDialog();
		    updateInfoDialogContent('');
		    curMeasure=null;
		    var toolname=null;
		    switch(id){
			case 'btn_nav':
			    toolname='navigate';
			    $('#btn_nav').addClass('sel');
			    $('.btn_nav_clone').addClass('sel');
			    break;
			case 'btn_zoomin':
			    toolname='zoomin';
			    break;
			case 'btn_zoomout':
			    toolname='zoomout';
			    break;
			case 'btn_distance':
			    curMeasureSys.type='dist';
			    showMeasureDialog('Measure Distance');
			    toolname='distance';
			    break;
			case 'btn_area':
			    curMeasureSys.type='area';
			    showMeasureDialog('Measure Area','area');
			    toolname='area';
			    break;
			case 'btn_iden':
			    /*if($('#test').is(':visible')){
				$('#test').hide();
				$('#west_accordion').show();
			    }
			    else{
			        $('#test').show();
				$('#west_accordion').hide();
			    }*/
			    curMeasure=null;
			    toolname='select_by_point';
			    $('.btn_iden_clone').addClass('sel');
			    uiEvent.Invoke("UI_IdentifyToolCloneSelected");
			    break;
			default:
			    toolname=uiEvent.Invoke("UI_ToggleButtonClicked",id);
			    break;
		    }
		    if(toolname!=null)
			GLIN.GIS.Viewer.ActivateTool(toolname);
		}
		  
	    }
    };
    var switchControlView=function(id){
	$('#'+id).siblings('div').hide();
	$('#'+id).show();
	if($("#west_accordion").is(':visible'))
	    $("#west_accordion").accordion('refresh');
    };
    var layerVisibilityHandler=function(elem,value){
	if(isUserTriggered){
	    var scales=GLIN.GIS.Viewer.ToggleLayerVisibility(elem.prop('value'));
	    if(scales!=null&&scales.selectable&&GLIN.GIS.Viewer.GetCurrentToolName()=='navigate')
		GLIN.GIS.Viewer.SetSelectedLayer(elem.prop('value'),100);
	    if(scales!=null&&(scales.minscale>0||scales.maxscale>0||(scales.zoomtobound!=null&&scales.crs!=null&&4==scales.zoomtobound.length))){
		if(promptDialog!=null)promptDialog.dialog('destroy');
		if(1){//promptDialog==null){
		    var timer=null;
		    var fsize=null;
		    var fcolor=null;
		   if(scales.zoomtobound!=null)		    
			barr=[{
				text:"OK",
				click:function(){
					if(scales.zoomtobound!=null)GLIN.GIS.Viewer.ZoomToExtent(scales.zoomtobound,scales.crs);
					$(this).dialog('close');
					elem.parent().unblock();
			        }
			      },
			      {
				text:"Cancel",
				click:function(){
					$(this).dialog('close');
					elem.parent().unblock();
				}
			      }
			];
		    else
			barr=[{
				text:"OK",
				click:function(){
					$(this).dialog('close');
					elem.parent().unblock();
				}
			}];
	    	    promptDialog=$(".dv_promp").dialog({
						dialogClass:"dialog-no-close",
						resizable:false,
						autoOpen: false,
						width:500,
						height:barr.length>1?450:350,
						modal:true,
						buttons:barr,
						open:function(){timer=setInterval(function(){
						    if(fcolor==null){fcolor=$('#div_scale').css("color");$('#div_scale').css("color","red");}
						    else{$('#div_scale').css("color",fcolor);fcolor=null;}
						    if(fsize==null){fsize=$('#div_scale').css("font-size");$('#div_scale').css("font-size","16px");}
						    else{$('#div_scale').css("font-size",fsize);fsize=null;}						
						},1000);},
						close:function(){
						    clearInterval(timer);
						    if(fcolor!=null){$('#div_scale').css("color",fcolor);fcolor=null;}
						    if(fsize!=null){$('#div_scale').css("font-size",fsize);fsize=null;}
						}
	    	    });
	    	    
		}
		var txt='';
		if(scales.minscale>0||scales.maxscale>0){
		    txt=txt+'<p>This layer has a scale range set up so it is only displayed if ';
		    if(scales.minscale>0)txt=txt+'the map scale is larger than 1/'+Math.ceil(1.0/scales.minscale);
		    if(scales.maxscale>0)txt=txt+' and is smaller than 1/'+Math.ceil(1.0/scales.maxscale)+'.</p>';
		    txt=txt+'<p>You may use the map scale on the lower left corner of the map as a reference to navigate the layer.</p>';
		}
		if(scales.zoomtobound!=null)
		    txt=txt+'<p>This layer has a geographic extent that only covers a portion of the full extent of the map. You could click OK button to allow the map zoom in to the extent of this layer or click Cancel button to stay on the current map view.</p> ';
		$(".dv_promp").html(txt);
		promptDialog.dialog("open");

	    }
	}
    };
    var registerCheckboxLoadingEvent=function(chkobj){
	 GLIN.GIS.Viewer.OnLayerLoadStart(chkobj.val(),function(){if(chkobj.prop("checked"))
	        					        chkobj.parent().block({message:'<img src="icons/ajax-loader.gif" style="left:0;width:16px;height:16px;background-color: rgba(255, 255, 255, 0.1);margin-left:auto;margin-right:auto;">}',
										    css:{border: 'none',
											 padding: '4px',
											 margin:0,
											 background:'transparent'
										         }
										     }
									       );
							    }
						);
	GLIN.GIS.Viewer.OnLayerLoadEnd(chkobj.val(),function(){chkobj.parent().unblock();});
    };
    var load=function(){

	$.expr[":"].contains = $.expr.createPseudo(function(arg) {
    	        return function( elem ) {
                    return $(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
            };
	});

	$(window).resize(function() {
            $('#container').height($(window).height()-151);			    
            GLIN.GIS.Viewer.ResizeMap();	
	       
        });
	GLIN.GIS.Viewer.OnDocumentReady(function(){
	    var basemap=GLIN.GIS.Viewer.GetBaseLayerInfo();
	    if(basemap!=null){
	        $(':radio[value="'+basemap.name+'"]').prop("checked",true);}
	    $(':radio[name="rd_bmap"]').click(function(){
	        GLIN.GIS.Viewer.SetBaseLayer(this.value);
	    });
	    $('.lrd_bmap').click(function(){
                var v=$(this).attr('for');
                $(':radio[value="'+v+'"]').prop("checked",true);
                $(':radio[value="'+v+'"]').trigger('click');

            });
	    $('.chk_lyr_vis').iphoneStyle({onChange:layerVisibilityHandler});
	    $('.chk_lyr_vis').each(function(idx){
	       registerCheckboxLoadingEvent($(this));
	    });
	    $('.lyr-cat-head').click(function(){
		if($(this).siblings('table').is(':visible')){
		    $(this).siblings('table').hide();
		    $(this).children('.arrow-down-lyr').toggleClass('arrow-down-lyr').toggleClass('arrow-right-lyr');
		}else{
		    $(this).siblings('table').show();
		    $(this).children('.arrow-right-lyr').toggleClass('arrow-right-lyr').toggleClass('arrow-down-lyr');
		}
		$(this).blur();
	    });
	    updateLayerVisibilityUI();
	    updateLayerLegendUI();
	    layerActivated();
        });
        
	toolbar=$('#ribbon').ribbon();
	//toolbar.switchToTabByIndex(0);
	$('.ribbon-button').click(toggleClick);
	outerLayoutOptions = {
			center__paneSelector:	".outer-center"
		,	north__paneSelector:	".outer-north"
		,	spacing_open:		8	// ALL panes 
		,	spacing_closed:		10	// ALL panes 
		,	north__closable:	false
		,	north__resizable:	false
		,	north__spacing_open:	0
		//,	center__onresize:		resizeInnerLayout
		};
	LayoutOptions = {
			spacing_open:			8	// ALL panes 
		,	spacing_closed:			10	// ALL panes 
		,	west__size:			250
		,	west__minSize:			250
		,	west__maxSize:			500
		,	west__togglerLength_open:	0
		};
	InnerLayoutOptions = {
			center__paneSelector:	".inner-center"
		,	south__paneSelector:	".inner-south"
		,	spacing_open:			8 // ALL panes 
		,	spacing_closed:			10 
		,	south__size:			"50%"
		,	south__minSize:			80 
		,	south__maxSize:			"80%" 
		};
	defaultOptions={applyDefaultStyles:true};

	$('#container').height($(window).height()-151);


westAccordion=$("#west_accordion").accordion({
			heightStyle:	"fill",
			//autoHeight:false,
			active:		0,
		        header:'h3'
	});
	$("#west_accordion h3").click(function(){if($(this).text()=='Layer Legends')updateLayerLegendUI();});

	//layout=$('#container').layout(defaultOptions );
	layout=$('#container').layout({
			    west__size:			ctrlWidth
		,	west__spacing_closed:		1
		,	west__togglerLength_closed:	80
		,	west__togglerAlign_closed:	"center"
		,	west__togglerContent_closed:'<div class="arrow-right" style="margin-left:auto;margin-right:auto;"></div>'//"<span>O<BR>P<BR>E<BR>N</span>"
		,	west__togglerTip_closed:	"Open & Pin Menu"
		,	west__sliderTip:			"Click Open Menu"
		,	west__slideTrigger_open:	"mouseclick"
		,	west__minSize:		250
		,	west__maxSize:		500
		,   	west__onresize: function(){
							if(!innerlayout.state.south.isClosed)
							   innerlayout.sizePane('south',3); 
							GLIN.GIS.Viewer.ResizeMap();
							innerlayout.sizePane('south',southHeight);			
							///$('#map').unblock();
							if($("#west_accordion").is(':visible'))
							    $("#west_accordion").accordion('refresh');
							//$.layout.callbacks.resizePaneAccordions;
						   	//innerlayout.sizePane('south',southHeight);
					}
		
		/*,	center__maxWidth:		1600
		,	center__minWidth:			800*/
		,	center__maskContents:		true // IMPORTANT - enable iframe masking
		,	onopen_end:	        function(){if(!innerlayout.state.south.isClosed)innerlayout.close('south',true);GLIN.GIS.Viewer.ResizeMap();}
		,	onclose_end:		function(){if(!innerlayout.state.south.isClosed)innerlayout.close('south',true);GLIN.GIS.Viewer.ResizeMap();}
		,center:		{
						onresize:	function(){if(innerlayout)innerlayout.resizeAll();}
					}
			 });
	innerlayout=$('.ui-layout-center').layout({
			applyDefaultStyles:true
		,	south__size:DataPaneSize	
		,	south__initClosed:	true
		,   	south__onresize:  function(){
				uiEvent.Invoke("UI_DataPaneResize");
				if(southHeight!=innerlayout.state.south.innerHeight)isSouthResized=true;
				//GLIN.GIS.Viewer.ResizeMap();
		}
		,	slideTrigger_close: "click"
		,	onopen_end:    function(){southHeight=innerlayout.state.south.innerHeight;}//		GLIN.GIS.Viewer.ResizeMap
		,	onclose_end:		function(){
					if(isSouthResized){
					    isSouthResized=false;
					    GLIN.GIS.Viewer.ResizeMap();
					}}
			});
$("#west_accordion").accordion('refresh');
//&&layout.state.west.size<layout.options.west.maxSize)
	///$('.ui-layout-resizer').mousedown(function(e){if(e.which==1)$('#map').block({message:''});});
	///$('.ui-layout-resizer').mouseup(function(){$('#map').unblock();});
	//$('.blockUI').mouseup(function(){$('#map').unblock();});
	$('#btn_westclose').click(function(){if(layout)layout.toggle('west');});
	$('#btn_southclose').click(function(){if(innerlayout)innerlayout.toggle('south');});
	/*westAccordion=$("#west_accordion").accordion({
			heightStyle:	"fill",
			//autoHeight:false,
			active:		0,
		        header:'h3'
	});
	$("#west_accordion h3").click(function(){if($(this).text()=='Layer Legends')updateLayerLegendUI();});*/
	$(".basemap-menu").menu().hide();
        $(".barovermap").click(function(){
	    if($(".arrow-down").length>0)
		$(".basemap-menu").show("blind");
	    else
		$(".basemap-menu").hide();
	    $("#bm_arrow").toggleClass("arrow-down").toggleClass("arrow-up");
	});
//$('#map').block({message:''});
	$('#btn_desc').button({
			    icons: {
			        primary: "ui-icon-home"
			    },
			    text: false
	}).click(function(){switchControlView('dv_desc');}).tooltip();
	$('#btn_lyr').button({
			    icons: {
			        primary: "ui-icon-folder-open"
			    },
			    text: false
	}).click(function(){
		$('.sp_vislyr').show();
                if($('#chk_vis').is(':checked')){
                    layerActivated();
                    $('#div_lyr_others').show();
                }else{
                    updateLayerVisibilityUI();
                    $('#div_lyr_others').hide();
                    $('#div_lyr_vis').show();
                }
                showAccordionTabInLayout(0,'Layer List');
                currentLyrControlView='list';
		switchControlView('west_accordion');
		/*switchControlView('west_accordion');
		updateLayerVisibilityUI();
		updateLayerLegendUI();
		layerActivated();*/
		ui.SetToolHighlight(0);
	}).tooltip();
	$('#btn_theme').button({
			    icons: {
			        primary: "ui-icon-info"
			    },
			    text: false
	}).click(function(){switchControlView('dv_theme');ui.SetToolHighlight(1);}).tooltip();
        $("#chk_vis").prop('checked', false); 
        $('#chk_vis').click(function(e) {
	    if($(this).is(':checked')){
		$('#div_lyr_vis').hide();
		layerActivated();
		$('#div_lyr_others').show();
	    }else{
		updateLayerVisibilityUI();
		$('#div_lyr_others').hide();
		$('#div_lyr_vis').show();
	    }
    	    e.stopPropagation();
	});
	GLIN.GIS.Viewer.OnNavigationHistoryPrevious(function(activate){
	    if(activate==true){
		if($('#btn_navprev').hasClass('disabled'))
	        $('#btn_navprev').removeClass('disabled');
	    }
	    else
		$('#btn_navprev').addClass('disabled');
	});
        GLIN.GIS.Viewer.OnNavigationHistoryNext(function(activate){
	    if(activate==true){
		if($('#btn_navnext').hasClass('disabled'))
	        $('#btn_navnext').removeClass('disabled');
	    }
	    else
		$('#btn_navnext').addClass('disabled');
	});
	GLIN.GIS.Viewer.OnIdentifyPopupLoaded(function(){
	    $('#dv_pg_container').pajinate({items_per_page:1,num_page_links_to_display:3,abort_on_small_lists:true});
	    $('.zom2ftr').click(function(){
		$(this).siblings('div.pg_container').find('li').each(function(idx){
		    if($(this).is(':visible'))
		        GLIN.GIS.Viewer.ZoomToFeatureByFID($(this).attr('value1'),$(this).attr('value2'));
		});
	    });
	});
    };
    
    return{
	Load:load,
	SwitchControlView:function(id){
	    switchControlView(id);
	},
	SetToolHighlight:function(id){
	    //if(1==toolbar.selectedTabIndex){
		//$('#tool-tab').find('.sel').toggleClass('sel');
		//$('#'+id).toggleClass('sel');
	    //}
	    toolbar.switchToTabByIndex(id);
	},
	SetPanAsDefaultButton:function(){
	    $('.sel').toggleClass('sel');
	    $('#btn_nav').toggleClass('sel');
	    $('.btn_nav_clone').toggleClass('sel');
	    toolbar.switchToTabByIndex(0);//this is a adhoc bug fix...
	},
	MeasureHandler:function(event){
	    curMeasure={"val":event.measure,"unit":event.units,"order":event.order};

	    var from=curMeasure.unit;
	    var to=null;
	    if(curMeasureSys.unit!='auto'&&curMeasure.unit!=curMeasureSys.unit){
	        curMeasure.val=GLIN.GIS.Viewer.ConvertFromTo(curMeasure.val,curMeasure.unit,curMeasureSys.unit,curMeasure.order);
		curMeasure.unit=curMeasureSys.unit;
	    }
	    var ord=curMeasure.order>1?"sq":"";
	    updateInfoDialogContent(curMeasure.val.toFixed(3)+' '+ord+curMeasure.unit);
	},
	UpdateInfoDialogContent:updateInfoDialogContent,
	GetScaleLineDiv:function(){
	    return null;
	//'div_scalebar'
	},
	GetScaleDiv:function(){
	    return 'div_scale';
	},
	ShowLeftPane:function(name){
	    if(name!=null&&name.length>0){
		var id='west_accordion';
		if(name=='Description')id='dv_desc';
		else if(name=='Themes')id='dv_theme';
		switchControlView(id);
	    }
	},
	OpenLeftPane:function(){
            layout.open('west');
        },
	SlideOpenDataPane: function(isDefault){
				$("#dv_datadlp").text('');
				if(isDefault)innerlayout.sizePane('south',DataPaneSize);
				if(innerlayout)innerlayout.open('south',true);
			    },
	SlideOpenDataPaneS:function(percent){
	    $("#dv_datadlp").text('');
            if(innerlayout){
                                    innerlayout.sizePane('south',percent);
                                    innerlayout.open('south',true);
            }
	},
	SlideCloseDataPane: function(){
				$("#dv_datadlp").text('');
				if(innerlayout)innerlayout.close('south',true);
			    },
	 SlideOpenDataPaneFull: function(){
                                $("#dv_datadlp").text('');
                                if(innerlayout){
				    innerlayout.sizePane('south','100%');
				    innerlayout.open('south',true);
				}
                            },
	SlideOpenDataPaneHalf: function(){
                                $("#dv_datadlp").text('');
                                if(innerlayout){
                                    innerlayout.sizePane('south','50%');
                                    innerlayout.open('south',true);
                                }
                            },
	ClearDataPane:function(){$("#dv_datadlp").html('');},
	DataPaneDisplay: function(objs,flds,lyrname){
	    $("#dv_datadlp").html('');
	    if(objs==null||objs.count==null||objs.count==0){
		$("#dv_datadlp").append('<div>No record returned for your selection.</div>');
		return;
	    }
	    else if(objs.count==1)$("#dv_datadlp").append('<div>1 record returned from your selection.</div>');
	    else
	        $("#dv_datadlp").append('<div>'+objs.count+' records are selected on the map based upon your selection.'+ (objs.maxcount>=objs.count?'</div>':'Only the first '+objs.maxcount+' are list below.</div>'));
	    //if(objs==null||objs['features']==null||objs['features'].length==0){$("#dv_datadlp").text('Nothing was selected.');return;}
	    if($('#btn_lyrselclr').hasClass('disabled'))
	        $('#btn_lyrselclr').removeClass('disabled');
	    var table=$('<table>');
	    var th=$('<thead>');
	    var td=null;
	    var tr=$('<tr>');
	    td=$('<th>').text('');
	    tr.append(td);
	    for(var i=0,len=flds.length;i<len;++i){
		td=$('<th>').text(flds[i]['display']);
		tr.append(td);
	    }
	    th.append(tr);
	    table.append(th);
	    var tb=$('<tbody>');
	    len=objs['features'].length;
	    if(len>objs.maxcount)len=objs.maxcount;
	    for(i=0;i<len&&objs['features'][i].type=='Feature';++i){
		tr=$('<tr>');
	 	td=$('<td>').html('<button class="sel_id" title="Identify This Feature on the Map" style="height:22px;" lyr="'+lyrname+'" fid="'+objs['features'][i].id+'"></button><button class="sel_zoom" title="Zoom to This Feature" style="height:22px;" lyr="'+lyrname+'" fid="'+objs['features'][i].id+'"></button>');
		td.attr('align','left');
		tr.append(td);
		for(var j=0,len1=flds.length;j<len1;++j){
		    td=$('<td>').text(objs['features'][i].properties[flds[j].field]);
		    tr.append(td);
		}
		tb.append(tr);
	    }
	    table.append(tb);
	    //table.attr('id','tabsort');
	    table.addClass('tablesorter');
	    table.attr('cellspacing','1');
	    $("#dv_datadlp").append(table);
	    $(".sel_id").button({
			    icons: {
			        primary: "ui-icon-info"
			    },
			    text: false
	    }).click(function(){
		var lyr=$(this).attr('lyr');
		var fid=$(this).attr('fid');
		if(lyr!=null&&fid!=null)
		    GLIN.GIS.Viewer.IdentifyFeatureByFID(lyr,fid);
	    }).tooltip();
	    $(".sel_zoom").button({
			    icons: {
			        primary: "ui-icon-zoomin"
			    },
			    text: false
	    }).click(function(){
		var lyr=$(this).attr('lyr');
		var fid=$(this).attr('fid');
		if(lyr!=null&&fid!=null)
		    GLIN.GIS.Viewer.ZoomToFeatureByFID(lyr,fid);
	    }).tooltip();
	    table.tablesorter({debug:false,widgets: ['zebra'],headers:{0:{sorter:false}}});
	    
	},
	ToggleOpenDataPane: function(){
				if(innerlayout)innerlayout.open('south',false);
			    },
	CloseDataPane: function(){
				if(innerlayout)innerlayout.close('south');
			},
	ShowWaitScreen:function(){
	    /*$.blockUI({ css: { 
            border: 'none', 
            padding: '15px', 
            backgroundColor: '#000', 
            '-webkit-border-radius': '10px', 
            '-moz-border-radius': '10px', 
            opacity: .5, 
            color: '#fff' 
        } });*/
	    if(isLoading){
	        $.unblockUI();
		return;
	    }
	    $.blockUI({ 
            message: $('div.growlUI'), 
            fadeIn: 700, 
            fadeOut: 700, 
            showOverlay: false, 
            centerY: false, 
            css: { 
                width: '350px', 
                top: '10px', 
                left: '', 
                right: '10px', 
                border: 'none', 
                padding: '5px', 
                backgroundColor: '#000', 
                '-webkit-border-radius': '10px', 
                '-moz-border-radius': '10px', 
		'border-radius':'10px',
                opacity: .6, 
                color: '#fff' 
                }
	    });
	    isLoading=true;
	},
	HideWaitScreen:function(){
	    if(isLoading){
	        $.unblockUI();
		isLoading=false;
	    }
	},
	GetMapBound:function(){
	    return GLIN.GIS.Viewer.GetMapExtent('EPSG:4326');
	},
	FeatureLayer:function(lyrname,layers){
	    var result=false;
	    var lyr=null;
	    if(lyrname!=null&&lyrname.length>0&&(lyr=GLIN.GIS.Viewer.IsLayerExisted(lyrname,layers))!=false){
		lyrname=lyr.name;
		if(!GLIN.GIS.Viewer.IsLayerVisible(lyrname)){
		    GLIN.GIS.Viewer.ToggleLayerVisibility(lyrname);
		    var chk=$('#div_lyr_vis').find("a:contains("+lyrname+")").parent().siblings().find(".chk_lyr_vis");
		    isUserTriggered=false;
		    $(chk).prop('checked',true);
		    $(chk).iphoneStyle('refresh');
		    isUserTriggered=true;
		}
		GLIN.GIS.Viewer.SetLayerOpacity(lyrname,100);
		GLIN.GIS.Viewer.PutLayerOnTop(lyrname);
		result=true;
	    }
	    return result;
	},
	Update4NewLayer:function(lyrname,meta,isHidden){
	    if(meta==null)meta='';
	    var ck='checked="checked"';
	    if(isHidden)ck='';
	    $('#dv_usr_lyrlst').children('table').append('<tr><td><a style="padding-left:6px;" target="_blank" href="'+meta+'">'+lyrname+'</a></td><td style="width:10%;"><input type="checkbox" class="chk_lyr_vis" value="'+lyrname+'" style="margin:0;display:none;" '+ck+' /></td></tr>');
	    $('#dv_usr_lyrlst').children('table').css('width','');
	    var chkobj=$('#dv_usr_lyrlst').find('.chk_lyr_vis').last();
            chkobj.iphoneStyle({onChange:layerVisibilityHandler});
	    registerCheckboxLoadingEvent(chkobj);
	    $('#dv_usr_lyrlst').show();
	    if(currentLyrControlView=='selection')
		layerSelection();
	    else if(currentLyrControlView=='order')
		layerOrder();
	    else if(currentLyrControlView=='opacity')
		layerOpacity();
	},
	AddNewLayer:function(lyr,ismarker,ismarkerHidden){
	    var result=ui.FeatureLayer(lyr.name,lyr.id);
    	    if(!result&&!GLIN.GIS.Viewer.IsLayerExisted(lyr.name,lyr.id)&&GLIN.GIS.Viewer.AddLayer(lyr,ismarker,ismarkerHidden)){
		result=true;
	    }
	    return result;
	},
	FormatPopupText:function(txt,lyrname){
	    if(txt!=null){
		var json=null;
		if(txt.name!=null)json=txt;
		else{
	 	    try{
	                json=$.parseJSON(txt);
		    }catch(err){
		        json=null;
		    }
		}
		if(json!=null&&json.features!=null&&json.features.length>0){
		    var html='<div style="margin-top:10px;margin-bottom:10px;">'+lyrname+'('+json.features.length+' returns)</div><div id="dv_pg_container" class="pg_container"><div class="page_navigation"></div>';
		    html=html+'<ul class="content">';
		    var style='';
		    var rf=uiEvent.Invoke("UI_OnFormatPopupTextKeyFilter",lyrname);
		    var filter=null;
		    if(rf!=null&&rf.length>0){
			filter={};
			for(var i=0;i<rf.length;++i)
			    filter[rf[i]]=1;
		    }
		    for(var i=0;i<json.features.length;++i){
		        html=html+'<li '+style+'value1="'+lyrname+'" value2="'+json.features[i].fid+'"><table class="popupt"><thead><tr><th>Field Name</th><th>Value</th></tr></thead><tbody>';
			style=' style="display:none;" ';
		        for(var key in json.features[i]){
			    if(filter!=null&&filter[key]!=1)continue;
		            html=html+'<tr><td>'+key+'</td><td>'+json.features[i][key]+'</td></tr>';
			}
		        html=html+'</tbody></table></li>';
		    }
		    html=html+'</ul></div>';
		    html=html+'<a href="#" style="font-size:10px;" class="zom2ftr">Zoom to This Feature</a>'
		    
		    return html;
	        }
	    }
	    return null;
	},
	PromptWindow:function(w,h,txt){
            if(txt==null)return;
	    if(w<100)w=500;
            if(h<100)h=350;
            if(promptDialog!=null)promptDialog.dialog('destroy');
            promptDialog=$(".dv_promp").dialog({
                                                dialogClass:"dialog-no-close",
                                                resizable:false,
                                                autoOpen: false,
                                                width:w,
                                                height:h,
                                                modal:true,
                                                buttons:{
                                                    "OK":function(){$(this).dialog("close") ;}
                                                }
                        });
            promptDialog.html(txt);
            promptDialog.dialog("open");
        },
	OnCustomButtonClicked:function(handler){
	    uiEvent.AddEvent("UI_ToggleButtonClicked",handler);
	},
	OnLegendUpdate: function(handler){
	    uiEvent.AddEvent("UI_OnLegendUpdate",handler);
	},
	OnLegendUpdateComplete: function(handler){
	    uiEvent.AddEvent("UI_OnLegendUpdateComplete",handler);
	},
	OnDataPaneResize:function(handler){
	    uiEvent.AddEvent("UI_DataPaneResize",handler);
	},
	OnSelectionCleaned:function(handler){
	    uiEvent.AddEvent("UI_SelectionCleaned",handler);
	},
	OnIdentifyToolCloneSelected:function(handler){
	    uiEvent.AddEvent("UI_IdentifyToolCloneSelected",handler);
	},
	OnFormatPopupTextKeyFilter:function(handler){
	    uiEvent.AddEvent("UI_OnFormatPopupTextKeyFilter",handler);
	}
    };
});
