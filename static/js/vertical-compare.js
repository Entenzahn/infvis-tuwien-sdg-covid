//Bar chart for vertical comparison (next to map)
var vertCompare_width = 0;
var vertCompare_margin = {};
var vertCompare_height = 0;

function build_dict(sdg_ind, cov_ind, end_date){
    let vert_dict = {};
    let min_val = null;
    let max_val = null;
    let isPerPop = d3.select("#vertCompPerPop").property("checked")

    d3.entries(sdg_data[sdg_ind]).forEach(function(d){
            let state = d.key;
            let sdg_val = d.value;

            vert_dict[state] = {}
            vert_dict[state][sdg_ind] = sdg_val

            covid_data_days = covid_data[state].filter(function(d){return d.DateUNIX.getTime()===end_date.getTime()})
            if (covid_data_days.length == 0){
                //No recording of day
                vert_dict[state][cov_ind] = null
            } else {
                if(isPerPop && covid_data_days[0][cov_ind] != null){
                    vert_dict[state][cov_ind] = (covid_data_days[0][cov_ind]/pop_data[state])*100000
                } else {
                    vert_dict[state][cov_ind] = covid_data_days[0][cov_ind]
                }
                min_val = Math.min(min_val, vert_dict[state][cov_ind])
                max_val = Math.max(max_val, vert_dict[state][cov_ind])

            }
        }
    )
    return  [vert_dict,min_val,max_val];
}

function getMaxCovid(cov_ind){
    let isPerPop = d3.select("#vertCompPerPop").property("checked")
    let max = 0;
    let val = 0;
    d3.entries(covid_data).forEach(function(d){
        let state = d.key;
        d.value.forEach(function(d){
            if(isPerPop){
                val = (d[cov_ind]/pop_data[state])*100000
            }
            else{
                val = d[cov_ind]
            }
            if (val > max){
                max = val
            }
        })
    })
    console.log(max)
    return max;
}


function getVertCompLinearScale(isTotalRange, total_max_val, max_val){
    if(isTotalRange){
        return d3.scaleLinear()
            .domain([0,total_max_val])
            .range([0,vertCompare_width]);
    } else {
        return d3.scaleLinear()
            .domain([0,(max_val === 0 || max_val === null) ? 0.001 : max_val])
            .range([0,vertCompare_width])
    }
}

function sortVertDict(isCovidSort, vert_dict, cov_ind, sdg_ind){
    if (isCovidSort){
        return d3.entries(vert_dict).sort((a,b) => d3.descending(a.value[cov_ind],b.value[cov_ind]))
    } else {
        let sdg_ind = sdg_dropdown.property("value")
        let cov_ind = covid_dropdown.property("value")
        let end_date = date_slider.property("value")
        if(!sdg_ind.match('SDG \\d+ Index Score')){
            sdg_ind = sdg_ind+" (Index)"
            tmp = build_dict(sdg_ind, cov_ind, end_date)
            vert_dict = tmp[0]
        }
        return d3.entries(vert_dict).sort((a,b) => d3.descending(a.value[sdg_ind],b.value[sdg_ind]))
    }
}

