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
                        if (results[0].StuPw == pw) {
                            console.log(results[0].admin);
                            session.user = {
                                "Id": results[0].StuId,
                                "admin": results[0].admin,
                                "nid": results[0].id,
                            }
                            connection.query(`update login_inform set con_user_id=${"'" + results[0].StuId + "'"} where id = 1`);
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

    app.get('/write_board', (req, res) => {
        res.render('write_board.html');
    });

    app.get('/board/:id', (req, res) => {
        connection.query(`select * from board where id = ${req.params.id}`, (error, results, field) => {
            var jsondata = JSON.stringify(results);
            var padata = JSON.parse(jsondata);
            var session = req.session;

            session.board_inform = {
                "id": req.params.id,
                /*"userid": padata[0].userid,*/
                "board_name": padata[0].board_name,
                "board": padata[0].board,
                /*"datetime": padata[0].datetime*/
            }

            res.render('board_confirm.ejs', {
                id: req.params.id,
                userid: padata[0].userid,
                board_name: padata[0].board_name,
                board: padata[0].board,
                datetime: padata[0].datetime
            });

        })
    });

    app.get('/error', (req, res) => {
        res.render('error.html');
    });

    app.get('/deleteboard/:id/:userid', (req, res) => {
        var sql = `delete from board where id = ${req.params.id}`
        if (req.params.userid === req.session.user.Id) {
            connection.query(sql);
            res.redirect('/');
        } else
            res.redirect('/error');
    });

    app.post('/update_board', (req, res) => {
        var board_name = '"' + req.body.board_name + '"';
        var board = '"' + req.body.board + '"';
        var username = '"' + req.session.user.Id + '"';

        console.log(req.session.user.Id);
        console.log(board_name);
        console.log(board);
        var sql = `insert into board (userid, board_name, board) values (${username},${board_name}, ${board})`;
        connection.query(sql, (err, rows, field) => {
            if (err) {
                console.log(err);
            } else {
                res.redirect('/');
            }
        });
    });

    app.get('/modifyboard/:id/:userid', (req, res) => {
        /*
        {
                id: req.params.id,
                userid: padata[0].userid,
                board_name: padata[0].board_name,
                board: padata[0].board,
                datetime: padata[0].datetime
            }
            req.session.board_inform
        */
        res.render('modify_board.ejs', { board_name: req.session.board_inform.board_name, board: req.session.board_inform.board });
    });

    app.post('/modifyboard', (req, res) => {
        var board_name = req.body.board_name;
        var board = req.body.board;
        var sql = `UPDATE board set board_name = ${"'" +board_name+"'"}, board = ${"'" +board_name+"'"} where id = ${req.session.board_inform.id}`;

        console.log(req.session.board_inform.id);

        connection.query(sql);
        res.redirect(`/board/${req.session.board_inform.id}`);
    });

    app.get('/chai', (req, res) => {
        res.render('chai.ejs');
    });

    app.post('/chai', (req, res) => {
        //var name = req.body.username;
        //var id = req.body.Id;
        var StuId = req.body.StuId;
        var pw = req.body.password;
        var cpw = req.body.confirm_password;
        var room_number = req.body.room_number;
        var sql;
        var Id = req.session.user.Id;
        //name = '"' + name + '"';
        StuId = '"' + StuId + '"';
        pw = '"' + pw + '"';
        room_number = '"' + room_number + '"';

        if (pw && cpw && room_number) {
            sql = `UPDATE student set StuId = ${StuId}, StuPw = ${pw}, 기숙사방 = ${room_number} where id = ${req.session.user.nid}`;
            //sql = `INSERT INTO student (이름, StuId, StuPw, 기숙사방) VALUES(${name}, ${StuId}, ${pw}, ${room_number})`;
            connection.query(sql,
                (error, results, fields) => {
                    if (error) {
                        console.log(error);
                        res.send({
                            "code": 400,
                            "failed": "error ocurred"
                        });
                    } else {
                        res.redirect('/');
                    }

                });
        } else {
            console.log('입력하지 않은 부분이 있습니다. 모두 입력하여 주세요');
            res.redirect('/admin');
        }

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

    app.post('/munhak', (req, res) => {
        var data = new Array();
        /*= new Array(Array(), Array());*/
        connection.query('select * from sit_stat', (error, results, field) => {
            for (var i = 0; i < results.length; i++) {
                data[i] = results[i].sit_status;
            }
            res.send(data);
        })
    });

    io.on('connection', (socket) => {
        console.log('io connected');
        var sql;
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

        connection.query('SELECT * FROM board', (error, results, fields) => {
            var boardlist;
            if (error) {
                console.log(error);
                res.send({
                    "code": 400,
                    "failed": "error ocurred"
                });
            } else {
                boardlist = JSON.parse(JSON.stringify(results));
                console.log(boardlist);
                socket.emit('board_list', boardlist);
            }
        });

        socket.on('enter', (button_id) => {
            connection.query('select * from login_inform', (error, results, fields) => {
                sql = `UPDATE sit_stat set sit_status = ${1}, sit_user = ${"'"+ results[0].con_user_id + "'"} where id = ${button_id}`;
                console.log(sql);
                connection.query(sql);
                //socket.emit('confirm_end', "confirm_enter");
            });
        });

        socket.on('exit', (button_id) => {
            sql = `UPDATE sit_stat set sit_status = ${0}, sit_user = ${'0'} where id = ${button_id}`;
            console.log(sql);
            connection.query(sql);
        });
    });

    app.get('/admin', (req, res) => {
        if (req.session.user) {
            console.log(req.session.user.admin);
            if (req.session.user.admin === 1)
                res.render('admin.ejs');
            else
                res.redirect('/');
        } else
            res.redirect('/');

    });
    //const io = require('socket.io')(server);
    app.get('/munhak', (req, res) => {
        res.render('munhaksil.html');
    });
}