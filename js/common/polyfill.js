
/**
 * Avoid `console` errors in browsers that lack a console 
 * IE 6,7没有console，此处仅仅为了修复报错。
 */
(function(){var e;var t=function(){};var n=["assert","clear","count","debug","dir","dirxml","error","exception","group","groupCollapsed","groupEnd","info","log","markTimeline","profile","profileEnd","table","time","timeEnd","timeStamp","trace","warn"];var r=n.length;var i=window.console=window.console||{};while(r--){e=n[r];if(!i[e]){i[e]=t;}}})();
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
	  
	for(var prop in baseSprite.prototype){  
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
}
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
}
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
		for (var key in this) {
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
function array_change_key_case (array, cs) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/array_change_key_case/
  // original by: Ates Goral (http://magnetiq.com)
  // improved by: marrtins
  // improved by: Brett Zamir (http://brett-zamir.me)
  //   example 1: array_change_key_case(42)
  //   returns 1: false
  //   example 2: array_change_key_case([ 3, 5 ])
  //   returns 2: [3, 5]
  //   example 3: array_change_key_case({ FuBaR: 42 })
  //   returns 3: {"fubar": 42}
  //   example 4: array_change_key_case({ FuBaR: 42 }, 'CASE_LOWER')
  //   returns 4: {"fubar": 42}
  //   example 5: array_change_key_case({ FuBaR: 42 }, 'CASE_UPPER')
  //   returns 5: {"FUBAR": 42}
  //   example 6: array_change_key_case({ FuBaR: 42 }, 2)
  //   returns 6: {"FUBAR": 42}

  var caseFnc;
  var key;
  var tmpArr = {};

  if (Object.prototype.toString.call(array) === '[object Array]') {
    return array;
  }

  if (array && typeof array === 'object') {
    caseFnc = (!cs || cs === 'CASE_LOWER') ? 'toLowerCase' : 'toUpperCase';
    for (key in array) {
      tmpArr[key[caseFnc]()] = array[key];
    }
    return tmpArr;
  }

  return false;
}
/**
 * 序列化
 * @param  {mixed} mixedValue Object/Array/String/...
 * @return {String}           序列化后的字符串
 */
