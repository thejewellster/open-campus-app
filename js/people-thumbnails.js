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

<script>
	$(document).ready(function(){
  		$(".ezra").click(function(){
    		$(".bottom-half-ezra").slideToggle();
    		$(".job-template").show();
    		$(this).parent().find('.ezra-btns').css('color','#000');
  		});
  		$(".ezra-btns").click(function(){
		var selector = $(this).data('target');
		$("." + selector).show().siblings("div").hide();

		$(this).parent().find('.ezra-btns').css('color','#000');
    	$(this).css('color','#fff');
		});	
	});
</script>