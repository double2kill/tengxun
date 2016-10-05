const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const cheerio = require('cheerio');

app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
  res.render('index');
})
app.get('/tianqi', function(req, res){
  getHtml(function(tem, prec){
    console.log(tem);
    res.render('tianqi', {
      tem: tem
    })
  })
})

app.listen(80, function(){
  console.log('app listening!!');
});

function getHtml(cb){
  http.get("http://www.weather.com.cn/weather/101230811.shtml?from=fujian", function(res) {  
    console.log("Got response: " + res.statusCode);  
    res.on('data', function(data) {  
      var $ = cheerio.load(data);
      var a = $('li.on').eq(1).find('.tem').text();
      if(a){
        cb(a);
      }
    });  
  }).on('error', function(e) {  
      console.log("Got error: " + e.message);  
  });
}