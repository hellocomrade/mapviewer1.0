GLIN.GIS.Test=(function(){
    var oneEvent=function(){
        alert('original');
    };
    var testevent=new GLIN.GIS.Events();
    return{
        mark:"mark",
        oneEvent:oneEvent,
	TestEvent:testevent,
	FireEvent:function(){
	    events=testevent.GetEvents('TestEvent');
	    if(events!=null){
		for(var i=0,len=events.length;i<len;++i)
		    events[i]();
	    }
		
	}
    }
});
