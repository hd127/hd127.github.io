
//散点图，图表名字，x轴数据，y轴数据
function drawScatterChart(chartname,xData, yData) {
    // 将 xData 和 yData 合并为一个二维数组
    var data = [];
    for (var i = 0; i < xData.length; i++) {
        data.push([parseFloat(xData[i]),parseFloat( yData[i])]);
    }


    // 初始化ECharts实例
    var myChart = echarts.init(document.getElementById(chartname));

    // 使用ecStat的regression方法计算趋势线的数据
    var trendData = ecStat.regression('linear', data);
    var trendline = [
        [0, trendData.parameter.intercept],
        [data[data.length - 1][0], data[data.length - 1][0] * trendData.parameter.gradient + trendData.parameter.intercept]
    ];



    // 设置散点图和趋势线的配置项
    var option = {
        animation: false,
        legend: {
            data: ['', '趋势线', ''], 
          },
        xAxis: {},
        yAxis: {},
        series: [
        {   name:"电压",
            symbolSize: 5,
            data: data,
            type: 'scatter'
        },
        {
            name:"趋势线",
            color: 'red',
            type: 'line',
            smooth: true,
            data: trendline,
            
        },
        {
            color: 'black',
            type: 'line',
            smooth: false,
            data: data
        },
        ],
        tooltip: {
        trigger: 'axis',
        formatter: function(params) {
            var value = params[0].value;
            return String(value);
        }
        },
    };

    // 使用配置项绘制散点图
    myChart.setOption(option);
   
    // 监听窗口大小变化事件
    window.addEventListener('resize', function() {
        var container = document.getElementById(chartname);
        container.style.height = container.offsetWidth * 0.8 + 'px';
        myChart.resize();
    });
    }