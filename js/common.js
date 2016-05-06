/**
 * @author Fly Mirage
 * 
 */

var COMMON_LANGUAGE = {
	'tips' : '\u63d0\u793a', //提示
	'ok' : '\u786e\u5b9a', //确定
	'cancel' : '\u53d6\u6d88', //取消
	'back' : '\u8fd4\u56de', //返回
	'reload' : '\u91cd\u65b0\u8f7d\u5165', //重新载入
	'redirect' : '\u9875\u9762\u8df3\u8f6c', //页面跳转
	'unselected' : '\u8bf7\u81f3\u5c11\u9009\u62e9\u4e00\u9879\uff01', //请至少选择一项！
	'network_timeout' : '\u7f51\u7edc\u6545\u969c\uff0c\u8bf7\u68c0\u67e5\u7f51\u7edc\u8fde\u63a5\u540e\u91cd\u8bd5\uff01', //网络故障，请检查网络连接后重试！
	'parser_error' : '\u6570\u636e\u89e3\u6790\u5931\u8d25\uff0c\u5237\u65b0\u91cd\u8bd5\u4e0b\uff1f', //数据解析失败，刷新重试下？
	'server_error' : '\u670d\u52a1\u5668\u53ef\u80fd\u51fa\u73b0\u4e86\u70b9\u95ee\u9898\uff0c\u5237\u65b0\u9875\u9762\u91cd\u8bd5\u4e0b\uff1f' //服务器可能出现了点问题，刷新页面重试下？
};
/**
 * Avoid `console` errors in browsers that lack a console 
 * IE 6,7没有console，此处仅仅为了修复报错。
 */
(function(){var e;var t=function(){};var n=["assert","clear","count","debug","dir","dirxml","error","exception","group","groupCollapsed","groupEnd","info","log","markTimeline","profile","profileEnd","table","time","timeEnd","timeStamp","trace","warn"];var r=n.length;var i=window.console=window.console||{};while(r--){e=n[r];if(!i[e]){i[e]=t}}})();
// 解决浏览器无requestAnimationFrame的情况
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
// MIT license
(function() {
	var lastTime = 0;
	var vendors = ['ms', 'moz', 'webkit', 'o'];
	for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
		window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
		window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
	}
	if (!window.requestAnimationFrame) window.requestAnimationFrame = function(callback, element) {
		var currTime = new Date().getTime();
		var timeToCall = Math.max(0, 16 - (currTime - lastTime));
		var id = window.setTimeout(function() {
			callback(currTime + timeToCall);
		}, timeToCall);
		lastTime = currTime + timeToCall;
		return id;
	};
	if (!window.cancelAnimationFrame) window.cancelAnimationFrame = function(id) {
		clearTimeout(id);
	};
}());
/**
 * 模拟继承
 *
 * 基类 function A(){}; A.protype.setXX = function(){};
 * 子类
 * function B(){
 * 		 base(this, A, []); //加载第一行，表示继承a类
 * 		 ...
 * };
 * var b = new B(); b.setXX(); //可以使用父级的方法
 * 
 * @param  {Object} derive     子类，一般为this
 * @param  {Object} baseSprite 基类
 * @param  {Object} baseArgs   需要传递的参数
 */
function base(derive, baseSprite, baseArgs){  
	var r = baseSprite.apply(derive, baseArgs);
	  
	for(prop in baseSprite.prototype){  
		var proto = derive.constructor.prototype;  
		if(!proto[prop])
			proto[prop] = baseSprite.prototype[prop];   
	}
	return r;  
}
/**
 * Clone 一个Object，类似PHP等语言的clone
 * 类似于上例base
 * 
 * @param  {Object} obj 源
 * @return {Object}     
 */
function clone(obj) {
	var o;
	if (typeof obj == "object") {
		if (obj === null) {
			o = null;
		} else {
			if (obj instanceof Array) {
				o = [];
				for (var i = 0, len = obj.length; i < len; i++)
					o.push(clone(obj[i]));
			} else {
				o = {};
				for (var j in obj)
					o[j] = clone(obj[j]);
			}
		}
	} else {
		o = obj;
	}
	return o;
};
/**
 * 查找数组中的项，返回下标，没有找到返回-1
 * [1,2,3].indexOf(2);  ==> 1
 */
if (!Array.prototype.indexOf) {
	Array.prototype.indexOf = function (searchElement, fromIndex) {
		if ( this === undefined || this === null ) {
			throw new TypeError( '"this" is null or not defined' );
		}
		var length = this.length >>> 0; // Hack to convert object.length to a UInt32
		fromIndex = +fromIndex || 0;
		if (Math.abs(fromIndex) === Infinity) {
			fromIndex = 0;
		}
		if (fromIndex < 0) {
			fromIndex += length;
			if (fromIndex < 0) {
				fromIndex = 0;
			}
		}
		for (;fromIndex < length; fromIndex++) {
			if (this[fromIndex] === searchElement)
				return fromIndex;
		}
		return -1;
	};
}
/**
 * 循环数组中的项，遇到return false则停止循环
 * 
 * [1,2,3].forEach(function(value, key, arr){
 * 		//return false
 * });
 */
if (!Array.prototype.forEach) {
	Array.prototype.forEach = function(func /*, thisp*/) {
		if (typeof func != "function") throw new TypeError();
		var thisp = arguments[1];
		for (var i = 0, n = this.length; i < n; i++) {
			if (i in this)
				if (func.apply(thisp, [this[i], i, this]) === false) break;
		}
	};
}
/**
 * 循环数组中的项，并可以修改其值，然后返回新数据
 * var result = [1,2,3].forEach(function(value, key, arr){
 * 		return value * 2;
 * });
 * 返回 [2,4,6]
 */
if (!Array.prototype.map) {
	Array.prototype.map = function(fun /*, thisp*/) {
		var len = this.length;
		if (typeof fun != "function")
			throw new TypeError();
	
		var res = new Array(len);
		var thisp = arguments[1];
		for (var i = 0; i < len; i++) {
			if (i in this)
				res[i] = fun.call(thisp, this[i], i, this);
		}
		return res;
	};
}
/**
 * 数组中数字相加的总数
 * [1,2,3].sum();
 * 返回 6
 */
if (!Array.prototype.sum) {
	Array.prototype.sum = function() {
		var sum = 0;
		for (key in this) {
			if (!isNaN(parseFloat(this[key])))
				sum += parseFloat(this[key]);
		}
		return sum;
	};
}
/**
 * 重复本字符串
 * var str = '123'.repeat(5);
 * 返回 '123123123123123'
 * 
 * @param  {Number} len 循环次数
 * @return {String}
 */
if (!String.prototype.repeat) {
	String.prototype.repeat = function(len) {
		var orginal = this;
		var str = this;
		while (str.length < len) {
			str += orginal;
		}
		str = str.substr(0, len);
		return str;
	};
}
/**
 * 将一个Array或者Object按树形结构alert出来、或返回
 * 
 * @param  {Objbect/Array} array      传入的数组或者对象
 * @param  {Boolean} return_val 是否返回，默认是alert出
 * @return {String}             树形结构
 */
