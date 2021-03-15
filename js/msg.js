var data = null;
var permission = 'gsx$iwouldliketoallowthankbluetousethefollowinginformationontheirwebsitesocialmediaforhealthcareworkersandthegeneralpublictoseedefaultismessageonly';
var firstName = 'gsx$firstname';
var lastName = 'gsx$lastnameoptional';
var message = 'gsx$messagetohealthcareworkers';
var year = 'gsx$graduationyear';
var index = 0;
var limit = 6;
var cur = 0;
var frontIndex = 0;

function doData(json) {
    data = shuffle(json.feed.entry);
    frontIndex = data.length - 1;
}

function drawMsg(messages) {
    if (messages == null) return null;
    var community = $('#messages');
    for(var c=0; c<messages.length; c++) {
        var elem = $(
            `<div class="column box-container">
                <div class="text-box">
                    <p class="msg-text"> ${messages[c]} </p>
                </div>
                <img src="img/msg_${cur ? 'blue' : 'maize'}.png" class="image1">
            </div>`).hide().fadeIn(500);
        elem.appendTo(community);
        cur = !cur;
    }
    //return community;
}

function drawTable(parent) {
    var table = $("<table/>");
    parent.append(table);
    return table;
}
function titleCase(str) {
    str = str.toLowerCase().split(' ');
    for (var i = 0; i < str.length; i++) {
      str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1); 
    }
    return str.join(' ');
}
function shuffle(sourceArray) {
    for (var i = 0; i < sourceArray.length - 1; i++) {
        var j = i + Math.floor(Math.random() * (sourceArray.length - i));

        var temp = sourceArray[j];
        sourceArray[j] = sourceArray[i];
        sourceArray[i] = temp;
    }
    return sourceArray;
}

function parseMsg(r){
    var first_name = data[r][firstName]["$t"].trim();
    var last_name = data[r][lastName]["$t"].trim();
    var msg = data[r][message]["$t"].trim();
    var yr = data[r][year]["$t"].trim();
    var perm = data[r][permission]["$t"];
    let name = first_name;
    if (yr.includes('Class of') || !isNaN(yr.slice(-2))){
        yr = ", '" + parseInt(yr.slice(-2));
    }else {
        yr = ", " + yr;
    }
    if (perm.includes('Full')){
        name += ' ' + last_name;
    }else if (perm == ''){
        name = first_name;
    }else if (last_name != ''){
        name += ' ' + last_name.charAt(0).toUpperCase();
    }
    name = titleCase(name);
    return '"' + msg + '"\n\n– ' + name + yr;
}

function readData(parent) {
    var rowData = [];
    if (index >= data.length){
        $('#load').hide();
        $('#community').append($('<p>No more messages to show for now!</p>'));
        return;
    }
    for(var r=index; r<Math.min(data.length,index+limit); r++) {
        //console.log([msg, name, yr].join(' '));
        rowData.push(parseMsg(r));
    }
    index += limit;
    index = Math.min(data.length,index);
    drawMsg(rowData);
    if (index >= data.length){
        $('#load').hide();
        $('#community').append($('<p>No more messages to show for now!</p>'));
        return;
    }
}

function showMsg(){
    $("#front-text").fadeToggle(500);
    var m = parseMsg(frontIndex);
    frontIndex--;
    if (frontIndex <= 0){
        frontIndex = data.length - 1;
    }
    $("#front-text").text(m);
    setTimeout(()=>{$("#front-text").fadeToggle(500)},4500);
    setTimeout(showMsg,5000);
}

$(document).ready(function(){
    $("#front-text").hide();
    $('#progress').css('width',data.length/10 + '%');
    $('#progresspercent').text(data.length/10 + '%');
    $('#progresstext').text(`${data.length}/1000 messages collected.`);
    readData();
    $("#load").click(readData);
    setTimeout(()=>{$("#logopic").fadeTo("slow",0.15,showMsg)},1000);
});