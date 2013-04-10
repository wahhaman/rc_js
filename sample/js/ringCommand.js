p = Math.PI*2;
blink = 75;//クリック時の点滅速度
spd = 750;//回転スピード
var timer;
//リスト初期配置 
$(function(){
    arrDispData = new ringPosition();
    contentHeight = arrDispData.y * 2;
    var defaultHeight = $('body').height() < contentHeight ? contentHeight : $('body').height();
    elem = $('#ringList ul.disp li').length;
    $('body').css({'position': 'relative', 'overflow': 'hidden', 'height': defaultHeight});
    $('#ringList').nextAll().css({'position': 'relative'});
    $('#ringList').prepend('<h2></h2>');
    $('#ringList').css({'width': arrDispData.x * 2, 'height': arrDispData.y * 2});
    $('#ringList h2').css({'z-index': 1000+ elem + 1, 'left': arrDispData.x - arrDispData.r * 1.2, 'top': arrDispData.y - arrDispData.r * 1.8, 'width': arrDispData.r * 2.4});
    $('body').append('<div id="target_marker"></div>');
    $('body').append('<div id="over"></div>');
    if (_ua.ltIE7){
        $('#ringList ul.disp').css({'position': 'absolute'});
    }
    $('#ringList ul.disp li').each(function(i){
        arrDispData.elemMaxX = arrDispData.elemMaxX > $(this).width() ? arrDispData.elemMaxX : $(this).width();
        arrDispData.elemMaxY = arrDispData.elemMaxY > $(this).height() ? arrDispData.elemMaxY : $(this).height();
        distance = i;
        $(this).css({'z-index': 1000 + i, 'left': this.x,'top': this.y});
        if($(this).hasClass('selected')){
            alt = $(this).find('img').attr('alt');
            $('#ringList h2').text(alt);
        }
    });
    $('#target_marker').css({
         'z-index': 1000 + elem
        ,'width': arrDispData.elemMaxX + 4
        ,'height': arrDispData.elemMaxY + 6
        ,'left': arrDispData.x - arrDispData.elemMaxX/2 - 4
        ,'top': arrDispData.y - arrDispData.r - arrDispData.elemMaxY/2
    });
    $('#ringList').addClass('close');

//swipe
    $('body').swipe( {
        tap:function(event, target){
        if($(this).data("dblTap")){
                enterKey();
                $(this).data("dblTap",false);
            } else {
                $(this).data("dblTap",true);
            }
            setTimeout(function(){
                $("body").data("dblTap",false);
            }, 400);
        },
        longTap:function(event, target){
            enterKey();
        },
        pinchStatus:function(event, phase, direction, distance , duration , fingerCount) {
            if(((direction == 'out' &&  $('#ringList').hasClass('close'))
             || (direction == 'in'  && !$('#ringList').hasClass('close'))) && phase == 'end') {
                toggleRingCommand();
            } else if(direction == 'in' && phase == 'end') {
                changeTargetRing(0);
            }
        },
        fingers:2,
        doubleTapThreshold:300,
        longTapThreshold:200,
        pinchThreshold:10
    });
    $('#ringList').swipe( {
        swipe:function(event, direction, distance, duration, fingerCount) {
            var regM = '^mouse';
            var regT = '^touch';
            var pointX, pointY;
            if(event.type.match(regM)) {
                var pointX = event.pageX;
                var pointY = event.pageY;
            } else if(event.type.match(regT)) {
                var pointX = event.changedTouches[0].pageX;
                var pointY = event.changedTouches[0].pageY;
            } 
            if(direction && pointX) {
                var thisNum = $('#ringList ul.disp li.selected').index();
                var directionNum;
                count = Math.ceil(distance / 100);
                if((direction == 'up'    && pointX < arrDispData.x)
                || (direction == 'down'  && pointX > arrDispData.x)
                || (direction == 'right' && pointY < arrDispData.y )
                || (direction == 'left'  && pointY > arrDispData.y )) {
                    thisNum--;
                    if(thisNum < 0){thisNum = elem -1;}
                    var clockwise = -1;
                } else {
                    thisNum++;
                    if(thisNum >= elem){thisNum = 0;}
                    var clockwise = 1;
                }
                $('body').rotateWheel(thisNum, spd, clockwise);
            }
        }
    });

//mouseWheel
    $('body').mousewheel(function(event, delta) {
        var hold = 360/elem > 40 ? 300/elem : 40;
        if($(this).data("continueWheel")){
            delta = 0;
        } else {
            $(this).data("continueWheel",true);
        }
        setTimeout(function(){
            $("body").data("continueWheel",false);
        }, hold);
        var thisNum = $('#ringList ul.disp li.selected').index();
        var direction;
        if(!$('#ringList').hasClass('close')){
            if (delta > 0){
                thisNum++;
                if(thisNum >= elem){thisNum = 0;}
                direction = 1;
            } else if (delta < 0){
                thisNum--;
                if(thisNum < 0){thisNum = elem -1;}
                direction = -1;
            }
            if(delta) $('body').stop(true).rotateWheel(thisNum, spd, direction);
        }
    });
//ie用
    if(_ua.ltIE8) {
        $('body').bind('dblclick', function(){
            enterKey();
        });
    }
});

