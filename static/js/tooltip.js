//ToDo: read out actual and index numbers, add date, special text for null values

function initTooltip(){
    let sdg_ind = sdg_dropdown.property("value")
    let cov_ind = covid_dropdown.property("value")
    let end_date = date_slider.property("value")

    //Tooltip will be hidden in the beginning
    let tooltip = d3.selectAll("body")
    .append("div")
    .classed("tooltip", true)
    .style("position","absolute")
    .style("visibility", "hidden")

    tooltip.append("h3");
    let inf = tooltip.append("div").attr("class","sdg_info")
    tooltip.append("div").attr("id","tooltip_trend");

    inf.append("p").classed("sdg-tooltip",true).text(sdg_ind)
    inf.append("p").classed("cov-tooltip",true).text(cov_ind)
    inf.append("p")

    return tooltip;
}

function updateTooltip(id){
    let sdg_ind = sdg_dropdown.property("value")
    let cov_ind = covid_dropdown.property("value")
    let end_date = date_slider.property("value")

    let cov_val = covid_data[id].filter(function(d){return d.DateUNIX.getTime()==end_date.getTime()})[0][cov_ind]

    d3.select("p.sdg-tooltip").text(sdg_ind +": "+sdg_data[sdg_ind][id])
    d3.select("p.cov-tooltip").text(cov_ind +": "+d3.format(',')(cov_val))


}