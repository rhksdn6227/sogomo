/*
1. nextGallery 33줄
    고양이 정보에서 해당 고양이의 다음 사진으로 넘기는 함수

2. bewriten 46줄
    고양이 정보에서 수정을 눌렀을 때 수정가능하도록 만드는 함수

3. modalopen 56줄
    고양이 정보에서 특정 고양이 눌렀을 때 고양이 정보가 기입되게 하는 함수

4. openinput / closeinput / writein / writeplus 100줄
    달력에서 특정 날의 일지 정보창을 열고 닫는 함수 / box라는 id를 갖고있는 부분에 content를 넣어주거나 뒤에 이어서 넣어주는 함수

5. show / change 함수 112줄
    달력에서 다른 날짜, 다른 시간대를 클릭했을 때, 일지 정보칸의 내용을 바꿔주는 함수

6. bewrite / bereadyonly 123줄
    달력에서 일지를 작성가능 / 불가능하게 만드는 함수

7. ilji_error / info_error / cerror 149줄
    일지 작성할 때, 고양이 수정할 때, 고양이 추가할 때 항목이 비면 경고창을 띄워주는 함수


*/


var ilji_list = ['food_box', 'water_box', 'weather_box', 'note_box', 'manager_box'];
var catsrc = [];
var cnt=1;
var uRows = [];
var area = document.getElementsByName('area');

function nextGallery() {
    if(cnt>2) cnt=0;
    catimage.src=catsrc[cnt];
    cnt++;
}

window.onclick = function(event) {
    var modal = document.getElementById('myModal');
    var span = document.getElementById('modal_close');
    if (event.target == modal) modal.style.display = "none";
    if (event.target == span) modal.style.display = 'none';
}

function bewriten() {
    var cat_text=document.getElementsByClassName("cat_text");
    for(var i in cat_text) cat_text[i].readOnly=false;
    for(var i in area) {
        area[i].onclick = function() {
            return true;
        }
    }
}

function modalopen(clicked_id) {
    var modal = document.getElementById('myModal');
    var catname=document.getElementById("cat_name");
    var catsex=document.getElementById("cat_sex");
    var catage=document.getElementById("cat_age");
    var catdesexualize=document.getElementById("cat_desexualize");
    var catstate=document.getElementById("cat_state");
    var cathandling=document.getElementById("cat_handling");
    var catchart=document.getElementById("cat_chart");
    var catetc=document.getElementById("cat_etc");
    var catbfname=document.getElementById("cat_bfname");    
    var cats=uRows;
    
    catimage=document.getElementById("Modalpic");
    for(var i in cats) {
        if(cats[i].name===clicked_id){
            catname.value=clicked_id;
            catsex.value=cats[i].sex;
            catage.value=cats[i].age;
            catdesexualize.value=cats[i].desexualize;
            catstate.value=cats[i].state;
            cathandling.value=cats[i].handling;
            catchart.value=cats[i].chart;
            catetc.value=cats[i].etc;
            catbfname.value=clicked_id;
            catsrc=['cat/'+cats[i].img1,'cat/'+cats[i].img2,'cat/'+cats[i].img3];
            catimage.src=catsrc[0];
            break;
        }
    }
    var cat_text=document.getElementsByClassName('cat_text');
    for(var i in cat_text) cat_text[i].readOnly=true;
    for(var j in area) {
        area[j].checked = false;
        for(var k in idk) {
            if((Number(area[j].value) === idk[k].fc) && (idk[k].cat === clicked_id))
                area[j].checked = true;
        }
        area[j].onclick=function() {return false;}
    }
    modal.style.display = "block";
}


