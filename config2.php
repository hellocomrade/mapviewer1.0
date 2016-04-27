<?php
/*
* All files will be added to the html in the order that they present in the string. files are comma separated 
*/
$config['app_title']="Lamprey Control Map";
$config['openlayers_js']='js/OpenLayers-2.13.1/OpenLayers.js';//'http://openlayers.org/dev/OpenLayers.js';////'http://openlayers.org/dev/OpenLayers.js';'js/OpenLayers-2.13.1/OpenLayers.js';
$config['dependency_js']='http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js,
			  http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.2/jquery-ui.min.js,
			  http://maps.googleapis.com/maps/api/js?sensor=true,
			  js/GLINGIS/proj4js-compressed.js,
			  js/GLINGIS/json2.js';
			  //http://svn.osgeo.org/metacrs/proj4js/trunk/lib/proj4js-compressed.js,
			  //./js/GLINGIS/jquery.layout-latest.js,
			  //http://layout.jquery-dev.net/lib/js/jquery.layout-latest.js,
$config['ui_js']='';
$config['ui_css']='http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.0/themes/base/jquery-ui.css,./app.css';
$config['app_js']='js/app.js';
$config['app_html_body']="app2.php";
$config['extra_tags']='Analysis Tool, Comments';
$config['local_wms_server']='http://geo.glin.net/vector/wms';
$config['local_wfs_server']='http://geo.glin.net/vector/wfs';
$config['local_metadata_server']='http://maps.glin.net/data';
$config['search_js']='';
$config['search_php']='search1.php';
$config['search_prompt']='Locate Barrier by Its Name';	  
$config['projects']='[
			{
			    "name":"default",
			    "description":"<div><b>Sea Lamprey Barriers</b> <img src=\'./icons/shield.png\' align=\'middle\' style=\'vertical-align:middle;\' /></div><p>Barriers to sea lamprey migration are physical structures placed in tributaries that block access of adult sea lampreys to spawning habitat.</p><p>The network of sea lamprey barriers consists of purpose-built barriers as well as numerous dams constructed for other purposes that also serve to block upstream migration of adult sea lampreys. The location and design of purpose-built barriers are determined by a team of experts and are generally designed to block adults while allowing jumping fish to pass safely.</p><p>The commission partners with the U.S. Army Corps of Engineers to design and construct physical structures for sea lamprey control.</p><p>While purpose-built barriers are inspected on a regular basis and repaired or replaced when necessary to ensure they continue to block adult sea lampreys, many dams constructed for other purposes are being removed to improve fish passage or have been permitted to deteriorate, threatening their ability to block migrating adults. The current network of barriers prevents adults from accessing thousands of miles of habitat, thereby reducing sea lamprey production and saving millions of treatment dollars, but dam removal and deterioration pose an ongoing threat to effective sea lamprey control.</p>",
			    "defaultLeftPane":"Description"
			},
			{
			    "name":"test",
			    "description":"<h3>Testing</h3>"
			}
		    ]';
