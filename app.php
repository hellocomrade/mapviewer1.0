<?php
if(!defined('GLIN_GIS_VIEWER')) exit();
//require_once('config.php');
?>
<style type="text/css">
        #ribbon {background:url('./icons/header.png'); height:145px;}
        #ribbon div.ribbon-window-title {color:#008641; font-size:200%;}
        div#ribbon-tab-header-0.ribbon-tab-header {background:#f1f3f4;}
        div#ribbon-tab-header-1.ribbon-tab-header {background:#f1f3f4;}
        #slcm_text {position:absolute; margin-left:auto; margin-right:auto; left:0; right:0; }
        div#container.ui-layout-container{z-index:50;}
        div.ribbon-section span.section-title{bottom:4px !important;}
	#ribbon .ribbon-button {margin-top:-2px;}
	h4 {font:110%/1.4 verdana,geneva,arial,sans-serif; font-weight:bold;}
	h5 {font:100%/1.4 verdana,geneva,arial,sans-serif; font-weight:bold; margin-bottom:2px;}
	#help {font:90%/1.4 verdana,geneva,arial,sans-serif;}
</style>
<body  bgcolor="#c9cdd2" style="margin:0;">
<div id="debug"></div>
<div id="ribbon">
		<div class="ribbon-window-title">&nbsp;<?php //echo $config['app_title'];?><img src="./icons/slcm.png" alt="Sea Lamprey Control Map" id="slcm_text" />
<!--
		    <div id="dv_glin_logo" style="margin:4px;width:140px;height:48px;background:url('./icons/logo.png') no-repeat scroll 0 0 rgba(0,0,0,0);position:absolute;right:0;top:0;clear:both;"></div>
-->
		    
		    <a id="a_glin_logo" style="margin:4px;width:140px;height:140px;background:url('./icons/glfc-140x140.png') no-repeat scroll 0 0 rgba(0,0,0,0);position:absolute;right:0;top:0;text-decoration:none;outlie:none !important;" href="http://glfc.org"></a>
