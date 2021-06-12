//ToDo: add current date to vertical bar, add current date value to horizontal dashed line, display null values,

function minDate(cov_ind, state){
    return d3.min(covid_data[state].filter(function(d){return d[cov_ind] !== null}).map(d => d.DateUNIX))
}

function maxDate(cov_ind, state){
    return d3.max(covid_data[state].filter(function(d){return d[cov_ind] !== null}).map(d => d.DateUNIX))
}

function maxData(cov_ind, state){
    return d3.max(covid_data[state].filter(function(d){return d[cov_ind] !== null}).map(d => d[cov_ind]))
}

function generateLineChart(element, id, w, h){
    let sdg_ind = sdg_dropdown.property("value")
    let cov_ind = covid_dropdown.property("value")
    let curr_date = date_slider.property("value")
    let isPerPop = d3.select("#vertCompPerPop").property("checked")

    let margin = {top: 10, right: 30, bottom: 30, left: 50},
    width = w-margin.left-margin.right
    height = h-margin.top-margin.bottom

    let svg = element.append("svg")
        .classed("covLineChart",true)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("state",id)
        .attr("ind",cov_ind)
        .attr("date",curr_date.getTime())
        .classed("perPop", isPerPop)
        .attr("transform","translate(" + margin.left + "," + margin.top + ")");

    //Find first and last date for which there is data for any state
    min_date = d3.min(d3.keys(covid_data).map(d => minDate(cov_ind,d)))
    max_date = d3.max(d3.keys(covid_data).map(d => maxDate(cov_ind,d)))

    //Load data array for valid range
    data = covid_data[id].filter(function(d){return d.DateUNIX <= max_date && d.DateUNIX >= min_date})

    //
    let max_data = maxData(cov_ind,id)
    if (isPerPop){
        max_data = (max_data/pop_data[id])*100000*1.1
    } else {
        max_data = max_data*1.1 //getMaxData
    }


    let x = d3.scaleTime()
        .domain([min_date, max_date])
        .range([0,width])
    svg.append("g").classed("axis",true).attr("transform","translate(0,"+height+")").call(d3.axisBottom(x).ticks(10))

    let y = d3.scaleLinear()
        .domain([0,max_data])
        .range([height, 0])
    svg.append("g").classed("axis",true).call(d3.axisLeft(y).ticks(10))

    svg.append("path")
        .classed("trend-plot",true)
        .datum(data)
        .attr("fill","#cce5df")
        .attr("stroke","69b3a2")
        .attr("stroke-width",1.5)
        .attr("d", d3.area()
            .x(function(d){return x(d.DateUNIX)})
            .y0(y(0))
            .y1(function(d){
                if (isPerPop){
                    return y((d[cov_ind]/pop_data[id])*100000)
                } else {
                    return y(d[cov_ind])
                }
            })
        )
}

function updateLinePlot(id){
    let cov_ind = covid_dropdown.property("value"),
    curr_date = date_slider.property("value"),
    isPerPop = d3.select("#vertCompPerPop").property("checked")

    w = d3.select("svg.covLineChart").attr("width")
    h = d3.select("svg.covLineChart").attr("height")
    svg = d3.selectAll("svg.covLineChart > g")

    let stateHasChanged = (id !== svg.attr("state")),
    covIndHasChanged = (cov_ind !== svg.attr("ind")),
    dateHasChanged = (curr_date.getTime() !== parseInt(svg.attr("date"))),
    perPopHasChanged = (isPerPop !== svg.classed("perPop"))

    //Set date boundaries
    min_date = d3.min(d3.keys(covid_data).map(d => minDate(cov_ind,d)))
    max_date = d3.max(d3.keys(covid_data).map(d => maxDate(cov_ind,d)))

    data = covid_data[id].filter(function(d){return d.DateUNIX <= max_date && d.DateUNIX >= min_date})

    //Set data boundaries
    let max_data = maxData(cov_ind,id)
    if (isPerPop){
        max_data = (max_data/pop_data[id])*100000*1.1
    } else {
        max_data = max_data*1.1 //getMaxData
    }

    let margin = {top: 10, right: 30, bottom: 30, left: 50},
    width = w-margin.left-margin.right
    height = h-margin.top-margin.bottom

    //Set x scale
    let x = d3.scaleTime()
        .domain([min_date, max_date])
        .range([0,width])
    //Set y scale
    let y = d3.scaleLinear()
        .domain([0,max_data])
        .range([height, 0])

    if(dateHasChanged && curr_date >= min_date && curr_date <= max_date){
    let ind_width = 2
    svg.selectAll(".date-indicator").remove()

    svg.append("rect")
        .classed("date-indicator",true)
        .attr("x",x(curr_date)-(ind_width/2))
        .attr("width",ind_width)
        .attr("y",y(max_data))
        .attr("height",height)
        .attr("fill","red")
    svg.attr("date", curr_date.getTime())
    } else if (stateHasChanged || covIndHasChanged || perPopHasChanged){

        svg.selectAll(".axis").remove()
        svg.append("g").classed("axis",true).attr("transform","translate(0,"+height+")").call(d3.axisBottom(x).ticks(10))
        svg.append("g").classed("axis",true).call(d3.axisLeft(y).ticks(10))

        svg.select(".trend-plot").datum(data).transition().duration(1000)
        .attr("d", d3.area()
            .x(function(d){return x(d.DateUNIX)})
            .y0(y(0))
            .y1(function(d){
                if (isPerPop){
                    return y((d[cov_ind]/pop_data[id])*100000)
                } else {
                    return y(d[cov_ind])
                }
            })
        )

        svg.attr("state",id).attr("ind",cov_ind).classed("perPop",isPerPop)
    }
}