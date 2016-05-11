GLIN.GIS.Events=(function(){
    var listeners={};
    return {
	AddEvent: function(eventname,handler){
		      if(handler==null||handler=="")return;
		      if(listeners[eventname]==null)
			  listeners[eventname]=[];
		      listeners[eventname].push(handler);	
		  },
	RemoveEvent: function(eventname,handler){
			if(handler==null||handler==""||listeners[eventname]==null)return;
			for(var i=0,len=listeners[eventname].length;i<len;++i){
			    if(listeners[eventname][i]==handler){
			        listeners[eventname].splice(i,1);
				break;
			    }
			}
		  },
	GetEvents: function(eventname){
	    	       return listeners[eventname];
		  },
	Invoke: function(eventname){
		       var events=listeners[eventname];
		       if(events!=null)
			   for(var i=0,len=events.length;i<len;++i)
			   {
			       if(arguments.length>1)
			       {
				   var args=Array.prototype.slice.call(arguments);
				   events[i].apply(this,args.slice(1,args.length));
			       }
			       else	
			           events[i]();
			   }
		  }
    };
});
