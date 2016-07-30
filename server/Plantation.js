var Plants = [
  {id:0, name:'free space', price:0, color:'green'}, //id, 名称, 价格， 颜色, 总数
  {id:1, name:'corn', price:0, color:'yellow'},
  {id:2, name:'sugar', price:1, color:'white'},
  {id:3, name:'indigo', price:2, color:'blue'},
  {id:4, name:'tabacco', price:3, color:'lt-brown'},
  {id:5, name:'coffee', price:4, color:'dk-brown'},
  {id:6, name:'quarry', price:0, color:'gray'}
];

var PlantsNum = [100, 10, 11, 11, 9, 9, 10];

exports.getPlatationOptions = function (isSettler){
      var options=[];
      if(isSettler){
        if(PlantsNum[6] > 0){
            options.push(Plants[6]);
            console.log('plants.Num[6]:'+ PlantsNum[6]);
        }
      }
      var items=getRandomItems(5);
      for(var i=0; i< items.length; i++){
         var index = items[i];
         if(PlantsNum[index] >= 0){
           options.push(Plants[index]);
         }
         else{
           ////再做考虑
         }
      }

      console.log('plant name:'+options[0].name);
      return options;
};

exports.updateNum = function(data){
    for(var i=0; i<data.length; i++){
      var num = PlantsNum[data[i].id];
      if(num > 0){
          PlantsNum.splice(data[i].id, 1, num-1);
      }
    }
    console.log(PlantsNum[1]+','+PlantsNum[2]+','+PlantsNum[3]+','+PlantsNum[4]+','+PlantsNum[5]+','+PlantsNum[6]);
};

var getRandomItems = function(num){
   var items=[];

   for(var i=0; i<num; i++){
       items.push(i+1);
   }
   return items;
};
