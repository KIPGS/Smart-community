//定义连接参数
var destination, client;
var domain = 'mqtt.lchtime.cn';
var port = 61623;
var options = {
	userName: 'root',
	password: '52399399',
	onSuccess: function() {
	},
};
var clientID = 'admin-' + Math.floor(Math.random() * 1000000000);
client = new Messaging.Client(domain, port, clientID);
client.connect(options); 
client.onMessageArrived = onMessageArrived; //消息回调函数
client.cleanSession = 1;
client.onConnectionLost = onConnectionLost;

function onConnectionLost(responseObject) {
	client.connect(options);
	//		client.disconnect();
}

function linkParameter(phone) {
	if(window.mqttconnected == true) {
		destination = 'data/' + phone + '/+/+';
		destination1 = 'common/'+'+';
		//告诉后台发送与手机号对应的消息
		client.subscribe(destination);
		client.subscribe(destination1);
		return true;
	} else {
		alert('服务器未连接 ');
		//页面显示未连接
		$('.mask').show();
		$('.mask .information').html('没有连接上服务器，请刷新网页');
		
	}
	return false;
}

function unlinkParameter(phone) {
	if(window.mqttconnected == true) {
		destination = 'data/' + phone + '/+/+';
		destination1 = 'common/'+'+';
		client.unsubscribe(destination);
		client.subscribe(destination1);
	}
	return false;
}
//页面设备状态显示
//开状态
function equipmentStateOn(eqname){
	$('.' + eqname + ' .right .kongzhi .kongzhitou img').attr({
		src: '../img/open.png',
	});
	$('.zhuye' + ' .' + eqname + '').css({
		'opacity': '1',
	})
	$('.zhuye'+ ' .' + eqname + ' span').css({
		color: '#00b46b',
	}).html('开');
	$('.zhuye' + ' .' + eqname + ' .biaozhi').addClass('on');
}
//关状态
function equipmentStateOff(eqname){
	$('.' + eqname + ' .right .kongzhi .kongzhitou img').attr({
		src: '../img/close.png',
	});
	$('.zhuye' + ' .' + eqname + '').css({
		opacity: '0.7',
	});
	$('.zhuye'+ ' .' + eqname + ' span').css({
		color: '#666666',
	}).html('关');
	$('.zhuye' + ' .' + eqname + ' .biaozhi').removeClass('on');
}
//控制开关
function control(sbname){
	$('.'+sbname+' .right .kongzhi .kongzhitou img , .zhuye .'+sbname+'').on('click', function() {
		if($('.zhuye .'+sbname+' span').html() == '关') {
			//等待状态
			$('.zhuye .'+sbname+' span').css({color: '#ff0000',}).html('正在打开，请稍等');
			$('.zhuye .'+sbname+'').attr({disabled:'disable'});
			//开关打开
			change(''+sbname+'_kai');
//			setTimeout(function(){
//				equipmentStateOff(sbname);
//			},5000)
		} else if($('.zhuye .'+sbname+' span').html() == '开') {
			//等待状态
			$('.zhuye .'+sbname+' span').css({color: '#ff0000',}).html('正在关闭，请稍等');
			$('.zhuye .'+sbname+'').attr({disabled:'disable'});
			//开关关闭
			change(''+sbname+'_guan');
//			setTimeout(function(){
//				equipmentStateOn(sbname);
//			},5000)
		}
	})
}