<a id="a_glc_logo" style="margin:4px;width:150px;height:61px;background:url('./icons/glclogo.png') no-repeat scroll 0 0
rgba(0,0,0,0);position:absolute;right:140px;top:70px;text-decoration:none;outline:none !important;" href="http://glc.org"></a>
		   
		</div>


		
		<div class="ribbon-tab" id="tool-tab">
			<span class="ribbon-title" style="font-weight:bold;">Map Tools</span>
			<div class="ribbon-section">
				<span class="section-title">Navigation</span>
				<div class="ribbon-button ribbon-button-large" id="btn_nav">
					<span class="button-title">Pan<br/>Zoom</span>
					<span class="button-help"></span>
					<img class="ribbon-icon ribbon-normal" src="icons/normal/01-pan-zoom.png" />
					<img class="ribbon-icon ribbon-disabled" src="icons/disabled/new-table.png" />
				</div>
				<div class="ribbon-button ribbon-button-large" id="btn_zoomin">
					<span class="button-title">Zoom<br/>In</span>
					<span class="button-help"></span>
					<img class="ribbon-icon ribbon-normal" src="icons/normal/02-zoom-in.png" />
					<img class="ribbon-icon ribbon-disabled" src="icons/disabled/open-table.png" />
				</div>
				<div class="ribbon-button ribbon-button-large" id="btn_zoomout">
					<span class="button-title">Zoom<br/>Out</span>
					<span class="button-help"></span>
					<img class="ribbon-icon ribbon-normal" src="icons/normal/03-zoom-out.png" />
					<img class="ribbon-icon ribbon-disabled" src="icons/disabled/delete-table.png" />
				</div>
				<div class="ribbon-button ribbon-button-large no-toggle" id="btn_zoomfull">
					<span class="button-title">Zoom to<br/>Full Extent</span>
					<span class="button-help">This button will remove the selected table from your document.</span>
					<img class="ribbon-icon ribbon-normal" src="icons/normal/04-zoom-full.png" />
					<img class="ribbon-icon ribbon-disabled" src="icons/disabled/delete-table.png" />
				</div>
				<div class="ribbon-button ribbon-button-large no-toggle disabled" id="btn_navprev">
					<span class="button-title">Zoom to<br/>Previous View</span>
					<span class="button-help">This button will remove the selected table from your document.</span>
					<img class="ribbon-icon ribbon-normal" src="icons/normal/05-zoom-previous.png" />
					<img class="ribbon-icon ribbon-disabled" src="icons/disabled/delete-table.png" />
				</div>
				<div class="ribbon-button ribbon-button-large no-toggle disabled" id="btn_navnext">
					<span class="button-title">Zoom to<br/>Next View</span>
					<span class="button-help">This button will remove the selected table from your document.</span>
					<img class="ribbon-icon ribbon-normal" src="icons/normal/06-zoom-next.png" />
					<img class="ribbon-icon ribbon-disabled" src="icons/disabled/delete-table.png" />
				</div>
			</div>
			
			<div class="ribbon-section">
				<span class="section-title">View</span>
				<div class="ribbon-button ribbon-button-large no-toggle" id="btn_lyrlist">
					<span class="button-title">Layer<br/>List</span>
					<span class="button-help">This button will add a table to your document.</span>
					<img class="ribbon-icon ribbon-normal" src="icons/normal/07-layer-list.png" />
					<img class="ribbon-icon ribbon-disabled" src="icons/disabled/new-table.png" />
				</div>
				<div class="ribbon-button ribbon-button-large no-toggle" id="btn_lyrorder">
					<span class="button-title">Layer<br/>Order</span>
					<span class="button-help">This button will add a table to your document.</span>
					<img class="ribbon-icon ribbon-normal" src="icons/normal/08-layer-order.png" />
					<img class="ribbon-icon ribbon-disabled" src="icons/disabled/new-table.png" />
				</div>
				<div class="ribbon-button ribbon-button-large no-toggle" id="btn_lyrtrans">
					<span class="button-title">Layer<br/>Opacity</span>
					<span class="button-help">This button will add a table to your document.</span>
					<img class="ribbon-icon ribbon-normal" src="icons/normal/09-layer-opacity.png" />
					<img class="ribbon-icon ribbon-disabled" src="icons/disabled/new-table.png" />
				</div>
				<div class="ribbon-button ribbon-button-large no-toggle" id="btn_lyrlegend">
					<span class="button-title">Layer<br/>Legend</span>
					<span class="button-help">This button will add a table to your document.</span>
					<img class="ribbon-icon ribbon-normal" src="icons/normal/10-layer-legend.png" />
					<img class="ribbon-icon ribbon-disabled" src="icons/disabled/new-table.png" />
				</div>
			</div>

			<div class="ribbon-section">
				<span class="section-title">Measure</span>
				<div class="ribbon-button ribbon-button-large" id="btn_distance">
					<span class="button-title">Measure<br/>Distance</span>
					<span class="button-help">This button will add a page to your document.</span>
					<img class="ribbon-icon ribbon-normal" src="icons/normal/11-measure-distance.png" />
					<img class="ribbon-icon ribbon-hot" src="icons/hot/new-page.png" />
					<img class="ribbon-icon ribbon-disabled" src="icons/disabled/new-page.png" />
				</div>
				<div class="ribbon-button ribbon-button-large" id="btn_area">
					<span class="button-title">Measure<br/>Area</span>
					<span class="button-help">This button will open a page and add it to your document.</span>
					<img class="ribbon-icon ribbon-normal" src="icons/normal/12-measure-area.png" />
					<img class="ribbon-icon ribbon-hot" src="icons/hot/open-page.png" />
					<img class="ribbon-icon ribbon-disabled" src="icons/disabled/open-page.png" />
				</div>
				
			</div>
			
			
			<div class="ribbon-section">
				<span class="section-title">Selection</span>
				<div class="ribbon-button ribbon-button-large no-toggle" id="btn_lyrsel">
					<span class="button-title">Selectable<br/>Layers</span>
					<span class="button-help">This button will add a table to your document.</span>
					<img class="ribbon-icon ribbon-normal" src="icons/normal/13-selectable-area.png" />
					<img class="ribbon-icon ribbon-disabled" src="icons/disabled/new-table.png" />
				</div>
				<div class="ribbon-button ribbon-button-large no-toggle disabled" id="btn_lyrselclr">
					<span class="button-title">Clear<br/>Selection</span>
					<span class="button-help">This button will add a table to your document.</span>
					<img class="ribbon-icon ribbon-normal" src="icons/normal/14-clear-selection.png" />
					<img class="ribbon-icon ribbon-disabled" src="icons/disabled/new-table.png" />
				</div>
				<div class="ribbon-button ribbon-button-large" id="btn_iden">
					<span class="button-title">Select By<br/>Click</span>
					<span class="button-help">This button will add a table to your document.</span>
					<img class="ribbon-icon ribbon-normal" src="icons/normal/15-select-by-click.png" />
					<img class="ribbon-icon ribbon-disabled" src="icons/disabled/new-table.png" />
				</div>
				<div class="ribbon-button ribbon-button-large no-toggle" id="btn_selrect">
					<span class="button-title">Select By<br/>Rectangle</span>
					<span class="button-help">This button will add a page to your document.</span>
					<img class="ribbon-icon ribbon-normal" src="icons/normal/16-select-by-rectangle.png" />
					<img class="ribbon-icon ribbon-hot" src="icons/hot/new-page.png" />
					<img class="ribbon-icon ribbon-disabled" src="icons/disabled/new-page.png" />
				</div>
				<div class="ribbon-button ribbon-button-large no-toggle" id="btn_selpoly">
					<span class="button-title">Select By<br/>Polygon</span>
					<span class="button-help">This button will open a page and add it to your document.</span>
					<img class="ribbon-icon ribbon-normal" src="icons/normal/17-select-by-polygon.png" />
					<img class="ribbon-icon ribbon-hot" src="icons/hot/open-page.png" />
					<img class="ribbon-icon ribbon-disabled" src="icons/disabled/open-page.png" />
				</div>
				
			</div>
