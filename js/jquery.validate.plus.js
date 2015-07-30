(function($){
//$.validator.autoCreateRanges = true;
$.getAnsiLength = function(b, ansi) {
	if (!(typeof b == 'string') || !ansi) {
		return b.length;
	}
	var a = b.match(/[^\x00-\x80]/g);
	return b.length + (a ? a.length : 0);
};
$.validator.prototype.getLength = function (value, element) {
	var t = $(element);
	var isansi = t.data('isansi') ? true : false;
	switch (element.nodeName.toLowerCase()) {
		case "select":
			return $.getAnsiLength($("option:selected", element), isansi);
			break;
		case "input":
			if (this.checkable(element)) {
				return $.getAnsiLength(this.findByName(element.name).filter(":checked"), isansi);
			}
			break;
		default:
			break;
	}	
	return $.getAnsiLength(value, isansi);
};
$.validator.method_regexp = function(value,element,params) {
	if (value.length > 0) {
		var pattern = $(element).data('pattern');
		pattern = pattern.replace(/(\\x\{([a-f0-9]{0,4})\})/gi,'\\u$2'); /*replace php's regexp to javascript*/
		var regexp = new RegExp(/^\/?(.+?)(\/([igm]+?))?$/ig).exec(pattern/*.replace('\\','\\\\')*/);
		var pattern = regexp[1], attributes = regexp[3];
		if (typeof regexp[2] == 'undefined') {pattern = '^'+regexp[1]+'$'; attributes = 'ig';}
		var re = new RegExp(pattern, attributes);
		return  re.test(value);
	}
	return true;
}
$.validator.addMethod('timestamp',function(value,element,params){
	return this.optional(element) || (new RegExp('^(1[1-9]\\d{2}|20\\d{2}|2100)-([0-1]?[1-9]|1[0-2])-([0-2]?[1-9]|3[0-1]|[1-2]0)(\\s([0-1]?\\d|2[0-3]):([0-5]?\\d)(:([0-5]?\\d))?)?$','ig')).test(value);
});
$.validator.addMethod('timetick',function(value,element,params){
	return this.optional(element) || (new RegExp('^([0-1]?\\d|2[0-3]):([0-5]?\\d)(:([0-5]?\\d))?$','ig')).test(value);
});
$.extend(jQuery.validator.messages, {required: "\u5fc5\u586b\u5b57\u6bb5",	remote: "\u5df2\u7ecf\u5b58\u5728\uff0c\u6362\u4e00\u4e2a\u8bd5\u8bd5\uff1f",	email: "\u8bf7\u8f93\u5165\u6b63\u786e\u683c\u5f0f\u7684\u7535\u5b50\u90ae\u4ef6",	url: "\u8bf7\u8f93\u5165\u5408\u6cd5\u7684\u7f51\u5740",	date: "\u8bf7\u8f93\u5165\u5408\u6cd5\u7684\u65e5\u671f",	dateISO: "\u8bf7\u8f93\u5165\u5408\u6cd5\u7684\u65e5\u671f (ISO).",	number: "\u8bf7\u8f93\u5165\u5408\u6cd5\u7684\u6570\u5b57",	digits: "\u53ea\u80fd\u8f93\u5165\u6574\u6570", timestamp : "\u8bf7\u8f93\u5165\u5408\u6cd5\u7684\u65e5\u671f(\u6216\u65f6\u95f4)",timetick : "\u8bf7\u8f93\u5165\u5408\u6cd5\u7684\u65f6\u95f4",	creditcard: "\u8bf7\u8f93\u5165\u5408\u6cd5\u7684\u4fe1\u7528\u5361\u53f7",	equalTo: "\u8bf7\u518d\u6b21\u8f93\u5165\u76f8\u540c\u7684\u503c",	accept: "\u8bf7\u8f93\u5165\u5408\u6cd5\u540e\u7f00\u540d\u7684\u5b57\u7b26\u4e32",	maxlength: jQuery.validator.format("\u5b57\u7b26\u4e32\u957f\u5ea6\u6700\u5927\u4e3a{0}\u4e2a\u5b57"),	minlength: jQuery.validator.format("\u5b57\u7b26\u4e32\u957f\u5ea6\u6700\u5c11\u4e3a{0}\u4e2a\u5b57"),	rangelength: jQuery.validator.format("\u8bf7\u8f93\u5165\u4e00\u4e2a\u957f\u5ea6\u4ecb\u4e8e{0}\u548c{1}\u4e4b\u95f4\u7684\u5b57\u7b26\u4e32"),	range: jQuery.validator.format("\u8bf7\u8f93\u5165\u4e00\u4e2a\u4ecb\u4e8e{0}\u548c{1}\u4e4b\u95f4\u7684\u6570\u5b57"),	max: jQuery.validator.format("\u6570\u503c\u6700\u5927\u4e3a{0}"),	min: jQuery.validator.format("\u6570\u503c\u6700\u5c0f\u4e3a{0}")});
$.fn.extend({submit_validate:function(validate,callback){
	if (typeof validate == 'undefined') {
		try {
			validate = ({"rules":{"name":{"required":true,"minlength":2,"maxlength":50}},"messages":{},"methods":{"url":"url","number":"float","digits":"int","email":"email"},"names":{"name":"\u59d3\u540d"},"ansi":{}});
		} catch (e) {}	
	}
	var rules = !(validate.rules instanceof Array) && typeof validate.rules != 'undefined' ? validate.rules : new Object();
	var messages = !(validate.messages instanceof Array) && typeof validate.messages != 'undefined' ? validate.messages : new Object();
	var ansi = !(validate.ansi instanceof Array) && typeof validate.ansi != 'undefined' ? validate.ansi : new Object();/*must be object*/
	var methods = !(validate.methods instanceof Array) && typeof validate.methods != 'undefined' ? validate.methods : new Object();
	for(var i in ansi) $('[name='+i+']',this).data('isansi',true);
	for(var i in rules) {
		inner_for:{
		for(n in rules[i]) {
			if (n.indexOf('method_') === 0) {
				$('[name='+i+']',this).data('pattern',methods[n]);
				break inner_for;
			}
		}
		}
	}
	for(var key in methods) {
		if (['url','email','number','digits','timestamp','timetick'].indexOf(key) < 0) {
			$.validator.addMethod.call(this, key, $.validator.method_regexp);
		}
	}
	this.validate({'rules':rules,'messages':messages,'submitHandler':function(form, event){
		if (callback && $.isFunction(callback) && !callback.call(this, form, event))
			return false;
		form.submit();
	},success:'valid'});
	return this;
}
});

})(jQuery);