//reference the drawing canvas
var myCanvas = document.getElementById('myCanvas');
myCanvas.width = 300;
myCanvas.height = 300;

//init the canvas with 2D context
var ctx = myCanvas.getContext('2d');

//functions

/**
 * Draw a line
 *
 * @param ctx the drawing context
 * @param startX the X coordinate of the line starting point
 * @param startY the Y coordinate of the line starting point
 * @param endX the X coordinate of the line end point
 * @param endY the Y coordinate of the line end point
 */
function drawLine(ctx,startX,startY,endX,endY){
    ctx.beginPath();
    ctx.moveTo(startX,startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
}

/**
 * Draw a part of a circle, also called an arc
 *
 * @param ctx the drawing context
 * @param centerX the X coordinate of the circle center
 * @param centerY the Y coordinate of the circle center
 * @param radius the X coordinate of the line end point
 * @param startAngle the start angle in radians where the portion of the circle starts
 * @param endAngle the end angle in radians where the portion of the circle ends
 */
function drawArc(ctx, centerX, centerY, radius, startAngle, endAngle){
    ctx.beginPath();
    ctx.arc(centerX,centerY, radius,startAngle,endAngle);
    ctx.stroke();
}

/**
 *Draw a splice on our chart
 *
 * @param ctx reference to the drawing context
 * @param centerX the X coordinate of the circle center
 * @param centerY the Y coordinate of the circle center
 * @param radius the X coordinate of the line end point
 * @param startAngle the start angle in radians where the portion of the circle starts
 * @param endAngle the end angle in radians where the portion of the circle ends
 * @param color the color used to fill the slice
 */
function drawPieSlice(ctx, centerX, centerY, radius, startAngle, endAngle, color){
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(centerX,centerY);
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.closePath();
    ctx.fill();
}

//calling the functions
drawLine(ctx,100,100,200,200);
drawArc(ctx,150,150,150,0,Math.PI/3);
drawPieSlice(ctx,150,150,150,Math.PI/2,Math.PI/2 + Math.PI/4, '#ff0000');

//the data object
var myVinyls = {
    'rock': 17,
    'blues': 21,
    'jazz': 5,
    'post-rock': 40
}

//Make a constructor to draw a piechart

/**
 *
 * @param options stores the canavs reference & create a drawing context
 * @constructor
 */
var Piechart = function(options){
    this.options = options;
    this.canvas = options.canvas;
    this.ctx = this.canvas.getContext('2d');
    this.colors = options.colors;

    this.draw = function(){
        var total_value = 0;
        var color_index = 0;
        for(var categ in this.options.data){
            var val = this.options.data[categ];
            total_value += val;

            if (this.options.legend){
                color_index = 0;
                var legendHTML = "";
                for (categ in this.options.data){
                    legendHTML += "<div><span style='display:inline-block;width:20px;background-color:"+this.colors[color_index++]+";'>&nbsp;</span> "+categ+"</div>";
                }
                this.options.legend.innerHTML = legendHTML;
            }
        }

        var start_angle = 0;
        for(categ in this.options.data){
            val = this.options.data[categ];
            var slice_angle = 2 * Math.PI * val / total_value;

            drawPieSlice(
                this.ctx,
                this.canvas.width/2,
                this.canvas.height / 2,
                Math.min(this.canvas.width / 2,this.canvas.height / 2),
                start_angle,
                start_angle + slice_angle,
                this.colors[color_index % this.colors.length]
            );

            start_angle += slice_angle;
            color_index++;
        }

        //Make a donut-like Chart
        if(this.options.donutHoleSize){
            drawPieSlice(
                this.ctx,
                this.canvas.width / 2,
                this.canvas.height / 2,
                this.options.donutHoleSize * Math.min(
                    this.canvas.width / 2,
                    this.canvas.height / 2
                ),
                0,
                2 * Math.PI,
                '#fff'
            );
        }

        //the legend
        start_angle = 0;
        for (categ in this.options.data){
            val = this.options.data[categ];
            slice_angle = 2 * Math.PI * val / total_value;
            var pieRadius = Math.min(this.canvas.width/2,this.canvas.height/2);
            var labelX = this.canvas.width/2 + (pieRadius / 2) * Math.cos(start_angle + slice_angle/2);
            var labelY = this.canvas.height/2 + (pieRadius / 2) * Math.sin(start_angle + slice_angle/2);

            if (this.options.doughnutHoleSize){
                var offset = (pieRadius * this.options.doughnutHoleSize ) / 2;
                labelX = this.canvas.width/2 + (offset + pieRadius / 2) * Math.cos(start_angle + slice_angle/2);
                labelY = this.canvas.height/2 + (offset + pieRadius / 2) * Math.sin(start_angle + slice_angle/2);
            }

            var labelText = Math.round(100 * val / total_value);
            this.ctx.fillStyle = "white";
            this.ctx.font = "bold 20px Arial";
            this.ctx.fillText(labelText+"%", labelX,labelY);
            start_angle += slice_angle;
        }
    }
}

//Uncomment if you want to create a donut (hmmmmm a donut - &copy; Homer Simpson)
// var myPiechart = new Piechart(
//     {
//         canvas: myCanvas,
//         data: myVinyls,
//         colors: [
//             '#e67e22',
//             '#2980b9',
//             '#f1c40f',
//             '#8e44ad'
//         ]
//     }
// );
//
// myPiechart.draw();


//Comment this to create a simple PieChart
// var myDonutChart = new Piechart(
//     {
//         canvas : myCanvas,
//         data : myVinyls,
//         colors : [
//             '#e67e22',
//             '#2980b9',
//             '#f1c40f',
//             '#8e44ad'
//         ],
//         donutHoleSize : 0.5
//     }
// );
//
// myDonutChart.draw();

//adding the legend to the chart
var myLegend = document.getElementById("myLegend");

var myDonutChart = new Piechart(
    {
        canvas:myCanvas,
        data:myVinyls,
        colors : [
            '#e67e22',
            '#2980b9',
            '#f1c40f',
            '#8e44ad'
        ],
        legend:myLegend
    }
);
myDonutChart.draw();