<!--
			<div class="ribbon-section">
				<span class="section-title">Print</span>
				<div class="ribbon-button ribbon-button-large no-toggle" id="add-page-btn">
					<span class="button-title">Print</span>
					<span class="button-help">This button will add a page to your document.</span>
					<img class="ribbon-icon ribbon-normal" src="icons/normal/18-print.png" />
					<img class="ribbon-icon ribbon-hot" src="icons/hot/new-page.png" />
					<img class="ribbon-icon ribbon-disabled" src="icons/disabled/new-page.png" />
				</div>
				
			</div>
-->			
		</div>


		<div class="ribbon-tab" id="theme-tab">
			<span class="ribbon-title" style="font-weight:bold;">Barrier Tools</span>
			<div class="ribbon-section">
				<span class="section-title">Stream Tracing</span>
<!--
				<div class="ribbon-button ribbon-button-large ribbon-button" id="btn_flag">
					<span class="button-title">Add<br/>Flag</span>
					<img class="ribbon-icon ribbon-normal" src="icons/flag.png" />
				</div>
-->
				<div class="ribbon-button ribbon-button-large btn_nav_clone" id="btn_nav">
                                        <span class="button-title">Select</span>
                                        <span class="button-help">This button will add a table to your document.</span>
                                        <img class="ribbon-icon ribbon-normal" src="icons/normal/01-pan-zoom.png" />
                                        <img class="ribbon-icon ribbon-disabled" src="icons/disabled/new-table.png" />
                                </div>
				<div class="ribbon-button ribbon-button-large ribbon-button" id="btn_barrier">
					<span class="button-title">Add<br/>Barrier</span>
					<img class="ribbon-icon ribbon-normal" src="icons/barrier.png" />
				</div>
