/**
 * Like ie's queue.
 * 
 * @Author:Fly Mirage
 * @Date:2009-12-21
 * @Version:1.7
 *
 * @History:
 * v1.7		2011-05-14
 * # Fix,IE 8's "float" style is clear in standards mode (after MS KBxxxxxx)
 * ----------------------------------------------
 * v1.6		2010-11-18
 * # Change, js file's name to "simplequeue",variant "p.controlroll" to "p.isControlRoll"
 * # Change, variant "btn_forware_direction/btn_negative_direction"  to "btn_prev/btn_next"
 * # Exchange the direction of "btn_prev" and "btn_next"
 * # Pack the method "p.controlroll"
 * ----------------------------------------------
 * v1.5		2010-02-22
 * # remove direction "roll"
 * # add param "animate"(so,it rolls with any direction),"control"(button control queue)
 * # Fix,the really scrollwidth(scrollheight)
 * ----------------------------------------------
 * v1.4		2010-02-02
 * # Tip/Fix,inline-block style's bug
 * ----------------------------------------------
 * v1.3		2010-01-27
 * # add css to "head" only once
 * # add direction "roll":a rolling animate,up only
 * ----------------------------------------------
 * v1.2		2010-01-26
 * # Fix,$.fn.xxxx,the variant inside is global of jquery
 * ----------------------------------------------
 * v1.1		2010-01-21
 * # Fix,clear timeout's object before the function of "startRoll"
 * ----------------------------------------------
 * v1.0		2009-12-21
 * # Create it
 * 
 */
 
/**
 * @param direction (string): [up]|down|left|right
 * @param mouseoverStop (boolean): [false]|true, if mouseover then stop the queue(animate donot stop)
 * @param movePixel (integer): [2], what pixel do queue move once
 * @param moveDuration (integer,ms): [100], what's queue's interval
 * @param animate (boolean): [false]|true, its invalid when moveDuration <= 500 or movePixel < 12
 * @param control (object): control the queue with buttons
 *					enabled (boolean): [false]|true
 *					autorun (boolean): [false]|true
 *					movePixel (integer): [@param movePixel],what pixel do queue move that button clicked
 *					animate (boolean): [true]|false, its invalid when control.movePixel < 12
 *					btn_prev (jquery object): [null], the button of forward direction(@param direction)
 *					btn_next (jquery object): [null], the button of negative direction
 *
 */
