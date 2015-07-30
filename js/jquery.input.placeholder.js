/**
 * Unicorn Admin Template
 * Diablo9983 -> diablo9983@gmail.com
**/
(function($){
$(document).ready(function(){
	if($.browser.msie == true && $.browser.version.slice(0,3) < 10) {
		$('input:text[placeholder]').each(function(){
			var input = $(this);
			if (input.val()) return false;
			input.val(input.attr('placeholder'));

			input.focus(function(){
				 if (input.val() == input.attr('placeholder')) {
					 input.val('');
				 }
			});
			input.blur(function(){
				if (input.val() == '' || input.val() == input.attr('placeholder')) {
					input.val(input.attr('placeholder'));
				}
			});
		});
	}
});
})(jQuery);