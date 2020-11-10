var express = require('express');
var app = express();
var mysql = require('mysql');
var bodyparser = require('body-parser');
var fs = require('fs');
var url = require('url');
var main_ = require('./lib/main_template.js');
var record_ = require('./lib/record_template.js');
var info_ = require('./lib/info_template.js');
var db = mysql.createConnection({
    host: '35.229.129.92',
    user: 'root',
    password: 'sogomo',
    database: 'sgcat'
});
db.connect();
var fc_list = [];
var diary_list = [];
var session = require('express-session');
var MySQLstore = require('express-mysql-session');
var crypto = require('crypto');
var multer = require('multer');

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(express.static(__dirname));
app.use(express.static("public"));
app.use(session({
    secret: 'so1&@go23##$mo564!!',
    resave: false,
    saveUninitialized: true,
    store: new MySQLstore({
        host: '35.229.129.92',
        user: 'root',
        password: 'sogomo',
        database: 'sgcat'
    })
}))
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'cat');
    },
    filename: function (req, file, cb) {
        cb(null, req.body.name + file.fieldname[file.fieldname.length - 1]);
    }
});
var upload = multer({
    storage: storage
});
var upload_img = upload.fields([{ name: 'uploaded_image1' }, { name: 'uploaded_image2' }, { name: 'uploaded_image3' }]);

//메인페이지 
app.get('/', function (req, res, next) {
    db.query(`SELECT img1,img2,img3 FROM cat_info`, function (err, img) {
        if (err) {
            next(err);
        }
        else {
            var imgs = JSON.parse(JSON.stringify(img));
            var subpage = main_.mainpage(imgs);
            var check = main_.check(req.session.displayName);
            var page = main_.wholepage(subpage, null, check);
            res.writeHead(200);
            res.end(page);
        }

    });
});

//로그인페이지
app.get('/login', function (req, res) {
    var subpage = main_.loginpage;
    var page = main_.wholepage(subpage);
    res.writeHead(200);
    res.end(page);
})
//로그인 성공하면 세션 저장하고 로그인된 채로 메인페이지로 redirect, 로그인 실패시 알림창 띄우고 다시 로그인 페이지로
app.post('/login', function (req, res, next) {
    var id = req.body.id;
    var pw = req.body.password;
    if (id && pw) {
        db.query(`SELECT * FROM user WHERE id='${id}' AND password='${pw}'`, function (err, result) {
            if (err) {
                next(err);
            }
            else {
                if (result[0]) {
                    req.session.displayName = result[0].name;
                    res.redirect('/');
                }
                else {
                    res.end(`
                    <!DOCTYPE HTML>
                    <html>
                    <head>
                        <meta charset="utf-8">
                        <script>
                            alert('ID 혹은 Password가 틀렸습니다.');
                            window.location.href = '/login';
                        </script>
                    </head>
                    </html>
                    `);
                }
            }

        });
    }
    else {
        res.end(`
            <!DOCTYPE HTML>
            <html>
	    <head>
		<meta charset="utf-8">
                <script>
                    alert('ID 혹은 Password를 입력해주세요.');
                    window.location.href = '/login';
                </script>
            </head>
            </html>
        `)
    }
});

// 로그아웃한다. 로그아웃 후 메인페이지로 redirect
app.get('/logout', function (req, res) {
    delete req.session.displayName;
    req.session.save(function () {
        res.redirect('/');
    })
})

// 급식일지페이지로. 로그인 되어 있지 않다면 알림창 띄우고 메인페이지로 redirect. 로그인 돼있으면 
app.get('/ilji', function (req, res, next) {
    if (req.session.displayName === undefined) {
        res.end(`
            <!DOCTYPE HTML>
            <html lang="" dir="ltr">
            <head><meta charset="utf-8"></head>
            <body>
                <script>
                    alert('권한이 없습니다!');
                    window.location.href="/";
                </script>
            </body>
            </html>
        `);
    }
    else {
        db.query(`SELECT * FROM foodcenter`, function (err, fc) {
            if (err) {
                next(err);
            }
            else {
                fc_list = fc.slice();
                var queryid = req.query.id;
                var queryyear = req.query.year;
                var querymonth = req.query.month;
                if (queryid === undefined) {
                    var map = record_.map_link();
                    var subpage = record_.iljipage(fc_list, map);
                    var check = main_.check(req.session.displayName);
                    var page = main_.wholepage(subpage, diary_list, check);
                    res.writeHead(200);
                    res.end(page);
                }
                else {
                    db.query(`SELECT * FROM diary WHERE fc='${queryid}'`, function (err, diary) {
                        if (err) {
                            next(err);
                        }
                        else {
                            diary_list = JSON.stringify(diary);
                            var today = new Date(queryyear, querymonth - 1, 1);
                            var cal = record_.calendar(today, queryid);
                            var subpage = record_.iljipage(fc_list, cal, queryid);
                            var check = main_.check(req.session.displayName);
                            var page = main_.wholepage(subpage, diary_list, check);
                            res.writeHead(200);
                            res.end(page);

                        }
                    });
                }
            }

        });
    }
});

