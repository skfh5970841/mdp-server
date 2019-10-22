module.exports = function(app, io) {
    //
    //proccessing
    /*io.on('connection', (socket) => {
        socket.on('select_data', (data) => {
            console.log('Message from Client: ' + data);
        });
    });*/

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
    /*
    app.post('/process/nfc',function(req,res){
        var msg=req.body.msg;
        console.log("python: " + msg);
    });
     */
    app.post('/process/nfc', (req, res) => {
        var tag = req.body.NFCNumber;
        var session = req.session;
        var i;
        var tagdata;
        var sql = `SELECT * FROM student WHERE NFCNumber = ${tag}`;
        console.log(typeof(tag));
        console.log("python: " + tag);
        /*for (i = 0; i < tag.length; i+2) {
            tagdata += tag[i] + tag' ';
        }*/
        //console.log(tagdata);
        tag = '"' + tag + '"';
        var sql = `SELECT * FROM student WHERE NFCNumber = ${tag}`;

        connection.query( /*'SELECT * FROM student WHERE NFCNumber = ?', [tag]*/ sql,
            (error, results, fields) => {
                if (error) {
                    console.log(error);
                    res.send({
                        "code": 400,
                        "failed": "error ocurred"
                    });
                } else {
                    //res.send(tag);
                    // console.log('The solution is: ', results);
                    if (results.length > 0) {
                        console.log('정상처리 되었습니다.');
                        res.send('OK');
                    } else {
                        res.send('unknowned data');
                    }
                }
            })
    });

    app.get('/process/nfc', (req, res) => {
        console.log('process/nfc get');
        res.send(req.session.tag);
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
        var id = req.body.Id;
        var Stuid = req.body.Stuid;
        var pw = req.body.password;
        var cpw = req.body.confirm_password;
        var email = req.body.email;
        //쿼리문 입력하기
        if (name && id && pw && cpw && email) {
            console.log(name + ' ' + id + ' ' + pw + ' ' + cpw + ' ' + email + '모든 정보가 입력되었습니다.');
            connection.query('INSERT INTO student (id, StuId, StuPw, 이름) VALUES ("' + id + '", "' + Stuid + '", "' + pw + '", "' + name + '")',
                (error, results, fields) => {
                    if (error) {
                        //console.log(error);
                        res.send({
                            "code": 400,
                            "failed": "error ocurred"
                        });
                    } else {
                        console.log()
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
                    //console.log(results);
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
            console.log(button_id);
            //update sit_stat set sit_status 1 where id = 1;
            if (button_id) {
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