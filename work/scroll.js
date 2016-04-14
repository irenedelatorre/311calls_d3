

jQuery(document).ready(function(){
    var navOffset = jQuery(".main-nav").offset().top;

    jQuery(window).scroll(function(){
        var scrollPos = jQuery(window).scrollTop();

        if (scrollPos>=navOffset){
            console.log("sticky");
            jQuery(".main-nav").addClass("main-nav-scrolled");
            jQuery(".visualizations").addClass("visualizations-scrolled");


        }else{
            jQuery(".main-nav").removeClass("main-nav-scrolled");
            jQuery(".visualizations").removeClass("visualizations-scrolled");
        }
    });



})