function onMessageArrived(message) {

	var jsonData = JSON.parse(message.payloadString);
	console.log(jsonData);
	//全局对象
	window.jsonData = jsonData;
	if(jsonData.db_sbID == '10000') {
		//门锁
		if(jsonData.deviceDetail) {
//			$('.zhuye .mensuo').css({
//				'opacity': '0.7',
//			})
//			$('.mensuo .right .kongzhi .kongzhitou img , .zhuye .mensuo').unbind("click");
//			$('.zhuye .mensuo span').css({
//				color: '#ff0000',
//			}).html('设备离线');
		} else if(jsonData.messagetype == 'response'){
			equipmentStateOn('mensuo');
			//自动关闭
			var t = setTimeout(function() {
				equipmentStateOff('mensuo');
			}, 3000)
		}
	} else if(jsonData.db_sbID == '10001') {
		//在线状态
		var sbqk = jsonData.payload[0].info.status;
		if(sbqk == 'online') {
			//实时参数
			function a() {
				//室内参数10001
				var zhr = $('.zhuye .right');
				var aHeight = zhr.find('.baifenbi_');

				var arr = jsonData.payload;
				var canshu_sn = {
					temp: arr[1].data.temp,
					light: arr[2].data.light,
					co2: arr[0].data.co2,
					pm25: arr[0].data.pm25,
					noise: arr[2].data.noise,
					humi: arr[0].data.humi,
				}
				//室内温度
				$('.zhuye .right .shinei .shinei1 .snwd .snwd_').html(canshu_sn.temp);
				$('.zhuye .right .shinei .shinei1 .snwd span:last').html('℃');
				$('.kongqijinghuaqi .right .kongzhi .kongzhi1 .snwd span:first').html(canshu_sn.temp);
				//光照强度
				$('.shineitu_ming .light span').html(parseInt(canshu_sn.light));
				$('.shineitu .light .baifenbi_').css({
					height: (10000 - canshu_sn.light) / 100 + '%',
				});
				//co2
				$('.shineitu_ming .co2 span').html(parseInt(canshu_sn.co2));
				$('.shineitu .co2 .baifenbi_').css({
					height: (10000 - canshu_sn.co2) / 100 + '%',
				});
				//PM25
				$('.shineitu_ming .pm25 span').html(parseInt(canshu_sn.pm25));
				$('.shineitu .pm25 .baifenbi_').css({
					height: (1000 - canshu_sn.pm25) / 10 + '%',
				});
				//噪音
				$('.shineitu_ming .noise span').html(parseInt(canshu_sn.noise));
				$('.shineitu .noise .baifenbi_').css({
					height: (100 - canshu_sn.noise) + '%',
				});
				//湿度
				$('.shineitu_ming .shidu span').html(parseInt(canshu_sn.humi));
				$('.shineitu .shidu .baifenbi_').css({
					height: (100 - canshu_sn.humi) + '%',
				});
			}
			a();
		} else if(sbqk == 'offline') {
			//离线状态
			$('.zhuye .right .shinei .shinei1 .snwd span').html('');
			$('.zhuye .right .shinei .shinei1 .snwd .snwd_ , .shineitu_ming .light span , .shineitu_ming .co2 span , .shineitu_ming .pm25 span , .shineitu_ming .noise span , .shineitu_ming .shidu span').html('离线');
			$('.shineitu .light .baifenbi_ , .shineitu .co2 .baifenbi_ , .shineitu .pm25 .baifenbi_ , .shineitu .noise .baifenbi_ , .shineitu .shidu .baifenbi_').css({
				height: '100%',
			});
			$('.quanbu .left .louhao .div2').eq(0).css('background', 'red');
			$('.moulou .left .weizhi .guibinlou1_2').css('color', 'red');
			$('.moulou .left .menhao .div2').eq(0).css('background', 'red');
		} else if(sbqk == 'error'){
			//掉线状态
//			$('.zhuye .right .shinei .shinei1 .snwd span').html('');
//			$('.zhuye .right .shinei .shinei1 .snwd .snwd_ , .shineitu_ming .light span , .shineitu_ming .co2 span , .shineitu_ming .pm25 span , .shineitu_ming .noise span , .shineitu_ming .shidu span').html('error');
//			$('.shineitu .light .baifenbi_ , .shineitu .co2 .baifenbi_ , .shineitu .pm25 .baifenbi_ , .shineitu .noise .baifenbi_ , .shineitu .shidu .baifenbi_').css({
//				height: '100%',
//			});
//			$('.quanbu .left .louhao .div2').eq(0).css('background', 'red');
//			$('.moulou .left .weizhi .guibinlou1_1').css('color', 'red');
//			$('.moulou .left .menhao .div2').eq(1).css('background', 'red');
		} else {
			console.log(sbqk);
		}
	} else if(jsonData.wendu) {
		//室外天气
		$('.zhuye .right .shiwai .shiwai1 .swwd span:first').html(jsonData.wendu);
		switch(jsonData.forecast[0].tymp) {
			case '晴':
				$('.swtq img').attr('src', '../img/tqqing.png');
				break;
			case '多云':
				$('.swtq img').attr('src', '../img/tqduoyun.png');
				break;
			case '阴':
				$('.swtq img').attr('src', '../img/tqyin.png');
				break;
			case '阵雨':
				$('.swtq img').attr('src', '../img/tqzhenyu.png');
				break;
			case 4:
				;
				break;
			case 5:
				;
				break;
			case 6:
				;
				break;
			default:
				$('.swtq').html(jsonData.forecast[0].tymp);
		}
	} else if(jsonData.city) {
		//室外参数
		var arr = jsonData;
		var canshu_sw = {
			pm25: arr.pm2_5,
			pm10: arr.pm10,
			so2: arr.so2,
			no2: arr.no2,
			o3: arr.o3,
			co: arr.co,
		}
		//PM25
		$('.shiwaitu_ming .pm25 span').html(parseInt(canshu_sw.pm25));
		$('.shiwaitu .pm25 .baifenbi_').css({
			height: (1000 - canshu_sw.pm25) / 10 + '%',
		});
		//PM10
		$('.shiwaitu_ming .pm10 span').html(parseInt(canshu_sw.pm10));
		$('.shiwaitu .pm10 .baifenbi_').css({
			height: (100 - canshu_sw.pm10) + '%',
		});
		//so2
		$('.shiwaitu_ming .so2 span').html(parseInt(canshu_sw.so2));
		$('.shiwaitu .so2 .baifenbi_').css({
			height: (100 - canshu_sw.so2) + '%',
		});
		//no2
		$('.shiwaitu_ming .no2 span').html(parseInt(canshu_sw.no2));
		$('.shiwaitu .no2 .baifenbi_').css({
			height: (100 - canshu_sw.no2) + '%',
		});
		//o3
		$('.shiwaitu_ming .o3 span').html(parseInt(canshu_sw.o3));
		$('.shiwaitu .o3 .baifenbi_').css({
			height: (100 - canshu_sw.o3) + '%',
		});
		//co
		$('.shiwaitu_ming .co span').html(parseInt(canshu_sw.co));
		$('.shiwaitu .co .baifenbi_').css({
			height: (100 - canshu_sw.co) + '%',
		});

	} else if(jsonData.db_sbID == '10002') {
		//灯相关data
		//大厅灯的状态
		// 		if(jsonData.payload[0].info.status != 'online' ){
		//          $('.zhuye .datingdeng').css({
		//              'opacity' : '0.7',
		//          })
		//          $('.datingdeng .right .kongzhi .kongzhitou img , .zhuye .datingdeng').unbind("click");
		//          $('.zhuye .datingdeng span').css({
		//              color : '#ff0000',
		//          }).html('设备离线');
		// 		}else 
		if(jsonData.payload[0].data.sw == 255) {
			equipmentStateOn('datingdeng');
		} else {
			equipmentStateOff('datingdeng');
		}
		//卧室灯的状态
		if(jsonData.payload[1].data.sw == 255) {
			equipmentStateOn('woshideng');
		} else {
			equipmentStateOff('woshideng');
		}
		//厨房灯的状态
		if(jsonData.payload[2].data.sw == 255) {
			equipmentStateOn('chufangdeng');
		} else {
			equipmentStateOff('chufangdeng');
		}
		//灯4的状态
		if(jsonData.payload[3].data.sw == 255) {
			equipmentStateOn('deng4');
		} else {
			equipmentStateOff('deng4');
		}
		//灯5的状态
		if(jsonData.payload[4].data.sw == 255) {
			equipmentStateOn('deng5');
		} else {
			equipmentStateOff('deng5');
		}
		//灯6的状态
		if(jsonData.payload[5].data.sw == 255) {
			equipmentStateOn('deng6');
		} else {
			equipmentStateOff('deng6');
		}
	} else if(jsonData.db_sbID == '10003') {
		//空气净化器
		if(jsonData.payload[0].data.sw == 255) {
			equipmentStateOn('kongqijinghuaqi');
		} else {
			equipmentStateOff('kongqijinghuaqi');
		}
		//pm25
		$('.kongqijinghuaqi .baifenbi .pm25 span').html(jsonData.payload[0].data.pm)
		$('.kongqijinghuaqi .shineitu_zhu .pm25').css({
			height: (1000 - jsonData.payload[0].data.pm) / 10 + '%',
		});
		//氧气
		var o2 = new Array(20, 21, 22);
		var fun = function() {
			var index = Math.floor((Math.random() * o2.length));
			$('.kongqijinghuaqi .shineitu_ming .o2 span').html(o2[index]);
			$('.kongqijinghuaqi .shineitu_zhu .o2').css({
				height: (100 - o2[index]) + '%',
			});
			//COV
			var cov = parseInt((Math.random() * (30 - 20) + 20));
			$('.kongqijinghuaqi .shineitu_ming .cov span').html(cov);
			$('.kongqijinghuaqi .shineitu_zhu .cov').css({
				height: (100 - cov) + '%',
			});
			//湿度
			var sd = parseInt((Math.random() * (30 - 20) + 40));
			$('.kongqijinghuaqi .shineitu_ming .sd span').html(sd);
			$('.kongqijinghuaqi .shineitu_zhu .sd').css({
				height: (100 - sd) + '%',
			});
		}
		fun();
		setInterval(fun, 30000);
		//电量
		$('.shuxing span span').html(jsonData.payload[0].data.battery)
	} else if(jsonData.db_sbID == '10004') {
		//窗帘
		if(jsonData.payload[0].data.sw == 255) {
			equipmentStateOn('yushilian');
		} else {
			equipmentStateOff('yushilian');
		}
	} else if(jsonData.db_sbID == '10008' && jsonData.payload[0].data.ircmd == '4') {
		//空调
		if(jsonData.payload[0].data.sw == 255) {
			equipmentStateOn('kongtiao');
		} else {
			equipmentStateOff('kongtiao');
		}
	} else if(jsonData.db_sbID == '10008') {
		//电视
		if(jsonData.payload[0].data.sw == 255 && jsonData.payload[0].data.ircmd == '134') {
			equipmentStateOn('dianshiji');
		} else {
			equipmentStateOff('dianshiji');
		}
	} else if(jsonData.db_sbID == '10007') {
		//煤气阀
		if(jsonData.payload[0].data.sw == 255) {
			equipmentStateOn('meiqifa');
		} else {
			equipmentStateOff('meiqifa');
		}
	}
}

