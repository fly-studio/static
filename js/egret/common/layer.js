var layer;
(function(layer){
	var method = {};

	method.bitmapByName = function(name) {
		var result = new egret.Bitmap();
		var texture = RES.getRes(name);
		result.texture = texture;
		return result;
	};

	method.autoTips = function(json, thisObj){
		var btns = [];
		thisObj = thisObj ? thisObj : this;
		if (json.url == false) 
			btns = [{text: '\u8fd4\u56de', onClick: function(sprite){
				if (sprite.parent) sprite.parent.removeChild(sprite);
			}}];
		else if (json.url !== true)
			btns = [{text: '(\u8df3\u8f6c\u94fe\u63a5)', onClick: function(sprite){
				location.href = json.url;
			}}];
		return method.tips.call(thisObj, {
			title: json.message.title,
			content: json.message.content,
			buttons: btns,
			timeout: json.url === true ? 1500 : 0
		});
	};

	method.alert = function(msg, callback, thisObj) {
		thisObj = thisObj ? thisObj : this;
		return method.tips.call(thisObj, {
			title: '\u63d0\u793a',
			content: msg,
			buttons: [
				{text: 'OK', onClick: function(e, sprite){
					if (sprite.parent) sprite.parent.removeChild(sprite);
					if (callback) callback.call(thisObj);
				}}
			],
			timeout: 0
		});
	};

	method.confirm = function(msg, confirm_callback, cancel_callback, thisObj) {
		thisObj = thisObj ? thisObj : this;
		return method.tips.call(thisObj, {
			title: '\u63d0\u793a',
			content: msg,
			buttons: [
				{text: '\u53d6\u6d88', onClick: function(e, sprite){
					if (sprite.parent) sprite.parent.removeChild(sprite);
					if (cancel_callback) cancel_callback.call(thisObj);
				}},
				{text: '\u786e\u5b9a', onClick: function(e, sprite){
					if (sprite.parent) sprite.parent.removeChild(sprite);
					if (confirm_callback) confirm_callback.call(thisObj);
				}}
			],
			timeout: 0
		});
	};

	method.tips = function(options, thisObj) {
		thisObj = thisObj ? thisObj : this;
		var _options = {
			textColor: options.color || 0x0,
			fontFamily: options.fontFamily || 'Microsoft Yahei',
			backgoundColor: options.color || 0xffffff,
			title: options.title || '',
			content: options.content || '',
			timeout: !options.buttons && typeof options.timeout == 'undefined' ? 1500 : 0,
			buttons: options.buttons || [],
			width: options.width || thisObj.stage.stageWidth * 0.75,
			height: options.height || thisObj.stage.stageHeight * 0.3
		};
		
		if (_options.width > 500) _options.width = 500;
		
		var mask = new egret.Sprite;
		mask.graphics.beginFill(0x0, 0.25);
		mask.graphics.drawRect(0, 0, thisObj.stage.stageWidth, thisObj.stage.stageHeight);
		mask.graphics.endFill();
		thisObj.stage.addChild(mask);
		
		var titleHeight = 70, buttonHeight = _options.buttons.length > 0 ? 75 : 0, contentHeight = thisObj.stage.stageHeight * .9 - titleHeight - buttonHeight;
		
		var content = new egret.TextField;content.name = 'content';
		content.textColor = _options.textColor;content.fontFamily = _options.fontFamily;
		content.size = 20;content.text = _options.content;
		content.textAlign = egret.HorizontalAlign.LEFT;
		content.verticalAlign = egret.VerticalAlign.TOP;
		content.x = 15;content.y = titleHeight;
		content.width = _options.width - 30;
		//计算content的实际高度
		if (content.height < 150) content.height = 150;
		if (content.height > contentHeight) content.height = contentHeight;
		
		contentHeight = content.height;
		_options.height = titleHeight + buttonHeight + contentHeight;
		
		var tips = new egret.Sprite;
		tips.graphics.beginFill(_options.backgoundColor, 0.95);
		tips.graphics.drawRoundRect(0, 0, _options.width, _options.height, 50);
		tips.graphics.endFill();
		tips.x = (thisObj.stage.stageWidth - _options.width) / 2;
		tips.y = (thisObj.stage.stageHeight - _options.height) / 2;
		thisObj.stage.addChild(tips);

		
		tips.addChild(content);
		
		var title = new egret.TextField;title.name = 'title';
		title.textColor = _options.textColor;title.fontFamily = _options.fontFamily;
		title.size = 35;title.text = _options.title;
		title.textAlign = egret.HorizontalAlign.CENTER;
		title.verticalAlign = egret.VerticalAlign.MIDDLE;
		title.x = 0;title.y = 0;
		title.width = tips.width; title.height = 70;
		tips.addChild(title);

		var buttons = new egret.Sprite;buttons.name = 'buttons';
		var onClick = function(e){
			e.stopPropagation();
			for(var i = 0; i < buttons.numChildren;++i)
				if (buttons.getChildAt(i).hashCode == e.currentTarget.hashCode)
					if (_options.buttons[i].onClick) _options.buttons[i].onClick.call(thisObj, e, tips);
		}
		if (_options.buttons.length > 0) {
			buttons.x = 0;buttons.y = tips.height - 75; //tips's height 75px
			buttons.width = _options.width; buttons.height = 75;
			var cell = buttons.width /  _options.buttons.length;
			//draw lines
			buttons.graphics.lineStyle(1, 0xcccccc);
			buttons.graphics.moveTo(0, 0);
			buttons.graphics.lineTo(buttons.width, 0);
			for (var i = 1; i < _options.buttons.length; i++) {
				buttons.graphics.moveTo(cell * i);
				buttons.graphics.lineTo(cell * i, buttons.height);
			}
			for (var i = 0; i < _options.buttons.length; i++) {
				var btn = new egret.TextField, _b = _options.buttons[i];btn.name = 'button-' + i;
				btn.x = cell * i;btn.y = 1;btn.fontFamily = _options.fontFamily;
				btn.width = cell;btn.height = buttons.height;btn.textColor = _options.textColor;
				btn.textAlign = egret.HorizontalAlign.CENTER;
				btn.verticalAlign = egret.VerticalAlign.MIDDLE;
				btn.text = _b.text;btn.touchEnabled = true;
				btn.addEventListener(egret.TouchEvent.TOUCH_TAP, onClick, thisObj);
				buttons.addChild(btn);
			}
		}
		tips.addChild(buttons);

		
		
		tips.touchEnabled = true;
		tips.addEventListener(egret.TouchEvent.TOUCH_TAP, function(e){
		}, thisObj, true, 10);
		tips.addEventListener(egret.Event.REMOVED_FROM_STAGE, function(e){
			if (mask.parent) mask.parent.removeChild(mask);
		}, thisObj);
		
		if (_options.timeout > 0)
			setTimeout(function(){
				if (tips.parent) tips.parent.removeChild(tips);
			}, _options.timeout);
		
		return {
			setTitle : function(_title) {
				title.text = _title;
				return this;
			},
			setContent : function(_content) {
				content.text = _content;
				return this;
			},
			setButton: function(index, text, callback) {
				var btn = buttons.getChildAt(index);
				if (!btn) return;
				btn.text = text;
				if (callback) _options.buttons[index].onClick = callback;
				return this;
			},
			remove: function() {
				if (tips.parent) tips.parent.removeChild(tips);				
				return this;
			},
			hide: function() {
				mask.visible = false;
				tips.visible = false;
				return this;
			},
			show: function() {
				mask.visible = true;
				tips.visible = true;
				return this;
			}
		};
	};
	
	method.loading = function(thisObj) {
		thisObj = thisObj ? thisObj : this;
		var width = thisObj.stage.stageWidth * 0.65; //正方形
		if (width > 500) width = 500;
		
		var loading = new egret.Sprite;
		loading.graphics.beginFill(0x0, 0.8);
		loading.graphics.drawRoundRect(0, 0, width, width, 50);
		loading.graphics.endFill();
		loading.x = (thisObj.stage.stageWidth - loading.width) / 2;	
		loading.y = (thisObj.stage.stageHeight - loading.height) / 2;
		
		var circle = new egret.Sprite;

		loading.addChild(circle);
			
		var percentText = new egret.TextField;
		percentText.width = loading.width;percentText.height = 50;percentText.fontFamily = 'Microsoft Yahei';
		percentText.x = 0; percentText.y = (loading.height - 50) / 2;
		percentText.size = 40;percentText.textColor = 0xffffff;
		percentText.textAlign = egret.HorizontalAlign.CENTER;
		percentText.verticalAlign = egret.VerticalAlign.MIDDLE;
		percentText.text = '0 %';
		loading.addChild(percentText);
		
		var subText = new egret.TextField;
		subText.width = loading.width;subText.fontFamily = 'Microsoft Yahei';
		subText.size = 20;subText.textColor = 0xffffff;
		subText.x = 0; subText.y = percentText.y + percentText.height + 20;
		subText.textAlign = egret.HorizontalAlign.CENTER;
		subText.verticalAlign = egret.VerticalAlign.MIDDLE;
		subText.text = '';
		loading.addChild(subText);
		
		thisObj.stage.addChild(loading);
		loading.touchEnabled = true;
		loading.addEventListener(egret.TouchEvent.TOUCH_TAP, function(e){
		}, thisObj, true, 10);
		var drawCrile = function(percent) {
			circle.graphics.clear();
			circle.graphics.lineStyle(10, 0xffffff);
			circle.graphics.drawArc(loading.width / 2, loading.height / 2, loading.width * 0.4, -90 * Math.PI / 180, (percent * 360 - 90) * Math.PI / 180);
		}
		
		return {
			setPercent : function(percent) {
				if (percent > 1) percent /= 100;
				percentText.text = parseInt(percent * 100) + ' %';
				drawCrile(percent);
				return this;
			},
			setSubText : function(text) {
				subText.text = text;
				return this;
			},
			remove: function() {
				if (loading.parent) loading.parent.removeChild(loading);				
				return this;
			},
			hide: function() {
				loading.visible = false;
				return this;
			},
			show: function() {
				loading.visible = true;
				return this;
			}
		};
		
	};


	//export
	for(var n in method) {
		layer[n] = method[n];
		egret.registerClass(method[n], 'layer.' + n);
	}

})(layer || (layer = {}));