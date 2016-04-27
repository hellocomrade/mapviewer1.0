<?php
/*
*var gpSubmitUrl="http://geo.glc.org/arcgis/rest/services/stream/TraceOnFlyFull/GPServer/TraceOnFlyFull/submitJob";
var gpSubmitUrlIE="./trace-proxy.php?j=s"
var gpStatusUrl="http://geo.glc.org/arcgis/rest/services/stream/TraceOnFlyFull/GPServer/TraceOnFlyFull/jobs/";
var gpStatusUrlIE="./trace-proxy.php"
*/
$gpSubmitUrl="http://geo.glc.org/arcgis/rest/services/stream/TraceOnFlyFull/GPServer/TraceOnFlyFull/submitJob";
$gpStatusUrl="http://geo.glc.org/arcgis/rest/services/stream/TraceOnFlyFull/GPServer/TraceOnFlyFull/jobs/";
if(isset($_GET['s'])){
    $postdata=array('Barriers'=>$_POST['Barriers'],'Flags'=>$_POST['Flags'],'Trace_Task_type'=>$_POST['Trace_Task_type'],'env:outSR'=>$_POST['env:outSR'],'env:processSR'=>$_POST['env:processSR'],'f'=>$_POST['f'],'returnM'=>$_POST['returnM'],'returnZ'=>$_POST['returnZ']);
    $options = array(
        'http' => array(
            'timeout' => 15,
            'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
            'method'  => 'POST',
            'content' => http_build_query($postdata),
        ),
    );
    $context=stream_context_create($options);
    $rlt=file_get_contents($gpSubmitUrl, false, $context);
    if($rlt==FALSE)echo "";
    else echo $rlt;

}else if(isset($_GET['id']))
    if(isset($_GET['r']))
	echo file_get_contents($gpStatusUrl . $_GET['id'] . '/results/Result?f=json');
    else
        echo file_get_contents($gpStatusUrl . $_GET['id'] . '?' . $_SERVER['QUERY_STRING']);
?>
