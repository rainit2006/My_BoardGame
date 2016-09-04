/////////Global variables////////////
var gameStart = false;
var gameOver = false;
var BuildingAreaMaxNum = 12;
var PlantationAreaMaxNum = 12;

var Action={//记录玩家的操作
    index_GameItems:null,
    index_Filed:null,
    id:null
};
var MAX_PLAYER = 5;
var Roles=[
  {'id':0, 'name':'Settler', 'active':1, 'money':0}, //拓荒者
  {'id':1, 'name':'Mayor', 'active':1, 'money':0}, //市长
  {'id':2, 'name':'Trader', 'active':1, 'money':0}, //商人
  {'id':3, 'name':'Captain', 'active':1, 'money':0}, //船长
  {'id':4, 'name':'Builder', 'active':1, 'money':0},//建筑士
  {'id':5, 'name':'Craftsman', 'active':1, 'money':0}, //监管
  {'id':6, 'name':'Prospector', 'active':1, 'money':0} //淘金者
];
var rolePlayer;

var PLANTS = [
  {id:0, name:'free space', price:0, color:'green', needColonist:1, actualColonist:0}, //id, 名称, 价格， 颜色, 总数
  {id:1, name:'corn', price:0, color:'yellow', needColonist:1, actualColonist:0},
  {id:2, name:'sugar', price:1, color:'white', needColonist:1, actualColonist:0},
  {id:3, name:'indigo', price:2, color:'blue', needColonist:1, actualColonist:0},
  {id:4, name:'tobacco', price:3, color:'lt-brown', needColonist:1, actualColonist:0},
  {id:5, name:'coffee', price:4, color:'dk-brown', needColonist:1, actualColonist:0},
  {id:6, name:'quarry', price:0, color:'gray', needColonist:1, actualColonist:0}
];

var BUILDINGS = [
  {id:0,name:'free space', points:0, quarry:0, price:0, needColonist:0, actualColonist:0, space:1, color:'green'}, //id,名称,分数，最大采石场数，价格，所需奴隶数，需要space数，颜色，总数量

  {id:1,name:'small indigo plant', points:1, quarry:1, price:1, needColonist:1, actualColonist:0, space:1, color:'blue' },
  {id:2,name:'indigo plant', points:2, quarry:2, price:3, needColonist:3, actualColonist:0, space:1, color:'blue' },
  {id:3,name:'small sugar mill', points:1, quarry:2, price:1, needColonist:1, actualColonist:0, space:1, color:'white' },
  {id:4,name:'sugar mill', points:2, quarry:2, price:4, needColonist:1, actualColonist:0, space:1, color:'white' },
  {id:5,name:'tobacco storage', points:3, quarry:3, price:5, needColonist:3, actualColonist:0, space:1, color:'lt-brown' },
  {id:6,name:'coffee roaster', points:3, quarry:3, price:6, needColonist:2, actualColonist:0, space:1, color:'dk-brown' },

  //small purple building
  {id:7,name:'small market', points:1, quarry:1, price:1, needColonist:1, actualColonist:0, space:1, color:'purple' },
  {id:8,name:'hacienda', points:1, quarry:1, price:2, needColonist:1, actualColonist:0, space:1, color:'purple' }, //农庄
  {id:9,name:'construction hut', points:1, quarry:1, price:2, needColonist:1, actualColonist:0, space:1, color:'purple' },
  {id:10,name:'samll warehouse', points:1, quarry:1, price:3, needColonist:1, actualColonist:0, space:1, color:'purple' },
  {id:11,name:'hospice', points:2, quarry:2, price:4, needColonist:1, actualColonist:0, space:1, color:'purple' }, //收容所
  {id:12,name:'office', points:2, quarry:2, price:5, needColonist:1, actualColonist:0, space:1, color:'purple' }, //分商会
  {id:13,name:'large market', points:2, quarry:2, price:5, needColonist:1, actualColonist:0, space:1, color:'purple' },
  {id:14,name:'large warehouse', points:2, quarry:2, price:6, needColonist:1, actualColonist:0, space:1, color:'purple' },
  {id:15,name:'factory', points:3, quarry:3, price:7, needColonist:1, actualColonist:0, space:1, color:'purple' },
  {id:16,name:'university', points:3, quarry:3, price:8, needColonist:1, actualColonist:0, space:1, color:'purple' },
  {id:17,name:'harbor', points:3, quarry:3, price:8, needColonist:1, actualColonist:0, space:1, color:'purple' },
  {id:18,name:'wharf', points:3, quarry:3, price:9, needColonist:1, actualColonist:0, space:1, color:'purple' }, //船坞

  //big purple building
  {id:19,name:'guild hall', points:4, quarry:4, price:10, needColonist:1, actualColonist:0, space:2, color:'purple' }, //公会大厅
  {id:20,name:'residence', points:4, quarry:4, price:10, needColonist:1, actualColonist:0, space:2, color:'purple' }, //公馆
  {id:21,name:'fortress', points:4, quarry:4, price:10, needColonist:1, actualColonist:0, space:2, color:'purple' }, //堡垒
  {id:22,name:'customs house', points:4, quarry:4, price:10, needColonist:1, actualColonist:0, space:2, color:'purple' },//海关
  {id:23,name:'city hall', points:4, quarry:4, price:10, needColonist:1, actualColonist:0, space:2, color:'purple' }//市政厅
];
var BUILDINGSNUM = [];

var SHIPS = [{name:null, num:0},{name:null, num:0},{name:null, num:0}];
var SHIPLENGTH = [5, 6, 7];
var COLONISTSHIP = 4;
var COLONISTNUM = 0;
var TRADINGHOUSE = [];
var HOUSELENGTH = 4;
var Messages = [];
var Players = [];
var myPlayer = {
    name: 'test',
    id: 0,
    points:0,
    money:20,
    totalColonists:0,
    freeColonists:0,
    quarry:0,
    // corn:0,
    // indigo:0,
    // sugar:0,
    // tobacco:0,
    // coffee:0,
    products:[1,0,1,0,0],//corn, sugar indigo, tobacco,coffee
    plantArea:[],
    buildArea:[]
};

var mySelect = {select:null, extra:null, extra1:null}; //记录用户的选择
var playerNum = 1;
var currentRole = null;
var permit = false; //控制是否允许点击role按钮
var options = null;
var shipState= {
  wharf:false,
  clear:false,
  selected:null}


function containBuilding(name){
  var result = false;
  for(var i =0; i<myPlayer.buildArea.length; i++){
      if(myPlayer.buildArea[i].name == name){
            if(myPlayer.buildArea[i].actualColonist == 1){
                result = true;
                return result;
            }
      }
  }
  return result;
}

function getPlantByName(name){
  for(var i=0; i<PLANTS.length; i++){
      if(PLANTS[i].name == name){
        return PLANTS[i];
      }
  }
}

function findPlayerByID(ID){
  for(var i = 0; i< Players.length; i++){
      var player = Players[i];
      if(player.id == ID){
        return Players[i];
      }
  }
}
