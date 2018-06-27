var ppt = {
    $lbt: $('.lbt'),
    $slider: $('.slider'),
    len: $('.slider').length,
    nowIndex: 0,
    lastIndex: undefined,
    flag: true,
    slider_timer: undefined,
    init: function () {
        if (this.len > 1) {
            this.createDom(this.len);
            this.bindEvent();
            this.slider_auto();
        }
    },
    createDom: function (len) {
        var str = '';
        for (var i = 0; i < len; i++) {
            if (i == 0) {
                str += '<li class="active"></li>';
            } else {
                str += '<li></li>';
            }
        }
        str = '<div class="slider-order"><ul>' + str + '</ul></div>';
        this.$lbt.append(str);
        this.$lbt.append('<div class="slider-btn">\
            <span class="left-btn"></span>\
            <span class="right-btn"></span>\
        </div>');
    },
    bindEvent: function () {
        var _this = this;
        $('.slider-order li').add($('.left-btn')).add($('.right-btn')).on('click', function () {
            if ($(this).attr('class') == 'left-btn') {
                _this.tool('left');
            } else if ($(this).attr('class') == 'right-btn') {
                _this.tool('right');
            } else {
                var index = $(this).index();
                _this.tool(index);
            }
        });
        this.$slider.on('go', function () {
            $(this).fadeOut(300)
                .find($('p')).animate({
                    fontSize: '16px'
                });
        })
        this.$slider.on('come', function () {
            $(this).delay(300).fadeIn(300)
                .find($('p')).delay(300).animate({
                    fontSize: '20px'
                }, function () {
                    _this.flag = true;
                });
        })
    },
    tool: function (direction) {
        if (this.flag) {
            this.getIndex(direction);
            if (this.nowIndex != this.lastIndex) {
                this.flag = false;
                this.nowOrderStyle(this.nowIndex);
                this.$slider.eq(this.lastIndex).trigger('go');
                this.$slider.eq(this.nowIndex).trigger('come');
                clearTimeout(this.slider_timer);
                this.slider_auto();
            }
        }
    },
    getIndex: function (direction) {
        this.lastIndex = this.nowIndex;
        if (direction == 'left' || direction == 'right') {
            if (direction == 'left') {
                this.nowIndex = this.nowIndex == 0 ? this.len - 1 : this.nowIndex - 1;
            } else {
                this.nowIndex = this.nowIndex == this.len - 1 ? 0 : this.nowIndex + 1;
            }
        } else {
            this.nowIndex = direction;
        }
    },
    nowOrderStyle: function (index) {
        $('.active').removeClass('active');
        $('.slider-order li').eq(index).addClass('active');
    },
    slider_auto: function () {
        var _this = this;
        if (this.len > 1) {
            clearTimeout(_this.slider_timer);
            _this.slider_timer = setTimeout(function () {
                _this.tool('right');
            }, 3000);
        }
    },
}
ppt.init();
