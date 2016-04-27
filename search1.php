<?php
//if(!defined('GLIN_GIS_VIEWER')) exit();
$url="geocode.php";
echo '<script type="text/javascript">';
?>
var barrierDict={};
$("#btnsearch").prop("disabled",true);
$("#txtsearch").prop("disabled",true);
var submitSearch=function(event,ui){
    var k=ui==null?$.trim($("#txtsearch").val()):ui.item.value;
    if(k=="<?php echo $config['search_prompt'];?>")return;
    $('.sr_prompt').text('Loading...');
    $('.sr_prompt').show();
    if(k==null||k.length==0)
    {
        $("#txtsearch").css("background-color","#ffffa2");
    }
    else
	$("#txtsearch").css("background-color","#ffffff");
    if(barrierDict[k]!=null)
        GLIN.GIS.Viewer.centerMapTo(barrierDict[k].lon,barrierDict[k].lat,"EPSG:4269",16);
    else{
	$.get("<?php echo $url;?>",{"search":1,"text":k},function(data){
                                                if(data!=null && data.locations!=null && data.locations.length>0){
						    var ll=data.locations[0].feature.geometry;
						    GLIN.GIS.Viewer.centerMapTo(ll.x,ll.y,"EPSG:4269",18)
						}else
						    $("#txtsearch").css("background-color","#ffffa2");
                                          },"json");

    }
};
function populateSearch(data){
    $("#btnsearch").prop("disabled",false);
    $("#txtsearch").prop("disabled",false);
    var keywords=[];
    var i=0;
    for(;i<data.length;++i){
	barrierDict[data[i].name]={"lon":data[i].lon,"lat":data[i].lat};
	keywords[i]=data[i].name;
    }
    $('#txtsearch').autocomplete({source:function(request,response){
				     ret=$.ui.autocomplete.filter(keywords,request.term);
				     $.get("<?php echo $url;?>",{"suggest":1,"text":request.term},function(data){
						var add=[];
						if(data!=null && data.suggestions!=null)
						    for(i=0; i<data.suggestions.length;++i)
							add[i]= data.suggestions[i].text;
						i=add.length;
						if(10-i>0)
						    add=add.concat(ret.slice(0,10-i));
						response(add);
				     		//response(ret.slice(0,10));
					  },"json");
				 },position:{of:$('.searchmap')},select:submitSearch});
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
}


<?php
echo '</script>';
 
?>
