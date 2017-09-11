$(document).ready(function() {
    var canvas = document.querySelector("canvas");
    var ctx = canvas.getContext("2d");

    $(".canvas").on('mouseenter', function() {
        $(".canvas").on('mousedown', function(e) {
            ctx.moveTo(e.offsetX, e.offsetY);
            $(".canvas").on('mousemove', function(e) {
                ctx.lineTo(e.offsetX, e.offsetY);
                ctx.stroke();
                $(".canvas").on('mouseup', function() {
                    ctx.stroke();
                    $(".canvas").off("mousemove");
                    $(".user-sign").val(canvas.toDataURL());
                });
            });
        });

    });

    $("button").on('click', function(e) {
        if (!$(".user-sign").val()) {
            e.preventDefault();
            $("<h1> all fields need to be filled in order to submit </h1>").insertAfter("img");
        }
    });
});