<!--
				<div class="ribbon-button ribbon-button-large no-toggle disabled glfc-button" id="btn_clr_flags">
					<span class="button-title">Clear<br/>All Flags</span>
					<img class="ribbon-icon ribbon-normal" src="icons/flag.png" />
				</div>
-->
				<div class="ribbon-button ribbon-button-large no-toggle disabled glfc-button" id="btn_tracing_run">
					<span class="button-title">Run</br>Trace</span>
					<img class="ribbon-icon ribbon-normal" src="icons/run1.png" />
				</div>
				<div class="ribbon-button ribbon-button-large no-toggle disabled glfc-button" id="btn_clr_barriers">
                                        <span class="button-title">Clear<br/>All Barriers</span>
                                        <img class="ribbon-icon ribbon-normal" src="icons/clear_barriers.png" />
                                </div>
				<div class="ribbon-button ribbon-button-large no-toggle disabled glfc-button" id="btn_clr">
					<span class="button-title">Clear<br/>Trace</span>
					<img class="ribbon-icon ribbon-normal" src="icons/clear_results.png" />
				</div>
			</div>
			<div class="ribbon-section" unselectable="on">
					<span class="section-title">Tracing Type</span>
					<div class="ribbon-button ribbon-button-small no-toggle" id="dv_chup">
					    <span class="button-title"><img src="icons/orange.png"/>&nbsp;Upstream</span>
					    <input type="radio" class="ribbon-icon ribbon-normal" name="rd_trac" checked="checked" value="TRACE_UPSTREAM"/>
					</div>
					<div class="ribbon-button ribbon-button-small no-toggle" id="dv_chdown">
					    <span class="button-title"><img src="icons/yellow.png"/>&nbsp;Downstream</span>
					    <input type="radio" class="ribbon-icon ribbon-normal" name="rd_trac" value="TRACE_DOWNSTREAM"/>
					</div>
			</div>
			<div class="ribbon-section" unselectable="on">
                                <span class="section-title">Shortcuts</span>
				<div class="ribbon-button ribbon-button-large no-toggle glfc-button" id="btn_switch_treatment">
                                    <span class="button-title">Turn On&#47;Off<br/>Treatment Layer</span>
                                    <img class="ribbon-icon ribbon-normal" src="icons/treatment.png" style="width:32px;height:32px;" />
                                </div>
				<div class="ribbon-button ribbon-button-large no-toggle glfc-button" id="btn_switch_treatment2015">
                                    <span class="button-title">Turn On&#47;Off<br/>New Treatment Layer</span>
                                    <img class="ribbon-icon ribbon-normal" src="icons/treatment2015.png" style="width:32px;height:32px;" />
                                </div>
				<div class="ribbon-button ribbon-button-large no-toggle glfc-button" id="btn_switch_trapping">
                                    <span class="button-title">Turn On&#47;Off<br/>Trapping Layer</span>
                                    <img class="ribbon-icon ribbon-normal" src="icons/trapping.png" style="width:32px;height:32px;" />
                                </div>
				<div class="ribbon-button ribbon-button-large glfc-button btn_iden_clone" id="btn_iden_stream">
                                    <span class="button-title">Identify<br/>Stream Segment</span>
                                    <img class="ribbon-icon ribbon-normal" src="icons/normal/15-select-by-click.png" style="width:32px;height:32px;" />
                                </div>
                        </div>
		</div>
	<!--	
		<div class="ribbon-tab file" id="file-tab">
			<span class="ribbon-title">Other Maps Projects</span>
			<div class="ribbon-backstage">
				<div class="button big">
					<img src="icons/normal/open-page.png" alt="Open" />
					<span class="label">Open</span>
					<span class="desc">Open a document from your computer</span>
				</div><br/>
				<div class="button big">
					<img src="icons/normal/save-page.png" alt="Save" />
					<span class="label">Save</span>
					<span class="desc">Save your document to your computer</span>
				</div>
			</div>
		</div>
	-->	
	</div>

