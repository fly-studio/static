interface TipStruct {
	setTitle(title: string):TipStruct;
	setContent(content: string):TipStruct;
	setButton(index:number, text: string, callback?: Function):TipStruct;
	show():TipStruct;
	hide():TipStruct;
	remove():TipStruct;
}

interface LoadingStruct {
	setPercent(percent: number):LoadingStruct;
	setSubText(text: string):LoadingStruct;
	show():LoadingStruct;
	hide():LoadingStruct;
	remove():LoadingStruct;
}

interface TipOptions {
	title: string;
	content: string;
	width?: number;
	height?: number;
	textColor?: number;
	backgoundColor?: number;
	timeout?: number;
	fontFamily?: string;
	buttons: Array<{}>;
}

declare module layer {
	function bitmapByName(name: string): egret.Bitmap;
	function autoTips(json: any, thisObj?: any): TipStruct;
	function tips(options: TipOptions, thisObj?: any): TipStruct;
	function alert(msg, callback?: Function, thisObj?: any): TipStruct;
	function confirm(msg, confirm_callback?: Function, cancel_callback?: Function, thisObj?: any): TipStruct;
	function loading(thisObj?: any): LoadingStruct;
}