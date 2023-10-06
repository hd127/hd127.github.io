

//设置网关
// var gateway = `ws://${window.location.hostname}/ws`;

var gateway = `wss://${"192.168.99.175"}/ws`;    
// var gateway = `ws://${"192.168.4.1"}/ws`;    



function initWebSocket() {
    console.log('Trying to open a WebSocket connection...');
    websocket = new WebSocket(gateway);
    websocket
    console.log(gateway);
    websocket.onopen = onOpen;
    websocket.onclose = onClose;
    websocket.onmessage = onMessage; // <-- add this line
}
function onOpen(event) {
    console.log('Connection opened');
}

function onClose(event) {
    console.log('Connection closed');
    setTimeout(initWebSocket, 2000);
}


function onMessage(event) {
    var str =event.data;
    var part=str.split(",");
    if(jilu){
        elapsedTime=parseFloat((elapsedTime+steptime).toFixed(2)) ;
        addData(elapsedTime,part[1]/1000,part[3],part[5]/1000);
        uiupdata(part[3],(part[1]/1000).toFixed(2));

    }else{
        biaopan("dianliubiao",part[1]/1000);
        biaopan("dianyabiao",part[3]);
        document.getElementById("dianliu").textContent=(part[1]/1000).toFixed(3);
        document.getElementById("dianya").textContent=part[3];
        document.getElementById("gonglv").textContent=part[5];        
    }
}

function onLoad(event) {
    initWebSocket();
}


window.addEventListener('load', onLoad);

//清除数据
function clearData(){
    for (i=0;i<3;i++){
        dataPlot.data.labels=[];
        dataPlot.data.datasets[i].data=[];
        dataPlot.update();
    }  ;
    records = new Map();    
    uiupdata();
}
   
// 创建一个空的 Map 对象
let records = new Map();

function uiupdata(idata,udata){
    records.set(udata,idata);
    const sortedRecords = Array.from(records).sort((a, b) => a[0] - b[0]);

    records = new Map(sortedRecords);

    var keys = Array.from(records.keys());
    var values = Array.from(records.values());

    drawScatterChart('uichart',keys,values);

}

// 移除数据
function removeData(){
    dataPlot.data.labels.shift();
    for (i=0;i<3;i++){
    dataPlot.data.datasets[i].data.shift();
    
}}
//增加数据，并更新图表
function addData(label, data0,data1,data2) {
    if(dataPlot.data.labels.length > maxDataPoints) removeData();
    dataPlot.data.labels.push(label);
    dataPlot.data.datasets[0].data.push(data0);
    dataPlot.data.datasets[1].data.push(data1);
    dataPlot.data.datasets[2].data.push(data2);
    dataPlot.update();
}

var maxDataPoints=200;
var steptime=0;
var elapsedTime=0;
var jilu=false;

function start() {
steptime=0.05;
jilu=true;
// websocket.send("frequency"+":"+20);
// document.getElementById("clearforce").style.display="block";

}

function pause() {
steptime=0.0;
jilu = false;
websocket.send("frequency"+":"+0);
}

function reset() {
steptime=0.0;
elapsedTime = 0.0;
jilu = false;
clearData();
websocket.send("frequency"+":"+0);
}

function copydata() {

var chartData = ""; // 初始化空字符串
chartData="时间"+"\t"+"电流"+"\t"+"电压"+"\t"+"功率"+"\n";
for (var i = 0; i < dataPlot.data.labels.length; i++) {
  chartData += dataPlot.data.labels[i] + "\t " +dataPlot.data.datasets[0].data[i] + "\t "+dataPlot.data.datasets[1].data[i] + "\t "+dataPlot.data.datasets[2].data[i]+"\n";
}

var textarea = document.createElement('textarea');

textarea.value = chartData;

// 将textarea添加到DOM树中
document.body.appendChild(textarea);

// 选中textarea的内容
textarea.select();

// 执行复制操作
document.execCommand('copy');

// 移除textarea
document.body.removeChild(textarea);

// 弹出提示窗口
alert("复制成功");
}


