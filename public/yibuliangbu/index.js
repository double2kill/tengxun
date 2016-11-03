var btnone = document.getElementById('btnone');
var btntwo = document.getElementById('btntwo');
var land = document.getElementById('land');
var person = document.getElementById('person');
var scorediv = document.getElementById('score');
var board = document.getElementById('board');
var replay = document.getElementById('replay');

var landblock;
var landleft;
var velocity;
var jiasudu;
var persontop;
var score;

//计时器
var landtimer,persontimer,pT;
var clickone,clicktwo;

var clickarray;
var moving;
var clicktimer;
var blank;
var blockspeed;
var stop;
var standT;
var falltimer;

var TOP;
var STATE = 0;
var loop = setInterval(function(){
  switch(STATE){
    case 0: yourset();STATE=1;break;//0 初始化
    case 1: youronly();STATE=2;break;//1 只执行一次的东西。
    case 2: yourbegin();break;//1 监听鼠标按下，等待修改全局变量等。
    case 3: yourlose();break;//2 游戏结束
    case 4: yourreturn();STATE = 5;break//4 返回画面
    case 5: break//5 无内容
  }
},10);

function yourset(){
  board.style.display = "none";
  landblock = 100;
  landleft = 0;
  velocity = 5*landblock/50;
  jiasudu = 2*landblock/50
  persontop = 200;
  clickarray = [];
  moving = false;
  blockspeed = Infinity;
  stop = true;
  standT = 0;

  clearInterval(landtimer);
  clearInterval(persontimer);
  clearInterval(clicktimer);
  clearInterval(falltimer);

  btnone.style.marginTop = persontop + 2*landblock + "px";
  btntwo.style.marginTop = persontop + 2*landblock + "px";
  person.style.marginLeft = landblock + 15 + "px";
  TOP = persontop;
  land.style.marginTop = persontop + landblock + "px";

  // 生成随机数
  person.style.marginTop = persontop + "px";
  land.innerHTML = "";
  blank = [];
  blank.push(1);
  land.innerHTML+="<li class='myhide'></li>";
  blank.push(0);
  land.innerHTML+="<li></li>";
  baochi();

  //初始化分数
  score = 0;
  scorediv.innerHTML = score;
}

function youronly(){
  clicktimer = setInterval(function(){
    if(!moving){
      if(clickarray.length>0&&stop){
        moving = true;
        myclick(clickarray[0]);
      }
    }
  },100);

  window.document.onkeydown = function(event){
    var e = event || window.event || arguments.callee.caller.arguments[0];
    if(e&&e.keyCode===70){
      clickarray.push(1);
      if(blockspeed==Infinity){blockspeed = 10;}
    }
    else if(e&&e.keyCode===74){
      clickarray.push(2);
      if(blockspeed==Infinity){blockspeed = 10;}
    }
  }

  btnone.onclick = function () {
    clickarray.push(1);
  }
  btntwo.onclick = function () {
    clickarray.push(2);
  }  
}

function yourbegin(){

}

function yourlose(){
  //移除鼠标和键盘时间
  window.document.onkeydown = "";
  btnone.onclick = "";
  btntwo.onclick = "";

  //死亡动画
  setTimeout(function(){STATE = 4;},400);
}

function yourreturn(){
  board.children[0].innerHTML="得分："+score;
  if(localStorage.high){
    if(localStorage.high<score){
      localStorage.high=score;
      board.children[1].innerHTML="最佳："+localStorage.high;
    }
    else{
      board.children[1].innerHTML="最佳："+localStorage.high;
    }
  }
  else{
    localStorage.high = score;
    board.children[1].innerHTML="最佳："+localStorage.high;
  }
  board.style.display = "block";
  replay.onclick = function(){
    STATE = 0;
  }
}

// 保持有16个以上
function baochi(){
  while(blank.length < 16){
    var temp = Math.random()*5;
    for(var i = 0; i < temp; i++){
      blank.push(0);
      land.innerHTML+="<li></li>";
    }
    blank.push(1);
    land.innerHTML+="<li class='myhide'></li>";
  }
}

function myclick(type){
  if(type === 1){
    moveto(landleft-landblock,1);
    jump(1);
  }
  else if (type === 2){
    moveto(landleft-2*landblock,2);
    jump(1.6);
  }
  clickarray.shift();
}

function moveto(lefttarget,level){
  standT = 0;
  clearInterval(falltimer);
  landtimer = setInterval(function(){
    if(landleft>lefttarget){
      landleft-=level*velocity;
      land.style.marginLeft = landleft + "px";
    }
    else{
      // 后处理
      moving = false;
      score += level;
      scorediv.innerHTML = score;
      if(level===1){
        land.removeChild(land.children[0]);
        blank.shift();
      }
      else{
        land.removeChild(land.children[0]);
        land.removeChild(land.children[0]);
        blank.shift();
        blank.shift();
      }
      landleft = 0;
      land.style.marginLeft = landleft + "px";
      baochi();
      clearInterval(landtimer);
      if(blank[1]===1){
        STATE = 3;
        stop = false;
        standT = 0;
        clearInterval(falltimer);        
      }
      else{
        fall();
      }
    }
  },30)
}

function jump(level){
  console.log("jump")
  //type = 1代表移动一格的跳跃。
  //type = 2代表移动二格的跳跃。
  pT = 0;
  persontimer = setInterval(function(){
    if(persontop <= 4*TOP){
      pT += 0.3*level;
      persontop = TOP - 2*level*velocity*pT + 0.5*jiasudu*pT*pT;
      person.style.marginTop = persontop + "px";
      // else 
      if(persontop > TOP&&stop){
        clearInterval(persontimer);
        // 安全到达后处理
        persontop = TOP;
        person.style.marginTop = persontop + "px";         
      }
    }
    else{
      clearInterval(persontimer);
      // 死亡后处理
      persontop = 4*TOP;
      person.style.marginTop = persontop + "px";
    }
  },10)
}

function fall(){
  standT = 0;
  clearInterval(falltimer);
  falltimer = setInterval(function(){
    standT += 10;
    land.children[1].style.opacity = 1-standT/(2000/((score)/20+1)+110);
    console.log(standT);
    if(standT>(2000/((score)/20+1)+100)){
      clickarray = [];
      STATE = 3;
      clearInterval(landtimer);
      pT = 0;
      clearInterval(falltimer);
                  persontimer = setInterval(function(){
                    if(persontop <= 4*TOP){
                      pT += 0.3;
                      persontop = TOP + 2*velocity*pT + 0.5*jiasudu*pT*pT;
                      person.style.marginTop = persontop + "px";
                    }
                    else{
                      clearInterval(persontimer);
                      // 死亡后处理
                    }
                  },10)
    }
  }, 10)
}