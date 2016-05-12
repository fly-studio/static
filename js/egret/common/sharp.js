var Sharp;
//http://www.jeffreythompson.org/collision-detection/
(function(Sharp){
	var method = {};
	//坐标2,与坐标1形成的斜率(坐标1的x轴正方向的夹角弧度（顺时针）)
	//http://keisan.casio.com/exec/system/1223508685
	method.slope = function(p1, p2) {
		return Math.atan2(p2.y - p2.y, p2.x - p1.x);
	};
	//坐标1,2 之间的距离
	//http://keisan.casio.com/exec/system/1223508685
	//
	method.distance = function(p1, p2) {
		return Math.pow(Math.pow(Math.abs(p2.x - p1.x), 2) + Math.pow(Math.abs(p2.y - p1.y), 2), 0.5);
	};
	//3D坐标系的距离
	//https://www.mathsisfun.com/algebra/distance-2-points.html
	method.distance3D = function(p1, p2) {
		return Math.pow(Math.pow(Math.abs(p2.x - p1.x), 2) + Math.pow(Math.abs(p2.y - p1.y), 2) + Math.pow(Math.abs(p2.z - p1.z), 2), 0.5);
	};
	//某点旋转之后的新坐标
	//http://keisan.casio.com/exec/system/1223522781
	method.rotatedPoint = function(p, rotation) {
		return new egret.Point(p.x * Math.cos(rotation) + p.y * Math.sin(rotation), -p.x * Math.sin(rotation) + p.y * Math.cos(rotation));
	};
	// Convert Degree to Radian 
	method.d2r = function(d) {
		return (d * Math.PI) / 180;
	};
	// Convert Radian to Degree
	method.r2d = function(r) {
		return (180 * r) / Math.PI;
	};
	//do you need manual for this function? Hah!
	method.pointHitPoint = function(p1, p2) {
		return p1.equals(p2);
	};
	//http://www.jeffreythompson.org/collision-detection/point-circle.php
	method.pointHitCircle = function(p, circlePos, radius) {
		var distX = p.x - circlePos.x;
		var distY = p.y - circlePos.y;
		var distance = Math.sqrt( (distX * distX) + (distY * distY) );

		// if the distance is less than the circle's
		// radius the point is inside!
		return distance <= radius;
	};
	//same as above
	method.circleHitPoint = function(circlePos, radius, p) {
		return method.pointHitCircle(p, circlePos, radius);
	}
	//http://www.jeffreythompson.org/collision-detection/point-rect.php
	method.pointHitRect = function(p, rect) {
		return p.x >= rect.left && // right of the left edge AND
			p.x <= rect.right &&   // left of the right edge AND
			p.y >= rect.top &&     // below the top AND
			p.y <= rect.bottom;    // above the bottom
	};
	//same as above
	method.rectHitPoint = function(rect, p) {
		return method.pointHitRect(p, rect);
	}
	//http://www.jeffreythompson.org/collision-detection/rect-rect.php
	method.rectHitRect = function(rect1, rect2) {
		return rect1.right >= rect2.left && // r1 right edge past r2 left
			rect1.left <= rect2.right &&    // r1 left edge past r2 right
			rect1.bottom >= rect2.top &&    // r1 bottom edge past r2 top
			rect1.top <= rect2.bottom;      // r1 top edge past r2 bottom
	}
	//http://www.jeffreythompson.org/collision-detection/circle-circle.php
	method.circleHitCircle = function(circlePos1, radius1, circlePos2, radius2) {
		var distX = circlePos1.x - circlePos2.x;
		var distY = circlePos1.y - circlePos2.y;
		var distance = Math.sqrt( (distX * distX) + (distY * distY) );

		// if the distance is less than the sum of the circle's
		// radii, the circles are touching!
		return distance <= radius1 + radius2;
	}
	//http://www.jeffreythompson.org/collision-detection/circle-rect.php
	method.circleHitRect = function(circlePos, radius, rect) {
		// temporary variables to set edges for testing
		var testX = circlePos.x;
		var testY = circlePos.y;

		// which edge is closest?
		if (circlePos.x < rect.left)        testX = rect.left;      // test left edge
		else if (circlePos.x > rect.right)  testX = rect.right;   // right edge
		if (circlePos.y < rect.top)         testY = rect.top;      // top edge
		else if (circlePos.y > rect.bottom) testY = rect.bottom;   // bottom edge

		// get distance from closest edges
		var distX = circlePos.x - testX;
		var distY = circlePos.y - testY;
		var distance = Math.sqrt( (distX * distX) + (distY * distY) );

		// if the distance is less than the radius, collision!
		return distance <= radius;
	};
	//same as above
	method.rectHitCircle = function(rect, circlePos, radius) {
		return method.circleHitRect(circlePos, radius, rect);
	};
	//http://www.jeffreythompson.org/collision-detection/line-point.php
	method.pointHitLine = function(p, linePos1, linePos2) {
		// get distance from the point to the two ends of the line
		var d1 = method.distance(p, linePos1);
		var d2 = method.distance(p, linePos2);

		// get the length of the line
		var lineLen = method.distance(linePos1, linePos2);

		// since floats are so minutely accurate, add
		// a little buffer zone that will give collision
		var buffer = 0.1;    // higher # = less accurate

		// if the two distances are equal to the line's 
		// length, the point is on the line!
		// note we use the buffer here to give a range, 
		// rather than one #
		return d1 + d2 >= lineLen - buffer && d1 + d2 <= lineLen + buffer;
	};
	//same as above
	method.lineHitPoint = function(linePos1, linePos2, p) {
		return method.pointHitLine(p, linePos1, linePos2);
	};
	//点与线垂直的交点
	method.pointLineClosest = function(p, linePos1, linePos2) {
		// get length of the line
		var distX = linePos1.x - linePos2.x;
		var distY = linePos1.y - linePos2.y;
		var len = Math.sqrt( (distX * distX) + (distY * distY) );
		// get dot product of the line and point
		var dot = ( ((p.x - linePos1.x) * (linePos2.x - linePos1.x)) + ((p.y - linePos1.y) * (linePos2.y - linePos1.y)) ) / Math.pow(len, 2);

		// find the closest point on the line
		var closestX = linePos1.x + (dot * (linePos2.x - linePos1.x));
		var closestY = linePos1.y + (dot * (linePos2.y - linePos1.y));

		// is this point actually on the line segment?
		// if so keep going, but if not, return false
		var onSegment = method.lineHitPoint(linePos1, linePos2, new egret.Point(closestX, closestY));

		return onSegment ? new egret.Point(closestX, closestY) : false;
	};
	//http://www.jeffreythompson.org/collision-detection/line-circle.php
	method.lineHitCircle = function(linePos1, linePos2, circlePos, radius) {
		// is either end INSIDE the circle?
		// if so, return true immediately
		var inside1 = method.pointHitCircle(linePos1, circlePos, radius);
		var inside2 = method.pointHitCircle(linePos2, circlePos, radius);
		if (inside1 || inside2) return true;

		var closest = method.pointLineClosest(circlePos, linePos1, linePos2);
		if (closest === false) return false;

		// get distance to closest point
		distX = closest.x - circlePos.x;
		distY = closest.y - circlePos.y;
		var distance = Math.sqrt( (distX * distX) + (distY * distY) );

		return distance <= radius;
	};
	//same as above
	method.circleHitLine = function(circlePos, radius, linePos1, linePos2) {
		return method.lineHitCircle(linePos1, linePos2, circlePos, radius);
	}
	//
	method.lineLineIntersect = function(line1Pos1, line1Pos2, line2Pos1, line2Pos2) {
		var p1 = line1Pos1, p2 = line1Pos2, p3 = line2Pos1, p4 = line2Pos2;
		var uA = ((p4.x - p3.x)*(p1.y - p3.y) - (p4.y - p3.y)*(p1.x - p3.x)) / ((p4.y - p3.y)*(p2.x - p1.x) - (p4.x - p3.x)*(p2.y - p1.y));
		var uB = ((p2.x - p1.x)*(p1.y - p3.y) - (p2.y - p1.y)*(p1.x - p3.x)) / ((p4.y - p3.y)*(p2.x - p1.x) - (p4.x - p3.x)*(p2.y - p1.y));

		// collision?
		if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
			var intersectionX = p1.x + (uA * (p2.x - p1.x));
			var intersectionY = p1.y + (uA * (p2.y - p1.y));
			return new egret.Point(intersectionX, intersectionY);
		} else 
			return false;
	};
	//http://www.jeffreythompson.org/collision-detection/line-line.php
	method.lineHitLine = function(line1Pos1, line1Pos2, line2Pos1, line2Pos2) {
		var r = method.lineLineIntersect(line1Pos1, line1Pos2, line2Pos1, line2Pos2);
		return r !== false;
	};
	//http://www.jeffreythompson.org/collision-detection/line-rect.php
	method.lineHitRect = function(linePos1, linePos2, rect) {
		var p1 = linePos1, p2 = linePos2;
		var left =   method.lineHitLine(p1, p2, new egret.Point(rect.left, rect.top), new egret.Point(rect.left, rect.bottom));
		var right =  method.lineHitLine(p1, p2, new egret.Point(rect.right, rect.top), new egret.Point(rect.right, rect.bottom));
		var top =    method.lineHitLine(p1, p2, new egret.Point(rect.left, rect.top), new egret.Point(rect.right , rect.top));
		var bottom = method.lineHitLine(p1, p2, new egret.Point(rect.left, rect.bottom), new egret.Point(rect.right, rect.bottom));

		// collision?
		return left || right || top || bottom;
	};
	//same as above
	method.rectHitLine = function(rect, linePos1, linePos2) {
		return method.lineHitRect(linePos1, linePos2, rect);
	};
	//http://www.jeffreythompson.org/collision-detection/poly-point.php
	method.pointHitPolygon = function(p, vertices) {
		var collision = false;

		// go through each of the vertices, plus
		// the next vertex in the list
		var next = 0;
		for (var current = 0; current < vertices.length; current++) {

			// get next vertex in list
			// if we've hit the end, wrap around to 0
			next = current + 1;
			if (next == vertices.length) next = 0;

			// get the PVectors at our current position
			// this makes our if statement a little cleaner
			var vc = vertices[current];    // c for "current"
			var vn = vertices[next];       // n for "next"

			// compare position, flip 'collision' variable
			// back and forth
			if (((vc.y > p.y && vn.y < p.y) || (vc.y < p.y && vn.y > p.y)) &&
				(p.x < (vn.x - vc.x) * (p.y-vc.y) / (vn.y - vc.y) + vc.x)) {
			 		collision = !collision;
			}
		}
		return collision;
	};
	//same as above
	method.polygonHitPoint = function(vertices, p) {
		return method.pointHitPolygon(p, vertices);
	};
	//http://www.jeffreythompson.org/collision-detection/poly-circle.php
	method.circleHitPolygon = function(circlePos, radius, vertices) {
		// go through each of the vertices, plus
		// the next vertex in the list
		var next = 0;
		for (var current = 0; current < vertices.length; current++) {

			// get next vertex in list
			// if we've hit the end, wrap around to 0
			next = current + 1;
			if (next == vertices.length) next = 0;

			// get the PVectors at our current position
			// this makes our if statement a little cleaner
			var vc = vertices[current];    // c for "current"
			var vn = vertices[next];       // n for "next"

			// check for collision between the circle and
			// a line formed between the two vertices
			var collision = method.lineHitCircle(vc, vn, circlePos, radius);
			if (collision) return true;
		}

		// the above algorithm only checks if the circle
		// is touching the edges of the polygon – in most
		// cases this is enough, but you can un-comment the
		// following code to also test if the center of the
		// circle is inside the polygon

		// boolean centerInside = polygonPoint(vertices, cx,cy);
		// if (centerInside) return true;

		// otherwise, after all that, return false
		return false;
	};
	//same as above
	method.polygonHitCircle = function(vertices, circlePos, radius) {
		return method.circleHitPolygon(circlePos, radius, vertices)
	};
	//http://www.jeffreythompson.org/collision-detection/poly-rect.php
	method.rectHitPolygon = function(rect, vertices) {
		// go through each of the vertices, plus the next
		// vertex in the list
		var next = 0;
		for (var current = 0; current < vertices.length; current++) {

			// get next vertex in list
			// if we've hit the end, wrap around to 0
			next = current + 1;
			if (next == vertices.length) next = 0;

			// get the PVectors at our current position
			// this makes our if statement a little cleaner
			var vc = vertices[current];    // c for "current"
			var vn = vertices[next];       // n for "next"

			// check against all four sides of the rectangle
			var collision = method.lineHitRect(vc, vn, rect);
			if (collision) return true;

			// optional: test if the rectangle is INSIDE the polygon
			// note that this iterates all sides of the polygon
			// again, so only use this if you need to
			var inside = method.polygonHitPoint(vertices, rect.topLeft);
			if (inside) return true;
		}
		return false;
	};
	//same as above
	method.polygonHitRect = function(vertices, rect) {
		return method.rectHitPolygon(rect, vertices)
	};
	//http://www.jeffreythompson.org/collision-detection/poly-line.php
	method.lineHitPolygon = function(linePos1, linePos2, vertices) {
		// go through each of the vertices, plus the next
		// vertex in the list
		var next = 0;
		for (var current = 0; current < vertices.length; current++) {

			// get next vertex in list
			// if we've hit the end, wrap around to 0
			next = current + 1;
			if (next == vertices.length) next = 0;

			// get the PVectors at our current position
			// this makes our if statement a little cleaner
			var vc = vertices[current];    // c for "current"
			var vn = vertices[next];       // n for "next"

			// do a Line/Line comparison
			// if true, return 'true' immediately and
			// stop testing (faster)
			var hit = method.lineHitLine(linePos1, linePos2, vc, vn);
			if (hit) return true;
		}

		// never got a hit
		return false;
	};
	//same as above
	method.polygonHitLine = function(vertices, linePos1, linePos2) {
		return method.lineHitPolygon(linePos1, linePos2, vertices);
	};
	//http://www.jeffreythompson.org/collision-detection/poly-poly.php
	method.polygonHitPolygon = function(vertices1, vertices2) {
		// go through each of the vertices, plus the next
		// vertex in the list
		var next = 0;
		for (var current = 0; current < vertices1.length; current++) {

			// get next vertex in list
			// if we've hit the end, wrap around to 0
			next = current + 1;
			if (next == vertices1.length) next = 0;

			// get the PVectors at our current position
			// this makes our if statement a little cleaner
			var vc = vertices1[current];    // c for "current"
			var vn = vertices1[next];       // n for "next"

			// now we can use these two points (a line) to compare
			// to the other polygon's vertices using polyLine()
			var collision = method.polygonHitLine(vertices2, vc, vn);
			if (collision) return true;

			// optional: check if the 2nd polygon is INSIDE the first
			collision = method.polygonHitPoint(vertices1, vertices2[0]);
			if (collision) return true;
		}

		return false;
	};
	//http://www.jeffreythompson.org/collision-detection/tri-point.php
	method.pointHitTriangle = function(p, vertices) {
		var x1 = vertices[1].x, x2 = vertices[2].x, x3 = vertices[3].x;
		var y1 = vertices[1].y, y2 = vertices[2].y, y3 = vertices[3].y;
		// get the area of the triangle
		var areaOrig = Math.abs( (x2 - x1) * (y3 - y1) - (x3 - x1) * (y2 - y1) );

		// get the area of 3 triangles made between the point
		// and the corners of the triangle
		var area1 = Math.abs( (x1 - p.x) * (y2 - p.y) - (x2 - p.x) * (y1 - p.y) );
		var area2 = Math.abs( (x2 - p.x) * (y3 - p.y) - (x3 - p.x) * (y2 - p.y) );
		var area3 = Math.abs( (x3 - p.x) * (y1 - p.y) - (x1 - p.x) * (y3 - p.y) );

		// if the sum of the three areas equals the original,
		// we're inside the triangle!
		return area1 + area2 + area3 == areaOrig;
	};
	//same as above
	method.triangleHitPoint = function(vertices, p) {
		return method.pointHitTriangle(p, vertices);
	};


	//export
	for(var n in method) {
		Sharp[n] = method[n];
		egret.registerClass(method[n], 'Sharp.' + n);
	}

})(Sharp || (Sharp = {}));