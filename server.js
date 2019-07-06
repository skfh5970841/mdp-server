var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
var mysql = require('mysql');
app.use(express.static(__dirname + '/public'));
var showdata = require('./router/show-all-data.js');
var config = require('./config');
var session = require('express-session');

//시험용코드(mysql session)
var MYSQLStore = require('express-mysql-session')(session);
var sessionStore = new MYSQLStore(config);
//break

var fs = require('fs');


app.use(bodyParser.json());
app.use(session({
    secret : 'zenbusine!!!!!',
    //시험용 코드 mysql session
    store : sessionStore,
    //break
    resave : false,
    saveUninitialized : true
}));

    var connection = mysql.createConnection(config);

    connection.connect();
// 일정한 시간마다 의미없는 쿼리문을 보내서 연결을 유지시킨다.
setInterval(function () {
    connection.query('SELECT 1');
}, 5000);
/*
app.get('/', function(req, res){
    //res.send('<a href = "login">login<a>');
    res.render('main.ejs');
});*/
app.get('/',function(req,res){
    if(req.session.user){
        
        res.render('home.ejs', {
            Id : req.session.user.Id
        });
    }else {
        res.redirect('/login')
    }
});
app.get('/login', function(req, res){
    //if(req.session.user)
    //    res.render('home.ejs', {
    //        title: "MY HOMEPAGE",
    //        Id : req.session.user.Id
    //    });
    //else
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

//test
app.get('/test', function(req, res){
    res.render('ex.ejs');
});
app.get('/pro', function(req, res){
    res.render('my.ejs');
});
app.get('/admin', function(req, res){
    res.render('admin.ejs');
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