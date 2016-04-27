<?php
//if(!defined('GLIN_GIS_VIEWER')) exit();
if($_GET['LYRTYPE']=='1'&&isset($_GET['lyr'])&&strlen($_GET['lyr'])>0){
    echo file_get_contents('http://geo.glin.net/csw/layerattr.glin?l='.$_GET['lyr']);
    return;
}
if(isset($_GET['skeyword'])&&strlen(trim($_GET['skeyword']))>0){
    $search_url="http://geo.glin.net/csw/search.glin";
    $search_bbox='';
    $search_start=1;
    if(isset($_GET['sidx'])&&is_numeric($_GET['sidx']))
    {
	$search_start=intval($_GET['sidx']);
	if($search_start<=0)$search_start=1;
    }
    if(isset($_GET['sbbox'])){
        $search_bbox=base64_decode($_GET['sbbox']);
	$search_arr=explode(',',$_GET['sbbox']);
	if(count($search_arr)==4&&is_numeric($search_arr[0])&&is_numeric($search_arr[1])&&is_numeric($search_arr[2])&&is_numeric($search_arr[3])){
	    $minx=min($search_arr[0],$search_arr[2]);
	    $maxx=max($search_arr[0],$search_arr[2]);
	    $miny=min($search_arr[1],$search_arr[3]);
	    $maxy=min($search_arr[1],$search_arr[3]);
	    $search_bbox=$minx . ',' . $miny . ',' . $maxx . ',' .$maxy;
	}
    }
    $sortField='';
    $sortOrder='';
    if(isset($_GET['sf']))
    {
        $sortField=$_GET['sf'];
        if(isset($_GET['so']))
            $sortOrder=$_GET['so'];
        if(!is_numeric($sortOrder)||($sortOrder!=0&&$sortOrder!=1))
            $sortOrder=0;
    }
    $ret=file_get_contents(sprintf("%s?k=%s&t=%s&b=%s&r=4326&s=%d&c=%d&sd=%s&ed=%s&sf=%s&so=%d",$search_url,urlencode(trim($_GET['skeyword'])),"any",$search_bbox,$search_start,10,"","",$sortField,$sortOrder));
    if(strlen($ret)==0)$ret='[]';
    echo $ret;
    return;
}
$search_url="http://geo.glin.net/csw/search.glin?klist=1";
$search_str=trim(file_get_contents($search_url));
if($search_str!=false&&strlen($search_str)>0){
    $search_arr=explode(',',$search_str);
    if(count($search_arr)>1){
	echo '<script type="text/javascript" src="http://maps.glin.net/js/base64.js"></script>';
	echo '<script type="text/javascript">';
	$search_stat='var searchDlg=null;var keywords=[';
	for($i=0,$len=count($search_arr);$i<$len;++$i)
	    $search_stat=$search_stat . '"' . trim($search_arr[$i]) . '",';
	$search_stat=substr($search_stat,0,strlen($search_stat)-1);
	$search_stat=$search_stat . '];';   
	echo $search_stat;
?>
var srLoading=false;
var srNextIndex=1;
var srHasMore=false;
var metaSrv='<?php echo $config['local_metadata_server'];?>'
var submitSearch=function(event,uii,isScroll){
    if(!isScroll){srNextIndex=1;srHasMore=false;}
    else if(!srHasMore){srLoading=false;return;}
    var k=$.trim($("#txtsearch").val());
    if(k=="<?php echo $config['search_prompt'];?>")return;
    $('.sr_prompt').text('Loading...');
    $('.sr_prompt').show();
    if(k==null||k.length==0)
    {
        $("#txtsearch").css("background-color","#ffffa2");
        return;
    }
    else
	$("#txtsearch").css("background-color","#ffffff");
    if(srLoading)return;
    else srLoading=true;
    var bbox=ui.GetMapBound();
    if(bbox!=null&&bbox.length>0)bbox=Base64.encode(bbox);
    $.get('./search.php',{"skeyword":k,"sbbox":bbox,"sidx":srNextIndex},function(data){
			if(srNextIndex==1)			
			    $('.sr_content').html('');
			if(data.length>0){
			    for(i=0,len=data.length;i<len;++i){
				if(data[i].hasmore==null){
				    var title=data[i].title;
				    var img=data[i].thumbnail!=null?data[i].thumbnail:'http://maps.glin.net/img/nopreview.gif';
				    var lyrinfo={"name":data[i].title,"lyr":data[i].wmslayer,"url":data[i].wmsurl,"crs":data[i].crs,"id":data[i].id};
				    $('.sr_content').append('<div class="box"><div class="box-inner"><div style="float:left;padding-top:15px;"><div style="border:1px solid;"><img style="width:100px;height:75px;" src="'+img+'" /></div></div><div style="margin-left:120px;"><h4>'+title+'</h4></div><div style="width:100%;height:40px;"><button class="greenbtn" style="font-size:12px;float:right;">Add to Map</button></div></div></div>');
				    $('.sr_content').children('.box').last().data("lyrinfo",lyrinfo);
				}
				
			    }
			    if(data[len-1].hasmore==1)
			    {
				srNextIndex=srNextIndex+10;
				srHasMore=true;
				$('.sr_prompt').text('Scroll down to load more.');
				$('.sr_prompt').show();
			    }
			    else{
				srHasMore=false;
				$('.sr_prompt').hide();
			    }
			    $('.greenbtn').click(function(){
				$(this).prop("disabled",true);
				var raw=$(this).parent().parent().parent().data("lyrinfo");
				
				if(!ui.FeatureLayer(raw.name,raw.lyr)){
				    $(this).text("Loading...");
				    var prefix='urn:ogc:def:crs:';
				    var epsg=null;
				    if(raw.crs!=null&&raw.crs.length>prefix.length&&raw.crs.substring(0,prefix.length)==prefix){
					if(raw.crs.substring(prefix.length,raw.crs.length)=='::WGS 1984')
					    epsg='EPSG:4326';
					else if(raw.crs.substring(prefix.length,raw.crs.length)=='::NAD 1983')
					    epsg='EPSG:4269';
					else{
					    var re=raw.crs.match(/EPSG:\d{4,}/i);
					    if(re!=null&&re.length==1)
						epsg=re[0];
					}
					if(epsg!=null){
					    var that=this;
					    $.get('./search.php',{"LYRTYPE":1,"lyr":raw.lyr},function(data){
						if(data.length>0){
						    var geomtype=null;
						    for(var i=data.length-1;i>=0;--i)
							if(data[i].name=="the_geom"){
							    if(data[i].type.substring(0,5)=='Point')geomtype='point';
							    else if(data[i].type.indexOf('Surface')>=0)geomtype='area';
							    else if(data[i].type.indexOf('LineString')>=0)geomtype='line';
							    break;
							}
						    if(geomtype!=null){
							var lyr={"name":raw.name,"id":raw.lyr,"url":raw.url,"crs":epsg,"type":geomtype,"style":"","hstyle":"",
								"selectable":true,"getfeatureinfoformat":"text/html","queryfields":"","selected":false,"visiable":true,
								"opacity":1.0,"order":-999,"legend":'',"meta":metaSrv+"/"+raw.id};//console.log(lyr.toSource());
							if(ui.AddNewLayer(lyr))
							    $(that).text("Layer Added");
							
						    }
						    else
						        $(that).text("Failed to Add Layer");
						}
					    },'json');
					    return;
					}
				    }
				    $(this).text("Failed to Add Layer");
				}
				else
				    $(this).text("Layer Added");
				
			    });
			}
			else{
			    $('.sr_prompt').html('<p>Your search did not match any layers. Please try different or more general keywords.</p>');
			}			
			if(null==searchDlg)
			    searchDlg=$('.searchresult').dialog({
				width:800,
				height:600,
				modal:true,
				draggable:false,
				resizable:false,
				button:{
					"Close":function(){$(this).dialog('close');}
				}
			    });
		  	searchDlg.dialog('open');
			srLoading=false;
	},
	'json');
};
$('#txtsearch').autocomplete({source:keywords,position:{of:$('.searchmap')},select:submitSearch});
$('#btnsearch').click(submitSearch);
$('#txtsearch').keypress(function(e){
    if(13==e.which)submitSearch();
});
$('#txtsearch').focus(function(){
    if($(this).val()==$(this)[0].title){
	$(this).removeClass("defaultTextActive");
	$(this).val("");
    }
});
$('#txtsearch').blur(function(){
    if ($(this).val() == "")
    {
            $(this).addClass("defaultTextActive");
            $(this).val($(this)[0].title);
    }
});
$('#txtsearch').blur();
$('.searchresult').scroll(function(){
    if($(this).scrollTop()+$(this).innerHeight()+5>=$(this)[0].scrollHeight)
	submitSearch(null,null,true);
});
<?php
        echo '</script>';
    }
    //else //no keywords to display
    //    echo '<script type="text/javascript">$(".searchmap").hide();</script>';
}
?>
