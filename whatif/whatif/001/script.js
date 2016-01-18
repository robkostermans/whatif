var swatches;

(function ($) {
    
    $(".bg-img img").one("load", function () {
        img = this;
        var n = new Vibrant(img);
        swatches = n.swatches();
    }).each(function () {
        this.complete && $(this).load()
    });


    $(window).on('resize keyup paste copy cut', function () {
        knockout("myCanvas");
        knockout("myCanvasStroke");
        //resizeBGImage();
    }).trigger("resize");

})(jQuery);

function resizeBGImage() {
    $(".bg-img").css({
        "background-image": "url('" + $(".bg-img img").attr("src") + "')",
        width: $(".title h1").width() * 1,
        height: $(".title h1").height() * 1,
        top: $("h1").offset().top,// - ($(".title h1").height() / 2),
        left: $("h1").offset().left// - ($(".title h1").width() / 2)
    })
    $(".bg-img img").css("display","none")
}

function knockout(canvasid) {
    if (document.getElementById(canvasid) == null) { return false; }
    var canvas = document.getElementById(canvasid);
    var context = canvas.getContext('2d');
    var maxWidth = parseInt($(".quote h1").width()) + 30;
    var lineHeight = parseInt($(".title h1").css("line-height"));
    var x = $("h1").offset().left
    var y = $("h1").offset().top + lineHeight - 16
    var text = $(".title h1").text().trim();

    $(canvas).attr('height', parseInt($(".quote").height()));
    $(canvas).attr('width', parseInt($(".quote").width()));
    context.font = $(".title h1").css("font-weight") + " " + $(".title h1").css("font-size") + " " + $(".title h1").css("font-family").replace(/\'/g, "")
    context.strokeStyle = swatches['Muted'].getHex();
    context.lineWidth = 1;

    if ($("#" + canvasid).attr("data-fill") == 'true') {
        context.fillStyle = $(".quote").css('background-color');
        context.fillRect(0, 0, $(canvas).attr('width'), $(canvas).attr('height'));
        context.globalCompositeOperation = 'destination-out';
    }

    if ($("#" + canvasid).attr("data-stroke") == 'true') {
        context.fillStyle = "rgb(0,255,0,0)";

    }

    wrapText(context, text, x, y, maxWidth, lineHeight, $("#" + canvasid).attr("data-fill"),$("#" + canvasid).attr("data-stroke"));

    $(canvas).css("background", "transparent");
}

function wrapText(context, text, x, y, maxWidth, lineHeight, fill, stroke) {
    var words = text.split(' ');
    var line = '';

    for (var n = 0; n < words.length; n++) {
        var testLine = line + words[n] + ' ';
        var metrics = context.measureText(testLine);
        var testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            //context.fillText(line, x, y);
            if (fill == 'true') {
                context.fillText(line, x, y);
            }
            if (stroke == 'true') {
                context.strokeText(line, x, y);
            }
            line = words[n] + ' ';
            y += lineHeight;
        }
        else {
            line = testLine;
        }
    }
    if (fill == 'true') {
        context.fillText(line, x, y);

    }
    if (stroke == 'true') {
        console.log(line + " :: " + y)
        context.strokeText(line, x, y);
    }

}

