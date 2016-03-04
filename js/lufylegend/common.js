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
math.range = function(x1, y1, x2, y2)
{
	var angle = Math.atan2(y2 - y1, x2 - x1); //角度

	if (angle < 0) angle =  angle + Math.PI;
	return angle;
}
math.distance = function(x1, y1, x2, y2)
{
	var r = Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2),2));//两点距离
	if (r > 120) r = 120;
	return r;
}
if (!color) var color = {};
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
if (!bitmap) var bitmap = {};
bitmap.to = function(data, width, height, callback)
{
	if (typeof data == 'string')
	{
		loader = new LLoader();
		loader.addEventListener(LEvent.COMPLETE, loadBitmapData); 
		loader.load(data, "bitmapData");
	} else {
		var event = {target: data};
		return loadBitmapData(event);
	}
	function loadBitmapData (event) {
		var imgObj = event.target;
		var bitmapdata = new LBitmapData(imgObj);  
		var LImg = new LBitmap(bitmapdata);
		LImg.scaleX = width / LImg.getWidth(); //设置放大倍数
		LImg.scaleY = height / LImg.getHeight();
		tempCanvas = document.createElement("canvas"),
        tCtx = tempCanvas.getContext("2d");
        tempCanvas.width = width; tempCanvas.height = height;
        tCtx.drawImage(imgObj, 0, 0, imgObj.width, imgObj.height, 0, 0, width, height);

		if (callback) callback.apply(this, [LImg, imgObj, tempCanvas, width, height]);
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