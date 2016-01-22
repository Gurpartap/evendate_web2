$(".ToSelect2").select2({
	containerCssClass: "form_select2",
	dropdownCssClass: "form_select2_drop"
});

$(".RippleEffect").click(function(e){
	var $this = $(this), $ripple, size, x, y;

	if($this.children(".ripple").length == 0)
		$this.prepend("<span class='ripple'></span>");

	$ripple = $this.children(".ripple");
	$ripple.removeClass("animate");

	if(!$ripple.height() && !$ripple.width()) {
		size = Math.max($this.outerWidth(), $this.outerHeight());
		$ripple.css({height: size, width: size});
	}

	x = e.pageX - $this.offset().left - $ripple.width()/2;
	y = e.pageY - $this.offset().top - $ripple.height()/2;

	$ripple.css({top: y+'px', left: x+'px'}).addClass("animate");
});