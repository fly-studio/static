/* 
ABC是三个角,abc分别是这三个角的对边  
	C ___a__ B
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
math.slope = function(p1, p2)
{
	var angle = Math.atan2(p2[1] - p1[1], p2[0] - p1[0]); //角度
	return angle;
};
math.d2r = function(d) {
    return (d * Math.PI)/180;
};
// Convert Radian to Degree
math.r2d = function(r) {
    return (180 * r) / Math.PI;
};
math.hitRect = function(r1, r2)
{
	var minx = r1.x > r2.x ? r1.x : r2.x
		,miny = r1.y > r2.y ? r1.y : r2.y
		,maxx = (r1.x + r1.width) > (r2.x + r2.width) ? (r2.x + r2.width) : (r1.x + r1.width)
		,maxy = (r1.y + r1.height) > (r2.y + r2.height) ? (r2.y + r2.height) : (r1.y + r1.height);
	return minx <= maxx && miny <= maxy;
}

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
if (!sprite) var sprite = {};
/**
 * 
 */
sprite.modal = function(lSprite, rect, showorhide_callback)
{
	if (typeof rect == 'undefined') rect = {};
	rect.x = rect.x ? rect.x : 'center';
	rect.y = rect.y ? rect.y : 'center';

	var modal = new LSprite();
	var alpha = new LSprite();
	alpha.graphics.drawRect(0, '', [0, 0, LGlobal.width, LGlobal.height], true, '#000');
	alpha.alpha = 0.8;
	alpha.x = 0;alpha.y = 0;

	var container = new LSprite();
	container.x = rect.x == 'center' ? (LGlobal.width - lSprite.getWidth()) / 2 : rect.x;
	container.y = rect.y == 'center' ? (LGlobal.height - lSprite.getHeight()) / 2 : rect.y;
	lSprite.visible = true;
	container.addChild(lSprite);


	modal.addChild(alpha);
	modal.addChild(container);
	addChild(modal);

	if (showorhide_callback) showorhide_callback.call(lSprite, true);

	modal.addEventListener(LMouseEvent.MOUSE_UP, function(e){
		var sp = this.sp;
		sp.removeAllEventListener();
		sp.removeAllChild();
		sp.remove();
		sp.die();
		if (showorhide_callback) showorhide_callback.call(lSprite, false);
	});
};
math.toAbsolute = function(r)
{
	var s = this, sx = parseInt(LGlobal.canvasObj.style.width) / LGlobal.canvasObj.width, sy = parseInt(LGlobal.canvasObj.style.height) / LGlobal.canvasObj.height;
	var rect = {x: 0, y: 0, width: 0, height: 0};
	rect.x = (parseInt(LGlobal.canvasObj.style.marginLeft) + ((r.x * sx) >>> 0));
	rect.y = (parseInt(LGlobal.canvasObj.style.marginTop) + ((r.y * sy) >>> 0));
	rect.width = s.display.style.width = (r.width * sx >>> 0);
	rect.height = s.display.style.height = (r.height * sy >>> 0);
}
var LStageImage = (function () {
	function LStageImage () {
		var s = this;
		LExtends(s, LEventDispatcher, []);
		s.display = document.createElement("div");
		s.img = document.createElement("img");
		s.display.style.position = "absolute";
		s.display.style.top = "0px";
		s.display.style.left = "0px";
		s.display.style.zIndex = LStageImage.START_INDEX++;
		if(LGlobal.ios){
			s.display.style.overflow = "auto";
			s.display.style.webkitOverflowScrolling = "touch";
		}
		s.display.appendChild(s.img);
		s.idAdded = false;
	}
	LStageImage.START_INDEX = 21;
	var p = {
		loadURL : function (u) {
			var s = this;
			s.img.src = u;
			s.img.onload = function () {
				s.dispatchEvent(LEvent.COMPLETE);
			};
			/*s.img.onmousedown = function(e) {
				s.dispatchEvent(LMouseEvent.MOUSE_DOWN);
			}
			s.img.onmouseup = function(e) {
				s.dispatchEvent(LMouseEvent.MOUSE_UP);
			}
			s.img.onmousemove = function(e) {
				s.dispatchEvent(LMouseEvent.MOUSE_MOUSE);
			}*/
		},
		show : function () {
			var s = this;
			if (!s.idAdded) {
				LGlobal.object.appendChild(s.display);
				s.idAdded = true;
			}
			if (s.display.style.display == "none") {
				s.display.style.display = "";
			}
		},
		die : function () {
			LGlobal.object.removeChild(this.display);
			this.idAdded = false;
		},
		hide : function () {
			this.display.style.display = "none";
		},
		setViewPort : function (r) {
			var s = this, sx = parseInt(LGlobal.canvasObj.style.width) / LGlobal.canvasObj.width, sy = parseInt(LGlobal.canvasObj.style.height) / LGlobal.canvasObj.height;
			s.display.style.top = (parseInt(LGlobal.canvasObj.style.marginTop) + ((r.y * sy) >>> 0)) + "px";
			s.display.style.left = (parseInt(LGlobal.canvasObj.style.marginLeft) + ((r.x * sx) >>> 0)) + "px";
			s.img.style.width = s.display.style.width = (r.width * sx >>> 0) + "px";
			s.img.style.height = s.display.style.height = (r.height * sy >>> 0) + "px";
		},
		getX : function() {
			return parseFloat(this.display.style.top);
		},
		getY : function() {
			return parseFloat(this.display.style.left);
		},
		getWidth : function() {
			return parseFloat(this.img.style.width);
		},
		getHeight : function() {
			return parseFloat(this.img.style.height);
		},
		getContainer: function() {
			return this.display;
		},
		getImage: function() {
			return this.img;
		}
	};
	for (var k in p)
		LStageImage.prototype[k] = p[k];
	return LStageImage;
})();

