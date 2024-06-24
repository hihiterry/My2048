
//宣告數值
let gameMap_nums=[
    [0,0,0,0],
    [0,0,0,0],
    [0,0,0,0],
    [0,0,0,0]
];//0空格 2,4,8...顯示數字
let history_nums=[];
let isGameOver_bool=false;

//開始網頁時執行一次
reset_method();

//設定按鈕
document.addEventListener("DOMContentLoaded", function(){
    //問題
    
    //回到上一步
    document.getElementById("lastMoveButton").onclick=lastMove_method;
    //重新開始
    document.getElementById("resetButton").onclick=reset_method;
});

//回上一步
function lastMove_method(){
    if (history_nums.length > 0) {
        gameMap_nums = history_nums.pop();
        update_method();
    }
}

//判斷陣列是否相同
function isSameState_method(state1_nums, state2_nums) {
    for (let i_num = 0; i_num < 4; i_num++) {
        for (let j_num = 0; j_num < 4; j_num++) {
            if (state1_nums[i_num][j_num] !== state2_nums[i_num][j_num]) {
                return false;
            }
        }
    }
    return true;
}

//儲存先前遊戲資料
function saveHistory_method(){
    if (history_nums.length === 0 || !isSameState_method(history_nums[history_nums.length - 1], gameMap_nums)) {
        let copyMap_nums = [];
        for (let i_num = 0; i_num < 4; i_num++) {
            copyMap_nums.push(gameMap_nums[i_num].slice());
        }
        history_nums.push(copyMap_nums);
    }
}

//重新開始遊戲
function reset_method() {
    initialize_method();
    update_method();
}

//初始化
function initialize_method(){
    history_nums=[];
    isGameOver_bool=false;
    for(let i_num=0;i_num<16;i_num++){
        gameMap_nums[Math.floor(i_num/4)][i_num%4]=0;
    }
    generateNumber_method();
    generateNumber_method();
}

//刷新
function update_method(){
    displayMap_method();
    countAndSetScore();
    isGameOverCheck_method();
}

//顯示遊戲狀態
function displayMap_method(){
    for(let i_num=0;i_num<16;i_num++){
        let id_str="block"+String(Math.floor(i_num/4))+"-"+String(i_num%4);
        if(gameMap_nums[Math.floor(i_num/4)][i_num%4]!==0){
            document.getElementById(id_str).style.visibility='visible';
            document.getElementById(id_str).textContent=gameMap_nums[Math.floor(i_num/4)][i_num%4];
            document.getElementById(id_str).style.backgroundColor = getColor_method(gameMap_nums[Math.floor(i_num/4)][i_num%4]);
        }
        else
        {
            document.getElementById(id_str).style.visibility='hidden';
            document.getElementById(id_str).textContent = '';
        }
    }
}

//計算並顯示分數
function countAndSetScore(){
    let sum_num=0;
    for(let i_num=0;i_num<16;i_num++){
        sum_num+=gameMap_nums[Math.floor(i_num/4)][i_num%4];
    }
    if(isGameOver_bool){
        document.getElementById("scoreText").textContent=`SCORE:${sum_num} GAMEOVER`;
    }
    else{
        document.getElementById("scoreText").textContent=`SCORE:${sum_num}`;
    }
}

//依數值改變顏色
function getColor_method(value_num) {
    let index_num=-1;
    let temp_num=value_num;
    let color_strs=["blue","green","red","purple","orange","cyan","magenta","yellow","brown","grey","black"];
    while(temp_num>=2){
        index_num+=1;
        temp_num/=2;
    }
    return color_strs[index_num];
}

