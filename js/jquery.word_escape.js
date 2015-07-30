(function($){
$.fn.extend({word_escape : function(value, tagName) {
	return this.each(function(){
		if (!(value instanceof Array)) value = value.toString();
		if (typeof tagName == 'undefined') tagName = 'span';
		var $this = $(this);
		var $word = $(tagName+':not(.escape)',$this);
		var escape_effect = function($obj, up_or_down) {
			var offset = $obj.offset(); 
			$obj.css({position:'absolute',left:offset.left,top:offset.top}).addClass('escape').animate({top:(up_or_down ? '-' : '+') + '='+$obj.height()/*,left:'-='+$obj.width()*/,'opacity':0},function(){
				$(this).remove();
			});
		}
		for(var i = 0; i < value.length; ++i)
		{
			if (i >= $word.length)
				$('<'+tagName+'>' + value[i] + '</'+tagName+'>').appendTo($this);
			else {
				var $origin = $word.eq(i);var html = $origin.html();
				if (html == value[i])
					continue;
				escape_effect($origin, html < value[i]);
				$('<'+tagName+'>' + value[i] + '</'+tagName+'>').insertBefore($origin);
			}
		}
		for (i = i; i < $word.length; ++i){
			var $origin = $word.eq(i);
			escape_effect($origin, true);
		}
	});
}
});
})(jQuery);