function gameOverProcess(data){
    $('#message').empty().append("お疲れさまでした！");

    var div = $("<div></div>");
    var resultInfo = data.resultInfo;
    for(var i=0; i<resultInfo.length; i++){
        var playerNode = "";
        var player = resultInfo[i].player;
        var pointsArray = resultInfo[i].pointsArray;

        playerNode += "<div><h3>No."+(i+1)+":"+player.name+"总分数:"+pointsArray[0]+"(手持分数:"+pointsArray[1]+", 建筑物分数:"+pointsArray[2]+", 额外分数:"+pointsArray[3]+")</h3></div>"
                   + "<div>金钱:"+player.money+", 采石场:"+player.quarry+",玉米:"+player.products[0]+",白糖:"+player.products[1]+",靛蓝:"+player.products[2]+",烟草:"+player.products[3]+",咖啡:"+player.products[4]
                   +",种植园数量:"+player.plantArea.length+",建筑物数量:"+player.buildArea.length+"。</div>";

        div.append(playerNode);
    }
    $('#element').empty().append(div);
}
