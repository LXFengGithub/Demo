(function($, root){
    var $scope = $(document.body);
    function audioManager() {
        this.audio = new Audio();
        this.status = "pause";
        this.bindEvent();
    }
    audioManager.prototype = {
        //绑定监听歌曲是否播放完成事件
        bindEvent : function(){
            $(this.audio).on("ended" , function () {
                $scope.find(".next-btn").trigger("click")
            })
        },
            // 音频上的2个状态 play pause 暂停跟播放
        play: function () {
                this.audio.play();
                this.status = "play";
            },
        pause: function () {
            this.audio.pause();
            this.status = "pause";
        },
            // 需要更换一个图片 所以this.audio.src 等于一个新的 src
       setAudioSource: function (src) {
           this.audio.src = src;
           this.audio.load();
       },
       jumpToplay: function (time) {  
           this.audio.currentTime = time;
           this.play();
       }
    }
     root.audioManager = audioManager;
})(window.Zepto, window.player || (window.player = {}))

// audio / video DOM currentTime 属性
//  currentTime 属性设置或返回音频 / 视频播放的当前位置（ 以秒计）。
//  当设置该属性时， 播放会跳跃到指定的位置。