/**
 * 地图类，地图的图片需要分割并处理大小，此处不支持图片的缩放，需要自己切好
 * @param {Number} width 容器宽
 * @param {Number} height 容器高
 * @param {Array} imgList [[行1,图片,数组],[行2,图片,数组],[行3,图片,数组]] 比如三行的图片拼接
 * 
 * @return 
 */
var LMapSprite = (function(){
	function LMapSprite (containerWidth, containerHeight, imgList) {
		var s = this;
		LExtends(s, LSprite, []);
		s.posX = 0; s.posY = 0, s.width = 0, s.height = 0;
		s.containerWidth = containerWidth;s.containerHeight = containerHeight;
		s.imgList = imgList;
		s.bitmaps = [];
		s.cols = [];s.rows = [];
		s.width = 0;s.height = 0;
		for (var col = 0; col < imgList[0].length; col++)
			s.rows.push(parseFloat(imgList[0][col].width));
		s.width = s.rows.sum(); //第一行的宽度总数
		for (var row = 0; row < imgList.length; row++)
			s.cols.push(parseFloat(imgList[row][0].height));
		s.height = s.cols.sum(); //第1列的高度总和
	}
	var p = {
		setPos: function(x, y) {
			var s = this;
			s.posX = x;s.posY = y;
		},
		_ll_calc: function() {
			var s = this;
			for(var i in s.bitmaps)
				delete s.bitmaps[i];
			s.bitmaps = [];
			s.removeAllChild();

			//计算开始x,结束x
			var startX,endX,startY,endY,startCube,endCube;
			startX = Math.max(0, posX - s.containerWidth / 2);
			endX = Math.min(startX + s.containerWidth, s.width);
			startX = endX - s.containerWidth;

			startY = Math.max(0, posX - s.containerHeight / 2);
			endY = Math.min(startY + s.containerHeight, s.height);
			startY = endY - s.containerHeight;

			startCube = s._in_row_col(startX, startY);
			endCube = s._in_row_col(endX, endY);

			var x,y = startCube.top - startY;
			//绘制bitmap到容器
			for (var col = startCube.col; col <= endCube.col; col++) {
				x = startCube.left - startX;
				for (var row = startCube.row; row <= endCube.row; row++) {
					var bmp = new LBitmap(new LBitmapData(s.imgList[row][col]));
					s.bitmaps.push(bmp);
					s.x = x; s.y = y;
					s.addChild(bmp);
					x += s.rows[row];
				}
				y += s.cols[col];
			}

		},
		_in_row_col: function(x, y) {
			var s = this;
			var row = col = left = top = 0;
			for (var i = 0, n = 0; i < s.cols.length; i++)
				if (y >= (n += cols[i])) {col = i; left = n - cols[i];};
			for (var i = 0, n = 0; i < s.rows.length; i++)
				if (x >= (n += rows[i])) {row = i; top = n - rows[i];};
			return {row: row, col: col, left: left, top: top};
		},

		_ll_show : function (c) {
			var s = this;
			s._ll_calc();
			s.graphics.ll_show(c);
			LGlobal.show(s.childList, c);
			s._ll_debugShape(c);
		},

	};
	for (var k in p)
		LMapSprite.prototype[k] = p[k];
	return LMapSprite;
})();