function createVerticalComp(){
    let sdg_ind = sdg_dropdown.property("value")
    let cov_ind = covid_dropdown.property("value")
    let end_date = date_slider.property("value")

    stageWidth = d3.select("#main").node().clientWidth*0.20;

    tmp = build_dict(sdg_ind, cov_ind, end_date)
    vert_dict = tmp[0]
    min_val = tmp[1]
    max_val = tmp[2]

    vertCompare_margin = {top: 20, right: 100, bottom: 80, left: 90};
    vertCompare_width = 370 - vertCompare_margin.left - vertCompare_margin.right;
    vertCompare_height = 800 - vertCompare_margin.top - vertCompare_margin.bottom;

    isTotalRange = d3.select("#vertCompXRange").property("checked")
    let total_max_val = getMaxCovid(cov_ind)
    d3.select("#vertCompXRange").attr("total_max", total_max_val)
    let x = getVertCompLinearScale(isTotalRange, total_max_val, max_val);



    svg = d3.select("#svg_state_compare")
    .attr("width",stageWidth)
    //.attr("height",vertCompare_height+vertCompare_margin.top+vertCompare_margin.bottom)
    .attr("viewBox","0 0 "+ (vertCompare_width+vertCompare_margin.left+vertCompare_margin.right) + " "+(vertCompare_height+vertCompare_margin.top+vertCompare_margin.bottom))
    .append("g")
    .attr("transform", "translate("+vertCompare_margin.left+","+vertCompare_margin.top+")");


    isCovidSort = d3.select("#vertCompSort").property("checked")
    let vert_sort = sortVertDict(isCovidSort, vert_dict, cov_ind, sdg_ind)

    let y = d3.scaleBand()
        .range([0,vertCompare_height])
        .domain(vert_sort.map(function(d){return d.key}))
        .padding(.1);

    svg.selectAll("myRect")
        .data(vert_sort)
        .enter()
        .append("g")
        .attr("state", function(d){return d.key})
        .each(function(d){
            d3.select(this)
            .classed("vertComp_bar",true)
            .append("rect")
            .attr("x",x(0))
            .attr("y",function(d){return y(d.key)-2})
            .attr("width", function(d){
                let val = d.value[cov_ind]
                if(val === null){
                    return 0
                } else {
                    return x(val)
                }
            })
            .attr("value",function(d){return d.value[cov_ind]})
            .attr("height",y.bandwidth())
            .attr("fill","#138808")
            .classed("vertComp_val",true)


            d3.select(this)
            .append("rect")
            .attr("x",-(y.bandwidth())-2)
            .attr("y",function(d){return y(d.key)-2})
            .attr("width", y.bandwidth())
            .attr("height", y.bandwidth())
            .text(d.key)
            .classed("vertComp_bg",true)


             let origY = y(d.key)
             let origX = -2*(y.bandwidth())+23
            d3.select(this)
            .append("text")
            .text(d.key)
            .attr("x",origX)
            .attr("y",origY+1)
            .attr("width", y.bandwidth())
            .attr("height", y.bandwidth())
            .attr("font-size", y.bandwidth()/2)
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(90,"+origX+","+origY+") translate(7,6)")
            .classed("vertComp_label",true)

            d3.select(this)
            .append("rect")
            .attr("x",5-(y.bandwidth()*2))
            .attr("y",origY-1)
            .attr("width", 1+y.bandwidth()/1.6)
            .attr("height", y.bandwidth()-2)
            .attr("stroke", "black")
            .attr("fill-opacity",0)
            //.attr("transform","translate(0,22)")
            .classed("vertComp_decor",true)

            d3.select(this)
            .append("rect")
            .attr("x",x(0)+1)
            .attr("y",function(d){return y(d.key)+1})
            .attr("width", vertCompare_width-2)
            .attr("height", (y.bandwidth())-1)
            .classed("vertComp_overlay",true)
            .raise()
            .attr("opacity","0")
        }).on("mouseover",highlightState)
        .on('mouseout', state_mouseout)
        .on('mousemove',move_tooltip);

        d3.selectAll("#svg_state_compare").append("g")
        .append("line")
        .attr("x1",vertCompare_width).attr("x2",vertCompare_width)
        .attr("y1",vertCompare_margin.top).attr("y2",vertCompare_height+vertCompare_margin.top)
        .style("stroke-dasharray","5,5").style("stroke","black")

        d3.selectAll("#svg_state_compare").append("g")
        .append("line")
        .attr("x1",parseInt(vertCompare_width+vertCompare_margin.left)+1).attr("x2",parseInt(vertCompare_width+vertCompare_margin.left)+1)
        .attr("y1",vertCompare_margin.top).attr("y2",vertCompare_height+vertCompare_margin.top)
        .style("stroke-dasharray","5,5").style("stroke","black")

        d3.selectAll("#svg_state_compare").append("g")
        .attr("id","vertBar_note")
        .append("rect")
        .attr("x",vertCompare_width+vertCompare_margin.left+20)
        .attr("y",vertCompare_margin.top+1)
        .attr("width",y.bandwidth()-5)
        .attr("height",y.bandwidth()-5)
        .attr("fill","red")
        .attr("fill-opacity",0.5)
        .attr("stroke","red")
        d3.select("#vertBar_note")
        .append("text")
        .attr("font-size","0.75em")
        .attr("x",vertCompare_width+vertCompare_margin.left+y.bandwidth()+22)
        .attr("y",vertCompare_margin.top+12)
        .text("No data")

        d3.select("#vertCompXRange").on("change",function(){updateVerticalCompXRange();updateScatterplotCovid();})
        d3.select("#vertCompSort").on("change",updateVerticalCompSort)
        d3.select("#vertCompPerPop").on("change",function(){updateVerticalCompPerPop();updateLinePlot("JK");updateScatterplotCovid();})

        updateVerticalCompDate()
}

