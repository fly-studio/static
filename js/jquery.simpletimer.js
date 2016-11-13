/**
 * timer class
 * 
 * @Author:Fly Mirage
 * @Date:2010-02-23
 * @Version:1.3
 *
 * @History:
 * ----------------------------------------------
 * v1.4		2016-11-13
 * # Fix, support jQuery 2 / 1.10, newst browser
 * # use async of ajax
 * # optimize methods
 * ----------------------------------------------
 * v1.3		2010-04-01
 * # Fix,ajax "dataType"
 * # Add,function "simpleCountdown"
 * ----------------------------------------------
 * v1.2		2010-03-22
 * # Fix,ajax file of cross-domain
 * ----------------------------------------------
 * v1.1		2010-03-04
 * # Add, get server time of header with ajax
 * ----------------------------------------------
 * v1.0		2010-02-23
 * # get server time with SSI
 * # Create it
 * 
 */
/**
 * <div data-target="02/28/2020 00:00:00" id="dom"></div>
 * @example start count down (auto stop)
 * $('#dom').simpleCountdown('%D days %H hours %M minutes %S seconds');
 * @example stop count down
 * $('#dom').simpleCountdown(true);
 * 
 * @param format (string): ['%H:%M:%S'] see $.simpletimer.toLimitString
 * @param millisec (integer,ms): [500], how long updating the countdown once
 * @param autoStop (boolean): [true], auto stop when countdown < 0
 */
