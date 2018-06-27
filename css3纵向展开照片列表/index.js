var $wrapper = $('.wrapper');

var timer = setTimeout(function () {
    $wrapper.removeClass('init');
}, 200);

$('.item').on('click', function () {
    $wrapper.addClass('wrapper-active');
    $(this).addClass('active');
});
$('.close').on('click', function(e) {
    // 防止冒泡
    e.stopPropagation();
    $wrapper.removeClass('wrapper-active');
    $('.active').removeClass('active');
})