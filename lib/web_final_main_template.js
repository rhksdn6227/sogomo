/*
1. wholepage - 22줄
    head 부분에는 script, style 문서를 가져와 준다.
    body 부분은 페이지의 메뉴부분과 인자로 받는 하단 페이지(page)로 구성되어 있다. 
    
    Parameter - page : 하단 페이지 내용 / record_list : 일지관련 페이지를 열 때, 특정 급식소의 일지 정보를 script의 kitchen_record 에 저장해놓음 / check : 로그인 했을 때, 권한이 있을 때의 페이지 변화를 함수로 구현하고 해당 함수를 권한에 맞춰 실행

2. mainpage - 70줄
    홈페이지의 첫 화면을 띄울 때, 임의의 고양이 사진을 불러온다.
    
    Parameter - imgs : 불러온 모든 고양이의 사진

3. loginpage - 77줄
    로그인을 위한 창
    폼태그로 아이디와 비밀번호를 넘겨줌

4. check - 86줄
    로그인시에 로그인 버튼을 로그아웃으로 바꾸고 폼태그를 걸어주는 함수
*/

module.exports = {
    wholepage: function (page, record_list, check) {
        return `
        <!DOCTYPE HTML>
        <html lang="en" dir="ltr">
        <head>
            <meta charset="UTF-8">
            <title>서강고양이모임</title>
            <script src="html_func.js"></script>
            <script>
            // 일지 작성 메인화면에서 일지 작성 페이지로 넘어가면서
            // 특정 급식소의 모든 일지 기록을 받아(record_list)와서
            // 전역변수(kitchen_record)에 저장을 해놓는다.
                var kitchen_record = ${record_list};
            // 일지 작성 현황을 보여줄 시간대 전역변수 값으로 디폴트는 첫시간
                var time = 1;
                
            </script>
            <script>
            </script>
            <link rel="stylesheet" href="css/main.css">
            <link rel="stylesheet" href="css/cat.css">
            <link rel="stylesheet" href="css/login.css">
            <link rel="stylesheet" href="css/menu.css">
            <link rel="stylesheet" href="css/record.css">
            <link href="https://fonts.googleapis.com/css?family=Acme|Do+Hyeon|Jua|Permanent+Marker|Sniglet" rel="stylesheet">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
            <script src="https://code.jquery.com/jquery-2.2.0.min.js"></script>
            <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script> 
            <script src="http://mattstow.com/experiment/responsive-image-maps/jquery.rwdImageMaps.min.js"></script> 

        </head>
        <body>
        <!-- 페이지의 상단 메뉴 부분 -->
            <div class="container">
                <div class="menu_container">
                    <div class="로고"><a href="/"><span id="so">SO</span><span id="go">GO</span><span id="mo">MO  </span><i class="fa fa-paw"></i>
                    </a></div>
                    <div class="기록일지"><a href="/ilji">기록일지</a></div>
                    <div class="고양이"><a id='black'href="/catinfo?area=1">고양이</a></div>
                    <div class="로그"><a id='log_inout' href='/login'>로그인</a></div>

                </div>
                <script>${check}</script>
            <!-- 하단의 급식소/영역 리스트와 내용을 보여줄 부분 -->
                <div class="page_container">${page}</div>
            </div>
        </body>
        </html>`;
    },
    mainpage: function (imgs) {
        var a = Math.floor(Math.random() * imgs.length);
        var b = Math.floor(Math.random() * 3);
        return `
        <img src="cat/${Object.values(imgs[a])[b]}" class="main_img">
        `
    },
    loginpage: `
    <form class="login" action="/login" method="post">
        <center>
            <input type="text" name="id" placeholder='아이디' align=center>
            <input type="password" name="password" placeholder=비밀번호 align=center>
            <input type="submit" value="로그인">
        </center>
    </form>`,
    managepage:`
    <form class="login" action="/user_manage" method="post" name="manager" onsubmit="return cherror(todoo)">
      <center>
        <select name="userid">
          <option value="admin">admin</option>
          <option value="butler">butler</option>
        </select>
        <input type="password" name="userpassword" placeholder="새 비밀번호" align=center>
        <input type="submit" value="변경" onclick="todoo = this.value">
      </center>
    </form>`,
    check: function(right) {
        return `
        function outout() {
            document.getElementsByClassName('로그')[0].innerHTML = 
            '<select onmouseover="this.size=this.options.length" onmouseout="this.size=1" onchange="if(this.value) window.location.href = this.value;" id="out_change"><option>내정보</option><option value="/user_manage">비밀번호변경</option><option value="/logout">로그아웃</option></select>';
        }
        if('${right}' == '관리자' || '${right}' == '집사') outout();`;
    },
    send_error:
        `
        <div><h1>404 error</h1></div>
        <div><h3>NOT FOUND</h3></div>
        <a href="/">홈으로</a>
        
        `,
    
}