$config['startup_project']='default';
$projects['default']='{"id":0,"name":"All things considered",
			"categories":[
					{
						"name":"Default",
						"isopen":true
					},
					{
						"name":"USGS HUC",
						"isopen":false
					},
					{
						"name":"ArcGIS Server",
						"isopen":false
					}
				     ],
			"layers":[
				    {
					"name":"Great Lakes Basin Boundary",
					"id":"glin:glwatershed_outline",
					"url":"http://geo.glin.net/vector/wms",
					"meta":"http://maps.glin.net/data/04e9a13d-22cd-4295-a7f2-f3b300f80b0b",
					"order":2,
					"style":"",
					"highlight_style":"",
					"selectable":true,
					"getfeatureinfoformat":"text/html",
					"visible":true,
					"opacity":1.0,
					"category":"Default",
					"crs":"EPSG:4326",
					"type":"area"
				    },
				    {
					"name":"Great Lakes States Boundaries",
					"id":"glin:Great_Lakes_States_Boundaries",
					"url":"http://geo.glin.net/vector/wms",
					"meta":"http://maps.glin.net/data/635d4cef-cb52-4620-9f02-1197b5c3afd1",
					"order":0,
					"style":"",
					"highlight_style":"",
					"selectable":true,
					"getfeatureinfoformat":"text/html",
					"visible":false,
					"opacity":1.0,
					"selected":false,
					"category":"Default",
					"crs":"EPSG:4326",
					"type":"area",
					"query_fields":[{"field_name":"state","display_name":"State Name"},{"field_name":"area","display_name":"Area"}]
				    },
				    {
					"name":"Hydrologic Unit Boundary(HUC) to the Subwatershed (12-digit) in the Great Lakes Basin",
					"id":"glin:gl_basin_huc12",
					"url":"http://geo.glin.net/vector/wms",
					"meta":"http://maps.glin.net/data/241ede98-cb34-4505-8327-f5636d8f3f7a",
					"order":3,
					"style":"",
					"highlight_style":"",
					"selectable":true,
					"selected":false,
					"getfeatureinfoformat":"text/html",
					"visible":false,
					"opacity":0.5,
					"category":"USGS HUC",
					"crs":"EPSG:4326",
					"type":"area"
					
				    },
				    {
					"name":"upstream test",
					"id":"glin:upstream_test",
					"url":"http://geo.glin.net/vector/wms",
					"meta":"http://maps.glin.net/data/241ede98-cb34-4505-8327-f5636d8f3f7a",
					"order":7,
					"style":"",
					"highlight_style":"",
					"selectable":false,
					"selected":false,
					"getfeatureinfoformat":"text/html",
					"visible":false,
					"opacity":0.5,
					"category":"USGS HUC",
					"crs":"EPSG:3857",
					"type":"line"
					
				    },
				    {
					"name":"Great Lakes Congressional District",
					"id":"glin:congressional_district_113",
					"url":"http://geo.glin.net/vector/wms",
					"meta":"http://maps.glin.net/data/9765bb0f-2377-4890-abbc-1b54376ebdff",
					"order":1,
					"style":"",
					"highlight_style":"",
					"selectable":true,
					"getfeatureinfoformat":"text/html",
					"visible":false,
					"opacity":1.0,
					"selected":false,
					"category":"Default",
					"crs":"EPSG:4269",
					"type":"area",
					"query_fields":[{"field_name":"namelsad","display_name":"District Name"}]
				    },
				    {
					"name":"Federal Lands",
					"id":"21",
					"url":"http://glein.er.usgs.gov/arcgiswa/rest/services/seasketch_database_layers/MapServer",
					"meta":"",
					"order":4,
					"style":"",
					"highlight_style":"",
					"selectable":true,
					"getfeatureinfoformat":"text/html",
					"visible":false,
					"opacity":1.0,
					"selected":false,
					"category":"ArcGIS Server",
					"type":"area",
					"is_arc_rest":true,
					"crs":"EPSG:3857",
					"proxy":"usgs-arc.php",
					"query_fields":[{"field_name":"NAME1","display_name":"Name"},{"field_name":"OWNERSHIP AGENCY","display_name":"Owner Agency"},
							{"field_name":"FEDERAL AGENCY","display_name":"Federal Agency"},
							{"field_name":"STATE","display_name":"State"},
							{"field_name":"ADDITIONAL NAME","display_name":"Additional Name"}
						       ]
				    },
				    {
					"name":"Flowline",
					"id":"0",
					"url":"http://geo.glc.org/arcgis/rest/services/stream/gl_streamlines/MapServer",
					"meta":"http://geo.glc.org/arcgis/rest/services/stream/gl_streamlines/MapServer",
					"order":5,
					"style":"",
					"highlight_style":"",
					"selectable":true,
					"getfeatureinfoformat":"text/html",
					"visible":true,
					"opacity":1.0,
					"legend":"http://geo.glin.net/arcgis/rest/services/stream/gl_streamlines/MapServer/0/images/1bb9901b337fb07abb36f6b85e7640d6",
					"selected":true,
					"category":"ArcGIS Server",
					"type":"line",
					"is_arc_rest":true,
					"crs":"EPSG:4269",
					"minscale":1000000,
					"proxy":"glc-arc.php",
					"query_fields":[{"field_name":"reachcode","display_name":"Reach Code"},{"field_name":"FType","display_name":"Type"},
							{"field_name":"lengthkm","display_name":"Length(Km)"},
							{"field_name":"fdate","display_name":"Date"}
						       ]
				    },
				    {
					"name":"EPA AOCs",
					"id":"0",
					"url":"http://glein.er.usgs.gov/arcgiswa/rest/services/seasketch_database_layers/MapServer",
					"meta":"",
					"order":6,
					"style":"",
					"highlight_style":"",
					"selectable":true,
					"getfeatureinfoformat":"text/html",
					"visible":false,
					"opacity":1.0,
					"legend":"http://glein.er.usgs.gov/arcgiswa/rest/services/seasketch_database_layers/MapServer/0/images/aaef2948649f78e5f86fcf5b6a718757",
					"selected":false,
					"category":"ArcGIS Server",
					"type":"point",
					"is_arc_rest":true,
					"proxy":"usgs-arc.php"
				    }
				 ] 
		      }';
$projects['test']='{"id":1,"name":"Water Resource",
			"categories":"cat1,cat2",
			"layers":[
					{
						"name":"HUC 12",
						"id":"glin:gl_basin_huc12",
						"url":"http://geo.glin.net/vector/wms",
						"order":0,
						"style":"",
						"selectable":true,
						"visible":true,
						"selected":true,
						"category":"cat1"
					},
					{
						"name":"Great Lakes States Boundaries",
						"id":"glin:Great_Lakes_States_Boundaries",
						"url":"http://geo.glin.net/vector/wms",
						"order":1,
						"style":"",
						"selectable":true,
						"visible":true,
						"selected":true,
						"category":"cat2"
					}
				 ]				
		 }';
?>
