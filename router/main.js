module.exports = function(app, io) {
    var mysql = require('mysql');
    var config = require('../config');
    var connection = mysql.createConnection(config);
    connection.connect();
    // 일정한 시간마다 의미없는 쿼리문을 보내서 연결을 유지시킨다.
    setInterval(() => {
        connection.query('SELECT 1');
    }, 5000);

    /*
    function getData(){
        return new Promise({
            
        });
    }

    getData()
    .then(function(data){
        
    })
    */
    app.get('/', (req, res) => {
        if (req.session.user) {
            console.log(typeof(req.session.user));
            console.log('it has req.session.user');
            res.render('user.ejs', {
                Id: req.session.user.Id
            });
        } else {
            res.redirect('/login');
        }
    });

    app.get('/login', (req, res) => {
        res.render('login.ejs');
    });

    app.post('/login', (req, res) => {
        var id = req.body.username;
        var pw = req.body.password;
        var session = req.session;
        console.log('this is login post select');
        connection.query('SELECT * FROM student WHERE Stuid = ?', [id],
            (error, results, fields) => {
                if (error) {
                    console.log(error);
                    res.send({
                        "code": 400,
                        "failed": "error ocurred"
                    })
                } else {
                    if (results.length > 0) {
                        //console.log(results[0].StuPw);

                        if (results[0].StuPw == pw) {
                            session.user = {
                                "Id": results[0].StuId,
                                "age": 25,
                            }
                            res.redirect('/');

                        } else {
                            res.send({
                                "code": 204,
                                "success": "id and password does not match"
                            });
                        }
                    } else {
                        res.send({
                            "code": 204,
                            "success": "Id does not exists"
                        });
                    }
                }
            })
    });

    app.post('/process/nfc', (req, res) => {
        var tag = req.body.NFCNumber;
        var i;
        var tagdata;
        var sql;
        for (i = 0; i < tag.length; i++) {
            if (tag.length != 13)
                tagdata += tag[i] + ' ';
        }
        tagdata = ('"' + tagdata + '"').replace('undefined', '');
        //sql = `SELECT * FROM student WHERE NFCNumber = ${tagdata}`;
        console.log(tagdata);
        connection.query(`SELECT * FROM student WHERE NFCNumber = ${tagdata}`, (error, results, fields) => {
            console.log('this is query');
            console.log(results);
            if (error) {
                console.log(error);
                res.send({
                    "code": 400,
                    "failed": "error ocurred"
                });
            } else {
                if (results.length > 0) {
                    console.log('정상처리 되었습니다.');
                    res.send('OK');
                } else {
                    res.send('OK');
                    //res.send('unknowned data');
                }
            }
        })
    });

    app.post('/deleteuser', (req, res) => {
        var name = req.body.Stuid;
        connection.query('DELETE FROM student WHERE Stuid =?', name);
        res.redirect('/admin');
    });

    app.get('/logout', (req, res) => {
        delete req.session;
        res.redirect('/login')
    });

    app.post('/adduser', (req, res) => {
        var name = req.body.username;
        //var id = req.body.Id;
        var StuId = req.body.StuId;
        var pw = req.body.password;
        var cpw = req.body.confirm_password;
        var room_number = req.body.room_number;
        var sql;

        name = '"' + name + '"';
        StuId = '"' + StuId + '"';
        pw = '"' + pw + '"';
        room_number = '"' + room_number + '"';
        if (name && pw && cpw && room_number) {
            sql = `INSERT INTO student (이름, StuId, StuPw, 기숙사방) VALUES(${name}, ${StuId}, ${pw}, ${room_number})`;
            connection.query(sql,
                (error, results, fields) => {
                    if (error) {
                        console.log(error);
                        res.send({
                            "code": 400,
                            "failed": "error ocurred"
                        });
                    } else {
                        res.redirect('/admin');
                    }

                });
        } else {
            console.log('입력하지 않은 부분이 있습니다. 모두 입력하여 주세요');
            res.redirect('/admin');
        }
    });

    io.on('connection', (socket) => {
        console.log('io connected');
        connection.query('SELECT * FROM student',
            (error, results, fields) => {
                if (error) {
                    console.log(error);
                    res.send({
                        "code": 400,
                        "failed": "error ocurred"
                    });
                } else {
                    io.emit('data', results);
                }
            });

        connection.query('SELECT * FROM sit_stat', (error, results, fields) => {
            var sit_data;
            if (error) {
                console.log(error);
                res.send({
                    "code": 400,
                    "failed": "error ocurred"
                });
            } else {
                sit_data = JSON.parse(JSON.stringify(results));
                console.log(sit_data);
                socket.emit('sit_data', sit_data);
            }
        });

        socket.on('send_status', (button_id) => {
            if (button_id) {
                if (button_id == "퇴실") {
                    console.log('퇴실 처리 구현 요망');
                } else {
                    var sql = "UPDATE sit_stat set sit_status = " + button_id + " where id = " + button_id;
                    //var sql = `UPDATE sit_stat set sit_status = ${button_id} where id = " + button_id`
                    console.log(sql);
                    connection.query(sql, (error, results, fields) => {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log(results);
                        }
                    });
                }
            }
        });
    });

    app.get('/admin', (req, res) => {
        res.render('admin.ejs');
    });

    //const io = require('socket.io')(server);
    app.get('/munhak', (req, res) => {
        res.render('munhaksil.html');
    });
}