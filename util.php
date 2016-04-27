<?php

function writeJsTags($files){
    for($i=0,$len=count($files);$i<$len;++$i)
	printf("<script type='text/javascript' src='%s'></script>\r\n",trim($files[$i]));
}
function writeCssTags($files){
    for($i=0,$len=count($files);$i<$len;++$i)
	printf("<link rel='stylesheet' type='text/css' href='%s' />\r\n",trim($files[$i]));
}
function write404(){
    header("HTTP/1.0 404 Not Found");
}
function validateWMSParam(){
    if(!isset($_GET['BBOX'])||!isset($_GET['EXCEPTIONS'])||!isset($_GET['FORMAT'])||!isset($_GET['INFO_FORMAT'])||!isset($_GET['LAYERS'])||!isset($_GET['QUERY_LAYERS'])||!isset($_GET['REQUEST'])||!isset($_GET['HEIGHT'])||!isset($_GET['WIDTH'])||!isset($_GET['SERVICE'])||!isset($_GET['VERSION']))//!isset($_GET['FEATURE_COUNT'])||
	return false;
    if($_GET['VERSION']=='1.1.1'){
	if(!isset($_GET['SRS'])||!isset($_GET['X'])||!isset($_GET['Y']))return false;
	else{
	    $prjName='SRS';
	    $xname='X';
	    $xval=$_GET['X'];
	    $yname='Y';
	    $yval=$_GET['Y'];
	}
    }
    if(strncmp($_GET['VERSION'],'1.3',3)==0){
	if(!isset($_GET['CRS'])||!isset($_GET['I'])||!isset($_GET['J']))return false;
	else{
	    $prjName='CRS';
	    $xname='I';
	    $xval=$_GET['I'];
	    $yname='J';
	    $yval=$_GET['J'];
	}
    }
    return array(
		    'BBOX'=>$_GET['BBOX'],
		    'EXCEPTIONS'=>$_GET['EXCEPTIONS'],
		    'FEATURE_COUNT'=>$_GET['FEATURE_COUNT'],
		    'FORMAT'=>$_GET['FORMAT'],
		    'INFO_FORMAT'=>$_GET['INFO_FORMAT'],
		    'LAYERS'=>$_GET['LAYERS'],
		    'QUERY_LAYERS'=>$_GET['QUERY_LAYERS'],
		    'REQUEST'=>$_GET['REQUEST'],
		    'HEIGHT'=>$_GET['HEIGHT'],
		    'WIDTH'=>$_GET['WIDTH'],
		    'SERVICE'=>'WMS',
		    'STYLES'=>$_GET['STYLES'],
		    'VERSION'=>$_GET['VERSION'],
		    'PROPERTYNAME'=>$_GET['PROPERTYNAME'],
		    'BUFFER'=>$_GET['BUFFER'],
		    $prjName=>$_GET[$prjName],
		    $xname=>$xval,
		    $yname=>$yval
		);
}
function validateWMSLegendParam(){
    if(!isset($_GET['FORMAT'])||!isset($_GET['LAYER'])||!isset($_GET['REQUEST'])||!isset($_GET['HEIGHT'])||!isset($_GET['WIDTH'])||!isset($_GET['VERSION']))
	return false;
    return array(
		    'FORMAT'=>$_GET['FORMAT'],
		    'LAYER'=>$_GET['LAYER'],
		    'REQUEST'=>'GETLEGENDGRAPHIC',
		    'HEIGHT'=>$_GET['HEIGHT'],
		    'WIDTH'=>$_GET['WIDTH'],
		    'SERVICE'=>'WMS',
		    'VERSION'=>$_GET['VERSION']
		);
}
function validateWFSParam($isIdOnly){
    if($isIdOnly){
	if(!isset($_GET['SERVICE'])||!isset($_GET['REQUEST'])||!isset($_GET['VERSION'])||!isset($_GET['TYPENAME'])||!isset($_GET['SRSNAME'])||!isset($_GET['FEATUREID']))
	    return false;
	return array(
		    'REQUEST'=>$_GET['REQUEST'],
		    'TYPENAME'=>$_GET['TYPENAME'],
		    'SRSNAME'=>$_GET['SRSNAME'],
		    'OUTPUTFORMAT'=>$_GET['OUTPUTFORMAT'],
		    'SERVICE'=>'WFS',
		    'VERSION'=>$_GET['VERSION'],
		    'MAXFEATURES'=>1,
		    'FEATUREID'=>$_GET['FEATUREID']
		);
    }
    else{
        if((!isset($_GET['BBOX'])&&!isset($_GET['CQL_FILTER']))||!isset($_GET['SERVICE'])||!isset($_GET['REQUEST'])||!isset($_GET['VERSION'])||!isset($_GET['TYPENAME'])||!isset($_GET['SRSNAME']))//||!isset($_GET['PROPERTYNAME']))
	return false;
        $max=0;
        $idx=0;
        if(isset($_GET['MAXFEATURES']))
	    $max=intval($_GET['MAXFEATURES']);
        if($max>500||$max==0)
	    $max=500;
        if(isset($_GET['STARTINDEX']))
	    $idx=intval($_GET['STARTINDEX']);
        if(isset($_GET['BBOX']))
            return array(
		    'BBOX'=>$_GET['BBOX'],
		    'REQUEST'=>$_GET['REQUEST'],
		    'FORMAT'=>$_GET['FORMAT'],
		    'TYPENAME'=>$_GET['TYPENAME'],
		    'SRSNAME'=>$_GET['SRSNAME'],
		    'PROPERTYNAME'=>$_GET['PROPERTYNAME'],
		    'OUTPUTFORMAT'=>$_GET['OUTPUTFORMAT'],
		    'SERVICE'=>'WFS',
		    'VERSION'=>$_GET['VERSION'],
		    'MAXFEATURES'=>$max,
		    'STARTINDEX'=>$idx
		);
        else if(isset($_GET['CQL_FILTER']))
	    return array(
		    'CQL_FILTER'=>$_GET['CQL_FILTER'],
		    'REQUEST'=>$_GET['REQUEST'],
		    'FORMAT'=>$_GET['FORMAT'],
		    'TYPENAME'=>$_GET['TYPENAME'],
		    'SRSNAME'=>$_GET['SRSNAME'],
		    'PROPERTYNAME'=>$_GET['PROPERTYNAME'],
		    'OUTPUTFORMAT'=>$_GET['OUTPUTFORMAT'],
		    'SERVICE'=>'WFS',
		    'VERSION'=>$_GET['VERSION'],
		    'MAXFEATURES'=>$max
		    //'STARTINDEX'=>$idx
		);
    }
}
function wms_getfeatureinfo(){
    require('config.php');
    $base=$config['local_wms_server'];
    if(!isset($base))
    {
        write404();
        exit;
    }
    if($base[strlen($base)-1]=='/')$base[strlen($base)-1]='?';
    else    $base=$base . '?';
   
    if(($arr=validateWMSParam())!=false){
//echo $base . http_build_query($arr);exit;
        echo file_get_contents($base . http_build_query($arr));
    
    }else{
        echo 'missing or incorrect parameters';
    }
    
}
function wms_getlegendgraphic(){
    require('config.php');
    $base=$config['local_wms_server'];
    if(!isset($base))
    {
        write404();
        exit;
    }
    if($base[strlen($base)-1]=='/')$base[strlen($base)-1]='?';
    else    $base=$base . '?';
   
    if(($arr=validateWMSLegendParam())!=false){
        echo file_get_contents($base . http_build_query($arr));
    
    }else{
        echo 'missing or incorrect parameters';
    }
}
function wfs_getdesc(){
    global $config;
    $base=$config['local_wfs_server'];
    if(!isset($base))
    {
        write404();
        exit;
    }
    if($base[strlen($base)-1]=='/')$base[strlen($base)-1]='?';
    else    $base=$base . '?';
    echo file_get_contents($base . http_build_query(array('SERVICE'=>'WFS','REQUEST'=>'DESCRIBEFEATURETYPE','VERSION'=>$_GET['VERSION'],'TYPENAME'=>$_GET['TYPENAME'])));
}
function wfs_getcount(){
    global $config;
    $base=$config['local_wfs_server'];
    if(!isset($base))
    {
        write404();
        exit;
    }
    if($base[strlen($base)-1]=='/')$base[strlen($base)-1]='?';
    else    $base=$base . '?';
    if(($arr=validateWFSParam(false))!=false){
	$arr['RESULTTYPE']='hits';
	unset($arr['MAXFEATURES']);
        echo file_get_contents($base . http_build_query($arr));
    
    }else{
        echo 'missing or incorrect parameters';
    }
}
function wfs_getfeature($isIdOnly){
    global $config;
    $base=$config['local_wfs_server'];
    if(!isset($base))
    {
        write404();
        exit;
    }
    if($base[strlen($base)-1]=='/')$base[strlen($base)-1]='?';
    else    $base=$base . '?';
    if(($arr=validateWFSParam($isIdOnly))!=false){
        echo file_get_contents($base . http_build_query($arr));
	//echo $base . http_build_query($arr);
    }else{
        echo 'missing or incorrect parameters';
    }
}

?>
