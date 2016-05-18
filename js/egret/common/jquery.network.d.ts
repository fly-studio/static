///<reference path="../jquery/jquery.d.ts" />
interface BBQStatic {
	querystring(str:string):any;
}
interface JQueryStatic {
	//baseuri:string;
	deparam: BBQStatic;
	GET(url:string, data?:any, success?:Function, thisObj?:any):any;
	POST(url:string, data?:any, success?:Function, thisObj?:any):any;
	PUT(url:string, data?:any, success?:Function, thisObj?:any):any;
	DELETE(url:string, data?:any, success?:Function, thisObj?:any):any;
	HEAD(url:string, data?:any, success?:Function, thisObj?:any):any;
	PATCH(url:string, data?:any, success?:Function, thisObj?:any):any;
	query(url:string, data?:any, method?:string, success?:Function, fail?:Function, thisObj?:any):any;

}