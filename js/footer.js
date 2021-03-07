let browser;
var startAddress;
var endAddress;
//var geolocation = 'https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyBaHq0wC0qe4x3AqnAYdQBUHCJne15ifHk';

$(function() {
    $("#ssrr-footer").load("./pages/common/footer.html", function() {
        date = new Date();
        $("#copyright").text("Copyright © " + date.getFullYear() + " 四川料理 inc. All rights Reserved.");
    });
});
