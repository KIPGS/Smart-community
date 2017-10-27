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