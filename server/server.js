var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var game = require('./game.js');
var Plantation = require('./Plantation');
var Colonists = require('./Colonist');
var Player=require('./Player');


var settings = require(__dirname + '/../config/settings');

var GameItemsArray = [];
var FiledArray = [];
var FiledLength = 10;
var Action={//记录玩家的操作
    index_GameItems:null,
    index_Filed:null,
    id:null
};
var players = [];
var playerNum = 1;
var round = 0;
var roundAction = 0; //记录每轮里操作的玩家数，当操作过的玩家数等于玩家总数，则开始进入选角阶段。
var roundRole = 0; //记录选角色的玩家数
var TradingHouse = [];
var ColonistsShip = [];
var GoodsShip = [];





var Buildings = [
  {id:0,name:'free space', points:0, quarries:0, price:0, colonist:0, space:1, color:'green', TotalNum:100, currentNum:100}, //id,名称,分数，最大采石场数，价格，所需奴隶数，需要space数，颜色，总数量

  {id:1,name:'small indigo plant', points:1, quarries:1, price:1, colonist:1, space:1, color:'blue', TotalNum:5},
  {id:2,name:'indigo plant', points:2, quarries:2, price:3, colonist:3, space:1, color:'blue', TotalNum:5},
  {id:3,name:'small sugar mill', points:1, quarries:2, price:1, colonist:1, space:1, color:'white', TotalNum:5},
  {id:4,name:'sugar mill', points:2, quarries:2, price:4, colonist:1, space:1, color:'white', TotalNum:5},
  {id:5,name:'tabacco storage', points:3, quarries:3, price:5, colonist:3, space:1, color:'lt brown', TotalNum:5},
  {id:6,name:'coffee roaster', points:3, quarries:3, price:6, colonist:2, space:1, color:'dk brown', TotalNum:5},

  //small purple building
  {id:7,name:'small market', points:1, quarries:1, price:1, colonist:1, space:1, color:'purple', TotalNum:5},
  {id:8,name:'hacienda', points:1, quarries:1, price:2, colonist:1, space:1, color:'purple', TotalNum:5}, //农庄
  {id:9,name:'construction hut', points:1, quarries:1, price:2, colonist:1, space:1, color:'white', TotalNum:5},
  {id:10,name:'samll warehouse', points:1, quarries:1, price:3, colonist:1, space:1, color:'purple', TotalNum:5},
  {id:11,name:'hospice', points:2, quarries:2, price:4, colonist:1, space:1, color:'purple', TotalNum:5}, //收容所
  {id:12,name:'office', points:2, quarries:2, price:5, colonist:1, space:1, color:'purple', TotalNum:5}, //分商会
  {id:13,name:'large market', points:2, quarries:2, price:5, colonist:1, space:1, color:'purple', TotalNum:5},
  {id:14,name:'large warehouse', points:2, quarries:2, price:6, colonist:1, space:1, color:'purple', TotalNum:5},
  {id:15,name:'factory', points:3, quarries:3, price:7, colonist:1, space:1, color:'purple', TotalNum:5},
  {id:16,name:'university', points:3, quarries:3, price:8, colonist:1, space:1, color:'purple', TotalNum:5},
  {id:17,name:'harbor', points:3, quarries:3, price:8, colonist:1, space:1, color:'purple', TotalNum:5},
  {id:18,name:'wharf', points:3, quarries:3, price:9, colonist:1, space:1, color:'purple', TotalNum:5}, //船坞

  //big purple building
  {id:19,name:'guild hall', points:4, quarries:4, price:10, colonist:1, space:2, color:'purple', TotalNum:5}, //公会大厅
  {id:20,name:'residence', points:4, quarries:4, price:10, colonist:1, space:2, color:'purple', TotalNum:5}, //公馆
  {id:21,name:'fortress', points:4, quarries:4, price:10, colonist:1, space:2, color:'purple', TotalNum:5}, //堡垒
  {id:22,name:'customs house', points:4, quarries:4, price:10, colonist:1, space:2, color:'purple', TotalNum:5},//海关
  {id:23,name:'city hall', points:4, quarries:4, price:10, colonist:1, space:2, color:'purple', TotalNum:5}//市政厅
];


var ColonistsShip = {};


app.use(express.static(__dirname + '/../client'));

http.listen(settings.port, function() {
      console.log("server listen");
     init();
 })

function init() {
  //根据player个数决定每次开拓者角色时platation tile数量, colonist总数等。

  players = [];

  // GameItemsArray = [];
  // GameItemsArray.push(["玉米", 5, 1]); // "1" stands for "Enable".
  // GameItemsArray.push(["咖啡", 9, 1]);
  // GameItemsArray.push(["item3", 3, 1]);
  // GameItemsArray.push(["item4", 3, 0]);

  FiledArray=[];
  for(var i = 0; i < FiledLength; i ++){
      FiledArray.push(["空地", 0, 0 ]); //param： 土地种类，归属者，数量
  }
}

io.on('connection', function (socket) {
    console.log('connection.');
    if(players!=null){
        socket.emit('players update', players); //先把当前player列表广播出去
    }

    socket.on('new player add', function (data) {
            // var player = new Object();
            // player.id = data.id;
            // player.socket = socket.id;
            console.log('new player:' + data.name+','+data.id +','+ socket.id);
            players.push(data);
            socket.name = data.name;
            io.sockets.emit('players update', players);
    });

    socket.on('start game', function(){
        io.sockets.emit('start game');
    });

    socket.on('submit', function(data){
        Action = data;
        i = Action.index_GameItems;
        j = Action.index_Filed;
        GameItemsArray[i][1] = GameItemsArray[i][1] - 1;
        FiledArray[j][0] = GameItemsArray[i][0];
        FiledArray[j][0] = Action.id;
        console.log('submit.'+Action.index_GameItems+';'+Action.index_Filed);
        io.sockets.emit('update', data);
    });

    socket.on('disconnect', function(){
        console.log('disconnect: '+socket.name+','+socket.id);
        players.some(function(v, i){
            if (v.name == socket.name){
               players.splice(i,1);
            }
        });
        socket.broadcast.emit('players update', players);
    });

    ////////game role is selected//////////////
    socket.on('gameRoleSelect', function(data){
        console.log('gameRoleSelect:'+data.role);
        roundAction = 0; //重新记录操作的玩家数
        var data = data;
        var role = data.role;
        switch(role){
            case 'Settler': //拓荒者
                data.options = Plantation.getPlatationOptions(true);
                //console.log(data.options);
                io.sockets.emit('SettlerResponse', data);
                break;
            case 'Trader'://商人
            case 'Mayor': //市长
                data.ship = Colonists.updateShip();
                if(!judgeGameOver()){
                    io.sockets.emit('MayorResponse', data);
                }
                else{
                    console.log('Game Over!');
                }
            case 'Captain': //船长
            case 'Builder'://建筑士
            case 'Craftsman': //监管
            case 'Prospector'://淘金者
        }
    });

    socket.on('plant selected', function(data){
        var index = data.index;
        data.options = Plantation.updatePlantOptions(index);

        console.log('after plant selected:'+data.options);
        roundAction += 1;
        if(roundAction == playerNum){
            if(roundRole == playerNum){
                io.sockets.emit('next round');　//进入下一轮，更换总督玩家
            }
            else{
                Plantation.updateNum();
                io.sockets.emit('next role');
            }
        }
        else{
            io.sockets.emit('next player action', data);
        }
    });
});

function judgeGameOver(remainder){
   if(remainder <= 0){
      return true;
   }
   else{
      return false;
   }
}
