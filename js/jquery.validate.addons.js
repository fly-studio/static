(function($){
//$.validator.autoCreateRanges = true;
$.getAnsiLength = function(b, ansi) {
	if (typeof b != 'string' || !ansi) {
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
	return this.optional(element) || (new RegExp('^(((\\+86|086|17951)[\\-\\s])?1(3[0-9]|5[0-9]|7[01678]|8[0-9]|4[57])[\\-\\s]?[0-9]{4}[\\-\\s]?[0-9]{4}|(^0\\d{2}-?\\d{8}$)|(^0\\d{3}-?\\d{7}$)|(^\\(0\\d{2}\\)-?\\d{8}$)|(^\\(0\\d{3}\\)-?\\d{7}$))$','ig')).test(value);
});
$.validator.addMethod('idcard',function(value, element, params) {
	return this.optional(element) || (new RegExp('^(^[1-9]\\d{7}((0\\d)|(1[0-2]))(([0|1|2]\\d)|3[0-1])\\d{3}$)|(^[1-9]\\d{5}[1-9]\\d{3}((0\\d)|(1[0-2]))(([0|1|2]\\d)|3[0-1])((\\d{4})|\\d{3}[x])$)$','ig')).test(value);
});
$.validator.addMethod('notzero',function(value, element, params) {
	return this.optional(element) || Math.abs(parseFloat(value) - 0) > 0.00001;
});
$.validator.addMethod('regex', function(value, element, params) {
	var pattern = params;
	pattern = pattern.replace(/(\\x\{([a-f0-9]{0,4})\})/gi,'\\u$2'); /*replace php's regexp to javascript*/
	var regexp = new RegExp(/^([\/#]?)(.+?)([\/#]([igmu]+?))?$/ig).exec(pattern/*.replace('\\','\\\\')*/);/* read patten from a regexp*/
	pattern = regexp[2];
	var attributes = regexp[4];
	if (typeof regexp[3] == 'undefined') {
		pattern = '^'+regexp[2]+'$';
		attributes = 'g';
	}
	var re = new RegExp(pattern, attributes.replace('u',''));
	return this.optional(element) || re.test(value);
});
$.validator.addMethod('ansi',function(value, element, params){
	return true;
});
$.extend(jQuery.validator.messages, {
	required: "必填字段",
	remote: "已经存在，换一个试试？",
	regex: "类型不正确",
	email: "请输入正确格式的电子邮件",
	url: "请输入合法的网址",
	date: "请输入合法的日期",
	dateISO: "请输入合法的日期 (ISO).",
	number: "请输入合法的数字",
	digits: "只能输入整数",
	timestamp: "请输入合法的日期(或时间)",
	idcard: "身份证类型不匹配",
	notzero: "不能为0，或必须有值。",
	phone: "电话类型不匹配", 
	timetick: "请输入合法的时间", 
	creditcard: "请输入合法的信用卡号",
	equalTo: "请再次输入相同的值", 
	accept: "请输入合法后缀名的字符串",
	maxlength: jQuery.validator.format("字符串长度最大为{0}个字"),
	minlength: jQuery.validator.format("字符串长度最少为{0}个字"),
	rangelength: jQuery.validator.format("请输入一个长度介于{0}和{1}之间的字符串"),
	range: jQuery.validator.format("请输入一个介于{0}和{1}之间的数字"),
	max: jQuery.validator.format("数值最大为{0}"),
	min: jQuery.validator.format("数值最小为{0}")
});

//$.validator.setDefaults({ ignore: '' });
$.fn.extend({validate_addons: function(validate, callback){
	for(var n in validate.rules)
		if (validate.rules[n].ansi) $('[name="'+ n +'"]', this).data({ansi: validate.rules[n].ansi});
	this.validate({'ignore': [], 'rules': validate.rules, 'messages': validate.messages, 'submitHandler': function(form, event){
		if (callback && $.isFunction(callback) && !callback.call(this, form, event))
			return false;
		form.submit();
	}, 'success': 'valid'});
	return this;
}
});

})(jQuery);