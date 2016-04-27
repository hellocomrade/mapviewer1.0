<?php 
if(!defined('GLIN_GIS_VIEWER'))
    define('GLIN_GIS_VIEWER',True);
$scheme="http://";
if($_SERVER['SERVER_PORT']==443)
    $scheme="https://";
$URL=$scheme . dirname($_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI']) . '/';
require_once('config.php');
require_once('util.php');

if(isset($_GET['WMS'])&&$_GET['WMS']=='1')    
    return wms_getfeatureinfo();
else if(isset($_GET['WMS-LGD'])&&$_GET['WMS-LGD']=='1')
    return wms_getlegendgraphic();
else if(isset($_GET['WFS'])&&$_GET['WFS']=='1')
    return wfs_getfeature(False);
else if(isset($_GET['WFS-ID'])&&$_GET['WFS-ID']=='1')
    return wfs_getfeature(True);
else if(isset($_GET['WFS-COUNT'])&&$_GET['WFS-COUNT']=='1')
    return wfs_getcount();
else if(isset($_GET['WFS-DESC'])&&$_GET['WFS-DESC']=='1')
    return wfs_getdesc();
$mylayer=NULL;
if(isset($_GET['mlyr']))
    $mylayer=base64_decode($_GET['mlyr']);
//({name:"Lake Erie Bathymetry", id:"glin:bathymetry_lake_erie", url:"http://geo.glin.net/vector/wms", crs:"EPSG:4326", type:"line", style:"", hstyle:"", selectable:true, getfeatureinfoformat:"text/html", queryfields:"", selected:false, visiable:true, opacity:1, order:-999, legend:""})
//$mylayer=base64_decode("KHtuYW1lOiJMYWtlIEVyaWUgQmF0aHltZXRyeSIsIGlkOiJnbGluOmJhdGh5bWV0cnlfbGFrZV9lcmllIiwgdXJsOiJodHRwOi8vZ2VvLmdsaW4ubmV0L3ZlY3Rvci93bXMiLCBjcnM6IkVQU0c6NDMyNiIsIHR5cGU6ImxpbmUiLCBzdHlsZToiIiwgaHN0eWxlOiIiLCBzZWxlY3RhYmxlOnRydWUsIGdldGZlYXR1cmVpbmZvZm9ybWF0OiJ0ZXh0L2h0bWwiLCBxdWVyeWZpZWxkczoiIiwgc2VsZWN0ZWQ6ZmFsc2UsIHZpc2lhYmxlOnRydWUsIG9wYWNpdHk6MSwgb3JkZXI6LTk5OSwgbGVnZW5kOiIifSk=");
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
<title><?php echo $config['app_title'];?></title>
<meta http-equiv="X-UA-Compatible" content="IE=9" >
<?php
if(isset($config['ui_css'])){
    $css=explode(',',trim($config['ui_css']));
    if($css&&count($css)>0)
	writeCssTags($css);
}
?>
<link href="viewer.css" rel="stylesheet" type="text/css" />
<?php
if(isset($config['dependency_js'])){
    $js=explode(',',trim($config['dependency_js']));
    if($js&&count($js)>0)
	writeJsTags($js);
}    
if(isset($config['openlayers_js'])){
    $js=explode(',',trim($config['openlayers_js']));
    if($js&&count($js)>0)
        writeJsTags($js);
}
if(isset($config['ui_js'])){
    $js=explode(',',trim($config['ui_js']));
    if($js&&count($js)>0)
        writeJsTags($js);
}    
?>
<!--
<script type="text/javascript"
      src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCQ_RDZDSzj1VNR4-s7Am6mfVB99xytvjA&sensor=true">
</script>-->
<script src="./js/glingis.js" type="text/javascript"></script>
<?php
$prjs=NULL;
$cats=array();
$projectDesc='';
$leftPaneIndex='Layers';
if(isset($config['projects'])){
    //$aprjs=explode(',',trim($config['projects']));
    $aprjs=json_decode($config['projects'],true);
    $lyrGroup=array();
    if($aprjs&&count($aprjs)>0)
    {
	$prjs=array();
	$default=isset($config['startup_project'])?$config['startup_project']:"default";
	for($i=0,$len=count($aprjs);$i<$len;++$i){
	    if(strcmp($aprjs[$i]['name'],$default)==0){
		$projectDesc=$aprjs[$i]['description'];
		$leftPaneIndex=isset($aprjs[$i]['defaultLeftPane'])?$aprjs[$i]['defaultLeftPane']:'Layers';
	    }
	    $prjs[$aprjs[$i]['name']]=$projects[$aprjs[$i]['name']];
	}
	if($prjs[$default]!=NULL){
	    
	    $objs=json_decode($prjs[$default],true);
	    $lyrs=array();
	    for($i=0,$len=count($objs['categories']);$i<$len;++$i){
		$lyrGroup[$objs['categories'][$i]['name']]=array();
		$cats[$objs['categories'][$i]['name']]=$objs['categories'][$i]['isopen'];
	    }
	    for($i=0,$len=count($objs['layers']);$i<$len;++$i){
		$lyrs[$objs['layers'][$i]['order']]=$objs['layers'][$i];
		array_push($lyrGroup[$objs['layers'][$i]['category']],
			  array(
				'name'=>$objs['layers'][$i]['name'],
				'id'=>$objs['layers'][$i]['id'],
				'meta'=>$objs['layers'][$i]['meta'],
				'visible'=>$objs['layers'][$i]['visible']?'true':'false'
			  ));
	    }
	    echo '<script type="text/javascript">';
	    echo 'GLIN.GIS.Viewer.SetAppRoot("' . $URL . '");';
	    for($i=0,$len=count($lyrs);$i<$len;++$i){
		if(isset($lyrs[$i]['query_fields'])&&is_array($lyrs[$i]['query_fields'])&&($qflen=count($lyrs[$i]['query_fields']))>0){	
		    $qf='[';
		    for($j=0;$j<$qflen;++$j)
		        $qf=$qf . sprintf('{"field":"%s","display":"%s"},',$lyrs[$i]['query_fields'][$j]['field_name'],$lyrs[$i]['query_fields'][$j]['display_name']);
		    $qf[strlen($qf)-1]=']';
		}
		else
		    $qf='""';
		echo sprintf('GLIN.GIS.Viewer.PushLayerStack({"name":"%s","id":"%s","url":"%s","crs":"%s","type":"%s","style":"%s","hstyle":"%s","selectable":%s,"getfeatureinfoformat":"%s","queryfields":%s,"selected":%s,"visible":%s,"opacity":%f,"order":%d,"legend":"%s","minscale":%f,"maxscale":%f,"zoomtobound":%s,"is_axis_reversed":%s,"meta":"%s","is_arc_rest":%s,"proxy":"%s"},"%s");',
				$lyrs[$i]['name'],
				$lyrs[$i]['id'],
				$lyrs[$i]['url'],
				$lyrs[$i]['crs'],
				$lyrs[$i]['type'],
				isset($lyrs[$i]['style'])?$lyrs[$i]['style']:'',
				isset($lyrs[$i]['highlight_style'])?$lyrs[$i]['highlight_style']:'',
				$lyrs[$i]['selectable']?'true':'false',
				isset($lyrs[$i]['getfeatureinfoformat'])?$lyrs[$i]['getfeatureinfoformat']:'text/plain',
				$qf,
				isset($lyrs[$i]['selected'])?($lyrs[$i]['selected']?'true':'false'):'false',
				$lyrs[$i]['visible']?'true':'false',
				isset($lyrs[$i]['opacity'])?$lyrs[$i]['opacity']:1.0,
				$lyrs[$i]['order'],
				isset($lyrs[$i]['legend'])?$lyrs[$i]['legend']:'',
				isset($lyrs[$i]['minscale'])?1.0/floatval($lyrs[$i]['minscale']):0,
				isset($lyrs[$i]['maxscale'])?1.0/floatval($lyrs[$i]['maxscale']):0,
				isset($lyrs[$i]['zoomtobound'])&&is_array($lyrs[$i]['zoomtobound'])&&4==count($lyrs[$i]['zoomtobound'])?sprintf("[%f,%f,%f,%f]",$lyrs[$i]['zoomtobound'][0],$lyrs[$i]['zoomtobound'][1],$lyrs[$i]['zoomtobound'][2],$lyrs[$i]['zoomtobound'][3]):'null',
				isset($lyrs[$i]['is_axis_reversed'])&&$lyrs[$i]['is_axis_reversed']?'true':'false',
				$lyrs[$i]['meta'],
				isset($lyrs[$i]['is_arc_rest'])&&$lyrs[$i]['is_arc_rest']?'true':'false',
				isset($lyrs[$i]['proxy'])?$lyrs[$i]['proxy']:'',
				$lyrs[$i]['name']
			    );
	    }
	    echo 'var leftPaneIndex="'.$leftPaneIndex.'";';
	    echo 'var incominglyr='.($mylayer==FALSE?'null':$mylayer).";";
	    echo '</script>';

	}
    }
}
else//TODO
    exit;

$showSearch=false;
if(isset($config['search_js'])&&isset($config['search_php']))
    $showSearch=true;

    
if(isset($config['app_js'])){
    $js=explode(',',trim($config['app_js']));
    if($js&&count($js)>0)
        writeJsTags($js);
}
else{
    echo 'no app_js available!';
    exit;
}
?>
</head>
<?php
if(isset($config['app_html_body']))
    include(trim($config['app_html_body']));
else
    echo 'No html body defined!';
?>
</html>
