interface AjaxSettings {
	url?: string;
	method?: string;
	data?: any;
	success? (data: any, headers: any, XHR: egret.HttpRequest): any;
	error? (error: string): any;
	progress? (loaded:number, total:number): any;
}

declare module url {
	function http_build_query(formdata: any, numericPrefix: string, argSeparator: string): string;
	function urlencode(str: string): string;
	function urldecode(str: string): string;

	function query(options: AjaxSettings, thisObj?: any): egret.HttpRequest;
	function query(url:string, options: AjaxSettings, thisObj?: any): egret.HttpRequest;

	function upload(options: AjaxSettings, thisObj?: any): egret.HttpRequest;
	function upload(url:string, options: AjaxSettings, thisObj?: any): egret.HttpRequest;
	
	function get(url: string, data?: any, onSuccess?: Function, thisObj?:any): egret.HttpRequest;
	function post(url: string, data?: any, onSuccess?: Function, thisObj?:any): egret.HttpRequest;
}