let num = 0;
let oScore1 = document.getElementById("player1");
let oScore2 = document.getElementById("player2");
let score1 = 0;
let score2 = 0;
let arrScore = [];
let autoSay = true;
let ballFirst = 0;
let nballside = null;
let turn = 2;
let bstatus = true;
arrScore.push({ "score1": 0, "score2": 0 });

function QRcode() {
    bstatus = false;
    Swal.fire({
        title: '以QRcode分享',
        html: '<div id="qrcode"></div>',
        showCloseButton: true,
        showCancelButton: false,
        allowOutsideClick: false
    }).then((result) => {
        location.reload();
    });
    $('#qrcode').qrcode(location.href);
}

function score2Fn() {
    if (!ballFirst) return nballside = ballFirst = 2;
    score2++;
    arrScore.push({ "score1": score1, "score2": score2 });
}

function score1Fn() {
    if (!ballFirst) return nballside = ballFirst = 1;
    score1++;
    arrScore.push({ "score1": score1, "score2": score2 });
}

function refresh() {
    document.getElementById("player1").innerText = score1;
    document.getElementById("player2").innerText = score2;
    nballside = baller();
    colorball();
}

function ballside() {
    if ((score1 + score2) % turn == 0 && nballside == 2) return "，右邊發球";
    if ((score1 + score2) % turn == 0 && nballside == 1) return "，左邊發球";
    return "";
}

function baller() {
    if (ballFirst == 1) {
        if ((score1 + score2 - turn) % (turn * 2) == 0) return 2;
        if ((score1 + score2) % (turn * 2) == 0) return 1;
    }
    if (ballFirst == 2) {
        if ((score1 + score2 - turn) % (turn * 2) == 0) return 1;
        if ((score1 + score2) % (turn * 2) == 0) return 2;
    }
    return nballside;
}

function colorball() {
    if (nballside == 1) {
        document.getElementById("player1").classList.add('text-primary');
        document.getElementById("player2").classList.remove('text-primary');
    }
    if (nballside == 2) {
        document.getElementById("player2").classList.add('text-primary');
        document.getElementById("player1").classList.remove('text-primary');
    }
}

window.addEventListener('click', function(e) {
    if (bstatus == false) return;
    if (turn == 1 && (score1 - score2 == 2 || score2 - score1 == 2)) return speak(oScore1.innerText + "比" + oScore2.innerText);
    if (turn == 2 && (score1 == 11 || score2 == 11)) return speak(oScore1.innerText + "比" + oScore2.innerText);
    let posX = event.clientX;
    let maxX = document.body.clientWidth;
    let posY = event.clientY;
    let maxY = document.body.clientHeight;
    if (!(maxY / posY < 6)) return;
    if ((maxX / posX > 2)) score1Fn();
    if ((maxX / posX < 2)) score2Fn();
    if (score1 == 10 && score2 == 10) turn = 1;
    refresh();
    if (turn == 1 && (score1 - score2 == 2 || score2 - score1 == 2)) return speak(oScore1.innerText + "比" + oScore2.innerText + "比賽結束");
    if (turn == 2 && (score1 == 11 || score2 == 11)) return speak(oScore1.innerText + "比" + oScore2.innerText + "比賽結束");
    if (autoSay) speak(oScore1.innerText + "比" + oScore2.innerText + ballside(nballside));
}, false);

//感謝分享! https://gist.github.com/Eotones/d67be7262856a79a77abeeccef455ebf
function speak(reqword) {
    const synth = window.speechSynthesis;
    const speak = (msg) => {
        let u = new SpeechSynthesisUtterance();
        u.text = msg;
        let voices = synth.getVoices();

        for (let index = 0; index < voices.length; index++) {
            /*
            "Google US English"
            "Google 日本語"
            "Google 普通话（中国大陆）"
            "Google 粤語（香港）"
            "Google 國語（臺灣）"
            */
            //console.log(this.voices[index].name);
            if (voices[index].name == "Google 國語（臺灣）") {
                u.voice = voices[index];
                break;
            } else {
                u.lang = 'tw';
            }
        }
        synth.speak(u);
    };
    speak(reqword);
}

function fnAutoSay() {
    if (autoSay) {
        autoSay = false;
        document.getElementById('oAutoSay').innerText = "自動發音[OFF]";
    } else {
        autoSay = true;
        document.getElementById('oAutoSay').innerText = "自動發音[ON]";
    }
}

function strFilter(str) {
    var pattern = /[`~!@#$^&*()=|{}':;',\\\[\]\.<>\/?~！@#￥……&*（）——|{}【】'；：""'。，、？]/g;
    return str.replace(pattern, "");
}

function detectmob() {
    if (navigator.userAgent.match(/Android/i) ||
        navigator.userAgent.match(/webOS/i) ||
        navigator.userAgent.match(/iPhone/i) ||
        navigator.userAgent.match(/iPad/i) ||
        navigator.userAgent.match(/iPod/i) ||
        navigator.userAgent.match(/BlackBerry/i) ||
        navigator.userAgent.match(/Windows Phone/i)
    ) {
        return true;
    } else {
        return false;
    }
}

function fullscreen() {
    screenfull.isFullscreen ? screenfull.exit() : screenfull.request();
}

function getDirection(startx, starty, endx, endy) {
    var angx = endx - startx;
    var angy = endy - starty;
    var result = 0;

    //如果滑動距離太短
    if (Math.abs(angx) < 2 && Math.abs(angy) < 2) {
        return result;
    }

    var angle = getAngle(angx, angy);
    if (angle >= -135 && angle <= -45) {
        result = 1;
    } else if (angle > 45 && angle < 135) {
        result = 2;
    } else if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {
        result = 3;
    } else if (angle >= -45 && angle <= 45) {
        result = 4;
    }

    return result;
}

function getAngle(angx, angy) {
    return Math.atan2(angy, angx) * 180 / Math.PI;
};
//手指接觸螢幕
document.addEventListener("touchstart", function(e) {
    startx = e.touches[0].pageX;
    starty = e.touches[0].pageY;
}, false);
//手指離開螢幕
document.addEventListener("touchend", function(e) {
    var endx, endy;
    endx = e.changedTouches[0].pageX;
    endy = e.changedTouches[0].pageY;
    var direction = getDirection(startx, starty, endx, endy);
    switch (direction) {
        case 0:
            //no
            break;
        case 1:
            //up
            if (arrScore.length == 0) location.reload();
            let uprecord = arrScore.pop();
            score1 = uprecord.score1;
            score2 = uprecord.score2;
            refresh();
            break;
        case 2:
            //down
            if (arrScore.length == 0) location.reload();
            let downrecord = arrScore.pop();
            score1 = downrecord.score1;
            score2 = downrecord.score2;
            refresh();
            break;
        case 3:
            //left
            break;
        case 4:
            //right
            break;
        default:
    }
}, false);