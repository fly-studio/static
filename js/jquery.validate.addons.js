(function($){
//$.validator.autoCreateRanges = true;
$.getAnsiLength = function(b, ansi) {
	if (!(typeof b == 'string') || !ansi) {
		return b.length;
	}
	var a = b.match(/[^\x00-\x80]/g);
	return b.length + (a ? a.length * (parseInt(ansi) - 1) : 0);
};
$.validator.prototype.getLength = function (value, element) {
	var t = $(element);
	var ansi = t.data('ansi');
	switch (element.nodeName.toLowerCase()) {
		case "select":
			return $.getAnsiLength($("option:selected", element), ansi);
			break;
		case "input":
			if (this.checkable(element)) {
				return $.getAnsiLength(this.findByName(element.name).filter(":checked"), ansi);
			}
			break;
		default:
			break;
	}	
	return $.getAnsiLength(value, ansi);
};
$.validator.methods.equalTo = function( value, element, param ) {
	var target = $( param, element.closest('form') );
	if ( this.settings.onfocusout ) {
		target.off( ".validate-equalTo" ).on( "blur.validate-equalTo", function() {
			$( element ).valid();
		});
	}
	return value === target.val();
};
$.validator.addMethod('timestamp',function(value, element, params) {
	return this.optional(element) || (new RegExp('^(1[1-9]\\d{2}|20\\d{2}|2100)-([0-1]?[1-9]|1[0-2])-([0-2]?[1-9]|3[0-1]|[1-2]0)(\\s([0-1]?\\d|2[0-3]):([0-5]?\\d)(:([0-5]?\\d))?)?$','ig')).test(value);
});
$.validator.addMethod('timetick',function(value, element, params) {
	return this.optional(element) || (new RegExp('^([0-1]?\\d|2[0-3]):([0-5]?\\d)(:([0-5]?\\d))?$','ig')).test(value);
});
$.validator.addMethod('phone',function(value, element, params) {
	return this.optional(element) || (new RegExp('^(((\\+86|086|17951)[\\-\\s])?1(3[0-9]|5[0-9]|7[678]|8[0-9]|4[57])[\\-\\s]?[0-9]{4}[\\-\\s]?[0-9]{4}|(^0\\d{2}-?\\d{8}$)|(^0\\d{3}-?\\d{7}$)|(^\\(0\\d{2}\\)-?\\d{8}$)|(^\\(0\\d{3}\\)-?\\d{7}$))$','ig')).test(value);
});
$.validator.addMethod('idcard',function(value, element, params) {
	return this.optional(element) || (new RegExp('^(^[1-9]\\d{7}((0\\d)|(1[0-2]))(([0|1|2]\\d)|3[0-1])\\d{3}$)|(^[1-9]\\d{5}[1-9]\\d{3}((0\\d)|(1[0-2]))(([0|1|2]\\d)|3[0-1])((\\d{4})|\\d{3}[x])$)$','ig')).test(value);
});
$.validator.addMethod('notzero',function(value, element, params) {
	return this.optional(element) || parseFloat(value) != 0;
});
$.validator.addMethod('regex', function(value, element, params) {
	var pattern = params;
	pattern = pattern.replace(/(\\x\{([a-f0-9]{0,4})\})/gi,'\\u$2'); /*replace php's regexp to javascript*/
	var regexp = new RegExp(/^([\/#]?)(.+?)([\/#]([igmu]+?))?$/ig).exec(pattern/*.replace('\\','\\\\')*/);/* read patten from a regexp*/
	var pattern = regexp[2], attributes = regexp[4];
	if (typeof regexp[3] == 'undefined') {pattern = '^'+regexp[2]+'$'; attributes = 'g';}
	var re = new RegExp(pattern, attributes.replace('u',''));
	return this.optional(element) || re.test(value);
});
$.validator.addMethod('ansi',function(value, element, params){
	return true;
});
$.extend(jQuery.validator.messages, {
	required: "\u5fc5\u586b\u5b57\u6bb5",
	remote: "\u5df2\u7ecf\u5b58\u5728\uff0c\u6362\u4e00\u4e2a\u8bd5\u8bd5\uff1f",
	regex: "\u7c7b\u578b\u4e0d\u6b63\u786e",
	email: "\u8bf7\u8f93\u5165\u6b63\u786e\u683c\u5f0f\u7684\u7535\u5b50\u90ae\u4ef6",
	url: "\u8bf7\u8f93\u5165\u5408\u6cd5\u7684\u7f51\u5740",
	date: "\u8bf7\u8f93\u5165\u5408\u6cd5\u7684\u65e5\u671f",
	dateISO: "\u8bf7\u8f93\u5165\u5408\u6cd5\u7684\u65e5\u671f (ISO).",
	number: "\u8bf7\u8f93\u5165\u5408\u6cd5\u7684\u6570\u5b57",
	digits: "\u53ea\u80fd\u8f93\u5165\u6574\u6570",
	timestamp: "\u8bf7\u8f93\u5165\u5408\u6cd5\u7684\u65e5\u671f(\u6216\u65f6\u95f4)",
	idcard: "\u8eab\u4efd\u8bc1\u7c7b\u578b\u4e0d\u5339\u914d",
	notzero: "\u4e0d\u80fd\u4e3a0",
	phone: "\u7535\u8bdd\u7c7b\u578b\u4e0d\u5339\u914d", 
	timetick: "\u8bf7\u8f93\u5165\u5408\u6cd5\u7684\u65f6\u95f4", 
	creditcard: "\u8bf7\u8f93\u5165\u5408\u6cd5\u7684\u4fe1\u7528\u5361\u53f7",
	equalTo: "\u8bf7\u518d\u6b21\u8f93\u5165\u76f8\u540c\u7684\u503c", 
	accept: "\u8bf7\u8f93\u5165\u5408\u6cd5\u540e\u7f00\u540d\u7684\u5b57\u7b26\u4e32",
	maxlength: jQuery.validator.format("\u5b57\u7b26\u4e32\u957f\u5ea6\u6700\u5927\u4e3a{0}\u4e2a\u5b57"),
	minlength: jQuery.validator.format("\u5b57\u7b26\u4e32\u957f\u5ea6\u6700\u5c11\u4e3a{0}\u4e2a\u5b57"),
	rangelength: jQuery.validator.format("\u8bf7\u8f93\u5165\u4e00\u4e2a\u957f\u5ea6\u4ecb\u4e8e{0}\u548c{1}\u4e4b\u95f4\u7684\u5b57\u7b26\u4e32"),
	range: jQuery.validator.format("\u8bf7\u8f93\u5165\u4e00\u4e2a\u4ecb\u4e8e{0}\u548c{1}\u4e4b\u95f4\u7684\u6570\u5b57"),
	max: jQuery.validator.format("\u6570\u503c\u6700\u5927\u4e3a{0}"),
	min: jQuery.validator.format("\u6570\u503c\u6700\u5c0f\u4e3a{0}")});
$.fn.extend({validate_addons: function(validate, callback){
	for(var n in validate.rules)
		if (validate.rules[n]['ansi']) $('[name="'+ n +'"]', this).data({ansi: validate.rules[n]['ansi']});
	this.validate({'rules': validate.rules, 'messages': validate.messages, 'submitHandler': function(form, event){
		if (callback && $.isFunction(callback) && !callback.call(this, form, event))
			return false;
		form.submit();
	}, success:'valid'});
	return this;
}
});

})(jQuery);