function updateVerticalCompSDG(){
    isCovidSort = d3.select("#vertCompSort").property("checked")


        let sdg_ind = sdg_dropdown.property("value")
        let cov_ind = covid_dropdown.property("value")
        let end_date = date_slider.property("value")
        tmp = build_dict(sdg_ind, cov_ind, end_date)

        vert_dict = tmp[0]
        min_val = tmp[1]
        max_val = tmp[2]

        let vert_sort = sortVertDict(isCovidSort, vert_dict, cov_ind, sdg_ind)

        let y = d3.scaleBand()
            .range([0,vertCompare_height])
            .domain(vert_sort.map(function(d){return d.key}))

        vert_sort.forEach(function(d){
            let fill = d3.select("#svg_map path[id="+d.key+"]").attr("fill")

            d3.selectAll("#svg_state_compare g g[state="+d.key+"] > rect.vertComp_bg").transition()
            .duration(500)
            .attr("fill",fill)

            if(!isCovidSort){
                setTimeout(function(){d3.selectAll("#svg_state_compare g g[state="+d.key+"] > *").transition()
                .duration(1000)
                .attr("transform", function(d){
                    if(d3.select(this).classed("vertComp_label")){
                        return "rotate(90,"+(-2*(y.bandwidth())+18)+","+y(d.key)+")"
                    } else {return null;}
                })
                .attr("y",function(){
                    if(d3.select(this).classed("vertComp_decor")){
                        return y(d.key)+1
                    } else if (d3.select(this).classed("vertComp_label")){
                        return parseInt(y(d.key)-2)
                    } else {
                        return y(d.key)
                    }
                })
                },600);
            }


        //To use after Alice is done with heatmap:

         })


}

function updateVerticalCompPerPop(){
    let sdg_ind = sdg_dropdown.property("value")
    let cov_ind = covid_dropdown.property("value")
    let end_date = date_slider.property("value")
    tmp = build_dict(sdg_ind, cov_ind, end_date)

    vert_dict = tmp[0]
    min_val = tmp[1]
    max_val = tmp[2]

    //Calculate and assign new total max value
    isTotalRange = d3.select("#vertCompXRange").property("checked")
    let total_max_val = getMaxCovid(cov_ind)
    d3.select("#vertCompXRange").attr("total_max", total_max_val)
    let x = getVertCompLinearScale(isTotalRange, total_max_val, max_val);

    d3.entries(vert_dict).forEach(function(d){
        let val = d.value[cov_ind]
        if(val === null){
            d3.select("#svg_state_compare g g[state="+d.key+"] rect.vertComp_val").transition()
            .duration(1000)
            .attr("width", 0)
            .attr("value",0)
            .attr("x",x(0))
        } else {
            d3.select("#svg_state_compare g g[state="+d.key+"] rect.vertComp_val").transition()
            .duration(1000)
            .attr("width", x(val))
            .attr("value",val)
            .attr("x",x(0))}
    })

    setTimeout(function(){
        isCovidSort = d3.select("#vertCompSort").property("checked")
        if(isCovidSort){
            let vert_sort = sortVertDict(isCovidSort, vert_dict, cov_ind, sdg_ind)

            let y = d3.scaleBand()
                .range([0,vertCompare_height])
                .domain(vert_sort.map(function(d){return d.key}))

            vert_sort.forEach(function(d){
                d3.selectAll("#svg_state_compare g g[state="+d.key+"] > *").transition()
                .duration(1000)

                .attr("transform", function(d){
                    if(d3.select(this).classed("vertComp_label")){
                        return "rotate(90,"+(-2*(y.bandwidth())+18)+","+y(d.key)+")"
                    } else {return null;}
                })
                .attr("y",function(){
                    if(d3.select(this).classed("vertComp_decor")){
                        return y(d.key)+1
                    } else if (d3.select(this).classed("vertComp_label")){
                        return parseInt(y(d.key)-2)
                    } else {
                        return y(d.key)
                    }
                })

            })
        }
    },1100)
    svg = d3.select("#svg_state_compare g")
    // Removes the y axis
    svg.selectAll(".axis_x").remove();
    let mtmp = 0;
    if(isTotalRange){
        mtmp = total_max_val
    } else {
        mtmp = max_val
    }
    // Re-adds the y axis again
    svg.append("g")
        .classed("axis_x",true)
        .call(d3.axisTop(x).tickValues([0, mtmp/2,mtmp]));
}

