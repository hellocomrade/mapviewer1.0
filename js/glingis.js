if(window.GLIN==null)
    window.GLIN={};
(function(){
    var scriptName='glingis.js';
    var jsFiles = window.GLIN.GIS;

    window.GLIN.GIS={
        _getScriptLocation: (function() {
            var r = new RegExp("(^|(.*?\\/))(" + scriptName + ")(\\?|$)"),
            s = document.getElementsByTagName('script'),
            src, m, l = "";
            for(var i=0, len=s.length; i<len; i++) {
                src = s[i].getAttribute('src');
                if(src) {
                    var m = src.match(r);
                    if(m) {
                        l = m[1];
                        break;
                    }
                }
            }
            return (function() { return l; });
        })()
    };
    if(!jsFiles){
        jsFiles=[
		"GLINGIS/ribbon/ribbon.js",
		"GLINGIS/jquery.layout-latest.min.js",
		"GLINGIS/ribbon/iphone-style-checkboxes.js",
		"GLINGIS/jquery.layout.accordions.resize.js",
		"GLINGIS/jquery.ui.touch-punch.js",
		"GLINGIS/jquery.ui.combobox.js",
		"GLINGIS/jquery.blockUI.js",
		"GLINGIS/jquery.pajinate.min.js",
		"GLINGIS/icheck/jquery.icheck.min.js",
		//"GLINGIS/datatable194/media/js/jquery.dataTables.min.js",
		//"GLINGIS/test.js",
		"GLINGIS/AnimatedCluster.js",
		"GLINGIS/tablesorter/jquery.tablesorter.min.js",
		"GLINGIS/poly2tri.js",
		"GLINGIS/events.js",
		"GLINGIS/viewer.js",
		"GLINGIS/ui.js"
		];
    }
    var scriptTags=new Array(jsFiles.length);
    var host=GLIN.GIS._getScriptLocation();
    for(var i=0,len=jsFiles.length;i<len;++i){
        scriptTags[i]="<script src='"+host+jsFiles[i]+"'></script>";
    }
    if(scriptTags.length>0)
	document.write(scriptTags.join(""))
})();
