//Bugs: doesn't work on first date of slider

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
    .style("left",0)
    .style("top",0)

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
    tmp = build_dict(sdg_ind, cov_ind, end_date)
    let isPerPop = d3.select("#vertCompPerPop").property("checked")

    vert_dict = tmp[0]
    min_val = tmp[1]
    max_val = tmp[2]

    let sdg_val = vert_dict[id][sdg_ind]
    let cov_val = vert_dict[id][cov_ind]

    d3.select("p.sdg-tooltip").html(function(){
        if(sdg_val == null){
            return "No value for " + sdg_ind;
        } else {
            if(!sdg_ind.match('SDG \\d+ Index Score')){
                let sdg_ind_index = sdg_ind + " (Index)"
                tmp = build_dict(sdg_ind_index, cov_ind, end_date)
                vert_dict_index = tmp[0]
                let sdg_val_index = vert_dict_index[id][sdg_ind_index]
               return sdg_ind +": "+sdg_val+"<br />"+"Index value: "+sdg_val_index;
            }
            return sdg_ind +": "+sdg_val;
        }
    });
    d3.select("p.cov-tooltip").text(function(){
        if(cov_val == null){
            return "No value for " + cov_ind;
        } else {
            if(isPerPop){
                return cov_ind +": "+d3.format(',.2f')(cov_val)+" (per 100,000 citizens)";
            } else {
                return cov_ind +": "+d3.format(',')(cov_val);
            }
        }
    });
}