var w = $("#home-shot-timeline").parent().width(),
    h = 100;

var shot_timeline_svg = d3.select("#home-shot-timeline").append("svg")
    .attr("width", w)
    .attr("height", h)
    .attr("background-color", '#000');


// Timeline Axis
var g = shot_timeline_svg.append("g");

var strokeWidth = 3;
var startX = 30,
    endX   = w - 10,
    startY = 0.2 * h,
    endY   = 0.8 * h;

var tWidth = endX - startX,
    tHeight = endY - startY,
    dragbarw = 20;

var tick3Y = startY + tHeight / 3
    tick2Y = startY + tHeight * 2 / 3;
    tickX  = startX;

draw_timeline(startX, startY, endX, endY, '#FFF', strokeWidth);
function draw_timeline(x1, y1, x2, y2, color, tWidth) {
    var tickDist = (x2 - x1) / 4;
    var lineData = [{ "x" : x1, "y" : y1 }];

    var x = x1,
        y = y1;

    var line_function = d3.svg.line()
        .x(function(d) { return d.x; })
        .y(function(d) { return d.y; })
        .interpolate("linear");

    for (var i = 0; i < 4; i++) {
        lineData.push({ "x" : x, "y" : y2 });
        x += tickDist;
        lineData.push({ "x" : x, "y" : y2 });
        lineData.push({ "x" : x, "y" : y1 });
        g.append('text')
            .attr("x", x - (tickDist/2) - 7)
            .attr("y", y2 + 20)
            .text("Q" + (i + 1))
            .attr("font-family", "sans-serif")
            .attr("font-size", "14px")
            .attr("fill", "white");
    }

    g.append('path')
        .attr("class", "timeline")
        .attr('d', line_function(lineData))
        .attr("stroke", color)
        .attr("stroke-width", tWidth)
        .attr("fill", "none");

    g.append('line')
        .attr('x1', tickX)
        .attr('y1', tick3Y)
        .attr('x2', endX)
        .attr('y2', tick3Y)
        .attr("stroke", color)
        .attr("stroke-width", tWidth/3)
        .attr('opacity', 0.5);
    g.append('line')
        .attr('x1', tickX)
        .attr('y1', tick2Y)
        .attr('x2', endX)
        .attr('y2', tick2Y)
        .attr("stroke", color)
        .attr("stroke-width", tWidth/3)
        .attr('opacity', 0.5);

    g.append('text')
        .attr("x", tickX - 25)
        .attr("y", tick3Y + 5)
        .text("3PT")
        .attr("font-family", "sans-serif")
        .attr("font-size", "10px")
        .attr("fill", "white");
    g.append('text')
        .attr("x", tickX - 25)
        .attr("y", tick2Y + 5)
        .text("2PT")
        .attr("font-family", "sans-serif")
        .attr("font-size", "10px")
        .attr("fill", "white");

}


// Dragger
var dragright = d3.behavior.drag()
    .origin(Object)
    .on("drag", rdragresize);

var dragleft = d3.behavior.drag()
    .origin(Object)
    .on("drag", ldragresize);

var newg = g.append("g")
      .data([{x: startX - 3, y: startY + 3}]);

var dragrect = newg.append("rect")
    .attr("id", "active")
    .attr("x", function(d) { return d.x; })
    .attr("y", function(d) { return d.y; })
    .attr("height", tHeight)
    .attr("width", tWidth)
    .attr("fill-opacity", .3);

var dragbarleft = newg.append("circle")
    .attr("id", "active")
    .attr("cx", startX)
    .attr("cy", endY)
    .attr("r", 8)
    .attr("id", "dragleft")
    .attr("fill", "lightblue")
    .attr("cursor", "ew-resize")
    .call(dragleft);

var dragbarright = newg.append("circle")
    .attr("id", "active")
    .attr("cx", endX)
    .attr("cy", endY)
    .attr("r", 8)
    .attr("id", "dragright")
    .attr("fill", "lightblue")
    .attr("cursor", "ew-resize")
    .call(dragright);

function showBetween() {
    circles.selectAll(".dot")
        .filter(function(d, i) {
            var x = parseFloat(d3.select(this).attr('cx'));
            return ( x < parseFloat(dragbarleft.attr("cx")) || parseFloat(dragbarright.attr("cx")) < x);
        })
        .call(hideClassData);

    circles.selectAll(".dot")
        .filter(function(d, i) {
            var x = parseFloat(d3.select(this).attr('cx'));
            return ( x > parseFloat(dragbarleft.attr("cx")) && parseFloat(dragbarright.attr("cx")) > x);
        })
        .call(normalClassData);
}

function ldragresize(d) {
    var oldx = d.x; 
    //Max x on the right is x + width - dragbarw
    //Max x on the left is 0 - (dragbarw/2)
    d.x = Math.max(startX - 3, Math.min(d.x + tWidth - (dragbarw / 2), d3.event.x)); 
    tWidth = tWidth + (oldx - d.x);
    // dragbarleft
    //     .attr("x", function(d) { return d.x - (dragbarw / 2); });
    dragbarleft.attr("cx", function(d) { return d.x; });

    dragrect
        .attr("x", function(d) { return d.x; })
        .attr("width", tWidth);

    showBetween();
}

function rdragresize(d) {
    //Max x on the left is x - width 
    //Max x on the right is width of screen + (dragbarw/2)
    var dragx = Math.max(d.x + (dragbarw/2), Math.min(endX + 3, d.x + tWidth + d3.event.dx));

    //recalculate width
    tWidth = dragx - d.x;

    //move the right drag handle
    dragbarright.attr("cx", function(d) { return dragx; });

    //resize the drag rectangle
    //as we are only resizing from the right, the x coordinate does not need to change
    dragrect
        .attr("width", tWidth);

    showBetween();
}


// Circles
var MIN_IN_QUARTER = 12,
    TOTAL_MIN = MIN_IN_QUARTER * 4,
    TOTAL_SEC = TOTAL_MIN * 60;

var circles = g.append("g")
    .attr("class", "circles");

var linearScale = d3.scale.linear()
                    .domain([0, TOTAL_SEC])
                    .range([0, tWidth]);

function get_timeline_selection(data) {
    return shot_timeline_svg.selectAll(".dot")
        .data(data, function(d) {return "" + d["x"] + d["y"];});
}

function draw_timeline_shots(data, c1, c2) {
    var selection = circles.selectAll(".dot")
        .data(data, function(d) {return "" + d["x"] + d["y"];});

    selection.enter().append("circle")
        .attr("class", function(d, i) {return "dot" + " data" + i; })
        .attr("cx", function(d) { return startX + linearScale(conv_2_Timeline(d)) })
        .attr("cy", function(d) {
            if (d["shot type"].localeCompare("2PT Field Goal"))
                return tick3Y;
            else
                return tick2Y;
        })
        .attr("r", 5)
        .attr("visibility", "visible")
        .style("fill", function(d) {
            return apply_color(d["result"], c2, c1);
        })
        .on("mouseover", function(d, i) {
            var c = 'dot';

            // Reset all.  Fixes overlapping circles
            d3.selectAll('.' + c)
                .call(unSelectClassData);

            d3.selectAll(".data" + i)
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

function conv_2_Timeline(d) {
    return (MIN_IN_QUARTER * (d["period"] - 1) * 60) +
           (MIN_IN_QUARTER - d['minutes remaining']) * 60 + 
           (d["seconds remaining"]) ;
}
