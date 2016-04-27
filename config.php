<?php
/*
* All files will be added to the html in the order that they present in the string. files are comma separated 
*/
$config['app_title']="Sea Lamprey Control Map";
$config['openlayers_js']='js/OpenLayers-2.13.1/OpenLayers.js';//'http://openlayers.org/dev/OpenLayers.js';////'http://openlayers.org/dev/OpenLayers.js';'js/OpenLayers-2.13.1/OpenLayers.js';
$config['dependency_js']='http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js,
			  http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.2/jquery-ui.min.js,
			  http://maps.googleapis.com/maps/api/js?sensor=true,
			  js/GLINGIS/proj4js-compressed.js,
			  js/GLINGIS/json2.js';
			  //http://svn.osgeo.org/metacrs/proj4js/trunk/lib/proj4js-compressed.js,
			  //./js/GLINGIS/jquery.layout-latest.js,
			  //http://layout.jquery-dev.net/lib/js/jquery.layout-latest.js,
$config['ui_js']='http://code.highcharts.com/highcharts.js';
$config['ui_css']='http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.0/themes/base/jquery-ui.css,./app.css';
$config['app_js']='js/app.js';
$config['app_html_body']="app.php";
$config['extra_tags']='Analysis Tool, Comments';
$config['local_wms_server']='http://geo.glin.net/vector/wms';
$config['local_wfs_server']='http://geo.glin.net/vector/wfs';
$config['local_metadata_server']='http://maps.glin.net/data';
$config['search_js']='';
$config['search_php']='search1.php';
$config['search_prompt']='Locate Barrier by Your Address or its Name';	  
$config['projects']='[
			{
			    "name":"default",
			    "description":"<div><b>Great Lakes Sea Lamprey Barriers</b><img src=\'./icons/shield.png\' align=\'middle\' style=\'vertical-align:middle;\' /></div><p>Barriers to sea lamprey migration are physical structures placed in tributaries that block access of adult sea lampreys to spawning habitat.</p><p>The network of sea lamprey barriers consists of purpose-built barriers as well as numerous dams constructed for other purposes that also serve to block upstream migration of adult sea lampreys. The location and design of purpose-built barriers are determined by a team of experts and are generally designed to block adults while allowing jumping fish to pass safely.</p><p>The commission partners with the U.S. Army Corps of Engineers to design and construct physical structures for sea lamprey control.</p><p>While purpose-built barriers are inspected on a regular basis and repaired or replaced when necessary to ensure they continue to block adult sea lampreys, many dams constructed for other purposes are being removed to improve fish passage or have been permitted to deteriorate, threatening their ability to block migrating adults. The current network of barriers prevents adults from accessing thousands of miles of habitat, thereby reducing sea lamprey production and saving millions of treatment dollars, but dam removal and deterioration pose an ongoing threat to effective sea lamprey control.</p><p>The Great Lakes Fishery Commission requests that any barrier removal or modification project proposed in the Great Lakes basin be reviewed bycontrol agent staff during the project planning process.  Project proposals and any other comments or questions regarding sea lamprey barriers can be directed to:</p><p><strong>Barrier Coordinators</strong><address>Jessica Barber (United States)<br />Sea Lamprey Control - Barriers and Trapping<br />U.S. Fish and Wildlife Service<br />3090 Wright Street<br />Marquette, MI  49855<br />(906)-226-1241<br /><a href=\"mailto:jessica_barber@fws.gov\">jessica_barber@fws.gov</a></address><br /><address>Brian Stephens (Canada)<br />Section Head, Control <br />Fisheries and Oceans Canada <br />1219 Queen St. E <br />Sault Ste. Marie ON <br />(705)-941-3008 <br /><a href=\"mailto:brian.stephens@dfo-mpo.gc.ca\">brian.stephens@dfo-mpo.gc.ca</a><br /><br /><br /><br /><br />",
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
						"name":"Hydrography",
						"isopen":true
					},
					{
                                                "name":"Political Units",
                                                "isopen":false
                                        },
					{
						"name":"Managed Area",
                                                "isopen":false
					}
				     ],
			"layers":[
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
					"opacity":0.3,
					"selected":false,
					"category":"Political Units",
					"crs":"EPSG:4326",
					"type":"area",
					"query_fields":[{"field_name":"state","display_name":"State Name"},{"field_name":"area","display_name":"Area"}]
				    },
				    {
                                        "name":"Great Lakes Provinces Boundaries",
                                        "id":"glin:gl_province_boundaries",
                                        "url":"http://geo.glin.net/vector/wms",
                                        "meta":"http://maps.glin.net/data/e1fa466e-7baf-40f3-a81b-f278230c16a2",
                                        "order":1,
                                        "style":"",
                                        "highlight_style":"",
                                        "selectable":true,
                                        "getfeatureinfoformat":"text/html",
                                        "visible":false,
                                        "opacity":0.3,
                                        "selected":false,
                                        "category":"Political Units",
                                        "crs":"EPSG:4326",
                                        "type":"area"
                                    },
				    {
                                        "name":"Great Lakes Congressional District",
                                        "id":"glin:congressional_district_114",
                                        "url":"http://geo.glin.net/vector/wms",
                                        "meta":"http://maps.glin.net/data/fd00cc86-0080-4ffc-b972-1f1876589998",
                                        "order":2,
                                        "style":"",
                                        "highlight_style":"",
                                        "selectable":true,
                                        "getfeatureinfoformat":"text/html",
                                        "visible":false,
                                        "opacity":0.3,
                                        "selected":false,
                                        "category":"Political Units",
                                        "crs":"EPSG:3175",
					"is_axis_reversed":true,
                                        "type":"area",
                                        "query_fields":[{"field_name":"namelsad","display_name":"District Name"},{"field_name":"rep_party","display_name":"Representative"}]
                                    },
				    {
                                        "name":"Illinois County Boundary",
                                        "id":"glin:il_county_boundaries",
                                        "url":"http://geo.glin.net/vector/wms",
                                        "meta":"http://maps.glin.net/data/72a08930-574b-4352-b963-42f80de0c684",
                                        "order":3,
                                        "style":"",
                                        "highlight_style":"",
                                        "selectable":true,
                                        "getfeatureinfoformat":"text/html",
                                        "visible":false,
                                        "opacity":0.25,
                                        "selected":false,
                                        "category":"Political Units",
                                        "crs":"EPSG:4326",
                                        "type":"area",
                                        "query_fields":[{"field_name":"name","display_name":"County Name"},{"field_name":"area","display_name":"Area"}]
                                    },
                                    {
                                        "name":"Indiana County Boundary",
                                        "id":"glin:in_county_boundaries_2000",
                                        "url":"http://geo.glin.net/vector/wms",
                                        "meta":"http://maps.glin.net/data/2c27b508-25f7-4388-b883-15af3df20379",
                                        "order":4,
                                        "style":"",
                                        "highlight_style":"",
                                        "selectable":true,
                                        "getfeatureinfoformat":"text/html",
                                        "visible":false,
                                        "opacity":0.25,
                                        "selected":false,
                                        "category":"Political Units",
                                        "crs":"EPSG:4326",
                                        "type":"area",
                                        "query_fields":[{"field_name":"name","display_name":"County Name"},{"field_name":"area","display_name":"Area"}]
                                    },
				    {
                                        "name":"Michigan County Boundary",
                                        "id":"glin:mi_county_boundaries",
                                        "url":"http://geo.glin.net/vector/wms",
                                        "meta":"http://maps.glin.net/data/2c27b508-25f7-4388-b883-15af3df20379",
                                        "order":5,
                                        "style":"",
                                        "highlight_style":"",
                                        "selectable":true,
                                        "getfeatureinfoformat":"text/html",
                                        "visible":false,
                                        "opacity":0.25,
                                        "selected":false,
                                        "category":"Political Units",
                                        "crs":"EPSG:4326",
                                        "type":"area",
                                        "query_fields":[{"field_name":"name","display_name":"County Name"},{"field_name":"area","display_name":"Area"}]
                                    },
                                    {
                                        "name":"Minnesota County Boundary",
                                        "id":"glin:mn_county_boundaries_2000",
                                        "url":"http://geo.glin.net/vector/wms",
                                        "meta":"http://maps.glin.net/data/ad1d9aae-3f13-48ab-b229-836a0dc66d55",
                                        "order":6,
                                        "style":"",
                                        "highlight_style":"",
                                        "selectable":true,
                                        "getfeatureinfoformat":"text/html",
                                        "visible":false,
                                        "opacity":0.25,
                                        "selected":false,
                                        "category":"Political Units",
                                        "crs":"EPSG:4326",
                                        "type":"area",
                                        "query_fields":[{"field_name":"name","display_name":"County Name"},{"field_name":"area","display_name":"Area"}]
                                    },
				    {
                                        "name":"New York County Boundary",
                                        "id":"glin:ny_county_boundaries_2000",
                                        "url":"http://geo.glin.net/vector/wms",
                                        "meta":"http://maps.glin.net/data/9ef6fc56-af70-4162-a3f6-df7f7ab8e071",
                                        "order":7,
                                        "style":"",
                                        "highlight_style":"",
                                        "selectable":true,
                                        "getfeatureinfoformat":"text/html",
                                        "visible":false,
                                        "opacity":0.25,
                                        "selected":false,
                                        "category":"Political Units",
                                        "crs":"EPSG:4326",
                                        "type":"area",
                                        "query_fields":[{"field_name":"name","display_name":"County Name"},{"field_name":"area","display_name":"Area"}]
                                    },
                                    {
                                        "name":"Ohio County Boundary",
                                        "id":"glin:oh_county_boundaries_2000",
                                        "url":"http://geo.glin.net/vector/wms",
                                        "meta":"http://maps.glin.net/data/e5ac3a73-98c6-4ca5-a807-ecb250b1e2e9",
                                        "order":8,
                                        "style":"",
                                        "highlight_style":"",
                                        "selectable":true,
                                        "getfeatureinfoformat":"text/html",
                                        "visible":false,
                                        "opacity":0.25,
                                        "selected":false,
                                        "category":"Political Units",
                                        "crs":"EPSG:4326",
                                        "type":"area",
                                        "query_fields":[{"field_name":"name","display_name":"County Name"},{"field_name":"area","display_name":"Area"}]
                                    },
				    {
                                        "name":"Pennsylvania County Boundary",
                                        "id":"glin:pa_county_boundaries_2000",
                                        "url":"http://geo.glin.net/vector/wms",
                                        "meta":"http://maps.glin.net/data/5049097f-109c-4397-853c-ec662ae9e5d5",
                                        "order":9,
                                        "style":"",
                                        "highlight_style":"",
                                        "selectable":true,
                                        "getfeatureinfoformat":"text/html",
                                        "visible":false,
                                        "opacity":0.25,
                                        "selected":false,
                                        "category":"Political Units",
                                        "crs":"EPSG:4326",
                                        "type":"area",
                                        "query_fields":[{"field_name":"name","display_name":"County Name"},{"field_name":"area","display_name":"Area"}]
                                    },
                                    {
                                        "name":"Wisconsin County Boundary",
                                        "id":"glin:wi_county_boundaries_2000",
                                        "url":"http://geo.glin.net/vector/wms",
                                        "meta":"http://maps.glin.net/data/8030b01a-c1f9-4480-a744-f9f1cb89ef0d",
                                        "order":10,
                                        "style":"",
                                        "highlight_style":"",
                                        "selectable":true,
                                        "getfeatureinfoformat":"text/html",
                                        "visible":false,
                                        "opacity":0.25,
                                        "selected":false,
                                        "category":"Political Units",
                                        "crs":"EPSG:4326",
                                        "type":"area",
                                        "query_fields":[{"field_name":"name","display_name":"County Name"},{"field_name":"area","display_name":"Area"}]
                                    },
				    {
					"name":"Hydrologic Unit Boundary(HUC 12-digit)",
					"id":"glin:gl_basin_huc12",
					"url":"http://geo.glin.net/vector/wms",
					"meta":"http://maps.glin.net/data/241ede98-cb34-4505-8327-f5636d8f3f7a",
					"order":11,
					"style":"",
					"highlight_style":"",
					"selectable":true,
					"selected":false,
					"getfeatureinfoformat":"text/html",
					"visible":false,
					"opacity":0.3,
					"category":"Hydrography",
					"crs":"EPSG:4326",
					"type":"area",
					"query_fields":[{"field_name":"huc_12","display_name":"HUC 12"},{"field_name":"hu_12_name","display_name":"Name"}]
					
				    },
				    {
                                        "name":"Great Lakes Basin Boundary",
                                        "id":"glin:glwatershed_outline",
                                        "url":"http://geo.glin.net/vector/wms",
                                        "meta":"http://maps.glin.net/data/04e9a13d-22cd-4295-a7f2-f3b300f80b0b",
                                        "order":12,
                                        "style":"",
                                        "highlight_style":"",
                                        "selectable":true,
                                        "getfeatureinfoformat":"text/html",
                                        "visible":true,
                                        "opacity":1.0,
                                        "category":"Hydrography",
                                        "crs":"EPSG:4326",
                                        "type":"area"
                                    },
				    {
					"name":"Federal Lands",
					"id":"21",
					"url":"http://glein.er.usgs.gov/arcgiswa/rest/services/seasketch_database_layers/MapServer",
					"meta":"",
					"order":13,
					"style":"",
					"highlight_style":"",
					"selectable":true,
					"getfeatureinfoformat":"text/html",
					"visible":false,
					"opacity":1.0,
					"selected":false,
					"category":"Managed Area",
					"type":"area",
					"is_arc_rest":true,
					"crs":"EPSG:3857",
					"proxy":"usgs-arc.php",
					"query_fields":[{"field_name":"NAME","display_name":"Name"},{"field_name":"OWNERSHIP AGENCY","display_name":"Owner Agency"},
							{"field_name":"FEDERAL AGENCY","display_name":"Federal Agency"},
							{"field_name":"STATE","display_name":"State"},
							{"field_name":"ADDITIONAL NAME","display_name":"Additional Name"}
						       ]
				    },
				    {
					"name":"Flowline",
					"id":"0",
					"url":"http://geo.glc.org/arcgis/rest/services/stream/flowline_merge/MapServer",
					"meta":"http://geo.glc.org/arcgis/rest/services/stream/flowline_merge/MapServer",
					"order":14,
					"style":"",
					"highlight_style":"",
					"selectable":true,
					"getfeatureinfoformat":"text/html",
					"visible":true,
					"opacity":1.0,
					"legend":"http://geo.glc.org/arcgis/rest/services/stream/gl_streamlines/MapServer/0/images/1bb9901b337fb07abb36f6b85e7640d6",
					"selected":true,
					"category":"Hydrography",
					"type":"line",
					"is_arc_rest":true,
					"crs":"EPSG:4269",
					"minscale":1000000,
					"proxy":"glc-arc.php",
					"query_fields":[{"field_name":"ReachCode","display_name":"Reach Code"},{"field_name":"FType","display_name":"Type"},
							{"field_name":"FDate","display_name":"Date"}
						       ]
				    },
				    {
					"name":"EPA AOCs",
					"id":"0",
					"url":"http://glein.er.usgs.gov/arcgiswa/rest/services/seasketch_database_layers/MapServer",
					"meta":"",
					"order":15,
					"style":"",
					"highlight_style":"",
					"selectable":true,
					"getfeatureinfoformat":"text/html",
					"visible":false,
					"opacity":1.0,
					"legend":"http://glein.er.usgs.gov/arcgiswa/rest/services/seasketch_database_layers/MapServer/0/images/aaef2948649f78e5f86fcf5b6a718757",
					"selected":false,
					"category":"Managed Area",
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
