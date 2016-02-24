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