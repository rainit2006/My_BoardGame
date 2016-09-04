var Buildings = [
  {id:0,name:'free space', points:0, quarry:0, price:0, needColonist:0, actualColonist:0, space:1, color:'green'}, //id,名称,分数，最大采石场数，价格，所需奴隶数，需要space数，颜色，总数量

  {id:1,name:'small indigo plant', points:1, quarry:1, price:1, needColonist:1, actualColonist:0, space:1, color:'blue' },
  {id:2,name:'indigo plant', points:2, quarry:2, price:3, needColonist:3, actualColonist:0, space:1, color:'blue' },
  {id:3,name:'small sugar mill', points:1, quarry:2, price:1, needColonist:1, actualColonist:0, space:1, color:'white' },
  {id:4,name:'sugar mill', points:2, quarry:2, price:4, needColonist:1, actualColonist:0, space:1, color:'white' },
  {id:5,name:'tabacco storage', points:3, quarry:3, price:5, needColonist:3, actualColonist:0, space:1, color:'lt-brown' },
  {id:6,name:'coffee roaster', points:3, quarry:3, price:6, needColonist:2, actualColonist:0, space:1, color:'dk-brown' },

  //small purple building
  {id:7,name:'small market', points:1, quarry:1, price:1, needColonist:1, actualColonist:0, space:1, color:'purple' },
  {id:8,name:'hacienda', points:1, quarry:1, price:2, needColonist:1, actualColonist:0, space:1, color:'purple' }, //农庄
  {id:9,name:'construction hut', points:1, quarry:1, price:2, needColonist:1, actualColonist:0, space:1, color:'purple' },
  {id:10,name:'small warehouse', points:1, quarry:1, price:3, needColonist:1, actualColonist:0, space:1, color:'purple' },
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

var buildingsNum = [0, 3,3,3,3,3,2,  2,2,2,2,2,2,2,2,2,2,2,2,  1,1,1,1,1];

exports.getBuildingsNum = function(){
    console.log(buildingsNum);
    return buildingsNum;
}


exports.takeoutBuild = function(index){
  if(buildingsNum[index] > 0){
      var num = buildingsNum[index];
      buildingsNum[index] = num-1;
      return Buildings[index];
  }
};

exports.iniBuildings = function(){
    Buildings = [
      {id:0,name:'free space', points:0, quarry:0, price:0, needColonist:0, actualColonist:0, space:1, color:'green'}, //id,名称,分数，最大采石场数，价格，所需奴隶数，需要space数，颜色，总数量

      {id:1,name:'small indigo plant', points:1, quarry:1, price:1, needColonist:1, actualColonist:0, space:1, color:'blue' },
      {id:2,name:'indigo plant', points:2, quarry:2, price:3, needColonist:3, actualColonist:0, space:1, color:'blue' },
      {id:3,name:'small sugar mill', points:1, quarry:2, price:1, needColonist:1, actualColonist:0, space:1, color:'white' },
      {id:4,name:'sugar mill', points:2, quarry:2, price:4, needColonist:1, actualColonist:0, space:1, color:'white' },
      {id:5,name:'tabacco storage', points:3, quarry:3, price:5, needColonist:3, actualColonist:0, space:1, color:'lt brown' },
      {id:6,name:'coffee roaster', points:3, quarry:3, price:6, needColonist:2, actualColonist:0, space:1, color:'dk brown' },

      //small purple building
      {id:7,name:'small market', points:1, quarry:1, price:1, needColonist:1, actualColonist:0, space:1, color:'purple' },
      {id:8,name:'hacienda', points:1, quarry:1, price:2, needColonist:1, actualColonist:0, space:1, color:'purple' }, //农庄
      {id:9,name:'construction hut', points:1, quarry:1, price:2, needColonist:1, actualColonist:0, space:1, color:'white' },
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

    buildingsNum = [0, 3,3,3,3,3,2,  2,2,2,2,2,2,2,2,2,2,2,2,  1,1,1,1,1];
}
