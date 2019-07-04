var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
var mysql = require('mysql');
app.use(express.static(__dirname + '/public'));
var showdata = require('./router/show-all-data.js');
var config = require('./config');
var session = require('express-session');

var crypto = require('crypto');



var fs = require('fs');
app.use(bodyParser.json());
app.use(session({
    secret : 'zenbusine!!!!!',
    resave : false,
    saveUninitialized : true
}));
/*
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
*/
/*app.post('/user', function (req, res) {
        var path = req.path;
        res.locals.path = path;
        var userID = req.body.id
        var userPW = req.body.pw
        res.send('id : '+userID+'pw : ' + userPW)
    })*/
    var connection = mysql.createConnection(config);

    connection.connect();
// 일정한 시간마다 의미없는 쿼리문을 보내서 연결을 유지시킨다.
setInterval(function () {
    connection.query('SELECT 1');
}, 5000);
//
app.get('/list', function (req, res) {
        //SQL문 실행
        connection.query('select * from student', function(err, rows, fields){
            if(!err)
            {
                console.log('The solution is:', rows);
                res.send(rows);
            }
            else
                console.log('Error while performing Query.', err);
        });

    });
/*
app.post('/user', function (req, res) {

    var userID = req.body.id;
    var userPW = req.body.pw;

    if(userID && userPW) { // userID와 userPW가 유효하다면

        //SQL문 실행
        connection.query("INSERT INTO student (StuId, StuPw) VALUES ('"+ userID +"', '"+userPW+"')" , 
            function (error, result, fields) {

            if (error) { //에러 발생시
                res.send('err : ' + error)
            }
            else { //실행 성공
                console.log( userID + ',' + userPW )
                res.send('success create user name: '+ userID +' pw: ' + userPW)
            }
        })
    }
});

app.post('/test', function(req, res){
    var t1 = req.body.id;
    var t2 = req.body.pw;
    connection.query("select * from student" , 
            function (error, result, fields) {

            if (error) { //에러 발생시
                res.send('err : ' + error)
            }
            else { //실행 성공
                res.render('2.ejs',{t1, t2});
            }
        })
});
*/
app.get('/', function(req, res){
    //res.send('<a href = "login">login<a>');
    
    res.render('main.ejs');
});

app.get('/login', function(req, res){
    res.render('1.ejs');
});

app.post('/login', function(req, res){

    var id = req.body.username;
    var pw = req.body.password;

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
                console.log(results[0].StuPw);

                if(results[0].StuPw == pw) {
                    res.send({
                        "code": 200,
                        "success": "login sucessfull"
                    });
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
                        "success": "tag is matching"
                    });
                } else {
                    res.send({
                        "code": 204,
                        "success": "tag is not matching"
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

/*app.post('/a', function (req, res, next) {
    var userId = req.body['userId'];
    var userPw = req.body['userPw'];
    connection.query('select * from test_user where id=\'' + userId + '\' and pw=\'' + userPw + '\'', function (err, rows, fields) {
        if (!err) {
            if (rows[0]!=undefined) {
                res.send('id : ' + rows[0]['id'] + '<br>' +
                    'pw : ' + rows[0]['pw']);
            } else {
                res.send('no data');
            }

        } else {
            res.send('error : ' + err);
        }
    });
});*/

app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.set('views', __dirname+'/view');


var server = app.listen(8888, function(){
    console.log("Express server has started on port 8888");
});


var router = require('./router/main')(app);