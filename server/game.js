var totalProducedCorn=0;
var totalProducedSugar=0;
var totalProducedIndigo=0;
var totalProducedTabacco=0;
var totalProducedCoffee=0;
var totalTradedSugar=0;
var totalTradedIndigo=0;
var totalTradedTabacco=0;
var totalTradedCoffee=0;

var activePlayer = null;
var governerPlayer = null;
var currentRole = null;

var Roles=[
  {'id':0, 'name':'Settler', 'active':1, 'money':0}, //拓荒者
  {'id':1, 'name':'Mayor', 'active':1, 'money':0}, //市长
  {'id':2, 'name':'Trader', 'active':1, 'money':0}, //商人
  {'id':3, 'name':'Captain', 'active':1, 'money':0}, //船长
  {'id':4, 'name':'Builder', 'active':1, 'money':0},//建筑士
  {'id':5, 'name':'Craftsman', 'active':1, 'money':0}, //监管
  {'id':6, 'name':'Prospector', 'active':1, 'money':0} //淘金者
];


exports.init = function(){
  Roles=[
    {'id':0, 'name':'Settler', 'active':1, 'money':0}, //拓荒者
    {'id':1, 'name':'Mayor', 'active':1, 'money':0}, //市长
    {'id':2, 'name':'Trader', 'active':1, 'money':0}, //商人
    {'id':3, 'name':'Captain', 'active':1, 'money':0}, //船长
    {'id':4, 'name':'Builder', 'active':1, 'money':0},//建筑士
    {'id':5, 'name':'Craftsman', 'active':1, 'money':0}, //监管
    {'id':6, 'name':'Prospector', 'active':1, 'money':0} //淘金者
  ];

};

exports.getTotalResult = function(){

};

exports.disactiveRole = function(role){
    for(var i=0; i<Roles.length; i++){
        if(Roles[i].name == role){
           Roles[i].active = 0;
           Roles[i].money = 0;
        }
    }
};

exports.activeAllRoles = function(){
    for(var i=0; i<Roles.length; i++){
           Roles[i].active = 1;
    }
}

exports.allotMoneyForRoles = function(){
  for(var i=0; i<Roles.length; i++){
      if(Roles[i].active == 1){
         Roles[i].money += 1;
      }
  }

}

exports.getAllRoles = function(){
    return Roles;
}
