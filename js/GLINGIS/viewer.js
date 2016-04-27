//Proj4js.defs["EPSG:4269"] = "+proj=longlat +ellps=GRS80 +datum=NAD83 +no_defs";
Proj4js.defs["EPSG:3175"]="+proj=aea +lat_1=42.122774 +lat_2=49.01518 +lat_0=45.568977 +lon_0=-83.248627 +x_0=1000000 +y_0=1000000 +ellps=GRS80 +datum=NAD83 +units=m +no_defs";
Proj4js.defs["EPSG:4267"]="+proj=longlat +ellps=clrk66 +datum=NAD27 +no_defs"
Proj4js.defs["EPSG:3857"]= "+title=GoogleMercator +proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +no_defs";
Proj4js.defs["EPSG:42303"] = "+proj=aea +lat_1=29.5 +lat_2=45.5 +lat_0=23 +lon_0=-96 +x_0=0 +y_0=0 +datum=NAD83 +units=m +no_defs";
Proj4js.defs["EPSG:4269"] = "+proj=longlat +ellps=GRS80 +datum=NAD83 +no_defs";
GLIN.GIS.Viewer=(function(){
    OpenLayers.Control.AddMarker = OpenLayers.Class(OpenLayers.Control, {                
        layer:null,
	layers:null,
	handlers:null,
	callbacks:null,
	iselected:false,
	iseditting:false,
	iszoomin:false,
	groups:{},
	//icon:null,
	id:null,
	gid:null,
	imgurl:null,
        ftr:null,
	popup:null,
	html:null,
	clusterFtrClicked:null,
	transitFtr:null,
	transitUid:null,
	defaultHandlerOptions: {
                    'single': true,
                    'double': false,
                    'pixelTolerance': 0,
                    'stopSingle': false,
                    'stopDouble': false
        },
	initLayer: function(layers) {
            if(OpenLayers.Util.isArray(layers)) {
                this.layers = layers;
                this.layer = new OpenLayers.Layer.Vector.RootContainer(
                    this.id + "_container", {
                    layers: layers
                    }
                );
            } else {
                this.layer = layers;
            }
        },
	initGroup:function(groups){
	    if(groups==null)return;
	    if(OpenLayers.Util.isArray(groups)){
		var i=0;
		for(;i<groups.length;++i)
		    this.groups[groups[i].id]=groups[i];
	    }else this.groups[groups.id]=groups;
	},
	initialize: function(options) {
                    this.handlerOptions = OpenLayers.Util.extend(
                        {}, this.defaultHandlerOptions
                    );
                    OpenLayers.Control.prototype.initialize.apply(
                        this, arguments
                    ); 
                    this.handler = new OpenLayers.Handler.Click(
                        this, {
                            'click': this.onClick,
                            'dblclick': this.onDblclick 
                        }, this.handlerOptions
                    );
		   // var size =new OpenLayers.Size(32,32);
		    this.imgurl=options.icon;
	    	    //this.icon=new OpenLayers.Icon(options.icon, size, new OpenLayers.Pixel(-(size.w/2), -size.h));
		    this.id=options.id;
		    this.initLayer(options.layer);
		    /*this.stylemap=new OpenLayers.StyleMap({
                        externalGraphic:options.icon, 
	                pointRadius: 16,
                        graphicZIndex:999
                    });*/
		    this.clusterFtrClicked=this.clusterftrclicked;
		    var callbacks={click:this.clickFeature};
		    this.callbacks=OpenLayers.Util.extend(callbacks,this.callbacks);
        	    this.handlers={
				feature: new OpenLayers.Handler.Feature(this,this.layer,this.callbacks,{geometryTypes:["OpenLayers.Geometry.Point","OpenLayers.Geometry.MultiLineString"]})
        	    };
		    this.layers[0].events.register(
                		"featureselected",this.layers[0], function(ftr){/*console.log(ftr);*/}
                //"featureunselected": onFeatureUnselect
            );
		    //this.layer.events.on({'featureselected':function(ftr){alert(ftr);}});
         },
	 activate:function(){
	     this.handlers.feature.activate();
	     return OpenLayers.Control.prototype.activate.apply(this,arguments);
	 },
	 deactivate:function(){
	     if(this.activate){
	         this.handlers.feature.deactivate();
		 this.iseditting=false;
	     }
	     return OpenLayers.Control.prototype.deactivate.apply(this,arguments);
	 },
	 setMap:function(map){
             this.handlers.feature.setMap(map);
             OpenLayers.Control.prototype.setMap.apply(this,arguments);
         },
	 addGroup:function(id,grp){
	     if(this.groups==null)this.groups={};
	     this.groups[id]=grp;
	 },
	 removeGroup:function(id){
	     this.groups[id]=null;
	 },
	 hasGroup:function(gid){
	     return this.groups[gid]!=null;
	 },
	 getVisibleGroups:function(){
	     var gps=[];
	     for(var g in this.groups)
		if(this.groups[g].usrCtrl&&this.groups[g].visible)gps.push({"name":g,"visible":true,"index":-1,"metalink":this.groups[g].meta,"opacity":100,"isVector":true});
	     gps.push({"name":"OpenLayers.Control.AddMarker.Cluster","visible":true,"index":-9999,"metalink":null,"opacity":100,"isVector":true,"usrCtl":false});
	     return gps;
	 },
	 isGroupVisible:function(gid){
	     return this.groups!=null&&this.groups[gid]!=null&&this.groups[gid].visible;
	 },
	 getGroupIcon:function(gid){
	     return this.groups[gid]!=null?this.groups[gid].icon:null;
	 },
	 startEdit:function(gid){
	     if(this.groups[gid]!=null){
	         this.iseditting=true;
	         this.gid=gid;
	     }
	 },
	 stopEdit:function(){
	     if(this.iseditting){
	         this.iseditting=false;
		 this.gid=null;
	     }
	 },
	 addFeatures:function(gid,ftrs,visible,icon,htmlHandler){
	     if(this.groups[gid]){
		this.groups[gid].visible=visible;
                this.groups[gid].icon=icon;
                this.groups[gid].FormatPopupText=htmlHandler;
                this.groups[gid].style=ftrs[0].style; 
		if(!visible){
                     var i=0;
                     for(;i<ftrs.length;++i)
                         ftrs[i].style='none';//.fillOpacity=0;//={"display":"none"};
                 }
		 this.layers[0].addFeatures(ftrs,null);
	     }
	 },
	 toggleVisibiltyByGroup:function(gid){
	     if(this.groups[gid]&&this.groups[gid].usrCtrl){
	         this.groups[gid].visible=!this.groups[gid].visible;
		 //var s={"display":this.groups[gid].visible?"block":"none"};
		 var s=this.groups[gid].visible?this.groups[gid].style:'none';//this.groups[gid].visible?1:0;
		 //var z=this.groups[gid].visible? this.groups[gid].zindex:-9999;
		 var i=0;
		 for(;i<this.layers[0].features.length;++i)
		     if(this.layers[0].features[i].uid==gid){
			 this.layers[0].features[i].style=s;//.fillOpacity=s;
			 //this.layers[0].features[i].style.graphicZIndex=z;
		     }
			 
		this.layers[0].redraw();
	     }
	 },
	 removeHighlightMarker:function(){
	     if(this.ftr!=null){
		 //this.ftr.popup.destroy();
		 this.layers[0].removeFeatures([this.ftr],null);
	     }
	 },
	 clickFeature:function(feature){
	     var cpopup=null;
	     if(feature.cluster!=null){
		if(feature.cluster.length>1){
		    var z=this.map.getNumZoomLevels();
		    if(z>this.map.getZoom()+1)z=this.map.getZoom()+1;
		    this.map.setCenter(new OpenLayers.LonLat(feature.geometry.x,feature.geometry.y),z);
		    this.iszoomin=true;
		   // this.iselected=true;
		    return;
		}else if(feature.cluster.length==1){
		    if(this.clusterFtrClicked!=null){
			this.removeHighlightMarker();
			var f=new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(feature.geometry.x,feature.geometry.y));
			f.uid=-1;
			f.style={
		    	    externalGraphic:this.imgurl,
		    	    graphicWidth:32,
			    graphicHeight:32
		    	    //graphicZIndex:999
			};
			this.layers[0].addFeatures([f],null);
			feature=feature.cluster[0];
		        var html=this.clusterFtrClicked(feature);
		        cpopup=new OpenLayers.Popup.FramedCloud(
                        		"clustermaker_popup", 
                       			new OpenLayers.LonLat(feature.geometry.x,feature.geometry.y),
                        		null,
                        		html,
                        		null,
                        		true,
					function(e){
					    viewerEvent.Invoke("Viewer_OnUserPopupClosing",feature.uid,feature);
					    this.popup=null;
					    this.map.removePopup(this); 
		        });
			f.popup=cpopup;
			this.ftr=f;
		    }
		    this.iszoomin=true;
		}
	     	else return;
	     }else if(feature.uid!=null&&feature.uid!=-1&&this.groups[feature.uid]!=null&&this.groups[feature.uid].usrCtrl&&this.groups[feature.uid].visible){
                var phtml=this.groups[feature.uid].FormatPopupText(feature.data); 
		cpopup=new OpenLayers.Popup.FramedCloud(
                                        feature.uid+"_popup",
                                        new OpenLayers.LonLat(feature.geometry.x,feature.geometry.y),
                                        null,
                                        phtml,
                                        null,
                                        true,
                                        function(e){
					    viewerEvent.Invoke("Viewer_OnUserPopupClosing",feature.uid,feature);
                                            this.popup=null;
                                            this.map.removePopup(this);
                 });
		 this.iszoomin=true;
             }
	     if(feature.popup!=null||cpopup!=null){
		 if(this.popup!=null)this.map.removePopup(this.popup);
		 var p=null;
		 if(feature.popup!=null){p=feature.popup;this.iselected=true;}
		 else p=cpopup;
		 if(cpopup==null&&feature.uid!=null&&this.groups[feature.uid]!=null&&this.groups[feature.uid].FormatPopupText!=null){
		     var phtml=this.groups[feature.uid].FormatPopupText(feature);
		     if(phtml!=null){
		         p=new OpenLayers.Popup.FramedCloud(
                                        feature.uid+"_popup",
                                        new OpenLayers.LonLat(feature.geometry.x,feature.geometry.y),
                                        null,
                                        phtml,
                                        null,
                                        true,
                                        function(e){
					    viewerEvent.Invoke("Viewer_OnUserPopupClosing",feature.uid,feature);
                                            this.popup=null;
                                            this.map.removePopup(this);
                         });
		         feature.popup1=p;
		     }
		 }
		 this.map.addPopup(p);
		 this.popup=p;
		 viewerEvent.Invoke("Viewer_OnUserPopupDisplayed",feature.uid,feature);
	     }
	     this.transitUid=feature.uid;
	     this.transitFtr=feature;
	 },
         onClick: function(evt){
		if(this.iszoomin){this.iszoomin=false;return;}
		if(!this.iseditting){
		    var geom=this.transitFtr!=null?this.transitFtr.geometry.clone():null;
		    viewerEvent.Invoke("Viewer_OnUserVectorClicked",this.transitUid,geom,{"x":evt.xy.x,"y":evt.xy.y});
		    this.transitFtr=null;
		    this.transitUid=null;
		    return;
		}
		if(this.iselected){this.iselected=false;return;}
		var xy=this.map.getLonLatFromPixel({x:evt.xy.x,y:evt.xy.y});
		/*var data={};
		data.externalGraphic=this.groups.gid.icon;
		data.graphicHeight=16;
		data.graphicWidth=16;*/
		var f=new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(xy.lon,xy.lat));
		f.uid=this.gid;
		f.style={
		    externalGraphic:this.groups[this.gid].icon,
		    pointRadius:12,
		    graphicZIndex:999
		};
		var opt=null;
		//if(this.iscluster)opt={"silent":true};
		this.layers[0].addFeatures([f],opt);
		//if(this.iscluster)
		//    this.layer.strategies[0].cluster({"recluster":true});
		if(this.groups[this.gid].html!=null){
		    f.popup=new OpenLayers.Popup.FramedCloud(
                        		"usermaker_popup", 
                       			xy,
                        		null,
                        		this.groups[this.gid].html,
                        		null,
                        		true,
					function(e){
					   this.popup=null;
					   this.map.removePopup(this); 
					});
		   // f.popup.autoSize=false;
		   // f.popup.
		}
		viewerEvent.Invoke("Viewer_OnUserMarkerAdded",this.gid);
	 },
	 onDblclick: function(evt){},
	 CLASS_NAME: "OpenLayers.Control.AddMarker"
    });
    OpenLayers.Control.Select = OpenLayers.Class(OpenLayers.Control,{
        type: OpenLayers.Control.TYPE_TOOL,
	url:null,
	lyrname:null,
	layer:null,
	callback:null,
	returnformat:null,
	crs:null,
	style:null,
	maxcount:50,
	draw: function(){
            this.handler = new OpenLayers.Handler.Box( this,{done: this.select});
        },
	select:function(position){
	    if(wms[this.lyrname].is_arc_rest)
		this._select_1(this,position,null);
	    else{
	        if(wms[this.lyrname].queryfields.length>0)
		    this._select(this,position,null);
	        else
		    wrapper4DescribeFeature(this.url,this.layer.params.LAYERS,this,position,this._select);
	    }
	},
	_select_1: function(that,position,attrs){
            arcgisRestIdentifyHandler(that,position,that.maxcount);
	},
   	_select: function(that,position,attrs){
            if(position instanceof OpenLayers.Bounds){
                var bound=null;
		//var size=this.map.getSize();
                var minXY = that.map.getLonLatFromPixel({
                        x: position.left,
                        y: position.bottom
                });
                var maxXY = that.map.getLonLatFromPixel({
                        x: position.right,
                        y: position.top
                });
                bound=new OpenLayers.Bounds(minXY.lon, minXY.lat, maxXY.lon, maxXY.lat);
		/*var params = OpenLayers.Util.extend({
                        REQUEST: "GetFeatureInfo",
                        EXCEPTIONS: "application/vnd.ogc.se_xml",
                        BBOX: bound,
                        SERVICE: "WMS",
			VERSION:this.layer.params.VERSION,
                        INFO_FORMAT: this.returnformat,
                        QUERY_LAYERS: this.layer.params.LAYERS,
                        FEATURE_COUNT: 50,
                        Layers: this.layer.params.LAYERS,
                        WIDTH: size.w,
                        HEIGHT: size.h,
                        FORMAT: 'image/png',
                        STYLES: this.layer.params.STYLES
                        //srs: this.layer.params.SRS
			},
		    (parseFloat(this.layer.params.VERSION>=1.3))?
		    {
			CRS: this.layer.params.SRS
		    }:
		    {
			SRS: this.layer.params.SRS
		    }	
		);*/
		var flds='';
		if(wms[that.lyrname].queryfields!=null&&wms[that.lyrname].queryfields.length>0)
		    for(var i=0,len=wms[that.lyrname].queryfields.length;i<len;++i)
			flds=flds+wms[that.lyrname].queryfields[i]['field']+',';
		//flds=flds+'geoid';
		if(flds==''&&attrs!=null&&attrs.length>0){
			var f=attrs.split(',');
			if(f!=null&&f.length>0){
			    wms[that.lyrname].queryfields=Array();
			    for(var i=0;i<f.length;++i)
				if(f[i]!=null&&f[i].length>0)
				    wms[that.lyrname].queryfields.push({"field":f[i],"display":f[i]});
			}
			flds=attrs;
		    }
		//else flds=flds.substring(0,flds.length-1);
		var bbox=bound.clone().transform(map.getProjectionObject(),new OpenLayers.Projection(that.crs));
                //var ll=OpenLayers.Projection.transform({'x':bound.left,'y':bound.bottom},map.getProjectionObject(),new OpenLayers.Projection(this.crs));
		//console.log(bound.transform(map.getProjectionObject(),new OpenLayers.Projection(this.crs)).toBBOX(6,true));
	  	var params={
			WFS:1,
			SERVICE:"WFS",
			REQUEST:"GetFeature",
			VERSION:"1.1.0",
			BBOX:bound.transform(map.getProjectionObject(),new OpenLayers.Projection(that.crs)).toBBOX(6,!wms[that.lyrname].is_axis_reversed),//bound.toString()+','+'EPSG:3857',//
			TYPENAME:that.layer.params.LAYERS,
			SRSNAME:that.crs,//that.layer.params.SRS
			//PROPERTYNAME:flds,
			MAXFEATURES:that.maxcount,
			OUTPUTFORMAT:"json"
		};
		if(flds!=null&&flds.length>0)
		    params.PROPERTYNAME=flds.substring(0,flds.length-1);
		var fn=function(response){
		    
		    if(that.callback!=null){
			var txt=response.status==200?response.responseText:null;
			that.callback(txt,bbox,params.PROPERTYNAME,that.maxcount);
		    }
		    layout.HideWaitScreen();
		};
		GLIN.GIS.Viewer.ActivateTool('navigate');
		layout.SetPanAsDefaultButton();
		layout.ShowWaitScreen();
		OpenLayers.Request.GET({url:that.url,params:OpenLayers.Util.upperCaseObject(params),callback:fn,scope:that});
		
     	    }
            
        },
	setLayerHandler:function(url,name,lyr,handler,format,crs,count){
	    this.url=url;
	    this.lyrname=name;
	    this.layer=lyr;
	    this.callback=handler;
	    this.returnformat=format;
	    this.crs=crs;
	    if(count>0)this.maxcount=count;
	},
        CLASS_NAME: "OpenLayers.Control.Select"
    });
    OpenLayers.Control.SelectByPolygon = OpenLayers.Class(OpenLayers.Control,{
        type: OpenLayers.Control.TYPE_TOOL,
	url:null,
	lyrname:null,
	layer:null,
	callback:null,
	returnformat:null,
	crs:null,
	style:null,
	maxcount:50,
	draw: function(){
            this.handler = new OpenLayers.Handler.Polygon(this,{done: this.select});
        },
        select:function(position){
	    if(wms[this.lyrname].is_arc_rest)
		this._select_1(this,position,null);
	    else{
	        if(wms[this.lyrname].queryfields.length>0)
		    this._select(this,position,null);
	        else
		    wrapper4DescribeFeature(this.url,this.layer.params.LAYERS,this,position,this._select);
	    }
	},
	_select_1: function(that,poly,attrs){
	    arcgisRestIdentifyHandler(that,poly,that.maxcount);
	},
        _select: function(that,poly,attrs){
	    if(poly instanceof OpenLayers.Geometry.Polygon){
               	var flds='';
		if(wms[that.lyrname].queryfields!=null&&wms[that.lyrname].queryfields.length>0)
		    for(var i=0,len=wms[that.lyrname].queryfields.length;i<len;++i)
			flds=flds+wms[that.lyrname].queryfields[i]['field']+',';
		if(flds==''&&attrs!=null&&attrs.length>0){
			var f=attrs.split(',');
			if(f!=null&&f.length>0){
			    wms[that.lyrname].queryfields=Array();
			    for(var i=0;i<f.length;++i)
				if(f[i]!=null&&f[i].length>0)
				    wms[that.lyrname].queryfields.push({"field":f[i],"display":f[i]});
			}
			flds=attrs;
		}
		var poly1=poly.clone().transform(map.getProjectionObject(),new OpenLayers.Projection(that.crs));
		var params={
			WFS:1,
			SERVICE:"WFS",
			REQUEST:"GetFeature",
			VERSION:"1.0.0",
			//BBOX:poly.transform(map.getProjectionObject(),new OpenLayers.Projection(this.crs)).getBounds().toBBOX(6,true),//bound.toString()+','+'EPSG:3857',//
			"CQL_FILTER":"INTERSECTS(the_geom,"+poly1.toString()+")",			
			TYPENAME:that.layer.params.LAYERS,
			SRSNAME:that.crs,
			//PROPERTYNAME:flds,
			MAXFEATURES:that.maxcount,
			OUTPUTFORMAT:"json"
	        };
	        if(flds!=null&&flds.length>0)
		    params.PROPERTYNAME=flds.substring(0,flds.length-1);
	        var fn=function(response){
		    if(that.callback!=null){
			var txt=response.status==200?response.responseText:null;
			if(flds.length>0)
			    that.callback(txt,poly1,params.PROPERTYNAME,that.maxcount);
			else
			    wrapper4DescribeFeature(that.callback,txt,poly1,that.layer.params.LAYERS,that.maxcount);
		    }
		    layout.HideWaitScreen();
		};
	        GLIN.GIS.Viewer.ActivateTool('navigate');
		layout.SetPanAsDefaultButton();
	        layout.ShowWaitScreen();
	        OpenLayers.Request.GET({url:that.url,params:OpenLayers.Util.upperCaseObject(params),callback:fn,scope:that});
	    }
        },
        setLayerHandler:function(url,name,lyr,handler,format,crs,count){
	    this.url=url;
	    this.lyrname=name;
	    this.layer=lyr;
	    this.callback=handler;
	    this.returnformat=format;
	    this.crs=crs;
	    if(count>0)this.maxcount=count;
	},
        CLASS_NAME: "OpenLayers.Control.SelectByPolygon"
    });
    OpenLayers.Control.SelectByPoint = OpenLayers.Class(OpenLayers.Control,{
        type: OpenLayers.Control.TYPE_TOOL,
	url:null,
	lyrname:null,
	layer:null,
	callback:null,
	returnformat:'text/html',
	crs:null,
	styles:null,
	maxcount:5,
	
	draw: function(){
            this.handler = new OpenLayers.Handler.Point(this,{done: this.select});
        },
        select:function(position,bound){
	    if(wms[this.lyrname].is_arc_rest)
		this._select_1(this,position,bound);
	    else{
	        if(wms[this.lyrname].queryfields.length>0)
		    this._select(this,position,null,bound);
	        else
		    wrapper4DescribeFeature(this.url,this.layer.params.LAYERS,this,position,this._select);
	    }
	},
	_select_1:function(that,position){
	    if(position instanceof OpenLayers.Geometry.Point){
		var ll=new OpenLayers.LonLat(position.x,position.y);
		var bbox=map.getExtent();
		$.get(
		    (navigator.appName=='Microsoft Internet Explorer'||isSSL)&&wms[that.lyrname].proxy!=''?wms[that.lyrname].proxy:wms[that.lyrname].url+'/identify',
		    {
			"layers":'all:'+wms[that.lyrname].id,
			"geometryType":'esriGeometryPoint',
			"geometry":'{"x":'+ll.lon+',"y":'+ll.lat+',"spatialReference":{"wkid":3857}}',
			"tolerance":2,
			"mapExtent":'{"xmin":'+bbox.left+',"ymin":'+bbox.bottom+',"xmax":'+bbox.right+',"ymax":'+bbox.top+'}',
			"imageDisplay":map.getSize().w+','+map.getSize().h+','+OpenLayers.DOTS_PER_INCH,
			"returnGeometry":false,
			"sr":3857,
			"f":'json'
			//"maxRecordCount":5
		    },
		    function(data){
			if(data.results!=null&&data.results.length>0){
			    var re={"name":data.results[0].layerId,"features":Array()};
			    for(var i=0;i<data.results.length;++i){
				attr={};
				attr[data.results[i].displayFieldName]=data.results[i].value;
				for(var k in data.results[i].attributes)
				    if(k=='OBJECTID')attr['fid']=data.results[i].attributes[k];
				    else attr[k]=data.results[i].attributes[k];
			        re.features.push(attr);
				//add2MarkerLayer(new OpenLayers.Marker(new OpenLayers.LonLat(position.x,position.y),markerIcon.clone()));
			    }
			    removeMarkers();
			    add2MarkerLayer(new OpenLayers.Marker(new OpenLayers.LonLat(position.x,position.y),markerIcon.clone()));
			    that.callback(re,position,that.lyrname);
			}
		    },
		    'json'
		);
	    }
	},
        _select:function(that,position,attrs,bound){
		if(position instanceof OpenLayers.Geometry.Point){
		    var flds='';
		    if(wms[that.lyrname].queryfields!=null&&wms[that.lyrname].queryfields.length>0){
		        for(var i=0,len=wms[that.lyrname].queryfields.length;i<len;++i)
			    flds=flds+wms[that.lyrname].queryfields[i]['field']+',';
			flds=flds.substring(0,flds.length-1);
		    }
		    if(flds==''&&attrs!=null&&attrs.length>0){
			var f=attrs.split(',');
			if(f!=null&&f.length>0){
			    wms[that.lyrname].queryfields=Array();
			    for(var i=0;i<f.length;++i)
				if(f[i]!=null&&f[i].length>0)
				    wms[that.lyrname].queryfields.push({"field":f[i],"display":f[i]});
			}
			flds=attrs;
		    }
		    var ll=new OpenLayers.LonLat(position.x,position.y);
		    var pnt=map.getPixelFromLonLat(ll);
//console.log(map.getLayerPxFromLonLat(ll));
//console.log(map.getPixelFromLonLat(ll));
		    var bbox=null;
		    if(bound==null)
			bbox=map.getExtent().toBBOX(null,that.layer.reverseAxisOrder());
		    else
			bbox=bound.toBBOX(null,that.layer.reverseAxisOrder());
		    var params=OpenLayers.Util.extend({
			service: 'WMS',
			wms:1,
            		version: that.layer.params.VERSION,
            		request: 'GetFeatureInfo',
			query_layers:that.layer.params.LAYERS,
			layers:that.layer.params.LAYERS,
            		exceptions: 'application/vnd.ogc.se_xml',
            		bbox: bbox,
            		feature_count: that.maxcount,
            		height:map.getSize().h,
            		width: map.getSize().w,
			styles:that.styles,
            		info_format: that.returnformat,
			format:that.returnformat,
			buffer:0,
			propertyname:flds
		    },(parseFloat(that.layer.params.VERSION) >= 1.3) ?
            	       {
                	   crs: "EPSG:3857",
                	   i: parseInt(pnt.x),
                	   j: parseInt(pnt.y)
            	       }:{
                	   srs: "EPSG:3857",
                	   x: parseInt(pnt.x),
                	   y: parseInt(pnt.y)
            	       }
		    );
		    var fn=function(response){
		        removeMarkers();
		        if(that.callback!=null){
			    add2MarkerLayer(new OpenLayers.Marker(new OpenLayers.LonLat(position.x,position.y),markerIcon.clone()));
		            var txt=response.status==200?response.responseText:null;
			    that.callback(txt,position,that.lyrname);
		        }
		        //layout.HideWaitScreen();
		    };
		    
		    //layout.ShowWaitScreen();
		    OpenLayers.Request.GET({url:that.url,params:OpenLayers.Util.upperCaseObject(params),callback:fn,scope:that});
		    
		}
	},
        setLayerHandler:function(url,name,lyr,handler,format,crs,styles,count){
	    this.url=url;
	    this.lyrname=name;
	    this.layer=lyr;
	    this.callback=handler;
	    this.returnformat=format;
	    this.crs=crs;
	    this.styles=styles;
	    if(count>0)this.maxcount=count;
	},
        CLASS_NAME: "OpenLayers.Control.SelectByPoint"
    });
    OpenLayers.Control.Click = OpenLayers.Class(OpenLayers.Control, {                
                defaultHandlerOptions: {
                    'single': true,
                    'double': false,
                    'pixelTolerance': 0,
                    'stopSingle': false,
                    'stopDouble': false
                },

                initialize: function(options) {
                    this.handlerOptions = OpenLayers.Util.extend(
                        {}, this.defaultHandlerOptions
                    );
                    OpenLayers.Control.prototype.initialize.apply(
                        this, arguments
                    ); 
                    this.handler = new OpenLayers.Handler.Click(
                        this, {
                            'click': this.onClick,
                            'dblclick': this.onDblclick 
                        }, this.handlerOptions
                    );
                }, 

                onClick: function(evt) {
                    var xy=this.map.getLonLatFromPixel({x:evt.xy.x,y:evt.xy.y});

                    controls["select_by_point"].select(new OpenLayers.Geometry.Point(xy.lon,xy.lat),null);
			//map.calculateBounds(xy,map.getResolutionForZoom(map.numZoomLevels-3)));
                },

                onDblclick: function(evt) {  
                    
                }   

    });
    var unitFactors=new Array();
    var root=null;
    var isSSL=false;
    var map=null;
    var options = {
        projection: new OpenLayers.Projection("EPSG:3857"),
	displayProjection: new OpenLayers.Projection("EPSG:4326"),
        units: "m",
        //maxResolution:156543.0339,
	//numZoomLevels:5,
        maxExtent: new OpenLayers.Bounds(-20037508.34, -20037508.34, 20037508.34, 20037508.34),
	minZoomLevel:4,
	//restrictedExtent: new OpenLayers.Bounds(-11405660.225419,4420440.1325654,-6895264.0609952,6665854.2751582),
        //autoUpdateSize:true,
	fallThrough:true,
	zoomMethod: null
    };
    var CanvasName="DRAWSHP4Viewer#4gewgw@";
    var CanvasWFSName="WFSVector4Viewer#4gewgw@";
    var SelectionName="SelectionWMS4Viewer#4gewgw@";
    var markerName="Marker4Viewer#4gewgw@";
    var markerName1="Marker4Viewer1#4gewgw@";
    var userLineName="Line4Viewer#4gewgw@";
    var markerName2="Marker4ViewerCluster#4gewgw@";
    var wms=new Array();
    var baseLayers=new Array();
    var baseLayersCount=10;
    var userLayersCount=0;
    var controls=new Array();
    var currentTool=null;
    var currentToolName=null;
    var oldTool=null;
    var curLyr=null;
    var fullExtent=null;
    var originalCenter=null;
    var originalZoomLevel=0;
    var selectionLyr=null;
    var markerLyr=null;
    var markerLyr1=null;
    var wfsLyr=null;
    var popup=null;
    var markerIcon=null;
    var featureStyle=new OpenLayers.StyleMap({
                                     strokeColor:'red',
                                     strokeWidth:3,
                                     strokeOpacity:1.0,
                                     fillColor:'yellow',
                                     fillOpacity:0.6
                     });
    var drawPolygonStyle=new OpenLayers.StyleMap({
                                     strokeColor:'black',
                                     strokeWidth:2,
                                     strokeOpacity:1.0,
                                     fillColor:'blue',
                                     fillOpacity:0.3
                     });
    var clusterColors = {
                low: "rgb(126, 204, 55)",//"rgb(181, 226, 140)", 
                middle: "rgb(241, 211, 87)", 
                high: "rgb(253, 156, 115)"
    };
    // Define three rules to style the cluster features.
    var lowRule = new OpenLayers.Rule({
                filter: new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.LESS_THAN,
                    property: "count",
                    value: 15
                }),
                symbolizer: {
                    fillColor: clusterColors.low,
                    fillOpacity: 0.9, 
                    strokeColor: clusterColors.low,
                    strokeOpacity: 0.5,
                    strokeWidth: 12,
                    pointRadius: 15,
                    label: "${count}",
                    labelOutlineWidth: 1,
                    fontColor: "#ffffff",
                    fontOpacity: 0.8,
                    fontSize: "12px"
                }
    });
    var middleRule = new OpenLayers.Rule({
                filter: new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.BETWEEN,
                    property: "count",
                    lowerBoundary: 15,
                    upperBoundary: 50
                }),
                symbolizer: {
                    fillColor: clusterColors.middle,
                    fillOpacity: 0.9, 
                    strokeColor: clusterColors.middle,
                    strokeOpacity: 0.5,
                    strokeWidth: 12,
                    pointRadius: 18,
                    label: "${count}",
                    labelOutlineWidth: 1,
                    fontColor: "#ffffff",
                    fontOpacity: 0.8,
                    fontSize: "12px"
                }
     });
     var highRule = new OpenLayers.Rule({
                filter: new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.GREATER_THAN,
                    property: "count",
                    value: 50
                }),
                symbolizer: {
                    fillColor: clusterColors.high,
                    fillOpacity: 0.9, 
                    strokeColor: clusterColors.high,
                    strokeOpacity: 0.5,
                    strokeWidth: 12,
                    pointRadius: 21,
                    label: "${count}",
                    labelOutlineWidth: 1,
                    fontColor: "#ffffff",
                    fontOpacity: 0.8,
                    fontSize: "12px"
                }
    });
    var viewerEvent=new GLIN.GIS.Events();
    var layout=function(){throw 'Layout: No implementation!';};
    var arcgisRestIdentifyHandler=function(selTool,shape,maxcount){
	if(selTool!=null&&shape!=null){
	    var gType=null;
	    var geom=null;
	    if(shape instanceof OpenLayers.Bounds){
		gType='esriGeometryEnvelope';
		var bound=null;
		var minXY = selTool.map.getLonLatFromPixel({
                        x: shape.left,
                        y: shape.bottom
                });
                var maxXY = selTool.map.getLonLatFromPixel({
                        x: shape.right,
                        y: shape.top
                });
                bound=new OpenLayers.Bounds(minXY.lon, minXY.lat, maxXY.lon, maxXY.lat);
		geom=bound.toBBOX(6,false);
	    }
	    else if(shape instanceof OpenLayers.Geometry.Polygon){
		gType='esriGeometryPolygon';
		if(shape.components.length==1){
		    geom='{"rings":[[['+shape.components[0].components[0].x+','+shape.components[0].components[0].y+']';
		    for(var i=1;i<shape.components[0].components.length;++i)
		        geom=geom+',['+shape.components[0].components[i].x+','+shape.components[0].components[i].y+']';
		    geom=geom+']]}';
		}
//console.log(geom);
	    }
	    if(gType!=null&&geom!=null){
		var mbbox=map.getExtent();
		$.get(
		    (navigator.appName=='Microsoft Internet Explorer'||isSSL)&&wms[selTool.lyrname].proxy!=''?wms[selTool.lyrname].proxy:wms[selTool.lyrname].url+'/identify',
		    {
		    "geometryType":gType,
		    "geometry":geom,
		    "sr":3857,
		    "layers":'all:'+wms[selTool.lyrname].id,
		    "tolerance":2,
		    "mapExtent":'{"xmin":'+mbbox.left+',"ymin":'+mbbox.bottom+',"xmax":'+mbbox.right+',"ymax":'+mbbox.top+'}',
		    "imageDisplay":map.getSize().w+','+map.getSize().h+','+OpenLayers.DOTS_PER_INCH,
		    "returnGeometry":false,
		    "f":'json'
		    },
		    function(objs){
		        /*selectionLyr=new OpenLayers.Layer.ArcGIS93Rest(SelectionName,curLyr.url+'/export',
		 		{
		 		    "layers":"show:"+curLyr.id,
				    "format":"image/png",
				    "tiled":true,
				    "transparent":true,
				    "bboxSR": "epsg:3857",
				    "bbox":bbox,
				    "dynamicLayers":[{"id":101,"source":{"type":"mapLayer","mapLayerId":wms[that.lyrname].id},"drawingInfo":{"renderer": {"type":"simple", "symbol": {"type":"esriSFS","style":"esriSFSSolid","color":[255,0,0,255],"outline":{"type":"esriSLS","style":"esriSLSSolid","color":[0,255,0,255],"width":1}}}}}],
		   		},
		    		{"visibility":true,"opacity":1.0,"isBaseLayer":false}
		        );
			addSelectionLayer(selectionLyr);*/
			if(objs!=null&&objs.results!=null&&objs.results.length>0){
				var returns={};
				returns['type']='FeatureCollection';
				var records=Array();
				var fldnames='';
				var record=null;
				var props=null;
				for(var i=0;i<objs.results.length;++i){
				    record={};
				    record['type']='Feature';
				    record['properties']={};
				    //record['properties'][objs.results[i].displayFieldName]=objs.results[i].value;
				    //if(0==i)fldnames=objs.results[i].displayFieldName;
				    for(var k in objs.results[i].attributes){
					if(k=='OBJECTID')
					    record['id']=objs.results[i].attributes[k];
					else{
					    record['properties'][k]=objs.results[i].attributes[k];
					    if(0==i)fldnames=fldnames+k+',';
					}
				    }
				    records.push(record);
				}
				returns['features']=records;
				if(fldnames.length>0)fldnames=fldnames.substr(0,fldnames.length-1);
				if(objs.results.length<=maxcount)
				    returns.count=returns.maxcount=objs.results.length;
				else{
				    returns.count=objs.results.length;
				    returns.maxcount=maxcount;;
				}
			        layout.SlideOpenDataPane(true);
				layout.DataPaneDisplay(returns,getQueryFields(fldnames),selTool.layer.name);
			}
		        layout.HideWaitScreen();
		    },
		    'json'
		);
		GLIN.GIS.Viewer.ActivateTool('navigate');
		layout.SetPanAsDefaultButton();
		layout.ShowWaitScreen();
	    }
	}
    };
    var addSelectionLayer=function(lyr){
	if(lyr!=null){
	    map.addLayer(lyr);
	    map.setLayerIndex(lyr,baseLayersCount+userLayersCount);
	}
    };
    var removeSelectionLayer=function(){
	if(selectionLyr!=null){map.removeLayer(selectionLyr);selectionLyr.destroy();selectionLyr=null;}
	if(wfsLyr!=null)wfsLyr.removeAllFeatures();
    };
    var add2MarkerLayer=function(marker){
	markerLyr.addMarker(marker);
    };
    var removeMarkers=function(){
	if(markerLyr!=null){markerLyr.clearMarkers();}
    };
    var reverseWKTGeom=function(wkt){//assume perfect wkt format
	if(wkt!=null&&wkt.length>0){
	    var len=wkt.length;
	    var i1=-1,i2;
	    var arr=new Array();
	    function rotate(str,start,end){
		if(str!=null&&str.length>end){
		    var t=null;
		    while(start<end){
			t=str[start];
			str[start++]=str[end];
			str[end--]=t;
		    }
		}
	    }
	    function rotate1(str,start,n1,end,n2){
		if(str!=null&&str.length>end&&start<end){
		    var t=null;
		    while(n1-->=0&&n2-->=0){
			t=str[start];
			str[start++]=str[end];
			str[end--]=t;
		    }
		    if(n1>0||n2>0)rotate(str,start,end);
		}
	    }
	    for(var i=0;i<len;++i)arr[i]=wkt.charAt(i);
	    for(i=0;i<len;++i){
		if(-1==i1&&(wkt.charAt(i)=='+'||wkt.charAt(i)=='-'||(wkt.charAt(i)>='0'&&wkt.charAt(i)<='9')))i1=i;
		else if(wkt.charAt(i)==' ')i2=i+1;
		else if(i1>=0&&(wkt.charAt(i)==','||wkt.charAt(i)==')')){
		    rotate(arr,i1,i2-2);
		    rotate(arr,i2,i-1);
		    rotate1(arr,i1,i2-i1-1,i-1,i-i2);
		    i1=-1;	
		}
	    }
	    return arr.join('');
	}
    };
    var wrapper4DescribeFeature=function(url,featureTypeName,obj,position,callback){
	var params={
			"WFS-DESC":1,
			SERVICE:"WFS",
			REQUEST:"DescribeFeatureType",
			VERSION:"1.1.0",
			TYPENAME:featureTypeName,
	    };
	var fn=function(response){
	    var xml=response.status==200?response.responseText:null;
	    var flds='';
	    if(xml!=null){
		xmldoc=$.parseXML(xml);
                var fn1=function(){
		    if($(this).attr('name')!=null&&$(this).attr('name').length>0&&$(this).attr('type')!=featureTypeName+"Type"&&$(this).attr('name')!="the_geom")
			flds=flds+$(this).attr('name')+',';
		};
                if($(xmldoc).find("xsd\\:element").length==0)
		    $(xmldoc).find('element').each(fn1);
		else
		    $(xmldoc).find('xsd\\:element').each(fn1);
		//if(flds.length>0)flds=flds.substring(0,flds.length-1);		
		
	    }
	    callback(obj,position,flds);
	}
	OpenLayers.Request.GET({url:url,params:OpenLayers.Util.upperCaseObject(params),callback:fn,scope:obj});
    };
    var getQueryFields=function(flds){
	if(curLyr.queryfields!=null&&curLyr.queryfields.length>0)return curLyr.queryfields;
	else if(flds!=null){
	    var arr=flds.split(',');
	    if(arr!=null&&arr.length>0){
	        var arr1=Array();
	        for(var i=0;i<arr.length;++i)
	            arr1.push({'field':arr[i],'display':arr[i]});
	        return arr1;
	    }
	}
	return [];
    };
    var selectByRectLoaded=function(json,bbox,flds,maxcount){
	removeSelectionLayer();
	var objs=null;
	if(json!=null){
	    objs=JSON.parse(json);
	    if(objs!=null&&objs["features"].length>0){
	        var params={
			"WFS-COUNT":1,
			SERVICE:"WFS",
			REQUEST:"GetFeature",
			VERSION:"1.1.0",
			BBOX:bbox.toBBOX(6,!curLyr.is_axis_reversed),//bound.toString()+','+'EPSG:3857',//
			TYPENAME:this.layer.params.LAYERS,
			//PROPERTYNAME:flds,
			SRSNAME:this.crs,
			
		};
		if(flds!=null&&flds.length>0)
		    params.PROPERTYNAME=flds;
		var fn=function(response){
		    
		        if(this.callback!=null){
			    var xml=response.status==200?response.responseText:null;
			    if(xml!=null){
			        xmldoc=$.parseXML(xml);
				if($(xmldoc).find("wfs\\:FeatureCollection").length==0)
				    objs.count=$(xmldoc).find('FeatureCollection').attr('numberOfFeatures');
				else
			            objs.count=$(xmldoc).find('wfs\\:FeatureCollection').attr('numberOfFeatures');
				objs.maxcount=maxcount;
			    }
			
			    layout.SlideOpenDataPane(true);
	    		    layout.DataPaneDisplay(objs,getQueryFields(flds),this.layer.name);
		        }
		};
	  	OpenLayers.Request.GET({url:this.url,params:OpenLayers.Util.upperCaseObject(params),callback:fn,scope:this});
	        var style=null;
		if(curLyr.hstyle!=null&&curLyr.hstyle.length>0)style=curLyr.hstyle;
		else{
		    if(curLyr.type=='area')style='hl_poly';
		    else if('line'==curLyr.type)style='hl_line';
		    else if('point'==curLyr.type)style='hl_point';
		    else throw 'selectByRectLoaded: Unknown shape type!';
		}
		selectionLyr=new OpenLayers.Layer.WMS(SelectionName,curLyr.url,
		 	{
		 		"layers":curLyr.id,
				"styles":style,
				"format":"image/png",
				"tiled":true,
				"transparent":true,
				"srs": "epsg:3857",
				"cql_filter":"BBOX(the_geom,"+bbox.toBBOX(6,false)+")"
		   	},
		    	{"visibility":true,"opacity":1.0,"isBaseLayer":false}
		     );
		addSelectionLayer(selectionLyr);
	        
	    }
	    else{
	        layout.SlideOpenDataPane(true);
	        layout.DataPaneDisplay(objs,curLyr.queryfields,this.layer.name);
            }
	}
    };
    var selectByPolyLoaded=function(json,poly,flds,maxcount){
	removeSelectionLayer();
	var objs=null;
	if(json!=null){
	    objs=JSON.parse(json);
	    if(objs!=null&&objs["features"].length>0){
		var poly1=curLyr.is_axis_reversed?poly.toString():reverseWKTGeom(poly.toString());
	        var params={
			"WFS-COUNT":1,
			SERVICE:"WFS",
			REQUEST:"GetFeature",
			VERSION:"1.1.0",
			CQL_FILTER:"INTERSECTS(the_geom,"+poly1+")",
			TYPENAME:this.layer.params.LAYERS,
			SRSNAME:this.crs,//this.layer.params.SRS,//
			PROPERTYNAME:flds
			
		};
		var fn=function(response){
		    
		        if(this.callback!=null){
			    var xml=response.status==200?response.responseText:null;
			    if(xml!=null){
			        xmldoc=$.parseXML(xml);
				if($(xmldoc).find("wfs\\:FeatureCollection").length==0)
				    objs.count=$(xmldoc).find('FeatureCollection').attr('numberOfFeatures');
				else
			            objs.count=$(xmldoc).find('wfs\\:FeatureCollection').attr('numberOfFeatures');
				objs.maxcount=maxcount;
			    }
			
			    layout.SlideOpenDataPane(true);
	    		    layout.DataPaneDisplay(objs,getQueryFields(flds),this.layer.name);
		        }
		};
	  	OpenLayers.Request.GET({url:this.url,params:OpenLayers.Util.upperCaseObject(params),callback:fn,scope:this});
	        var style=null;
		if(curLyr.hstyle!=null&&curLyr.hstyle.length>0)style=curLyr.hstyle;
		else{
		    if(curLyr.type=='area')style='hl_poly';
		    else if('line'==curLyr.type)style='hl_line';
		    else if('point'==curLyr.type)style='hl_point';
		    else throw 'selectByRectLoaded: Unknown shape type!';
		}
		selectionLyr=new OpenLayers.Layer.WMS(SelectionName,curLyr.url,
		 	{
		 		"layers":curLyr.id,
				"styles":style,
				"format":"image/png",
				"tiled":true,
				"transparent":true,
				"srs": "epsg:3857",
				"cql_filter":"INTERSECTS(the_geom,"+poly.toString()+")",
		   	},
		    	{"visibility":true,"opacity":1.0,"isBaseLayer":false}
		     );
		addSelectionLayer(selectionLyr);
	        
	    }
	    else{
	        layout.SlideOpenDataPane(true);
	        layout.DataPaneDisplay(objs,curLyr.queryfields,this.layer.name);
	    }
	}
    };
    var selectByPointLoaded=function(txt,point,lyrname){
	if(popup!=null){
	    map.removePopup(popup);
	    popup.destroy();
	    popup=null;
	}
	var html=layout.FormatPopupText(txt,lyrname);
	if(html!=null&&html.length>0){
	    popup=new OpenLayers.Popup.FramedCloud(
                        		"glingis", 
                       			new OpenLayers.LonLat(point.x,point.y),
                        		null,
                        		html,
                        		{'size':new OpenLayers.Size(10,1),'offset':new OpenLayers.Pixel(0,-22)},
                        		true,
					function(e){
					    removeMarkers();
					    if(wfsLyr)wfsLyr.removeAllFeatures();
					    this.hide();OpenLayers.Event.stop(e);
					}
            );
	    popup.minSize=new OpenLayers.Size(300,300);//popup.minSize.h);
	    popup.autoSize=true;
	    map.addPopup(popup);
	    viewerEvent.Invoke("Viewer_OnIdentifyPopupLoaded");
	}else{
	    removeMarkers();
	}
    };
    var unitload=function(){
	unitFactors['mi']=new Array();
	unitFactors['mi']['ft']=5280.0;
	unitFactors['mi']['in']=63360.0;
	unitFactors['mi']['km']=1.60934;
	unitFactors['mi']['m']=1609.34;
	unitFactors['ft']=new Array();
	unitFactors['ft']['in']=12.0;
	unitFactors['ft']['km']=0.0003048;
	unitFactors['ft']['m']=0.3048;
	unitFactors['in']=new Array();
	unitFactors['in']['km']=2.54e-5;
	unitFactors['in']['m']=0.0254;
	unitFactors['km']=new Array();
	unitFactors['km']['m']=1000.0;
    };
    var mapload=function(id,basetype,lonlat,zoomlevel,apiKey,overviewSize){
	if(root==null)throw "Application root must be assigned first!";
	map=new OpenLayers.Map(id,options);
	/*map.events.register('zoomstart',map,function(evt){
				if(evt.object.getZoom()<options.minZoomLevel)
				    OpenLayers.Event.stop(evt);
	});*/
        //map.fallThrough=true;
        //map.fractionalZoom=true;
	currentToolName="navigate";
	currentTool=controls[currentToolName]=new OpenLayers.Control.Click({
                        handlerOptions: {
                            "single": true
                        }
                    });
//map.getControlsByClass("OpenLayers.Control.Navigation")[0];//new OpenLayers.Control.Navigation({'zoomWheelEnabled': true});
	//controls["zoomin"]=controls["zoomout"]=new OpenLayers.Control.Click({handlerOptions:{"single":true}});
	/*controls["graticule"]=new OpenLayers.Control.Graticule(
		{
		    layerName:"Graticule",
		    labelFormat:"dms",
		    //labelled:true,
		    //numPoints: 2,
		    //targetSize:200
		    labelSymbolizer:{
           		fontColor:"#666",
          		fontSize:"10px",
          		fontFamily:"tahoma,helvetica,sans-serif"
        	    },
        	    lineSymbolizer:{
           		strokeWidth:0.40,
          		strokeOpacity:0.90,
          		strokeColor:"#999999",
          		strokeDashstyle:"dash"
        	    }
		    
	});*/
	controls["zoomin"]=new OpenLayers.Control.ZoomBox({title:"Zoom in box", out: false});
	controls["zoomout"]=new OpenLayers.Control.ZoomBox({title:"Zoom in box", out: true});
	controls["navihistory"]=new OpenLayers.Control.NavigationHistory();
	controls["navihistory"].onPreviousChange=function(state,length){viewerEvent.Invoke("Viewer_OnNavigationHistoryPrevious",state!=null);};
        controls["navihistory"].onNextChange=function(state,length){viewerEvent.Invoke("Viewer_OnNavigationHistoryNext",state!=null);};
        
        if(layout.GetScaleLineDiv()==null)
	    controls["scalebar"]=new OpenLayers.Control.ScaleLine({"geodesic":true});
	else
	    controls["scalebar"]=new OpenLayers.Control.ScaleLine(document.getElementById(layout.GetScaleLineDiv()),{"geodesic":true});

	if(layout.GetScaleDiv()==null)
	    controls["scale"]=new OpenLayers.Control.Scale({"geodesic":true});
	else
	    controls["scale"]=new OpenLayers.Control.Scale(document.getElementById(layout.GetScaleDiv()),{"geodesic":true});
	var sketchSymbolizers = {
                "Point": {
                    pointRadius: 4,
                    graphicName: "square",
                    fillColor: "white",
                    fillOpacity: 1,
                    strokeWidth: 1,
                    strokeOpacity: 1,
                    strokeColor: "#333333"
                },
                "Line": {
                    strokeWidth: 3,
                    strokeOpacity: 1,
                    strokeColor: "#666666",
                    strokeDashstyle: "dash"
                },
                "Polygon": {
                    strokeWidth: 2,
                    strokeOpacity: 1,
                    strokeColor: "#666666",
                    fillColor: "white",
                    fillOpacity: 0.3
                }
            };
        var style = new OpenLayers.Style();
        style.addRules([
                new OpenLayers.Rule({symbolizer: sketchSymbolizers})
        ]);
        var styleMap = new OpenLayers.StyleMap({"default": style});
            
        // allow testing of specific renderers via "?renderer=Canvas", etc
        var renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
        renderer = (renderer) ? [renderer] : OpenLayers.Layer.Vector.prototype.renderers;

	controls["distance"]=new OpenLayers.Control.Measure(OpenLayers.Handler.Path,{
			         persist: true,
				 immediate:true,
				 geodesic:true,
				 displaySystem:'english',
				 handlerOptions:{
                            	     layerOptions:{
                                         renderers: renderer,
                                         styleMap: styleMap
                            	     }
                        	 }
			     });
	controls["area"]=new OpenLayers.Control.Measure(OpenLayers.Handler.Polygon,{
			     persist: true,
			     immediate:true,
			     geodesic:true,
			     displaySystem:'english',
			     handlerOptions:{
                                 layerOptions: {
                                     renderers: renderer,
                                     styleMap: styleMap
                                 }
                             }	
			 });
	var measureHandler={
		"measure": layout.MeasureHandler,
                "measurepartial": layout.MeasureHandler
	};
	controls["distance"].events.on(measureHandler);
	controls["area"].events.on(measureHandler);
	for(var k in controls)
	    //if(k!="navigate")
	        map.addControl(controls[k]);
	controls[currentToolName].activate();
	baseLayers["Google Streets"]= new OpenLayers.Layer.Google(
        		"Google Streets", // the default
        		{projection:new OpenLayers.Projection("EPSG:3857"),type:google.maps.MapTypeId.MAP,minZoomLevel: 3,"sphericalMercator": true}//numZoomLevels: 20,
    	    );
	baseLayers["Google Physical"]= new OpenLayers.Layer.Google(
        		"Google Physical",
        		{projection:new OpenLayers.Projection("EPSG:3857"),type: google.maps.MapTypeId.TERRAIN,minZoomLevel: 3, "sphericalMercator": true}
    	    );
     	baseLayers["Google Hybrid"]= new OpenLayers.Layer.Google(
        		"Google Hybrid",
        		{projection:new OpenLayers.Projection("EPSG:3857"),type: google.maps.MapTypeId.HYBRID, minZoomLevel: 3,"sphericalMercator": true}
    	    );
    	baseLayers["Google Satellite"]= new OpenLayers.Layer.Google(
        		"Google Satellite",
        		{projection:new OpenLayers.Projection("EPSG:3857"),type: google.maps.MapTypeId.SATELLITE, minZoomLevel: 3,"sphericalMercator": true}//numZoomLevels: 22,
    	    );
//has trouble to work with Bing map if resize/updatemap
        /*baseLayers["Road"]= new OpenLayers.Layer.Bing({
                        name: "Road",
                        key: apiKey,
                        type: "Road"
            });
        baseLayers["Hybrid"]= new OpenLayers.Layer.Bing({
                        name: "Hybrid",
                        key: apiKey,
                        type: "AerialWithLabels"
            });
        baseLayers["Aerial"] = new OpenLayers.Layer.Bing({
                        name: "Aerial",
                        key: apiKey,
                        type: "Aerial"
           });*/
	baseLayers["OSM Map"]=new OpenLayers.Layer.OSM("OSM Map");
	//baseLayers["OSM Map"].options.minZoomLevel=3;
	baseLayers["ESRI Ocean"]=new OpenLayers.Layer.XYZ(
         'ESRI Ocean'
        ,'http://services.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/${z}/${y}/${x}.jpg'
        ,{
           sphericalMercator : true
          ,isBaseLayer       : true
          ,wrapDateLine      : true
        });
	baseLayers["Nautical Charts"]=new OpenLayers.Layer.ArcGIS93Rest(
         'Nautical Charts'
        ,'http://egisws02.nos.noaa.gov/ArcGIS/rest/services/RNC/NOAA_RNC/MapServer/export'
        ,{
          layers : 'show:3'
        }
        ,{
          isBaseLayer : true
        });
	
	for(var k in baseLayers)
	    map.addLayer(baseLayers[k]);
	baseLayersCount=map.layers.length;
	basemapType=basetype;
	var opt=null;
	for(var k in wms){
	    if(wms[k].selected)curLyr=wms[k];
	    if(false==wms[k].is_arc_rest){
	        opt={"visibility":wms[k].visible,"opacity":wms[k].opacity,"isBaseLayer":false,"transitionEffect":"map-resize"};
	        if(wms[k].minscale!=0)
		    opt['minScale']=wms[k].minscale;
	        if(wms[k].maxscale!=0)
		    opt['maxScale']=wms[k].maxscale;
	        map.addLayer(
		    new OpenLayers.Layer.WMS(
		        wms[k].name,wms[k].url,
		        {
			"layers":wms[k].id,
			"styles":wms[k].style,
			"format":"image/png",
			"tiled":true,
			"transparent":true,
			"srs": "epsg:3857"
		        },
		        opt
		));
	    }
	    else{
		opt={"visibility":wms[k].visible,"opacity":wms[k].opacity};
		if(wms[k].minscale!=0)
		    opt['minScale']=wms[k].minscale;
	        if(wms[k].maxscale!=0)
		    opt['maxScale']=wms[k].maxscale;
		map.addLayer(new OpenLayers.Layer.ArcGIS93Rest(wms[k].name,wms[k].url+'/export',
                    {'layers': "show:"+wms[k].id,'transparent':true,"bboxSR": "3857"},opt));
            }
	    ++userLayersCount;
	}
	/*for(var k in wms){
	    if(wms[k].selected)curLyr=wms[k];
	    opt={"visibility":wms[k].visible,"opacity":wms[k].opacity,"isBaseLayer":false,"transitionEffect":"map-resize"};
	    if(wms[k].minscale!=0)opt['minScale']=wms[k].minscale;
	    if(wms[k].maxscale!=0)opt['maxScale']=wms[k].maxscale;
	    map.addLayer(
		new OpenLayers.Layer.WMS(
		    wms[k].name,wms[k].url,
		    {
			"layers":wms[k].id,
			"styles":wms[k].style,
			"format":"image/png",
			"tiled":true,
			"transparent":true,
			"srs": "epsg:3857"
			
		    },
		    opt
		)
	    );
	    ++userLayersCount;
	}*/
	for(var k in wms){
	    map.setLayerIndex(map.getLayersByName(k)[0],baseLayersCount+wms[k].order);
}
        wfsLyr=new OpenLayers.Layer.Vector(CanvasWFSName,"",{});
	wfsLyr.styleMap=featureStyle;
	wfsLyr.renderers=["Canvas", "SVG", "VML"];
	//map.addLayer(wfsLyr);
	var renderer=OpenLayers.Util.getParameters(window.location.href).renderer;
        renderer=(renderer)?[renderer]:OpenLayers.Layer.Vector.prototype.renderers;
        markerLyr=new OpenLayers.Layer.Markers(markerName,{renderers: renderer});
	markerLyr1=new OpenLayers.Layer.Vector(markerName1,{renderers: ['Canvas','SVG'],rendererOptions:{zIndexing: true}});
	lineLyr=new OpenLayers.Layer.Vector(userLineName,{renderers: ['Canvas','SVG']});
	var dur=8;
	if(typeof InstallTrigger != 'undefined')dur=0;	
	markerLyr2=new OpenLayers.Layer.Vector(markerName2,{renderers: ['Canvas','SVG'],
				strategies: [
                    		        //new OpenLayers.Strategy.Fixed(),
                    			new OpenLayers.Strategy.AnimatedCluster({
                        			distance: 45,
                        			animationMethod: OpenLayers.Easing.Expo.easeOut,
                        			animationDuration:dur
                    			})
			        ],
	});
	map.addLayer(markerLyr);
	map.addLayer(markerLyr2);
	map.addLayer(lineLyr);
	map.addLayer(wfsLyr);
	map.addLayer(markerLyr1);
	var canvas=new OpenLayers.Layer.Vector(CanvasName,{styleMap:drawPolygonStyle});
	map.addLayer(canvas);
	controls["draw_polygon"]=new OpenLayers.Control.DrawFeature(canvas,OpenLayers.Handler.Polygon);
	controls["draw_polygon"].featureAdded=function(ftr){
	    viewerEvent.Invoke("Viewer_OnDrawVectorComplete",ftr);
	    GLIN.GIS.Viewer.ActivateTool('navigate');
	    layout.SetPanAsDefaultButton();
	}
	map.addControl(controls["draw_polygon"]);
        if(curLyr!=null){
	    
	    
	    controls["select_by_rect"]=new OpenLayers.Control.Select();//new OpenLayers.Control.DrawFeature(canvas,OpenLayers.Handler.Box);
	    map.addControl(controls["select_by_rect"]);
	    controls["select_by_rect"].setLayerHandler(root+'viewer.php',curLyr.name,map.getLayersByName(curLyr.name)[0],selectByRectLoaded,curLyr.getfeatureinfoformat,curLyr.crs,50);

            controls["select_by_polygon"]=new OpenLayers.Control.SelectByPolygon();
	    map.addControl(controls["select_by_polygon"]);
	    controls["select_by_polygon"].setLayerHandler(root+'viewer.php',curLyr.name,map.getLayersByName(curLyr.name)[0],selectByPolyLoaded,curLyr.getfeatureinfoformat,curLyr.crs,50);

	    controls["select_by_point"]=new OpenLayers.Control.SelectByPoint();
	    map.addControl(controls["select_by_point"]);
	    controls["select_by_point"].setLayerHandler(root+'viewer.php',curLyr.name,map.getLayersByName(curLyr.name)[0],selectByPointLoaded,curLyr.getfeatureinfoformat,curLyr.crs,curLyr.style,50);
	}
        if("google"==basetype)
	    map.setBaseLayer(baseLayers["Google Streets"]);
	else if("bing"==basetype)
	    map.setBaseLayer(baseLayers["Road"]);
	else
	    map.setBaseLayer(baseLayers["OSM Map"]);
	originalCenter=lonlat.transform(new OpenLayers.Projection("EPSG:4326"),map.getProjectionObject());
	originalZoomLevel=zoomlevel;
	if(overviewSize!=null){
	    var overview = new OpenLayers.Control.OverviewMap({
                maximized: overviewSize.maximized,
                maximizeTitle: 'Show the overview map',
                minimizeTitle: 'Hide the overview map',
	        autoPan:true,
	    //maxRatio:1000,
	    //minRatio:50,
	        size: new OpenLayers.Size(overviewSize.width,overviewSize.height),
	        mapOptions:{
			projection: new OpenLayers.Projection("EPSG:3857")
			//numZoomLevels: 2
			//maxResolution:0.015 
	        }
            });
            map.addControl(overview);
	}
	map.setCenter(originalCenter, originalZoomLevel);
	/*overview.updateOverview();
	overview.isSuitableOverview = function() {
            return true;
        };*/
	fullExtent=map.getExtent();
	//overview.ovmap.zoomToExtent(fullExtent);
	//map.restrictedExtent=fullExtent;
    };
    var init=function(id,basetype,lonlat,zoomlevel,apiKey,overviewSize){
	unitload();
	layout.Load();
	layout.SetPanAsDefaultButton();
	layout.SetToolHighlight(0);
	viewerEvent.Invoke("Viewer_OnLayoutCompleted");
	mapload(id,basetype,lonlat,zoomlevel,apiKey,overviewSize);
	viewerEvent.Invoke("Viewer_OnDocumentReady");
    };
    var isValidLayerInfo=function(lyr){
	return lyr!=null&&lyr.name!=null&&lyr.id!=null&&lyr.url!=null&&lyr.crs!=null&&lyr.type!=null&&lyr.legend!=null;
    };
    var pointInPolygon=function(ringpnts){
	if(ringpnts!=null&&ringpnts.length>=3){
	    var contour=Array();
//var foobar='';
	    for(var i=0;i<ringpnts.length-1;++i){
		contour.push(new poly2tri.Point(ringpnts[i].x,ringpnts[i].y));
//foobar=foobar+ringpnts[i].x+' '+ringpnts[i].y+'\n';
}
//document.getElementById('debug').innerHTML=foobar;
	    var ctx=new poly2tri.SweepContext(contour);
	    ctx.triangulate();
	    var triangles =ctx.getTriangles();
	    if(triangles!=null&&triangles.length>0)
	    {
		var j=0,area=0,tmp=0,a=0,b=0,c=0,p=0;
		for(var i=0;i<triangles.length-1;++i){
		    a=Math.sqrt(Math.pow((triangles[i].getPoint(0).x-triangles[i].getPoint(1).x),2)+Math.pow((triangles[i].getPoint(0).y-triangles[i].getPoint(1).y),2));
		    b=Math.sqrt(Math.pow((triangles[i].getPoint(1).x-triangles[i].getPoint(2).x),2)+Math.pow((triangles[i].getPoint(1).y-triangles[i].getPoint(2).y),2));
		    c=Math.sqrt(Math.pow((triangles[i].getPoint(2).x-triangles[i].getPoint(0).x),2)+Math.pow((triangles[i].getPoint(2).y-triangles[i].getPoint(0).y),2));
		    p=(a+b+c)/2.0;
		    tmp=Math.sqrt(p*(p-a)*(p-b)*(p-c));
		    if(tmp>area){area=tmp;j=i;}
		}
		return new OpenLayers.Geometry.Point((triangles[j].getPoint(0).x+triangles[j].getPoint(1).x+triangles[j].getPoint(2).x)/3.0,
						    (triangles[j].getPoint(0).y+triangles[j].getPoint(1).y+triangles[j].getPoint(2).y)/3.0);
	    }	
	}
	return null;
    };
    var parseESRIGeom=function(type,geom){
	var geometry=null;
	if(type=='esriGeometryPolyline'&&geom.paths!=null&&geom.paths.length>0){
	    var linestrings=Array();
	    var linestring=null;
	    var points=null;
	    for(var i=0;i<geom.paths.length;++i){
		linestring=new OpenLayers.Geometry.LineString();
		points=Array();
	        for(var j=0;j<geom.paths[i].length;++j)
		    points.push(new OpenLayers.Geometry.Point(geom.paths[i][j][0],geom.paths[i][j][1]));
		linestring.components=points;
		linestrings.push(linestring);
	    }
	    geometry=new OpenLayers.Geometry.MultiLineString();
	    geometry.components=linestrings;
	}
        else if(type=='esriGeometryPoint')geometry=new OpenLayers.Geometry.Point(geom.x,geom.y);
	else if(type=='esriGeometryPolygon'&&geom.rings!=null&&geom.rings.length>0){
	    var linearings=Array();
	    var linearing=null;
	    var points=null;
	    for(var i=0;i<geom.rings.length;++i){
		linearing=new OpenLayers.Geometry.LinearRing();
		points=Array();
	        for(var j=0;j<geom.rings[i].length;++j)
		    points.push(new OpenLayers.Geometry.Point(geom.rings[i][j][0],geom.rings[i][j][1]));
		linearing.components=points;
		linearings.push(linearing);
	    }
	    geometry=new OpenLayers.Geometry.Polygon();
	    geometry.components=linearings;
	
	}
	if(geometry!=null&&geom.spatialReference!=null&&geom.spatialReference.latestWkid!=3857)
	    geometry=geometry.transform("EPSG:"+geom.spatialReference.wkid,map.getProjectionObject());	
	return geometry;
    };
    var getFeatureById=function(fid,lyrname,isZoom2){
	if(root==null)return null;
	var lyr=map.getLayersByName(lyrname)[0];
	if(lyr!=null){
	    var params=null;
	    
	    //TODO Refactor me!
	    var fn=function(response){
		var txt=null;
		if(wms[lyrname].is_arc_rest)txt=response;
		else txt=response.status==200?response.responseText:null;
		try{
		    var json=null;
		    if(wms[lyrname].is_arc_rest)json=txt;
		    else
			json=$.parseJSON(txt);
		    if(json!=null&&((json.features!=null&&json.features.length==1)||(json.results!=null&&json.results.length==1))){

		        var geojson=new OpenLayers.Format.GeoJSON();
		        var vectors=null;
			if(wms[lyrname].is_arc_rest){
			    vectors=[new OpenLayers.Feature.Vector()];
			    vectors[0].geometry=parseESRIGeom(json.results[0].geometryType,json.results[0].geometry);
			}
			else vectors=geojson.read(txt,json.type,null);//return should be always FeatureCollection
		        if(vectors!=null&&vectors.length>0){
			    if(isZoom2){
				
				if(map.popups!=null&&map.popups.length==1){
				    removeMarkers();
				    var pnt=null;
				    if(vectors[0].geometry.CLASS_NAME=="OpenLayers.Geometry.Point")pnt=vectors[0].geometry;
				    else{
//console.log(vectors[(vectors.length-1)/2].geometry);
					pnt=vectors[(vectors.length-1)/2].geometry.getCentroid();//getBounds().getCenterLonLat();
				        if(vectors[0].geometry.CLASS_NAME=="OpenLayers.Geometry.Polygon"&&vectors[0].geometry.containsPoint(pnt)==false)
					    pnt=pointInPolygon(vectors[0].geometry.components[0].components)
				        else if(vectors[0].geometry.CLASS_NAME=="OpenLayers.Geometry.MultiPolygon"){
					    var bvalid=false;
					    for(var i=0;i<vectors[0].geometry.components.length&&(bvalid=vectors[0].geometry.components[i].containsPoint(pnt))==false;++i)continue;
					    if(!bvalid){
					        var j=0,tmp=0,area=0;
					        for(var i=0;i<vectors[0].geometry.components.length;++i){
					            tmp=vectors[0].geometry.components[i].getArea();
					            if(tmp>area){area=tmp;j=i;}
					        }
					        pnt=pointInPolygon(vectors[0].geometry.components[j].components[0].components);
					    }
				        } 
				    }
				//add2MarkerLayer(new OpenLayers.Marker(new OpenLayers.LonLat(pnt.x,pnt.y),markerIcon.clone()));
				    var ll=new OpenLayers.LonLat(pnt.x,pnt.y);
				    if(vectors[0].geometry.CLASS_NAME=="OpenLayers.Geometry.Point")
				        add2MarkerLayer(new OpenLayers.Marker(ll,markerIcon.clone()));
				    else
					map.popups[0].anchor={size:new OpenLayers.Size(0,0),offset:new OpenLayers.Pixel(0,0)};
				    if(vectors[0].geometry.CLASS_NAME!="OpenLayers.Geometry.Point"){
				    	wfsLyr.removeAllFeatures();
				        wfsLyr.addFeatures(vectors);
				    }
				    map.popups[0].lonlat=ll;
				    map.popups[0].moveTo(map.getPixelFromLonLat(ll));
				}
				map.zoomToExtent(vectors[0].geometry.getBounds(),false);
				if(map.popups!=null&&map.popups.length==1)
				    setTimeout(map.popups[0].updatePosition(),1000);
				
			    }else{
			        if(vectors[0].geometry.CLASS_NAME=="OpenLayers.Geometry.Point"){
				    removeMarkers();
				    add2MarkerLayer(new OpenLayers.Marker(new OpenLayers.LonLat(vectors[0].geometry.x,vectors[0].geometry.y),markerIcon.clone()));
				    
				
			        }else{
				    wfsLyr.removeAllFeatures();
				    wfsLyr.addFeatures(vectors);
			        }
				
			    }
            	        }
		        //FIXME TODO handle no valid vector returned!
		    }
		}catch(err){}
		layout.HideWaitScreen();
	    };
	    layout.ShowWaitScreen();
	    if(wms[lyrname].is_arc_rest){
		$.get(		    //wms[lyrname].url+'/find',
		   (navigator.appName=='Microsoft Internet Explorer'||isSSL)&&wms[lyrname].proxy!=''?wms[lyrname].proxy:wms[lyrname].url+'/find',
		   {
			"fm":1,
			"layers":wms[lyrname].id,
			"searchFields":"OBJECTID",
			"searchText":fid,
			"contains":false,
			"f":'pjson',
			//"tolerance":2,
			"sr":3857
		    },
		    function(data){
//console.log(data);
			fn(data);
		    },
		    'json'
		);
	    }
	    else{
	       params={
		"WFS-ID":1,
		SERVICE:"WFS",
		REQUEST:"GetFeature",
		VERSION:"1.1.0",
		TYPENAME:lyr.params.LAYERS,
		FEATUREID:fid,
		SRSNAME:lyr.params.SRS,
		MAXFEATURES:1,
		OUTPUTFORMAT:"json"
	        };
		OpenLayers.Request.GET({url:root+'viewer.php',params:OpenLayers.Util.upperCaseObject(params),callback:fn,scope:this});
	    }
	    
	    
	}
	return null;
    };
    var resizeHappening=false;
    return {
	Load: init,
	SetUIHandler: function(handler){layout=handler;},
	SetAppRoot:function(url){
	    root=url;
	    if(root.substr(0,5)=="https")isSSL=true;
	    var size =new OpenLayers.Size(32,32);
	    markerIcon=new OpenLayers.Icon(root+'/js/GLINGIS/images/marker.png', size, new OpenLayers.Pixel(-(size.w/2), -size.h));
	},
	GetMapProjectionCode:function(withPrefix){
	    if(withPrefix)return "EPSG:3857";
	    else return 3857;
	},
	GetMapSizeInPixel:function(){
	    return {"width":map.getSize().w,"height":map.getSize().h,"DPI":OpenLayers.DOTS_PER_INCH};
	},
	GetLonLatfromPixel:function(x,y){
	    return map.getLonLatFromPixel({x:x,y:y});
	},
	ResizeMap:function(){
	    if(!resizeHappening){
	        setTimeout( function() { 
			//console.log("resizeHappening");
			map.updateSize();
			map.baseLayer.redraw();
			var lyrs=GLIN.GIS.Viewer.GetVisibleLayers()
			for(var i=0,len=lyrs.length;i<len;++i)
			    if(lyrs[i].redraw!=null)lyrs[i].redraw(true);
			    else if(lyrs[i].refresh!=null)lyrs[i].refresh();
			/*for(var i=0, len=map.layers.length; i<len; i++) {
                    map.layers[i].onMapResize();                
                }*/
			//map.setCenter(map.getCenter(),map.getZoom());
			resizeHappening=false;
			//console.log(resizeHappening);
			}, 
		400);
	        resizeHappening=true;
	    }
//console.log(resizeHappening);
	},
	GetBaseLayerInfo:function(){
	    return {type:basemapType,name:map.baseLayer.name};
	},
	SetBaseLayer:function(lyrname){
	    if(baseLayers[lyrname]!=null)
	        map.setBaseLayer(baseLayers[lyrname]);
	},
	PushLayerStack:function(lyr,name){
	    wms[name]=lyr;
	},
	AddLayer:function(lyr,markers,hidden){
	    var result=false;
	    if(markers){
		if(controls[markerName2]!=null){
		    layout.Update4NewLayer(lyr.name,lyr.meta,hidden);
                    viewerEvent.Invoke("Viewer_OnLayerAdded");
		    result=true;
		}
		return result;
	    }
	    if(isValidLayerInfo(lyr)){
		wms[lyr.name]=lyr;
		var l=new OpenLayers.Layer.WMS(
		        lyr.name,lyr.url,
		        {
			"layers":lyr.id,
			"styles":lyr.style,
			"format":"image/png",
			"tiled":true,
			"transparent":true,
			"srs": "epsg:3857"
			
		        },
		        {"visibility":lyr.visible,"opacity":lyr.opacity,"isBaseLayer":false}
		);
		map.addLayer(l);
		userLayersCount++;
	        map.setLayerIndex(l,baseLayersCount+userLayersCount-1);
		if(layout.Update4NewLayer!=null)layout.Update4NewLayer(lyr.name,lyr.meta);
		viewerEvent.Invoke("Viewer_OnLayerAdded");
		result=true;
	    }
	    return result;
	},
	IsLayerExisted:function(name,layers){
	    if(name==null||name.length==0)return false;
	    var result=map.getLayersByName(name);
	    if(result.length>0)
	        return result[0];
	    else{
		if(layers!=null){
		    //console.log(layers);
		    var tester={"test":function(params){
			    //if(params!=null)console.log(params.LAYERS);
			    if(params!=null&&params.LAYERS==layers)return true;
			    return false;
		        }
		    };
		    result=map.getLayersBy("params",tester);
		}
		return result.length>0?result[0]:false;
	    }
	},
	ActivateTool:function(name){
	    if(controls[name]!=null){
	        currentTool.deactivate();
		if(markerName2==currentToolName)currentTool.stopEdit();
		currentToolName=name;
	        currentTool=controls[currentToolName];
	        currentTool.activate();
	        //map.getControlsByClass(currentTool)[0].activate();
	    }else if(controls[markerName2]!=null&&controls[markerName2].hasGroup(name)){//user marker
		currentToolName=markerName2;
	        currentTool.deactivate();
	        currentTool=controls[currentToolName];
	        currentTool.activate();
		currentTool.startEdit(name);
	    }
	},
	GetCurrentToolName:function(){
	    return currentToolName;
	},
	SetMeasureToolUnitSys:function(isMetric){
	    if(controls["distance"]!=null)controls["distance"].displaySystem=isMetric?"metric":"english";
	    if(controls["area"]!=null)controls["area"].displaySystem=isMetric?"metric":"english";
	},
	ConvertFromTo:function(value,from,to,order){
	    if(from==to)return value;
	    var factor=1.0;
	    if(unitFactors[from]!=null&&unitFactors[from][to]!=null)
		factor=unitFactors[from][to];
	    else if(unitFactors[to]!=null&&unitFactors[to][from]!=null)
		factor=1.0/unitFactors[to][from];
	    else throw 'ConvertFromTo: No implementation!';
	    return value*Math.pow(factor,order);
	},
	SetDefaultTool:function(name){
	    if(controls[name]!=null){
		oldTool=controls['navigate'];
	        controls['navigate']=controls[name];
	    }
	},
	ResetDefaultTool:function(){
	    if(oldTool!=null)controls['navigate']=oldTool;
	},
	RunTool:function(name){
	    switch(name){
		case "zoomfull":
		    map.zoomToExtent(fullExtent);
		    break;
		case "reset":
		    map.setCenter(originalCenter, originalZoomLevel);
		    break;
		case "navigate-prev":
		    controls["navihistory"].previousTrigger();
		    break;
		case "navigate-next":
		    controls["navihistory"].nextTrigger();
		    break;
		default:
		    map.setCenter(originalCenter, originalZoomLevel);
		    break;
	    }
	},
	OnLayoutCompleted: function(handler){
	    viewerEvent.AddEvent("Viewer_OnLayoutCompleted",handler);
	},
	OnDocumentReady: function(handler){
	    viewerEvent.AddEvent("Viewer_OnDocumentReady",handler);
	},
	OnLayerAdded:function(handler){
	    viewerEvent.AddEvent("Viewer_OnLayerAdded",handler);
	},
	OnNavigationHistoryPrevious:function(handler){
	    viewerEvent.AddEvent("Viewer_OnNavigationHistoryPrevious",handler);
	},
	OnNavigationHistoryNext:function(handler){
	    viewerEvent.AddEvent("Viewer_OnNavigationHistoryNext",handler);
	},
	OnDrawVectorComplete:function(handler){
	    viewerEvent.AddEvent("Viewer_OnDrawVectorComplete",handler);
	},
	OnLayerLoadStart:function(lyrname,handler){
	    if(handler!=null){
		var lyr=map.getLayersByName(lyrname);
	        if(lyr!=null&&lyr[0]!=null)
		  lyr[0].events.register("loadstart",lyr[0],handler);  
	    }
	},
	OnLayerLoadEnd:function(lyrname,handler){
	    if(handler!=null){
		var lyr=map.getLayersByName(lyrname);
	        if(lyr!=null&&lyr[0]!=null)
		  lyr[0].events.register("loadend",lyr[0],handler);  
	    }
	},
	OnIdentifyPopupLoaded:function(handler){
	    viewerEvent.AddEvent("Viewer_OnIdentifyPopupLoaded",handler);  
	},
	centerMapTo:function(lon,lat,epsg,zoom){
	    var lonlat=new OpenLayers.LonLat(lon,lat);
	    if(epsg!=null)
	        lonlat.transform(new OpenLayers.Projection(epsg),map.getProjectionObject());
	    if(zoom>=map.getNumZoomLevels())
	    zoom=map.getZoom()+1;
	    map.setCenter(lonlat,zoom,false,false);
	},
	zoomMapTo:function(zoomlevel){
	    if(zoomlevel<map.getNumZoomLevels())map.zoomTo(zoomlevel);
	},
	ToggleLayerVisibility:function(lyrname,onLoad,onLoaded){
	    var lyr=map.getLayersByName(lyrname);
	    if(lyr!=null&&lyr[0]!=null){
		/*if(onLoad!=null)
		    lyr[0].events.register("loadstart",lyr[0],onLoad);
		if(onLoaded!=null)
		    lyr[0].events.register("loadend",lyr[0],onLoaded);*/
		lyr[0].setVisibility(!lyr[0].getVisibility());
		if(lyr[0].getVisibility()&&wms[lyrname]!=null)
		    return {"minscale":wms[lyrname].minscale,"maxscale":wms[lyrname].maxscale,"zoomtobound":wms[lyrname].zoomtobound,"crs":wms[lyrname].crs,'selectable':wms[lyrname].selectable};
	    }
	    else if(controls[markerName2]!=null){
		controls[markerName2].toggleVisibiltyByGroup(lyrname);
	    }
	    return null;
	},
	IsLayerVisible:function(lyrname){
	    if(lyrname!=null&&lyrname.length>0){
		var lyr=map.getLayersByName(lyrname);
	        if(lyr!=null&&lyr[0]!=null)
		    return lyr[0].visibility;
		else if(controls[markerName2]!=null)
		    return controls[markerName2].isGroupVisible(lyrname);
	    }
	    return false;
	},
	GetVisibleLayers:function(){
	    lyrs=new Array();
	    for(var i=0,len=map.layers.length;i<len;++i)
	        if(map.layers[i].visibility&&false==map.layers[i].isBaseLayer&&("OpenLayers.Layer.WMS"==map.layers[i].CLASS_NAME||"OpenLayers.Layer.ArcGIS93Rest"==map.layers[i].CLASS_NAME)&&map.layers[i].name!=SelectionName)	lyrs.push({"name":map.layers[i].name,"visible":map.layers[i].visibility,"index":map.getLayerIndex(map.layers[i]),"metalink":wms[map.layers[i].name].meta,"opacity":map.layers[i].opacity*100});
	    if(controls[markerName2]!=null){
	        var gps=controls[markerName2].getVisibleGroups();
		if(gps.length>0){
		    for(var i=0;i<gps.length;++i)
		        lyrs.push(gps[i]);
		}
	    }
	    return lyrs;
	},
	GetLayerLegend:function(lyrname,width,height){
	    if(controls[markerName2]!=null&&controls[markerName2].isGroupVisible(lyrname)){
		return controls[markerName2].getGroupIcon(lyrname);
	    }else if(lyrname!=null&&lyrname.length>0&&wms[lyrname]&&width>0&&height>0){
		if(wms[lyrname].legend.length>0)return wms[lyrname].legend;//+'&width='+width+'&height='+height;
		else
		    return root+'viewer.php?WMS-LGD=1&REQUEST=GETLEGENDGRAPHIC&VERSION=1.1.0&FORMAT=image/png&WIDTH='+width+'&HEIGHT='+height+'&LAYER='+wms[lyrname].id;
	    }
	},
	GetAllSelectableLayers:function(){
	    lyrs=new Array();
	    for(var i=0,len=map.layers.length;i<len;++i)
		if(false==map.layers[i].isBaseLayer&&wms[map.layers[i].name]!=null&&wms[map.layers[i].name].selectable&&("OpenLayers.Layer.WMS"==map.layers[i].CLASS_NAME||"OpenLayers.Layer.ArcGIS93Rest"==map.layers[i].CLASS_NAME)&&map.layers[i].name!=SelectionName)
		    lyrs.push({"name":map.layers[i].name,"visible":map.layers[i].visibility});
	    return lyrs;
	},
	GetSelectedLayer:function(){
	    if(curLyr!=null)return curLyr.name;
	    else return null;
	},
	SetSelectedLayer:function(lyrname,count){
	    if(lyrname!=null&&lyrname.length>0){
		var lyr=map.getLayersByName(lyrname);
	        if(lyr!=null&&lyr[0]!=null){
		    curLyr=wms[lyr[0].name];
		    controls["select_by_rect"].setLayerHandler(root+'viewer.php',curLyr.name,lyr[0],selectByRectLoaded,curLyr.getfeatureinfoformat,curLyr.crs,count);
		    controls["select_by_polygon"].setLayerHandler(root+'viewer.php',curLyr.name,lyr[0],selectByPolyLoaded,curLyr.getfeatureinfoformat,curLyr.crs,count);
		    controls["select_by_point"].setLayerHandler(root+'viewer.php',curLyr.name,lyr[0],selectByPointLoaded,curLyr.getfeatureinfoformat,curLyr.crs,curLyr.style,50);
		    viewerEvent.Invoke("Viewer_OnLayerSelected",lyrname);
		}
	    }
	    else{
		removeSelectionLayer();
		removeMarkers();
	    }

	},
	PutLayerOnTop:function(lyrname){
	    GLIN.GIS.Viewer.SetLayerIndex(lyrname,baseLayersCount+userLayersCount-1);
	},
	ChangeLayerOrder:function(lyrname,delta){
	    var lyr=map.getLayersByName(lyrname);
	    if(lyr!=null&&lyr[0]!=null){
		var idx=map.getLayerIndex(lyr[0]);
		if(idx>baseLayersCount&&idx+delta>=baseLayersCount)
		    map.raiseLayer(lyr[0],delta);
	    }
	},
	SetLayerIndex:function(lyrname,idx){
//console.log("plan to set "+lyrname+" to "+idx);
	    if(idx<baseLayersCount)idx=baseLayersCount;
	    else if(idx>baseLayersCount+userLayersCount-1)idx=baseLayersCount+userLayersCount-1;
	    var lyr=map.getLayersByName(lyrname);
	    if(lyr!=null&&lyr[0]!=null)map.setLayerIndex(lyr[0],idx);
//console.log("set "+lyrname+" to "+idx);
	},
	GetLayerIndex:function(lyrname){
	    var lyr=map.getLayersByName(lyrname);
	    if(lyr!=null&&lyr[0]!=null)
		return map.getLayerIndex(lyr[0]);
	    else
		return -1;
	},
	SetLayerOpacity:function(lyrname,val){
	    if(val<0||val>100)return;
	    var lyr=map.getLayersByName(lyrname);
	    if(lyr!=null&&lyr[0]!=null)
		lyr[0].setOpacity(val/100.0);
	},
	GetMapExtent:function(crs){
	    return crs!=null?map.getExtent().clone().transform(map.getProjectionObject(),new OpenLayers.Projection(crs)).toBBOX(6,false):map.getExtent().clone();
	},
	IdentifyFeatureByFID:function(lyrname,fid){
	    getFeatureById(fid,lyrname,false);
	},
	ZoomToFeatureByFID:function(lyrname,fid){
	    getFeatureById(fid,lyrname,true);
	},
	ZoomToExtent:function(bound,epsg){
	    if(bound!=null){
		if(bound.CLASS_NAME!="OpenLayers.Bounds")//bound.length==4
		    bound=new OpenLayers.Bounds(bound[0],bound[1],bound[2],bound[3]);
		if(Proj4js.defs[epsg]!=null)
		    map.zoomToExtent(bound.transform(new OpenLayers.Projection(epsg),map.getProjectionObject()),false);
		else
		    map.zoomToExtent(bound,false);
	    }
	},
	RemoveAllDrawnPolygon:function(){
	    map.getLayersByName(CanvasName)[0].removeAllFeatures();
	},
	transform2:function(geom,crs){
	    if(Proj4js.defs[crs]==null)return null;
            return geom.clone().transform(map.getProjectionObject(),new OpenLayers.Projection(crs));
        },
	transformMapXY2:function(x,y,crs){
	    if(Proj4js.defs[crs]==null)return null;
	    return new OpenLayers.Geometry.Point(x,y).transform(map.getProjectionObject(),new OpenLayers.Projection(crs));
	},
	transform2MapProjection:function(geom,crs){
	    if(Proj4js.defs[crs]==null)return null;
	    return geom.clone().transform(new OpenLayers.Projection(crs),map.getProjectionObject());
	},
	AddESRIGeometries:function(type,geoms){
	    var geom=parseESRIGeom(type,geoms);
	    if(geom!=null){
		vectors=[new OpenLayers.Feature.Vector()];
		vectors[0].geometry=geom;
		wfsLyr.addFeatures(vectors);
	    }
	},
	 AddUserESRIGeometries:function(type,geoms,style){
            var geom=parseESRIGeom(type,geoms);
            if(geom!=null){
                vectors=[new OpenLayers.Feature.Vector()];
                vectors[0].geometry=geom;
                if(style!=null)vectors[0].style=style.defaultStyle;
                lineLyr.addFeatures(vectors);
            }
        },
	AddWKTGeometries:function(geom,epsg){
	    if(geom!=null&&epsg=="3857"){
		var wkt=new OpenLayers.Format.WKT();
		wfsLyr.addFeatures([wkt.read(geom)]);
	    }
	},
	AddUserWKTGeometries:function(geom,epsg,ss,gid){
	    if(geom!=null&&epsg=="3857"){
                var wkt=new OpenLayers.Format.WKT();
		var ftr=wkt.read(geom);
		if(ss!=null){
		    //var s=OpenLayers.Util.applyDefaults(ss, OpenLayers.Feature.Vector.style['default']);
		    ftr.style=ss.defaultStyle;
		}
		if(gid!=null)ftr.uid=gid;
                lineLyr.addFeatures([ftr]);
            }
	},
	RemoveAllESRIGeometries:function(){
	    wfsLyr.removeAllFeatures();
	},
	RemoveAllUserESRIGeometries:function(){
            lineLyr.removeAllFeatures();
        },
	ClearClusterHighlight:function(){
	    if(controls[markerName2]!=null)
		controls[markerName2].removeHighlightMarker();
	},
	GetVectorDataExtent:function(){
	    return wfsLyr.getDataExtent();
	},
	GetUserVectorDataExtent:function(){
            return lineLyr.getDataExtent();
        },
	AddTextLayer:function(url){
	   if(url!=null){
	       var l=new OpenLayers.Layer.Text("TXT Layer",
			{
			    location:url,
			    projection:map.displayProjection
			});
	   } 
	},
	/*AddUserMarkerControl:function(id,pic,html){
	    if(controls[id]==null){
		if(html==null||html.length==0)html=null;
	        controls[id]=new OpenLayers.Control.AddMarker({"id":id,"icon":pic,"layer":markerLyr1,"html":html});
	        map.addControl(controls[id]);
	    }
	},*/
        BuildUserMarker:function(gid,x,y,icon,width,height,epsg,data){
	    var lonlat=new OpenLayers.LonLat(x,y);
            var pj=new OpenLayers.Projection(epsg);
            if(epsg!=null)
                lonlat.transform(pj,map.getProjectionObject());
            var f=new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(lonlat.lon,lonlat.lat));
            f.uid=gid;
            f.data=data;
            f.style={
                externalGraphic:icon,
                graphicWidth:width,
                graphicHeight:height,
                //graphicZIndex:-999
            };
            return f;
	},
	AddMarkers2Group:function(gid,ftrs,visible,icon,htmlHandler){
	    if(controls[markerName2]!=null&&gid!=null){
		controls[markerName2].addFeatures(gid,ftrs,visible,icon,htmlHandler);
	    }
	},
	AddUserMarker:function(gid,x,y,icon,width,height){
	    var f=new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(x,y));
	    f.uid=gid;
	    f.style={
	        externalGraphic:icon,
		graphicWidth:width,
		graphicHeight:height
		    	    //graphicZIndex:999
	    };
	    markerLyr1.addFeatures([f],null);
	    return f;
	},
	AddUserMarkerGroup:function(group){
	    if(controls[markerName2]!=null&&group.id!=null){
		controls[markerName2].addGroup(group.id,group);
		return true;
	    }
	    return false;
	},
        AddUserMarkerControl:function(groups,cluster){
	    if(controls[markerName2]==null){
		if(cluster!=null){
		    if(cluster.icon==null)cluster["icon"]="icons/marker-red.png";
		    var style=null;
		    if(cluster.condition==null){
		      var singleRule=new OpenLayers.Rule({
                    	    filter: new OpenLayers.Filter.Comparison({
                        	type: OpenLayers.Filter.Comparison.LESS_THAN,
                        	property: "count",
                        	value: 2
                    	    }),
                    	    symbolizer: {
		        	externalGraphic: cluster.icon,
				graphicWidth:cluster.iconWidth,
				graphicHeight:cluster.iconHeight
                    	    }
    	       	      });
		      style = new OpenLayers.Style(null, {
                            rules: [singleRule,lowRule, middleRule, highRule]
                      });
		    }else{
		      var singleRule=new OpenLayers.Rule({
			    filter: new OpenLayers.Filter.Logical({
                                type: OpenLayers.Filter.Logical.AND,
                                filters: [
                                    new OpenLayers.Filter.Comparison({
                                    type: OpenLayers.Filter.Comparison.EQUAL_TO,
                                    property: cluster.condition.field,
                                    value: cluster.condition.value
                                    }),
                                    new OpenLayers.Filter.Comparison({
                                    type: OpenLayers.Filter.Comparison.EQUAL_TO,
                                    property: "count",
                                    value: 1
                                    })
                                ]}),
                            symbolizer: {
                                externalGraphic: cluster.condition.icon,
                                graphicWidth:cluster.iconWidth,
                                graphicHeight:cluster.iconHeight
                            }
                      });
		      var singleRule1=new OpenLayers.Rule({
		            filter: new OpenLayers.Filter.Logical({
				type: OpenLayers.Filter.Logical.AND,
				filters: [
				    new OpenLayers.Filter.Comparison({
                                    type: OpenLayers.Filter.Comparison.NOT_EQUAL_TO,
                                    property: cluster.condition.field,
                                    value: cluster.condition.value
                                    }),
				    new OpenLayers.Filter.Comparison({
                                    type: OpenLayers.Filter.Comparison.EQUAL_TO,
                                    property: "count",
                                    value: 1
                            	    })
				]}),
                            symbolizer: {
                                externalGraphic: cluster.icon,
                                graphicWidth:cluster.iconWidth,
                                graphicHeight:cluster.iconHeight
                            }
                      });
		      style = new OpenLayers.Style(null, {
                            rules: [singleRule,singleRule1,lowRule, middleRule, highRule]
                      });
		    }
		    markerLyr2.styleMap=style;
		    if(cluster.data!=null&&cluster.data.length>0){
		        var i=0;
		        var ftrs=[];
			var prj=null;
			if(cluster.epsg!=null)
			    prj=new OpenLayers.Projection(cluster.epsg);
		        for(;i<cluster.data.length;++i){
		            var lonlat=new OpenLayers.LonLat(cluster.data[i].lon,cluster.data[i].lat);
		            if(cluster.epsg!=null)
		                lonlat.transform(prj,map.getProjectionObject());
		            var f = new OpenLayers.Feature.Vector( new OpenLayers.Geometry.Point(lonlat.lon, lonlat.lat),cluster.data[i],null);
			    f.mybag=cluster.data[i];
    		            ftrs.push(f);
		        }
			markerLyr2.addFeatures(ftrs);
	    	    }
		}
	        controls[markerName2]=new OpenLayers.Control.AddMarker({"id":markerName2,"layer":[markerLyr1,markerLyr2,lineLyr],"groups":groups,"clusterftrclicked":cluster.featureClickedHandler,"icon":cluster.hicon});
	        map.addControl(controls[markerName2]);
	    }
	    return markerName2;
	},
        RemoveUserMarkerById:function(ftr){
	    if(controls[markerName2]!=null&&ftr!=null){
		markerLyr1.removeFeatures(ftr);
		if(ftr.popup!=null){
		    ftr.popup.destroy();
		    ftr.popup=null;
		}
		ftr.destroy();
		ftr=null;
		return true;
	    }
	    return false;
	},
	RemoveUserMarker:function(ftr,removePopup){
	    if(removePopup&&ftr.popup!=null){
		ftr.popup.destroy();
		ftr.popup=null;
	    }
	    if(ftr.popup1!=null){
                ftr.popup1.destroy();
                ftr.popup1=null;
            }
	    markerLyr1.removeFeatures(ftr);
	    ftr.destroy();
	    ftr=null;
	},
	RemoveUserMarkersById:function(id){
	    var ms=Array();
	    for(i in markerLyr1.features)
		if(markerLyr1.features[i].uid==id)ms.push(markerLyr1.features[i]);
	    /*if(controls[id]!=null&&controls[id].popup!=null)
		map.removePopup(controls[id].popup);*/
	    if(ms.length>0){
		markerLyr1.removeFeatures(ms[i]);
		for(i in ms){
		    //ms[i].popup.destroy();
		    //ms[i].popup=null;
		    ms[i].destroy();
		    ms[i]=null;
		}
		return true;
	    }
	    return false;
	},
	GetAllUserMarkers:function(){
	    return markerLyr1.features;
	},
	AddArcGISGPResultLayer:function(lyrname,url,id,visible,opacity){
	    map.addLayer(new OpenLayers.Layer.ArcGIS93Rest(lyrname,url+'/export',
                    {'layers': "show:"+id,'transparent':true,"bboxSR": "3857"},{"visibility":visible,"opacity":opacity}));
	},
	AddUserWMSLayer:function(lyrname,url,id,fids,ltype,lstyle){
	    var style=null;
	    if(lstyle==null){
	        if(ltype=='area')style='hl_poly';
	        else if('line'==ltype)style='hl_line';
	        else if('point'==ltype)style='hl_point';
	        //else throw 'AddUserWMSLayer: Unknown shape type!';
	    }
	    else
		style=lstyle;
	    userselLyr=new OpenLayers.Layer.WMS(lyrname,url,
		 	{
		 		"layers":id,
				"styles":style,
				"format":"image/png",
				"tiled":true,
				"transparent":true,
				"srs": "epsg:3857",
				"featureid":fids,
			},
		    	{"visibility":true,"opacity":1.0,"isBaseLayer":false}
		     );
	    addSelectionLayer(userselLyr);
	    return userselLyr;
	},
	CreateUserPopup:function(x,y,html){
	    var pop=new OpenLayers.Popup.FramedCloud(
                                        "user_popup",
                                        new OpenLayers.LonLat(x,y),
                                        null,
                                        html,
                                        null,
                                        true,
                                        function(e){
                                            map.removePopup(this);
                                            this.destroy();
            }); 
	    map.addPopup(pop);
	    return pop;
	},
	DestroyUserPopup:function(popup){
	    /*map.removePopup(popup);
	    popup.destroy();
	    popup=null;*/
	    if(popup==null||map.popups==null)return;
	    var p=null;
	    for(var a = 0; a < map.popups.length; a++){
		p=map.popups[a];
   		map.removePopup(p);
		p.destroy();
		p=null;
	    };
	},
	RemoveUserWMSLayer:function(lyr){
	    if(lyr!=null){
	        map.removeLayer(lyr);
	        lyr.destroy();
	        lyr=null;
	    }
	},
	RemoveMapPopup:function(p){
	    if(p!=null)
	        map.removePopup(p);
	    else
		for(var i=map.popups.length-1;i>=0;--i) {
                    map.removePopup(map.popups[i]);
                }
	},
	OnUserMarkerAdded:function(handler){
	    viewerEvent.AddEvent("Viewer_OnUserMarkerAdded",handler);
	},
	OnUserPopupDisplayed:function(handler){
	    viewerEvent.AddEvent("Viewer_OnUserPopupDisplayed",handler);
	},
	OnUserPopupClosing:function(handler){
            viewerEvent.AddEvent("Viewer_OnUserPopupClosing",handler);
        },
	OnUserVectorClicked:function(handler){
	    viewerEvent.AddEvent("Viewer_OnUserVectorClicked",handler);
	},
	OnLayerSelected:function(handler){
	    viewerEvent.AddEvent("Viewer_OnLayerSelected",handler);
	}
    };
})();
