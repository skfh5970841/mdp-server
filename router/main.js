module.exports = function(app, fs)
{
    var mysql = require('mysql');
    var config = require('../config');

    var connection = mysql.createConnection(config);

    connection.connect();
// 일정한 시간마다 의미없는 쿼리문을 보내서 연결을 유지시킨다.
setInterval(()=> {
    connection.query('SELECT 1');
}, 5000);

app.get('/', (req, res)=>{
    if(req.session.user){
        res.render('user.ejs', {
            Id : req.session.user.Id
        });
    }else {
        res.redirect('/login');
    }
});

app.get('/login', (req, res)=>{
    res.render('login.ejs');
});

app.post('/login', (req, res)=>{
    var id = req.body.username;
    var pw = req.body.password;
    var session = req.session;
    console.log('this is login post select');

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
});

    //제작중
    app.post('/process/nfc', (req, res)=>{
        var tag = req.body.NFCnumber; 
        var session = req.session;

        connection.query('SELECT * FROM student WHERE NFCNumber = ?', [tag],
            (error, results, fields) =>{
                if (error) 
                {
                    console.log(error);
                    res.send({
                        "code": 400,
                        "failed": "error ocurred"
                    })
                } else {
                    res.send(tag);
                    session.nfc = {
                        "nfc" : tag
                    } 
                // console.log('The solution is: ', results);
                if(results.length > 0) {
                    if(results[0].NFCNumber == tag) {
                        console.log('정상처리 되었습니다.');
                        /*res.send({
                            "code": 200,
                            "success": "tag was matched"
                        });*/
                        //return '정상처리 되었습니다.'
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
    app.get('/process/nfc', (req, res)=>{
        res.send(req.session.tag);
    });

    app.post('/deleteuser', (req, res)=>{
        var name = req.body.username;
        connection.query('DELETE FROM student WHERE Stuid = ?', [name]);
    });
    
    app.get('/logout', (req, res)=>{
        delete req.session;
        res.redirect('/login')
    });

    app.get('/t', (req, res)=>{
        res.render('t.ejs',{Id : 'sa'});
    });

    app.post('/adduser', (req, res)=>{
        var name = req.body.username;
        var id = req.body.Id;
        var pw = req.body.password;
        var cpw = req.body.confirm_password;
        var email = reeq.body.email;

        if(name&&id&&pw&&cpw&&email){
            alert('모든 정보가 입력되었습니다.');

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
        
    });
        }
        else{
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
    app.get('/admin', (req, res)=>{
        console.log('this is /admin get');
        if(req.session.select){
            console.log(res.session.select); 
            res.redirect('admin2');
        }
        else res.render('admin.ejs');
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
    app.post('/admin', (req, res)=>{
    var classname = req.body.classname;
    var session = req.session;
    console.log('this is admin post select');
    console.log(classname);
    /*
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
    })*/
});
    //
    
}

