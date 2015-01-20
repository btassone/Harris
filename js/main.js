function main() {
    $(".quick_watch .close").on('click', function(){
        $(".quick_watch .content").slideUp(300);
        setTimeout(function(){
            $(".quick_watch .content_closed").toggle();
        }, 300);
    });

    $(".quick_watch .content_closed").on('click', function(){
        $(".quick_watch .content_closed").toggle();
        $(".quick_watch .content").slideDown(300);
    });
}