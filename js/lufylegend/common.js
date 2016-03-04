/* 
ABC是三个角,abc分别是这三个角的对边  
   C ___a___ B
     |     /
     |    /
     b   c 
     |  /
     | /
     |/
     A

直角三角形
勾股  a² + b² = c²
正弦  sin(A) = 对边 / 斜边 = a / c
余弦  cos(A) = 临边 / 斜边 = b / c
正切  tan(A) = 对边 / 临边 = a / b
余切  cot(A) = 临边 / 对边 = b / a

其它三角形
sin(A) / a = sin(B) / b = sin(C) / c = 2R（R是三角形外接圆半径）
cos(A) = (b² + c² - a²) / 2bc
cos(B) = (a² + c² - b²) / 2ac
cos(C) = (a² + b² - c²) / 2ab
*/

if (!math) var math = {};
//坐标2,与坐标1形成的斜率(坐标1的x轴正方向的夹角弧度（顺时针）)
math.range = function(x1, y1, x2, y2)
{
	var angle = Math.atan2(y2 - y1, x2 - x1); //角度

	if (angle < 0) angle = angle + Math.PI;
	return angle;
};
/**
 * 模仿Excel的列名，将数字转化为 A，AA，AZ等
 * 
 * @param  {Number} index 由0开始的数字
 * @return {String}
 */
math.indexToColumn = function(index) {
	var r = 26;
	var str = '';
	if (index == 0) return 'A';
	while(index > 0) {
		if (str.length > 0) --index;
		var mr = index % r;
		str = String.fromCharCode(mr + 65) + str; 
		index = Math.floor((index - mr) / r);
	}
	return str;
};
/**
 * 模仿Excel的列名，将A，AA，AZ等转化为数字 (从0开始)
 * 
 * @param  {String} no 列名
 * @return {Number}
 */
math.columnToIndex = function(no) {
	no = no.toUpperCase();
	if (no == 'A') return 0;
	var r = 26;
	var index = 0;
	var length = no.length;
	for(var i = 0;i < length;++i) {
		var ch = no.substr(i,1);
		index += (String.charCodeAt(ch)  - 65 + 1) * Math.pow(r, length - i - 1);
	}
	return index - 1;
};
if (!color) var color = {};
/**
 * 使用canvas的createLinearGradient 创建一个渐变色彩的圆形画笔
 * 如果gradient.colors = ['#FF0000','#FF8800','#FFFF00','#77FF00','#00FF99','#0066FF','#9900FF','#660077']，可以创建一个彩虹渐变的画笔
 * 
 * @param  {Number} size     圆形直径
 * @param  {object} gradient 
 *         @param {Array} colors 颜色的数组
 *         @param {Number} angle 每个颜色占比的弧度，默认为Math.PI / 颜色数量，这样可以均分颜色
 *         @param {Number} direction 颜色渐变的方向，默认通过angle来计算
 * @param  {Context} ctx     Canvas的Context
 * @return {Gradient}        Canvas的渐变画笔
 */
color.circleGradient = function(size, gradient, ctx)
{
	var gradientColors = gradient.colors || ['red', 'green', 'blue'];
	var gradientAngle = gradient.angle || Math.PI / gradientColors.length;
	var gradientDirection = gradient.direction;
	var grad = gradientColors[0];
	ctx = ctx || LGlobal.canvas;
	if (gradientColors.length > 1) {
		var ga = gradientAngle, // gradient direction angle; 0 by default
			gd = gradientDirection || [
				size / 2 * (1 - Math.cos(ga)), // x0
				size / 2 * (1 + Math.sin(ga)), // y0
				size / 2 * (1 + Math.cos(ga)), // x1
				size / 2 * (1 - Math.sin(ga))  // y1
			];
		grad = ctx.createLinearGradient.apply(ctx, gd);

		for (var i = 0; i < gradientColors.length; i++) {
			var color = gradientColors[i],
				pos = i / (gradientColors.length - 1);

			if (color instanceof Array) {
				pos = color[1];
				color = color[0];
			}

			grad.addColorStop(pos, color);
		}
	}
	return grad;
}
/*HSV to RGB h, s, v (0 ~ 1) */
color.getHSVColor = function(h, s, v) {
	var r, g, b, i, f, p, q, t;
	if (h && s === undefined && v === undefined) {
		s = h.s, v = h.v, h = h.h;
	}
	i = Math.floor(h * 6);
	f = h * 6 - i;
	p = v * (1 - s);
	q = v * (1 - f * s);
	t = v * (1 - (1 - f) * s);
	switch (i % 6) {
		case 0: r = v, g = t, b = p; break;
		case 1: r = q, g = v, b = p; break;
		case 2: r = p, g = v, b = t; break;
		case 3: r = p, g = q, b = v; break;
		case 4: r = t, g = p, b = v; break;
		case 5: r = v, g = p, b = q; break;
	}
	var rgb='#'+toHex(r * 255)+toHex(g * 255)+toHex(b * 255);
	return rgb;
}
if (!bitmap) var bitmap = {};
//读取一个bitmap，
/**
 * [to description]
 * @param  {String/LBitmapData}   data    图片数据源，LBitmapData或者路径都可以
 * @param  {Number}   width    拉升至宽度，為空則代表圖片實際寬度
 * @param  {Number}   height   拉升至高度，為空則代表圖片實際高度
 * @param  {Function} callback 
 *         @param {ImageElement} imgObj 等同于<img />
 *         @param  {Number}   width 最终宽度
 *         @param  {Number}   height 最终高度
 *         @param {LBitmap} LImg 
 *         @param {CanvasElement} imgObj 等同于加载了本图片的<canvas>对象
 *         
 */
