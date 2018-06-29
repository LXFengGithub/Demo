var $ = window.Zepto;
var root = window.player;
var $scope = $(document.body);
var songList;
var controlmanager;
// var index = 0;
var audio = new root.audioManager(); // 构造一个对象audio

function bindClick(){
    // 上一首 下一首的切换 我们可以写成一个自定义事件play:change 用trigger能触发  因为等会还要做其他操作 这样可以减少代码的重复性做了一个简单的提取  写在一个函数里也是可以的
    $scope.on("play:change", function(event, index, flog){
        audio.setAudioSource(songList[index].audio);
        if(audio.status == "play" || flog){ //判断如果是play状态的话 点击下一首的时候会直接播放
            audio.play();
            root.processor.start(); // 调用这个函数 让进度条重新开始 然后会发现这个进度条有2个 暂停这一个哪一个就在走 所以我就要在start下cancelAnimationFrame(frameId)
        }
        root.processor.renderAllTime(songList[index].duration);
        root.render(songList[index]);
        root.processor.updata(0); // 这个0是点击下一首上一首的时候界面归0 但是点击开始程序还是跳到了上一首播放时间
    })
    //移动端click有300ms的延迟 浏览器自带 如果300ms里在次点击 会判断是双击  fastclick这个库可以解决移动端click 300ms的延迟 
    $scope.on("click",".prev-btn", function(){
        // if(index === 0 ){
        //     index = songList.length -1 ;
        // }else{
        //     index--;
        // }
        var index = controlmanager.prev();
        //  root.render(songList[index]);
        $scope.trigger("play:change", index); // 用trigger触发这个play:change这个函数
    })
    $scope.on("click",".next-btn", function(){
            // if (index === songList.length - 1) {
            //     index = 0;
            // } else {

            //     index++;
            // }
        var index = controlmanager.next();
        // root.render(songList[index]);
        $scope.trigger("play:change", index);

    })
    //播放
    $scope.on("click", ".play-btn",function(){
        if(audio.status == "play"){
            // $(this).removeClass("playing");
            audio.pause();
            root.processor.stop();
        }else{
            // $(this).addClass("playing");
            root.processor.start();
            audio.play();
        }
        $(this).toggleClass("playing") // 有了这个toggleClaa事件 就不用remove更add了 toggleClass作用是有就取消没有就加上 
    })
    //列表
     $scope.on("click", ".list-btn", function(){
         root.playList.show(controlmanager);
     })
}
// 拖拽一个进度条
function bindTouch(){
    var $slidePoint = $scope.find(".slider-point");
    var offset = $scope.find(".pro-wrapper").offset();
    var left = offset.left;
    var width = offset.width;
    //绑定拖拽事件 开始拖拽 ： 取消进度条渲染
    $slidePoint.on("touchstart",function(){
        root.processor.stop(); // 1.拖拽的时候 让进度条停止
    }).on("touchmove", function(e){
        //计算百分比 更新我们的当前时间的进度条
        var x = e.changedTouches[0].clientX; //2.拖拽的时候 获取tuchmove事件 clientx轴上的一个进度条的一个值 计算它的一个百分比
        var percent = (x - left) / width;
        if(percent > 1 || percent < 0 ){  // 不能脱出指定范围
            percent = 0 ; 
        }
        root.processor.updata(percent);  // 得当百分比之后 我们这个进度条时间也跟着刷新
    }).on("touchend", function(e){     // 3.松开手
        // 计算百分比 跳转播放 重新开始进度条渲染
        var x = e.changedTouches[0].clientX;
        var percent = (x - left) / width;
        if (percent > 1 || percent < 0) {
            percent = 0;
        }
        var curDuration = songList[controlmanager.index].duration; // 松开手后就跳转到当前音乐播放的一个时间点   duration是一个总的时间
        var curTime = curDuration * percent;  // 计算 总的时间 * 百分比 = 当前时间 
        audio.jumpToplay(curTime);   // 把拖拽的当前时间curTime传到jumpToplay()播放时间同步
        root.processor.start(percent);  // 拖拽完后离开立刻执行start播放
        $scope.find(".play-btn").addClass("playing");
    })
}
function getData(url) {
    $.ajax({
        type: "GET",
        url: url,
        success: function (data) {
            bindClick();
            bindTouch();
            root.playList.renderList(data);
            controlmanager = new root.controlManager(data.length);
            songList = data;
            $scope.trigger("play:change",0);

        },
        error: function () {
            console.log("error")
        }
    })
}

getData("../mock/data.json");

// touchstart事件： 当手指触摸屏幕时候触发， 即使已经有一个手指放在屏幕上也会触发。
// touchmove事件： 当手指在屏幕上滑动的时候连续地触发。 在这个事件发生期间， 调用preventDefault() 事件可以阻止滚动。
// touchend事件： 当手指从屏幕上离开的时候触发。
// touchcancel事件： 当系统停止跟踪触摸的时候触发。

