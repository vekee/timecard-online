$(function(){
    $("#ssrr-header").load("./pages/common/header.html", function () {
        // Add class active when the user clicks the lis of the menu
        $('.nav .ul li').on('click', 'a', function () {
            $(this).parent().addClass('active').siblings().removeClass('active');
        });
    });
});
