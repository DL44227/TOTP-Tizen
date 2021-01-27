var keyItems = [];

var UpdateRemainTimeInner;
var remainTime;
var progressBarWidget;
var snapListComponent;
var debug=0;

var tokenList = document.getElementById("Tokens");

window.onload = Redraw();

// Convert a hex string to a byte array
function hexToBytes(hex) {
    for (var bytes = [], c = 0; c < hex.length; c += 2)
    {
      bytes.push(parseInt(hex.substr(c, 2), 16));
    }
    return bytes;
}

// Convert a byte array to a hex string
function bytesToHex(bytes) {
    for (var hex = [], i = 0; i < bytes.length; i++) {
        var current = bytes[i] < 0 ? bytes[i] + 256 : bytes[i];
        hex.push((current >> 4).toString(16));
        hex.push((current & 0xF).toString(16));
    }
    return hex.join("");
}

function calc(key, keytime, keylength, digest) {
    try{
        var time = ("0000000000000000" + keytime.toString(16)).slice(-16);

        var hmac = "";
        if (digest === "SHA-1")
        {
          hmac = (new jsSHA(time,"HEX")).getHMAC(key, "HEX", "SHA-1", "HEX");
          debug && console.log ("Time:" + time + " Secret: " + key + " SHA1.getHMAC: " + hmac);
        }
        else if (digest === "SHA-256")
        {
          var time2 = hexToBytes (time);
          var key2 = hexToBytes (key);
          hmac = sha256.hmac(key2, time2);
          debug && console.log ("Time:" + time + " Secret: " + key + " sha256.hmac: " + hmac);
        }
        else if (digest === "SHA-512")
        {
          var time2 = hexToBytes (time);
          var key2 = hexToBytes (key);
          hmac = sha512.hmac(key2, time2);
          debug && console.log ("Time:" + time + " Secret: " + key + " sha512.hmac: " + hmac);
        }
        else
        {
          return "" + digest + ":Unknown digest";
        }
        var offset = parseInt(hmac.substring(hmac.length - 1),16);
        var otp = (parseInt(hmac.substr(offset * 2, 8),16) & parseInt("7fffffff",16)).toString();

        var spaces = new RegExp('.{' + Math.round(keylength/2) + '}$');
        // var spaces = new RegExp('.{' + 3 + '}$');

        debug && console.log ("Offset: " + offset);
        debug && console.log (" otp: " + otp);
        debug && console.log (" spaces: " + spaces);
        // debug && console.log (" ret: " + ret);
        return otp.slice(keylength*-1).replace(spaces, ' $&');
    }catch(err){
        return "000 000";
    }
}


function UpdateRemainTime(nextTime){
    var currentTime = Math.round(new Date().getTime() / 1000.0);
    var calc_time = Math.floor(currentTime / 30);
    var nextTime = 30 - (currentTime % 30);
    UpdateRemainTimeInner(nextTime);
    return calc_time;
}
function UpdateRemainTimeRectangle(nextTime){
    remainTime.innerHTML = nextTime + REMAIN;
}
function UpdateRemainTimeCircle(nextTime){
    progressBarWidget.value(nextTime);
}


function InitList() {
    var calc_time = UpdateRemainTime();
    for(var i=0; i<keyItems.length; i++){
        var item = keyItems[i];
        var token = calc(item.key,calc_time,item.digits );
        var item_id = "item_"+i;
        var newelm = MakeLiItem(item_id, token,item.service, item.id);
        tokenList.appendChild(newelm);
    }
}

function Update() {
    var calc_time = UpdateRemainTime();
    debug && console.log ("");
    for(var i=0; i<keyItems.length; i++){
        var item = keyItems[i];
        var token = calc(item.key, calc_time, item.digits, item.digest);
        var item_id = "item_"+i;

        var oldelm =  document.getElementById(item_id);
        oldelm.childNodes[0].textContent = token;
    }
}

function MakeLiItem (elem_id , token , service, id){
    var li = document.createElement("li");
    li.setAttribute("class","li-has-multiline");
    li.setAttribute("style","text-align:center;");
    li.setAttribute("id", elem_id);
    li.innerHTML = token;

    var span = document.createElement("div");
    span.setAttribute("class","ui-li-sub-text li-text-sub");
    span.innerHTML = "[ " + service + " ] " + id;

    li.appendChild(span);

    return li;
}

function init(result) {
    keyItems = result;

    var footer = document.getElementById("footer");
    var progress = document.getElementById("progress");

    if (result.example) {
        var li= document.createElement("li");
        var msg = document.createElement("div");
        msg.setAttribute("class","ui-marquee ui-marquee-gradient");
        msg.setAttribute("onclick", "tau.changePage('caution');");
        msg.innerHTML = "auth_keyinfo.txt not found. You need create and put auth_keyinfo.txt to documents folder";
        li.appendChild(msg);
        tokenList.appendChild(li);
        if (tau.support.shape.circle) {
            tau.helper.SnapListMarqueeStyle.create(tokenList, { marqueeDelay: 1000, marqueeStyle: "endToEnd" });
        }
        tau.changePage("caution");
    }

    if (tau.support.shape.circle) {
        footer.style.display="none";
        progressBarWidget = new tau.widget.CircleProgressBar(progress, {size: "full"});
        UpdateRemainTimeInner = UpdateRemainTimeCircle;
        InitList();
        snapListComponent = tau.widget.SnapListview(tokenList);
        circle_helper(tau);
    } else {
        progress.style.display="none";
        remainTime = document.getElementById("remainTime");
        UpdateRemainTimeInner = UpdateRemainTimeRectangle;
        InitList();
    }

    window.setInterval(Update,1000);
}

function Redraw() {
    tokenList.innerHTML = "";
    try{
        document.getElementById("Title").innerHTML=TITLE;
    }catch(e){
        TITLE = "TOTP by DL";
        REMAIN = " sec. left";
        document.getElementById("Title").innerHTML=TITLE;
    }
    ReadItems(init);
}
