 var oLiList = document.getElementsByTagName('li');
 var oLi =  Array.prototype.slice.call(oLiList);

 oLi.forEach(function(ele, index) {
 	ele.spec = getSpec(ele);
 	ele.addEventListener('mouseenter', function(e) {
 		addClass(e, ele, 'in');
 	})
 	ele.addEventListener('mouseleave', function(e) {
 		addClass(e, ele, 'out');
 	})
 })
function getSpec(ele) {
	return {
		w: ele.offsetWidth,
		h: ele.offsetHeight
	}

}
 function direction(e, ele) {
 	var x = e.offsetX - ele.spec.w/2;
 	var y = e.offsetY - ele.spec.h/2;
 			                // 弧度*度 得出一个角度
 	var d = (Math.round((Math.atan2(y, x) * (180/Math.PI) + 180)/90) + 3)%4;
	 console.log(d);
	 console.log(111);
 	return d;
 }
 function addClass(e, ele, state) {
 	var d = direction(e, ele);
 	var dir;
 	switch(d) {
 		case 0:
			 dir = '-top';
			 break;
 		case 1:
			 dir = '-right';
			 break; 
 		case 2:
			 dir = '-bottom';
			 break;
 		case 3:
			 dir = '-left';
 	}

 	ele.className = state + dir;
 }