bitmap.to = function(data, width, height, options, callback)
{
	if (typeof data == 'string')
	{
		loader = new LLoader();
		loader.addEventListener(LEvent.COMPLETE, loadBitmapData); 
		loader.load(data, "bitmapData");
	} else {
		var event = {target: data};
		loadBitmapData(event);
	}
	function loadBitmapData (event) {
		var imgObj = event.target;
		if (!width) width = imgObj.width;
		if (!height) height = imgObj.height;

		var returnLBitmap = options.bitmap || true;
		var returnCanvas = options.canvas || false;
		var LImg,tempCanvas;

		if (returnLBitmap)
		{
			var bitmapdata = new LBitmapData(imgObj);
			LImg = new LBitmap(bitmapdata);
			LImg.scaleX = width / LImg.getWidth(); //设置放大倍数
			LImg.scaleY = height / LImg.getHeight();
		}
		
		if (returnCanvas)
		{
			tempCanvas = document.createElement("canvas"),
			tCtx = tempCanvas.getContext("2d");
			tempCanvas.width = width; tempCanvas.height = height;
			tCtx.drawImage(imgObj, 0, 0, imgObj.width, imgObj.height, 0, 0, width, height);
		}
		

		if (callback) callback.apply(this, [imgObj, width, height, LImg, tempCanvas]);
	}	

}
/**
 * 画一个矩形或者圆形的彩虹，一个从中心点放射的顺时针的彩虹，类似取色板
 * 如果定义r，并且 r = 宽或高 / 2 ，则会显示成圆
 * 
 * @param  {Number} width  图片宽
 * @param  {Number} height 图片高，不定义则为宽，正方形
 * @param  {Number} r      从中心点的放射半径，不设置会自动计算
 * @return {CanvasElement} Canvas的一个彩虹图片
 */
bitmap.rainbow = function(w, h, r, startAngle)
{
	var canvas = document.createElement("canvas");
	var graphics = canvas.getContext("2d");
	h = h || w;
	startAngle = startAngle || 0;
	canvas.width = w; canvas.height = h; //矩形
	r = r || Math.sqrt(2 * Math.pow(Math.max(w, h) / 2, 2)); //如果没有定义r，则取矩形顶点的外切圆
	var cx = w / 2, cy = h / 2; //圆心坐标
	for (var i = startAngle; i < startAngle + 360; i += 0.1) {
		var rad = (i % 360) * 0.0174532925;
		var x = cx + r * Math.cos(rad); //圆的边沿坐标
		var y = cy + r * Math.sin(rad);
		//不能超出矩形范围
		x = Math.min(w , Math.max(0, x));
		y = Math.min(h , Math.max(0, y));
		var grad = graphics.createLinearGradient(cx, cy, x, y);
		grad.addColorStop(0, "white");
		grad.addColorStop(0.01, "white");
		grad.addColorStop(0.99, "hsla(" + (i - startAngle) + ", 100%, 50%, 1.0)");
		grad.addColorStop(1, "hsla(" + (i - startAngle) + ", 100%, 50%, 1.0)");
		graphics.strokeStyle = grad;
		graphics.beginPath();
		graphics.moveTo(cx, cy);
		graphics.lineTo(x, y);
		graphics.stroke();
		delete grad;
	}
	return canvas;
}
/**
 * 圆形彩虹
 * @param  {Number} r 半径
 * @return {CanvasElement}   Canvas的一个圆形彩虹图片
 */
bitmap.circleRainbow = function(r)
{
	return bitmap.rainbow(r * 2, r * 2 , r);
}