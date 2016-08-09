/////////Global variables////////////
var BuildingAreaMaxNum = 12;
var PlantationAreaMaxNum = 12;

var Action={//记录玩家的操作
    index_GameItems:null,
    index_Filed:null,
    id:null
};
var MAX_PLAYER = 5;
var PLANTS = [
  {id:0, name:'free space', price:0, color:'green', needColonist:1, actualColonist:0}, //id, 名称, 价格， 颜色, 总数
  {id:1, name:'corn', price:0, color:'yellow', needColonist:1, actualColonist:0},
  {id:2, name:'sugar', price:1, color:'white', needColonist:1, actualColonist:0},
  {id:3, name:'indigo', price:2, color:'blue', needColonist:1, actualColonist:0},
  {id:4, name:'tabacco', price:3, color:'lt-brown', needColonist:1, actualColonist:0},
  {id:5, name:'coffee', price:4, color:'dk-brown', needColonist:1, actualColonist:0},
  {id:6, name:'quarry', price:0, color:'gray', needColonist:1, actualColonist:0}
];
var Players = [];
var myPlayer = {
    name: 'test',
    id: 0,
    select:null, //记录用户的选择
    points:0,
    money:0,
    totalColonists:0,
    freeColonists:0,
    quarry:0,
    // corn:0,
    // indigo:0,
    // sugar:0,
    // tabacco:0,
    // coffee:0,
    products:[1,0,1,0,0],//corn, sugar indigo, tabacco,coffee
    plantArea:[],
    buildArea:[]
};
var playerNum = 1;
var currentRole = null;
var options = null;
