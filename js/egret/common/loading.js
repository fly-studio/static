var LoadingUI = (function (_super) {
	__extends(LoadingUI, _super);
	function LoadingUI() {
		_super.call(this);

		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
	}
	var d = __define,c=LoadingUI,p=c.prototype;

	p.onAddToStage = function (e) {
		this.textField = new egret.TextField();
		this.addChild(this.textField);
		this.textField.y = (this.stage.stageHeight - 100) / 2;
		this.textField.width = this.stage.stageWidth;
		this.textField.height = 100;
		this.textField.textAlign = "center";
	};

	p.setProgress = function (current, total) {
		var percent = total > 0 ? current / total * 100 : 0;
		if (percent > 100) percent = 100;
		this.textField.text = "Loading..." + parseInt(percent) + '%';
	};

	p.loadConfig = function(resourceFiles, onComplete, thisObject) {
		var _onComplete = function(event){
			RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, _onComplete, this);
			if (onComplete) onComplete.call(thisObject ? thisObject : this, event);
		};
		RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, _onComplete, this); 
		RES.addEventListener(RES.ResourceEvent.CONFIG_LOAD_ERROR, this.onConfigLoadErr, this);
		
		for(var i = 0; i < resourceFiles.length;i++)
			RES.loadConfig(resourceFiles[i], resourceFiles[i].replace(/\\/g, '/').replace(/\/[^\/]*\/?$/, '') + '/');
	};

	p.onConfigLoadErr = function(event) {
		
	};

	p.loadGroup = function(name, onComplete, thisObject) {
		var _onComplete = function(event) {
			if (event.groupName == name) {
				RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, _onComplete, this);
				RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
				RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
				RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
				if (onComplete) onComplete.call(thisObject ? thisObject : this, event, name);
			}
		}
		RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, _onComplete, this);
		RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
		RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
		RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);

		RES.loadGroup(name);
	};

	p.onItemLoadError = function(event) {
		console.warn("Url:" + event.resItem.url + " has failed to load");
	};

	p.onResourceLoadError = function(event) {
		//TODO
		console.warn("Group:" + event.groupName + " has failed to load");
		//忽略加载失败的项目
		//Ignore the loading failed projects
		RES.ResourceEvent.dispatchResourceEvent(event.target, RES.ResourceEvent.GROUP_COMPLETE, event.groupName)
	};

	p.onResourceProgress = function(event) {
		this.setProgress(event.itemsLoaded, event.itemsTotal);
	};
	return LoadingUI;
}(egret.Sprite));
egret.registerClass(LoadingUI, 'LoadingUI');
