$(function() {
    $("#ssrr-footer").load("./pages/common/footer.html", function() {
        date = new Date();
        $("#copyright").text("Copyright © " + date.getFullYear() + " APASYS inc. All rights Reserved.");
    });
});
