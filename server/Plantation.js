var Plants = [
  {id:0, name:'free space', price:0, color:'green', needColonist:1, actualColonist:0}, //id, 名称, 价格， 颜色, 总数
  {id:1, name:'corn', price:0, color:'yellow', needColonist:1, actualColonist:0},
  {id:2, name:'sugar', price:1, color:'white', needColonist:1, actualColonist:0},
  {id:3, name:'indigo', price:2, color:'blue', needColonist:1, actualColonist:0},
  {id:4, name:'tobacco', price:3, color:'lt-brown', needColonist:1, actualColonist:0},
  {id:5, name:'coffee', price:4, color:'dk-brown', needColonist:1, actualColonist:0},
  {id:6, name:'quarry', price:0, color:'gray', needColonist:1, actualColonist:0}
];

var PlantsNum = [100, 10, 11, 11, 9, 9, 10];
var PlantOptions = [];
var extraOptions = [];

  exports.init = function(){
      Plants = [
        {id:0, name:'free space', price:0, color:'green', needColonist:1, actualColonist:0}, //id, 名称, 价格， 颜色, 总数
        {id:1, name:'corn', price:0, color:'yellow', needColonist:1, actualColonist:0},
        {id:2, name:'sugar', price:1, color:'white', needColonist:1, actualColonist:0},
        {id:3, name:'indigo', price:2, color:'blue', needColonist:1, actualColonist:0},
        {id:4, name:'tobacco', price:3, color:'lt-brown', needColonist:1, actualColonist:0},
        {id:5, name:'coffee', price:4, color:'dk-brown', needColonist:1, actualColonist:0},
        {id:6, name:'quarry', price:0, color:'gray', needColonist:1, actualColonist:0}
      ];

      PlantsNum = [100, 10, 11, 11, 9, 9, 1];
      PlantOptions = [];
      extraOptions = [];
  }

  exports.getPlatationOptions = function(){
      PlantOptions=[];
      extraOptions=[];
      quarryOptions=[];

      PlantOptions = getOptions(4);
      extraOptions = getOptions(1);
      quarryOptions = getQuarryOptions();

      return {arr1:PlantOptions,
              arr2:extraOptions,
              arr3:quarryOptions};
  }


  function getOptions(num){
      var options = [];
      var tmpNum = PlantsNum.concat();

      var items=getRandomItems(num);
      for(var i=0; i< items.length; i++){
         var index = items[i];
         if(tmpNum[index] > 0){
           options.push(Plants[index]);
           tmpNum.splice(index,1, tmpNum[index]-1);
         }
         else{
           ////再做考虑
         }
      }

      //console.log('plant options:');
      //console.log(PlantOptions);
      return options;
};

function getQuarryOptions(){
    var options = [];
    for(var i = 0; i < PlantsNum[6]; i++){
        options.push(Plants[6]);
    }
    return options;
}


exports.updatePlantationOptions = function(id){
    if(id != 0){
        for(var i=0; i<PlantOptions.length; i++){
            if(PlantOptions[i].id == id){
                console.log(i);
                PlantOptions.splice(i, 1);
                break;
            }
        }
    }

    extraOptions = getOptions(1);
    getQuarryOptions();
    //console.log('plant options:');
    //console.log(PlantOptions);
    return {arr1:PlantOptions,
            arr2:extraOptions,
            arr3:quarryOptions};
};


// exports.updateNum = function(){
//     console.log('before updateNum:'+PlantsNum);
//     for(var i=0; i<PlantOptions.length; i++){
//       if(PlantOptions[i].selected == 1){
//           var id= PlantOptions[i].id
//           console.log(id);
//           if(PlantsNum[id] > 0){
//               //PlantsNum.splice(id, 1, num-1);
//               PlantsNum[id]-=1;
//           }
//       }
//     }
//     //console.log('after updateNum:'+PlantsNum);
// };

exports.getPlant = function(index){
    return Plants[index];
};

exports.takeoutPlant = function(index){
    if(index == null){
       return;
    }
    PlantsNum[index] -= 1;
};

exports.getPlantsNum = function(){
    return PlantsNum;
};


var getRandomItems = function(num){
   var items=[];

   for(var i=0; i<num; i++){
       var index = Math.floor( Math.random() * 5 )+1 ;
       items.push(index);
   }
   return items;
};