app.post('/ilji_write', function (req, res, next) {
    var food = req.body.foodbox;
    var water = req.body.waterbox;
    var weather = req.body.weatherbox;
    var note = req.body.notebox;
    var manager = req.body.managerbox;
    var day = req.body.day;
    var time = req.body.time;
    var fc = req.body.fc;
    var todo = req.body.todo;
    var year = parseInt(day.slice(0, 4));
    var month = parseInt(day.slice(5, 7));
    db.query(`SELECT * FROM diary WHERE day='${day}' AND time=${time} AND fc=${fc}`, function (err, result) {
        if (err) {
            next(err);
        }
        else {
            if (todo === '등록') {
                if (result.length === 0) {
                    db.query(`INSERT INTO diary VALUES(NULL, '${food}','${water}','${weather}','${note}','${manager}','${day}','${time}','${fc}')`, function (error, result2) {
                        if (err) {
                            next(err);
                        }
                        else {
                            console.log("Record TABLE 1 data UPLOAD!");
                            res.redirect(`/ilji?id=${fc}&year=${year}&month=${month}`);
                        }

                    });
                }
                else {
                    db.query(`UPDATE diary SET food='${food}', water='${water}', weather='${weather}', note='${note}', manager='${manager}' WHERE id='${result[0].id}'`, function (err, result2) {
                        if (err) {
                            next(err);
                        }
                        else {
                            console.log("Record TABLE 1 data MODIFY!");

                            res.redirect(`/ilji?id=${fc}&year=${year}&month=${month}`);
                        }
                    });
                }
            }
            else {
                db.query(`DELETE FROM diary WHERE id=${result[0].id}`, function (err, result2) {
                    if (err) {
                        next(err);
                    }
                    else {
                        console.log("Delete!!");
                        res.redirect(`/ilji?id=${fc}&year=${year}&month=${month}`);
                    }
                });
            }
        }
    });
});

app.get('/catinfo', function (req, res, next) {
    db.query(`SELECT * FROM foodcenter`, function (err, fc) {
        if (err) {
            next(err);
        }
        else {
            fc_list = fc.slice();
            var query = url.parse(req.url, true).query;
            var area = query.area;
            db.query(`SELECT * FROM cat_info left JOIN foodcenter_cat ON cat_info.name=foodcenter_cat.cat where foodcenter_cat.fc=${area}`, function (err2, cats) {
                if (err) {
                    next(err);
                }
                else {
                    db.query(`SELECT * FROM foodcenter_cat`, function (err, fc_cat) {
                        if (err) {
                            next(err);
                        }
                        else {
                            var cats_area = JSON.parse(JSON.stringify(fc_cat));
                            var cats_list = JSON.parse(JSON.stringify(cats));
                            var cats_info = info_.catList(cats);
                            var cat_modal = info_.catmodal(cats_list, cats_area, req.session.displayName);
                            var subpage = info_.infopage(fc_list, cats_info, cat_modal, area);
                            var check = main_.check(req.session.displayName);
                            var page = main_.wholepage(subpage, null, check);
                            res.writeHead(200);
                            res.end(page);
                        }
                    })
                }
            });
        }
    });
});

app.get('/info_create', function (request, response) {
    if (request.session.displayName != '관리자') {
        response.end(`
            <!DOCTYPE html>
            <html lang="" dir="ltr">
            <head><meta charset="utf-8"></head>
            <body>
                <script>
                    alert('권한이 없습니다!');
                    window.location.href="/catinfo?area=1";
                </script>
            </body>
            </html>
        `);
    }
    else {
        var html = info_.catcreate;
        response.writeHead(200);
        response.end(html);
    }
});

