declare module Sharp {
	/**
	 * 计算两点之间的斜率(坐标1的x轴正方向的夹角弧度（顺时针）)
	 * @param  {egret.Point} p1 点1
	 * @param  {egret.Point} p2 点2
	 * @return {number}         斜率
	 */
	function slope(p1:egret.Point, p2:egret.Point):number;
	/**
	 * 计算两点之间的距离
	 * @param  {egret.Point} p1 点1
	 * @param  {egret.Point} p2 点2
	 * @return {number}         距离
	 */
	function distance(p1:egret.Point, p2:egret.Point):number;
	/**
	 * 计算点旋转之后的新坐标
	 * @param  {egret.Point} p 点
	 * @param  {number} p2     旋转的(弧度)
	 * @return {egret.Point}   新坐标
	 */
	function rotatedPoint(p1:egret.Point, rotation:number):egret.Point;
	/**
	 * 角度 to 弧度
	 * @param  {number} d 角度(-360~360)
	 * @return {number}   弧度
	 */
	function d2r(d:number):number;
	/**
	 * 弧度 to 角度
	 * @param  {number} r 弧度
	 * @return {number}   角度(-360~360)
	 */
	function r2d(r:number):number;
	/**
	 * 计算「点」与「点」是否相同
	 * @param  {egret.Point} p1 [description]
	 * @param  {egret.Point} p2 [description]
	 * @return {boolean}
	 */
	function pointHitPoint(p1:egret.Point, p2:egret.Point):boolean;
	/**
	 * 测试「点」是否在「圆」中
	 * @param  {egret.Point} p         待测试的点
	 * @param  {egret.Point} circlePos 圆心
	 * @param  {number}      radius    半径
	 * @return {boolean}
	 */
	function pointHitCircle(p:egret.Point, circlePos:egret.Point, radius:number):boolean;
	/**
	 * 测试「点」是否在「圆」中
	 * @param  {egret.Point} circlePos 圆心
	 * @param  {number}      radius    半径
	 * @param  {egret.Point} p         待测试的点
	 * @return {boolean}
	 */
	function circleHitPoint(circlePos:egret.Point, radius:number, p:egret.Point):boolean;
	/**
	 * 测试「点」是否在「矩形」中
	 * @param  {egret.Point}     p    待测试的点
	 * @param  {egret.Rectangle} rect 待测试的矩形
	 * @return {boolean}
	 */
	function pointHitRect(p:egret.Point, rect:egret.Rectangle):boolean;
	/**
	 * 测试「点」是否在「矩形」中
	 * @param  {egret.Rectangle} rect 待测试的矩形
	 * @param  {egret.Point}     p    待测试的点
	 * @return {boolean}
	 */
	function rectHitPoint(rect:egret.Rectangle, p:egret.Point):boolean;
	/**
	 * 测试两「矩形」是否相交
	 * @param  {egret.Rectangle} rect1 待测试的矩形1
	 * @param  {egret.Rectangle} rect2 待测试的矩形2
	 * @return {boolean}
	 */
	function rectHitRect(rect1:egret.Rectangle, rect2:egret.Rectangle):boolean;
	/**
	 * 测试两「圆」是否相交
	 * @param  {egret.Point} circlePos1 圆1圆心
	 * @param  {number}      radius1    圆1半径
	 * @param  {egret.Point} circlePos2 圆2圆心
	 * @param  {number}      radius2    圆2半径
	 * @return {boolean}
	 */
	function circleHitCircle(circlePos1:egret.Point, radius1:number, circlePos2:egret.Point, radius2:number):boolean;
	/**
	 * 测试「圆」与「矩形」是否相交
	 * @param  {egret.Point}     circlePos 圆心
	 * @param  {number}          radius    半径
	 * @param  {egret.Rectangle} rect      矩形
	 * @return {boolean}  
	 */
	function circleHitRect(circlePos:egret.Point, radius:number, rect:egret.Rectangle):boolean;
	/**
	 * 测试「圆」与「矩形」是否相交
	 * @param  {egret.Rectangle} rect      矩形
	 * @param  {egret.Point}     circlePos 圆心
	 * @param  {number}          radius    半径
	 * @return {boolean}
	 */
	function rectHitCircle(rect:egret.Rectangle, circlePos:egret.Point, radius:number):boolean;
	/**
	 * 测试「点」是否在「线」中
	 * @param  {egret.Point} p        待测试点
	 * @param  {egret.Point} linePos1 线起始点
	 * @param  {egret.Point} linePos2 线结束点
	 * @return {boolean}              
	 */
	function pointHitLine(p:egret.Point, linePos1:egret.Point, linePos2:egret.Point):boolean;
	/**
	 * 测试「点」是否在「线」中
	 * @param  {egret.Point} linePos1 线起始点
	 * @param  {egret.Point} linePos2 线结束点
	 * @param  {egret.Point} p        待测试点
	 * @return {boolean}              
	 */
	function lineHitPoint(linePos1:egret.Point, linePos2:egret.Point, p:egret.Point):boolean;
	/**
	 * 返回「点」与「线」垂直相交的那个「点」，没有则返回false
	 * @param  {egret.Point} p        待测试点
	 * @param  {egret.Point} linePos1 线起始点
	 * @param  {egret.Point} linePos2 线结束点
	 * @return {egret.Point/boolean}
	 */
	function pointLineClosest(p:egret.Point, linePos1:egret.Point, linePos2:egret.Point):egret.Point|boolean;
	/**
	 * 测试「线」与「圆」是否相交
	 * @param  {egret.Point} linePos1  线起始点
	 * @param  {egret.Point} linePos2  线结束点
	 * @param  {egret.Point} circlePos 圆心
	 * @param  {number}      radius    半径
	 * @return {boolean} 
	 */
	function lineHitCircle(linePos1:egret.Point, linePos2:egret.Point, circlePos:egret.Point, radius:number):boolean;
	/**
	 * 测试「线」与「圆」是否相交
	 * @param  {egret.Point} circlePos 圆心
	 * @param  {number}      radius    半径
	 * @param  {egret.Point} linePos1  线起始点
	 * @param  {egret.Point} linePos2  线结束点
	 * @return {boolean}               [description]
	 */
	function circleHitLine(circlePos:egret.Point, radius:number, linePos1:egret.Point, linePos2:egret.Point):boolean;
	/**
	 * 获取两「线」相交的「交点」，无交点返回false
	 * @param  {egret.Point} line1Pos1 线1起始点
	 * @param  {egret.Point} line1Pos2 线1结束点
	 * @param  {egret.Point} line2Pos1 线2起始点
	 * @param  {egret.Point} line2Pos2 线2结束点
	 * @return {egret.Point/boolean}
	 */
	function lineLineIntersect(line1Pos1:egret.Point, line1Pos2:egret.Point, line2Pos1:egret.Point, line2Pos2:egret.Point):egret.Point|boolean;
	/**
	 * 测试两「线」是否相交
	 * @param  {egret.Point} line1Pos1 线1起始点
	 * @param  {egret.Point} line1Pos2 线1结束点
	 * @param  {egret.Point} line2Pos1 线2起始点
	 * @param  {egret.Point} line2Pos2 线2结束点
	 * @return {boolean}
	 */
	function lineHitLine(line1Pos1:egret.Point, line1Pos2:egret.Point, line2Pos1:egret.Point, line2Pos2:egret.Point):boolean;
	/**
	 * 测试「线」与「矩形」是否相交
	 * @param  {egret.Point}     linePos1 线起始点
	 * @param  {egret.Point}     linePos2 线结束点
	 * @param  {egret.Rectangle} rect     矩形
	 * @return {boolean}                  [description]
	 */
	function lineHitRect(linePos1:egret.Point, linePos2:egret.Point, rect:egret.Rectangle):boolean;
	/**
	 * 测试「线」与「矩形」是否相交
	 * @param  {egret.Rectangle} rect     矩形
	 * @param  {egret.Point}     linePos1 线起始点
	 * @param  {egret.Point}     linePos2 线结束点
	 * @return {boolean}                  [description]
	 */
	function rectHitLine(rect:egret.Rectangle, linePos1:egret.Point, linePos2:egret.Point):boolean;
	/**
	 * 测试「点」是否在「多边形」中
	 * @param  {egret.Point}        p        待测试点
	 * @param  {Array<egret.Point>} vertices 多边形各个顶点的数组
	 * @return {boolean}
	 */
	function pointHitPolygon(p:egret.Point, vertices:Array<egret.Point>):boolean;
	/**
	 * 测试「点」是否在「多边形」中
	 * @param  {Array<egret.Point>} vertices 多边形各个顶点的数组
	 * @param  {egret.Point}        p        待测试点
	 * @return {boolean}
	 */
	function polygonHitPoint(vertices:Array<egret.Point>, p:egret.Point):boolean;
	/**
	 * 测试「圆」与「多边形」是否相交
	 * @param  {egret.Point}        circlePos 圆心
	 * @param  {number}             radius    半径
	 * @param  {Array<egret.Point>} vertices  多边形各个顶点的数组
	 * @return {boolean} 
	 */
	function circleHitPolygon(circlePos:egret.Point, radius:number, vertices:Array<egret.Point>):boolean;
	/**
	 * 测试「圆」与「多边形」是否相交
	 * @param  {Array<egret.Point>} vertices  多边形各个顶点的数组
	 * @param  {egret.Point}        circlePos 圆心
	 * @param  {number}             radius    半径
	 * @return {boolean} 
	 */
	function polygonHitCircle(vertices:Array<egret.Point>, circlePos:egret.Point, radius:number):boolean;
	/**
	 * 测试「矩形」与「多边形」是否相交
	 * @param  {egret.Rectangle}    rect     矩形
	 * @param  {Array<egret.Point>} vertices 多边形各个顶点的数组
	 * @return {boolean}
	 */
	function rectHitPolygon(rect:egret.Rectangle, vertices:Array<egret.Point>):boolean;
	/**
	 * 测试「矩形」与「多边形」是否相交
	 * @param  {Array<egret.Point>} vertices 多边形各个顶点的数组
	 * @param  {egret.Rectangle}    rect     矩形
	 * @return {boolean}
	 */
	function polygonHitRect(vertices:Array<egret.Point>, rect:egret.Rectangle):boolean;
	/**
	 * 测试「线」与「多边形」是否相交
	 * @param  {egret.Point}        linePos1 线起始点
	 * @param  {egret.Point}        linePos2 线结束点
	 * @param  {Array<egret.Point>} vertices 多边形各个顶点的数组
	 * @return {boolean}
	 */
	function lineHitPolygon(linePos1:egret.Point, linePos2:egret.Point, vertices:Array<egret.Point>):boolean;
	/**
	 * 测试「线」与「多边形」是否相交
	 * @param  {Array<egret.Point>} vertices 多边形各个顶点的数组
	 * @param  {egret.Point}        linePos1 线起始点
	 * @param  {egret.Point}        linePos2 线结束点
	 * @return {boolean}
	 */
	function polygonHitLine(vertices:Array<egret.Point>, linePos1:egret.Point, linePos2:egret.Point):boolean;
	/**
	 * 测试两「多边形」是否相交
	 * @param  {Array<egret.Point>} vertices1 多边形1各个顶点的数组
	 * @param  {Array<egret.Point>} vertices2 多边形2各个顶点的数组
	 * @return {boolean} 
	 */
	function polygonHitPolygon(vertices1:Array<egret.Point>, vertices2:Array<egret.Point>):boolean;
	/**
	 * 测试「点」是否在「三角形」中
	 * @param  {egret.Point}        p        待测试点
	 * @param  {Array<egret.Point>} vertices 三角形各个顶点的数组
	 * @return {boolean}
	 */
	function pointHitTriangle(p:egret.Point, vertices:Array<egret.Point>):boolean;
	/**
	 * 测试「点」是否在「三角形」中
	 * @param  {Array<egret.Point>} vertices 三角形各个顶点的数组
	 * @param  {egret.Point}        p        待测试点
	 * @return {boolean}
	 */
	function triangleHitPoint(vertices:Array<egret.Point>, p:egret.Point):boolean;
}