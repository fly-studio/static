var LoadingUI = (function (_super) {
	__extends(LoadingUI, _super);
	function LoadingUI() {
		_super.call(this);
		
		this.onConfigCompleteCallback = null;
		this.onGroupCompleteCallback = null;
		this.groupName = null;
		
		this.createView();
	}
	var d = __define,c=LoadingUI,p=c.prototype;
	p.createView = function () {
		this.textField = new egret.TextField();
		this.addChild(this.textField);
		this.textField.y = 300;
		this.textField.width = 480;
		this.textField.height = 100;
		this.textField.textAlign = "center";
	};

	p.setProgress = function (current, total) {
		this.textField.text = "Loading..." + current + "/" + total;
	};

	p.loadConfig = function(resourceFiles, onComplete) {
		RES.addEventListener( RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this ); 
		RES.addEventListener( RES.ResourceEvent.CONFIG_LOAD_ERROR, this.onConfigLoadErr, this );
		this.onConfigCompleteCallback = onComplete;
		for(var i = 0; i < resourceFiles.length;i++)
			RES.loadConfig(resourceFiles[i], resourceFiles[i].replace(/\\/g, '/').replace(/\/[^\/]*\/?$/, '') + '/');
	};

	p.onConfigComplete = function(event) {
		RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
		if (this.onConfigCompleteCallback) this.onConfigCompleteCallback.call(this, [event]);
	};

	p.onConfigLoadErr = function(event) {
		
	};

	p.loadGroup = function(name, onComplete) {
		RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
		RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
		RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
		RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
		this.groupName = name;
		this.onGroupCompleteCallback = onComplete;
		RES.loadGroup(name);
	};

	p.onResourceLoadComplete = function(event) {
		if (event.groupName == this.groupName) {
			RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
			RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
			RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
			RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
			if (this.onGroupCompleteCallback) this.onGroupCompleteCallback.call(this, [event, this.groupName]);

		}
	};

	p.onItemLoadError = function(event) {
		console.warn("Url:" + event.resItem.url + " has failed to load");
	};

	p.onResourceLoadError = function(event) {
		//TODO
		console.warn("Group:" + event.groupName + " has failed to load");
		//忽略加载失败的项目
		//Ignore the loading failed projects
		this.onResourceLoadComplete(event);
	};

	p.onResourceProgress = function(event) {
		if (event.groupName == this.groupName)
			this.setProgress(event.itemsLoaded, event.itemsTotal);
	};
	return LoadingUI;
}(egret.Sprite));
egret.registerClass(LoadingUI, 'LoadingUI');