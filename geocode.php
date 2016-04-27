<?php
$url="https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/suggest?text=%s&maxLocations=5&outSR=4269&f=json";
$url1="https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/find?text=%s&maxLocations=5&outSR=4269&f=json&magicKey=%s";
if(!isset($_GET['text']))exit;
if(isset($_GET['suggest'])){
    $u=sprintf($url,urlencode($_GET['text']));
    echo file_get_contents($u);
}else if(isset($_GET['search'])){
    echo file_get_contents(sprintf($url1,urlencode($_GET['text']),urlencode($_GET['key'])));
}
?>
