//ToDo: everything

function initTooltip(){

    //Tooltip will be hidden in the beginning
    let tooltip = d3.selectAll("body")
    .append("div")
    .classed("tooltip", true)
    .style("position","absolute")
    .style("visibility", "hidden")

    tooltip.append("h3");
    tooltip.append("p");

    return tooltip;
}