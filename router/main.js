module.exports = function(app, fs)
{
    var mysql = require('mysql');
    var config = require('../config');

    var connection = mysql.createConnection(config);

    connection.connect();
// 일정한 시간마다 의미없는 쿼리문을 보내서 연결을 유지시킨다.
    setInterval(function () {
        connection.query('SELECT 1');
    }, 5000);
    app.get('/',function(req,res){
        if(req.session.user){
            res.render('home.ejs', {
                Id : req.session.user.Id
            });
        }else {
            res.redirect('/login');
        }
    });
    app.get('/login', function(req, res){
        res.render('login.ejs');
    });

    app.post('/login', function(req, res){

        var id = req.body.username;
        var pw = req.body.password;
        var session = req.session;

        connection.query('SELECT * FROM student WHERE Stuid = ?', [id],
            function( error, results, fields) {
                if (error) 
                {
                    console.log(error);
                    res.send({
                        "code": 400,
                        "failed": "error ocurred"
                    })
                } else {
                // console.log('The solution is: ', results);
                if(results.length > 0) {
                    //console.log(results[0].StuPw);

                    if(results[0].StuPw == pw) {
                     session.user = {
                        "Id" : results[0].StuId,
                        "age" : 25,
                    }
                    //if(session.user.Id)
                    //console.log(session.user.Id);

                    
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
    });

    //nfc 처리 코드(보내는건 curl/curl.h에 정의되어 있다.)

    //제작중!
    app.post('/process/nfc', function(req, res){
        var tag = req.body.tag; 
        connection.query('SELECT * FROM student WHERE NFCNumber = ?', [tag],
            function( error, results, fields) {
                if (error) 
                {
                    console.log(error);
                    res.send({
                        "code": 400,
                        "failed": "error ocurred"
                    })
                } else {
                // console.log('The solution is: ', results);
                if(results.length > 0) {
                    console.log(results[0].StuPw);

                    if(results[0].NFCNumber == tag) {
                        res.send({
                            "code": 200,
                            "success": "tag was matched"
                        });
                    } else {
                        res.send({
                            "code": 204,
                            "success": "tag was not matched"
                        });
                    }
                } else {
                    res.send({
                        "code":204,
                        "success": "invalid tag"
                    });
                }

            }    
        })
    });

    app.get('/logout', function(req, res){
        delete req.session;
        res.redirect('/login')
    });

    app.get('/t', function(req, res){
        res.render('t.ejs',{Id : 'sa'});
    });

    app.get('/mlogin', function(req, res){
        res.render('mlogin.ejs');
    });


}