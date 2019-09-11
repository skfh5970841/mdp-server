module.exports = function(app, fs, io) {

    var mysql = require('mysql');
    var config = require('../config');
    var connection = mysql.createConnection(config);
    connection.connect();
    // 일정한 시간마다 의미없는 쿼리문을 보내서 연결을 유지시킨다.
    setInterval(() => {
        connection.query('SELECT 1');
    }, 5000);

    app.get('/', (req, res) => {
        if (req.session.user) {
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
        var tag = req.body.NFCnumber;
        var session = req.session;
        console.log("python: " + tag);

        connection.query('SELECT * FROM student WHERE NFCNumber = ?', [tag],
            (error, results, fields) => {
                if (error) {
                    console.log(error);
                    res.send({
                        "code": 400,
                        "failed": "error ocurred"
                    })
                } else {
                    res.send(tag);
                    session.nfc = {
                            "nfc": tag
                        }
                        // console.log('The solution is: ', results);
                    if (results.length > 0) {
                        if (results[0].NFCNumber == tag) {
                            console.log('정상처리 되었습니다.');
                            res.send('OK');
                        } else {
                            console.log('없는 데이터입니다..');
                            //return '없는 데이터입니다.'
                        }
                    } else {
                        console.log('유효하지 않은 데이터입니다.');
                        //return '유효하지 않은 데이터입니다.'
                    }

                }
            })
    });

    app.get('/process/nfc', (req, res) => {
        console.log('process/nfc get');
        res.send(req.session.tag);
    });

    app.post('/deleteuser', (req, res) => {
        var name = req.body.username;
        connection.query('DELETE FROM student WHERE Stuid = ?', [name]);
    });

    app.get('/logout', (req, res) => {
        delete req.session;
        res.redirect('/login')
    });

    app.get('/t', (req, res) => {
        res.render('t.ejs', { Id: 'sa' });
    });

    app.post('/adduser', (req, res) => {
        var name = req.body.username;
        var id = req.body.Id;
        var pw = req.body.password;
        var cpw = req.body.confirm_password;
        var email = reeq.body.email;

        if (name && id && pw && cpw && email) {
            alert('모든 정보가 입력되었습니다.');

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

                });
        } else {
            alert('입력하지 않은 부분이 있습니다. 모두 입력하여 주세요');
            res.redirect('/admin');
        }
    });

    //정보전달
    /*app.post('/admin', (req, res)=>{
        //var sql = 'SELECT * FROM student';
        var session = req.session;
        connection.query('SELECT * FROM student',
            (error, results, fields) =>{
                if(error){
                    alert('error occured, please try again');
                    res.redirect('/admin');
                }
                else {
                    console.log(results);
                    //session information = {results};
                }
            });
        res.redirect('/admin');
    });*/
    app.get('/admin', (req, res) => {
        console.log('this is /admin get');
        if (req.session.select) {
            console.log(res.session.select);
            res.redirect('admin2');
        } else res.render('admin.ejs');
    });

    //반 선택
    /*
    app.post('/admin', (req, res)=>{
        var classname = req.body.classname;
        var select;
        var session = req.session;
        console.log('this is /admin post');
        console.log('kickckckckckckckckckckckck');
        console.log(classname);
        switch (classname) {
            case "ec1": select = 1;
            break;
            case "ec2": select = 2;
            break;
            case "ec3": select = 3;
            break;
            case "ecd1": select = 4;
            break;
            case "ecd2": select = 5;
            break;
            case "ecd3": select = 6;
            break;
            case "ice1": select = 7;
            break;
            case "ice2": select = 8;
            break;    
            default: res.send('wrong input data');
            //res.redirect('/admin');
            break;    
        }
        console.log(select);
        if(select != null)
        {
            session.select = {
                "select" : select,
            }
        }
    });*/

    // processing!!!!!
    /*
    app.post('/admin', (req, res)=>{
    var classname = req.body.classname;
    var session = req.session;
    console.log('this is admin post select');
    console.log(classname);
    
    connection.query('SELECT * FROM student WHERE Stuid = ?', [id],
        (error, results, fields) =>{
            if (error) 
            {
                console.log(error);
                res.send({
                    "code": 400,
                    "failed": "error ocurred"
                })
            } else {
                if(results.length > 0) {
                    //console.log(results[0].StuPw);

                    if(results[0].StuPw == pw) {
                       session.user = {
                        "Id" : results[0].StuId,
                        "age" : 25,
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
                    "code":204,
                    "success": "Id does not exists"
                });
            }
        }    
    })
});*/

    /*
    const io = require('socket.io')(server);
    io.on('connection', (socket) => {

        socket.on('login', function(data) {
            console.log('Client logged-in:\n name:' + data.name + '\n userid: ' + data.userid);

            // socket에 클라이언트 정보를 저장한다
            socket.name = data.name;
            socket.userid = data.userid;

            // 접속된 모든 클라이언트에게 메시지를 전송한다
            io.emit('login', data.name);
        });

        // 클라이언트로부터의 메시지가 수신되면
        socket.on('chat', function(data) {
            console.log('Message from %s: %s', socket.name, data.msg);

            var msg = {
                from: {
                    name: socket.name,
                    userid: socket.userid
                },
                msg: data.msg
            };

            // 메시지를 전송한 클라이언트를 제외한 모든 클라이언트에게 메시지를 전송한다
            socket.broadcast.emit('chat', msg);

            // 메시지를 전송한 클라이언트에게만 메시지를 전송한다
            // socket.emit('s2c chat', msg);

            // 접속된 모든 클라이언트에게 메시지를 전송한다
            // io.emit('s2c chat', msg);

            // 특정 클라이언트에게만 메시지를 전송한다
            // io.to(id).emit('s2c chat', data);
        });
    })*/

}