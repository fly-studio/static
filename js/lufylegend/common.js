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
 * 画一个矩形或者圆形的彩虹
 * 如果定义r，并且 r = 宽或高 / 2 ，则会显示成圆，宽高相同会更好，
 * 
 * @param  {Number} width  图片宽
 * @param  {Number} height 图片高，不定义则为宽，正方形
 * @param  {Number} r      从中心点的放射半径，不设置会自动计算
 * @return {CanvasElement} Canvas的一个彩虹图片
 */
bitmap.rainbow = function(width, height, r)
{
	var canvas = document.createElement("canvas");
	var graphics = canvas.getContext("2d");
	height = height || width;
	canvas.width = width; canvas.height = height;
	r = r || Math.sqrt(2 * Math.pow(Math.max(width, height) / 2, 2));
	var cx = width / 2, cy = height / 2;
	for (var i = 0; i < 360; i += 0.1) {
		var rad = i * 0.0174532925;
		var x = cx + r * Math.cos(rad); //圆的边沿坐标
		var y = cy + r * Math.sin(rad);
		//不能超出矩形
		x = Math.min(width , Math.max(0, x));
		y = Math.min(height , Math.max(0, y));
		var grad = graphics.createLinearGradient(cx, cy, x, y);
		grad.addColorStop(0, "white");
		grad.addColorStop(0.01, "white");
		grad.addColorStop(0.99, "hsla(" + i + ", 100%, 50%, 1.0)");
		grad.addColorStop(1, "hsla(" + i + ", 100%, 50%, 1.0)");
		graphics.strokeStyle = grad;
		graphics.beginPath();
		graphics.moveTo(cx, cy);
		graphics.lineTo(x, y);
		graphics.stroke();
		delete grad;
	}
	return canvas;
}