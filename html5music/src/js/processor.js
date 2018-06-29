(function($, root){
    var $scope = $(document.body);
    var curDuration;
    var frameId;
    var lastPercent = 0;
    var starTime;
    // 把秒转化成分和秒
    function formatTime(duration){
        duration = Math.round(duration); // 把秒钟向上取整 最接近的整数
        var minute = Math.floor(duration / 60); 
        var second = duration - minute * 60;
        if(minute < 10){
            minute = "0" + minute;
        }
        if(second < 10){
            second = "0" + second;
        }
        return minute +":"+ second;
    }
    function renderAllTime(duration) {
        lastPercent = 0; // 传一个0进去 让上一首跳转的时候程序归0
        curDuration = duration;
        var allTime = formatTime(duration);
        $scope.find(".all-time").html(allTime);
    }
    function updata(precent) { 
        var curTime = precent * curDuration;  // 一个总的时间  百分比 * 一个总的时间 得出当前总的时间
        curTime = formatTime(curTime);      // 转化时间  通过Math.round()把时间转化成整数秒
        $scope.find(".cur-time").html(curTime); //把当前时间插入当HTML中
        //更新进度条  
        var percentage = (precent - 1) * 100 + "%"; //  0 - 1 * 100% = 1
        $scope.find(".pro-top").css({
            transform: "translateX(" + percentage + ")"
        })
    }
    function start(precentage) {
        lastPercent = precentage === undefined ? lastPercent : precentage; //4.解决离开播放进度条时间不动 如果它lastPERcent、precentaged等于undefined的话就执行自己的 如果不等于undefined的话 就执行传进来的lastPERcent、precentaged
        cancelAnimationFrame(frameId); //清掉上一个进度条
        starTime = new Date().getTime();
        function frame(){
            var curTime = new Date().getTime();
            var precent = lastPercent + (curTime - starTime) / (curDuration * 1000); //curDuration 总时间   当前时间 - 登入时间 / 总时间*1000 = 百分比   （时间选择是秒除以1000就是毫秒了）
            if(precent < 1){
                frameId = requestAnimationFrame(frame);
                updata(precent); //写了updata函数更新 把当前的一个百分比放当函数里去
            }else{
                cancelAnimationFrame(frameId);
            }
        }
        frame();
    }
    // 暂停的一个方法  找到点击那个函数把他写进去
    function stop(){
        var stopTime = new Date().getTime(); //获取当前的一个时间
        lastPercent = lastPercent + (stopTime - starTime) / (curDuration * 1000); //记录当前的一个时间 重复暂停播放的时候 防止归0  重新播放
            // lasPercent 叠加 不加的话 就是重复上一次的 一直都是一秒 2秒  依次叠加的话开始暂停就不会出现问题了 所以这里得加上一个lastPercent
        cancelAnimationFrame(frameId);
    }
    root.processor = {
        renderAllTime : renderAllTime,  //等会还要用 所以就把rendAllTime对象写成一个属性了
        start : start,
        stop : stop,
        updata: updata
    }
})(window.Zepto,window.player || (window.player = {} ));

// Math.floor(x) 数学函数里的浮点函数  返回小于参数x的最大整数，即对浮点数向下取整


//requestAnimationFrame 不管理回调函数队列，而滚动、触摸这类高触发频率事件的回调可能会在同一帧内触发多次。
//所以正确使用 requestAnimationFrame 的姿势是，在同一帧内可能调用多次 requestAnimationFrame 时，要管理回调函数，防止重复绘制动画。


// cancelAnimationFrame
// 1、 cancelAnimationFrame 方法用于取消先前安排的一个动画帧更新的请求。
// 2、 当调用cancelAnimationFrame(handle) 时， 浏览器会设置该handle指向的回调函数的cancelled为true。
// 无论该回调函数是否在动画帧请求回调函数列表中， 它的cancelled都会被设置为true。
// 3. 如果该handle没有指向任何回调函数， 则调用cancelAnimationFrame 不会发生任何事情。
// 4. 注意： 在requestAnimationFrame的callback内部执行cancelAnimationFrame不能取消动画