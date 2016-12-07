var width  = 500;
var height = 500;
var sizeForCircle = 10;

var hoop_center_x = width/2;
var hoop_center_y = 70;

var padding = 80;

// setup x
var xValue = function(d) { return d.Sugars;}, // data -> value
    xScale = d3.scale.linear().range([0, width - 20]), // value -> display
    xMap = function(d) { return xScale(xValue(d));}, // data -> display
    xAxis = d3.svg.axis().scale(xScale).orient("top");

// setup y
// var yValue = function(d) { return d["Calories"];}, // data -> value
//     yScale = d3.scale.linear().range([height, 0]), // value -> display
//     yMap = function(d) { return yScale(yValue(d));}, // data -> display
//     yAxis = d3.svg.axis().scale(yScale).orient("left");

// setup fill color --> plays no use atm.
// var cValue = function(d) { return apply_color(d["result"]);},
//     color = d3.scale.category10();

var shot_results = ["Made Shot","Missed Shot"]; //predefined array of results. much faster than finding set across all queried values.


function apply_color(result, c1, c2) {
    if (result.localeCompare("Made Shot")) {
        return c1;
    } else {
        return c2;
    }
}


var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);


var scatterplot_indv = d3.select("#home-court-background")
    .append("svg")
        .attr("width", width)
        .attr("height", height)
    .append("g");

var scatterplot_comp = d3.select("#comp-court-background")
    .append("svg")
        .attr("width", width)
        .attr("height", height)
    .append("g");

var legend = scatterplot_indv.selectAll(".legend")
      .data(shot_results) 
      .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(" + (-20) + "," + (i * 20 + height * .7) + ")"; });


legend.append("rect")
      .attr("x", width - 20)
      .attr("width", 18)
      .attr("height", 18)
      .attr("transform", "translate(0," + 50 + ")")
      .style("fill", function(d) {
          return apply_color(d,"red","blue");
      });

  // draw legend text
legend.append("text")
      .attr("x", width - 23)
      .attr("y", 9)
      .attr("dy", ".35em")
      .attr("fill", "black")
      .style("text-anchor", "end")
      .attr("transform", "translate(0," + 50 + ")")
      .text(function(d) { return d;});

var homeCourtScaleX = d3.scale.linear().domain([-250, 250]).range([0, width]),
    homeCourtScaleY = d3.scale.linear().domain([0, 500]).range([hoop_center_y, height + hoop_center_y]),


    xMap = function(d) { return xScale(xValue(d));}, // data -> display
    xAxis = d3.svg.axis().scale(xScale).orient("top");


var draw_shots = function(data, court, c1, c2) {
    if (court == "#home-court-background") {
      var scatterplot = scatterplot_indv;
    } else {
      var scatterplot = scatterplot_comp;
    }
    var selection = scatterplot.selectAll(".dot")
        .data(data, function(d) {return "" + d["x"] + d["y"];});

    // selection.exit()
    //     .call(removeClassData);

    // Add new data
    selection.enter().append("circle")
        .attr("class", function(d, i) {return "dot" + " data" + i; })
        .attr("cx", function(d) { return homeCourtScaleX(d.x); })
        .attr("cy", function(d) { return homeCourtScaleY(d.y); })
        .attr("r", 5)
        .style("fill", function(d) {
            return apply_color(d["result"], c2, c1);
        })
        .on("mouseover", function(d, i) {
            var c = 'dot';

            // Reset all.  Fixes overlapping circles
            d3.selectAll('.' + c)
                .call(unSelectClassData);

            d3.select(this)
                .call(selectClassData);

            courtTooltipShow(d);
        })
        .on("mouseleave", function(d, i) {
            d3.selectAll(".dot")
                .call(normalClassData);

            courtTooltipHide();
        })
        .style('opacity', 0)
        .call(normalClassData);
}

var clear_court = function() {
    d3.selectAll(".dot")
        .call(removeClassData);
}
