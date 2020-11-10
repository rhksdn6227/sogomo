/*
1. iljipage - 20줄
    /ilji 로 접속했을 때, 좌측에는 리스트를, 우측에는 지도 또는 달력을 띄우는 함수

    Parameter - list : 모든 급식소 리스트를 받아온다 / content : 우측에 들어갈 지도 또는 달력이 들어간다.

2. map_link - 37줄
    /ilji 로 최초에 접속했을 때, 우측에 들어갈 지도를 띄워주는 함수
    급식소와 연결되는 지도의 부분에 링크를 걸어준다.

3. calendar - 57줄
    일지에서 특정 급식소를 눌렀을 때, 우측에 들어갈 달력을 띄워주는 함수
    디폴트 값은 현재 날짜 기준으로 달력이 생성되고 이후에 달력을 이동할 땐 이동한 달 기준으로 달력이 생성됨 - today 파라미터와 관련
    달력을 눌렀을 때 띄울 팝업창의 코드도 포함되어 있음

    Parameter - today : 달력에 보여줄 기준 날 / kitchen : 급식소 번호
*/

module.exports = {
    iljipage: function (list, content, fcid) {
        // 특정 급식소의 일지화면으로 링크를 보낼 때, 디폴트로 현재의 년도와 달을 보낸다.
        // 2019.02.24 라면 year는 2019, month는 2가 가는데 date에서 month부분은 0부터 시작하므로 추후에 처리해줘야 함
        var year = new Date().getFullYear();
        var month = new Date().getMonth() + 1;
        // subpage의 좌측 리스트가 담기는 페이지
        var page = `<div class="page1"><ul>`;
        // mysql 로 부터 받아온 급식소 리스트를 ul li 태그로 나열한다.
        // 리스트 중 하나를 선택했을 때, address/ilji?id=1~8&year=2019&month=2 이렇게 링크가 걸린다.
        for (var i in list) {
            page += `<li class="menu">
                        <a id=${Number(i)+1} href="/ilji?id=${list[i].id}&year=${year}&month=${month}">${list[i].name}</a>
                    </li>`;
        }
        page += `</ul></div>
        <script>
            var x = document.getElementById("${fcid}");
            x.classList.add('active');
        </script>`;
        // 우측의 내용이 담기는 페이지
        page += `<div class="page2">${content}</div>`;
        return page;
    },
    map_link: function () {
        // 일지의 메인 페이지에서 지도의 특정 급식소 부분을 눌렀을 때, 링크가 걸리도록 작업을 해줌
        // year와 month 는 iljipage 함수와 동일
        var year = new Date().getFullYear();
        var month = new Date().getMonth() + 1;
        var content = `
        <img src='map.jpg' style="width: 100%" usemap='#kitchen_map' id="kit_map"></img>
        <map name="kitchen_map" id="map_tag">
            <area shape="CIRCLE" coords= "850,400,100" href="/ilji?id=1&year=2019&month=3"/>
            <area shape="CIRCLE" coords= "1300,1450,100" href="/ilji?id=2&year=2019&month=3"/>
            <area shape="CIRCLE" coords= "2200,860,100" href="/ilji?id=3&year=2019&month=3"/>
            <area shape="CIRCLE" coords= "315,515,100" href="/ilji?id=4&year=2019&month=3"/>
            <area shape="CIRCLE" coords= "1900,1650,100" href="/ilji?id=5&year=2019&month=3"/>
            <area shape="CIRCLE" coords= "1330,220,100" href="/ilji?id=6&year=2019&month=3"/>
            <area shape="CIRCLE" coords= "1150,2000,100" href="/ilji?id=7&year=2019&month=3"/>
            <area shape="CIRCLE" coords= "700,550,100" href="/ilji?id=8&year=2019&month=3"/>
        </map>
        <script>
        $(document).ready(function(e){
            $('img[usemap]').rwdImageMaps();

        });

        </script>
`;

        
        return content;
    },
    calendar: function (today, kitchen) {
        // 달력부분을 출력해주는 함수
        // 달력의 상단에 요일을 적기 위한 배열
        var week = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

        // 순서대로  현재 년도 / 현재 달 / 전달의 년도 / 전 달 / 다음달의 년도 / 다음 달
        var this_year = today.getFullYear();
        var this_month = today.getMonth() + 1;
        var pre_year = this_year;
        var pre_month = this_month - 1;
        if (pre_month === 0) {
            pre_month = 12; pre_year -= 1;
        }
        var next_year = this_year;
        var next_month = this_month + 1;
        if (next_month === 13) {
            next_month = 1; next_year += 1;
        }

        // 순서대로  현재 달의 시작 요일 / 전달의 마지막 날짜 / 현재 달력에서 시작하는 날짜 / 현재 달의 마지막 날
        // 현재달의 date 객체를 만들기위해서는 인덱스를 0부터 해야하므로 1빼줌
        var this_day = (new Date(this_year, this_month - 1, 1)).getDay();
        var pre_date = (new Date(pre_year, pre_month, 0)).getDate();
        var start_date = pre_date - this_day + 1;
        var last_date = (new Date(this_year, this_month, 0)).getDate();
        // 현재 작성하는 달력의 칸이 현재달인지 체크해주는 변수 0이면 지난달, 1이면 현재달, 2이면 다음달
        var flag = 0;
        // 달력에서 현재달에 해당하는 부분들에만 cal_day_cell_num형태로 아이디를 보내주기 위한 변수
        var cell_num = 1;
        //calendar:전체달력 dalselect:맨위에 버튼 년월일버튼기타등등
        var content = `
        <div id="calendar">
            <div id="dalselect">
            <!-- 달력을 이동하기 위한 좌 우 버튼 각각 링크가 걸려있음 -->
                <div>
                    <a href="/ilji?id=${kitchen}&year=${pre_year}&month=${pre_month}">
                        <input type="button" class="ccbutton" value="\<">
                    </a>
                </div>
                <div id="cal_year_month">${this_year}년 ${this_month}월</div>

                <div>
                    <a href="/ilji?id=${kitchen}&year=${next_year}&month=${next_month}">
                        <input type="button" class="ccbutton" value="\>">
                    </a>
                </div>
            </div>
        `;

        var count = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
        var cnt = 0;
        content += `<br>`

        for (var i = 0; i < 7; i++) {
            //한 줄
            content += `<br><br><br><div class="ju">`
            for (var j = 0; j < 7; j++) {
                //한 칸
                if (cnt < 7){
                    content += `<div class="il" id="${count[cnt]}">`
                    cnt++;
                }
                else{
                    content += `<div class="il">`

                }
                if (!i) {
                    content += week[j] + `</div>`;
                }
                else {
                    // 만약 현재 달력의 현재 셀에 작성할 날짜의 값이 지난달의 마지막 날을 지났다면
                    // flag를 1로 바꾸고 작성할 날짜의 값을 1일로 설정
                    if (flag == 0 && start_date > pre_date) {
                        flag = 1; start_date = 1;
                    }
                    // 만약 현재 달력의 현재 셀에 작성할 날짜의 값이 현재달의 마지막 날을 지났다면
                    // flag를 2로 바꾸고 작성할 날짜의 값을 1일로 설정
                    if (flag == 1 && start_date > last_date) {
                        flag = 2; start_date = 1;
                    }
                    // 현재 달력의 각 셀을 버튼형식으로 만든다.
                    // 현재 달의 날짜에 해당하는 셀을 눌렀을 때,
                    // 팝업창이 켜지고 해당하는 날의 첫번째 시간대의 기록이 나온다.
                    content += `
                        <input class="nal" type=button value=${start_date} id="cal_day_${cell_num}" onclick="
                            document.getElementById('record_box').style.display = 'block';
                            var inner = document.getElementById('month_day').innerHTML = '${this_year}년 ${this_month}월 ${start_date}일';
                            var info = show(kitchen_record, inner, 1); 
                            change(info);">
                        </div>
                        <script>
                            $(".nal").click(function(){
                                $('#selected1').addClass('selected_time').siblings().removeClass('selected_time');
                            })
                        </script>
                    `
                        //1->지금달 0->전달 2->다음달
                    if (flag == 1) {
                        var month = String(this_month);
                        var date = String(start_date);
                        if (month.length === 1) month = '0' + month;
                        if (date.length == 1) date = '0' + date;
                        content += `
                        <script>
                            var dal = document.getElementById("cal_day_${cell_num}");
                            dal.classList.add('thisdal');
                            dal.addEventListener('click', function() {
                                document.getElementById('day_box').value = '${this_year}-${month}-${date}';
                            });
                        </script>`
                    }
                    else {
                        content += `
                        <script>
                            var dal = document.getElementById("cal_day_${cell_num}");
                            dal.classList.add('otherdal');
                            document.getElementById('cal_day_${cell_num}').disabled = true;
                        </script>
                        `
                    }
                    start_date++;
                    cell_num++;
                }
            }
            content += '</div>';

        }


        //팝업창을 구성
        content += `
        </div>
        <div id="record_box">
            <div id="month_day">${this_year}-${this_month}-1</div>
            <div id="popupbutton">`;
        for (var i = 1; i < 5; i++) {
            content += `
            <button class="popupbutton" id="selected${i}" onclick="
                var tdinfo = document.getElementById('month_day').innerHTML; 
                var info = show(kitchen_record, tdinfo,${i}); 

                change(info); 
                time = ${i}; 
                document.getElementById('time_box').value = ${i};
                ">${i}
            </button>`;
        }

        content += `
            </div>
            <script>
                $(".popupbutton").click(function(){
                    $(this).addClass('selected_time').siblings().removeClass('selected_time');
                })
            </script>
            <form action="/ilji_write" name="iljiwrite" method="post" onsubmit="return ilji_error(to_do)">
                <div >
                    <div class="recording">밥 : </div>
                    <div class="answer">
                        <input type="text" id="food_box" name="foodbox" placeholder="100% / 80 % / 50%">
                    </div>
                </div>
                <div >
                    <div class="recording">물 : </div>
                    <div class="answer">
                        <input type="text" id="water_box" name="waterbox" placeholder="100% / 80 % / 50%">
                    </div>
                </div>
                <div >
                    <div class="recording">날씨 : </div>
                    <div class="answer">
                        <input type="text" id="weather_box" name="weatherbox" placeholder="sunny / windy / rainy">
                    </div>
                </div>
                <div >
                    <div class="recording">특이사항 : </div>
                    <div class="answer">
                        <input type="text" id="note_box" name="notebox" placeholder="벌레가 많음 / 시끄러움">
                    </div>
                </div>
                <div >
                    <div class="recording">담당자 : </div>
                    <div class="answer">
                        <input type="text" id="manager_box" name="managerbox" placeholder="이기현 / 장주호">
                    </div>
                </div>

                <input type="hidden" id="day_box" name="day">
                <input type="hidden" id="time_box" name="time" value="1">
                <input type="hidden" id="fc_box" name="fc" value="">
                <script>
                    document.getElementById('fc_box').value = ${kitchen};
                </script>

                <div>
                    <div class='popupsubmit'>
                        <input type="submit" name="todo" value="등록" onclick="to_do=this.value">
                    </div>
                    <div class='popupsubmit'>
                        <input type="button" onclick="beWrite();" value="수정">
                    </div>
                    <div class='popupsubmit'>
                        <input type="submit" name="todo" value="삭제" onclick="to_do=this.value">
                    </div>
                    <div class='popupsubmit'>
                        <input type="button" value="취소" onclick="document.getElementById('record_box').style.display = 'none'; ">
                    </div>
                </div>
            </form>
        </div>`;
        return content;
    }
}