app.post('/create_process', upload_img, function (req, res, next) {
    message = '';
    var post = req.body;
    var name = post.name;
    var sex = post.sex;
    var age = post.age;
    var desexualize = post.desexualize;
    var state = post.state;
    var handling = post.handling;
    var chart = post.chart;
    var etc = post.etc;
    var area = post.area;
    if (!req.files)
        return res.status(400).send('No files were uploaded.');

    var img_name1 = name + 1;
    var img_name2 = name + 2;
    var img_name3 = name + 3;
    db.query(`insert into cat_info values('${name}','${sex}','${age}','${handling}','${img_name1}','${img_name2}','${img_name3}','${desexualize}','${state}','${chart}','${etc}')`, function (err, result) {
        if (err) {
            next(err);
        }
        else {
            var querystring = `INSERT INTO foodcenter_cat VALUES('${area[0]}', '${name}')`;
            for (var i = 1; i < area.length; i++) {
                querystring += `, ('${area[i]}', '${name}')`;
            }
            querystring += `;`;
            db.query(querystring, function (err, result) {
                if(err){
                    next(err);
                }
                else{
                    res.redirect(`/catinfo?area=${area[0]}`);
                }
            });
        }
    });
});

app.post('/cat_write', function (req, res, next) {
    var name = req.body.name;
    var sex = req.body.sex;
    var age = req.body.age;
    var desexualize = req.body.desexualize;
    var state = req.body.state;
    var handling = req.body.handling;
    var chart = req.body.chart;
    var bfname = req.body.bfname;
    var etc = req.body.etc;
    var todo = req.body.todo;
    var area = req.body.area;
    if (todo === '등록') {
        db.query(`update cat_info set name='${name}',sex='${sex}',age='${age}',desexualize='${desexualize}',state='${state}',handling='${handling}',chart='${chart}', etc='${etc}' where name='${bfname}'`, function (err, result) {
            if (err) {
                next(err);
            }
            else {
                db.query(`delete from foodcenter_cat where cat="${bfname}"`, function (error, result) {
                    if (err) {
                        next(err);
                    }
                    else {
                        var querystring = `insert into foodcenter_cat values('${area[0]}', '${name}')`;
                        for (var i = 1; i < area.length; i++) {
                            querystring += `, ('${area[i]}', '${name}')`;
                        }
                        querystring += ';';
                        db.query(querystring, function (err, result) {
                            if (err) {
                                next(err);
                            }
                            else {
                                res.redirect(`/catinfo?area=${area[0]}`);
                            }
                        })
                    }
                })
            }
        });
    }
    else if (todo === '삭제') {
        db.query(`SELECT img1,img2,img3 FROM cat_info WHERE name='${bfname}'`, function (err, catresult) {
            if (err) {
                next(err);
            }
            else {
                fs.unlink(`./cat/${catresult[0].img1}`, function (err) {
                    fs.unlink(`./cat/${catresult[0].img2}`, function (err) {
                        fs.unlink(`./cat/${catresult[0].img3}`, function (err) {

                        });
                    });
                });
            }
        });
        db.query(`DELETE FROM cat_info WHERE name='${bfname}'`, function (err, result) {
            if (err) {
                next(err);
            }
            else {
                db.query(`delete from foodcenter_cat where cat='${bfname}'`, function (error, result) {
                    if (err) {
                        next(err);
                    }
                    else {
                        res.redirect(`/catinfo?area=1`);
                    }
                });
            }
        });
    }
});

//관리자 페이지
app.get('/user_manage', function (request, response) {
    if (request.session.displayName != '관리자') {
        response.end(`
            <!DOCTYPE html>
            <html lang="" dir="ltr">
            <head><meta charset="utf-8"></head>
            <body>
                <script>
                    alert('권한이 없습니다!');
                    window.location.href="/";
                </script>
            </body>
            </html>
        `);
    }
    else {
        var subpage = main_.managepage;
        var check = main_.check(request.session.displayName);
        var page = main_.wholepage(subpage, null, check);
        response.writeHead(200);
        response.end(page);
    }
});


app.post('/user_manage', function (request, response, next) {
    var userid = request.body.userid;
    var userpassword = request.body.userpassword;
    db.query(`update user set password=${userpassword} where id='${userid}'`, function (err, result) {
        if (err) {
            next(err);
        }
        else {
            response.redirect('/');
        }
    });
});
app.use(function (req, res, next) {
    var sub = main_.send_error;
    var check = main_.check(req.session.displayName);
    var page = main_.wholepage(sub, null, check);
    res.status(404).send(page);
})
app.use(function (err, req, res, next) {
    var sub = main_.send_error;
    var check = main_.check(req.session.displayName);
    var page = main_.wholepage(sub, null, check);
    res.status(500).send(page);
})
app.listen(3000, function () {
    console.log('Connected complete www.sogomo.com');
})