(function($){
	var array_weeks = [
		'Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday',
		'Sun','Mon','Tue','Wed','Thu','Fri','Sat',
		'&#26085;','&#19968;','&#20108;','&#19977;','&#22235;','&#20116;','&#20845;'
	];
	var array_months = [
		'','January','February','March','April','May','June','July','August','September','October','November','December',
		'Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sept','Oct','Nov','Dec'
	];
	function getHost(url) {
		var r, re,s = '';
		url += '/';
		re = /:?\/\/(.[^/]*)\//ig;
		r = url.match(re);
		if (r.length >= 0 || r.index >= 0) {
			s = r[0].replace(/:?\/\//g,'');
			s = s.replace('/','');
		}
		return s;
	}
	var script = document.currentScript;
	if (typeof document.currentScript == 'undefined')
	{
		var scripts = document.getElementsByTagName("script");
		script = scripts[ scripts.length - 1 ];
	}
	var host = getHost(script.src);
	var ajaxURL = window.location.host != host ? window.location.href : script.src; //if js's path is crossdomain, turn it to location.href

	var number_pad = function(num, n) {
		return (new Array(n >(''+num).length ? (n - (''+num).length+1) : 0).join('0') + num);
	}
	$.simpletimer = {
		serverClientDelta: false,
		getDate: function(time){
			var t = time;
			if (!(time instanceof Date)){
				if (!isNaN(time)) time = parseInt(time);
				t = new Date(time);
				if (isNaN(t.getTime()))
					t = new Date();
			}
			return t;
		},
		getCountdown: function(delta, target){
			target = this.getDate(target);
			var cd = target.getTime() - ((new Date()).getTime() + delta);
			return cd;
		},
		toLimitString: function(limite_ms, format){
			var d, h, m, s, ms, minus=false;
			//if (limite_ms < 0) minus = true;
			limite_ms = Math.abs(parseInt(limite_ms));
			var t = parseInt(limite_ms / 1000);
			d = parseInt(t / 60 / 60 / 24);
			if (format.indexOf('%D') < 0) d = 0;
			h = parseInt(t / 60 / 60 - d * 24);
			if (format.indexOf('%H') < 0) h = 0;
			m = parseInt(t / 60 - d * 24 * 60 - h * 60);
			if (format.indexOf('%M') < 0) m = 0;
			s = t - d * 24 * 60 * 60 - h * 60 * 60 - m * 60;
			ms = limite_ms - t * 1000;
			var f = format.replace(/%S/g, number_pad(s,2));//Second
			f = f.replace(/%s/g, t.toString());//Stamp
			f = f.replace(/%MS/g, ms.toString());//Millisecond
			f = f.replace(/%ms/g, limite_ms.toString());//Millisecond Stamp
			f = f.replace(/%M/g, number_pad(m, 2));//Minute
			f = f.replace(/%H/g, number_pad(h, 2));//Hour
			f = f.replace(/%D/g, number_pad(d, 2));//Day
			return f;
		},
		toTimeString: function(time, format){
			var dt = this.getDate(time);
			var y, m, d, h, i, s, ms, w, t;
			y = dt.getFullYear(); m = dt.getMonth() + 1; d = dt.getDate();
			h = dt.getHours(); i = dt.getMinutes(); s = dt.getSeconds();
			ms = dt.getMilliseconds(); w = dt.getDay(); t = parseInt(dt.getTime() / 1000);

			var f = format.replace(/%S/g, number_pad(s,2));//Second
			f = f.replace(/%s/g, t.toString());//Stamp
			f = f.replace(/%MS/g, ms.toString());//Millisecond
			f = f.replace(/%M/g, number_pad(i, 2));//Minute
			f = f.replace(/%H/g, number_pad(h, 2));//Hour
			f = f.replace(/%D/g, number_pad(d, 2));//Day
			f = f.replace(/%m/g, number_pad(m, 2));//Month(Int)
			f = f.replace(/%B/g, array_months[m]);//January
			f = f.replace(/%b/g, array_months[m + 12]);//Jan
			f = f.replace(/%Y/g, y.toString());//Year
			f = f.replace(/%W/g, w.toString());//Week(Int)
			f = f.replace(/%A/g, array_weeks[w]);//Monday
			f = f.replace(/%a/g, array_weeks[w + 7]);//Mon
			return f;
		},
		setDelta: function(delta){
			this.serverClientDelta = delta;
		},
		getDelta: function(){
			return this.serverClientDelta;
		},
		setDeltaSSI: function(datestr){
			/*<!--#config timefmt="%m/%d/%Y %H:%M:%S" -->*/
			var ssi = this.getDate(datestr);
			var delta = ssi.getTime() - (new Date()).getTime();
			this.serverClientDelta = delta;
			return delta;
		}
	};
	$.fn.extend({simpleCountdown: function(format, millisec, autoStop){
		if (typeof format == 'undefined') format = '%H:%M:%S';
		if (typeof autoStop == 'undefined') autoStop = true;
		if (typeof millisec == 'undefined') millisec = 500;

		return this.each(function(){
			var t = $(this);
			var method = {};
			method.countdown = function(){
				if ($.simpletimer.getDelta() === false)
					return t.html('Synchronizing server\'s time.');
				var ms = $.simpletimer.getCountdown($.simpletimer.getDelta(), t.data('target'));
				if (ms < 0 && autoStop) {
					t.triggerHandler('simple.timer.overflow');
					return method.stopCountDown();
				};
				t.html($.simpletimer.toLimitString(ms, format));
				t.triggerHandler('simple.timer.progress', [ms]);
			}
			method.startCountDown = function(){
				method.stopCountDown();
				t.data({simpleCountdown: setInterval(method.countdown, millisec)});
				t.triggerHandler('simple.timer.started');
			}
			method.stopCountDown = function(){
				var interval = t.data('simpleCountdown');
				if (typeof interval != 'undefined')
					clearInterval(interval);
				t.triggerHandler('simple.timer.stoped');
			}
			if (format === true) method.stopCountDown(); else method.startCountDown();
		});
	}
	});
	function XMLHttpRequest2Delta(XMLHttpRequest){
		var date = XMLHttpRequest.getResponseHeader('Date');
		date = $.simpletimer.getDate(date);
		var now = new Date();
		var delta = date.getTime() - now.getTime();
		$.simpletimer.setDelta(delta);
	}
	if ('<!--#set var="simpletimer" value="Server Side Includes"--><!--#echo var="simpletimer"-->' == 'Server Side Includes') //SSI support
		$.simpletimer.setDeltaSSI('<!--#echo var="DATE_LOCAL" -->');
	else{
		$.ajax({
			url: ajaxURL,
			type: 'GET',
			cache: false,
			async: true,
			dataType: 'text',
			success: function(data, textStatus, jqXHR){
				XMLHttpRequest2Delta(jqXHR);
			},
			error:function(XMLHttpRequest, textStatus, errorThrown) {
				XMLHttpRequest2Delta(XMLHttpRequest);
			},
			timeout:5000
		});
	}
	
})(jQuery);