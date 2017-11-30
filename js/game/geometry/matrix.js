
/**
 * 2D矩阵
 * 1 0 0
 * 0 1 0
 * 0 0 1
 * / a c e \   / x \   / ax + cy + e \
 * | b d f | * | y | = | bx + dy + f |
 * \ 0 0 1 /   \ 1 /   \ 0  + 0  + 1 /
 * @param {Number} a scaleX
 * @param {Number} b skewY
 * @param {Number} c skewX
 * @param {Number} d scaleY
 * @param {Number} e translateX
 * @param {Number} f translateY
 */
//这个是css中matrix的参数顺序
function Matrix(a, b, c, d, e, f) {
	if (a != null)
		this.set(a, c, e, b, d, f);
	else
		this.identity();
		
}
(function (proto) {
	//这个是自左向右的顺序
	proto.set = function(a, c, e, b, d, f) {
		this.a = a;this.b = b;this.c = c;this.d = d;this.e = e;this.f = f;
		return this;
	};
	proto.identity = function()
	{
		this.set( 1, 0, 0, 0, 1, 0 );
		return this
	};
	proto.isIdentity = function() {
		return this.a === 1 && this.b === 0 && this.c === 0 && this.d === 1
				&& this.e === 0 && this.f === 0;
	};
	/*\
	 * Matrix.add
	 [ method ]
	 **
	 * Adds the given matrix to existing one
	 - a (number)
	 - b (number)
	 - c (number)
	 - d (number)
	 - e (number)
	 - f (number)
	 * or
	 - matrix (object) @Matrix
	\*/
	proto.add = function (a, b, c, d, e, f) {
		var out = [[], [], []],
			m = [[this.a, this.c, this.e], [this.b, this.d, this.f], [0, 0, 1]],
			matrix = [[a, c, e], [b, d, f], [0, 0, 1]],
			x, y, z, res;

		if (a && a instanceof Matrix) {
			matrix = [[a.a, a.c, a.e], [a.b, a.d, a.f], [0, 0, 1]];
		}

		for (x = 0; x < 3; x++) {
			for (y = 0; y < 3; y++) {
				res = 0;
				for (z = 0; z < 3; z++) {
					res += m[x][z] * matrix[z][y];
				}
				out[x][y] = res;
			}
		}
		this.a = out[0][0];
		this.b = out[1][0];
		this.c = out[0][1];
		this.d = out[1][1];
		this.e = out[0][2];
		this.f = out[1][2];
		return this;
	};
	/*\
	 * Matrix.invert
	 [ method ]
	 **
	 * Returns an inverted version of the matrix
	 = (object) @Matrix
	\*/
	proto.invert = function () {
		var me = this,
			x = me.a * me.d - me.b * me.c;
		return new Matrix(me.d / x, -me.b / x, -me.c / x, me.a / x, (me.c * me.f - me.d * me.e) / x, (me.b * me.e - me.a * me.f) / x);
	};
	/*\
	 * Matrix.clone
	 [ method ]
	 **
	 * Returns a copy of the matrix
	 = (object) @Matrix
	\*/
	proto.clone = function () {
		return new Matrix(this.a, this.b, this.c, this.d, this.e, this.f);
	};
	/*\
	 * Matrix.translate
	 [ method ]
	 **
	 * Translate the matrix
	 * matrix(1, 0, 0, 1, translateX, translateY)
	 *
	 - x (number) horizontal offset distance
	 - y (number) vertical offset distance
	\*/
	proto.translate = function (x, y) {
		return this.add(1, 0, 0, 1, x, y);
	};
	/*\
	 * Matrix.skew
	 [ method ]
	 **
	 * Skew the matrix
	 * matrix(1,tan(θy),tan(θx),1,0,0)
	 *
	 - angleX (number)  X rangle
	 - angleY (number)  Y rangle
	\*/
	proto.skew = function (angleX, angleY) {
		return this.add(1, Math.tan(angleY), Math.tan(angleX), 1, 0, 0);
	};
	/*\
	 * Matrix.scale
	 [ method ]
	 **
	 * Scales the matrix
	 * matrix(scaleX, 0, 0, scaleY, 0, 0);
	 *
	 - x (number) amount to be scaled, with `1` resulting in no change
	 - y (number) #optional amount to scale along the vertical axis. (Otherwise `x` applies to both axes.)
	 - cx (number) #optional horizontal origin point from which to scale
	 - cy (number) #optional vertical origin point from which to scale
	 * Default cx, cy is the middle point of the element.
	\*/
	proto.scale = function (x, y, cx, cy) {
		y == null && (y = x);
		(cx || cy) && this.add(1, 0, 0, 1, cx, cy);
		this.add(x, 0, 0, y, 0, 0);
		(cx || cy) && this.add(1, 0, 0, 1, -cx, -cy);
		return this;
	};
	/*\
	 * Matrix.rotate
	 [ method ]
	 **
	 * Rotates the matrix
	 * matrix(cosθ, sinθ, -sinθ, cosθ, 0, 0)
	 *
	 - a (number) angle of rotation, in degrees
	 - x (number) horizontal origin point from which to rotate
	 - y (number) vertical origin point from which to rotate
	\*/
	proto.rotate = function (a, x, y) {
		a = math.d2r(a);
		x = x || 0;
		y = y || 0;
		var cos = +math.cos(a).toFixed(9),
			sin = +math.sin(a).toFixed(9);
		this.add(cos, sin, -sin, cos, x, y);
		return this.add(1, 0, 0, 1, -x, -y);
	};
	/*\
	 * Matrix.x
	 [ method ]
	 **
	 * Returns x coordinate for given point after transformation described by the matrix. See also @Matrix.y
	 * x' = ax + cy + e
	 * 
	 - x (number)
	 - y (number)
	 = (number) x
	\*/
	proto.x = function (x, y) {
		return x * this.a + y * this.c + this.e;
	};
	/*\
	 * Matrix.y
	 [ method ]
	 **
	 * Returns y coordinate for given point after transformation described by the matrix. See also @Matrix.x
	 * y' = bx + dy + f
	 * 
	 - x (number)
	 - y (number)
	 = (number) y
	\*/
	proto.y = function (x, y) {
		return x * this.b + y * this.d + this.f;
	};
	proto.point = function(x, y)
	{
		return [this.x(x, y), this.y(x, y)];
	}
	proto.get = function (i) {
		return +this[String.fromCharCode(97 + i)].toFixed(4);
	};
	proto.toString = function () {
		return "matrix(" + [this.get(0), this.get(1), this.get(2), this.get(3), this.get(4), this.get(5)].join() + ")";
	};
	proto.offset = function () {
		return [this.e.toFixed(4), this.f.toFixed(4)];
	};

	function norm(a) {
		return a[0] * a[0] + a[1] * a[1];
	}
	function normalize(a) {
		var mag = Math.sqrt(norm(a));
		a[0] && (a[0] /= mag);
		a[1] && (a[1] /= mag);
	}
	/*\
	 * Matrix.determinant
	 [ method ]
	 **
	 * Finds determinant of the given matrix.
	 = (number) determinant
	\*/
	proto.determinant = function () {
		return this.a * this.d - this.b * this.c;
	};
	/*\
	 * Matrix.split
	 [ method ]
	 **
	 * Splits matrix into primitive transformations
	 = (object) in format:
	 o dx (number) translation by x
	 o dy (number) translation by y
	 o scalex (number) scale by x
	 o scaley (number) scale by y
	 o shear (number) shear
	 o rotate (number) rotation in deg
	 o isSimple (boolean) could it be represented via simple transformations
	\*/
	proto.split = function () {
		var out = {};
		// translation
		out.dx = this.e;
		out.dy = this.f;

		// scale and shear
		var row = [[this.a, this.c], [this.b, this.d]];
		out.scalex = math.sqrt(norm(row[0]));
		normalize(row[0]);

		out.shear = row[0][0] * row[1][0] + row[0][1] * row[1][1];
		row[1] = [row[1][0] - row[0][0] * out.shear, row[1][1] - row[0][1] * out.shear];

		out.scaley = math.sqrt(norm(row[1]));
		normalize(row[1]);
		out.shear /= out.scaley;

		if (this.determinant() < 0) {
			out.scalex = -out.scalex;
		}

		// rotation
		var sin = -row[0][1],
			cos = row[1][1];
		if (cos < 0) {
			out.rotate = math.r2d(math.acos(cos));
			if (sin < 0) {
				out.rotate = 360 - out.rotate;
			}
		} else {
			out.rotate = math.r2d(math.asin(sin));
		}

		out.isSimple = !+out.shear.toFixed(9) && (out.scalex.toFixed(9) == out.scaley.toFixed(9) || !out.rotate);
		out.isSuperSimple = !+out.shear.toFixed(9) && out.scalex.toFixed(9) == out.scaley.toFixed(9) && !out.rotate;
		out.noRotation = !+out.shear.toFixed(9) && !out.rotate;
		return out;
	};
	/*\
	 * Matrix.toTransformString
	 [ method ]
	 **
	 * Returns transform string that represents given matrix
	 = (string) transform string
	\*/
	proto.toTransformString = function (shorter) {
		var s = shorter || this.split();
		if (!+s.shear.toFixed(9)) {
			s.scalex = +s.scalex.toFixed(4);
			s.scaley = +s.scaley.toFixed(4);
			s.rotate = +s.rotate.toFixed(4);
			return  (s.dx || s.dy ? "t" + [+s.dx.toFixed(4), +s.dy.toFixed(4)] : E) + 
					(s.scalex != 1 || s.scaley != 1 ? "s" + [s.scalex, s.scaley, 0, 0] : E) +
					(s.rotate ? "r" + [+s.rotate.toFixed(4), 0, 0] : E);
		} else {
			return "m" + [this.get(0), this.get(1), this.get(2), this.get(3), this.get(4), this.get(5)];
		}
	};
})(Matrix.prototype);