//開く(右クリック)
$(document).on('contextmenu', function(e) {
    if(!$('#ringList').hasClass('close')){
        changeTargetRing(1);
    } else {
        toggleRingCommand();
    }
    return false;
});
$(document).on('keydown', function(e) {
    if(!$('#ringList').hasClass('close')){
        if(e.keyCode == 40) {
            changeTargetRing(0);
        } else if(e.keyCode == 38) {
            changeTargetRing(1);
        }
    }
    return false;
});
if (window.opera){$(document).addEventListener('mousedown', function(e) {toggleRingCommand(); return false; });}

//リサイズ
$(window).bind('resize',function(e){
    if (timer !== false) {
        clearTimeout(timer);
    }
    timer = setTimeout(function() {
        if (!_ua.ltIE8){
            var elemMaxX = arrDispData.elemMaxX;
            var elemMaxY = arrDispData.elemMaxY;
            arrDispData = new ringPosition();
            contentHeight = arrDispData.y * 2;
            $('#ringList').css({'width': arrDispData.x * 2, 'height': arrDispData.y * 2});
            $('#ringList h2').css({'left': arrDispData.x - arrDispData.r * 1.2, 'top': arrDispData.y - arrDispData.r * 1.8, 'width': arrDispData.r * 2.4});
            arrDispData.elemMaxX = elemMaxX;
            arrDispData.elemMaxY = elemMaxY;
            $('#target_marker').css({
                 'width': arrDispData.elemMaxX + 4
                ,'height': arrDispData.elemMaxY +6
                ,'left': arrDispData.x - arrDispData.elemMaxX/2 - 4
                ,'top': arrDispData.y - arrDispData.r - arrDispData.elemMaxY/2
            });
        }
        if(!$('#ringList').hasClass('close')){
            toggleRingCommand();
        }
    }, 200);
});

//回す
//
jQuery.fn.rotateWheel = function(num, speed, direction) {
    direction = direction ? direction : 1;
    $('#ringList ul.disp li').removeClass('selected');
    $('#ringList ul.disp li').each(function(i){
        var distance = i - num;
        var zIndex = num >= i ? elem + i -num + 1000 : i - num + 1000;
        var params = {
            center: [arrDispData.x - arrDispData.elemMaxX/2, arrDispData.y - arrDispData.elemMaxY/2],
                radius: arrDispData.r,
                start:  (1/elem * (distance + direction) - 0.5) * -360,
                end:    (1/elem * distance - 0.5) * -360,
                dir: direction
          }
        $(this).css('z-index',zIndex).stop().animate({path : new $.path.arc(params)},speed/elem);
        if(i == num){
            var alt = $(this).find('img').attr('alt');
            $(this).addClass('selected');
            $('#ringList h2').text(alt);
        }
    });
}

function ringPosition(){
    this.x = window.innerWidth ? window.innerWidth /2 : $(window).width() / 2;
    this.y = window.innerHeight ? window.innerHeight /2 : $(window).height() / 2;
    if (_ua.ltIE6){
        this.y = ($('html').height()) / 2;
        this.x = ($('html').width()) / 2;
    }
    if( this.x >= this.y ){
       this.r = this.y / 2.5;
       this.rOut = this.x * 2 + 100;
    } else {
        this.r = this.x / 2.5 ;
        this.rOut = this.y * 2 + 100;
    }
}

