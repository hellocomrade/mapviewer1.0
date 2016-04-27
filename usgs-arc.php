<?php
if(isset($_GET['fm']))
    echo file_get_contents('http://glein.er.usgs.gov/arcgiswa/rest/services/seasketch_database_layers/MapServer/find?'.$_SERVER['QUERY_STRING']);
else
    echo file_get_contents('http://glein.er.usgs.gov/arcgiswa/rest/services/seasketch_database_layers/MapServer/identify?'.$_SERVER['QUERY_STRING']);
?>
