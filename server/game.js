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
  {'id':1, 'name':'Settler', 'active':1, 'money':0}, //拓荒者
  {'id':2, 'name':'Mayor', 'active':1, 'money':0}, //市长
  {'id':3, 'name':'Trader', 'active':1, 'money':0}, //商人
  {'id':4, 'name':'Captain', 'active':1, 'money':0}, //船长
  {'id':5, 'name':'Builder', 'active':1, 'money':0},//建筑士
  {'id':6, 'name':'Craftsman', 'active':1, 'money':0}, //监管
  {'id':7, 'name':'Prospector', 'active':1, 'money':0} //淘金者
];

exports.Roles = Roles;

exports.initGame = function(){

};

exports.getTotalResult = function(){

};

exports.disactiveRole = function(id){
    Roles[id].active = 0;
};

exports.activeAllRoles = function(){
    $.each(Roles, function(index){
        Roles[index].active = 1;
    });
}