//遊戲結束檢查
function isGameOverCheck_method(){
    let temp_bool=true;
    for(let i_num=0; i_num<4; i_num++){
        for(let j_num=0; j_num<4; j_num++){
            if(gameMap_nums[i_num][j_num] === 0 || checkBlockCanBeConbine(j_num, i_num)){
                temp_bool=false;
                isGameOver_bool=false;
                return;
            }
        }
    }
    isGameOver_bool=temp_bool;
}
function checkBlockCanBeConbine(x_num, y_num){
    if (x_num - 1 >= 0 && gameMap_nums[y_num][x_num - 1] === gameMap_nums[y_num][x_num]) {
        return true;
    }
    if (x_num + 1 <= 3 && gameMap_nums[y_num][x_num + 1] === gameMap_nums[y_num][x_num]) {
        return true;
    }
    if (y_num - 1 >= 0 && gameMap_nums[y_num - 1][x_num] === gameMap_nums[y_num][x_num]) {
        return true;
    }
    if (y_num + 1 <= 3 && gameMap_nums[y_num + 1][x_num] === gameMap_nums[y_num][x_num]) {
        return true;
    }
    return false;
}

//檢查是否能增新數字
function canAddCheck_method(){
    let canAddNum_bool=false;
    for(let i_num=0;i_num<16;i_num++){
        if(gameMap_nums[Math.floor(i_num/4)][i_num%4]===0){
            canAddNum_bool=true;
            break;
        }
    }
    return canAddNum_bool;
}

//生成數字
function generateNumber_method(){
    let position_num=Math.floor(Math.random()*16);
    while(gameMap_nums[Math.floor(position_num/4)][position_num%4]!==0){
        position_num=Math.floor(Math.random()*16);
    }
    gameMap_nums[Math.floor(position_num/4)][position_num%4]=Math.floor(Math.random()*6)===5 ? 4 : 2;
}

//檢測按鍵並呼叫移動數字的方法(用電腦執行時)
document.addEventListener("keydown", (event) => {
    switch(event.key) {
        case "ArrowUp":
            moveUp_method();
            break;
        case "ArrowDown":
            moveDown_method();
            break;
        case "ArrowLeft":
            moveLeft_method();
            break;
        case "ArrowRight":
            moveRight_method();
            break;
        default:
            return;
    }
    event.preventDefault();
    if(canAddCheck_method()){
        generateNumber_method();
    }
    update_method();
});

//移動數字
//向上
function moveUp_method(){
    saveHistory_method();
    for(let i_num=1;i_num<4;i_num++){
        for(let j_num=0;j_num<4;j_num++){
            if(gameMap_nums[i_num][j_num]!==0){
                moveBlockUp(j_num,i_num);
            }
        }
    }
}
function moveBlockUp(x_num,y_num){
    if(y_num===0){
        return;
    }
    if(gameMap_nums[y_num][x_num]===0){
        return;
    }
    if(gameMap_nums[y_num-1][x_num]!==gameMap_nums[y_num][x_num] && gameMap_nums[y_num-1][x_num]!==0){
        return;
    }
    while(gameMap_nums[y_num-1][x_num]===0){
        gameMap_nums[y_num-1][x_num]=gameMap_nums[y_num][x_num];
        gameMap_nums[y_num][x_num]=0;
    }
    if(gameMap_nums[y_num-1][x_num]===gameMap_nums[y_num][x_num]){
        gameMap_nums[y_num-1][x_num]*=2;
        gameMap_nums[y_num][x_num]=0;
    }
    moveBlockUp(x_num,y_num-1);
}

//向下
function moveDown_method(){
    saveHistory_method();
    for(let i_num=2; i_num>=0; i_num--){
        for(let j_num=0; j_num<4; j_num++){
            if(gameMap_nums[i_num][j_num]!==0){
                moveBlockDown(j_num, i_num);
            }
        }
    }
}
function moveBlockDown(x_num,y_num){
    if(y_num===3){
        return;
    }
    if(gameMap_nums[y_num][x_num]===0){
        return;
    }
    if(gameMap_nums[y_num+1][x_num]!==gameMap_nums[y_num][x_num] && gameMap_nums[y_num+1][x_num]!==0){
        return;
    }
    while(gameMap_nums[y_num+1][x_num]===0){
        gameMap_nums[y_num+1][x_num]=gameMap_nums[y_num][x_num];
        gameMap_nums[y_num][x_num]=0;
    }
    if(gameMap_nums[y_num+1][x_num]===gameMap_nums[y_num][x_num]){
        gameMap_nums[y_num+1][x_num]*=2;
        gameMap_nums[y_num][x_num]=0;
    }
    moveBlockDown(x_num,y_num+1);
}

