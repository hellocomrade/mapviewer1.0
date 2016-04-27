<?php
if(isset($_GET['fm']))
    echo file_get_contents('http://geo.glc.org/arcgis/rest/services/stream/gl_streamlines/MapServer/find?'.$_SERVER['QUERY_STRING']);
else
    echo file_get_contents('http://geo.glc.org/arcgis/rest/services/stream/gl_streamlines/MapServer/identify?'.$_SERVER['QUERY_STRING']);
?>
