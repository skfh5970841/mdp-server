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

var
    exists = fs.exists || path.exists,
    tmpDir = os.tmpDir || _getTMPDir,
    tmpDir = os.tmpdir || os.tmpDir || _getTMPDir,
    _TMP = tmpDir(),
    randomChars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz",
    randomCharsLength = randomChars.length;

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

const io = require('socket.io')(server);
var router = require('./router/main')(app, io);