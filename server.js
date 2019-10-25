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
var os = require('os');
os.tmpDir = os.tmpdir;

app.use(bodyParser.json());
app.use(session({
    secret: 'zenbusine!!!!!',
    //시험용 코드 mysql session
    store: sessionStore,
    resave: false,
    saveUninitialized: true
}));

app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.set('views', __dirname + '/view');

var server = app.listen(process.env.PORT || 8888, function() {
    console.log("Express server has started on port 8888");
});

const io = require('socket.io')(server);
var router = require('./router/main')(app, io);