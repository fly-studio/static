(function () {
    if (/debug=true/.test(window.location) || localStorage.getItem('active-eruda') == 'true') {
    	var scripts = document.getElementsByTagName('script');
		var thiscript = scripts[ scripts.length - 1 ];
		var baseuri = thiscript.src.toString().match(/[^\/:](\/.*)static\/js\/debug\/eruda.debug\.js/i)[1];
		if (!baseuri) baseuri = '/';
		var script = document.createElement('script');
		script.src = baseuri + 'static/js/debug/eruda.min.js';
		script.onload = function(){
			/*var script1 = document.createElement('script');
			script1.src = baseuri + 'static/js/debug/eruda-fps.min.js';
			document.getElementsByTagName('head')[0].appendChild(script1);*/
		}
		document.getElementsByTagName('head')[0].appendChild(script);
	}
})();