function open_input(box) {
    document.getElementById(box).style.display = "block";
}
function close_input(box) {
    document.getElementById(box).style.display = "none";
}
function writein(box, content) {
    document.getElementById(box).innerHTML = content;
}
function writeplus(box, content) {
    document.getElementById(box).value += content;
}
function show(record, ymd, time) {
    var ymd = String(ymd);
    year = ymd.slice(0, 4);

    if(0 <= ymd.charAt(7) && ymd.charAt(7) < 10) {
        month = ymd.slice(6, 8);

        if(0 <= ymd.charAt(11) && ymd.charAt(11) < 10) {
            date = ymd.slice(10, 12);
        }
        else {
            date = ymd.slice(10, 11);
        }
    }
    else{
        month = ymd.slice(6, 7);

        if(0 <= ymd.charAt(10) && ymd.charAt(10) < 10) {
            date = ymd.slice(9, 11);
        }
        else {
            date = ymd.slice(9, 10);
        }

    }
    console.log("year:"+year+" month:"+month+" date:"+date);
    if(month.length == 1) month = '0' + month;
    if(date.length == 1) date = '0' + date;
    var today = year + '-' + month + '-' + date;
    return record.find(function(day) {
        return day.day.slice(0, 10) == today && day.time == time;
    });
}
function beWrite() {
    for(var i in ilji_list) {
        document.getElementById(ilji_list[i]).readOnly = false;
    }
}
function beReadOnly() {
    for(var i in ilji_list) {
        document.getElementById(ilji_list[i]).readOnly = true;
    }
}
function change(data) {
    if(data === undefined) {
        for(var i in ilji_list) {
            document.getElementById(ilji_list[i]).value = '';
        }
        beWrite();
    }
    else {
        document.getElementById('food_box').value = data.food;
        document.getElementById('water_box').value = data.water;
        document.getElementById('weather_box').value = data.weather;
        document.getElementById('note_box').value = data.note;
        document.getElementById('manager_box').value =  data.manager;
        beReadOnly();
    }
}
function ilji_error(todo) {
    var fname= document.forms['iljiwrite'];
    if(todo === '등록') {
        if(fname['foodbox'].value.length < 1) { alert('밥 항목을 입력해주세요.'); return false; }
        if(fname['waterbox'].value.length < 1) { alert('물 항목을 입력해주세요.'); return false; }
        if(fname['weatherbox'].value.length < 1) { alert('날씨 항목을 입력해주세요.'); return false; }
        if(fname['managerbox'].value.length < 1) { alert('담당자를 입력해주세요.'); return false; }

        return confirm('등록/수정 작업을 진행하시겠습니까?');
    }
    else {
        if(fname['foodbox'].value.length < 1) { alert('삭제할 데이터가 존재하지 않습니다.'); return false; }
        
        return confirm('삭제 작업을 진행하시겠습니까?');
    }
}
function info_error(todo) {
    var fname= document.forms['cat_modify'];
    if(todo === '등록') {
        if(fname['name'].value.length < 1) { alert('이름 항목을 입력해주세요.'); return false; }
        if(fname['sex'].value.length < 1) { alert('성별 항목을 입력해주세요.'); return false; }
        if(fname['desexualize'].value.length < 1) { alert('중성화 여부를 입력해주세요.'); return false; }
        if(fname['state'].value.length < 1) { alert('상태를 입력해주세요.'); return false; }
        if(fname['handling'].value.length < 1) { alert('핸들링 여부를 입력해주세요.'); return false; }

        return confirm('수정 작업을 진행하시겠습니까?');
    }
    else {
        return confirm('삭제 작업을 진행하시겠습니까?');
    }
}
function cerror(to_doo) {
    var fname = document.forms['cat_plus'];
    if(to_doo === 'Register') {
        if(fname['name'].value.length < 1) { alert('이름 항목을 입력해주세요.'); return false; }
        if(fname['sex'].value.length < 1) { alert('성별 항목을 입력해주세요.'); return false; }
        if(fname['desexualize'].value.length < 1) { alert('중성화 여부를 입력해주세요.'); return false; }
        if(fname['state'].value.length < 1) { alert('상태를 입력해주세요.'); return false; }
        if(fname['handling'].value.length < 1) { alert('핸들링 여부를 입력해주세요.'); return false; }
        if(fname['uploaded_image1'].value.length < 1) { alert('이미지를 등록해주세요.'); return false; }
        if(fname['uploaded_image2'].value.length < 1) { alert('이미지를 등록해주세요.'); return false; }
        if(fname['uploaded_image3'].value.length < 1) { alert('이미지를 등록해주세요.'); return false; }
        if(fname['area'].value.length < 1) { alert('이미지를 등록해주세요.'); return false; }

    
    return confirm(`${fname['name'].value}을(를) 등록하시겠습니까?`);
    }
}
function cherror(to_doo) {
	var fname = document.forms['manager'];
	if(to_doo === '변경') {
		if(fname['userpassword'].value.length < 1) {
			alert('변경할 패스워드를 입력해주세요');
			return false;
		}
	return confirm('비밀번호를 변경하시겠습니까?');
	}
}
	