//向左
function moveLeft_method(){
    saveHistory_method();
    for(let i_num=0; i_num<4; i_num++){
        for(let j_num=1; j_num<4; j_num++){
            if(gameMap_nums[i_num][j_num]!==0){
                moveBlockLeft(j_num, i_num);
            }
        }
    }
}
function moveBlockLeft(x_num,y_num){
    if(x_num===0){
        return;
    }
    if(gameMap_nums[y_num][x_num]===0){
        return;
    }
    if(gameMap_nums[y_num][x_num-1]!==gameMap_nums[y_num][x_num] && gameMap_nums[y_num][x_num-1]!==0){
        return;
    }
    while(gameMap_nums[y_num][x_num-1]===0){
        gameMap_nums[y_num][x_num-1]=gameMap_nums[y_num][x_num];
        gameMap_nums[y_num][x_num]=0;
    }
    if(gameMap_nums[y_num][x_num-1]===gameMap_nums[y_num][x_num]){
        gameMap_nums[y_num][x_num-1]*=2;
        gameMap_nums[y_num][x_num]=0;
    }
    moveBlockLeft(x_num-1,y_num);
}

//向右
function moveRight_method(){
    saveHistory_method();
    for(let i_num=0; i_num<4; i_num++){
        for(let j_num=2; j_num>=0; j_num--){
            if(gameMap_nums[i_num][j_num]!==0){
                moveBlockRight(j_num, i_num);
            }
        }
    }
}
function moveBlockRight(x_num,y_num){
    if(x_num===3){
        return;
    }
    if(gameMap_nums[y_num][x_num]===0){
        return;
    }
    if(gameMap_nums[y_num][x_num+1]!==gameMap_nums[y_num][x_num] && gameMap_nums[y_num][x_num+1]!==0){
        return;
    }
    while(gameMap_nums[y_num][x_num+1]===0){
        gameMap_nums[y_num][x_num+1]=gameMap_nums[y_num][x_num];
        gameMap_nums[y_num][x_num]=0;
    }
    if(gameMap_nums[y_num][x_num+1]===gameMap_nums[y_num][x_num]){
        gameMap_nums[y_num][x_num+1]*=2;
        gameMap_nums[y_num][x_num]=0;
    }
    moveBlockRight(x_num+1,y_num);
}

//手機遊玩
document.addEventListener("touchstart", handleTouchStart, false);
document.addEventListener("touchmove", handleTouchMove, false);

let xStart_num = null;
let yStart_num = null;

function handleTouchStart(event) {
    const firstTouch = event.touches[0];
    xStart_num = firstTouch.clientX;
    yStart_num = firstTouch.clientY;
}

function handleTouchMove(event) {
    if (!xStart_num || !yStart_num) {
        return;
    }

    let xEnd_num = event.touches[0].clientX;
    let yEnd_num = event.touches[0].clientY;

    let xDiff_num = xStart_num - xEnd_num;
    let yDiff_num = yStart_num - yEnd_num;

    if (Math.abs(xDiff_num) > Math.abs(yDiff_num)) {
        if (xDiff_num > 0) {
            moveLeft_method();
        } else {
            moveRight_method();
        }
    } else {
        if (yDiff_num > 0) {
            moveUp_method();
        } else {
            moveDown_method();
        }
    }

    xStart_num = null;
    yStart_num = null;
    event.preventDefault();

    if (canAddCheck_method()) {
        generateNumber_method();
    }
    update_method();
}