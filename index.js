const express = require('express');
const app = express();

app.set('view engine', 'pug');

app.get('/', function(req, res){
  res.render('index');
})

app.listen(80, function(){
  console.log('app listening!!');
});
