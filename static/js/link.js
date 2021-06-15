function highlightState(){
    let s = d3.select(this).attr("state")
    if (s=="LD"){
        d3.selectAll("#svg_map path[state=" + s + "]")
        .attr("stroke","#FF9933")
        .attr("stroke-width",2)
        .raise();
    } else {
    d3.selectAll("#svg_map path[state=" + s + "]")
        .attr("fill","#FF9933")
        .raise();
    }
        //.attr('stroke', 'green')
        //.attr('stroke-width', 2)
    d3.selectAll("#svg_state_compare g[state=" + s + "] .vertComp_val")
        .attr('fill', '#FF9933')
        .raise();
    d3.selectAll("#svg_state_compare g[state=" + s + "] .vertComp_overlay")
        .attr('fill', '#FF9933')
        .attr('stroke', '#FF9933')
        .raise();
    d3.selectAll("#svg_scatterplot circle[state=" + s + "]")
        .style('fill', '#FF9933')
        .raise();

    updateLinePlot(s);
    updateTooltip(s);

    tooltip.style("visibility","visible")
    tooltip.select("h3").text(sdg_data["States/UTs"][s]);
    //tooltip.select("p").text(ind + ": " + val);
}
function move_tooltip(){
    let lim_x = d3.select(".vertComp_val").node().getBoundingClientRect().left
    let curr_x = 0;
    if (tooltip.node().getBoundingClientRect().x > event.pageX){
        curr_x = tooltip.node().getBoundingClientRect().left-10
    } else {
        curr_x = tooltip.node().getBoundingClientRect().right+10
    }
    let tooltip_width = d3.select(".tooltip").node().getBoundingClientRect().width
    tooltip.style("top",event.pageY + 10 + "px").style("left", event.pageX + 10 +"px")
    if(d3.select(this).classed("vertComp_bar")){
        tooltip.style("top",event.pageY + 10 + "px").style("left", event.pageX + 10 +"px")
    } else if (curr_x +tooltip_width > lim_x){
        tooltip.style("top",event.pageY + 10 + "px").style("left", event.pageX - tooltip_width - 10 +"px")
    } else{
        tooltip.style("top",event.pageY + 10 + "px").style("left", event.pageX + 10 +"px")
    }
    /* else {
        tooltip.style("top",event.pageY + 10 + "px").style("left", event.pageX + 10 +"px")
    }*/
}
function state_mouseout(){
    let sdg_ind = sdg_dropdown.property("value")
    let s = d3.select(this).attr("state");
    d3.select("#svg_state_compare g[state=" + s + "] .vertComp_val").attr("fill", "#138808");
    d3.select("#svg_state_compare g[state=" + s + "] .vertComp_overlay").attr("fill", "red").attr("stroke","red");
    updateMap(sdg_ind)
    //d3.select("#svg_map path[state=" + s + "]").attr("fill", "white").attr("stroke-width", 0.5);
    d3.selectAll("#svg_scatterplot circle[state=" + s + "]").style('fill', '#000080');
    d3.select(".tooltip").style("visibility","hidden")
}