////设备开关等方法
//function change(type) {
//	var msg;
//	switch(type) {
//		//门锁10000
//		case 'mensuo_kai':
//			var common = {
//				db_sbID: 10000,
//				"payload": [{
//					"ctrl": {
//						"cmd": 10,
//						"sw": 255,
//						"handle": 5
//					},
//					"clusterID": 1
//				}]
//			};
//			msg = '10000';
//			break;
//			//大厅灯10002
//			//SW 255开  SW 0关  clusterID 灯的id  可以传多个也可以传一个，最多传6个id
//		case 'datingdeng_kai':
//			var common = {
//				db_sbID: 10002,
//				"payload": [{
//					"ctrl": {
//						"cmd": 10,
//						"sw": 255,
//						"handle": 5
//					},
//					"clusterID": 1
//				}]
//			};
//			msg = '10002';
//			break;
//		case 'datingdeng_guan':
//			var common = {
//				db_sbID: 10002,
//				"payload": [{
//					"ctrl": {
//						"cmd": 10,
//						"sw": 0,
//						"handle": 6
//					},
//					"clusterID": 1
//				}]
//			};
//			msg = '10002';
//			break;
//			//卧室灯10002
//		case 'woshideng_kai':
//			var common = {
//				db_sbID: 10002,
//				"payload": [{
//					"ctrl": {
//						"cmd": 10,
//						"sw": 255,
//						"handle": 5
//					},
//					"clusterID": 2
//				}]
//			};
//			msg = '10002';
//			break;
//		case 'woshideng_guan':
//			var common = {
//				db_sbID: 10002,
//				"payload": [{
//					"ctrl": {
//						"cmd": 10,
//						"sw": 0,
//						"handle": 6
//					},
//					"clusterID": 2
//				}]
//			};
//			msg = '10002';
//			break;
//			//厨房灯10002
//		case 'chufangdeng_kai':
//			var common = {
//				db_sbID: 10002,
//				"payload": [{
//					"ctrl": {
//						"cmd": 10,
//						"sw": 255,
//						"handle": 5
//					},
//					"clusterID": 3
//				}]
//			};
//			msg = '10002';
//			break;
//		case 'chufangdeng_guan':
//			var common = {
//				db_sbID: 10002,
//				"payload": [{
//					"ctrl": {
//						"cmd": 10,
//						"sw": 0,
//						"handle": 6
//					},
//					"clusterID": 3
//				}]
//			};
//			msg = '10002';
//			break;
//			//灯4 10002
//		case 'deng4_kai':
//			var common = {
//				db_sbID: 10002,
//				"payload": [{
//					"ctrl": {
//						"cmd": 10,
//						"sw": 255,
//						"handle": 5
//					},
//					"clusterID": 4
//				}]
//			};
//			msg = '10002';
//			break;
//		case 'deng4_guan':
//			var common = {
//				db_sbID: 10002,
//				"payload": [{
//					"ctrl": {
//						"cmd": 10,
//						"sw": 0,
//						"handle": 6
//					},
//					"clusterID": 4
//				}]
//			};
//			msg = '10002';
//			break;
//			//灯5 10002
//		case 'deng5_kai':
//			var common = {
//				db_sbID: 10002,
//				"payload": [{
//					"ctrl": {
//						"cmd": 10,
//						"sw": 255,
//						"handle": 5
//					},
//					"clusterID": 5
//				}]
//			};
//			msg = '10002';
//			break;
//		case 'deng5_guan':
//			var common = {
//				db_sbID: 10002,
//				"payload": [{
//					"ctrl": {
//						"cmd": 10,
//						"sw": 0,
//						"handle": 6
//					},
//					"clusterID": 5
//				}]
//			};
//			msg = '10002';
//			break;
//			//灯6 10002
//		case 'deng6_kai':
//			var common = {
//				db_sbID: 10002,
//				"payload": [{
//					"ctrl": {
//						"cmd": 10,
//						"sw": 255,
//						"handle": 5
//					},
//					"clusterID": 6
//				}]
//			};
//			msg = '10002';
//			break;
//		case 'deng6_guan':
//			var common = {
//				db_sbID: 10002,
//				"payload": [{
//					"ctrl": {
//						"cmd": 10,
//						"sw": 0,
//						"handle": 6
//					},
//					"clusterID": 6
//				}]
//			};
//			msg = '10002';
//			break;
//			//空气净化器10003
//			//SW 255开  SW 0关  空气净化器
//		case 'kongqijinghuaqi_kai':
//			var common = {
//				db_sbID: 10003,
//				"payload": [{
//					"ctrl": {
//						"cmd": 10,
//						"sw": 255,
//						"handle": 5
//					},
//					"clusterID": 1
//				}]
//			};
//			msg = '10003';
//			break;
//		case 'kongqijinghuaqi_guan':
//			var common = {
//				db_sbID: 10003,
//				"payload": [{
//					"ctrl": {
//						"cmd": 10,
//						"sw": 0,
//						"handle": 6
//					},
//					"clusterID": 1
//				}]
//			};
//			msg = '10003';
//			break;
//			//浴室帘10004
//			//窗帘 SW 255开  SW 0关，location>0的时候会走相应的位置，location为0的时候，会走sw
//		case 'yushilian_kai':
//			var common = {
//				db_sbID: 10004,
//				"payload": [{
//					"ctrl": {
//						"cmd": 10,
//						"sw": 255,
//						"location": 255,
//						"handle": 5
//					},
//					"clusterID": 1
//				}]
//			};
//			msg = '10004';
//			break;
//		case 'yushilian_guan':
//			var common = {
//				db_sbID: 10004,
//				"payload": [{
//					"ctrl": {
//						"cmd": 10,
//						"sw": 0,
//						"location": 0,
//						"handle": 6
//					},
//					"clusterID": 1
//				}]
//			};
//			msg = '10004';
//			break;
//			//空调10005转10008
//		case 'kongtiao_kai':
//			var common = {
//				"db_sbID": 10008,
//				"payload": [{
//					"ctrl": {
//						"learnmode": 0,
//						"cmd": 10,
//						"sw": 255,
//						"handle": 5
//					},
//					"clusterID": 1
//				}]
//			};
//			msg = '10008';
//			break;
//		case 'kongtiao_guan':
//			var common = {
//				"db_sbID": 10008,
//				"payload": [{
//					"ctrl": {
//						"learnmode": 0,
//						"cmd": 10,
//						"sw": 0,
//						"handle": 6
//					},
//					"clusterID": 1
//				}]
//			};
//			msg = '10008';
//			break;
//		case 'wendu_jia':
//			var common = {
//				"db_sbID": 10008,
//				"payload": [{
//					"ctrl": {
//						"learnmode": 0,
//						"cmd": 10,
//						"temp": 30
//					},
//					"clusterID": 1
//				}]
//			};
//			msg = '10008';
//			break;
//		case 'wendu_jian':
//			var common = {
//				"db_sbID": 10008,
//				"payload": [{
//					"ctrl": {
//						"learnmode": 0,
//						"cmd": 10,
//						"temp": eval(window.jsonData.payload[0].ctrl.temp - 1)
//					},
//					"clusterID": 1
//				}]
//			};
//			msg = '10008';
//			break;
//			//电视机10006转10008
//		case 'dianshiji_kai':
//			var common = {
//				"db_sbID": 10008,
//				"payload": [{
//					"ctrl": {
//						"sw": 255,
//						"learnmode": 1,
//						"cmd": 10,
//						"position": 0,
//						"functions": 0,
//						"times": 5,
//						"handle": 5
//					},
//					"clusterID": 1
//				}]
//			};
//			msg = '10008';
//			break;
//		case 'dianshiji_guan':
//			var common = {
//				"db_sbID": 10008,
//				"payload": [{
//					"ctrl": {
//						"sw": 0,
//						"learnmode": 1,
//						"cmd": 10,
//						"position": 0,
//						"functions": 0,
//						"times": 5,
//						"handle": 6
//					},
//					"clusterID": 1
//				}]
//			};
//			msg = '10008';
//			break;
//			//电视音量加减
//		case 'dianshiji_yinliang_jia':
//			var common = {
//				db_sbID: 10008,
//				"payload": [{
//					"ctrl": {
//						//		                "volume" : 30,
//						"position": 8,
//					},
//					"clusterID": 1
//				}]
//			};
//			msg = '10008';
//			break;
//		case 'dianshiji_yinliang_jian':
//			var common = {
//				db_sbID: 10008,
//				"payload": [{
//					"ctrl": {
//						//		                "volume" : 10,
//						"position": 9,
//					},
//					"clusterID": 1
//				}]
//			};
//			msg = '10008';
//			break;
//			//电视上右下左
//		case 'dianshiji_shang':
//			var common = {
//				"db_sbID": 10008,
//				"payload": [{
//					"ctrl": {
//						"learnmode": 1,
//						"cmd": 10,
//						"position": 3,
//						"functions": 0,
//						"times": 5,
//					},
//					"clusterID": 1
//				}]
//			};
//			msg = '10008';
//			break;
//		case 'dianshiji_you':
//			var common = {
//				"db_sbID": 10008,
//				"payload": [{
//					"ctrl": {
//						"learnmode": 1,
//						"cmd": 10,
//						"position": 6,
//						"functions": 0,
//						"times": 5,
//					},
//					"clusterID": 1
//				}]
//			};
//			msg = '10008';
//			break;
//		case 'dianshiji_xia':
//			var common = {
//				"db_sbID": 10008,
//				"payload": [{
//					"ctrl": {
//						"learnmode": 1,
//						"cmd": 10,
//						"position": 4,
//						"functions": 0,
//						"times": 5,
//					},
//					"clusterID": 1
//				}]
//			};
//			msg = '10008';
//			break;
//		case 'dianshiji_zuo':
//			var common = {
//				"db_sbID": 10008,
//				"payload": [{
//					"ctrl": {
//						"learnmode": 1,
//						"cmd": 10,
//						"position": 5,
//						"functions": 0,
//						"times": 5,
//					},
//					"clusterID": 1
//				}]
//			};
//			msg = '10008';
//			break;
//			//煤气阀10007
//		case 'meiqifa_kai':
//			var common = {
//				db_sbID: 10007,
//				"payload": [{
//					"ctrl": {
//						"cmd": 10,
//						"sw": 255,
//						"handle": 5
//					},
//					"clusterID": 1
//				}]
//			};
//			msg = '10007';
//			break;
//		case 'meiqifa_guan':
//			var common = {
//				db_sbID: 10007,
//				"payload": [{
//					"ctrl": {
//						"cmd": 10,
//						"sw": 0,
//						"handle": 6
//					},
//					"clusterID": 1
//				}]
//			};
//			msg = '10007';
//			break;
//
//		default:
//			alert("err");
//	}
//
//	common = JSON.stringify(common);
//	message = new Messaging.Message(common);
//	message.destinationName = 'ctrl/' + window.phone + '/'+'30FFD4053143'+'/'+msg;
//	message._setQos(2);
//	client.send(message);
//}

