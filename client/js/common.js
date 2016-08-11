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

var BUILDINGS = [
  {id:0,name:'free space', points:0, quarries:0, price:0, needColonist:0, actualColonist:0, space:1, color:'green'}, //id,名称,分数，最大采石场数，价格，所需奴隶数，需要space数，颜色，总数量

  {id:1,name:'small indigo plant', points:1, quarries:1, price:1, needColonist:1, actualColonist:0, space:1, color:'blue' },
  {id:2,name:'indigo plant', points:2, quarries:2, price:3, needColonist:3, actualColonist:0, space:1, color:'blue' },
  {id:3,name:'small sugar mill', points:1, quarries:2, price:1, needColonist:1, actualColonist:0, space:1, color:'white' },
  {id:4,name:'sugar mill', points:2, quarries:2, price:4, needColonist:1, actualColonist:0, space:1, color:'white' },
  {id:5,name:'tabacco storage', points:3, quarries:3, price:5, needColonist:3, actualColonist:0, space:1, color:'lt brown' },
  {id:6,name:'coffee roaster', points:3, quarries:3, price:6, needColonist:2, actualColonist:0, space:1, color:'dk brown' },

  //small purple building
  {id:7,name:'small market', points:1, quarries:1, price:1, needColonist:1, actualColonist:0, space:1, color:'purple' },
  {id:8,name:'hacienda', points:1, quarries:1, price:2, needColonist:1, actualColonist:0, space:1, color:'purple' }, //农庄
  {id:9,name:'construction hut', points:1, quarries:1, price:2, needColonist:1, actualColonist:0, space:1, color:'white' },
  {id:10,name:'samll warehouse', points:1, quarries:1, price:3, needColonist:1, actualColonist:0, space:1, color:'purple' },
  {id:11,name:'hospice', points:2, quarries:2, price:4, needColonist:1, actualColonist:0, space:1, color:'purple' }, //收容所
  {id:12,name:'office', points:2, quarries:2, price:5, needColonist:1, actualColonist:0, space:1, color:'purple' }, //分商会
  {id:13,name:'large market', points:2, quarries:2, price:5, needColonist:1, actualColonist:0, space:1, color:'purple' },
  {id:14,name:'large warehouse', points:2, quarries:2, price:6, needColonist:1, actualColonist:0, space:1, color:'purple' },
  {id:15,name:'factory', points:3, quarries:3, price:7, needColonist:1, actualColonist:0, space:1, color:'purple' },
  {id:16,name:'university', points:3, quarries:3, price:8, needColonist:1, actualColonist:0, space:1, color:'purple' },
  {id:17,name:'harbor', points:3, quarries:3, price:8, needColonist:1, actualColonist:0, space:1, color:'purple' },
  {id:18,name:'wharf', points:3, quarries:3, price:9, needColonist:1, actualColonist:0, space:1, color:'purple' }, //船坞

  //big purple building
  {id:19,name:'guild hall', points:4, quarries:4, price:10, needColonist:1, actualColonist:0, space:2, color:'purple' }, //公会大厅
  {id:20,name:'residence', points:4, quarries:4, price:10, needColonist:1, actualColonist:0, space:2, color:'purple' }, //公馆
  {id:21,name:'fortress', points:4, quarries:4, price:10, needColonist:1, actualColonist:0, space:2, color:'purple' }, //堡垒
  {id:22,name:'customs house', points:4, quarries:4, price:10, needColonist:1, actualColonist:0, space:2, color:'purple' },//海关
  {id:23,name:'city hall', points:4, quarries:4, price:10, needColonist:1, actualColonist:0, space:2, color:'purple' }//市政厅
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
