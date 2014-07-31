<script>
	$(document).ready(function(){
  		$(".marcella").click(function(){
    		$(".bottom-half-marcella").slideToggle();
    		$(".job-template").show();
    		$(this).parent().find('.marcella-btns').css('color','#000');
  		});
  		$(".marcella-btns").click(function(){
		var selector = $(this).data('target');
		$("." + selector).show().siblings("div").hide();

		$(this).parent().find('.marcella-btns').css('color','#000');
    	$(this).css('color','#fff');
		});	
	});
</script>

