interface AjaxSettings {
	url?: string;
	method?: string;
	data?: any;
	success? (data: any, headers: any, XHR: egret.HttpRequest): any;
	error? (error: string): any;
	progress? (loaded:number, total:number): any;
}

interface AjaxStruct {
	(options: AjaxSettings, thisObj?: any): egret.HttpRequest;
	(url:string, options: AjaxSettings, thisObj?: any): egret.HttpRequest;
	get(url: string, data?: any, onSuccess?: Function, thisObj?:any): egret.HttpRequest;
	post(url: string, data?: any, onSuccess?: Function, thisObj?:any): egret.HttpRequest;
}

declare var ajax : AjaxStruct;