function copydata1() {
    var keys = Array.from(records.keys());
    var values = Array.from(records.values());
    var chartData = ""; // 初始化空字符串
    chartData="电流"+"\t"+"电压"+"\n";

    for (var i=0;i<keys.length;i++){
        chartData+=keys[i]+"\t"+values[i]+"\n";
    }

    // for (var i = 0; i < dataPlot1.data.labels.length; i++) {
    //   chartData += dataPlot1.data.labels[i] + "\t " +dataPlot.data.datasets[0].data[i] +"\n";
    // }
    var textarea = document.createElement('textarea');
    textarea.value = chartData;
    // 将textarea添加到DOM树中
    document.body.appendChild(textarea);
    // 选中textarea的内容
    textarea.select();
    // 执行复制操作
    document.execCommand('copy');
    // 移除textarea
    document.body.removeChild(textarea);  
    // 弹出提示窗口
    alert("复制成功");
    }


function biaopan(xulie,value){
    speed =value; // 实际速度（可根据需要修改）
    // 获取 canvas 元素和上下文
    var canvas = document.getElementById(xulie);
    var context = canvas.getContext("2d");

    // 定义速度表盘的参数
    var centerX = canvas.width/2 ;
    // var centerX = document.body.scrollWidth ;
    var centerY = canvas.height;
    var radius = canvas.width / 3;

    // 定义起始角度和终止角度
    var startAngle = Math.PI*1.1 ; // 起始角度为 45 度
    var endAngle = Math.PI *1.9; // 终止角度为 225 度

    // 定义最大速度
    var maxSpeed = 3;
    context.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制背景圆圈
    context.beginPath();
    context.arc(centerX, centerY, radius, startAngle, endAngle);
    context.lineTo(centerX, centerY);
    context.closePath();
    context.fillStyle = "#f2f2f2";
    context.fill();

    // 绘制刻度线和数字
    var numDivisions = 30; // 刻度线数量
    var angle = (endAngle - startAngle) / numDivisions; // 刻度线之间的夹角

    for (var i = 0; i <= numDivisions; i++) {
    var currentAngle = startAngle + angle * i;


    // 计算刻度线的坐标
    var startX = centerX + Math.cos(currentAngle) * radius;
    var startY = centerY + Math.sin(currentAngle) * radius;
    var endX = centerX + Math.cos(currentAngle) * (radius - 20);
    var endY = centerY + Math.sin(currentAngle) * (radius - 20);

    // console.log(startX,startY,endX,endY);
    // 绘制刻度线
    context.beginPath();
    context.moveTo(startX, startY);
    context.lineTo(endX, endY);
    context.lineWidth = 1;
    context.strokeStyle = "#000";
    context.stroke();

    // 绘制数字
    if(i%10==0){
        var j=Math.floor(i/10)

        var endX = centerX + Math.cos(currentAngle) * (radius - 40);
        var endY = centerY + Math.sin(currentAngle) * (radius - 40);
        context.moveTo(startX, startY);
        context.lineTo(endX, endY);
        context.font = "16px Arial";
        context.fillStyle = "#000";
        context.textAlign = "center";
        context.lineWidth = 1;
        context.strokeStyle = "#000";
        context.stroke();
        // context.fillText(j, centerX+(startX-centerX)*0.8, centerY+(startY-centerY)*0.8);
        context.fillText(j, endX,endY);
     }

    }

    // 绘制指针
    var pointerLength = radius ; // 指针长度


    var pointerAngle = startAngle + (speed / maxSpeed) * (endAngle - startAngle); // 指针角度

    // 计算指针的坐标
    var pointerX = centerX + Math.cos(pointerAngle) * pointerLength;
    var pointerY = centerY +Math.sin(pointerAngle) * pointerLength;

    // 绘制指针
    context.beginPath();
    context.moveTo(centerX, centerY);
    context.lineTo(pointerX, pointerY);
    context.lineWidth = 1;
    context.strokeStyle = "red";
    context.stroke();

    // 绘制指针圆点
    context.beginPath();
    context.arc(centerX, centerY, 10, 0, 2 * Math.PI);
    context.fillStyle = "red";
    context.fill();
  };
