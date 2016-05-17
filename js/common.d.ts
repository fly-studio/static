///<reference path="../jquery/jquery.d.ts" />

interface JQueryStatic {
	baseuri:string;
	showtips(tips:any, redirect?:boolean, config?:any):void;
	GET(url:string, data?:any, callback?:Function, alert_it?:boolean):any;
	POST(url:string, data?:any, callback?:Function, alert_it?:boolean):any;
	PUT(url:string, data?:any, callback?:Function, alert_it?:boolean):any;
	DELETE(url:string, data?:any, callback?:Function, alert_it?:boolean):any;
	HEAD(url:string, data?:any, callback?:Function, alert_it?:boolean):any;
	PATCH(url:string, data?:any, callback?:Function, alert_it?:boolean):any;
	query(url:string, data?:any, method?:string, callback?:Function, alert_it?:boolean):any;

}