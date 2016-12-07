var dataClassList = ['ddot', 'dot'];

var dataClassTransitions = {
    "dot" : {
        "select"    : dotSelected,
        "normal"    : dotNormal,
        "unSelect"  : dotUnSelected,
        "hide"      : dotHide,
        "remove"    : dotRemove
    },

    "ddot" : {
        "select"    : ddotSelected,
        "normal"    : ddotNormal,
        "unSelect"  : ddotUnSelected,
        "hide"      : ddotHide,
        "remove"    : ddotRemove
    }
};

var classDataFunc = function(d, state) {
    d.each(function(da, i) {
        var clazz = d3.select(this).attr('class');
        var d = getDataClass(clazz);
        var c = whichDataClass(clazz);
        var selectFunc = dataClassTransitions[c][state];
        d3.selectAll("." +d)
            .call(selectFunc);
    });
}

var selectClassData = function(d) {
    classDataFunc(d, 'select');
}

var normalClassData = function(d) {
    classDataFunc(d, 'normal');
}

var unSelectClassData = function(d) {
    classDataFunc(d, 'unSelect');
}

var hideClassData = function(d) {
    classDataFunc(d, 'hide');
}

var removeClassData = function(d) {
    classDataFunc(d, 'remove');
}



function ddotSelected(d) {
    d.transition()
        .duration(200)
        .ease('cubicInOut')
        .style("opacity", 1)
        .attr("r", 6);
}

function ddotNormal(d) {
    d.transition()
        .duration(200)
        .ease('cubicInOut')
        .style("opacity", 1)
        .attr("visibility", "visible")
        .attr("r", 4);
}

function ddotUnSelected(d) {
    d.transition()
        .duration(200)
        .ease('cubicInOut')
        .style("opacity", 0.4)
        .attr("r", 4);
}

function ddotHide(d) {
    d.transition()
        .duration(200)
        .ease('cubicInOut')
        .style("opacity", 0)
    .transition()
        .delay(200)
        .attr("visibility", "hidden");
}

function ddotRemove(d) {
    d.remove()
}




function dotSelected(d) {
    d.transition()
        .duration(200)
        .ease('cubicInOut')
        .style("opacity", 1)
        .attr("r", 7);
}

function dotNormal(d) {
    d.transition()
        .duration(200)
        .ease('cubicInOut')
        .style("opacity", 1)
        .attr("visibility", "visible")
        .attr("r", 5);
}

function dotUnSelected(d) {
    d.transition()
        .duration(200)
        .ease('cubicInOut')
        .style("opacity", 0.4)
        .attr("r", 5);
}

function dotHide(d) {
    d.transition()
        .duration(200)
        .ease('cubicInOut')
        .style("opacity", 0)
    .transition()
        .delay(200)
        .attr("visibility", "hidden");
}

function dotRemove(d) {
    // d.transition()
    //     .duration(100)
    //     .ease('cubicInOut')
    //     .style("opacity", 0)
    //     .delay(100)
    //     .remove();
    d.remove()
}

function courtTooltipShow(d) {
    tooltip.transition()
        .duration(200)
        .ease('cubicInOut')
        .style("opacity", 1);
    tooltip.html(
      'Shot Type: ' + d["shot type"] + "<br/>"
        + 'Result: ' + d["result"] + "<br/>"
        + 'Quarter: ' + d["period"] + "<br/>"
        + 'Time Remaining: ' + d["minutes remaining"] + ":" + d["seconds remaining"] +  "<br/>"
        + 'Action Type: ' + d["action type"] + "<br/>"
        + 'Shot Range: ' + d["shot zone range"] + "<br/>"
        + 'Shot Zone Area: ' + d["shot zone basic"]
        )
        .style("left", d3.event.pageX + 5 + "px")
        .style("top", d3.event.pageY + 5 + "px")
}

function courtTooltipHide() {
    tooltip.transition()
        .duration(200)
        .ease('cubicInOut')
        .style("opacity", 0);
}
