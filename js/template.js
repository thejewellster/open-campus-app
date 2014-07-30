
$(document).ready(function(){
    $('.long').hide();
    //collapse-expand hack on jobs
    $('.btn-xs').click(function(){
    $('.long').toggle();
    });
    $('.btn-xs').bind('click', function() {
    $(this).html($(this).html() == 'Expand' ? 'Collapse' : 'Expand');
    });
});