(function($){
	var queueCSS = false;
	$.fn.extend({simplequeue : function(direction,mouseoverStop,movePixel,moveDuration,animate,control) {
		if (!queueCSS) {
			var isIE = !!window.ActiveXObject;var isIE6 = isIE && !window.XMLHttpRequest;var isIE8 = isIE && !!document.documentMode && (document.documentMode == 8);var isIE7 = isIE && !isIE6 && !isIE8;
			if (isIE6 || isIE7) { //ie6 | ie7 | ie8 not in standards mode
				$('<style type="text/css">ul.simplequeue {overflow:hidden;}ul.simplequeue_left,ul.simplequeue_right {padding:0;}.simplequeue_left li,.simplequeue_right li{float:left;clear:right;_display:inline;}</style>').appendTo('head');
				$('<!--ie6 | ie7 | ie8 not in standards mode-->').appendTo('head');
			} else {
				$('head').append('<style type="text/css">ul.simplequeue {overflow:hidden;}ul.simplequeue_left,ul.simplequeue_right {white-space:nowrap;padding:0;}.simplequeue_left li,.simplequeue_right li{display:inline-block;}</style>');
				$('<!--ie8+ | w3c-->').appendTo('head');
			/* inline-block style,ff will count the space's width
			 * <li></li> and <li></li>,no space,no tab.no crlf between these.
			 * error:<li>content1</li> \t\r\n <li>content2</li>
			 * right:<li>content1</li><li>content2</li>
			 */
			}
			queueCSS = true;
		}
		
		var c = this;
		if (!c[0]) {
			//throw('Object is error!');
			return c;
		};
		if (!c.is('ul')) {
			throw('Object isnot UL,LI');
			return c;
		};
		c.addClass('simplequeue simplequeue_' + direction);
		/*Fix the parameters*/
		movePixel = isNaN(movePixel) ? 2 : parseInt(movePixel);
		movePixel = movePixel < 1 ? (direction == 'left' || direction == 'right' ? c.width() : c.height()) : movePixel;
		var moveDuration = isNaN(moveDuration) ? 100 : parseInt(moveDuration);
		moveDuration = moveDuration < 10 ? 10 : moveDuration;
		if (moveDuration <= 500 || movePixel < 12) 
			animate = false;
		var ctrl = { /*control default config*/
			enabled:false,
			autorun:false,
			movePixel:movePixel,
			animate:true,
			btn_prev:null,
			btn_next:null,
			/*private*/
			forward:direction,
			negative:'',
			direction:''
		};
		ctrl = $.extend(ctrl,control);
		ctrl.forward = direction;
		switch(direction){
			case 'left':ctrl.negative = 'right';break;
			case 'right':ctrl.negative = 'left';break;
			case 'down':ctrl.negative = 'up';break;
			default:ctrl.negative = 'down';break;
		}
		if (ctrl.movePixel < 12) 
			ctrl.animate = false;
		
		/*Clone the children*/
		var breakpoint = false;var count = 1;
		//c.html(c.html().replace(/<\/li>[\s\t\n]*<li>/ig,'</li><li>'));
		var tmp = c.children().clone(true);/*fixed inline-block style's bug*/
		c.empty().append(tmp);
		var rect = {w:c[0].scrollWidth,h:c[0].scrollHeight};
		while(!breakpoint) {
			tmp.clone(true).attr('clones','true').appendTo(c);/*.each(function(){
				var t = $(this);
				t.text(t.text() + ' clone');
			});*/
			rect.mw = c[0].scrollWidth;//modified scroll width
			rect.mh = c[0].scrollHeight;
			//alert(rect.mh + '' + rect.h);
			switch(direction) {
				case 'left':
				case 'right':
					if ((rect.mw > rect.w) && (rect.mw / rect.w >= 2))
						breakpoint = true;
					break;
				default: //down,up,roll
					if ((rect.mh > rect.h) && (rect.mh / rect.h >= 2))
						breakpoint = true;
					break;
			}
			if (++count > 5) breakpoint = true;
		}
		rect.rw = rect.mw - c.width(); //really scroll width
		rect.rh = rect.mh - c.height();
		//rect.w = rect.mw / count;
		//rect.h = rect.mh / count;
		switch (direction){
			case 'down':
				c.scrollTop(rect.rh);
				break;
			case 'left':
				c.scrollLeft(0);
				break;
			case 'right':
				c.scrollLeft(rect.rw);
				break;
			default: //up,roll
				c.scrollTop(0);
				break;
		}
		/*global variant*/
		var p = {};
		p.interval = null;
		p.isControlRoll = false;
		p.restart_method = function(){//default null;
		}
		/*Method roll */
		p.rolling = function(){
			var an = animate;
			var dir = direction;
			var mp = movePixel;
			if (p.isControlRoll){
				an = ctrl.animate;
				dir = ctrl.direction;
				mp = ctrl.movePixel;
			}
			switch(dir) {
				case 'down':
					var delta = c.scrollTop() - mp;
					if (delta < 0){ //overflow
						c.scrollTop(c.scrollTop() + rect.h);
						delta = c.scrollTop() - mp;//alert(delta);
					}
					if (an)
						c.stop(true,true).animate({scrollTop:delta},'normal','linear',function(){
							if (rect.rh - delta >= rect.h){
								c.scrollTop(delta + rect.h);
							}
							p.restart_method();
						});
					else {
						c.scrollTop(delta);
						if (rect.rh - delta >= rect.h)
							c.scrollTop(delta + rect.h);
						p.restart_method();
					}
					break;
				case 'left':
					var delta = c.scrollLeft() + mp;
					if (delta + mp > rect.mw){ //overflow
						c.scrollLeft(c.scrollLeft() - rect.w);
						delta = c.scrollLeft() + mp;
					}
					if (an)
						c.stop(true,true).animate({scrollLeft:delta},'normal','linear',function(){
							if (delta >= rect.w) 
								c.scrollLeft(delta - rect.w);
							p.restart_method();
						});
					else {
						c.scrollLeft(delta);
						if (delta >= rect.w)
							c.scrollLeft(delta - rect.w);
						p.restart_method();
					}
					break;
				case 'right':
					var delta = c.scrollLeft() - mp;
					if (delta < 0){ //overflow
						c.scrollLeft(c.scrollLeft() + rect.w);
						delta = c.scrollLeft() - mp;
					}
					if (an)
						c.stop(true,true).animate({scrollLeft:delta},'normal','linear',function(){
							if (rect.rw - delta >= rect.w){
								c.scrollTop(delta + rect.w);
							}
							p.restart_method();
						});
					else {
						c.scrollLeft(delta);
						if (delta + rect.w <= rect.w)
							c.scrollLeft(delta + rect.w);
						p.restart_method();
					}
					break;
				default:
					var delta = c.scrollTop() + mp;
					if (delta + mp > rect.mh){ //overflow
						c.scrollTop(c.scrollTop() - rect.h);
						delta = c.scrollTop() + mp;
					}
					if (an)
						c.stop(true,true).animate({scrollTop:delta},'normal', 'linear',function(){
							if (delta >= rect.h)
								c.scrollTop(delta - rect.h);
							p.restart_method();
						});
					else {
						c.scrollTop(delta);
						if (delta >= rect.h)
							c.scrollTop(delta - rect.h);
						p.restart_method();
					}
					break;
			}
		}

		p.stopRoll = function(){
			clearInterval(p.interval);
		}
		p.startRoll = function(){
			clearInterval(p.interval);
			p.isControlRoll = false;
			p.restart_method = function(){};
			p.interval = setInterval(p.rolling,moveDuration);
		}
		p.controlroll = function(direction) {
			ctrl.direction = direction;
			p.isControlRoll = true;
			p.stopRoll();
			if (ctrl.autorun)
				p.restart_method = p.startRoll;
			else
				p.restart_method = function(){p.isControlRoll = false;};
			p.rolling();
		}
		if (mouseoverStop) {
			c.hover(function(){ //Hover Stop
				p.stopRoll();
			},function(){
				if (!ctrl.enabled || (ctrl.enabled && ctrl.autorun))
					p.startRoll();
			});
		}
		if (!ctrl.enabled || (ctrl.enabled && ctrl.autorun))
			p.startRoll(); //autorun
			
		if (ctrl.enabled) {
			$(ctrl.btn_next).click(function(){
				p.controlroll(ctrl.forward);
			});
			
			$(ctrl.btn_prev).click(function(){
				p.controlroll(ctrl.negative);
			});
		}
		return c;
	}
	});
})(jQuery);