/**
 * 3D矩阵
 *  1 0 0 0
 *	0 1 0 0
 *	0 0 1 0
 *	0 0 0 1
 *	a1	a2	a3	a4
 *	b1	b2	b3	b4
 *	c1	c2	c3	c4
 *	d1	d2	d3	d4
 * / n11 n12 n13 n14 \   / x \   / ax + cy + e \
 * | n21 n22 n23 n24 | * | y | = | bx + dy + f |
 * | n31 n32 n33 n34 | * | z | = | bx + dy + f |
 * \ n41 n42 n43 n44 /   \ 1 /   \ 0  + 0  + 1 /
 * @param {Number} a scaleX
 * @param {Number} b skewY
 * @param {Number} c skewX
 * @param {Number} d scaleY
 * @param {Number} e translateX
 * @param {Number} f translateY
 */
//这个是css中matrix3d的参数顺序
function Matrix3D(a1, b1, c1, d1, a2, b2, c2, d2, a3, b3, c3, d3, a4, b4, c4, d4) {
	if(a1 != null)
		this.set(a1, a2, a3, a4, b1, b2, b3, b4, c1, c2, c3, c4, d1, d2, d3, d4);
	else
		this.identity();
}

(function(proto){
	//这个是自左向右的顺序
	proto.set = function(a1, a2, a3, a4, b1, b2, b3, b4, c1, c2, c3, c4, d1, d2, d3, d4) {
		this.elements = [];
		var te = this.elements;
		te[ 0 ] = a1; te[ 4 ] = a2; te[ 8 ] = a3; te[ 12 ] = a4;
		te[ 1 ] = b1; te[ 5 ] = b2; te[ 9 ] = b3; te[ 13 ] = b4;
		te[ 2 ] = c1; te[ 6 ] = c2; te[ 10 ] = c3; te[ 14 ] = c4;
		te[ 3 ] = d1; te[ 7 ] = d2; te[ 11 ] = d3; te[ 15 ] = d4;

		return this;
	}
	proto.identity = function()
	{
		this.set (
			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1
		);
		return this
	}
	/*\
	 * Matrix3D.clone
	 [ method ]
	 **
	 * Returns a copy of the matrix3d
	 = (object) @Matrix3D
	\*/
	proto.clone = function () {
		var te = this.elements;
		return new Matrix3D(te[0], te[1], te[2], te[3], te[4], te[5], te[6], te[7], te[8], te[9], te[10], te[11], te[12], te[13], te[14], te[15]);
	};
	proto.copyPosition = function ( matrix3d ) {
		var te = this.elements;
		var me = matrix3d.elements;

		te[ 12 ] = me[ 12 ];
		te[ 13 ] = me[ 13 ];
		te[ 14 ] = me[ 14 ];
		return this;
	};
	proto.add = function(matrix3d) {
		return this.multiplyMatrices(this, matrix3d);
	}
	proto.multiplyMatrices = function(matrix3d1, matrix3d2) {
		var ae = matrix3d1.elements;
		var be = matrix3d2.elements;
		var te = this.elements;

		var a11 = ae[ 0 ], a12 = ae[ 4 ], a13 = ae[ 8 ], a14 = ae[ 12 ];
		var a21 = ae[ 1 ], a22 = ae[ 5 ], a23 = ae[ 9 ], a24 = ae[ 13 ];
		var a31 = ae[ 2 ], a32 = ae[ 6 ], a33 = ae[ 10 ], a34 = ae[ 14 ];
		var a41 = ae[ 3 ], a42 = ae[ 7 ], a43 = ae[ 11 ], a44 = ae[ 15 ];

		var b11 = be[ 0 ], b12 = be[ 4 ], b13 = be[ 8 ], b14 = be[ 12 ];
		var b21 = be[ 1 ], b22 = be[ 5 ], b23 = be[ 9 ], b24 = be[ 13 ];
		var b31 = be[ 2 ], b32 = be[ 6 ], b33 = be[ 10 ], b34 = be[ 14 ];
		var b41 = be[ 3 ], b42 = be[ 7 ], b43 = be[ 11 ], b44 = be[ 15 ];

		te[ 0 ] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
		te[ 4 ] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
		te[ 8 ] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
		te[ 12 ] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;

		te[ 1 ] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
		te[ 5 ] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
		te[ 9 ] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
		te[ 13 ] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;

		te[ 2 ] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
		te[ 6 ] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
		te[ 10 ] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
		te[ 14 ] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;

		te[ 3 ] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
		te[ 7 ] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
		te[ 11 ] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
		te[ 15 ] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;

		return this;
	};
	proto.multiplyScalar = function ( s ) {
		var te = this.elements;

		te[ 0 ] *= s; te[ 4 ] *= s; te[ 8 ] *= s; te[ 12 ] *= s;
		te[ 1 ] *= s; te[ 5 ] *= s; te[ 9 ] *= s; te[ 13 ] *= s;
		te[ 2 ] *= s; te[ 6 ] *= s; te[ 10 ] *= s; te[ 14 ] *= s;
		te[ 3 ] *= s; te[ 7 ] *= s; te[ 11 ] *= s; te[ 15 ] *= s;
		return this;
	};
	proto.determinant = function () {
		var te = this.elements;
		var n11 = te[ 0 ], n12 = te[ 4 ], n13 = te[ 8 ], n14 = te[ 12 ];
		var n21 = te[ 1 ], n22 = te[ 5 ], n23 = te[ 9 ], n24 = te[ 13 ];
		var n31 = te[ 2 ], n32 = te[ 6 ], n33 = te[ 10 ], n34 = te[ 14 ];
		var n41 = te[ 3 ], n42 = te[ 7 ], n43 = te[ 11 ], n44 = te[ 15 ];

		//TODO: make this more efficient
		//( based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm )
		return (
			n41 * (
				+ n14 * n23 * n32
				 - n13 * n24 * n32
				 - n14 * n22 * n33
				 + n12 * n24 * n33
				 + n13 * n22 * n34
				 - n12 * n23 * n34
			) +
			n42 * (
				+ n11 * n23 * n34
				 - n11 * n24 * n33
				 + n14 * n21 * n33
				 - n13 * n21 * n34
				 + n13 * n24 * n31
				 - n14 * n23 * n31
			) +
			n43 * (
				+ n11 * n24 * n32
				 - n11 * n22 * n34
				 - n14 * n21 * n32
				 + n12 * n21 * n34
				 + n14 * n22 * n31
				 - n12 * n24 * n31
			) +
			n44 * (
				- n13 * n22 * n31
				 - n11 * n23 * n32
				 + n11 * n22 * n33
				 + n13 * n21 * n32
				 - n12 * n21 * n33
				 + n12 * n23 * n31
			)

		);
	};
	proto.transpose = function () {
		var te = this.elements;
		var tmp;

		tmp = te[ 1 ]; te[ 1 ] = te[ 4 ]; te[ 4 ] = tmp;
		tmp = te[ 2 ]; te[ 2 ] = te[ 8 ]; te[ 8 ] = tmp;
		tmp = te[ 6 ]; te[ 6 ] = te[ 9 ]; te[ 9 ] = tmp;

		tmp = te[ 3 ]; te[ 3 ] = te[ 12 ]; te[ 12 ] = tmp;
		tmp = te[ 7 ]; te[ 7 ] = te[ 13 ]; te[ 13 ] = tmp;
		tmp = te[ 11 ]; te[ 11 ] = te[ 14 ]; te[ 14 ] = tmp;

		return this;

	};
	proto.getPosition = function () {
		var te = this.elements;
		return [ te[ 12 ], te[ 13 ], te[ 14 ] ];
	};
	proto.setPosition = function ( v ) {
		var te = this.elements;

		te[ 12 ] = v.x;
		te[ 13 ] = v.y;
		te[ 14 ] = v.z;
		return this;
	};
	proto.to2D = function(v3d) {
		var te = this.elements;
		var x = v3d[0];
		var y = v3d[1];
		var z = v3d[2];

		var ox = te[0] * x + te[4] * y + te[8] * z + te[12];
		var oy = te[1] * x + te[5] * y + te[9] * z + te[13];
		var ow = te[3] * x + te[7] * y + te[11] * z + te[15];

		var v2d = [];
		v2d[0] =     (ox / ow + 1) / 2;
		v2d[1] = 1 - (oy / ow + 1) / 2;

		return v2d;
	};
	proto.inverse = function ( matrix3d ) {

		// based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm
		var te = this.elements;
		var me = matrix3d.elements;

		var n11 = me[ 0 ], n12 = me[ 4 ], n13 = me[ 8 ], n14 = me[ 12 ];
		var n21 = me[ 1 ], n22 = me[ 5 ], n23 = me[ 9 ], n24 = me[ 13 ];
		var n31 = me[ 2 ], n32 = me[ 6 ], n33 = me[ 10 ], n34 = me[ 14 ];
		var n41 = me[ 3 ], n42 = me[ 7 ], n43 = me[ 11 ], n44 = me[ 15 ];

		te[ 0 ] = n23 * n34 * n42 - n24 * n33 * n42 + n24 * n32 * n43 - n22 * n34 * n43 - n23 * n32 * n44 + n22 * n33 * n44;
		te[ 4 ] = n14 * n33 * n42 - n13 * n34 * n42 - n14 * n32 * n43 + n12 * n34 * n43 + n13 * n32 * n44 - n12 * n33 * n44;
		te[ 8 ] = n13 * n24 * n42 - n14 * n23 * n42 + n14 * n22 * n43 - n12 * n24 * n43 - n13 * n22 * n44 + n12 * n23 * n44;
		te[ 12 ] = n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34;
		te[ 1 ] = n24 * n33 * n41 - n23 * n34 * n41 - n24 * n31 * n43 + n21 * n34 * n43 + n23 * n31 * n44 - n21 * n33 * n44;
		te[ 5 ] = n13 * n34 * n41 - n14 * n33 * n41 + n14 * n31 * n43 - n11 * n34 * n43 - n13 * n31 * n44 + n11 * n33 * n44;
		te[ 9 ] = n14 * n23 * n41 - n13 * n24 * n41 - n14 * n21 * n43 + n11 * n24 * n43 + n13 * n21 * n44 - n11 * n23 * n44;
		te[ 13 ] = n13 * n24 * n31 - n14 * n23 * n31 + n14 * n21 * n33 - n11 * n24 * n33 - n13 * n21 * n34 + n11 * n23 * n34;
		te[ 2 ] = n22 * n34 * n41 - n24 * n32 * n41 + n24 * n31 * n42 - n21 * n34 * n42 - n22 * n31 * n44 + n21 * n32 * n44;
		te[ 6 ] = n14 * n32 * n41 - n12 * n34 * n41 - n14 * n31 * n42 + n11 * n34 * n42 + n12 * n31 * n44 - n11 * n32 * n44;
		te[ 10 ] = n12 * n24 * n41 - n14 * n22 * n41 + n14 * n21 * n42 - n11 * n24 * n42 - n12 * n21 * n44 + n11 * n22 * n44;
		te[ 14 ] = n14 * n22 * n31 - n12 * n24 * n31 - n14 * n21 * n32 + n11 * n24 * n32 + n12 * n21 * n34 - n11 * n22 * n34;
		te[ 3 ] = n23 * n32 * n41 - n22 * n33 * n41 - n23 * n31 * n42 + n21 * n33 * n42 + n22 * n31 * n43 - n21 * n32 * n43;
		te[ 7 ] = n12 * n33 * n41 - n13 * n32 * n41 + n13 * n31 * n42 - n11 * n33 * n42 - n12 * n31 * n43 + n11 * n32 * n43;
		te[ 11 ] = n13 * n22 * n41 - n12 * n23 * n41 - n13 * n21 * n42 + n11 * n23 * n42 + n12 * n21 * n43 - n11 * n22 * n43;
		te[ 15 ] = n12 * n23 * n31 - n13 * n22 * n31 + n13 * n21 * n32 - n11 * n23 * n32 - n12 * n21 * n33 + n11 * n22 * n33;

		var det = n11 * te[ 0 ] + n21 * te[ 4 ] + n31 * te[ 8 ] + n41 * te[ 12 ];

		if ( det === 0 ) {
			console.warn( 'Matrix4.getInverse(): can\'t invert matrix, determinant is 0' );
			this.identity();
			return this;
		}
		this.multiplyScalar( 1 / det );

		return this;
	};
	proto.scale = function ( x, y, z ) {

		var te = this.elements;

		te[ 0 ] *= x; te[ 4 ] *= y; te[ 8 ] *= z;
		te[ 1 ] *= x; te[ 5 ] *= y; te[ 9 ] *= z;
		te[ 2 ] *= x; te[ 6 ] *= y; te[ 10 ] *= z;
		te[ 3 ] *= x; te[ 7 ] *= y; te[ 11 ] *= z;

		return this;
	};
	proto.getMaxScaleOnAxis = function () {
		var te = this.elements;

		var scaleXSq = te[ 0 ] * te[ 0 ] + te[ 1 ] * te[ 1 ] + te[ 2 ] * te[ 2 ];
		var scaleYSq = te[ 4 ] * te[ 4 ] + te[ 5 ] * te[ 5 ] + te[ 6 ] * te[ 6 ];
		var scaleZSq = te[ 8 ] * te[ 8 ] + te[ 9 ] * te[ 9 ] + te[ 10 ] * te[ 10 ];

		return Math.sqrt( Math.max( scaleXSq, scaleYSq, scaleZSq ) );
	};
	proto.translate = function ( x, y, z ) {
		var matrix3d = (new Matrix3D).set(
			1, 0, 0, x,
			0, 1, 0, y,
			0, 0, 1, z,
			0, 0, 0, 1
		);
		return this.add(matrix3d);
	};
	proto.rotateX = function ( theta ) {
		var c = Math.cos( theta ), s = Math.sin( theta );
		var matrix3d = (new Matrix3D).set(
			1, 0,  0, 0,
			0, c, -s, 0,
			0, s,  c, 0,
			0, 0,  0, 1
		);
		return this.add(matrix3d);
	};
	proto.rotateY = function ( theta ) {
		var c = Math.cos( theta ), s = Math.sin( theta );
		var matrix3d = (new Matrix3D).set(
			 c, 0, s, 0,
			 0, 1, 0, 0,
			-s, 0, c, 0,
			 0, 0, 0, 1
		);
		return this.add(matrix3d);
	};
	proto.rotateZ = function ( theta ) {
		var c = Math.cos( theta ), s = Math.sin( theta );
		var matrix3d = (new Matrix3D).set(
			c, -s, 0, 0,
			s,  c, 0, 0,
			0,  0, 1, 0,
			0,  0, 0, 1

		);
		return this.add(matrix3d);
	};
	proto.rotateAxis = function ( axis, angle ) {
		// Based on http://www.gamedev.net/reference/articles/article1199.asp
		var c = Math.cos( angle );
		var s = Math.sin( angle );
		var t = 1 - c;
		var x = axis[0], y = axis[1], z = axis[2];
		var tx = t * x, ty = t * y;

		var matrix3d = (new Matrix3D).set(
			tx * x + c, tx * y - s * z, tx * z + s * y, 0,
			tx * y + s * z, ty * y + c, ty * z - s * x, 0,
			tx * z - s * y, ty * z + s * x, t * z * z + c, 0,
			0, 0, 0, 1
		);
		return this.add(matrix3d);
	};

	proto.scale = function ( x, y, z ) {
		var matrix3d = (new Matrix3D).set(
			x, 0, 0, 0,
			0, y, 0, 0,
			0, 0, z, 0,
			0, 0, 0, 1
		);
		return this.add(matrix3d);
	};
	proto.setScale = function ( x, y, z ) {
		var te = this.elements;

		te[ 0 ] *= x; te[ 4 ] *= y; te[ 8 ] *= z;
		te[ 1 ] *= x; te[ 5 ] *= y; te[ 9 ] *= z;
		te[ 2 ] *= x; te[ 6 ] *= y; te[ 10 ] *= z;
		te[ 3 ] *= x; te[ 7 ] *= y; te[ 11 ] *= z;

		return this;
	};
	proto.setRotateFromQuaternion = function ( q ) {
		var te = this.elements;

		var x = q[0], y = q[1], z = q[2], w = q[3];
		var x2 = x + x, y2 = y + y, z2 = z + z;
		var xx = x * x2, xy = x * y2, xz = x * z2;
		var yy = y * y2, yz = y * z2, zz = z * z2;
		var wx = w * x2, wy = w * y2, wz = w * z2;

		te[ 0 ] = 1 - ( yy + zz );
		te[ 4 ] = xy - wz;
		te[ 8 ] = xz + wy;

		te[ 1 ] = xy + wz;
		te[ 5 ] = 1 - ( xx + zz );
		te[ 9 ] = yz - wx;

		te[ 2 ] = xz - wy;
		te[ 6 ] = yz + wx;
		te[ 10 ] = 1 - ( xx + yy );

		// last column
		te[ 3 ] = 0;
		te[ 7 ] = 0;
		te[ 11 ] = 0;

		// bottom row
		te[ 12 ] = 0;
		te[ 13 ] = 0;
		te[ 14 ] = 0;
		te[ 15 ] = 1;

		return this;
	};
	proto.setRotationFromEuler = function ( x, y, z, order ) {

		var te = this.elements;

		var a = Math.cos( x ), b = Math.sin( x );
		var c = Math.cos( y ), d = Math.sin( y );
		var e = Math.cos( z ), f = Math.sin( z );

		if ( order === 'XYZ' ) {

			var ae = a * e, af = a * f, be = b * e, bf = b * f;

			te[ 0 ] = c * e;
			te[ 4 ] = - c * f;
			te[ 8 ] = d;

			te[ 1 ] = af + be * d;
			te[ 5 ] = ae - bf * d;
			te[ 9 ] = - b * c;

			te[ 2 ] = bf - ae * d;
			te[ 6 ] = be + af * d;
			te[ 10 ] = a * c;

		} else if ( order === 'YXZ' ) {

			var ce = c * e, cf = c * f, de = d * e, df = d * f;

			te[ 0 ] = ce + df * b;
			te[ 4 ] = de * b - cf;
			te[ 8 ] = a * d;

			te[ 1 ] = a * f;
			te[ 5 ] = a * e;
			te[ 9 ] = - b;

			te[ 2 ] = cf * b - de;
			te[ 6 ] = df + ce * b;
			te[ 10 ] = a * c;

		} else if ( order === 'ZXY' ) {

			var ce = c * e, cf = c * f, de = d * e, df = d * f;

			te[ 0 ] = ce - df * b;
			te[ 4 ] = - a * f;
			te[ 8 ] = de + cf * b;

			te[ 1 ] = cf + de * b;
			te[ 5 ] = a * e;
			te[ 9 ] = df - ce * b;

			te[ 2 ] = - a * d;
			te[ 6 ] = b;
			te[ 10 ] = a * c;

		} else if ( order === 'ZYX' ) {

			var ae = a * e, af = a * f, be = b * e, bf = b * f;

			te[ 0 ] = c * e;
			te[ 4 ] = be * d - af;
			te[ 8 ] = ae * d + bf;

			te[ 1 ] = c * f;
			te[ 5 ] = bf * d + ae;
			te[ 9 ] = af * d - be;

			te[ 2 ] = - d;
			te[ 6 ] = b * c;
			te[ 10 ] = a * c;

		} else if ( order === 'YZX' ) {

			var ac = a * c, ad = a * d, bc = b * c, bd = b * d;

			te[ 0 ] = c * e;
			te[ 4 ] = bd - ac * f;
			te[ 8 ] = bc * f + ad;

			te[ 1 ] = f;
			te[ 5 ] = a * e;
			te[ 9 ] = - b * e;

			te[ 2 ] = - d * e;
			te[ 6 ] = ad * f + bc;
			te[ 10 ] = ac - bd * f;

		} else if ( order === 'XZY' ) {

			var ac = a * c, ad = a * d, bc = b * c, bd = b * d;

			te[ 0 ] = c * e;
			te[ 4 ] = - f;
			te[ 8 ] = d * e;

			te[ 1 ] = ac * f + bd;
			te[ 5 ] = a * e;
			te[ 9 ] = ad * f - bc;

			te[ 2 ] = bc * f - ad;
			te[ 6 ] = b * e;
			te[ 10 ] = bd * f + ac;

		}

		// last column
		te[ 3 ] = 0;
		te[ 7 ] = 0;
		te[ 11 ] = 0;

		// bottom row
		te[ 12 ] = 0;
		te[ 13 ] = 0;
		te[ 14 ] = 0;
		te[ 15 ] = 1;

		return this;

	};
	proto.extractBasis = function ( xAxis, yAxis, zAxis ) {

		var te = this.elements;

		xAxis = [ te[ 0 ], te[ 1 ], te[ 2 ] ];
		yAxis = [ te[ 4 ], te[ 5 ], te[ 6 ] ];
		zAxis = [ te[ 8 ], te[ 9 ], te[ 10 ] ];

		return this;

	};
	proto.makeBasis = function ( xAxis, yAxis, zAxis ) {
		this.set(
			xAxis[0], yAxis[0], zAxis[0], 0,
			xAxis[1], yAxis[1], zAxis[1], 0,
			xAxis[2], yAxis[2], zAxis[2], 0,
			0,       0,       0,       1
		);
		return this;

	};
	proto.extractRotation = function (matrix3d) {

		var te = this.elements;
		var me = matrix3d.elements;

		var scaleX = 1 / Math.sqrt( Math.pow(me[ 0 ], 2), Math.pow(me[ 1 ], 2), Math.pow(me[ 2 ], 2) );
		var scaleY = 1 / Math.sqrt( Math.pow(me[ 4 ], 2), Math.pow(me[ 5 ], 2), Math.pow(me[ 6 ], 2) );
		var scaleZ = 1 / Math.sqrt( Math.pow(me[ 8 ], 2), Math.pow(me[ 9 ], 2), Math.pow(me[ 10 ], 2) );

		te[ 0 ] = me[ 0 ] * scaleX;
		te[ 1 ] = me[ 1 ] * scaleX;
		te[ 2 ] = me[ 2 ] * scaleX;

		te[ 4 ] = me[ 4 ] * scaleY;
		te[ 5 ] = me[ 5 ] * scaleY;
		te[ 6 ] = me[ 6 ] * scaleY;

		te[ 8 ] = me[ 8 ] * scaleZ;
		te[ 9 ] = me[ 9 ] * scaleZ;
		te[ 10 ] = me[ 10 ] * scaleZ;

		return this;
	};
	proto.lookAt = function (eye, target, up) {

		var x, y, z;

		if ( x === undefined ) x = new THREE.Vector3();
		if ( y === undefined ) y = new THREE.Vector3();
		if ( z === undefined ) z = new THREE.Vector3();

		var te = this.elements;

		z.subVectors( eye, target ).normalize();

		if ( z.lengthSq() === 0 ) {

			z.z = 1;

		}

		x.crossVectors( up, z ).normalize();

		if ( x.lengthSq() === 0 ) {

			z.x += 0.0001;
			x.crossVectors( up, z ).normalize();

		}

		y.crossVectors( z, x );


		te[ 0 ] = x.x; te[ 4 ] = y.x; te[ 8 ] = z.x;
		te[ 1 ] = x.y; te[ 5 ] = y.y; te[ 9 ] = z.y;
		te[ 2 ] = x.z; te[ 6 ] = y.z; te[ 10 ] = z.z;

		return this;
	};



	proto.compose = function ( position, quaternion, scale ) {

		this.setRotateFromQuaternion( quaternion );
		this.setScale( scale );
		this.setPosition( position );

		return this;
	};
	proto.getMaxScaleOnAxis = function () {
		var te = this.elements;

		var scaleXSq = te[ 0 ] * te[ 0 ] + te[ 1 ] * te[ 1 ] + te[ 2 ] * te[ 2 ];
		var scaleYSq = te[ 4 ] * te[ 4 ] + te[ 5 ] * te[ 5 ] + te[ 6 ] * te[ 6 ];
		var scaleZSq = te[ 8 ] * te[ 8 ] + te[ 9 ] * te[ 9 ] + te[ 10 ] * te[ 10 ];

		return Math.sqrt( Math.max( scaleXSq, scaleYSq, scaleZSq ) );
	};
	proto.setFrustum = function ( left, right, bottom, top, near, far ) {

		var te = this.elements;
		var x = 2 * near / ( right - left );
		var y = 2 * near / ( top - bottom );

		var a = ( right + left ) / ( right - left );
		var b = ( top + bottom ) / ( top - bottom );
		var c = - ( far + near ) / ( far - near );
		var d = - 2 * far * near / ( far - near );

		te[ 0 ] = x;	te[ 4 ] = 0;	te[ 8 ] = a;	te[ 12 ] = 0;
		te[ 1 ] = 0;	te[ 5 ] = y;	te[ 9 ] = b;	te[ 13 ] = 0;
		te[ 2 ] = 0;	te[ 6 ] = 0;	te[ 10 ] = c;	te[ 14 ] = d;
		te[ 3 ] = 0;	te[ 7 ] = 0;	te[ 11 ] = - 1;	te[ 15 ] = 0;

		return this;

	};
	proto.setPerspective = function ( fov, aspect, near, far ) {
		var ymax = near * Math.tan( math.d2r( fov * 0.5 ) );
		var ymin = - ymax;
		var xmin = ymin * aspect;
		var xmax = ymax * aspect;

		return this.setFrustum( xmin, xmax, ymin, ymax, near, far );
	};
	proto.setOrthographic = function ( left, right, top, bottom, near, far ) {
		var te = this.elements;
		var w = right - left;
		var h = top - bottom;
		var p = far - near;

		var x = ( right + left ) / w;
		var y = ( top + bottom ) / h;
		var z = ( far + near ) / p;

		te[ 0 ] = 2 / w;	te[ 4 ] = 0;	te[ 8 ] = 0;	te[ 12 ] = - x;
		te[ 1 ] = 0;	te[ 5 ] = 2 / h;	te[ 9 ] = 0;	te[ 13 ] = - y;
		te[ 2 ] = 0;	te[ 6 ] = 0;	te[ 10 ] = - 2 / p;	te[ 14 ] = - z;
		te[ 3 ] = 0;	te[ 7 ] = 0;	te[ 11 ] = 0;	te[ 15 ] = 1;

		return this;
	};
	proto.toString = function () {
		var te = this.elements;
		return "matrix3d(" + te.join(',') + ")";
	};

})(Matrix3D.prototype);

