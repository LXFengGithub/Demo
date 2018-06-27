// 点击开始游戏 -->> 动态生成100个小格子  100div
// leftClick 没有雷 -->> 显示数字 （代表当前小格子为中心周围8个格字的雷数 就是除了你点击的那个雷其他8个雷 9-1=8 ）
                        // 扩散（当前区域没用雷的时候继续扩散 当那个数字不是0的时候停止扩散 就是旁边有雷停止扩散）
        //  有雷  -->> game Over
// rightClick 没用标记 -->> 进行标记  有标记 -->> 取消标记 -->> 标记是否正确   10个都正确标记的话 提升成功
// 已经出现数字的格子的话 -->> 无效果 不可以标记

 var startBtn = document.getElementById('btn');
 var box = document.getElementById('box');
 var flagBox = document.getElementById('flagBox');
 var alertBox = document.getElementById('alertBox');
 var alertImg = document.getElementById('alertImg');
 var closeBtn = document.getElementById('close');
 var score = document.getElementById('score');
 var minesNum; // 雷的数量
 var mineOver; // 记录当前标记雷的数量
 var block;
 var mineMap = [];  // 这个数组是当前小格是否有雷
 var startGameBool = true;

bindEvent();
function bindEvent() {
    startBtn.onclick = function() {
        if(startGameBool){
            box.style.display = 'block';
            flagBox.style.display = 'block';
            init();
            startGameBool = false;
        }
        
    }
    // 游戏开始后取消contextmenu鼠标右击事件 吧true变成false
    box.oncontextmenu = function() {
        return false;
    }
    // 在box上绑定一个mousedown点击事件 mousedown鼠标落下后判断是左边还是右边 左边的话显示格子状态 右边的话插上小旗   再利用事件委托找到原事件 不能用click click只能左边点击 我们需要判断是左边点击还是右边点击
    box.onmousedown = function(e) {
        var event = e.target;  // 获取当前点击的是哪个小格
        // 区分一下当前点击的是左键还是右键 返回一个状态码   
        if (e.which == 1) { // which == 1 这个数字是按键码 (可以通过键盘与鼠标按键的键值对照表查看)
            leftClick(event);  // 如果等于一的话 就把当前鼠标操作的这个小格传进去
        }else if(e.which == 3) {
            rightClick(event);
    }
    // 给closeBtn添加一个点击事件 点击叉的时候清空
    closeBtn.onclick = function() { 
         alertBox.style.display = 'none';
         flagBox.style.display = 'none';
         box.style.display = 'none';
         box.innerHTML = '';  // 这个把box的innerHTML调成空 下一次在生成游戏就不用出现重叠
         startGameBool = true;
     }
}
// 生成100个小格 10个有雷
function init() {
    minesNum = 10;
    mineOver = 10;
    score.innerHTML = mineOver; // 这是因为防止当游戏雷数减少后 下次开局开始原来的数字    
    for(var i = 0; i < 10; i++){
        for(var j = 0; j < 10; j++){
            var con = document.createElement('div'); // creatElement 创建元素节点
            con.classList.add('block');  // 给每个小格加一个class样式 让每个小格最开始就拥有相同的clas样式
            con.setAttribute('id', i + '-' + j); // 给每一个元素设置一个单独的id 以自己的行和列为基础
            box.appendChild(con);  // 把小格插人到box里面去
            mineMap.push({mine: 0}); // 每循环一次mineMap里面就push一位 也就是数组增加一位 最后也是100长度的数组  有一个参数 这个参数mime也是对象值 初始是0
       }
    }
    block = document.getElementsByClassName('block'); //把100个小格子取出来
    while(minesNum) { // 有雷的话就生成一个雷   每次循环生成一次直到值为0
        var mineIndex = Math.floor(Math.random()*100);  // 在这100个格子中随机生成一个位置取整     Math.floor 向下取整 MAth.random 随机数
        if(mineMap[mineIndex].mine === 0) { // 这个数组的作用就是标记当前雷的状态 当前是没有的话 就让block生成一个雷
            mineMap[mineIndex].mine = 1;      // 生成一个雷后 改变当前mineIndex状态=1 下次就进不来这个mineIndex
            block[mineIndex].classList.add('isLei'); // 把随机生成的minIndex这个位置放到类数组block中再添加一个clss类名 表示这是雷            
            minesNum --;  // 生成一次后 总的雷数就会减一
        }
    }
}

// leftClick右击 传一个形参dom过来 接收当前哪个小格被点击了 可通过id的值找到那个小格
function leftClick(dom) {
    if(dom.classList.contains('flag')){ // 防止插旗的格子 还能被点击
    ruturn;
    }
    var isLei = document.getElementsByClassName('isLei'); // 把当前这个class='isLei'取过来
    if(dom && dom.classList.contains('isLei')) {  // 当前这个dom存在 并且 当前dom元素class类名contains包含isLei 就说明点到雷了 就gameOver  游戏结束
        console.log('gameOver');
        for(var i = 0; i < isLei.length; i++) {  // 点中isLei 就需要打印出所以的雷
            isLei[i].classList.add('show');  // 给打印出来的雷 添加一个class类名 改变一下样式
        }
        setTimeout(function() {
            alertBox.style.display = 'block';   // css样式显示出来
            alertImg.style.backgroundImage = 'url("img/over.jpg")';  // 把图片插入进去
        }, 800)
    }else {  // else 不是雷的话
        var n = 0;  // 这个n代表当前点击显示的那一个数字  用n这个数来记数 触发当前这个格 周围8个格 就需要知道当前触发这个格的一个位置
        var posArr = dom && dom.getAttribute('id').split('-'); // 在当前dom存在的情况下 建立一个数组储存数字 split去除'-' 数字在我们之前生成格子的时候就生成了
        var posX = posArr && +posArr[0];  // 进行一个容错处理 posArr && posArr[]
        var posY = posArr && +posArr[1];  // 因为是2个字符串链接所以要用+
        dom && dom.classList.add('num'); // 添加一个新的class名 使点击到的格子发生变化
              // i-1,j-1 i-1,j i-1,j-1  // 周围格子数字的一个矩阵
              // i,j-1   i,j   i,j-1
              // i+1,j-1 i+1,j i+1,j+1
        for(var i = posX - 1; i <= posX + 1; i++){ // 把X,Y遍历一圈
            for(var j = posY - 1; j <= posY + 1; j++){ // 用2个for循环遍历找到周围的8个格
                var aroundBox =  document.getElementById(i + '-' + j); // 上面已经定好了位置 在通过aroundBox
                if(aroundBox && aroundBox.classList.contains('isLei')) {
                    n++;
                }
            }
        }
        dom && (dom.innerHTML = n); // 计算好旁边有几个雷以后把雷数传到n里
        if(n == 0) {  // 当n=0的时候 扩散  再次遍历这周围为0的这几个
            for(var i = posX - 1; i <= posX + 1; i++) {
                for(var j = posY - 1; j <= posY + 1; j++) {
                    var nearBox = document.getElementById(i + '-' + j); // 周围这个为0的小格子取出来
                    if(nearBox && nearBox.length !=0) { // 判断nearBox存在 并且 长度不等于0
                        if(!nearBox.classList.contains('check')){ // 判断一下当前格子是否包含check类名 是的话就进不去
                             nearBox.classList.add('check'); // 每次显示完 把这个为nearBox的格子添加一个class类名check 标记 防止重复遍历
                             leftClick(nearBox); // 把narBox传进去
                        }
                       
                    }
                }
            }
        }
    }
}
// 右边点击
function rightClick(dom) {
    if(dom.classList.contains('num')){ // 判断一下当前点击的这个class num 是否是被点击过的 
        return;
    }
    dom.classList.toggle('flag'); // toggle 切换 classList原生上的一个方法  插旗可以右击取消或添加
    if(dom.classList.contains('isLei') && dom.classList.contains('flag')) {
         mineOver--;
     }
    if(dom.classList.contains('isLei') && !dom.classList.contains('flag')) {
        mineOver ++;
    }
    score.innerHTML = mineOver;  // 改变当前的html内容就是这一个雷数
    if(mineOver == 0) {
         alertBox.style.display = 'block'; // css样式显示出来
         alertImg.style.backgroundImage = 'url("img/success.png")';
    }
}
}