<div id="container">
  <div id="inner-container" class="pane ui-layout-center">
    <div class="pane ui-layout-center inner-center" id="map">
      <div id="div_scale"></div>
       
      <div class="infovermap">

	<table>
	  <tr>
	    <td>
	      <span style="font-size:12px;font-weight:bold;">Using Metric:</span>
	    </td>
	    <td>
	      <input type="checkbox" id="chk_metric" style="margin:0;display:none;"/>
	    </td>
	  </tr>
	  <tr>
	    <td>
	      <span style="font-size:12px;font-weight:bold;">Using the Unit:</span>
	    </td>
	    <td>
	      <select id="combo_dist_en" style="display:none;" class="combounit">
		<option value="auto">Automatic</option>
		<option value="mi">Mile</option>
		<option value="ft">Feet</option>
		<option value="in">Inch</option>
	      </select>
	      <select id="combo_dist_met" style="display:none;" class="combounit">
		<option value="auto">Automatic</option>
		<option value="km">Kilometer</option>
		<option value="m">Meter</option>
	      </select>
	      <select id="combo_area_en" style="display:none;" class="combounit">
		<option value="auto">Automatic</option>
		<option value="mi">Square mile</option>
		<option value="ft">Square feet</option>
		<option value="in">Square inch</option>
	      </select>
	      <select id="combo_area_met" style="display:none;" class="combounit">
		<option value="auto">Automatic</option>
		<option value="km">Square kilometer</option>
		<option value="m">Square meter</option>
	      </select>
	    </td>
	  </tr>
	</table>
      <div id="infocontent"></div>
      </div>
<?php
if($showSearch){
?>
      <div class="searchresult" title="Search Result" style="display:none;">
	<div class="sr_content">
	</div>
	<div class="sr_prompt" style="display:none;text-align:center;height:40px;">
	</div>
      </div>
      <div class="searchmap">
	<div class="sw_b">
          <input tabIndex="1" id="txtsearch" type="text" class="sw_qbox defaultTextActive" title="<?php echo isset($config['search_prompt'])?$config['search_prompt']:''; ?>" />
	  <div class="sw_dvdr"></div>
          <button tabIndex="2" id="btnsearch" class="sw_qbtn"></button>
	</div>
      </div>
<?php
}
if(strlen($config['search_php'])>0)
    include($config['search_php']);
if(strlen($config['search_js'])>0)
    writeJsTags($config['search_js']);