function change(type) {
	var msg;
	switch(type) {
		//门锁10000
		case 'mensuo_kai':
			var common = {
				db_sbID: 10000,
				"payload": [{
					"ctrl": {
						"cmd": 10,
						"sw": 255,
						"handle": 5
					},
					"clusterID": 1
				}]
			};
			msg = 'ctrl/' + window.phone + '/38FFD2053058/10000';
			break;
			//大厅灯10002
			//SW 255开  SW 0关  clusterID 灯的id  可以传多个也可以传一个，最多传6个id
		case 'datingdeng_kai':
			var common = {
				db_sbID: 10002,
				"payload": [{
					"ctrl": {
						"cmd": 10,
						"sw": 255,
						"handle": 5
					},
					"clusterID": 1
				}]
			};
			msg = 'ctrl/' + window.phone + '/ec3dfd2f4c94/10002';
			break;
		case 'datingdeng_guan':
			var common = {
				db_sbID: 10002,
				"payload": [{
					"ctrl": {
						"cmd": 10,
						"sw": 0,
						"handle": 6
					},
					"clusterID": 1
				}]
			};
			msg = 'ctrl/' + window.phone + '/ec3dfd2f4c94/10002';
			break;
			//卧室灯10002
		case 'woshideng_kai':
			var common = {
				db_sbID: 10002,
				"payload": [{
					"ctrl": {
						"cmd": 10,
						"sw": 255,
						"handle": 5
					},
					"clusterID": 2
				}]
			};
			msg = 'ctrl/' + window.phone + '/ec3dfd2f4c94/10002';
			break;
		case 'woshideng_guan':
			var common = {
				db_sbID: 10002,
				"payload": [{
					"ctrl": {
						"cmd": 10,
						"sw": 0,
						"handle": 6
					},
					"clusterID": 2
				}]
			};
			msg = 'ctrl/' + window.phone + '/ec3dfd2f4c94/10002';
			break;
			//厨房灯10002
		case 'chufangdeng_kai':
			var common = {
				db_sbID: 10002,
				"payload": [{
					"ctrl": {
						"cmd": 10,
						"sw": 255,
						"handle": 5
					},
					"clusterID": 3
				}]
			};
			msg = 'ctrl/' + window.phone + '/ec3dfd2f4c94/10002';
			break;
		case 'chufangdeng_guan':
			var common = {
				db_sbID: 10002,
				"payload": [{
					"ctrl": {
						"cmd": 10,
						"sw": 0,
						"handle": 6
					},
					"clusterID": 3
				}]
			};
			msg = 'ctrl/' + window.phone + '/ec3dfd2f4c94/10002';
			break;
			//灯4 10002
		case 'deng4_kai':
			var common = {
				db_sbID: 10002,
				"payload": [{
					"ctrl": {
						"cmd": 10,
						"sw": 255,
						"handle": 5
					},
					"clusterID": 4
				}]
			};
			msg = 'ctrl/' + window.phone + '/ec3dfd2f4c94/10002';
			break;
		case 'deng4_guan':
			var common = {
				db_sbID: 10002,
				"payload": [{
					"ctrl": {
						"cmd": 10,
						"sw": 0,
						"handle": 6
					},
					"clusterID": 4
				}]
			};
			msg = 'ctrl/' + window.phone + '/ec3dfd2f4c94/10002';
			break;
			//灯5 10002
		case 'deng5_kai':
			var common = {
				db_sbID: 10002,
				"payload": [{
					"ctrl": {
						"cmd": 10,
						"sw": 255,
						"handle": 5
					},
					"clusterID": 5
				}]
			};
			msg = 'ctrl/' + window.phone + '/ec3dfd2f4c94/10002';
			break;
		case 'deng5_guan':
			var common = {
				db_sbID: 10002,
				"payload": [{
					"ctrl": {
						"cmd": 10,
						"sw": 0,
						"handle": 6
					},
					"clusterID": 5
				}]
			};
			msg = 'ctrl/' + window.phone + '/ec3dfd2f4c94/10002';
			break;
			//灯6 10002
		case 'deng6_kai':
			var common = {
				db_sbID: 10002,
				"payload": [{
					"ctrl": {
						"cmd": 10,
						"sw": 255,
						"handle": 5
					},
					"clusterID": 6
				}]
			};
			msg = 'ctrl/' + window.phone + '/ec3dfd2f4c94/10002';
			break;
		case 'deng6_guan':
			var common = {
				db_sbID: 10002,
				"payload": [{
					"ctrl": {
						"cmd": 10,
						"sw": 0,
						"handle": 6
					},
					"clusterID": 6
				}]
			};
			msg = 'ctrl/' + window.phone + '/ec3dfd2f4c94/10002';
			break;
			//空气净化器10003
			//SW 255开  SW 0关  空气净化器
		case 'kongqijinghuaqi_kai':
			var common = {
				db_sbID: 10003,
				"payload": [{
					"ctrl": {
						"cmd": 10,
						"sw": 255,
						"handle": 5
					},
					"clusterID": 1
				}]
			};
			msg = 'ctrl/' + window.phone + '/ec3dfd2f4c94/10003';
			break;
		case 'kongqijinghuaqi_guan':
			var common = {
				db_sbID: 10003,
				"payload": [{
					"ctrl": {
						"cmd": 10,
						"sw": 0,
						"handle": 6
					},
					"clusterID": 1
				}]
			};
			msg = 'ctrl/' + window.phone + '/ec3dfd2f4c94/10003';
			break;
			//浴室帘10004
			//窗帘 SW 255开  SW 0关，location>0的时候会走相应的位置，location为0的时候，会走sw
		case 'yushilian_kai':
			var common = {
				db_sbID: 10004,
				"payload": [{
					"ctrl": {
						"cmd": 10,
						"sw": 255,
						"location": 255,
						"handle": 5
					},
					"clusterID": 1
				}]
			};
			msg = 'ctrl/' + window.phone + '/ec3dfd2f4c94/10004';
			break;
		case 'yushilian_guan':
			var common = {
				db_sbID: 10004,
				"payload": [{
					"ctrl": {
						"cmd": 10,
						"sw": 0,
						"location": 0,
						"handle": 6
					},
					"clusterID": 1
				}]
			};
			msg = 'ctrl/' + window.phone + '/ec3dfd2f4c94/10004';
			break;
			//空调10005转10008
		case 'kongtiao_kai':
			var common = {
				"db_sbID": 10008,
				"payload": [{
					"ctrl": {
						"learnmode": 0,
						"cmd": 10,
						"sw": 255,
						"handle": 5
					},
					"clusterID": 1
				}]
			};
			msg = 'ctrl/' + window.phone + '/38FFD2053058/10008';
			break;
		case 'kongtiao_guan':
			var common = {
				"db_sbID": 10008,
				"payload": [{
					"ctrl": {
						"learnmode": 0,
						"cmd": 10,
						"sw": 0,
						"handle": 6
					},
					"clusterID": 1
				}]
			};
			msg = 'ctrl/' + window.phone + '/38FFD2053058/10008';
			break;
		case 'wendu_jia':
			var common = {
				"db_sbID": 10008,
				"payload": [{
					"ctrl": {
						"learnmode": 0,
						"cmd": 10,
						"temp": 30
					},
					"clusterID": 1
				}]
			};
			msg = 'ctrl/' + window.phone + '/38FFD2053058/10008';
			break;
		case 'wendu_jian':
			var common = {
				"db_sbID": 10008,
				"payload": [{
					"ctrl": {
						"learnmode": 0,
						"cmd": 10,
						"temp": eval(window.jsonData.payload[0].ctrl.temp - 1)
					},
					"clusterID": 1
				}]
			};
			msg = 'ctrl/' + window.phone + '/38FFD2053058/10008';
			break;
			//电视机10006转10008
		case 'dianshiji_kai':
			var common = {
				"db_sbID": 10008,
				"payload": [{
					"ctrl": {
						"sw": 255,
						"learnmode": 1,
						"cmd": 10,
						"position": 0,
						"functions": 0,
						"times": 5,
						"handle": 5
					},
					"clusterID": 1
				}]
			};
			msg = 'ctrl/' + window.phone + '/38FFD2053058/10008';
			break;
		case 'dianshiji_guan':
			var common = {
				"db_sbID": 10008,
				"payload": [{
					"ctrl": {
						"sw": 0,
						"learnmode": 1,
						"cmd": 10,
						"position": 0,
						"functions": 0,
						"times": 5,
						"handle": 6
					},
					"clusterID": 1
				}]
			};
			msg = 'ctrl/' + window.phone + '/38FFD2053058/10008';
			break;
			//电视音量加减
		case 'dianshiji_yinliang_jia':
			var common = {
				db_sbID: 10008,
				"payload": [{
					"ctrl": {
						//		                "volume" : 30,
						"position": 8,
					},
					"clusterID": 1
				}]
			};
			msg = 'ctrl/' + window.phone + '/38FFD2053058/10008';
			break;
		case 'dianshiji_yinliang_jian':
			var common = {
				db_sbID: 10008,
				"payload": [{
					"ctrl": {
						//		                "volume" : 10,
						"position": 9,
					},
					"clusterID": 1
				}]
			};
			msg = 'ctrl/' + window.phone + '/38FFD2053058/10008';
			break;
			//电视上右下左
		case 'dianshiji_shang':
			var common = {
				"db_sbID": 10008,
				"payload": [{
					"ctrl": {
						"learnmode": 1,
						"cmd": 10,
						"position": 3,
						"functions": 0,
						"times": 5,
					},
					"clusterID": 1
				}]
			};
			msg = 'ctrl/' + window.phone + '/38FFD2053058/10008';
			break;
		case 'dianshiji_you':
			var common = {
				"db_sbID": 10008,
				"payload": [{
					"ctrl": {
						"learnmode": 1,
						"cmd": 10,
						"position": 6,
						"functions": 0,
						"times": 5,
					},
					"clusterID": 1
				}]
			};
			msg = 'ctrl/' + window.phone + '/38FFD2053058/10008';
			break;
		case 'dianshiji_xia':
			var common = {
				"db_sbID": 10008,
				"payload": [{
					"ctrl": {
						"learnmode": 1,
						"cmd": 10,
						"position": 4,
						"functions": 0,
						"times": 5,
					},
					"clusterID": 1
				}]
			};
			msg = 'ctrl/' + window.phone + '/38FFD2053058/10008';
			break;
		case 'dianshiji_zuo':
			var common = {
				"db_sbID": 10008,
				"payload": [{
					"ctrl": {
						"learnmode": 1,
						"cmd": 10,
						"position": 5,
						"functions": 0,
						"times": 5,
					},
					"clusterID": 1
				}]
			};
			msg = 'ctrl/' + window.phone + '/38FFD2053058/10008';
			break;
			//煤气阀10007
		case 'meiqifa_kai':
			var common = {
				db_sbID: 10007,
				"payload": [{
					"ctrl": {
						"cmd": 10,
						"sw": 255,
						"handle": 5
					},
					"clusterID": 1
				}]
			};
			msg = 'ctrl/' + window.phone + '/38FFD2053058/10007';
			break;
		case 'meiqifa_guan':
			var common = {
				db_sbID: 10007,
				"payload": [{
					"ctrl": {
						"cmd": 10,
						"sw": 0,
						"handle": 6
					},
					"clusterID": 1
				}]
			};
			msg = 'ctrl/' + window.phone + '/38FFD2053058/10007';
			break;

		default:
			alert("err");
	}

	common = JSON.stringify(common);
	message = new Messaging.Message(common);
	message.destinationName = msg;
	message._setQos(2);
	//  client.send(message,{},function(){alert(1)});
	client.send(message);
}