function updateVerticalCompXRange(){
    let sdg_ind = sdg_dropdown.property("value")
    let cov_ind = covid_dropdown.property("value")
    let end_date = date_slider.property("value")
    tmp = build_dict(sdg_ind, cov_ind, end_date)

    vert_dict = tmp[0]
    min_val = tmp[1]
    max_val = tmp[2]

    isTotalRange = d3.select("#vertCompXRange").property("checked")

    let total_max_val = 0;
    if(isTotalRange){
        total_max_val = d3.select("#vertCompXRange").attr("total_max")
    }
    let x = getVertCompLinearScale(isTotalRange, total_max_val, max_val);

    d3.entries(vert_dict).forEach(function(d){
        let val = d.value[cov_ind]
        if(val === null){
            d3.select("#svg_state_compare g g[state="+d.key+"] rect.vertComp_val").transition()
            .duration(1000)
            .attr("width", 0)
            .attr("value",0)
            .attr("x",x(0))
        } else {
            d3.select("#svg_state_compare g g[state="+d.key+"] rect.vertComp_val").transition()
            .duration(1000)
            .attr("width", x(val))
            .attr("value",val)
            .attr("x",x(0))}
        })
    svg = d3.select("#svg_state_compare g")
    // Removes the y axis
    svg.selectAll(".axis_x").remove();
    let mtmp = 0;
    if(isTotalRange){
        mtmp = total_max_val
    } else {
        mtmp = max_val
    }
    // Re-adds the y axis again
    svg.append("g")
        .classed("axis_x",true)
        .call(d3.axisTop(x).tickValues([0, mtmp/2,mtmp]));

}

//Update sorting of states and linear scaling and length of bar charts
function updateVerticalCompCovid(){
    let sdg_ind = sdg_dropdown.property("value")
    let cov_ind = covid_dropdown.property("value")
    let end_date = date_slider.property("value")
    tmp = build_dict(sdg_ind, cov_ind, end_date)

    vert_dict = tmp[0]
    min_val = tmp[1]
    max_val = tmp[2]

    isTotalRange = d3.select("#vertCompXRange").property("checked")
    let total_max_val = getMaxCovid(cov_ind)
    d3.select("#vertCompXRange").attr("total_max", total_max_val)
    let x = getVertCompLinearScale(isTotalRange, total_max_val, max_val);

    d3.entries(vert_dict).forEach(function(d){
        let val = d.value[cov_ind]
        if(val === null){
            d3.select("#svg_state_compare g g[state="+d.key+"] rect.vertComp_val")
            .attr("width", 0)
            .attr("value",0)
            .attr("x",x(0))

            d3.select("#svg_state_compare g g[state="+d.key+"] rect.vertComp_overlay")
                .attr("fill","red")
                .attr("opacity",1)
                .attr("fill-opacity",0.5)
                .attr("stroke","red")
        } else {
            d3.select("#svg_state_compare g g[state="+d.key+"] rect.vertComp_val").transition()
            .duration(1000)
            .attr("width", x(val))
            .attr("value",val)
            .attr("x",x(0))

            d3.select("#svg_state_compare g g[state="+d.key+"] rect.vertComp_overlay")
            .attr("fill",null)
            .attr("opacity",0)}
    })

    setTimeout(function(){
        isCovidSort = d3.select("#vertCompSort").property("checked")
        if(isCovidSort){
            let vert_sort = sortVertDict(isCovidSort, vert_dict, cov_ind, sdg_ind)

            let y = d3.scaleBand()
                .range([0,vertCompare_height])
                .domain(vert_sort.map(function(d){return d.key}))

            vert_sort.forEach(function(d){
                d3.selectAll("#svg_state_compare g g[state="+d.key+"] > *").transition()
                .duration(1000)

                .attr("transform", function(d){
                    if(d3.select(this).classed("vertComp_label")){
                        return "rotate(90,"+(-2*(y.bandwidth())+18)+","+y(d.key)+")"
                    } else {return null;}
                })
                .attr("y",function(){
                    if(d3.select(this).classed("vertComp_decor")){
                        return y(d.key)+1
                    } else if (d3.select(this).classed("vertComp_label")){
                        return parseInt(y(d.key)-2)
                    } else {
                        return y(d.key)
                    }
                })

            })
        }
    },1100)
    svg = d3.select("#svg_state_compare g")
    // Removes the y axis
    svg.selectAll(".axis_x").remove();
    let mtmp = 0;
    if(isTotalRange){
        mtmp = total_max_val
    } else {
        mtmp = max_val
    }
    // Re-adds the y axis again
    svg.append("g")
        .classed("axis_x",true)
        .call(d3.axisTop(x).tickValues([0, mtmp/2,mtmp]));
}

