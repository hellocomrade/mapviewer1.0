<?php
if(!defined('GLIN_GIS_VIEWER')) exit();
require_once('config.php');
require_once('util.php');
function wfs_getfeature($isIdOnly){
    $base=$config['local_wfs_server'];
    if(!isset($base))
    {
        write404();
        exit;
    }
    if($base[strlen($base)-1]=='/')$base[strlen($base)-1]='?';
    else    $base=$base . '?';
    if(($arr=validateWFSParam())!=false){
        echo file_get_contents($base . http_build_query($arr));
    
    }else{
        echo 'missing or incorrect parameters';
    }
}
?>
