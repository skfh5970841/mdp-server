module.exports = function(app, fs)
{
    /*app.get('/',function(req,res){
    	res.send('the last man standing');
        //res.render('index.html')
    });*/
    /*app.get('/pass',function(req,res){
        var data = req.query.data;
        var data2 = req.query.data2;
        //var data2 = req.query.data2;
        //res.send(data2);
        var data3 = data + data2;
        res.send("data 값은 " + (data3));
    });
    app.get('/markup', function(req,res){
    	var output = `
		<html>
			<h1>뭐야 이렇게도 되는 거였네???!!!!!!!!!!!!!!</h1>
		</html>
    	`
    	res.send(output);
    });*/
    //query 방식
    /*
    app.get('/topic', function(req, res){
    	var topics = [
    	'javascript is ...',
    	'nodejs is ...',
    	'express is ...'
    	];
    	var output = `
		<a href="/topic?id=0">javascript</a><br>
    	<a href="/topic?id=1">nodejs</a><br>
    	<a href="/topic?id=2">express</a><br>
    	${topics[req.query.id]};`
    	res.send(output);
    });*/
    /*
    //params 방식
    app.get('/topic/:id', function(req, res){
        var topics = [
        'javascript is ...',
        'nodejs is ...',
        'express is ...'
        ];
        var output = `
        <a href="/topic?id=0">javascript</a><br>
        <a href="/topic?id=1">nodejs</a><br>
        <a href="/topic?id=2">express</a><br>
        ${topics[req.params.id]};`
        res.send(output);
    });
    */
    //post
    /*app.post('/user', function (req, res) {
        var path = req.path;
        res.locals.path = path;
        var userID = req.body.id
        var userPW = req.body.pw
        res.send('id : '+userID+'pw : ' + userPW)
    })
    app.post('/user', function (req, res) {

        var userID = req.body.id
        var userPW = req.body.pw

    if(userID && userPW) { // userID와 userPW가 유효하다면

        //SQL문 실행
        connection.query("INSERT INTO user (userID, userPW) VALUES ('"+ userID +"', '"+userPW+"')" , 
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
    connection.query("select * from student",
        function(error, result, fields){
            if (error) { //에러 발생시
                res.send('err : ' + error)
            }
            else { //실행 성공
                console.log( "아마 된듯??" );
                res.send('됐겠지...,');
            }
        })

});*/
    
    app.get('/', function(req, res){
        var id = req.query.body;
        res.render('1.ejs');
    });
    app.get('/abc', function(req, res){
        res.render('2.html');
    });

    app.post('/give', function(req, res){
        console.log('req.body');
        var id = req.body.uid;
        var pw = req.body.upw;

        res.redirect('/');
    })
    
    app.get('/arg', function(req, res){
        var a = 10;
        var b = 20;
        res.render('2.ejs', {
            title : a,
            length : b
        })
    })
    app.get('/login', function(req, res){
        var a = req.body.name;
        var b = req.body.email;
        var c = req.body.password;

        res.send(a + b + c);
    });
}