?>
      <div class="barovermap">
	<div style="padding-top:8px;margin-bottom:4px;">Base Map</div>
	<div id="bm_arrow" class="arrow-down" style="margin-left:auto;margin-right:auto;"></div>
      </div>
      <ul class="basemap-menu">
	<li><a href="#"><input type="radio" name="rd_bmap" value="OSM Map" /><label class="lrd_bmap" for="OSM Map">Open Street Map</label></a></li>
	<li><a href="#"><input type="radio" name="rd_bmap" value="Google Streets" /><label class="lrd_bmap" for="Google Streets">Google Streets</label></a></li>
	<li><a href="#"><input type="radio" name="rd_bmap" value="Google Physical" /><label class="lrd_bmap" for="Google Physical">Google Terrain</label></a></li>
	<li><a href="#"><input type="radio" name="rd_bmap" value="Google Satellite" /><label class="lrd_bmap" for="Google Satellite">Google Satellite</label></a></li>
        <li><a href="#"><input type="radio" name="rd_bmap" value="Google Hybrid" /><label class="lrd_bmap" for="Google Hybrid">Google Hybrid</label></a></li>
	<!--
        <li><a href="#"><input type="radio" name="rd_bmap" value="Road" /><label class="lrd_bmap" for="Road">Bing Road</label></a></li>
	<li><a href="#"><input type="radio" name="rd_bmap" value="Aerial" /><label class="lrd_bmap" for="Aerial">Bing Aerial</label></a></li>
        <li><a href="#"><input type="radio" name="rd_bmap" value="Hybrid" /><label class="lrd_bmap" for="Hybrid">Bing Hybrid</label></a></li>
	-->
	<li><a href="#"><input type="radio" name="rd_bmap" value="ESRI Ocean" /><label class="lrd_bmap" for="ESRI Ocean">ESRI Ocean</label></a></li>
	<li><a href="#"><input type="radio" name="rd_bmap" value="Nautical Charts" /><label class="lrd_bmap" for="Nautical Charts">Nautical Charts</label></a></li>
	   <!--<li class="ui-state-disabled"><a href="#"><span class="ui-icon ui-icon-print"></span>Print...</a></li>-->
      </ul>   
    </div>
    <div class="pane ui-layout-south inner-south">
	<div id="btn_southclose" class="arrow-down-10" style="float:right;margin:4px;cursor:pointer;"></div>
	<div id="dv_datadlp"></div>
    </div>
  </div>
  <div class="pane ui-layout-west">
    <h3  class="ui-widget-header" style="height:30px;margin:0;">
      <div>
	<button id="btn_desc" class="list_btn" style="margin-left:10px;" title="Map Description"></button>
	<button id="btn_theme" class="list_btn" title="Help"></button>
	<button id="btn_lyr" class="list_btn" title="Layers"></button>
	
      </div>
      <div  id="btn_westclose" style="position:absolute;right:4px;top:6px;margin-right:4px;width:20px;height:20px;cursor:pointer;">
        <div class="arrow-left-g" style="margin-left:auto;margin-right:auto;"></div>
      </div>
    </h3>
    
    <div class="ui-layout-content">
      <div id="dv_desc" style="display:none;padding:8px;overflow:auto;height:100%;">
