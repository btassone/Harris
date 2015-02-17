(function ($) {

    $.fn.popup = function(target) {

        fse_class_name = "popup_fullscreen_bg";
        fse_class_active_name = "active";

        target = $(target);

        $(this).on('click', function(){

            var fse = document.createElement("div");
            fse.className = fse_class_name;
            document.body.appendChild(fse);

            $(fse).focus();
            $(fse).addClass(fse_class_active_name);

            $(fse).on('click', function() {
                $(fse).removeClass(fse_class_active_name);
                window.setTimeout(function(f){
                    document.body.removeChild(f);
                },300, fse);
            });
        });
    };

}( jQuery ));