//全部界面上面的全部楼
$.ajax({
	url: 'http://icadmin.lchtime.cn:8001/index.php/user/user/myidentity',
	type: 'post',
	dataType: "json",
	data: {
		ui_id: 5,
		type: 1
	},
	success: function(res) {
		for(var i=0;i<res.data.list.length;i++){
			$('.louhao').append("<div class='div2' mg_id='"+res.data.list[i].mg_id+"'><div class='div2_'></div><span>"+res.data.list[i].mg_name+"</span></div>")
		}
		//全部界面
		$('.quanbu .left .louhao .div2').on('click', function() {
			$('.quanbu').hide();
			$('.moulou').show();
			$('.title img').show();
			var mg_id = $(this).attr('mg_id');
			
			//全部界面上面的全部楼
			$.ajax({
				url: 'http://icadmin.lchtime.cn:8001/index.php/user/user/myidentity',
				type: 'post',
				dataType: "json",
				data: {
					ui_id: 5,
					type: 3,
					mg_id:mg_id
				},
				success: function(res) {
					console.log(res)
					$('.moulou .left .weizhi .weizhi_name:first').html(res.data.list[0].mg_name);
					for(var i = 0; i < res.data.list[0].child.length; i++) {
						$('.moulou .left .weizhi:last').after('<div class="weizhi"><div class="weizhi_name">'+res.data.list[0].child[i].mg_memo+'</div></div>');
						var str;
						for(var i = 0; i < res.data.list[0].child.length; i++){
							
						}
						$('.moulou .left .weizhi:last').after('<div class="menhao"><div class="div2"><div class="div2_"></div><span>151</span></div><div class="div2"><div class="div2_"></div><span>'+'102'+'</span></div></div>');
						
					}
					
					//楼层切换
					$('.moulou .weizhi').on('click', function() {
						$('.menhao').hide();
						$(this).next().show();
					})
				},
				error: function(res) {
					console.log(res)
				}
			})
		})
	},
	error: function(res) {
		console.log(res);
	}
})