function print_r(array, return_val) {
	var output = '',
	pad_char = ' ',
	pad_val = 4,
	d = this.window.document,
	getFuncName = function(fn) {
		var name = (/\W*function\s+([\w\$]+)\s*\(/).exec(fn);
		if (!name) return '(Anonymous)';
		return name[1];
	};
	repeat_char = function(len, pad_char) {
		var str = '';
		for (var i = 0; i < len; i++) 
			str += pad_char;
		return str;
	};
	formatArray = function(obj, cur_depth, pad_val, pad_char) {
		if (cur_depth > 0)
			cur_depth++;

		var base_pad = repeat_char(pad_val * cur_depth, pad_char);
		var thick_pad = repeat_char(pad_val * (cur_depth + 1), pad_char);
		var str = '';

		if (typeof obj === 'object' && obj !== null && obj.constructor && getFuncName(obj.constructor) !== 'PHPJS_Resource') {
			str += 'Array\n' + base_pad + '(\n';
			for (var key in obj) {
				if (Object.prototype.toString.call(obj[key]) === '[object Array]')
					str += thick_pad + '[' + key + '] => ' + formatArray(obj[key], cur_depth + 1, pad_val, pad_char);
				else 
					str += thick_pad + '[' + key + '] => ' + obj[key] + '\n';
			}
			str += base_pad + ')\n';
		} else if (obj === null || obj === undefined)
			str = '';
		else // for our "resource" class
			str = obj.toString();
		return str;
	};

	output = formatArray(array, 0, pad_val, pad_char);
	if (return_val !== true) {
		alert(output);
		return true;
	}
	return output;
}
/**
 * 改变Object的Key的大小写，本函数和PHP一样
 * 
 * @param  {Object} array 输入的Object
 * @param {String} [varname] 'CASE_LOWER' 小写，其它大写
 * @return {Object}                       返回Key已经大小写的Object
 */
function array_change_key_case(a,b){var c,d,e={};if("[object Array]"===Object.prototype.toString.call(a))return a;if(a&&"object"==typeof a&&a.change_key_case)return a.change_key_case(b);if(a&&"object"==typeof a){c=b&&"CASE_LOWER"!==b?"toUpperCase":"toLowerCase";for(d in a)e[d[c]()]=a[d];return e}return!1}function array_chunk(a,b,c){var d,e="",f=0,g=-1,h=a.length||0,i=[];if(1>b)return null;if("[object Array]"===Object.prototype.toString.call(a))if(c)for(;h>f;)(d=f%b)?i[g][f]=a[f]:i[++g]={},i[g][f]=a[f],f++;else for(;h>f;)(d=f%b)?i[g][d]=a[f]:i[++g]=[a[f]],f++;else if(c)for(e in a)a.hasOwnProperty(e)&&((d=f%b)?i[g][e]=a[e]:i[++g]={},i[g][e]=a[e],f++);else for(e in a)a.hasOwnProperty(e)&&((d=f%b)?i[g][d]=a[e]:i[++g]=[a[e]],f++);return i}function array_combine(a,b){var c={},d=a&&a.length,e=0;if("object"!=typeof a||"object"!=typeof b||"number"!=typeof d||"number"!=typeof b.length||!d)return!1;if(d!=b.length)return!1;for(e=0;d>e;e++)c[a[e]]=b[e];return c}function array_count_values(a){var b={},c="",d="",e=function(a){var b=typeof a;return b=b.toLowerCase(),"object"===b&&(b="array"),b},f=function(a,b){switch(typeof b){case"number":if(Math.floor(b)!==b)return;case"string":b in a&&a.hasOwnProperty(b)?++a[b]:a[b]=1}};if(d=e(a),"array"===d)for(c in a)a.hasOwnProperty(c)&&f.call(this,b,a[c]);return b}function array_diff(a){var b={},c=arguments.length,d="",e=1,f="",g={};a:for(d in a)for(e=1;c>e;e++){g=arguments[e];for(f in g)if(g[f]===a[d])continue a;b[d]=a[d]}return b}function array_diff_assoc(a){var b={},c=arguments.length,d="",e=1,f="",g={};a:for(d in a)for(e=1;c>e;e++){g=arguments[e];for(f in g)if(g[f]===a[d]&&f===d)continue a;b[d]=a[d]}return b}function array_diff_key(a){var b=arguments.length,c={},d="",e=1,f="",g={};a:for(d in a)for(e=1;b>e;e++){g=arguments[e];for(f in g)if(f===d)continue a;c[d]=a[d]}return c}function array_diff_uassoc(a){var b={},c=arguments.length-1,d=arguments[c],e={},f=1,g="",h="";d="string"==typeof d?this.window[d]:"[object Array]"===Object.prototype.toString.call(d)?this.window[d[0]][d[1]]:d;a:for(g in a)for(f=1;c>f;f++){e=arguments[f];for(h in e)if(e[h]===a[g]&&0===d(h,g))continue a;b[g]=a[g]}return b}function array_diff_ukey(a){var b={},c=arguments.length-1,d=arguments[c],e={},f=1,g="",h="";d="string"==typeof d?this.window[d]:"[object Array]"===Object.prototype.toString.call(d)?this.window[d[0]][d[1]]:d;a:for(g in a)for(f=1;c>f;f++){e=arguments[f];for(h in e)if(0===d(h,g))continue a;b[g]=a[g]}return b}function array_fill(a,b,c){var d,e={};if(!isNaN(a)&&!isNaN(b))for(d=0;b>d;d++)e[d+a]=c;return e}function array_fill_keys(a,b){var c={},d="";for(d in a)c[a[d]]=b;return c}function array_filter(a,b){var c,d={};b=b||function(a){return a},"[object Array]"===Object.prototype.toString.call(a)&&(d=[]);for(c in a)b(a[c])&&(d[c]=a[c]);return d}function array_flip(a){var b,c={};if(a&&"object"==typeof a&&a.change_key_case)return a.flip();for(b in a)a.hasOwnProperty(b)&&(c[a[b]]=b);return c}function array_intersect(a){var b={},c=arguments.length,d=c-1,e="",f={},g=0,h="";a:for(e in a)b:for(g=1;c>g;g++){f=arguments[g];for(h in f)if(f[h]===a[e]){g===d&&(b[e]=a[e]);continue b}continue a}return b}function array_intersect_assoc(a){var b={},c=arguments.length,d=c-1,e="",f={},g=0,h="";a:for(e in a)b:for(g=1;c>g;g++){f=arguments[g];for(h in f)if(f[h]===a[e]&&h===e){g===d&&(b[e]=a[e]);continue b}continue a}return b}function array_intersect_key(a){var b={},c=arguments.length,d=c-1,e="",f={},g=0,h="";a:for(e in a)if(a.hasOwnProperty(e))b:for(g=1;c>g;g++){f=arguments[g];for(h in f)if(f.hasOwnProperty(h)&&h===e){g===d&&(b[e]=a[e]);continue b}continue a}return b}function array_intersect_uassoc(a){var b={},c=arguments.length-1,d=c-1,e=arguments[c],f="",g=1,h={},i="";e="string"==typeof e?this.window[e]:"[object Array]"===Object.prototype.toString.call(e)?this.window[e[0]][e[1]]:e;a:for(f in a)b:for(g=1;c>g;g++){h=arguments[g];for(i in h)if(h[i]===a[f]&&0===e(i,f)){g===d&&(b[f]=a[f]);continue b}continue a}return b}function array_intersect_ukey(a){var b={},c=arguments.length-1,d=c-1,e=arguments[c],f="",g=1,h={},i="";e="string"==typeof e?this.window[e]:"[object Array]"===Object.prototype.toString.call(e)?this.window[e[0]][e[1]]:e;a:for(f in a)b:for(g=1;c>g;g++){h=arguments[g];for(i in h)if(0===e(i,f)){g===d&&(b[f]=a[f]);continue b}continue a}return b}function array_key_exists(a,b){return!b||b.constructor!==Array&&b.constructor!==Object?!1:a in b}function array_keys(a,b,c){var d="undefined"!=typeof b,e=[],f=!!c,g=!0,h="";if(a&&"object"==typeof a&&a.change_key_case)return a.keys(b,c);for(h in a)a.hasOwnProperty(h)&&(g=!0,d&&(f&&a[h]!==b?g=!1:a[h]!=b&&(g=!1)),g&&(e[e.length]=h));return e}function array_map(a){for(var b=arguments.length,c=arguments,d=this.window,e=null,f=a,g=c[1].length,h=0,i=1,j=0,k=[],l=[];g>h;){for(;b>i;)k[j++]=c[i++][h];if(j=0,i=1,a){if("string"==typeof a)f=d[a];else if("object"==typeof a&&a.length){if(e="string"==typeof a[0]?d[a[0]]:a[0],"undefined"==typeof e)throw"Object not found: "+a[0];f="string"==typeof a[1]?e[a[1]]:a[1]}l[h++]=f.apply(e,k)}else l[h++]=k;k=[]}return l}function array_merge(){var a,b=Array.prototype.slice.call(arguments),c=b.length,d={},e="",f=0,g=0,h=0,i=0,j=Object.prototype.toString,k=!0;for(h=0;c>h;h++)if("[object Array]"!==j.call(b[h])){k=!1;break}if(k){for(k=[],h=0;c>h;h++)k=k.concat(b[h]);return k}for(h=0,i=0;c>h;h++)if(a=b[h],"[object Array]"===j.call(a))for(g=0,f=a.length;f>g;g++)d[i++]=a[g];else for(e in a)a.hasOwnProperty(e)&&(parseInt(e,10)+""===e?d[i++]=a[e]:d[e]=a[e]);return d}function array_merge_recursive(a,b){var c="";if(a&&"[object Array]"===Object.prototype.toString.call(a)&&b&&"[object Array]"===Object.prototype.toString.call(b))for(c in b)a.push(b[c]);else if(a&&a instanceof Object&&b&&b instanceof Object)for(c in b)c in a&&"object"==typeof a[c]&&"object"==typeof b?a[c]=this.array_merge(a[c],b[c]):a[c]=b[c];return a}function array_multisort(a){var b,c,d,e,f,g,h,i,j,k,l,m=[0],n=[],o=[],p=[],q=arguments,r={SORT_REGULAR:16,SORT_NUMERIC:17,SORT_STRING:18,SORT_ASC:32,SORT_DESC:40},s=function(a,b){return o.shift()},t=[[function(a,b){return p.push(a>b?1:b>a?-1:0),a>b?1:b>a?-1:0},function(a,b){return p.push(b>a?1:a>b?-1:0),b>a?1:a>b?-1:0}],[function(a,b){return p.push(a-b),a-b},function(a,b){return p.push(b-a),b-a}],[function(a,b){return p.push(a+"">b+""?1:b+"">a+""?-1:0),a+"">b+""?1:b+"">a+""?-1:0},function(a,b){return p.push(b+"">a+""?1:a+"">b+""?-1:0),b+"">a+""?1:a+"">b+""?-1:0}]],u=[[]],v=[[]];if("[object Array]"===Object.prototype.toString.call(a))u[0]=a;else{if(!a||"object"!=typeof a)return!1;for(c in a)a.hasOwnProperty(c)&&(v[0].push(c),u[0].push(a[c]))}var w=u[0].length,x=[0,w],y=arguments.length;for(d=1;y>d;d++)if("[object Array]"===Object.prototype.toString.call(arguments[d])){if(u[d]=arguments[d],m[d]=0,arguments[d].length!==w)return!1}else if(arguments[d]&&"object"==typeof arguments[d]){v[d]=[],u[d]=[],m[d]=0;for(c in arguments[d])arguments[d].hasOwnProperty(c)&&(v[d].push(c),u[d].push(arguments[d][c]));if(u[d].length!==w)return!1}else{if("string"!=typeof arguments[d])return!1;var z=m.pop();if("undefined"==typeof r[arguments[d]]||(r[arguments[d]]>>>4&z>>>4)>0)return!1;m.push(z+r[arguments[d]])}for(c=0;c!==w;c++)n.push(!0);for(c in u)if(u.hasOwnProperty(c)){if(j=[],k=[],i=0,o=[],p=[],0===x.length){if("[object Array]"===Object.prototype.toString.call(arguments[c]))q[c]=u[c];else{for(e in arguments[c])arguments[c].hasOwnProperty(e)&&delete arguments[c][e];for(g=u[c].length,d=0,h=0;g>d;d++)h=v[c][d],q[c][h]=u[c][d]}delete u[c],delete v[c];continue}var A=t[3&m[c]][(8&m[c])>0?1:0];for(f=0;f!==x.length;f+=2){k=u[c].slice(x[f],x[f+1]+1),k.sort(A),j[f]=[].concat(p),i=x[f];for(b in k)k.hasOwnProperty(b)&&(u[c][i]=k[b],i++)}A=s;for(d in u)if(u.hasOwnProperty(d)){if(u[d]===u[c])continue;for(f=0;f!==x.length;f+=2){k=u[d].slice(x[f],x[f+1]+1),o=[].concat(j[f]),k.sort(A),i=x[f];for(b in k)k.hasOwnProperty(b)&&(u[d][i]=k[b],i++)}}for(d in v)if(v.hasOwnProperty(d))for(f=0;f!==x.length;f+=2){k=v[d].slice(x[f],x[f+1]+1),o=[].concat(j[f]),k.sort(A),i=x[f];for(b in k)k.hasOwnProperty(b)&&(v[d][i]=k[b],i++)}l=null,x=[];for(d in u[c])if(u[c].hasOwnProperty(d)){if(!n[d]){1&x.length&&x.push(d-1),l=null;continue}1&x.length?u[c][d]!==l&&(x.push(d-1),l=u[c][d]):(null!==l&&(u[c][d]===l?x.push(d-1):n[d]=!1),l=u[c][d])}if(1&x.length&&x.push(d),"[object Array]"===Object.prototype.toString.call(arguments[c]))q[c]=u[c];else{for(d in arguments[c])arguments[c].hasOwnProperty(d)&&delete arguments[c][d];for(g=u[c].length,d=0,h=0;g>d;d++)h=v[c][d],q[c][h]=u[c][d]}delete u[c],delete v[c]}return!0}function array_pad(a,b,c){var d,e=[],f=[],g=0,h=0;if("[object Array]"===Object.prototype.toString.call(a)&&!isNaN(b))if(d=0>b?-1*b:b,g=d-a.length,g>0){for(h=0;g>h;h++)f[h]=c;e=0>b?f.concat(a):a.concat(f)}else e=a;return e}function array_pop(a){var b="",c="";if(a.hasOwnProperty("length"))return a.length?a.pop():null;for(b in a)a.hasOwnProperty(b)&&(c=b);if(c){var d=a[c];return delete a[c],d}return null}function array_product(a){var b=0,c=1,d=0;if("[object Array]"!==Object.prototype.toString.call(a))return null;for(d=a.length;d>b;)c*=isNaN(a[b])?0:a[b],b++;return c}function array_push(a){var b=0,c="",d=arguments,e=d.length,f=/^\d$/,g=0,h=0,i=0;if(a.hasOwnProperty("length")){for(b=1;e>b;b++)a[a.length]=d[b];return a.length}for(c in a)a.hasOwnProperty(c)&&(++i,-1!==c.search(f)&&(g=parseInt(c,10),h=g>h?g:h));for(b=1;e>b;b++)a[++h]=d[b];return i+b-1}function array_rand(a,b){var c=[],d=b||1,e=function(a,b){for(var c=!1,d=0,e=a.length;e>d;){if(a[d]===b){c=!0;break}d++}return c};if("[object Array]"===Object.prototype.toString.call(a)&&d<=a.length)for(;;){var f=Math.floor(Math.random()*a.length);if(c.length===d)break;e(c,f)||c.push(f)}else c=null;return 1==d?c.join():c}function array_reduce(a,b){var c=a.length,d=0,e=0,f=[];for(e=0;c>e;e+=2)f[0]=a[e],a[e+1]?f[1]=a[e+1]:f[1]=0,d+=b.apply(null,f),f=[];return d}function array_replace(a){var b={},c=0,d="",e=arguments.length;if(2>e)throw new Error("There should be at least 2 arguments passed to array_replace()");for(d in a)b[d]=a[d];for(c=1;e>c;c++)for(d in arguments[c])b[d]=arguments[c][d];return b}function array_replace_recursive(a){var b={},c=0,d="",e=arguments.length;if(2>e)throw new Error("There should be at least 2 arguments passed to array_replace_recursive()");for(d in a)b[d]=a[d];for(c=1;e>c;c++)for(d in arguments[c])b[d]&&"object"==typeof b[d]?b[d]=this.array_replace_recursive(b[d],arguments[c][d]):b[d]=arguments[c][d];return b}function array_reverse(a,b){var c,d="[object Array]"===Object.prototype.toString.call(a),e=b?{}:[];if(d&&!b)return a.slice(0).reverse();if(b){var f=[];for(c in a)f.push(c);for(var g=f.length;g--;)c=f[g],e[c]=a[c]}else for(c in a)e.unshift(a[c]);return e}function array_search(a,b,c){var d=!!c,e="";if(b&&"object"==typeof b&&b.change_key_case)return b.search(a,c);if("object"==typeof a&&a.exec){if(!d){var f="i"+(a.global?"g":"")+(a.multiline?"m":"")+(a.sticky?"y":"");a=new RegExp(a.source,f)}for(e in b)if(b.hasOwnProperty(e)&&a.test(b[e]))return e;return!1}for(e in b)if(b.hasOwnProperty(e)&&(d&&b[e]===a||!d&&b[e]==a))return e;return!1}function array_shift(a){return 0===a.length?null:a.length>0?a.shift():void 0}function array_slice(a,b,c,d){var e="";if("[object Array]"!==Object.prototype.toString.call(a)||d&&0!==b){var f=0,g={};for(e in a)f+=1,g[e]=a[e];a=g,b=0>b?f+b:b,c=void 0===c?f:0>c?f+c-b:c;var h={},i=!1,j=-1,k=0,l=0;for(e in a){if(++j,k>=c)break;j==b&&(i=!0),i&&(++k,this.is_int(e)&&!d?h[l++]=a[e]:h[e]=a[e])}return h}return void 0===c?a.slice(b):c>=0?a.slice(b,b+c):a.slice(b,c)}function array_splice(a,b,c,d){var e=function(a,b,c){if(void 0!==a[b]){var d=b;b+=1,b===c&&(b+=1),b=e(a,b,c),a[b]=a[d],delete a[d]}return b};if(d&&"object"!=typeof d&&(d=[d]),void 0===c?c=b>=0?a.length-b:-b:0>c&&(c=(b>=0?a.length-b:-b)+c),"[object Array]"!==Object.prototype.toString.call(a)){var f=0,g=-1,h=[],i={},j=-1,k=-1,l=!0,m=0,n=0,o="";for(o in a)f+=1;b=b>=0?b:f+b;for(o in a)if(g+=1,b>g){if(this.is_int(o)){if(k+=1,parseInt(o,10)===k)continue;e(a,k,o),a[k]=a[o],delete a[o]}}else l&&this.is_int(o)?(h.push(a[o]),i[m++]=a[o]):(i[o]=a[o],l=!1),n+=1,d&&d[++j]?a[o]=d[j]:delete a[o];return l?h:i}return d?(d.unshift(b,c),Array.prototype.splice.apply(a,d)):a.splice(b,c)}function array_sum(a){var b,c=0;if(a&&"object"==typeof a&&a.change_key_case)return a.sum.apply(a,Array.prototype.slice.call(arguments,0));if("object"!=typeof a)return null;for(b in a)isNaN(parseFloat(a[b]))||(c+=parseFloat(a[b]));return c}function array_udiff(a){var b={},c=arguments.length-1,d=arguments[c],e="",f=1,g="",h="";d="string"==typeof d?this.window[d]:"[object Array]"===Object.prototype.toString.call(d)?this.window[d[0]][d[1]]:d;a:for(g in a)for(f=1;c>f;f++){e=arguments[f];for(h in e)if(0===d(e[h],a[g]))continue a;b[g]=a[g]}return b}function array_udiff_assoc(a){var b={},c=arguments.length-1,d=arguments[c],e={},f=1,g="",h="";d="string"==typeof d?this.window[d]:"[object Array]"===Object.prototype.toString.call(d)?this.window[d[0]][d[1]]:d;a:for(g in a)for(f=1;c>f;f++){e=arguments[f];for(h in e)if(0===d(e[h],a[g])&&h===g)continue a;b[g]=a[g]}return b}function array_udiff_uassoc(a){var b={},c=arguments.length-1,d=c-1,e=arguments[c],f=arguments[d],g="",h=1,i="",j={};e="string"==typeof e?this.window[e]:"[object Array]"===Object.prototype.toString.call(e)?this.window[e[0]][e[1]]:e,f="string"==typeof f?this.window[f]:"[object Array]"===Object.prototype.toString.call(f)?this.window[f[0]][f[1]]:f;a:for(g in a)for(h=1;d>h;h++){j=arguments[h];for(i in j)if(0===f(j[i],a[g])&&0===e(i,g))continue a;b[g]=a[g]}return b}function array_uintersect(a){var b={},c=arguments.length-1,d=c-1,e=arguments[c],f="",g=1,h={},i="";e="string"==typeof e?this.window[e]:"[object Array]"===Object.prototype.toString.call(e)?this.window[e[0]][e[1]]:e;a:for(f in a)b:for(g=1;c>g;g++){h=arguments[g];for(i in h)if(0===e(h[i],a[f])){g===d&&(b[f]=a[f]);continue b}continue a}return b}function array_uintersect_assoc(a){var b={},c=arguments.length-1,d=c-2,e=arguments[c],f="",g=1,h={},i="";e="string"==typeof e?this.window[e]:"[object Array]"===Object.prototype.toString.call(e)?this.window[e[0]][e[1]]:e;a:for(f in a)b:for(g=1;c>g;g++){h=arguments[g];for(i in h)if(i===f&&0===e(h[i],a[f])){g===d&&(b[f]=a[f]);continue b}continue a}return b}function array_uintersect_uassoc(a){var b={},c=arguments.length-1,d=c-1,e=arguments[c],f=arguments[d],g="",h=1,i="",j={};e="string"==typeof e?this.window[e]:"[object Array]"===Object.prototype.toString.call(e)?this.window[e[0]][e[1]]:e,f="string"==typeof f?this.window[f]:"[object Array]"===Object.prototype.toString.call(f)?this.window[f[0]][f[1]]:f;a:for(g in a)b:for(h=1;d>h;h++){j=arguments[h];for(i in j)if(0===f(j[i],a[g])&&0===e(i,g)){h===arguments.length-3&&(b[g]=a[g]);continue b}continue a}return b}function array_unique(a){var b="",c={},d="",e=function(a,b){var c="";for(c in b)if(b.hasOwnProperty(c)&&b[c]+""==a+"")return c;return!1};for(b in a)a.hasOwnProperty(b)&&(d=a[b],!1===e(d,c)&&(c[b]=d));return c}function array_unshift(a){for(var b=arguments.length;0!==--b;)arguments[0].unshift(arguments[b]);return arguments[0].length}function array_values(a){var b=[],c="";if(a&&"object"==typeof a&&a.change_key_case)return a.values();for(c in a)b[b.length]=a[c];return b}function array_walk(array,funcname,userdata){var key,value,ini;if(!array||"object"!=typeof array)return!1;if("object"==typeof array&&array.change_key_case)return arguments.length>2?array.walk(funcname,userdata):array.walk(funcname);try{if("function"==typeof funcname)for(key in array)arguments.length>2?funcname(array[key],key,userdata):funcname(array[key],key);else if("string"==typeof funcname)if(this.php_js=this.php_js||{},this.php_js.ini=this.php_js.ini||{},ini=this.php_js.ini["phpjs.no-eval"],!ini||0===parseInt(ini.local_value,10)||ini.local_value.toLowerCase&&"off"===ini.local_value.toLowerCase())if(arguments.length>2)for(key in array)eval(funcname+"(array[key], key, userdata)");else for(key in array)eval(funcname+"(array[key], key)");else if(arguments.length>2)for(key in array)this.window[funcname](array[key],key,userdata);else for(key in array)this.window[funcname](array[key],key);else{if(!funcname||"object"!=typeof funcname||2!==funcname.length)return!1;var obj=funcname[0],func=funcname[1];if(arguments.length>2)for(key in array)obj[func](array[key],key,userdata);else for(key in array)obj[func](array[key],key)}}catch(e){return!1}return!0}function array_walk_recursive(array,funcname,userdata){var key;if("object"!=typeof array)return!1;for(key in array){if("object"==typeof array[key])return this.array_walk_recursive(array[key],funcname,userdata);"undefined"!=typeof userdata?eval(funcname+"( array [key] , key , userdata  )"):eval(funcname+"(  userdata ) ")}return!0}function arsort(a,b){var c,d,e,f=[],g=0,h=this,i=!1,j={};switch(b){case"SORT_STRING":e=function(a,b){return h.strnatcmp(b,a)};break;case"SORT_LOCALE_STRING":var k=this.i18n_loc_get_default();e=this.php_js.i18nLocales[k].sorting;break;case"SORT_NUMERIC":e=function(a,b){return a-b};break;case"SORT_REGULAR":default:e=function(a,b){var c=parseFloat(b),d=parseFloat(a),e=c+""===b,f=d+""===a;return e&&f?c>d?1:d>c?-1:0:e&&!f?1:!e&&f?-1:b>a?1:a>b?-1:0}}this.php_js=this.php_js||{},this.php_js.ini=this.php_js.ini||{},i=this.php_js.ini["phpjs.strictForIn"]&&this.php_js.ini["phpjs.strictForIn"].local_value&&"off"!==this.php_js.ini["phpjs.strictForIn"].local_value,j=i?a:j;for(c in a)a.hasOwnProperty(c)&&(f.push([c,a[c]]),i&&delete a[c]);for(f.sort(function(a,b){return e(a[1],b[1])}),d=0,g=f.length;g>d;d++)j[f[d][0]]=f[d][1];return i||j}function asort(a,b){var c,d,e,f=[],g=0,h=this,i=!1,j={};switch(b){case"SORT_STRING":e=function(a,b){return h.strnatcmp(a,b)};break;case"SORT_LOCALE_STRING":var k=this.i18n_loc_get_default();e=this.php_js.i18nLocales[k].sorting;break;case"SORT_NUMERIC":e=function(a,b){return a-b};break;case"SORT_REGULAR":default:e=function(a,b){var c=parseFloat(a),d=parseFloat(b),e=c+""===a,f=d+""===b;return e&&f?c>d?1:d>c?-1:0:e&&!f?1:!e&&f?-1:a>b?1:b>a?-1:0}}this.php_js=this.php_js||{},this.php_js.ini=this.php_js.ini||{},i=this.php_js.ini["phpjs.strictForIn"]&&this.php_js.ini["phpjs.strictForIn"].local_value&&"off"!==this.php_js.ini["phpjs.strictForIn"].local_value,j=i?a:j;for(c in a)a.hasOwnProperty(c)&&(f.push([c,a[c]]),i&&delete a[c]);for(f.sort(function(a,b){return e(a[1],b[1])}),d=0,g=f.length;g>d;d++)j[f[d][0]]=f[d][1];return i||j}function compact(){var a={},b=this,c=function(d){var e=0,f=d.length,g="";for(e=0;f>e;e++)g=d[e],"[object Array]"===Object.prototype.toString.call(g)?c(g):"undefined"!=typeof b.window[g]&&(a[g]=b.window[g]);return!0};return c(arguments),a}function count(a,b){var c,d=0;if(null===a||"undefined"==typeof a)return 0;if(a.constructor!==Array&&a.constructor!==Object)return 1;"COUNT_RECURSIVE"===b&&(b=1),1!=b&&(b=0);for(c in a)a.hasOwnProperty(c)&&(d++,1!=b||!a[c]||a[c].constructor!==Array&&a[c].constructor!==Object||(d+=this.count(a[c],1)));return d}function in_array(a,b,c){var d="",e=!!c;if(e){for(d in b)if(b[d]===a)return!0}else for(d in b)if(b[d]==a)return!0;return!1}function krsort(a,b){var c,d,e,f={},g=[],h=this,i=!1,j={};switch(b){case"SORT_STRING":c=function(a,b){return h.strnatcmp(b,a)};break;case"SORT_LOCALE_STRING":var k=this.i18n_loc_get_default();c=this.php_js.i18nLocales[k].sorting;break;case"SORT_NUMERIC":c=function(a,b){return b-a};break;case"SORT_REGULAR":default:c=function(a,b){var c=parseFloat(b),d=parseFloat(a),e=c+""===b,f=d+""===a;return e&&f?c>d?1:d>c?-1:0:e&&!f?1:!e&&f?-1:b>a?1:a>b?-1:0}}for(e in a)a.hasOwnProperty(e)&&g.push(e);for(g.sort(c),this.php_js=this.php_js||{},this.php_js.ini=this.php_js.ini||{},i=this.php_js.ini["phpjs.strictForIn"]&&this.php_js.ini["phpjs.strictForIn"].local_value&&"off"!==this.php_js.ini["phpjs.strictForIn"].local_value,j=i?a:j,d=0;d<g.length;d++)e=g[d],f[e]=a[e],i&&delete a[e];for(d in f)f.hasOwnProperty(d)&&(j[d]=f[d]);return i||j}function ksort(a,b){var c,d,e,f={},g=[],h=this,i=!1,j={};switch(b){case"SORT_STRING":c=function(a,b){return h.strnatcmp(a,b)};break;case"SORT_LOCALE_STRING":var k=this.i18n_loc_get_default();c=this.php_js.i18nLocales[k].sorting;break;case"SORT_NUMERIC":c=function(a,b){return a+0-(b+0)};break;default:c=function(a,b){var c=parseFloat(a),d=parseFloat(b),e=c+""===a,f=d+""===b;return e&&f?c>d?1:d>c?-1:0:e&&!f?1:!e&&f?-1:a>b?1:b>a?-1:0}}for(e in a)a.hasOwnProperty(e)&&g.push(e);for(g.sort(c),this.php_js=this.php_js||{},this.php_js.ini=this.php_js.ini||{},i=this.php_js.ini["phpjs.strictForIn"]&&this.php_js.ini["phpjs.strictForIn"].local_value&&"off"!==this.php_js.ini["phpjs.strictForIn"].local_value,j=i?a:j,d=0;d<g.length;d++)e=g[d],f[e]=a[e],i&&delete a[e];for(d in f)f.hasOwnProperty(d)&&(j[d]=f[d]);return i||j}function range(a,b,c){var d,e,f,g=[],h=c||1,i=!1;if(isNaN(a)||isNaN(b)?isNaN(a)&&isNaN(b)?(i=!0,d=a.charCodeAt(0),e=b.charCodeAt(0)):(d=isNaN(a)?0:a,e=isNaN(b)?0:b):(d=a,e=b),f=d>e?!1:!0)for(;e>=d;)g.push(i?String.fromCharCode(d):d),d+=h;else for(;d>=e;)g.push(i?String.fromCharCode(d):d),d-=h;return g}function rsort(a,b){var c=[],d="",e=0,f=!1,g=this,h=!1,i=[];switch(b){case"SORT_STRING":f=function(a,b){return g.strnatcmp(b,a)};break;case"SORT_LOCALE_STRING":var j=this.i18n_loc_get_default();f=this.php_js.i18nLocales[j].sorting;break;case"SORT_NUMERIC":f=function(a,b){return b-a};break;case"SORT_REGULAR":default:f=function(a,b){var c=parseFloat(b),d=parseFloat(a),e=c+""===b,f=d+""===a;return e&&f?c>d?1:d>c?-1:0:e&&!f?1:!e&&f?-1:b>a?1:a>b?-1:0}}try{this.php_js=this.php_js||{}}catch(k){this.php_js={}}this.php_js.ini=this.php_js.ini||{},h=this.php_js.ini["phpjs.strictForIn"]&&this.php_js.ini["phpjs.strictForIn"].local_value&&"off"!==this.php_js.ini["phpjs.strictForIn"].local_value,i=h?a:i;for(d in a)a.hasOwnProperty(d)&&(c.push(a[d]),h&&delete a[d]);for(c.sort(f),e=0;e<c.length;e++)i[e]=c[e];return h||i}function shuffle(a){var b=[],c="",d=0,e=!1,f=[];for(c in a)a.hasOwnProperty(c)&&(b.push(a[c]),e&&delete a[c]);for(b.sort(function(){return.5-Math.random()}),this.php_js=this.php_js||{},this.php_js.ini=this.php_js.ini||{},e=this.php_js.ini["phpjs.strictForIn"]&&this.php_js.ini["phpjs.strictForIn"].local_value&&"off"!==this.php_js.ini["phpjs.strictForIn"].local_value,f=e?a:f,d=0;d<b.length;d++)f[d]=b[d];return e||f}function sizeof(a,b){return this.count(a,b)}function sort(a,b){var c=[],d="",e=0,f=!1,g=this,h=!1,i=[];switch(b){case"SORT_STRING":f=function(a,b){return g.strnatcmp(a,b)};break;case"SORT_LOCALE_STRING":var j=this.i18n_loc_get_default();f=this.php_js.i18nLocales[j].sorting;break;case"SORT_NUMERIC":f=function(a,b){return a-b};break;case"SORT_REGULAR":default:f=function(a,b){var c=parseFloat(a),d=parseFloat(b),e=c+""===a,f=d+""===b;return e&&f?c>d?1:d>c?-1:0:e&&!f?1:!e&&f?-1:a>b?1:b>a?-1:0}}try{this.php_js=this.php_js||{}}catch(k){this.php_js={}}this.php_js.ini=this.php_js.ini||{},h=this.php_js.ini["phpjs.strictForIn"]&&this.php_js.ini["phpjs.strictForIn"].local_value&&"off"!==this.php_js.ini["phpjs.strictForIn"].local_value,i=h?a:i;for(d in a)a.hasOwnProperty(d)&&(c.push(a[d]),h&&delete a[d]);for(c.sort(f),e=0;e<c.length;e++)i[e]=c[e];return h||i}function uasort(a,b){var c=[],d="",e=0,f=!1,g={};"string"==typeof b?b=this[b]:"[object Array]"===Object.prototype.toString.call(b)&&(b=this[b[0]][b[1]]),this.php_js=this.php_js||{},this.php_js.ini=this.php_js.ini||{},f=this.php_js.ini["phpjs.strictForIn"]&&this.php_js.ini["phpjs.strictForIn"].local_value&&"off"!==this.php_js.ini["phpjs.strictForIn"].local_value,g=f?a:g;for(d in a)a.hasOwnProperty(d)&&(c.push([d,a[d]]),f&&delete a[d]);for(c.sort(function(a,c){return b(a[1],c[1])}),e=0;e<c.length;e++)g[c[e][0]]=c[e][1];return f||g}function uksort(a,b){var c={},d=[],e=0,f="",g=!1,h={};"string"==typeof b&&(b=this.window[b]);for(f in a)a.hasOwnProperty(f)&&d.push(f);try{b?d.sort(b):d.sort()}catch(i){return!1}for(this.php_js=this.php_js||{},this.php_js.ini=this.php_js.ini||{},g=this.php_js.ini["phpjs.strictForIn"]&&this.php_js.ini["phpjs.strictForIn"].local_value&&"off"!==this.php_js.ini["phpjs.strictForIn"].local_value,h=g?a:h,e=0;e<d.length;e++)f=d[e],c[f]=a[f],g&&delete a[f];for(e in c)c.hasOwnProperty(e)&&(h[e]=c[e]);return g||h}function usort(a,b){var c=[],d="",e=0,f=!1,g={};"string"==typeof b?b=this[b]:"[object Array]"===Object.prototype.toString.call(b)&&(b=this[b[0]][b[1]]),this.php_js=this.php_js||{},this.php_js.ini=this.php_js.ini||{},f=this.php_js.ini["phpjs.strictForIn"]&&this.php_js.ini["phpjs.strictForIn"].local_value&&"off"!==this.php_js.ini["phpjs.strictForIn"].local_value,g=f?a:g;for(d in a)a.hasOwnProperty(d)&&(c.push(a[d]),f&&delete a[d]);try{c.sort(b)}catch(h){return!1}for(e=0;e<c.length;e++)g[e]=c[e];return f||g};
/**
 * 转义字符串的HTML字符，主要有 < > " ' &
 * var str = '<a href="xxx">'.toHTML();
 * 返回 '&lt;a href=&quot;xxx&quot;&gt;'
 * 
 * @return {String}
 */
String.prototype.toHTML = function() {
	return this.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#039;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
};
/**
 * 同上
 * 
 * @return {String}
 */
Number.prototype.toHTML = function() {
	return this.toString().toHTML();
};
/**
 * 转义字符串的空格、回车、制表符，也就是将textarea输入的文本可以原样显示到屏幕
 * 类似于<pre>标签
 * 
 * var str = " 空格\n第\t二行".toPre();
 * 返回 '&nbsp;空格<br />第&nbsp;&nbsp;&nbsp;&nbsp;二行'
 * 
 * @return {String}
 */
String.prototype.toPre = function() {
	return this.replace(/\040/g, '&nbsp;').replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1<br />$2');
};
/**
 * 删除所有HTML标签
 * 
 * var str = "<a href=''>我爱你</a>".toPre();
 * 返回 '我爱你'
 * 
 * @return {String}
 */
String.prototype.noHTML = function() {
	return this.replace(/<script[^>]*?>.*?<\/script>/ig, '').replace(/<[\/\!]*?[^<>]*?>/g, '').replace(/<style[^>]*?>.*?<\/style>/ig, '').replace(/<![\s\S]*?--[ \t\n\r]*>/, '').replace(/([\r\n])[\s]+/,'').replace(/&(quot|#34|amp|#38|lt|#60|gt|#62|nbsp|#160)/i,'');
};
/**
 * 返回字符串长度，汉字或其它非英文字符按2个长度算
 * 
 * var str = "我爱你abc".aLength();
 * 返回 9
 * 
 * @return {String}
 */
String.prototype.aLength = function() {
	var a = this.match(/[^\x00-\x80]/g);
	return this.length + (a ? a.length : 0);
};
/**
 * 字符串前后加上补充字符串，使其达到定义的长度
 * 
 * @example 1: 'Kevin van Zonneveld'.pad(30, '-=', 'STR_PAD_LEFT');
 * @returns 1: '-=-=-=-=-=-Kevin van Zonneveld'
 * @example 2: 'Kevin van Zonneveld'.pad(30, '-', 'STR_PAD_BOTH');
 * @returns 2: '------Kevin van Zonneveld-----'
 * 
 * @param  {Int} pad_length 最终长度
 * @param  {String} pad_string 需要补充的字符串
 * @param  {String} pad_type   'STR_PAD_LEFT' 或 'STR_PAD_RIGHT' 或 'STR_PAD_BOTH'
 * @return {String}            
 */
String.prototype.pad = function(pad_length, pad_string, pad_type) {
	var half = '',pad_to_go;
	var str_pad_repeater = function(s, len) {
		var collect = '',i;
		while (collect.length < len) {
			collect += s;
		}
		collect = collect.substr(0, len);
		return collect;
	};

	var input = this.toString() + '';
	pad_string = pad_string !== undefined ? pad_string : ' ';

	if (pad_type !== 'STR_PAD_LEFT' && pad_type !== 'STR_PAD_RIGHT' && pad_type !== 'STR_PAD_BOTH')
		pad_type = 'STR_PAD_LEFT';
 
	if ((pad_to_go = pad_length - input.length) > 0) {
		if (pad_type === 'STR_PAD_LEFT') {
			input = str_pad_repeater(pad_string, pad_to_go) + input;
		} else if (pad_type === 'STR_PAD_RIGHT') {
			input = input + str_pad_repeater(pad_string, pad_to_go);
		} else if (pad_type === 'STR_PAD_BOTH') {
			half = str_pad_repeater(pad_string, Math.ceil(pad_to_go / 2));
			input = half + input + half;
			input = input.substr(0, pad_length);
		}
	}
	return input;
};
/**
 * 同上，区别是pad_string默认为字符串'0'
 * var str = (100).pad(10);
 * 返回 '0000000100'
 */
Number.prototype.pad = function(pad_length, pad_string, pad_type) {
	pad_string = pad_string !== undefined ? pad_string : '0';
	return this.toString().pad(pad_length, pad_string, pad_type);
};
/**
 * 等同PHP的同名函数
 * 需要保留小数位数，以及修改小数点的符号
 * 千分位加上符号
 * 
 * var str = (1231121.234564645).number_format(30, '-=', 2, '$', '\'');
 * 返回 "1'231'121$23"

 * 
 * @param  {Int} decimals 保留小数的位数
 * @param  {String} dec_point 小数点使用的字符
 * @param  {String} thousands_sep   千分位使用的字符
 * @return {String}            
 */
String.prototype.number_format = function(decimals, dec_point, thousands_sep) {
	var number = (this + '').replace(/[^0-9+\-Ee.]/g, '');
	var n = !isFinite(+number) ? 0 : +number,
		prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
		sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
		dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
		s = '',
		toFixedFix = function(n, prec) {
			var k = Math.pow(10, prec);
			return '' + (Math.round(n * k) / k).toFixed(prec);
		};
	// Fix for IE parseFloat(0.55).toFixed(0) = 0;
	s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
	if (s[0].length > 3) {
		s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
	}
	if ((s[1] || '').length < prec) {
		s[1] = s[1] || '';
		s[1] += new Array(prec - s[1].length + 1)
		.join('0');
	}
	return s.join(dec);
};
/**
 * 同上
 */
Number.prototype.number_format = function(decimals, dec_point, thousands_sep) {
	return this.toString().number_format(decimals, dec_point, thousands_sep);
};
/**
 * 尝试将一个字符串转化为Date对象
 * 支持带微秒的时间戳(unix时间戳 * 1000)、英式时间格式(月/日/年 时:分:秒)等javascript支持的时间格式
 * 无法识别则返回当前时间
 * 
 * @return {Date} 
 */
String.prototype.toDate = function() {
	var t = this;
	if (!isNaN(this))
		t = parseInt(this);
	t = new Date(t);
	if (isNaN(t.getTime()))
		t = new Date();
	return t;
};
/**
 * 带微秒的时间戳转化为Date对象
 * 也就是javascript中Date.getTime()的时间戳
 * 
 * @return {Date}
 */
Number.prototype.toDate = function() {
	return this.toString().toDate();
};
/**
 * 此方法只是为了帮助开发者，无需了解数据的类型，都可以toDate
 * @return {[type]} [description]
 */
Date.prototype.toDate = function() {
	return this;
};
/**
 * 将Date格式化字符串的时间
 * 
 * (unix时间戳 * 1000).toTimeString('%Y年%m月')  --> '2016年03月'
 * 'now'.toTimeString('%Y-%m-%d')  --> '2016-03-04'
 * (new Date('03/01/2016 23:59:30')).toString('%T')  --> '23:59:30'
 * 
 * @param  {String} format_string %D %T %F %R %h %n %t %S %s %MS %M %H %d %m %B %b %Y %y %w %W %A %a %x %X %c 请参见PHP手册strftime函数 (ISO 9889:1999)
 * @return {String}               
 */
Date.prototype.toString = function(format_string) {
	var array_week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', '&#26085;', '&#19968;', '&#20108;', '&#19977;', '&#22235;', '&#20116;', '&#20845;'];
	var array_month = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
  
	var y, m, d, h, i, s, ms, w, t;
	y = this.getFullYear();
	m = this.getMonth() + 1;
	d = this.getDate();
	h = this.getHours();
	i = this.getMinutes();
	s = this.getSeconds();
	ms = this.getMilliseconds();
	w = this.getDay();
	t = parseInt(this.getTime() / 1000);

	format_string = format_string === undefined ? '%c' : format_string;
	var f = format_string.toString();
	f = f.replace(/%%/g, '{-+-+-}%{/-+-+-}');
	f = f.replace(/%D/g, '%m/%d/%y');
	f = f.replace(/%T/g, '%H:%M:%S'); 
	f = f.replace(/%F/g, '%y-%m-%d');
	f = f.replace(/%R/g, '%H:%M');
	f = f.replace(/%h/g, '%b');
	f = f.replace(/%n/g, '\n');
	f = f.replace(/%t/g, '\t');
	f = f.replace(/%S/g, s.pad(2,'0')); //Second
	f = f.replace(/%s/g, t.toString()); //Stamp
	f = f.replace(/%MS/g, ms.toString()); //Millisecond
	f = f.replace(/%M/g, i.pad(2,'0')); //Minute
	f = f.replace(/%H/g, h.pad(2,'0')); //Hour
	f = f.replace(/%d/g, d.pad(2,'0')); //Day
	f = f.replace(/%m/g, m.pad(2,'0')); //Month(Int)
	f = f.replace(/%B/g, array_month[m]); //January
	f = f.replace(/%b/g, array_month[m + 12]); //Jan
	f = f.replace(/%Y/g, y.toString()); //Year
	f = f.replace(/%y/g, (y % 100).pad(2,'0')); //Year 00~99
	f = f.replace(/%w/g, w.toString()); //Week(Int)
	f = f.replace(/%W/g, w.toString()); //Week(Int)
	f = f.replace(/%A/g, array_week[w]); //Monday
	f = f.replace(/%a/g, array_week[w + 7]); //Mon
	f = f.replace(/%x/g, this.toLocaleDateString()); 
	f = f.replace(/%X/g, this.toLocaleTimeString());
	f = f.replace(/%c/g, this.toLocaleString());
	f = f.replace('{-+-+-}%{/-+-+-}', '%');
	return f;
};
/**
 * 同上，但此函数会先尝试toDate
 */
String.prototype.toTimeString = function(format_string) {
	return this.toDate().toString(format_string);
};
/**
 * 同上，但此函数会先尝试toDate
 */
Number.prototype.toTimeString = function(format_string) {
	return this.toString().toDate().toString(format_string);
};
/**
 * 同下，但如果传入的字符串不是数字将会返回原文
 */
String.prototype.toCountDownString = function(format_string){
	var count_down_ms = parseInt(this);
	return isNaN(count_down_ms) ? this : count_down_ms.toCountDownString(format_string);
};
/**
 * 时间长度(微秒时间)，按制定格式返回
 * 
 * 比如：播放时长为124秒，(124000).toCountDownString('时长：%H时%M分%S秒') 
 * 返回 '时长：00时02分04秒'
 * 
 * @param  {String} format_string %S %s %MS %ms %M %H %D
 * @return {[type]}               [description]
 */
Number.prototype.toCountDownString = function(format_string){
		var d,h,m,s,ms,minus=false;
		//if (this < 0) minus = true;
		var count_down_ms = Math.abs(parseInt(this));
		var t = parseInt(count_down_ms / 1000);
		d = parseInt(t / 60 / 60 / 24);
		if (format_string.indexOf('%D') < 0) d = 0;
		h = parseInt(t / 60 / 60 - d * 24);
		if (format_string.indexOf('%H') < 0) h = 0;
		m = parseInt(t / 60 - d * 24 * 60 - h * 60);
		if (format_string.indexOf('%M') < 0) m = 0;
		s = t - d * 24 * 60 * 60 - h * 60 * 60 - m * 60;
		ms = count_down_ms - t * 1000;
		var f = format_string.replace(/%S/g,s.pad(2,'0'));//Second
		f = f.replace(/%s/g,t.toString());//Stamp
		f = f.replace(/%MS/g,ms.toString());//Millisecond
		f = f.replace(/%ms/g,count_down_ms.toString());//Millisecond Stamp
		f = f.replace(/%M/g,m.pad(2,'0'));//Minute
		f = f.replace(/%H/g,h.pad(2,'0'));//Hour
		f = f.replace(/%D/g,d.pad(2,'0'));//Day
		return f;
};
/**
 * 将图片等比压缩到制定宽高
 * <img src="xxx" onload="resizeImg(this, 300, 200);">
 *  
 * @param  {ImageElement} imgObj  图片
 * @param  {Mumber} maxWidth  最大宽度
 * @param  {Mumber} maxHeight 最大高度
 */
function resizeImg(img, maxWidth, maxHeight) {
	jQuery(img).css({'maxHeight': maxHeight, 'maxWidth': maxWidth});
	var HeightWidth = img.offsetHeight / img.offsetWidth;
	var WidthHeight = img.offsetWidth / img.offsetHeight;
	if(img.offsetWidth > maxWidth)
		jQuery(img).css({width : maxWidth, height : maxWidth * HeightWidth}); 
	if(img.offsetHeight > maxHeight)
		jQuery(img).css({width : maxHeight * WidthHeight, height : maxHeight}); 
};
/**
 * 返回min~max之间的随机整数
 * 
 * @param  {Int} min 最小随机范围
 * @param  {Int} max 最大随机范围
 * @return {Int}
 */
function rand(min, max) {
  var argc = arguments.length;
  if (argc === 0) {
	min = 0;
	max = 2147483647;
  } else if (argc === 1) {
	throw new Error('Warning: rand() expects exactly 2 parameters, 1 given');
  }
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
/**
 * 此函数主要是为了计算概率，用于出奖
 * probability_rand({'iPhone': 1, 'iPad': 0, '代金券': 100, '无奖': 1000});
 * iPhone的概率为 1 / (1 + 0 + 100 + 1000); 基本很难中奖 :P
 * 按照概率返回Key
 * 
 * @param  {Object} arr 概率表，参考上例
 * @return {String}     返回Key
 */
function probability_rand(arr) { 
	var result = false; 
	//概率数组的总概率精度 
	var sum = 0;
	for (var k in arr) sum += parseFloat(arr[k]);
	//arsort($arr);
	//概率数组循环 
	for (var k in arr) { 
		var randNum = rand(1, sum);
		var v = parseFloat(arr[k]);
		if (randNum <= v) {
			result = k;
			break; 
		} else {
			sum -= v;
		}
	} 
	return result; 
};
/**
 * 检测客户端Flash的版本
 * 
 * @return {String} 版本号
 */
function flash_version()
{
	var a = !1,
	b = "";

	function c(d) {
		d = d.match(/[\d]+/g);
		d.length = 3;
		return d.join(".")
	}
	if (navigator.plugins && navigator.plugins.length) {
		var e = navigator.plugins["Shockwave Flash"];
		e && (a = !0, e.description && (b = c(e.description)));
		navigator.plugins["Shockwave Flash 2.0"] && (a = !0, b = "2.0.0.11")
	} else {
		if (navigator.mimeTypes && navigator.mimeTypes.length) {
			var f = navigator.mimeTypes["application/x-shockwave-flash"];
			(a = f && f.enabledPlugin) && (b = c(f.enabledPlugin.description))
		} else {
			try {
				var g = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7"),
					a = !0,
					b = c(g.GetVariable("$version"))
			} catch (h) {
				try {
					g = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6"), a = !0, b = "6.0.21"
				} catch (i) {
					try {
						g = new ActiveXObject("ShockwaveFlash.ShockwaveFlash"), a = !0, b = c(g.GetVariable("$version"))
					} catch (j) {}
				}
			}
		}
	}
	return a ? b : false;
}
/**
 * 字节转义为可阅读的MB/GB等
 * 
 * @param  {Number} bytes 字节数
 * @return {String}
 */
function bytesToSize(bytes) {
	if (bytes === 0) return '0 B';
	var k = 1024, sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
	i = Math.floor(Math.log(bytes) / Math.log(k));
	return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
}
/*
 * jQuery BBQ: Back Button & Query Library - v1.2.1 - 2/17/2010
 * http://benalman.com/projects/jquery-bbq-plugin/
 * 
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */
(function($,p){var i,m=Array.prototype.slice,r=decodeURIComponent,a=$.param,c,l,v,b=$.bbq=$.bbq||{},q,u,j,e=$.event.special,d="hashchange",A="querystring",D="fragment",y="elemUrlAttr",g="location",k="href",t="src",x=/^.*\?|#.*$/g,w=/^.*\#/,h,C={};function E(F){return typeof F==="string"}function B(G){var F=m.call(arguments,1);return function(){return G.apply(this,F.concat(m.call(arguments)))}}function n(F){return F.replace(/^[^#]*#?(.*)$/,"$1")}function o(F){return F.replace(/(?:^[^?#]*\?([^#]*).*$)?.*/,"$1")}function f(H,M,F,I,G){var O,L,K,N,J;if(I!==i){K=F.match(H?/^([^#]*)\#?(.*)$/:/^([^#?]*)\??([^#]*)(#?.*)/);J=K[3]||"";if(G===2&&E(I)){L=I.replace(H?w:x,"")}else{N=l(K[2]);I=E(I)?l[H?D:A](I):I;L=G===2?I:G===1?$.extend({},I,N):$.extend({},N,I);L=a(L);if(H){L=L.replace(h,r)}}O=K[1]+(H?"#":L||!K[1]?"?":"")+L+J}else{O=M(F!==i?F:p[g][k])}return O}a[A]=B(f,0,o);a[D]=c=B(f,1,n);c.noEscape=function(G){G=G||"";var F=$.map(G.split(""),encodeURIComponent);h=new RegExp(F.join("|"),"g")};c.noEscape(",/");$.deparam=l=function(I,F){var H={},G={"true":!0,"false":!1,"null":null};$.each(I.replace(/\+/g," ").split("&"),function(L,Q){var K=Q.split("="),P=r(K[0]),J,O=H,M=0,R=P.split("]["),N=R.length-1;if(/\[/.test(R[0])&&/\]$/.test(R[N])){R[N]=R[N].replace(/\]$/,"");R=R.shift().split("[").concat(R);N=R.length-1}else{N=0}if(K.length===2){J=r(K[1]);if(F){J=J&&!isNaN(J)?+J:J==="undefined"?i:G[J]!==i?G[J]:J}if(N){for(;M<=N;M++){P=R[M]===""?O.length:R[M];O=O[P]=M<N?O[P]||(R[M+1]&&isNaN(R[M+1])?{}:[]):J}}else{if($.isArray(H[P])){H[P].push(J)}else{if(H[P]!==i){H[P]=[H[P],J]}else{H[P]=J}}}}else{if(P){H[P]=F?i:""}}});return H};function z(H,F,G){if(F===i||typeof F==="boolean"){G=F;F=a[H?D:A]()}else{F=E(F)?F.replace(H?w:x,""):F}return l(F,G)}l[A]=B(z,0);l[D]=v=B(z,1);$[y]||($[y]=function(F){return $.extend(C,F)})({a:k,base:k,iframe:t,img:t,input:t,form:"action",link:k,script:t});j=$[y];function s(I,G,H,F){if(!E(H)&&typeof H!=="object"){F=H;H=G;G=i}return this.each(function(){var L=$(this),J=G||j()[(this.nodeName||"").toLowerCase()]||"",K=J&&L.attr(J)||"";L.attr(J,a[I](K,H,F))})}$.fn[A]=B(s,A);$.fn[D]=B(s,D);b.pushState=q=function(I,F){if(E(I)&&/^#/.test(I)&&F===i){F=2}var H=I!==i,G=c(p[g][k],H?I:{},H?F:2);p[g][k]=G+(/#/.test(G)?"":"#")};b.getState=u=function(F,G){return F===i||typeof F==="boolean"?v(F):v(G)[F]};b.removeState=function(F){var G={};if(F!==i){G=u();$.each($.isArray(F)?F:arguments,function(I,H){delete G[H]})}q(G,2)};e[d]=$.extend(e[d],{add:function(F){var H;function G(J){var I=J[D]=c();J.getState=function(K,L){return K===i||typeof K==="boolean"?l(I,K):l(I,L)[K]};H.apply(this,arguments)}if($.isFunction(F)){H=F;return G}else{H=F.handler;F.handler=G}}})})(jQuery,this);
/*
 * jQuery hashchange event - v1.2 - 2/11/2010
 * http://benalman.com/projects/jquery-hashchange-plugin/
 * 
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */
(function($,i,b){var j,k=$.event.special,c="location",d="hashchange",l="href",f=$.browser,g=document.documentMode,h=!!window.ActiveXObject&&(g===b||g<8),e="on"+d in i&&!h;function a(m){m=m||i[c][l];return m.replace(/^[^#]*#?(.*)$/,"$1")}$[d+"Delay"]=100;k[d]=$.extend(k[d],{setup:function(){if(e){return false}$(j.start)},teardown:function(){if(e){return false}$(j.stop)}});j=(function(){var m={},r,n,o,q;function p(){o=q=function(s){return s};if(h){n=$('<iframe src="javascript:0"/>').hide().insertAfter("body")[0].contentWindow;q=function(){return a(n.document[c][l])};o=function(u,s){if(u!==s){var t=n.document;t.open().close();t[c].hash="#"+u}};o(a())}}m.start=function(){if(r){return}var t=a();o||p();(function s(){var v=a(),u=q(t);if(v!==t){o(t=v,u);$(i).trigger(d)}else{if(u!==t){i[c][l]=i[c][l].replace(/#.*/,"")+"#"+u}}r=setTimeout(s,$[d+"Delay"])})()};m.stop=function(){if(!n){r&&clearTimeout(r);r=0}};return m})()})(jQuery,this);/*!
 * jQuery Cookie Plugin v1.4.1
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2006, 2014 Klaus Hartl
 * Released under the MIT license
 */
(function(a){if(typeof define==="function"&&define.amd){define(["jquery"],a)}else{if(typeof exports==="object"){module.exports=a(require("jquery"))}else{a(jQuery)}}}(function(f){var a=/\+/g;function d(i){return b.raw?i:encodeURIComponent(i)}function g(i){return b.raw?i:decodeURIComponent(i)}function h(i){return d(b.json?JSON.stringify(i):String(i))}function c(i){if(i.indexOf('"')===0){i=i.slice(1,-1).replace(/\\"/g,'"').replace(/\\\\/g,"\\")}try{i=decodeURIComponent(i.replace(a," "));return b.json?JSON.parse(i):i}catch(j){}}function e(j,i){var k=b.raw?j:c(j);return f.isFunction(i)?i(k):k}var b=f.cookie=function(q,p,v){if(arguments.length>1&&!f.isFunction(p)){v=f.extend({},b.defaults,v);if(typeof v.expires==="number"){var r=v.expires,u=v.expires=new Date();u.setMilliseconds(u.getMilliseconds()+r*86400000)}return(document.cookie=[d(q),"=",h(p),v.expires?"; expires="+v.expires.toUTCString():"",v.path?"; path="+v.path:"",v.domain?"; domain="+v.domain:"",v.secure?"; secure":""].join(""))}var w=q?undefined:{},s=document.cookie?document.cookie.split("; "):[],o=0,m=s.length;for(;o<m;o++){var n=s[o].split("="),j=g(n.shift()),k=n.join("=");if(q===j){w=e(k,p);break}if(!q&&(k=e(k))!==undefined){w[j]=k}}return w};b.defaults={};f.removeCookie=function(j,i){f.cookie(j,"",f.extend({},i,{expires:-1}));return !f.cookie(j)}}));
if (window.location) {
//support: ?id=123&a[]=1&a[2]=2&a[3][]=3
window.location.query = function(param) {
	var params = jQuery.deparam.querystring();
	return params[param] ? params[param] : null;
};
};
(function($){
	$.OS = {
		is_phone : /(Android|webOS|iPhone|Windows\sPhone|iPod|BlackBerry|SymbianOS)/i.test(navigator.userAgent),
		ios : /(iPod|iPhone|iPad)/i.test(navigator.userAgent),
		android : /Android/i.test(navigator.userAgent),
		symbian : /SymbianOS/i.test(navigator.userAgent),
		blackberry : /BlackBerry/i.test(navigator.userAgent),
		webos : /webOS/i.test(navigator.userAgent),
		wp : /Windows\sPhone/i.test(navigator.userAgent),
		wechat : /MicroMessenger/i.test(navigator.userAgent)
	};
	var scripts = document.getElementsByTagName("script");
	var thiscript = scripts[ scripts.length - 1 ];
	$.baseuri = thiscript.src.toString().match(/[^\/:](\/.*)static\/js\/common\.js/i)[1];
	if (!$.baseuri) $.baseuri = '/';
	//init csrf
	$.csrf = $('meta[name="csrf-token"]').attr('content');
	if ($.csrf) {
		$.ajaxSetup({
			headers: {
				'X-CSRF-TOKEN': $.csrf
			}
		});
	}
	$.supportTransition = (function(){
		var s = document.createElement('p').style,
		r = 'transition' in s ||
			'WebkitTransition' in s ||
			'MozTransition' in s ||
			'msTransition' in s ||
			'OTransition' in s;
		s = null;
		return r;
	})();
	/* Gets window width cross browser */
	$.window_size = function(){
		return {'width' : window.innerWidth
				|| document.documentElement.clientWidth
				|| document.body.clientWidth,
				'height' : window.innerHeight
				|| document.documentElement.clientHeight
				|| document.body.clientHeight,
			};
	};
	$.getAnsiLength = function(b, ansi) {
		if (!(typeof b == 'string') || !ansi) {
			return b.length;
		}
		var a = b.match(/[^\x00-\x80]/g);
		return b.length + (a ? a.length : 0);
	};
	$.isUndefined = function(obj) {
		return typeof obj == 'undefined';
	};
	$.isjQuery = function(obj) {
		return obj instanceof jQuery;
	};

	/**
	 * post or get a url
	 * @example post it when [data] isn't null
	 * @example get it when [data] is null/undefined
	 * @example show tips when [alert_it] is true
	 * 
	 * @param  {String}   		url      query URL
	 * @param  {String/Object}	data     form data
	 * @param  {Function} 		callback call it when query success
	 * @param  {Boolean/Object} alert_it show tips when true or noty's config
	 */
	$.query = function(url, data, method, callback, alert_it) {
		if ($.isUndefined(alert_it)) alert_it = true;
		if ($.isUndefined(method)) method = data ? 'POST' : 'GET';
		var _this = this, _result = null, _headers = {}, _data = data;
		if (data && data instanceof String) _data = $.deparam(data);
		if (_data && _data['_method']) {
			method = _data['_method'];
			_headers['X-HTTP-Method-Override'] = method;
		};
		if (_data && _data['_token']) //add csrf
			_headers['X-CSRF-TOKEN'] = _data['_token'];
		var ajax = $.ajax({
			url : url,
			data : _data ? _data : null,
			async : callback !== false, 
			cache : false,
			type : method.toUpperCase(),
			headers: _headers,
			timeout : 20000,
			dataType : /[\?&](jsonp|callback)=\?/i.test(url) ? 'jsonp' : 'json',
			success : function(json, textStatus, jqXHR) {
				if (json) {
					if (json.result && alert_it){
						$.showtips(json, true, alert_it);
					}
				}
				if (callback === false)	{
					_result = json;
					return _result;
				}
				if (callback && $.isFunction(callback))
					callback.call(_this, json, textStatus, jqXHR);
			},
			error : function(XMLHttpRequest, textStatus, errorThrown) {
				if (alert_it)
				{
					switch(textStatus) {
						case 'timeout':
							$.tips(COMMON_LANGUAGE.network_timeout);
							break;
						case 'error':
							break;
						case 'notmodified':
							break;
						case 'parsererror':
							$.tips(COMMON_LANGUAGE.parser_error);
							break;
						default:
							$.tips(COMMON_LANGUAGE.server_error);
							break;
					}
				}
			}
		});
		return callback === false ? _result : ajax;
	};
	$.GET = function(url, data, callback, alert_it) {
		alert_it = typeof alert_it == 'undefined' ? false : alert_it;
		return $.query.call(this, url, data, 'GET', callback, alert_it);
	};
	$.POST = function(url, data, callback, alert_it) {
		alert_it = typeof alert_it == 'undefined' ? false : alert_it;
		return $.query.call(this, url, data, 'POST', callback, alert_it)
	};
	$.PUT = function(url, data, callback, alert_it) {
		alert_it = typeof alert_it == 'undefined' ? false : alert_it;
		return $.query.call(this, url, data, 'PUT', callback, alert_it)
	};
	$.DELETE = function(url, data, callback, alert_it) {
		alert_it = typeof alert_it == 'undefined' ? false : alert_it;
		return $.query.call(this, url, data, 'DELETE', callback, alert_it)
	};
	$.HEAD = function(url, data, callback, alert_it) {
		alert_it = typeof alert_it == 'undefined' ? false : alert_it;
		return $.query.call(this, url, data, 'HEAD', callback, alert_it)
	};
	$.PATCH = function(url, data, callback, alert_it) {
		alert_it = typeof alert_it == 'undefined' ? false : alert_it;
		return $.query.call(this, url, data, 'PATCH', callback, alert_it)
	};

	$.showtips = function(tips, redirect, config) {
		var _tips = clone(tips);
		var _redirect = $.isUndefined(redirect) ? true : redirect;
		if (typeof $.showtips_interface != 'undefined') {
			$.showtips_interface(_tips, config);
		} else
			alert(_tips.message.content.noHTML());

		if (_redirect) {
			if (_tips.url !== true && _tips.url !== false) {
				setTimeout(function() {
					self.location.href = _tips.url;
				}, 1500);
			} else if (_tips.url === true) {
				setTimeout(function() {
					self.location.reload();
				}, 1500);
			}
		}
	};
	/**
	 * [alert description]
	 * @param  {String} msg              [description]
	 * @param  {[type]} confirm_callback [description]
	 * @return {[type]}                  [description]
	 */
	$.alert = function(msg, confirm_callback) {
		var $dfd = jQuery.Deferred();

		if (typeof $.alert_interface != 'undefined')
			$.alert_interface(msg, confirm_callback, $dfd);
		else {
			alert(msg);
			if (confirm_callback && $.isFunction(confirm_callback))	confirm_callback.call(this);
			$dfd.resolve();
		}
		return $dfd.promise();
	};

	$.prompt = function(msg, confirm_callback, cancel_callback) {
		var $dfd = jQuery.Deferred();
		var _confirm = function(v){
			if (!v) return _cancel();
			if (confirm_callback && $.isFunction(confirm_callback)) confirm_callback.call(this,[v]);
			$dfd.resolve([v]);
		}
		var _cancel = function(){
			if (cancel_callback && $.isFunction(cancel_callback)) cancel_callback.call(this);
			$dfd.reject();
		}
		
		if (typeof $.prompt_interface != 'undefined')
			$.prompt_interface(msg, _confirm, _cancel, $dfd);
		else {
			if (v = prompt(msg))
				_confirm(v);
			else
				_cancel();
		}
		return $dfd.promise();
	};
	$.tips = function(msg, timeout) {
		var $dfd = jQuery.Deferred();
		if (typeof $.tips_interface != 'undefined')
			$.tips_interface(msg, timeout, $dfd);
		else {
			alert(msg);
			$dfd.resolve();
		}
		return $dfd.promise();
	};
	$.confirm = function(msg, confirm_callback, cancel_callback) {
		var $dfd = jQuery.Deferred();
		if (typeof $.confirm_interface != 'undefined')
			$.confirm_interface(msg, confirm_callback, cancel_callback, $dfd);
		else {
			if (confirm(msg)) {
				if (confirm_callback && $.isFunction(confirm_callback)) confirm_callback.call(this);
				$dfd.resolve();
			} else {
				if (cancel_callback && $.isFunction(confirm_callback)) cancel_callback.call(this);
				$dfd.reject();
			}
		}
		return $dfd.promise();
	};

	$.fn.extend({checkAll : function($selector, callback) {
		if(!$.isjQuery($selector)) $selector = $($selector);
		var t = this;
		$selector.on('click change', function(){
			var length = $selector.length;
			var checked_length = $selector.filter(':checked').length;
			t.prop({"checked": length == checked_length && length != 0, "indeterminate" : length != checked_length && checked_length != 0 });
			if (callback && $.isFunction(callback)) callback.call(t.add($selector), t.prop("checked"), t.prop("indeterminate"));
		});
		return this.each(function(){
			$(this).on('click change', function(){
				$selector.prop('checked', this.checked);
				if (callback && $.isFunction(callback)) callback.call(t.add($selector), this.checked, false);
			});
		});
	}, count_down : function(format, delta, duration){ //delta = server microtime - client microtime
		if (format === false) return this.each(function(){
			var interval = $(this).data('count-down-interval');clearInterval(interval); interval = null;
		});
		if ($.isUndefined(delta)) delta = 0;
		return this.data({'count-down-delta' : delta, 'count-down-format' : format}).each(function(){
			var $this = $(this);
			var count_down_method = function() {
				var count_down = $this.data('count-down');
				var format =  $this.data('count-down-format');
				if (count_down) {
					var target = count_down.toDate();
					$this.data('count_down',target);
					var delta = parseInt($this.data('count-down-delta'));
					var cd = target.getTime() - (new Date()).getTime() + delta;
					var text = '';
					if ( cd > 0 ) {
						if (format) {
							text = cd.toCountDownString(format);
							if($this.is(':input:not(button[value])')) $this.val(text); else $this.html(text);
						}
						$this.triggerHandler('count-down-ing',[cd, text]);
					} else {
						var interval = $this.data('count-down-interval');
						clearInterval(interval); interval = null;
						if (format) {
							cd = 0; //to 0
							text = cd.toCountDownString(format);
							if($this.is(':input:not(button[value])')) $this.val(text); else $this.html(text);
						}
						$this.triggerHandler('count-down-stop',[cd, text]);
					}
				}
			}
			var interval = setInterval(count_down_method, $.isUndefined(duration) || duration < 10 ? 500 : parseInt(duration));
			$this.data('count-down-interval', interval);
			$this.triggerHandler('count-down-start',[0, '']);
			count_down_method.call(this); //call it
		});
	}, query : function(callback, alert_it, show_loading) {
		return this.each(function() {
			var $this = $(this);
			var is_form = $this.is('form');
			show_loading = show_loading !== undefined ? show_loading : true;
			var validator = is_form ? $this.data('validator') : null;
			if (validator) validator.settings.submitHandler = function(f,e) {};
			$this.on(is_form ? 'submit': 'click', function(e){
				var selector = $this.attr('selector');
				if ($this.is('.disabled,[disabled]')) return false;
				var $selector = is_form ? $this.add(selector) : $(selector);
				if (validator && !$.isEmptyObject(validator.invalid)) //validator is invalid
					return false;
				
				if((selector || is_form) && $selector.serializeArray().length <= 0) //selector is set,but nothing to query
				{
					$.tips(COMMON_LANGUAGE.unselected);
					return false;
				}
				
				var url = $this.attr(is_form ? 'action' : 'href');
				var method = $this.attr('method');
				var msg = $this.attr('confirm');
				var query = function(){
					var $doms = is_form ? $(':submit,:image',$this)/*.add($this)*/ : $this;
					$doms = $doms.filter(':not(.disabled,[disabled])');
					$doms.prop('disabled',true).attr('disabled','disabled').each(function(){
						var $t = $(this);var o = $t.offset();
						if (show_loading) $('<div style="position:absolute;left:'+(o.left + $t.width())+'px;top:'+(o.top - 16) +'px;height:16px;width:16px;display:block;z-index:99999" class="query-loading"><img src="data:image/gif;base64,R0lGODlhEAAQAPYAAP///z/g/975/q7x/ofr/m/n/nLo/pHs/rjz/uT5/rrz/lrk/l3k/mPl/mfm/m3n/o7s/sr1/lTj/pTt/vD7/vH8/tD2/qbw/nvp/oXr/s32/tv4/mrm/k/i/qjw/r70/oTq/pzu/uj6/qPv/knh/o3s/rTy/ovs/sf1/nPo/kbh/sP0/q/x/lHi/kPg/u37/vb8/pnu/qLv/vf9/qDv/r3z/vr9/vz9/s/2/tb3/vn9/t/5/sH0/vP8/tz4/ur6/uX6/tn4/tP3/sz2/uf6/uH5/vT8/uL5/pru/sb1/sT1/njo/nzp/oLq/ojr/nDn/mzn/tL3/pft/mTl/u77/l7k/qnw/oHq/mDl/lXj/rfy/nnp/kzi/qXw/orr/mbm/tX3/tj4/uv7/sn1/p3u/qzx/rXy/n/q/qvx/nbo/nXo/ljk/rvz/kvh/kjh/sD0/kLg/rLy/lvk/k7i/mnm/pbt/mHl/kXg/pPt/lfj/n7p/pDs/p/v/gAAAAAAAAAAACH+GkNyZWF0ZWQgd2l0aCBhamF4bG9hZC5pbmZvACH5BAAKAAAAIf8LTkVUU0NBUEUyLjADAQAAACwAAAAAEAAQAAAHjYAAgoOEhYUbIykthoUIHCQqLoI2OjeFCgsdJSsvgjcwPTaDAgYSHoY2FBSWAAMLE4wAPT89ggQMEbEzQD+CBQ0UsQA7RYIGDhWxN0E+ggcPFrEUQjuCCAYXsT5DRIIJEBgfhjsrFkaDERkgJhswMwk4CDzdhBohJwcxNB4sPAmMIlCwkOGhRo5gwhIGAgAh+QQACgABACwAAAAAEAAQAAAHjIAAgoOEhYU7A1dYDFtdG4YAPBhVC1ktXCRfJoVKT1NIERRUSl4qXIRHBFCbhTKFCgYjkII3g0hLUbMAOjaCBEw9ukZGgidNxLMUFYIXTkGzOmLLAEkQCLNUQMEAPxdSGoYvAkS9gjkyNEkJOjovRWAb04NBJlYsWh9KQ2FUkFQ5SWqsEJIAhq6DAAIBACH5BAAKAAIALAAAAAAQABAAAAeJgACCg4SFhQkKE2kGXiwChgBDB0sGDw4NDGpshTheZ2hRFRVDUmsMCIMiZE48hmgtUBuCYxBmkAAQbV2CLBM+t0puaoIySDC3VC4tgh40M7eFNRdH0IRgZUO3NjqDFB9mv4U6Pc+DRzUfQVQ3NzAULxU2hUBDKENCQTtAL9yGRgkbcvggEq9atUAAIfkEAAoAAwAsAAAAABAAEAAAB4+AAIKDhIWFPygeEE4hbEeGADkXBycZZ1tqTkqFQSNIbBtGPUJdD088g1QmMjiGZl9MO4I5ViiQAEgMA4JKLAm3EWtXgmxmOrcUElWCb2zHkFQdcoIWPGK3Sm1LgkcoPrdOKiOCRmA4IpBwDUGDL2A5IjCCN/QAcYUURQIJIlQ9MzZu6aAgRgwFGAFvKRwUCAAh+QQACgAEACwAAAAAEAAQAAAHjIAAgoOEhYUUYW9lHiYRP4YACStxZRc0SBMyFoVEPAoWQDMzAgolEBqDRjg8O4ZKIBNAgkBjG5AAZVtsgj44VLdCanWCYUI3txUPS7xBx5AVDgazAjC3Q3ZeghUJv5B1cgOCNmI/1YUeWSkCgzNUFDODKydzCwqFNkYwOoIubnQIt244MzDC1q2DggIBACH5BAAKAAUALAAAAAAQABAAAAeJgACCg4SFhTBAOSgrEUEUhgBUQThjSh8IcQo+hRUbYEdUNjoiGlZWQYM2QD4vhkI0ZWKCPQmtkG9SEYJURDOQAD4HaLuyv0ZeB4IVj8ZNJ4IwRje/QkxkgjYz05BdamyDN9uFJg9OR4YEK1RUYzFTT0qGdnduXC1Zchg8kEEjaQsMzpTZ8avgoEAAIfkEAAoABgAsAAAAABAAEAAAB4iAAIKDhIWFNz0/Oz47IjCGADpURAkCQUI4USKFNhUvFTMANxU7KElAhDA9OoZHH0oVgjczrJBRZkGyNpCCRCw8vIUzHmXBhDM0HoIGLsCQAjEmgjIqXrxaBxGCGw5cF4Y8TnybglprLXhjFBUWVnpeOIUIT3lydg4PantDz2UZDwYOIEhgzFggACH5BAAKAAcALAAAAAAQABAAAAeLgACCg4SFhjc6RhUVRjaGgzYzRhRiREQ9hSaGOhRFOxSDQQ0uj1RBPjOCIypOjwAJFkSCSyQrrhRDOYILXFSuNkpjggwtvo86H7YAZ1korkRaEYJlC3WuESxBggJLWHGGFhcIxgBvUHQyUT1GQWwhFxuFKyBPakxNXgceYY9HCDEZTlxA8cOVwUGBAAA7AAAAAAAAAAAA"</div>').appendTo('body');
					}); //disabled the submit button
					return $.query.call($this, url, $selector.serializeArray(), method, callback, alert_it).always(function(){
						$('.query-loading').remove();
						$doms.prop('disabled',false).removeAttr('disabled');
					});
				}
				if (msg) {
					msg = msg.replace('%L', $selector.serializeArray().length)
					$.confirm(msg, query);
				} else
					query.call(this);
				e.stopImmediatePropagation();
				return false;
			});
		});
	}
	});
})(jQuery);