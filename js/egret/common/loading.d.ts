declare class LoadingUI extends egret.Sprite {
	textField:egret.TextField;
	onAddToStage(event:egret.Event):void;
	setProgress(current:number, total:number):void;
	onConfigLoadErr(event:RES.ResourceEvent):void;
	onItemLoadError(event:RES.ResourceEvent):void;
	onResourceLoadError(event:RES.ResourceEvent):void;
	onResourceProgress(event:RES.ResourceEvent):void;
	loadConfig(resourceFiles:Array<string>, onComplete?:Function, thisObject?:any): void;
	loadGroup(name:string, onComplete?:Function, thisObject?:any): void;

}
