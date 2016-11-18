const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const cheerio = require('cheerio');
const bodyParser = require('body-parser')
const mySets = require('./mysettings')

const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  service: 'QQ', // no need to set host or port etc.
  auth: {
    user: mySets.qqMailUser,
    pass: mySets.qqMailPass
  }
});

port = 80;
var _contents = [];

app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }))  
app.use(bodyParser.json()) 

app.get('/', function(req, res){
  res.render('index');
})
app.get('/tianqi', function(req, res){
  getHtml(function(tem, prec){
    res.render('tianqi', {
      tem: tem
    })
  })
})
app.get('/games', function(req, res){
    res.render('games');
})
app.get('/qiang', function(req, res){
    res.render('qiang');
})
app.get('/fuwu', function(req, res){
  res.render('fuwu', {
    contents: _contents
  });
})
app.post('/copy', function(req, res){
  _contents.unshift(req.body.content);
  res.redirect("/fuwu");
})
app.post('/mail', function(req, res){
  // setup e-mail data with unicode symbols
  var mailto = req.body.to;
  var mailsubject = req.body.subject;
  var mailtext = req.body.text;
  var mailhtml = req.body.html;
  // check key
  var key = req.body.key;
  const CORRECTKEY = "ubuntu";
  if(key !== CORRECTKEY){
    res.send('error: 0');
  }
  else if(!mailto&&!mailsubject){
    res.send('error: 1');
  }
  else{
    var mailOptions = {
        from: mySets.defaultMailFrom, // sender address
        to: mailto, // list of receivers
        subject: mailsubject, // Subject line
        text: mailtext, // plaintext body
        html: mailhtml // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }
        // console.log('Message sent: ' + info.response);
        res.send('ok: 1');
    });
  }
})

app.listen(port, function(){
  console.log('app listening!!');
});

function getHtml(cb){
  http.get("http://www.weather.com.cn/weather/101230811.shtml?from=fujian", function(res) {  
    res.on('data', function(data) {  
      var $ = cheerio.load(data);
      var a = $('li.on').find('.tem').text();
      if(a){
        cb(a);
      }
    });  
  }).on('error', function(e) {  
      console.log("Got error: " + e.message);  
  });
}


