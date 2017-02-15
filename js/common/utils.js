/**
 * @author Fly Mirage
 * 
 */

(function(){
	//OS
	window.OS = {
		is_phone : /(Android|webOS|iPhone|Windows\sPhone|iPod|BlackBerry|SymbianOS)/i.test(navigator.userAgent),
		ios : /(iPod|iPhone|iPad)/i.test(navigator.userAgent),
		android : /Android/i.test(navigator.userAgent),
		symbian : /SymbianOS/i.test(navigator.userAgent),
		blackberry : /BlackBerry/i.test(navigator.userAgent),
		webos : /webOS/i.test(navigator.userAgent),
		wp : /Windows\sPhone/i.test(navigator.userAgent),
		wechat : /MicroMessenger/i.test(navigator.userAgent)
	};
	//supportTransition
	window.supportTransition = (function(){
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
	window.window_size = function(){
		return {'width' : window.innerWidth
				|| document.documentElement.clientWidth
				|| document.body.clientWidth,
				'height' : window.innerHeight
				|| document.documentElement.clientHeight
				|| document.body.clientHeight,
			};
	};
})();

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
	for (k in arr) { 
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