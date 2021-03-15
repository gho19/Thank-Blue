var data = null;
var permission = 'gsx$iwouldliketoallowthankbluetousethefollowinginformationontheirwebsitesocialmediaforhealthcareworkersandthegeneralpublictoseedefaultismessageonly';
var firstName = 'gsx$firstname';
var lastName = 'gsx$lastnameoptional';
var message = 'gsx$messagetohealthcareworkers';
var year = 'gsx$graduationyear';
var index = 0;
var limit = 6;
var cur = 0;

function doData(json) {
    data = shuffle(json.feed.entry);
}

function drawMsg(messages) {
    if (messages == null) return null;
    var community = $('#messages');
    for(var c=0; c<messages.length; c++) {
        var elem = $(
            `<div class="column" style="position: relative;
                display: flex; align-items: center; justify-content: center;">
                <div class="text-box">
                    <p class="msg-text"> ${messages[c].msg + '\n\n– ' + messages[c].name + ", " + messages[c].yr} </p>
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

function readData(parent) {
    var rowData = [];
    if (index >= data.length){
        $('#load').hide();
        $('#community').append($('<p>No more messages to show for now!</p>'));
        return;
    }
    for(var r=index; r<Math.min(data.length,index+limit); r++) {
        var first_name = data[r][firstName]["$t"];
        var last_name = data[r][lastName]["$t"];
        var msg = data[r][message]["$t"];
        var yr = data[r][year]["$t"];
        var perm = data[r][permission]["$t"];
        let name = first_name;
        if (yr.includes('Class of')){
            yr = "'" + parseInt(yr.slice(-2));
        }
        if (perm.includes('Full')){
            name += ' ' + last_name;
        }else if (last_name != ''){
            name += ' ' + last_name.charAt(0).toUpperCase();
        }
        name = titleCase(name);
        //console.log([msg, name, yr].join(' '));
        rowData.push({'msg': msg, 'name':name, 'yr': yr});
    }
    index += limit;
    index = Math.min(data.length,index);
    console.log()
    drawMsg(rowData);
}

$(document).ready(function(){
    $("#progress").attr('width',data.length/10 + '%');
    $("#progress").attr('aria-valuenow',data.length);
    readData();
    $("#load").click(readData);
});