<?php echo $projectDesc; ?>
      </div>
      <div id="dv_theme" style="display:none;padding:8px;overflow:auto;height:100%;">
      <div id="help">
	<h4>General Instructions/Information</h4>
	<p>The purpose of this decision support system:</p>
	<ol>
	  <li>To provide an interactive map depicting stream reaches protected by barriers  in the Great Lakes Basin.</li>
          <li>To show what portions of the river would be accessible to sea lamprey and other fish species if a barrier is removed.</li>
          <li>To provide tools that show what portions of the river system would be affected if a barrier is added.</li>
	</ol>
	<h4>Tool Instructions</h4>
	<h5><img src="icons/normal/01-pan-zoom.png" height="15" width="15" alt="select tool icon" title="Select"/> Select</h5>
	<p>
		Select can be used to identify an existing barrier <img src="icons/shield.png" height="15" width="15" alt="barrier icon" title="Existing Barrier"/>, 
		treatment location <img src="icons/treatment.png" height="15" width="15" alt="treatment icon" title="Treatment Location"/>, or a virtual 
		barrier <img src="icons/marker-red.png" height="15" width="15" alt="virtual barrier icon" title="Virtual Barrier" /> created using the "Add Barrier" 
		tool and will show the information available for that feature.
	</p>
	<p>Selecting:</p>
	<ul>
	   <li>
		Existing Barrier <img src="icons/shield.png" height="15" width="15" alt="barrier icon" title="Existing Barrier"/> - Provides Name, Water Body, 
		Last Inspection Date, Protected Upstream Distance and Overall Upstream Distance for that feature. 	
  	   </li>
           <li>
		Treatment Point <img src="icons/treatment.png" height="15" width="15" alt="treatment icon" title="Treatment Location"/> - Provides the Stream 
		Name and treatment Years.
           </li>
           <li>
		Virtual Barrier <img src="icons/marker-red.png" height="15" width="15" alt="virtual barrier icon" title="Virtual Barrier" /> - shows the 
		choices available for that barrier, either <em>Remove This Barrier</em> or <em>Mark As Start Point</em> as well as Lat/Long and Up - or - 
		Downstream Distance after running a trace.
           </li>
	</ul>
	<h5><img src="icons/barrier.png" height="15" width="15" alt="add barrier tool icon" title="Add Barrier"/> Add Barrier</h5>
	<p>
		Used to add a virtual barrier <img src="icons/marker-red.png" height="15" width="15" alt="virtual barrier icon" title="Virtual Barrier" /> to 
		the map.  Virtual barriers must be placed within 150m of a river/stream flow line.
	<p>
	<p>Adding Barriers</p>
	<ol>
	   <li>
		Zoom in to river or stream in your area of interest (using the zoom tools in the <em>Map Tools</em> toolbar or scroll wheel on mouse).
	   </li>
	   <li>
		Click on the <em>Add Barrier</em> tool <img src="icons/barrier.png" height="15" width="15" alt="add barrier tool icon" title="Add Barrier"/> in 
		<em>Barrier Tools</em> and click on the location on the stream to add a virtual barrier <img src="icons/marker-red.png" height="15" width="15" 
		alt="virtual barrier icon" title="Virtual Barrier" /> to the map.
	   </li>
	   <li>
		Click on other locations on the flowline to add additional barriers (optional) or skip to step 4. These virtual barriers <img 
		src="icons/marker-red.png" height="15" width="15" alt="virtual barrier icon" title="Virtual Barrier" /> can also be removed by clicking on them 
		and using the <em>Select Barrier</em> tool and choosing <em>Remove This Barrier</em>.
	   </li>
	   <li>
		Before the trace can be ran a virtual barrier must be chosen as the start point. The start point determines where the trace will start 
		to calculate the distance and show the areas on the stream affected by adding a barrier at that location. Click on a barrier then choose 
		<em>Mark as Start Point</em>. The virtual barrier selected as the start point will change color.  <img src="icons/marker-blue.png" height="15" 
		width="15" alt="virtual barrier start point icon" title="Start Point" />
	   </li>
	   <li>
		From the <em>Barrier Tools</em> toolbar select <em>Upstream</em> <img src="icons/orange.png" height="15" width="15" alt="upstream trace tool 
		icon" title="Upstream"/> or <em>Downstream</em> <img src="icons/yellow.png" height="15" width="15" alt="downstream trace tool
                icon" title="Downstream"/> for the direction that will be traced.
	   </li>
	   <li>
		Click on the <em>Run Trace</em> tool <img src="icons/run1.png" height="15" width="15" alt="run trace tool
                icon" title="Upstream"/> to run the model.
	   </li>
	   <li>
		When the <em>Run Trace</em> process completes the flowline of the barrier will be highlighted and a pop-up box will show the latitude and 
		longitude coordinates of the virtual barrier and the amount of distance affected by the barrier.
	   </li>
	</ol>	
	<h5><img src="icons/run1.png" height="15" width="15" alt="run trace icon" title="Run Trace"/> Run Trace</h5>
	<p>
		Models the distance affected either downstream or upstream by user added virtual barriers.
	<p>
		After using the <em>Add Barrier</em> tool to add barriers and choosing a virtual barrier as a start point, click the <em>Run Trace</em> tool to run the 
		model. A pop-up box will indicate the latitude and longitude coordinates of the virtual barrier and the amount of distance upstream or downstream 
		(based on your selection) affected by adding a barrier to that location.
	</p>
	<h5><img src="icons/clear_barriers.png" height="15" width="15" alt="clear all barriers icon" title="Clear All Barriers"/> Clear All Barriers</h5>
	<p>
		Clears all virtual barriers <img src="icons/marker-red.png" height="15" width="15" alt="virtual barrier icon" title="Virtual Barrier" /> <img 
		src="icons/marker-blue.png" height="15" width="15" alt="start point icon" title="Start Point" />
	</p>
	<p>
		Warning: This step cannot be undone. If you do not want to remove all the virtual barriers then use the <em>Select</em> tool and click on each virtual 
		barrier you want removed individually to choose the <em>Remove this barrier</em> option.
	</p>
	<h5><img src="icons/clear_results.png" height="15" width="15" alt="clear trace icon" title="Clear Trace"/> Clear Trace</h5>
	<p>
		Clears the existing trace that was created by selecting an existing barrier or a model created using the <em>Run Trace</em> tool.
	</p>
	<h5><img src="icons/orange.png" height="15" width="15" alt="upstream trace tool icon" title="Upstream"/> <img src="icons/yellow.png" height="15" width="15" 
	alt="downstream trace tool icon" title="Downstream"/> Tracing Type: Upstream/Downstream</h5>
	<p>
		Select <em>Upstream</em> <img src="icons/orange.png" height="15" width="15" alt="upstream trace tool icon" title="Upstream"/> to get the length of the 
		hydrography network in the upstream direction of a modeled barrier or <em>Downstream</em> <img src="icons/yellow.png" height="15" width="15" 
		alt="downstream trace tool icon" title="Downstream"/> to get the length of the hydrography network in the downstream direction of a modeled barrier.
	</p>
	<h5><img src="icons/treatment.png" height="15" width="15" alt="treatment layer tool icon" title="Turn On/Off Treatment Layer"/> Turn On/Off Treatment 
	Layer</h5>
	<p>
		Turns the <em>Treatment Layer</em> on or off.
	</p>
	<p>
		The <em>Treatment Layer</em> provides icons at the mouth of streams that have been treated to reduce sea lamprey populations. 
	</p>

      </div>
      </div>
      <div id="west_accordion">
	<h3><span class="lyrtabtitle">Layer List</span><span class="sp_vislyr"><input type="checkbox" id="chk_vis" />Active Layers Only</span></h3>
	<div id="div_lyr">
	  <div id="div_lyr_vis">
	      <div>
		
	      </div>
