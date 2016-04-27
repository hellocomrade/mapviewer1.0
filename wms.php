<?php
if(!defined('GLIN_GIS_VIEWER')) exit();

function wms_getfeatureinfo(){
    $base=$config['local_wms_server'];
    if(!isset($base))
    {
        write404();
        exit;
    }
    if($base[strlen($base)-1]=='/')$base[strlen($base)-1]='?';
    else    $base=$base . '?';
   
    if(($arr=validateWMSParam())!=false){
        echo file_get_contents($base . http_build_query($arr));
    
    }else{
        echo 'missing or incorrect parameters';
    }
}
?>
