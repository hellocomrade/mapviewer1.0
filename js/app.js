var apiKey="AvMkwimSAoFgzGzQhqhvCV96DIj2yS83-4-0jIc49Hnh-L8lZwV1GOCPIiu-bRWB";
var gpSubmitUrl="http://geo.glc.org/arcgis/rest/services/stream/TraceOnFlyFull/GPServer/TraceOnFlyFull/submitJob";
var gpSubmitUrlIE="./trace-proxy.php?s=1"
var gpStatusUrl="http://geo.glc.org/arcgis/rest/services/stream/TraceOnFlyFull/GPServer/TraceOnFlyFull/jobs/";
var gpStatusUrlIE="./trace-proxy.php?"
//var gpMSUrl="http://192.168.100.16/arcgis/rest/services/StreamTracing/StreamTracingTest/MapServer/jobs/";
var gpMSUrl="http://geo.glc.org/arcgis/rest/services/stream/TraceOnFlyFull/GPServer/TraceOnFlyFull/jobs/";
var cacheUrl="./redis/get.php?id=";
var cacheWMSUrl="http://geo.glin.net/vector/wms";
var cacheLyrId="glin:upstreams";
var cacheFtrPrefix="upstreams.";
var cachewms=null;
var isWMSCache=false;
var ui=new GLIN.GIS.UI(350);
var mapepsg=GLIN.GIS.Viewer.GetMapProjectionCode(false);
var flagCnt=0;
var barrierCnt=0;
var jobId=null;
var timeId=null;
var checkedBarries=null;
var overallDist=0.0;
var CheckInterval=1000;
var startPnt=null;
var ResultLayerName="GPResult";
var Flags={ "displayFieldName": "", "hasZ": false, "geometryType": "esriGeometryPoint", "spatialReference": { "wkid": 4269, "latestWkid": 4269 }, "fields": [ { "name": "OBJECTID", "type": "esriFieldTypeOID", "alias": "OBJECTID" }, { "name": "Enabled", "type": "esriFieldTypeSmallInteger", "alias": "Enabled" } ], "features": null, "exceededTransferLimit": false };
var Barriers={ "displayFieldName": "", "hasZ": false, "geometryType": "esriGeometryPoint", "spatialReference": { "wkid": 4269, "latestWkid": 4269 }, "fields": [ { "name": "objectid", "type": "esriFieldTypeOID", "alias": "objectid" }, { "name": "enabled", "type": "esriFieldTypeSmallInteger", "alias": "enabled" } ], "features": null, "exceededTransferLimit": false };
var TraceType="TRACE_UPSTREAM";
var THRESHOLD=1000000.0;
var Result=null;
var errCoords=null;
function getDisDisplay(m){
    var dis=m*3.28084;
    var unit="feet";
    if(dis>5280.0){
	dis=dis/5280.0;
	unit="miles";
    }
    return dis.toFixed(2)+" "+unit;
}
function insert(id,adj,dist){
    if(checkedBarries==null)checkedBarries={};
    if(checkedBarries[id]==null){
	if(adj!=null&&adj.length>0)
	    checkedBarries[id]=adj.split("|");
	else
	    checkedBarries[id]=[];
	overallDist=overallDist+dist;
    }
    $('#btn_clr').removeClass('disabled');
}
function getDistance(){
    return overallDist.toFixed(2);
}
function clear(){
    checkedBarries=null;
    overallDist=0.0;
    errCoords=null;
    ui.CloseDataPane();
    $("#dv_datadlp").html('');
    if(Result!=null){
	GLIN.GIS.Viewer.DestroyUserPopup(Result.popup);
        Result=null;
    }
    if(isWMSCache){
	GLIN.GIS.Viewer.RemoveUserWMSLayer(cachewms);
	isWMSCache=false;
    }
    else{ 
	GLIN.GIS.Viewer.RemoveAllUserESRIGeometries();
	GLIN.GIS.Viewer.RemoveAllESRIGeometries();
    }
    GLIN.GIS.Viewer.ClearClusterHighlight();
}
function disableButtons(){
    $('#btn_tracing_run').addClass('disabled');
    $('#btn_clr_barriers').addClass('disabled');
    
}
function enableButtons(){
    $('#btn_tracing_run').removeClass('disabled');
    $('#btn_clr_barriers').removeClass('disabled');
}
function isChecked(id){
    return checkedBarries!=null&&checkedBarries[id]!=null;
}
function isMyUpstream(id,adj){
    var ret=false;
    if(adj!=null){
        for(var i=0;i<adj.length;++i)
            if(adj[i]==id){ret=true;break;}
    }
    return ret;
}
function isAdj(id,adj){
    var ret=false;
    if(checkedBarries!=null){
	for(var k in checkedBarries){
	    ret=isMyUpstream(k,adj);
	    if(ret)break;
	    ret=isMyUpstream(id,checkedBarries[k]);
	    if(ret)break;
	}
    }
    return ret;
}
function buildFeatureIdList(newid){
    if(checkedBarries!=null){
	var ids="";
	for(var k in checkedBarries)ids=ids+cacheFtrPrefix+k+',';
	return ids+cacheFtrPrefix+newid;
    }else return cacheFtrPrefix+newid;
}
function isGPRunable(){
    if(flagCnt>0)
	$('#btn_tracing_run').removeClass('disabled');
    else
	$('#btn_tracing_run').addClass('disabled');
}
function submitGPJob(){
    //GLIN.GIS.Viewer.RemoveUserMarker(startPnt);
    var ftrs=GLIN.GIS.Viewer.GetAllUserMarkers();
    if(ftrs!=null&&ftrs.length>0){
        var flags=Array();
        var barriers=Array();
	var pflags=null;
	var pbarriers=null;
        var i=0;
	for(;i<ftrs.length;++i){
	    if(ftrs[i]==startPnt)continue;
	    /*if(ftrs[i].uid=="flag_marker")
		flags.push({"geometry":{"x":ftrs[i].geometry.x,"y":ftrs[i].geometry.y,"spatialReference":{"wkid":mapepsg}}});
	    else if(ftrs[i].uid=="barrier_marker")
		barriers.push({"geometry":{"x":ftrs[i].geometry.x,"y":ftrs[i].geometry.y,"spatialReference":{"wkid":mapepsg}}});*/
 	    if(ftrs[i].uid=="barrier_marker"){
		if(ftrs[i].isSP){
		    flags.push({"geometry":{"x":ftrs[i].geometry.x,"y":ftrs[i].geometry.y,"spatialReference":{"wkid":mapepsg}}});
		}
		else{
		    barriers.push({"geometry":{"x":ftrs[i].geometry.x,"y":ftrs[i].geometry.y,"spatialReference":{"wkid":mapepsg}}});
		}
	    }
		
	}
	if(flags.length>0){
	    pflags=Flags;
	    pflags.features=flags;
	    if(barriers.length>0){
		pbarriers=Barriers;
		pbarriers.features=barriers;
	    }
	    disableButtons();
	    TraceType=$(':radio[name="rd_trac"]:checked').val();
	    var isIE=(navigator.appName=='Microsoft Internet Explorer');
	    ui.ShowWaitScreen();
	    $.post(isIE?gpSubmitUrlIE:gpSubmitUrl,
		  {"Barriers":JSON.stringify(pbarriers),"Flags":JSON.stringify(pflags),"Trace_Task_type":TraceType,"f":"json",
				"env:outSR":"3857","env:processSR":"","returnM":false,"returnZ":false},
		  function(data){
		      if(data.jobId!=null){
			  jobId=data.jobId;
			  if(data.jobStatus=="esriJobSubmitted")
			      var count=0;
			      timeId=setInterval(function(){
						 var ckurl=isIE?gpStatusUrlIE+"id="+jobId+"&f=json&c="+count++:gpStatusUrl+jobId+"?f=json&c="+count++;
						 $.get(ckurl,
						       function(data){
						           if(data.jobStatus=="esriJobSucceeded"||data.jobStatus=="esriJobFailed"){
							       clearInterval(timeId);
							       if(data.jobStatus=="esriJobSucceeded"){
								   var rurl=isIE?gpStatusUrlIE+"r=1&id="+jobId:gpMSUrl+jobId+"/results/Result?f=json";
							           $.get(rurl,
									 function(data){
									     if(data.value!=null){
										 var i=0;
										 var ftrs=data.value.features;
										 var style=null;
										 var vb=null;
										 if(TraceType=='TRACE_UPSTREAM'){
										     style=new OpenLayers.Style({
                                            					         "strokeWidth": 3,
                                            					         "strokeColor": "#d95f02",
                                        					     });
										     vb='Upstream';
										 }
										 else{
										     style=new OpenLayers.Style({
                                                                                         "strokeWidth": 3,
                                                                                         "strokeColor": "#fff200",
                                                                                     });
										     vb='Downstream';
										 }
										 Result={};
										 var cnt=0.0;
										 for(;i<ftrs.length;++i){
										    GLIN.GIS.Viewer.AddUserESRIGeometries(data.value.geometryType,ftrs[i].geometry,style);
										    cnt=cnt+ftrs[i].attributes.Shape_Length;
										 }
										 GLIN.GIS.Viewer.ZoomToExtent(GLIN.GIS.Viewer.GetUserVectorDataExtent(),//GLIN.GIS.Viewer.GetVectorDataExtent(),
											GLIN.GIS.Viewer.GetMapProjectionCode(true));
										 $('#btn_clr').removeClass('disabled');
										 ui.HideWaitScreen();
										 Result.length=cnt;
										 var geom=GLIN.GIS.Viewer.transformMapXY2(flags[0].geometry.x,flags[0].geometry.y,'EPSG:4269');
										 Result.x=geom.x;
										 Result.y=geom.y;
										 Result.html='<table class="popupt"><tr><td>Longitude</td><td>'+Result.x.toFixed(2)+'</td></tr><tr><td>Latitude</td><td>'+Result.y.toFixed(2)+'</td></tr><tr><td>'+vb+' Distance</td><td>'+getDisDisplay(Result.length)+'</td></tr></table>';
										 Result.popup=GLIN.GIS.Viewer.CreateUserPopup(flags[0].geometry.x,flags[0].geometry.y,Result.html);			    
									      }
									      else{
									          //TODO:what if it's null
									      }
									      enableButtons();
									      //$('#btn_tracing_run').removeClass('disabled');
									  }//end of bbox function
								   ,"json");
							       }else{
								   //TODO:job failed
								   enableButtons();
								   var err="<p>Unknown Error. Please start over and try again.</p>";
								   if(data.messages!=null&&data.messages.length>=4){
								       if(data.messages[2].type=="esriJobMessageTypeError"&&data.messages[2].description=="2")
								       {
									   if(data.messages[3].type=="esriJobMessageTypeError"&&data.messages[3].description!=null)
				      {
					  var coords=$.parseJSON(data.messages[3].description);
					  var tab=null;
					  if(coords!=null&&coords.length>0){
					      var tab="<table class='tablesorter' cellspacing='1'>";
					      tab=tab+"<thead><tr><th>Zoom To This Barrier</th><th>Coordinates</th></tr></thead>";
					      tab=tab+"<tbody>";
					      var c="odd";
					      for(var i=0;i<coords.length;++i){
					          tab=tab+"<tr class='"+c+"'>";
						  if(c=="odd")c="even";
						  else c="odd";
						  tab=tab+"<td align='left'><button class='sel_zoom' val='"+i+"' title='Zoom to This Barrier' style='height:22px;' /></td>";
						  tab=tab+"<td>"+coords[i][0].toFixed(2)+","+coords[i][1].toFixed(2)+"</td>";
						  tab=tab+"</tr>";	
					      }  
					      tab=tab+"</tbody></table>";
					      errCoords=coords;
					      if(tab!=null)err="<p>The following barriers could not be connected to the stream network.  Please remove them and place them closer to the desired stream segment before attempting to run the trace again.</p>"+tab;
					  }
					  //console.log($.parseJSON(data.messages[3].description));
				      }
								       }
								   }
								   ui.HideWaitScreen();
								   ui.SlideOpenDataPane(true);
								   $("#dv_datadlp").html(err);
								   $(".sel_zoom").button({
                                                			icons: {
                                                    				primary: "ui-icon-zoomin"
                                                			},
                                                			text: false
                                                		   }).click(function(){
                                                        		var i=$(this).attr('val');
                                                        		if(i>=0&&coords!=null)
                                                            		GLIN.GIS.Viewer.centerMapTo(coords[i][0],coords[i][1],"EPSG:4269",15);
                                              			   }).tooltip();

								   //$('#btn_tracing_run').removeClass('disabled');
							       }
						           }
						       },//end of status function
						 "json");
						 }//end of setinterval function
					         ,CheckInterval);
				
			}else{
			    //TODO:submittal failed
			    enableButtons();
			    //$('#btn_tracing_run').removeClass('disabled');
			}
	        }//end of submitjob function
	    ,"json");
	}
    }
}
$(document).ready(function(){
    ui.OnLegendUpdate(function(lyrname){
	if(lyrname.indexOf('Federal Lands')==0){
	    return {url:"",style:"",text:"Federal Lands",html:'<table style="font-size:10px;"><tbody><tr valign="middle"><td><img src="http://glein.er.usgs.gov/arcgiswa/rest/services/seasketch_database_layers/MapServer/21/images/7c61d01f9bd545ab39e13a1c033e3c04"></td><td>Military</td></tr><tr valign="middle"><td><img src="http://glein.er.usgs.gov/arcgiswa/rest/services/seasketch_database_layers/MapServer/21/images/b55eb9c15d4b04f0f435c6305e25618f"></td><td>National Forest</td></tr><tr valign="middle"><td><img src="http://glein.er.usgs.gov/arcgiswa/rest/services/seasketch_database_layers/MapServer/21/images/68a2a1206146f43fd0353b154a829372"></td><td>National Wildlife Refuge</td></tr><tr valign="middle"><td><img src="http://glein.er.usgs.gov/arcgiswa/rest/services/seasketch_database_layers/MapServer/21/images/3ba87e274cb894e93e7bcf779d4adb3e"></td><td>National Park Service</td></tr><tr valign="middle"><td><img src="http://glein.er.usgs.gov/arcgiswa/rest/services/seasketch_database_layers/MapServer/21/images/bf13677a1b2e93f8cde7c40507a8dd70"></td><td>Other</td></tr></tbody></table>'};
	}
	/*else if(lyrname.indexOf('NHD Flowline MI')==0)
	    return {url:"",style:"",text:"Stream",html:'<table style="font-size:10px;"><tbody><tr valign="middle"><td><img src="http://192.168.100.16/arcgis/rest/services/NHD/nhdflowline_mi/MapServer/0/images/e6690d0c546388c3a6bf2a699ea280f7"></td><td>&lt;all other values&gt;</td></tr><tr valign="middle"><td><img src="http://192.168.100.16/arcgis/rest/services/NHD/nhdflowline_mi/MapServer/0/images/a3295344f701a19256386e1f903fc23c"></td><td>ArtificialPath</td></tr><tr valign="middle"><td><img src="http://192.168.100.16/arcgis/rest/services/NHD/nhdflowline_mi/MapServer/0/images/e98f7620f08a8433ae65479ffc6a3dd1"></td><td>CanalDitch</td></tr><tr valign="middle"><td><img src="http://192.168.100.16/arcgis/rest/services/NHD/nhdflowline_mi/MapServer/0/images/e32c755e2d14c7bdf7cc7fcb7c21d9ba"></td><td>Coastline</td></tr><tr valign="middle"><td><img src="http://192.168.100.16/arcgis/rest/services/NHD/nhdflowline_mi/MapServer/0/images/7d4f8d2084016dd84d1d398376d7f0c8"></td><td>Connector</td></tr><tr valign="middle"><td><img src="http://192.168.100.16/arcgis/rest/services/NHD/nhdflowline_mi/MapServer/0/images/8c03a6f7bae30ba5fe760f626d545e23"></td><td>Pipeline</td></tr><tr valign="middle"><td><img src="http://192.168.100.16/arcgis/rest/services/NHD/nhdflowline_mi/MapServer/0/images/6b1a4f1d65c750ed234e8041504755ea"></td><td>StreamRiver</td></tr><tr valign="middle"><td><img src="http://192.168.100.16/arcgis/rest/services/NHD/nhdflowline_mi/MapServer/0/images/0ca8dd73cd22f4ef9168fe608344b1a7"></td><td>Underground Conduit</td></tr></tbody></table></td></tr></tbody></table>'};*/
	return null;
    });
    $('.glfc-button').click(function(){
	if($(this).isEnabled()==false)return;
	var id=$(this).attr('id');
	if($(this).hasClass('no-toggle')){
	    switch(id){
		case "btn_clr_flags":
		    $('#btn_clr_flags').addClass('disabled');
		    if(GLIN.GIS.Viewer.RemoveUserMarkersById("flag_marker")){
			flagCnt=0;
			isGPRunable();
		    }
		break;
		case "btn_clr_barriers":
		    $('#btn_clr_barriers').addClass('disabled');
		    if(startPnt!=null)GLIN.GIS.Viewer.RemoveUserMarker(startPnt);
		    if(GLIN.GIS.Viewer.RemoveUserMarkersById("barrier_marker"))
			barrierCnt=0;
		    flagCnt=0;
		    if(Result!=null){
			GLIN.GIS.Viewer.DestroyUserPopup(Result.popup);
			Result=null;
		    }
		    isGPRunable();
		break;
		case "btn_tracing_run":
		    clear();
		    submitGPJob();
		break;
		case "btn_clr":
		    //GLIN.GIS.Viewer.RemoveAllESRIGeometries();
		    $('#btn_clr').addClass('disabled');	
		    clear();
		break;
	        case "btn_switch_treatment":
		    GLIN.GIS.Viewer.RemoveMapPopup(null);
		    GLIN.GIS.Viewer.ToggleLayerVisibility('Treatment');
		    ui.ShowLeftPane("Themes");
		break;
	    }
	}
    });
    ui.OnSelectionCleaned(function(){
	$('#btn_clr').addClass('disabled');	
	clear();
    });
    ui.OnCustomButtonClicked(function(id){
	ui.ShowLeftPane("Themes");
	switch(id){
	    case 'btn_flag':
		return "flag_marker";    
	    break;
	    case 'btn_barrier':
		return "barrier_marker";
	    break;
	    case 'btn_iden_stream':
                $('#btn_iden').addClass('sel');
		$('.btn_iden_clone').addClass('sel');
		GLIN.GIS.Viewer.SetSelectedLayer("Flowline",20);
		//ui.ShowLeftPane("Themes");
		//$("[name='rd_lyrsel'][value='Flowline']").attr("checked", true);
		//$("[name='rd_lyrsel']").iCheck('update');
		return 'select_by_point';
	    break;   
	}
    });
    ui.OnIdentifyToolCloneSelected(function(){
	if(GLIN.GIS.Viewer.GetSelectedLayer()!='Flowline')$('.btn_iden_clone').removeClass('sel');
    });
    GLIN.GIS.Viewer.SetUIHandler(ui);
    //GLIN.GIS.Viewer.Load('map','google',new OpenLayers.LonLat(-82.2,44.5),5,apiKey);
    GLIN.GIS.Viewer.Load('map',null,new OpenLayers.LonLat(-82.2,44.5),5,apiKey);
    //GLIN.GIS.Viewer.AddUserMarkerControl('flag_marker','icons/marker-blue.png',"<div style='padding-top:8px;'><div><button class='glfc_rm_flag' style='width:160px;height:40px;font-size:smaller !important;'></button></div><div><button class='glfc_dis_flag' style='width:160px;height:40px;font-size:smaller !important;'></button></div></div>");
    //GLIN.GIS.Viewer.AddUserMarkerControl('barrier_marker','icons/marker-red.png',"<div style='padding-top:8px;'><div><button class='glfc_rm_bar' style='width:180px;height:40px;font-size:smaller !important;'></button></div><div><button class='glfc_dis_bar' style='width:180px;height:40px;font-size:smaller !important;'></button></div></div>");
    //var clusterId=GLIN.GIS.Viewer.AddUserMarkerClusterControl('icons/marker-red.png',"<div style='padding-top:8px;'><div><button class='glfc_rm_bar' style='width:180px;height:40px;font-size:smaller !important;'></button></div><div><button class='glfc_dis_bar' style='width:180px;height:40px;font-size:smaller !important;'></button></div></div>");
    var markerCtlId=null;
    $.get("barriers.json",
	function(data){
	    if(data!=null&&data.length>0){
		populateSearch(data);   
		var i=0;
		var cluster={"data":data,"epsg":"EPSG:4269","icon":'icons/shield.png',"hicon":'icons/shield-highlight.png',"iconWidth":32,"iconWHeight":32,"featureClickedHandler":function(ftr){
		    var tb="<span></span>";
		    $('[name="rd_trac"][value="TRACE_UPSTREAM"]').prop('checked','checked');
		    if(ftr.mybag!=null){
			tb='<table class="popupt"><tbody>';
			tb=tb+"<tr><td>Name</td><td>"+ftr.mybag.name+"</td></tr>";
			tb=tb+"<tr><td>Water Body</td><td>"+ftr.mybag.waterbody+"</td></tr>";
			tb=tb+"<tr><td>Last Inspection Date</td><td>"+ftr.mybag.inspdate+"</td></tr>";
			
			tb=tb+"<tr><td>Protected Upstream Distance</td><td>"+getDisDisplay(ftr.mybag.distance)+"</td></tr>";
			if(!isChecked(ftr.mybag.id)){
			    if(!isAdj(ftr.mybag.id,ftr.mybag.ub.split("|")))
				clear();
			    if(ftr.mybag.distance<THRESHOLD&&!isWMSCache){
			        $.get(cacheUrl+ftr.mybag.id,function(data){
			            if(data!=null)
					var style=new OpenLayers.Style({
					    "strokeWidth": 3,
  					    "strokeColor": "#d95f02"//"#22b14c",
					});
				        GLIN.GIS.Viewer.AddUserWKTGeometries(data.line.replace(" ZM ",""),data.EPSG,style,"BarriersCache");
					GLIN.GIS.Viewer.ZoomToExtent(GLIN.GIS.Viewer.GetUserVectorDataExtent(),
								     GLIN.GIS.Viewer.GetMapProjectionCode(true));
				 },
			         "json"
			        );
			    }else{
				if(!isWMSCache){
			            GLIN.GIS.Viewer.RemoveAllESRIGeometries();
				    isWMSCache=true;
				}else
				    GLIN.GIS.Viewer.RemoveUserWMSLayer(cachewms);
				cachewms=GLIN.GIS.Viewer.AddUserWMSLayer("Cached Upstream",cacheWMSUrl,cacheLyrId,buildFeatureIdList(ftr.mybag.id),null,null);
				GLIN.GIS.Viewer.zoomMapTo(8);
		            }
			    insert(ftr.mybag.id,ftr.mybag.ub,ftr.mybag.distance);
			    $("#dm_dist").text(getDistance());
			}
			tb=tb+"<tr><td>Overall Upstream Distance</td><td id='dm_dist'>"+getDisDisplay(getDistance())+"</td></tr>";
			tb=tb+"</tbody></table>";
		    }
		    return tb; 
		}};
		markerCtlId=GLIN.GIS.Viewer.AddUserMarkerControl(null,cluster);
		var gphtml="<div style='padding-top:8px;'><div><button class='glfc_rm_bar' style='width:180px;height:40px;font-size:smaller !important;'></button></div><div><button class='glfc_dis_bar' style='width:180px;height:40px;font-size:smaller !important;'></button></div></div>";
		var gp={"id":"barrier_marker","icon":"icons/marker-red.png","html":gphtml};
		gp.FormatPopupText=function(ftr){
		    if(ftr==startPnt&&Result!=null)return Result.html+"<div style='padding-top:8px;'><div><button class='glfc_rm_bar' style='width:180px;height:40px;font-size:smaller !important;'></button></div></div>";
		    else return null;
		};
		GLIN.GIS.Viewer.AddUserMarkerGroup(gp);
		GLIN.GIS.Viewer.ActivateTool(markerCtlId);
		GLIN.GIS.Viewer.SetDefaultTool(markerCtlId);
		 $.get("treatments.json",
        	 	function(data){
            		    GLIN.GIS.Viewer.AddUserMarkerGroup({"id":"Treatment","usrCtrl":true,"icon":"icons/treatment.png","meta":"http://www.glfc.org/sealamp/gis/","html":""});
            		    if(data!=null&&data.length>0){
                	    var i=0;
                	    var ftrs=[];
                	    for(;i<data.length;++i)
                    		ftrs.push(GLIN.GIS.Viewer.BuildUserMarker("Treatment",data[i].lon,data[i].lat,"icons/treatment.png",32,32,"EPSG:4269",{"sname":data[i].sname,"years":data[i].years}));
                	    GLIN.GIS.Viewer.AddMarkers2Group("Treatment",ftrs,false,"icons/treatment.png",function(data){
                    	    	return "<p style='font-size:12px;font-weight:bold;'>Treatment History</p><table class='popupt'  style='width:300px;font-size:12px;'><tr><td style='width:40%;'>Stream Name:</td><td>"+data.sname+"</td></tr><tr><td>Years:</td><td>"+data.years+"</td></tr></table>";
                	    });
                	    if(ui.AddNewLayer({"name":"Treatment","meta":"http://www.glfc.org/sealamp/gis/"},true,true))
                    		$('#sp_usr_lyr_txt').text("Sea Lamprey Control Layers");
            		    }
        	        },"json"
    		);
	    }
	},"json"
    );
    /*$.get("treatments.json",
        function(data){
	    GLIN.GIS.Viewer.AddUserMarkerGroup({"id":"Treatment","usrCtrl":true,"icon":"icons/treatment.png","meta":"http://www.glfc.org/sealamp/gis/","html":""});
            if(data!=null&&data.length>0){
	        var i=0;
		var ftrs=[];
		for(;i<data.length;++i)
		    ftrs.push(GLIN.GIS.Viewer.BuildUserMarker("Treatment",data[i].lon,data[i].lat,"icons/treatment.png",32,32,"EPSG:4269",{"sname":data[i].sname,"years":data[i].years}));
		GLIN.GIS.Viewer.AddMarkers2Group("Treatment",ftrs,false,"icons/treatment.png",function(data){
		    return "<p style='font-size:12px;font-weight:bold;'>Treatment History</p><table class='popupt'  style='width:300px;font-size:12px;'><tr><td style='width:40%;'>Stream Name:</td><td>"+data.sname+"</td></tr><tr><td>Years:</td><td>"+data.years+"</td></tr></table>";
		});
		if(ui.AddNewLayer({"name":"Treatment","meta":"http://www.glfc.org/sealamp/gis/"},true,true))
		    $('#sp_usr_lyr_txt').text("LCM Layers");
	    }
	},"json"
    );*/
    GLIN.GIS.Viewer.OnUserMarkerAdded(function(id){
	if(id=='flag_marker'){$('#btn_clr_flags').removeClass('disabled');flagCnt++;isGPRunable();}
	else if(id=='barrier_marker'){$('#btn_clr_barriers').removeClass('disabled');barrierCnt++}
    });
    /*GLIN.GIS.Viewer.OnUserVectorClicked(function(id,ftr,xy){
	if(id=="BarriersCache"){
	    var epsg=GLIN.GIS.Viewer.GetMapProjectionCode(false);
	    var size=GLIN.GIS.Viewer.GetMapSizeInPixel();
	    var lonlat=GLIN.GIS.Viewer.GetLonLatfromPixel(xy.x,xy.y);
	    var extent=GLIN.GIS.Viewer.GetMapExtent();
	    $.get(
                    navigator.appName=='Microsoft Internet Explorer'?'glc-arc.php':'http://geo.glc.org/arcgis/rest/services/stream/gl_streamlines/MapServer/identify',
                    {
                    "geometryType":'esriGeometryPoint',
                    "geometry":'{"x":'+lonlat.lon+',"y":'+lonlat.lat+',"spatialReference":{"wkid":'+epsg+'}}',
                    "sr":epsg,
                    "layers":'all:0',
                    "tolerance":1,
                    "mapExtent":'{"xmin":'+extent.left+',"ymin":'+extent.bottom+',"xmax":'+extent.right+',"ymax":'+extent.top+'}',
                    "imageDisplay":size.width+','+size.height+','+size.DPI,
                    "returnGeometry":false,
                    "f":'json'
                    },
                    function(objs){
			console.log(objs.results);
		    },"json"
	    );
	}
    });*/
    GLIN.GIS.Viewer.OnLayerSelected(function(lyrname){
	if(lyrname=="Flowline"){
	    if(GLIN.GIS.Viewer.GetCurrentToolName()=='select_by_point'&&!$('.btn_iden_clone').hasClass('sel'))
	        $('.btn_iden_clone').addClass('sel');
	}else{
	    $('.btn_iden_clone').removeClass('sel')
	}
    });
    GLIN.GIS.Viewer.OnUserPopupDisplayed(function(id,ftr){
	/*$('.glfc_rm_flag').button({icons:{primary:"ui-icon-close"},label:"Remove This Flag"}).click(function(){
	    if(GLIN.GIS.Viewer.RemoveUserMarker(id,ftr)&&--flagCnt==0){
		$('#btn_clr_flags').addClass('disabled');
		isGPRunable();
	    }
	});
	$('.glfc_dis_flag').button({icons:{primary:"ui-icon-locked"},label:"Disable This Flag"}).click(function(){
	});*/
        //if(id=='Treatment'){
	//    $('#tm_sname').text(ftr.data.sname);
	//    $('#tm_years').text(ftr.data.years);
	//    return;
	//}
	if(id=='BarriersCache'){
	    
	    return;
	}
	$('.glfc_rm_bar').button({icons:{primary:"ui-icon-close"},label:"Remove This Barrier"}).click(function(){
	    if(ftr.isSP){
		/*if(Result!=null){
                        GLIN.GIS.Viewer.DestroyUserPopup(Result.popup);
                        Result=null;
                }*/
		GLIN.GIS.Viewer.RemoveUserMarker(startPnt,false);
		startPnt=null;
		flagCnt=0;
		isGPRunable();
	    }
	    else if(ftr==startPnt){
		ftr=startPnt.udFTR;
		GLIN.GIS.Viewer.RemoveUserMarker(startPnt,false);
		startPnt=null;
		flagCnt=0;
		isGPRunable();
	    }
	    if(GLIN.GIS.Viewer.RemoveUserMarkerById(ftr)&&--barrierCnt==0)
		$('#btn_clr_barriers').addClass('disabled');	
	});
	if(ftr!=startPnt){
	    $('.glfc_dis_bar').button({icons:{primary:"ui-icon-locked"},label:"Mark As Start Point"}).click(function(){
	        if(startPnt!=null){
		    startPnt.udFTR.isSP=null;
		    startPnt.udFTR=null;
		    GLIN.GIS.Viewer.RemoveUserMarker(startPnt,false);
		    startPnt=null;
		}
	        ftr.isSP=true;
	        startPnt=GLIN.GIS.Viewer.AddUserMarker("barrier_marker",ftr.geometry.x,ftr.geometry.y,"icons/marker-blue.png",32,32);
		startPnt.udFTR=ftr;
		startPnt.popup=ftr.popup;
		flagCnt=1;
		isGPRunable();
		GLIN.GIS.Viewer.RemoveMapPopup(startPnt.popup);
		//ftr.popup.destroy();
		//ftr.popup=null;
	    });
	    $('.glfc_dis_bar').show();
	}else $('.glfc_dis_bar').hide();	
    });
    ui.OnFormatPopupTextKeyFilter(function(lyrname){
	if(lyrname=='Flowline'){
	    return ["GNIS_Name","ReachCode","FType","FDate"];
	}
	return null;
    });
    if(incominglyr!=null)
	ui.AddNewLayer(incominglyr);
    var radioClk=function(){
	if('dv_chup'==this.id)
	    $('[name="rd_trac"][value="TRACE_UPSTREAM"]').prop('checked','checked');
	else
	    $('[name="rd_trac"][value="TRACE_DOWNSTREAM"]').prop('checked','checked');    
    };
    $('#dv_chup').click(radioClk);
    $('#dv_chdown').click(radioClk);
    ui.ShowLeftPane("Description");
    ui.SetToolHighlight(1);
    //$('#lnk_totheme').click(function(){ui.SetToolHighlight(1);});
});
