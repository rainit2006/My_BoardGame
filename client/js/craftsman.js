/////////////////////
function craftsmanProcess(data){
    var addProducts = [0, 0, 0, 0, 0];
    ///corn
    $.each(myPlayer.plantArea, function(index){
        if(myPlayer.plantArea[index].name == PLANTS[1].name){
             addProducts[0] += myPlayer.plantArea[index].actualColonist;
        }
    });
    ///sugar
    addProducts[1] += validProductNum(PLANTS[2].name, BUILDINGS[1].name) + validProductNum(PLANTS[2].name, BUILDINGS[2].name);
    ///indigo
    addProducts[2] += validProductNum(PLANTS[3].name, BUILDINGS[3].name) + validProductNum(PLANTS[3].name, BUILDINGS[4].name);
    ///tabacco
    addProducts[3] += validProductNum(PLANTS[4].name, BUILDINGS[5].name);
    ///coffee
    addProducts[4] += validProductNum(PLANTS[5].name, BUILDINGS[6].name);

    $('#message').empty().append('你手里的货物情况是：');
    $('#element').empty();
    $.each(myPlayer.products, function(index){
        myPlayer.products[index] += addProducts[index];
        $('#element').append("<div>"+PLANTS[index+1].name +" : "+myPlayer.products[index]+"个; (新加"+addProducts[index]+"个)</div>");
    });
}

function validProductNum(plantName, buildName){
    var produceNum = 0;
    if(myPlayer.buildArea != null){
        $.each(myPlayer.buildArea, function(index){
            if(myPlayer.buildArea[index].name == buildName){
                produceNum += myPlayer.buildArea[index].actualColonist;
            }
        });
    }

    var plantNum = 0;
    if(myPlayer.plantArea != null){
        $.each(myPlayer.plantArea, function(index){
            if(myPlayer.plantArea[index].name == plantName){
                plantNum += myPlayer.plantArea[index].actualColonist;
            }
        });
    }

    if(produceNum > plantNum){
        return plantNum;
    }else{
        return produceNum;
    }
}