function toggleRingCommand() {
    var thisNum = $('#ringList ul.disp li.selected').index();
    var startR = $('#ringList').hasClass('close') ? arrDispData.rOut : arrDispData.r;
    var endR = $('#ringList').hasClass('close') ? arrDispData.r : arrDispData.rOut;
    var switchSpeed = 500;
    if($('#ringList').hasClass('close')){
        toggleDisplay();
    }
    $('#ringList ul.disp li').each(function(i){
        distance = i - thisNum;
        switchRing($(this), distance, startR, endR, switchSpeed);
    }).queue(function(){
        if(!$('#ringList').hasClass('close') && endR > startR){
            toggleDisplay();
        }
    });
    if(endR > startR){
        $('body').height(arrDispData.y * 2);
    }
}

function changeTargetRing(direction) {
    var num = $('#ringList ul.disp').index();
    var numOfRing = $('#ringList ul').length;

    var thisNum = $('#ringList ul.disp li.selected').index();
    var prevEndR = direction ? 0 : arrDispData.rOut;
    var thisStartR = direction ? arrDispData.rOut : 0;
    var switchSpeed = 300;
    var prevSpeed = direction ? switchSpeed : switchSpeed * 2;
    var thisSpeed = direction ? switchSpeed * 2 : switchSpeed;

    $('#ringList ul.disp li').each(function(i){
        distance = i - thisNum;
        switchRing($(this), distance, arrDispData.r, prevEndR, prevSpeed);
    }).parent('ul').toggleClass('disp').show().delay(thisSpeed).hide(0);

    if(direction){
        num = num >= numOfRing ? 0 : num;
    } else {
        num = num - 2 < 0 ? numOfRing - 1: num - 2;
    }
    console.log(num);
    $('#ringList ul:eq(' + num + ')').addClass('disp').show();
    var thisNum = $('#ringList ul.disp li.selected').index();
    elem = $('#ringList ul.disp li').length;
    $('#ringList ul.disp li').each(function(i){
        distance = i - thisNum;
        switchRing($(this), distance, thisStartR, arrDispData.r, thisSpeed);
        if($(this).hasClass('selected')){
            alt = $(this).find('img').attr('alt');
            $('#ringList h2').text(alt);
        }
    });
}

function toggleDisplay() {
    var height = arrDispData.y*2;
    var width = arrDispData.x*2;
    $('body').toggleClass('protect');
    $('#over').height(height).width(width).css({'top': $('body').scrollTop()}).toggleClass('overlay');
    $('#ringList').toggleClass('close');
    if (_ua.ltIE7){
        ie_offset = $('#ringList').offset();
        $('#ringList h2').css({'left': arrDispData.x - arrDispData.r * 1.2 - ie_offset.left});
        $('#ringList ul.disp').css({'left': - ie_offset.left});
    }
    var offset = arrDispData.y - arrDispData.r - arrDispData.elemMaxY/2 - 2
    $('#target_marker').css({'top': offset + $('body').scrollTop()}).toggleClass('target');
    return false;
}
function enterKey(){
    var thisNum = $('#ringList ul.disp li.selected').index();
    if( $('#ringList li:eq(' + thisNum + ')').find('a').size()) {
        var rel = $('#ringList ul.disp li.selected').find('a').attr('rel');
        var url = $('#ringList li:eq(' + thisNum + ')').find('a').attr('href');
        if(!$('#ringList').hasClass('close')){
            $('#ringList').fadeOut(blink).fadeIn(blink).fadeOut(blink).fadeIn(blink).queue(function(){
                toggleRingCommand();
                location.href = url;
            });
        }
    } else {
        toggleRingCommand();
    }
}

function switchRing(target, distance, startR, endR, speed){
    var degree = 1/elem * distance - 0.25;
    var centerY = arrDispData.y > arrDispData.r * 2.5 ? arrDispData.y : arrDispData.r * 2.5;
    var startX = Math.cos(degree * p) * startR + arrDispData.x - arrDispData.elemMaxX/2;
    var startY = Math.sin(degree * p) * startR + centerY - arrDispData.elemMaxY/2;
    var endX = Math.cos(degree * p) * endR + arrDispData.x - arrDispData.elemMaxX/2;
    var endY = Math.sin(degree * p) * endR + centerY - arrDispData.elemMaxY/2;
    var direction = endR > startR ? 1 : -1;
    var params = {
        start: {
            x: startX,
            y: startY,
            angle : -45
        },
        end:    {
            x: endX,
            y: endY,
            angle: direction * 45,
            length: 1/5
        }
    }
    target.stop().animate({path : new $.path.bezier(params)}, speed);
}
