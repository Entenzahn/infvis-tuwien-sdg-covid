//Bar chart for vertical comparison (next to map)
var vertCompare_width = 0;
var vertCompare_margin = {};
var vertCompare_height = 0;

//ToDo: Show numbers, highlight null values

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
                if(isPerPop){
                    vert_dict[state][cov_ind] = (covid_data_days[0][cov_ind]/pop_data[state])*100000
                } else {
                    vert_dict[state][cov_ind] = covid_data_days[0][cov_ind]
                }
                min_val = Math.min(min_val, vert_dict[state][cov_ind])
                max_val = Math.max(max_val, vert_dict[state][cov_ind])

                /*IDIOT:min_val = Math.min(min_val, covid_data_days[0][cov_ind])
                max_val = Math.max(max_val, covid_data_days[0][cov_ind])*/
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
        return d3.entries(vert_dict).sort((a,b) => d3.descending(a.value[sdg_ind],b.value[sdg_ind]))
    }
}

function createVerticalComp(){
    let sdg_ind = sdg_dropdown.property("value")
    let cov_ind = covid_dropdown.property("value")
    let end_date = date_slider.property("value")

    stageWidth = d3.select("#main").node().clientWidth*0.15;

    tmp = build_dict(sdg_ind, cov_ind, end_date)
    vert_dict = tmp[0]
    min_val = tmp[1]
    max_val = tmp[2]

    vertCompare_margin = {top: 20, right: 30, bottom: 80, left: 90};
    vertCompare_width = 300 - vertCompare_margin.left - vertCompare_margin.right;
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

    /*svg.append("g")
    .attr("transform", "translate(0," + vertCompare_height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");*/


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
            .attr("y",function(d){return y(d.key)})
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
            .attr("x",-(y.bandwidth()))
            .attr("y",function(d){return y(d.key)})
            .attr("width", y.bandwidth())
            .attr("height", y.bandwidth())
            .text(d.key)
            .classed("vertComp_bg",true)

            d3.select(this)
            .append("text")
            .text(d.key)
            .attr("x",-(y.bandwidth()))
            .attr("y",function(d){return y(d.key)})
            .attr("width", y.bandwidth())
            .attr("height", y.bandwidth())
            .classed("vertComp_label",true)

            d3.select(this)
            .append("text")
            .text(function(d){return d.value[cov_ind]})
            .attr("x",-(y.bandwidth()*2))
            .attr("y",function(d){return y(d.key)})
            .attr("width", y.bandwidth())
            .attr("height", y.bandwidth())
            .classed("vertComp_number",true)

            d3.select(this)
            .append("rect")
            .attr("x",x(0))
            .attr("y",function(d){return y(d.key)})
            .attr("width", vertCompare_width)
            .attr("height", y.bandwidth())
            .classed("vertComp_overlay",true)
            .raise()
            .attr("opacity","0")
        }).on("mouseover",highlightState)
        .on('mouseout', state_mouseout)
        .on('mousemove',move_tooltip);

        d3.select("#vertCompXRange").on("change",function(){updateVerticalCompXRange();updateScatterplotCovid();})
        d3.select("#vertCompSort").on("change",updateVerticalCompSort)
        d3.select("#vertCompPerPop").on("change",function(){updateVerticalCompPerPop();updateLinePlot("JK");updateScatterplotCovid();})
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
                .attr("y",y(d.key))
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
                .attr("y",y(d.key))

            })
        }
    },1100)
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
                .attr("y",y(d.key))

            })
        }
    },1100)
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
        .attr("y",y(d.key))

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
            d3.select("#svg_state_compare g g[state="+d.key+"] rect.vertComp_val")
            .attr("width", 0)
            .attr("value",0)
            .attr("x",x(0))
        } else {
            d3.select("#svg_state_compare g g[state="+d.key+"] rect.vertComp_val")
            .attr("width", x(val))
            .attr("value",val)
            .attr("x",x(0))}
        })

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