<?php
    echo sprintf('<div style="display:none;" id="dv_usr_lyrlst"><div class="lyr-cat-head"><div class="%s"></div><span class="lyr-cat-txt" id="sp_usr_lyr_txt">%s</span></div><table style="width:100%%;"></table></div>','arrow-down-lyr','My Layers');
    foreach($lyrGroup as $c=>$l){
	echo sprintf('<div><div class="lyr-cat-head"><div class="%s"></div><span class="lyr-cat-txt">%s</span></div>',$cats[$c]?'arrow-down-lyr':'arrow-right-lyr',$c);
	echo sprintf('<table %s>',$cats[$c]?'':'style="display:none;"');
	for($i=0,$len=count($l);$i<$len;++$i)
	    echo sprintf('<tr><td><a style="padding-left:6px;" target="_blank" href="%s">%s</a></td><td style="width:10%%;"><input type="checkbox" class="chk_lyr_vis" value="%s" style="margin:0;display:none;" %s /></td></tr>',$l[$i]['meta'],$l[$i]['name'],$l[$i]['name'],$l[$i]['visible']=='true'?'checked="checked"':'');
	echo '</table></div>';
    }
?>
	  </div>
	  <div id="div_lyr_others" style="display:none;"></div>
	</div>
	
	<h3>Layer Legends</h3>
	<div id="div_lyr_legend">
	    
	</div>
      </div>
    </div>
  </div>
</div>

<div class="growlUI" style="display:none">
            <h2>Loading......</h2>
   
</div>
<div class="dv_promp" style="display:none" title="You may want to know...">
</div>
</body>
