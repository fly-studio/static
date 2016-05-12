var Bitmap;
(function(Bitmap){
	var method = {};
	method.createByName = function(name) {
		var result = new egret.Bitmap();
		var texture = RES.getRes(name);
		result.texture = texture;
		return result;
	}
	
	//export
	for(var n in method) {
		Bitmap[n] = method[n];
		egret.registerClass(method[n], 'Bitmap.' + n);
	}

})(Bitmap || (Bitmap = {}));