function updateVerticalCompSort(){
    let sdg_ind = sdg_dropdown.property("value")
    let cov_ind = covid_dropdown.property("value")
    let end_date = date_slider.property("value")


    tmp = build_dict(sdg_ind, cov_ind, end_date)
    vert_dict = tmp[0]
    min_val = tmp[1]
    max_val = tmp[2]

    isCovidSort = d3.select("#vertCompSort").property("checked")
    let vert_sort = sortVertDict(isCovidSort, vert_dict, cov_ind, sdg_ind)

    let y = d3.scaleBand()
        .range([0,vertCompare_height])
        .domain(vert_sort.map(function(d){return d.key}))

    vert_sort.forEach(function(d){
        d3.selectAll("#svg_state_compare g g[state="+d.key+"] > *").transition()
        .duration(1000)

        .attr("transform", function(d){
            if(d3.select(this).classed("vertComp_label")){
                return "rotate(90,"+(-2*(y.bandwidth())+18)+","+y(d.key)+")"
            } else {return null;}
        })
        .attr("y",function(){
            if(d3.select(this).classed("vertComp_decor")){
                return y(d.key)+1
            } else if (d3.select(this).classed("vertComp_label")){
                return parseInt(y(d.key)-2)
            } else {
                return y(d.key)
            }
        })

    })
}

function updateVerticalCompDate(){
    let sdg_ind = sdg_dropdown.property("value")
    let cov_ind = covid_dropdown.property("value")
    let end_date = date_slider.property("value")

    tmp = build_dict(sdg_ind, cov_ind, end_date)
    vert_dict = tmp[0]
    min_val = tmp[1]
    max_val = tmp[2]

    //Check if total max is to be fetched
    isTotalRange = d3.select("#vertCompXRange").property("checked")
    let total_max_val = 0;
    if(isTotalRange){
        total_max_val = d3.select("#vertCompXRange").attr("total_max")
    }

    //Generate linear scaling
    let x = getVertCompLinearScale(isTotalRange, total_max_val, max_val);


    d3.entries(vert_dict).forEach(function(d){
        let val = d.value[cov_ind]
        if(val === null){
            console.log("LOL")
            d3.select("#svg_state_compare g g[state="+d.key+"] rect.vertComp_val")
            .attr("width", 0)
            .attr("value",0)
            .attr("x",x(0))

            d3.select("#svg_state_compare g g[state="+d.key+"] rect.vertComp_overlay")
                .attr("fill","red")
                .attr("opacity",1)
                .attr("fill-opacity",0.5)
                .attr("stroke","red")

        } else {
            d3.select("#svg_state_compare g g[state="+d.key+"] rect.vertComp_val")
            .attr("width", x(val))
            .attr("value",val)
            .attr("x",x(0))

            d3.select("#svg_state_compare g g[state="+d.key+"] rect.vertComp_overlay")
            .attr("fill",null)
            .attr("opacity",0)
        }
    })
    svg = d3.select("#svg_state_compare g")
    // Removes the y axis
    svg.selectAll(".axis_x").remove();

    let mtmp = d3.max([total_max_val,max_val])
    // Re-adds the y axis again
    svg.append("g")
        .classed("axis_x",true)
        .call(d3.axisTop(x).tickValues([0, mtmp/2,mtmp]));

    /* Not sure I like the behaviour of having the records flip around while the user is still holding on to the button
    isCovidSort = d3.select("#vertCompSort").property("checked")
    if(isCovidSort){
        let vert_sort = sortVertDict(isCovidSort, vert_dict, cov_ind, sdg_ind)

        let y = d3.scaleBand()
            .range([0,vertCompare_height])
            .domain(vert_sort.map(function(d){return d.key}))

        vert_sort.forEach(function(d){
            d3.selectAll("#svg_state_compare g g[state="+d.key+"] > *").transition()
            .duration(1000)
            .attr("y",y(d.key))

        })
    }*/
}