$(function() {
	//检查浏览器是否断线
	setInterval(function(){
		var line =navigator.onLine;
		if(!line){
			$('.mask').show();
			$('.mask .information').html('网络中断 ，请检查网络连接。');
		}else{
			$('.mask').hide();
			$('.mask .information').html('');
		}
	},1000);
	//搜索人位置
	$('.moulou .left .weizhi img').on('click',function(){
		var query =  $('.moulou .left .weizhi .sousuoinput').val();
		if(query.length == 1){
			//用户ID
			var ty = 2;
		}else if(query.length == 6){
			//卡号
			var ty = 0;
		}else if(query.length == 11){
			//手机号
			var ty = 1;
		}else{
			alert('请输入正确格式');
			return false;
		}
		$.ajax({
			url: 'http://icadmin.lchtime.cn:8001/index.php/user/user/RFIDRecordForUser',
			type: 'post',
			dataType: "json",
			data: {
				id: query,
				type: ty,
				action: 0
			},
			success: function(res) {
				console.log(res)
				if(res.error == 'succ'){
					var res_ = res.data.record_list[0]
					alert(
						'卡片号:'+res_.pr_uc_cardID+'\n'+
						'经纬度:'+res_.pr_location+'\n'+
						'房间号:'+res_.pr_position+'\n'+
						'最后进入这个房间的时间:'+res_.pr_time+'\n'
					)
				}else if(res.error != 'succ'){
					alert(
						'并没有找到这个人，请确定输入了正确的搜索值。'
					)
				}
			},
			error: function(res) {
				console.log(res)
				alert(
					'未连到服务器，请稍候再试。'
				)
			}
		})
	})
	//实时参数
	//时间
	function nowTime(where){
		setInterval(function() {
			function toDB(iNum) {
				return iNum > 9 ? '' + iNum : '0' + iNum;
			}
			var now = new Date();
			var year = now.getFullYear();
			var month = now.getMonth() + 1;
			var day = now.getDate();
			var hour = now.getHours();
			var mint = now.getMinutes();
			var wek = now.getDay();
			month = toDB(month);
			day = toDB(day);
			hour = toDB(hour);
			mint = toDB(mint);
			var wek2zh = {
				0: '星期日',
				1: '星期一',
				2: '星期二',
				3: '星期三',
				4: '星期四',
				5: '星期五',
				6: '星期六',
			}
			$(where).html(year + '/' + month + '/' + day + ' ' + hour + ':' + mint + ' ' + wek2zh[wek]);
		}, 100)
	}
	nowTime('.shijian');
	
//	if(window.mqttconnected == true){
////		门锁开关记录
//		$.ajax({
//			url: 'http://icadmin.lchtime.cn:8001/index.php/device/control/gethandlehistory',
//			type: 'post',
//			dataType: "jsonp",
//			data: {
//				ui_id: 3,
//				db_sbID: '10000',
//				type: 1,
//				date: '2017-01-01'
//			},
//			success: function(res) {
//				console.log(res)
//				for(var i = 0; i < res.data.history_list.length; i++) {
//					$('.mensuo .left .jilu tbody>tr:last').after('<tr><td>' + res.data.history_list[i].dhh_time.split(' ')[1] + '</td><td>开启</td><td>' + res.data.history_list[i].dhh_time.split(' ')[1] + '</td><td>关闭</td></tr>');
//				}
//			},
//			error: function(res) {
//				console.log(res);
//			}
//		})
//	}
	//界面切换
	//地图界面
	//	$('.ditu .jinru').on('click', function() {
	//		$('.ditu').hide()
	//		$('.quanbu').show()
	//		$('.title img').show();
	//	})
	//贵宾楼1
	$('.area .guibinlou1').on('click', function() {
		$('.quanbu').hide();
		$('.moulou').show();
		$('.title img').show();
	})
	//某楼界面
	$('.moulou .left .menhao .div2').eq(0).on('click', function() {
		//
		linkParameter(5);
		window.phone = 5;
		$('.moulou').hide();
		$('.zhuye').show();
	})
	$('.moulou .left .menhao .div2').eq(1).on('click', function() {
		linkParameter(1);
		window.phone = 1;
		$('.moulou').hide();
		$('.zhuye').show();
	})
	//主页上面的各个设备点击后进入设备详情
	$('.zhuye .div1 .more').on('click', function(e) {
		e.stopPropagation();
		var tit = $(this).parent().find('.name').html();
		var equname = $(this).parent().attr('class').split(' ');
		$('.zhuye').fadeOut(500, function() {
			$('.'+equname[1]).fadeIn(500);
			$('.title img').fadeIn(500);
			$('.title span').html(tit);
		});
	})
	//界面返回
	$('.title img').on('click', function() {
		if($('.zhuye').is(':hidden') && $('.moulou').is(':hidden') && $('.quanbu').is(':hidden')) {
			$('.zhuti > .zhuye').nextAll().fadeOut(500, function() {
				$('.zhuye').fadeIn(500);
				$('.title span').html('智慧社区');
			});
		} else if($('.zhuye').is(':visible')) {
			unlinkParameter(5);
			unlinkParameter(1);
			window.phone = 0;
			$('.moulou').show();
			$('.zhuye').hide();
		} else if($('.moulou').is(':visible')) {
			$('.moulou').hide();
			$('.quanbu').show();
			$('.title img').show();
		} else if($('.quanbu').is(':visible')) {
			window.open('1.html', '_self');
		}
	})
	//控制设备
	//空调
	control('kongtiao');
	//空调温度加减
	$('.kongtiao .right .kongzhi .kongzhiwendu table .shang').on('click', function() {
		change('wendu_jia');
	})
	$('.kongtiao .right .kongzhi .kongzhiwendu table .xia').on('click', function() {
		change('wendu_jian');
	})
	//空调日周月切换
	$('.kongtiao .left .jilu_ .jl div').on('click', function() {
		$(this).addClass('on').siblings().removeClass('on')
	})
	//空调事件记录显示隐藏
	$('.kongtiao .left .jilu .jl .sjjl').on('click', function() {
//		if($('.kongtiao .left .jilu table').is(':visible')){
//			$('.kongtiao .left .jilu table').hide();
//			$('.kongtiao .left .jilu').css({'height':'4rem','top':'14rem'});
//			$('.kongtiao .left .jilu .jl .sjjl img').css({
//				'transform': 'rotate(-180deg)',
//              '-ms-transform': 'rotate(-180deg)',
//              '-moz-transform': 'rotate(-180deg)',
//              '-webkit-transform': 'rotate(-180deg)',
//              '-o-transform': 'rotate(-180deg)',})
//		}else{
//			$('.kongtiao .left .jilu table').show();
//			$('.kongtiao .left .jilu').css({'height':'18rem','top':'28rem'});
//			$('.kongtiao .left .jilu .jl .sjjl img').css({
//				'transform': 'rotate(-0deg)',
//              '-ms-transform': 'rotate(-0deg)',
//              '-moz-transform': 'rotate(-0deg)',
//              '-webkit-transform': 'rotate(-0deg)',
//              '-o-transform': 'rotate(-0deg)',})
//		}
	})
	//电视机
	control('dianshiji');
	//电视机音量控制
	$('div.dianshiji .right .kongzhi .kongzhiyinliang table tbody tr td.cur_p:eq(0)').on('click', function() {
		change('dianshiji_yinliang_jia');
	})
	$('div.dianshiji .right .kongzhi .kongzhiyinliang table tbody tr td.cur_p:eq(1)').on('click', function() {
		change('dianshiji_yinliang_jian');
	})
	//上下左右
	$('div.dianshiji .right .kongzhi .kongzhipindao table tbody tr:eq(0) td.cur_p:eq(1)').on('click', function() {
		change('dianshiji_shang');
	})
	$('div.dianshiji .right .kongzhi .kongzhipindao table tbody tr:eq(1) td.cur_p:eq(2)').on('click', function() {
		change('dianshiji_you');
	})
	$('div.dianshiji .right .kongzhi .kongzhipindao table tbody tr:eq(2) td.cur_p:eq(1)').on('click', function() {
		change('dianshiji_xia');
	})
	$('div.dianshiji .right .kongzhi .kongzhipindao table tbody tr:eq(1) td.cur_p:eq(0)').on('click', function() {
		change('dianshiji_zuo');
	})
	//大厅灯
	control('datingdeng');
	//卧室灯
	control('woshideng');
	//厨房灯
	control('chufangdeng');
	//灯4
	control('deng4');
	//灯5
	control('deng5');
	//灯6
	control('deng6');
	//门锁
	control('mensuo');
	//空气净化器
	control('kongqijinghuaqi');
	//空气净化器风速切换
	$('.kongqijinghuaqi .right .kongzhi .kongzhifengli .qiangdu table img').on('click', function() {
		$(this).parent().parent().find('img').removeClass('on');
		$(this).addClass('on');
	})
	//浴室帘
	control('yushilian');
	//拖拽 打开位置
	function drag() {
		var obj1 = $('.yushilian .right .kongzhi .jindutiao .jindutiao_ .quan1');
		var obj2 = $('.yushilian .right .kongzhi .jindutiao_');
		var obj3 = $('.yushilian .right .kongzhi .jindutiao');
		obj1.bind('mousedown', start);
	
		function start(e) {
			var ol = obj1.offset().left - obj2.offset().left;
			deltaX = e.pageX - ol;
			$(document).bind({
				'mousemove': move,
				'mouseup': stop
			});
			return false;
		}
	
		function move(e) {
			obj1.css({
				'left': (e.pageX - obj2.offset().left - 15),
			});
			obj2.css({
				'width': (e.pageX - obj2.offset().left),
			});
			if(obj1.offset().left - obj2.offset().left < 0) {
				obj1.css({
					'left': (0),
				});
				obj2.css({
					'width': (0),
				});
				change('yushilian_guan');
				equipmentStateOff();
			} else if(obj1.offset().left - obj2.offset().left >= obj3.width()) {
				obj1.css({
					'left': obj3.width() - 15,
				});
				obj2.css({
					'width': obj3.width(),
				});
			}
			return false;
		}
		function stop() {
			$(document).unbind({
				'mousemove': move,
				'mouseup': stop
			});
		}
	}
	drag();
	//煤气阀
	control('meiqifa');
})