function serialize (mixedValue) {
  //  discuss at: http://locutus.io/php/serialize/
  // original by: Arpad Ray (mailto:arpad@php.net)
  // improved by: Dino
  // improved by: Le Torbi (http://www.letorbi.de/)
  // improved by: Kevin van Zonneveld (http://kvz.io/)
  // bugfixed by: Andrej Pavlovic
  // bugfixed by: Garagoth
  // bugfixed by: Russell Walker (http://www.nbill.co.uk/)
  // bugfixed by: Jamie Beck (http://www.terabit.ca/)
  // bugfixed by: Kevin van Zonneveld (http://kvz.io/)
  // bugfixed by: Ben (http://benblume.co.uk/)
  // bugfixed by: Codestar (http://codestarlive.com/)
  //    input by: DtTvB (http://dt.in.th/2008-09-16.string-length-in-bytes.html)
  //    input by: Martin (http://www.erlenwiese.de/)
  //      note 1: We feel the main purpose of this function should be to ease
  //      note 1: the transport of data between php & js
  //      note 1: Aiming for PHP-compatibility, we have to translate objects to arrays
  //   example 1: serialize(['Kevin', 'van', 'Zonneveld'])
  //   returns 1: 'a:3:{i:0;s:5:"Kevin";i:1;s:3:"van";i:2;s:9:"Zonneveld";}'
  //   example 2: serialize({firstName: 'Kevin', midName: 'van'})
  //   returns 2: 'a:2:{s:9:"firstName";s:5:"Kevin";s:7:"midName";s:3:"van";}'

  var val, key, okey;
  var ktype = '';
  var vals = '';
  var count = 0;

  var _utf8Size = function (str) {
    var size = 0;
    var i = 0;
    var l = str.length;
    var code = '';
    for (i = 0; i < l; i++) {
      code = str.charCodeAt(i);
      if (code < 0x0080) {
        size += 1;
      } else if (code < 0x0800) {
        size += 2;
      } else {
        size += 3;
      }
    }
    return size;
  };

  var _getType = function (inp) {
    var match;
    var key;
    var cons;
    var types;
    var type = typeof inp;

    if (type === 'object' && !inp) {
      return 'null';
    }

    if (type === 'object') {
      if (!inp.constructor) {
        return 'object';
      }
      cons = inp.constructor.toString();
      match = cons.match(/(\w+)\(/);
      if (match) {
        cons = match[1].toLowerCase();
      }
      types = ['boolean', 'number', 'string', 'array'];
      for (key in types) {
        if (cons === types[key]) {
          type = types[key];
          break;
        }
      }
    }
    return type;
  };

  var type = _getType(mixedValue);

  switch (type) {
    case 'function':
      val = '';
      break;
    case 'boolean':
      val = 'b:' + (mixedValue ? '1' : '0');
      break;
    case 'number':
      val = (Math.round(mixedValue) === mixedValue ? 'i' : 'd') + ':' + mixedValue;
      break;
    case 'string':
      val = 's:' + _utf8Size(mixedValue) + ':"' + mixedValue + '"';
      break;
    case 'array':
    case 'object':
      val = 'a';
      /*
      if (type === 'object') {
        var objname = mixedValue.constructor.toString().match(/(\w+)\(\)/);
        if (objname === undefined) {
          return;
        }
        objname[1] = serialize(objname[1]);
        val = 'O' + objname[1].substring(1, objname[1].length - 1);
      }
      */

      for (key in mixedValue) {
        if (mixedValue.hasOwnProperty(key)) {
          ktype = _getType(mixedValue[key]);
          if (ktype === 'function') {
            continue;
          }

          okey = (key.match(/^[0-9]+$/) ? parseInt(key, 10) : key);
          vals += serialize(okey) + serialize(mixedValue[key]);
          count++;
        }
      }
      val += ':' + count + ':{' + vals + '}';
      break;
    //case 'undefined':
    default:
      // Fall-through
      // if the JS object has a property which contains a null value,
      // the string cannot be unserialized by PHP
      val = 'N';
      break;
  }
  if (type !== 'object' && type !== 'array') {
    val += ';';
  }

  return val;
}
/**
 * 反序列化
 * @param  {String} data 
 * @return {mixed}      得到的Object/Array/String/...
 */
function unserialize (data) {
  //  discuss at: http://locutus.io/php/unserialize/
  // original by: Arpad Ray (mailto:arpad@php.net)
  // improved by: Pedro Tainha (http://www.pedrotainha.com)
  // improved by: Kevin van Zonneveld (http://kvz.io)
  // improved by: Kevin van Zonneveld (http://kvz.io)
  // improved by: Chris
  // improved by: James
  // improved by: Le Torbi
  // improved by: Eli Skeggs
  // bugfixed by: dptr1988
  // bugfixed by: Kevin van Zonneveld (http://kvz.io)
  // bugfixed by: Brett Zamir (http://brett-zamir.me)
  //  revised by: d3x
  //    input by: Brett Zamir (http://brett-zamir.me)
  //    input by: Martin (http://www.erlenwiese.de/)
  //    input by: kilops
  //    input by: Jaroslaw Czarniak
  //      note 1: We feel the main purpose of this function should be
  //      note 1: to ease the transport of data between php & js
  //      note 1: Aiming for PHP-compatibility, we have to translate objects to arrays
  //   example 1: unserialize('a:3:{i:0;s:5:"Kevin";i:1;s:3:"van";i:2;s:9:"Zonneveld";}')
  //   returns 1: ['Kevin', 'van', 'Zonneveld']
  //   example 2: unserialize('a:2:{s:9:"firstName";s:5:"Kevin";s:7:"midName";s:3:"van";}')
  //   returns 2: {firstName: 'Kevin', midName: 'van'}

  var $global = (typeof window !== 'undefined' ? window : global)

  var utf8Overhead = function (chr) {
    // http://locutus.io/php/unserialize:571#comment_95906
    var code = chr.charCodeAt(0)
    var zeroCodes = [
      338,
      339,
      352,
      353,
      376,
      402,
      8211,
      8212,
      8216,
      8217,
      8218,
      8220,
      8221,
      8222,
      8224,
      8225,
      8226,
      8230,
      8240,
      8364,
      8482
    ]
    if (code < 0x0080 || code >= 0x00A0 && code <= 0x00FF || zeroCodes.indexOf(code) !== -1) {
      return 0
    }
    if (code < 0x0800) {
      return 1
    }
    return 2
  }
  var error = function (type,
    msg, filename, line) {
    throw new $global[type](msg, filename, line)
  }
  var readUntil = function (data, offset, stopchr) {
    var i = 2
    var buf = []
    var chr = data.slice(offset, offset + 1)

    while (chr !== stopchr) {
      if ((i + offset) > data.length) {
        error('Error', 'Invalid')
      }
      buf.push(chr)
      chr = data.slice(offset + (i - 1), offset + i)
      i += 1
    }
    return [buf.length, buf.join('')]
  }
  var readChrs = function (data, offset, length) {
    var i, chr, buf

    buf = []
    for (i = 0; i < length; i++) {
      chr = data.slice(offset + (i - 1), offset + i)
      buf.push(chr)
      length -= utf8Overhead(chr)
    }
    return [buf.length, buf.join('')]
  }
  var _unserialize = function (data, offset) {
    var dtype
    var dataoffset
    var keyandchrs
    var keys
    var contig
    var length
    var array
    var readdata
    var readData
    var ccount
    var stringlength
    var i
    var key
    var kprops
    var kchrs
    var vprops
    var vchrs
    var value
    var chrs = 0
    var typeconvert = function (x) {
      return x
    }

    if (!offset) {
      offset = 0
    }
    dtype = (data.slice(offset, offset + 1)).toLowerCase()

    dataoffset = offset + 2

    switch (dtype) {
      case 'i':
        typeconvert = function (x) {
          return parseInt(x, 10)
        }
        readData = readUntil(data, dataoffset, ';')
        chrs = readData[0]
        readdata = readData[1]
        dataoffset += chrs + 1
        break
      case 'b':
        typeconvert = function (x) {
          return parseInt(x, 10) !== 0
        }
        readData = readUntil(data, dataoffset, ';')
        chrs = readData[0]
        readdata = readData[1]
        dataoffset += chrs + 1
        break
      case 'd':
        typeconvert = function (x) {
          return parseFloat(x)
        }
        readData = readUntil(data, dataoffset, ';')
        chrs = readData[0]
        readdata = readData[1]
        dataoffset += chrs + 1
        break
      case 'n':
        readdata = null
        break
      case 's':
        ccount = readUntil(data, dataoffset, ':')
        chrs = ccount[0]
        stringlength = ccount[1]
        dataoffset += chrs + 2

        readData = readChrs(data, dataoffset + 1, parseInt(stringlength, 10))
        chrs = readData[0]
        readdata = readData[1]
        dataoffset += chrs + 2
        if (chrs !== parseInt(stringlength, 10) && chrs !== readdata.length) {
          error('SyntaxError', 'String length mismatch')
        }
        break
      case 'a':
        readdata = {}

        keyandchrs = readUntil(data, dataoffset, ':')
        chrs = keyandchrs[0]
        keys = keyandchrs[1]
        dataoffset += chrs + 2

        length = parseInt(keys, 10)
        contig = true

        for (i = 0; i < length; i++) {
          kprops = _unserialize(data, dataoffset)
          kchrs = kprops[1]
          key = kprops[2]
          dataoffset += kchrs

          vprops = _unserialize(data, dataoffset)
          vchrs = vprops[1]
          value = vprops[2]
          dataoffset += vchrs

          if (key !== i) {
            contig = false
          }

          readdata[key] = value
        }

        if (contig) {
          array = new Array(length)
          for (i = 0; i < length; i++) {
            array[i] = readdata[i]
          }
          readdata = array
        }

        dataoffset += 1
        break
      default:
        error('SyntaxError', 'Unknown / Unhandled data type(s): ' + dtype)
        break
    }
    return [dtype, dataoffset - offset, typeconvert(readdata)]
  }

  return _unserialize((data + ''), 0)[2]
}
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
}

if (window.location) {
//support: ?id=123&a[]=1&a[2]=2&a[3][]=3
window.location.query = function(param) {
	var params = jQuery.deparam.querystring();
	return params[param] ? params[param] : null;
};
}
(function($){
	
	$.isUndefined = function(obj) {
		return typeof obj == 'undefined';
	};
	$.isjQuery = function(obj) {
		return obj instanceof jQuery;
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
		};
		var _cancel = function(){
			if (cancel_callback && $.isFunction(cancel_callback)) cancel_callback.call(this);
			$dfd.reject();
		};
		
		if (typeof $.prompt_interface != 'undefined')
			$.prompt_interface(msg, _confirm, _cancel, $dfd);
		else {
			var v = prompt(msg);
			if (v)
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
			t.prop({
				"checked": length == checked_length && length != 0,
				"indeterminate" : length != checked_length && checked_length != 0 
			});
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
		if (typeof delta == 'undefined') delta = 0;
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
			};
			var interval = setInterval(count_down_method, typeof duration == 'undefined' || duration < 10 ? 500 : parseInt(duration));
			$this.data('count-down-interval', interval);
			$this.triggerHandler('count-down-start',[0, '']);
			count_down_method.call(this); //call it
		});
	}
	});
})(jQuery);