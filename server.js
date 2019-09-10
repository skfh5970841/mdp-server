var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
//var mysql = require('mysql');
app.use(express.static(__dirname + '/public'));
var config = require('./config');
var session = require('express-session');

//시험용코드(mysql session)
var MYSQLStore = require('express-mysql-session')(session);
var sessionStore = new MYSQLStore(config);
var fs = require('fs');

app.use(bodyParser.json());
app.use(session({
    secret: 'zenbusine!!!!!',
    //시험용 코드 mysql session
    store: sessionStore,
    //break
    resave: false,
    saveUninitialized: true
}));

/*
var connection = mysql.createConnection(config);

connection.connect();
// 일정한 시간마다 의미없는 쿼리문을 보내서 연결을 유지시킨다.
setInterval(function () {
    connection.query('SELECT 1');
}, 5000);
*/
/*
app.get('/', function(req, res){
    //res.send('<a href = "login">login<a>');
    res.render('main.ejs');
});*/
/*
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
*/



app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.set('views', __dirname + '/view');

var server = app.listen(process.env.PORT || 8888, function() {
    console.log("Express server has started on port 8888");
});

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
var router = require('./router/main')(app);