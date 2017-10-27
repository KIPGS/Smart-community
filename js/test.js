function a(fn){
  var b=function(){

  };

  fn(b)
}

a(function(fn){
  fn();
});


var json = {
  1: '开',
  2: '111',
  3: '222',
  4: '333',
  5: '444',
}
dom.html(json['null']  || '');


//
//function show(){
//for(var i=0;i<1000000000;i++){
//  console.log(i)
//}
//
//setTimeout(function(){
//  alert(123)
//}, 110);
//setTimeout(function(){
//  alert(123)
//}, 111);
//
//for(var i=0;i<1000000000;i++){
//  console.log(i)
//}
//}
//
//show();
//
//[rw2]

----------------------------------------------------------------------------------------------

//<script>
//window.onload=function(){
//var  t =new Date();
//
//};
//</script>
//<body></body>
//var arr = window.jsonData.payload;
//
//
//var temp = window.jsonDatadddd.payload[1].data.temp;
//var light = window.jsonData.payload[1].data.light;
//var co2 = window.jsonData.payload[0].data.co2;
//var pm25 = window.jsonData.payload[0].data.pm25;
//var humi = window.jsonData.payload[0].data.humi;
//
//
//payload  ==  [{},{}]
//
//payload[0].data = payload[0].data || {
//  temp: '',
//  light: ''
//};
//var temp = window.jsonData.payload[1].data.temp;
//var light = window.jsonData.payload[1].data.light;

//上面这么写 会影响遗愿吧？

------------------------------------------------------------



var oDom = $('#top');
var aWhite = oDom.find('.j-whiteHeight');
var json = {
  var temp = window.jsonData.payload[1].data.temp;
  var light = window.jsonData.payload[1].data.light;
  var co2 = window.jsonData.payload[0].data.co2;
  var pm25 = window.jsonData.payload[0].data.pm25;
  var humi = window.jsonData.payload[0].data.humi;
}
aWhite.each(function(){
  var item = $(this);
  var type = item.attr('e-type');
  item.css({
      height : fn(type, json),
  })
});

function fn(prop, json){
  var val = json[prop];

  switch(prop){
    case 'light':
      return (10000 - val) / 100 + '%';
      break;
  }
}

----------------------------------

//function toDB(iNum){
//  return iNum > 9 ? '0' + iNum : '' + iNum;
//}
//
//
//month > 9 ? month : '0' + month;
//month > 9 || (month = '0' + month);
//month = month > 9 ? '' + month : '0' + month;
//
//t = tt == ttt ? 1 : 2

--------------------------------------
//function change(type) {
////var common = {
////    db_sbID : null,
////    "payload" : [{
////        "clusterID" : 333
////    }]
////};
//
//var msg;
//var db_sbID;
//if(type == 'kt'){
//  db_sbID = 10006
//  var common = {
//      db_sbID : '10006',
//      "payload" : [{
//          "ctrl" : {
//              "volume" : 50,
//          },
//          "clusterID" : 1
//      }]
//  };
//
//  common.payload[0].ctrl.volume = 50,
//  msg = 'ctrl/13850156340/282CB2E942D6/10006';
//} else {
//  db_sbID = 10005
//  var common = {
//      db_sbID : '10006',
//      "payload" : [{
//          "aaa" : {
//              "cmd" : 5,
//          },
//          "clusterID" : 1
//      }]
//  };
//  msg = 'ctrl/13850156340/282CB2E942D6/10006';
//}
//
//  common.db_sbID = db_sbID;
//
//  common = JSON.stringify(common);
//  message = new Messaging.Message(common);
//  message.destinationName = msg;
//  client.send(message);
//
//}
//
//for (var i = 0; i < arr.length; i++) {
//if ( i == 3){
//  alert(123)
//} else {
//  alert(456)
//}
//};

------------------------------------------------

function change(type, callback) {
  var common = {
      db_sbID : null,
      "payload" : [{
          "clusterID" : 333
      }]
  };

  var msg;
  var db_sbID;
  if(type == 'kt'){
    db_sbID = 10006
    var common = {
        db_sbID : '10006',
        "payload" : [{
            "ctrl" : {
                "volume" : 50,
            },
            "clusterID" : 1
        }]
    };

    common.payload[0].ctrl.volume = 50,
    msg = 'ctrl/13850156340/282CB2E942D6/10006';

    $.ajax({
      success: function(){
        callback(common);
      }
    });
  } else {
    db_sbID = 10005
    var common = {
        db_sbID : '10006',
        "payload" : [{
            "aaa" : {
                "cmd" : 5,
            },
            "clusterID" : 1
        }]
    };
    msg = 'ctrl/13850156340/282CB2E942D6/10006';
    callback(common);
  }


}
change('kt', function(data){
    data.db_sbID = db_sbID;

    data = JSON.stringify(data);
    message = new Messaging.Message(data);
    message.destinationName = msg;
    client.send(message);
})
<html>
<head>
  <title></title>
</head>
<body>
<div e-type="light"></div>
</body>
</html>