/*
1. infopage - 23줄
    /catinfo 로 들어왔을 때, 좌측엔 급식소 리스트를, 우측엔 해당 급식소의 고양이를 띄울 화면

    Parameter - list : 급식소의 리스트 정보 / content : 고양이 사진 정보가 들어감 / modal : 고양이 정보가 나타날 modal 창의 코드가 들어감

2. catList - 44줄
    해당 급식소의 고양이 사진 정보가 싹 담긴 함수

    Parameter - cats : 해당 급식소의 고양이 정보 전부

3. catmodal - 56줄
    고양이 모달창을 구성해주는 함수

    Parameter - usersRows : 해당 급식소의 고양이의 모든 정보를 전역변수의 uRows에 담아둠

4. catcreate - 133줄
    고양이를 추가하는 화면의 함수
    전체가 폼태그로 묶여 모든 정보를 DB와 연결해 등록해줌
*/

module.exports = {
    infopage: function (list, content, modal, areaid) {
        // subpage의 좌측 리스트가 담기는 페이지
        var page = `<div class="page1"><ul>`;
        // mysql 로 부터 받아온 급식소 리스트를 ul li 태그로 나열한다.
        // 리스트 중 하나를 선택했을 때, address/catinfo?area=1 이렇게 링크가 걸린다.
        for (var i in list) {
            page += `<li class="menu"><a id=${Number(i)+1} href="/catinfo?area=${list[i].id}">${list[i].name}</a></li>`;
        }
        page += `</ul></div>
        <script>
            var x = document.getElementById("${areaid}");
            x.classList.add('active');
        </script>`;
        // 우측의 내용이 담기는 페이지
        page += `
        <div class="page2">${content}</div>
        <div>
            <form action="/info_create" method="get">
                <input type="submit" value="고양이 추가" id="addcat">
            </form>
        </div>
        ${modal}
        `;
        return page;
    },
    catList: function (cats) {
        var list = '<div class="polaroid">';
        for (i in cats) {
            list += `
            <figure id=${cats[i].name} onclick="modalopen('${cats[i].name}')">
                <img src="cat/${cats[i].img1}" alt="cat"">
                <figcaption>${cats[i].name}</figcaption>
            </figure> `;
        }
        list += `</div>`;
        return list;
    },
    catmodal: function (usersRows, cats_area, right) {
        return `
        <script>
            uRows = ${JSON.stringify(usersRows)};
            idk = ${JSON.stringify(cats_area)};
        </script>
        <div id="myModal" class="modal">
            <div class="modal-content">
                <span class="close" id="modal_close">&times;</span>
                <div class="cat_picture">
                <br>
                    <img src="" id="Modalpic" width="90%" height=340 alt="tq" border="1">
                    <br>
                    <br>
                    <center>
                        <input type="button" id="modal_nextimg_button" value="다음사진" onclick="nextGallery()">
                    </center>
                </div>
                <div class="cat_info">
                    <form action="/cat_write" method="post" name="cat_modify" onsubmit="return info_error(todoo)">
                        <input id="cat_bfname" type="hidden" name="bfname">
                        <p>
                            <label for="name" class="cat_text_label">이름</label>
                            <input id="cat_name" type="text" class="cat_text" name="name" placeholder="이름" readOnly>
                        </p>
                        <p>
                            <label for="sex" class="cat_text_label">성별</label>
                            <input id="cat_sex" type="text" class="cat_text" name="sex" placeholder="성별" readOnly>
                        </p>
                        <p>
                            <label for="age" class="cat_text_label">나이</label>
                            <input id="cat_age" type="text" class="cat_text" name="age" placeholder="나이" readOnly>
                        </p>
                        <p>
                            <label for="desexualize" class="cat_text_label">중성화여부</label>
                            <input id="cat_desexualize" type="text" class="cat_text" name="desexualize" placeholder="중성화여부" readOnly>
                        </p>
                        <p>
                            <label for="state" class="cat_text_label">상태</label>
                            <input id="cat_state" type="text" class="cat_text" name="state" placeholder="상태" readOnly>
                        </p>
                        <p>
                            <label for="handling" class="cat_text_label">핸들링여부</label>
                            <input id="cat_handling" type="text" class="cat_text" name="handling" placeholder="핸들링여부" readOnly>
                        </p>
                        <p>
                            <label for="chart" class="cat_text_label">진료기록</label>
                            <input id="cat_chart" type="text" class="cat_text" name="chart" placeholder="진료기록" readOnly>
                        </p>
                        <p>
                            <label for="etc" class="cat_text_label">특이사항</label>
                            <input id="cat_etc" type="text" class="cat_text" name="etc" placeholder="특이사항" readOnly>
                        </p>
                        <p>
                        <label for="area" class="cat_text_label">영역</label>
                        <div class="cat_area">
                            <input type="checkbox" name="area" value="1">정하상관
                            <input type="checkbox" name="area" value="2">김대건관
                            <input type="checkbox" name="area" value="3">다산관
                            <input type="checkbox" name="area" value="4">하비에르관<br>
                            <input type="checkbox" name="area" value="5">토마스모어관
                            <input type="checkbox" name="area" value="6">가브리엘관
                            <input type="checkbox" name="area" value="7">곤자가 쓰레기장
                            <input type="checkbox" name="area" value="8">알바탑
                            </div>
                        </p>
                        <br><br><br>
                        <div id="buttonset">
                            <input type="submit" id="cat_info_button1" name="todo" id="deunglog" value="등록" onclick="todoo = this.value;">
                            <input type="button" id="cat_info_button2" value="수정" onclick="bewriten();">
                            <input type="submit" id="cat_info_button3" name="todo" value="삭제" onclick="todoo = this.value;">
                        </div>
                        <script>
                            if ('${right}' != '관리자') {
                                document.getElementById('buttonset').innerHTML = "";
                            }
                        </script>
                    </form>
                </div>
            </div>
        </div>`;
    },
    catcreate: `
    <html lang="en">
    <head>
      <!-- 사진 추가 화면 들어갈때 나오는 페이지 html코드  -->
        <meta charset="UTF-8">
        <link href="https://fonts.googleapis.com/css?family=Acme|Do+Hyeon|Jua|Permanent+Marker|Sniglet" rel="stylesheet">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
<link rel="stylesheet" href="css/cat.css">
       <script>
       function cerror(to_doo) {
        var fname = document.forms['cat_plus'];
        if(to_doo === '등록') {
            if(fname['name'].value.length < 1) { alert('이름 항목을 입력해주세요.'); return false; }
            if(fname['sex'].value.length < 1) { alert('성별 항목을 입력해주세요.'); return false; }
            if(fname['desexualize'].value.length < 1) { alert('중성화 여부를 입력해주세요.'); return false; }
            if(fname['state'].value.length < 1) { alert('상태를 입력해주세요.'); return false; }
            if(fname['handling'].value.length < 1) { alert('핸들링 여부를 입력해주세요.'); return false; }
            if(fname['uploaded_image1'].value.length < 1) { alert('이미지를 등록해주세요.'); return false; }
            if(fname['uploaded_image2'].value.length < 1) { alert('이미지를 등록해주세요.'); return false; }
            if(fname['uploaded_image3'].value.length < 1) { alert('이미지를 등록해주세요.'); return false; }
            var flag = 0;
            for(var i = 0;i < 8;i++) {
                if(fname['area'][i].checked == true) flag = 1;
            }
            if(!flag)  { alert('영역을 선택해주세요.'); return false; }

        return confirm('고양이를 등록하시겠습니까?');
        }

    }
    </script>
    </head>
    <body>
            <div class="create_cat">
            <div class="create_cat_caption">
            고양이 정보 추가
            </div>
                        <form method="post" action="/create_process" enctype="multipart/form-data" name="cat_plus" onsubmit="return cerror(to_doo)">
                            <div class="create_cat_label">
                                <div>
                                    <input type="text" class="create_cat_input"name="name" placeholder="이름">
                                </div>
                            </div>
                            <div class="create_cat_label">

                                <div>
                                    <input type="text"class="create_cat_input" name="sex" placeholder="성별">
                                </div>
                            </div>
                            <div class="create_cat_label">

                                <div>
                                    <input type="text" class="create_cat_input"name="age" placeholder="나이">
                                </div>
                            </div>
                            <div class="create_cat_label">

                                <div>
                                    <input type="text" class="create_cat_input" name="desexualize" placeholder="중성화여부">
                                </div>
                            </div>
                            <div>

                            <div class="create_cat_label">

                                <div>
                                    <input type="text" class="create_cat_input" name="handling" placeholder="핸들링여부">
                                </div>
                            </div>
                            <div class="create_cat_label">

                                <div>
                                    <input type="text" class="create_cat_input" name="state" placeholder="상태">
                                </div>
                            </div>
                            <div class="create_cat_label">

                                <div>
                                    <input type="text" class="create_cat_input" name="chart" placeholder="진료기록">
                                </div>
                            </div>
                        <div class="create_cat_label">

                            <div>
                                <input type="text" class="create_cat_input" name="etc" placeholder="특이사항">
                            </div>
                        </div>
                        <div class="create_cat_caption">
                        영역(급식소) 선택
                        </div>
                        <div class="create_cat_label">
                            <div class ="create_cat_area">
                                <input type="checkbox" name="area" value="1">정하상관
                                <input type="checkbox" name="area" value="2">김대건관
                                <input type="checkbox" name="area" value="3">다산관
                                <input type="checkbox" name="area" value="4">하비에르관<br>
                                <input type="checkbox" name="area" value="5">토마스모어관
                                <input type="checkbox" name="area" value="6">가브리엘관
                                <input type="checkbox" name="area" value="7">곤자가 쓰레기장
                                <input type="checkbox" name="area" value="8">알바탑
                            </div>
                        </div>
                        <div>
                            <label>사진은 3장 모두 추가해주세요!</label>
                        </div>
                    </div>
                    <div class="create_cat_image">
                        <div>
                            <input type="file" name="uploaded_image1" accept=""/>
                        </div>
                    </div>
                    <div class="create_cat_image">

                        <div>
                            <input type="file" name="uploaded_image2" accept=""/>
                        </div>
                    </div>
                    <div class="create_cat_image">

                        <div>
                            <input type="file" name="uploaded_image3" accept=""/>
                        </div>
                    </div>
                        <div>
                            <div>
                                <input type="submit" id="create_cat_register_submit" onclick="to_doo=this.value" value="등록">
                                <input type="button" id="create_cat_register_goback" onclick="location.href='/catinfo?area=1'" value="뒤로가기">
                            </div>
                        </div>
                    </form>
                </div>
    </body>
    </html>`
}
