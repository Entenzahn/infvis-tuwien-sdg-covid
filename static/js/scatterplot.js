// Sets the dimensions and margins of the graph

/*
Credit for wrap() to
https://stackoverflow.com/questions/24784302/wrapping-text-in-d3?lq=1
*/
function wrap(text, width) {
    text.each(function () {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1, // ems
            x = text.attr("x"),
            y = text.attr("y"),
            dy = 0, //parseFloat(text.attr("dy")),
            tspan = text.text(null)
                        .append("tspan")
                        .attr("x", x)
                        .attr("y", y)
                        .attr("dy", dy + "em");
        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan")
                            .attr("x", 0)
                            .attr("y", y)
                            .attr("dy", ++lineNumber * lineHeight + dy + "em")
                            .text(word);
            }
        }
    });
}


var scatterplotWidth;
var scatterplotHeight;
var scatterplotStageWidth;

function initScatterplot() {
    scatterplotStageWidth = d3.select("#main").node().clientWidth*0.20;
    let map_height = d3.select("#svg_map").node().clientHeight;

    let margin = {top: 10, right: 30, bottom: 160, left: 60};
    scatterplotWidth = 400 - margin.left - margin.right;
    scatterplotHeight = 440 - margin.top - margin.bottom;

    let sdg_ind = sdg_dropdown.property("value"),
        cov_ind = covid_dropdown.property("value");

    // Append the svg object to the body of the page
    let svg = d3.select("#svg_scatterplot")
        .attr("width", scatterplotStageWidth)// + margin.left + margin.right)
        //.attr("height", scatterplotHeight + margin.top + margin.bottom)
        .attr("viewBox","0 0 "+(scatterplotWidth+ margin.left + margin.right)+" "+(scatterplotHeight+ margin.top + margin.bottom))
        .attr("transform", "translate(0,"+(map_height-scatterplotHeight-margin.bottom+40)+")")
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //console.log(sdg_ind, cov_ind);

    // Add X axis
    min_ind = 0,
    max_ind = 100;

    var x = d3.scaleLinear()
    .domain([min_ind, max_ind])
    .range([ 0, scatterplotWidth]);
  svg.append("g")
    .classed("axis_x",true)
    .attr("transform", "translate(0," + scatterplotHeight + ")")
    .call(d3.axisBottom(x));

    // Add Y axis
    min_covid = 0,
    max_covid = 500000;

    var y = d3.scaleLinear()
    .domain([min_covid, max_covid])
    .range([scatterplotHeight, 0]);
  svg.append("g")
    .classed("axis_y",true)
    .call(d3.axisLeft(y));

    // Adds dummy dots
    svg.append("g")
        .selectAll("dot")
        .data(d3.keys(covid_data))
        .enter()
        .append("circle")
          .attr("state", function(d){
            return d
          })
          .attr("cx", x(0))
          .attr("cy", y(0))
          .attr("r", 3)
          .style("fill", "#000080")
          .on("mouseover",highlightState)
          .on('mouseout', state_mouseout)
          .on('mousemove',move_tooltip);

    svg.append("g")
        .attr("id","scatterplot_footnote")
        .append("text")
        .attr("font-size","0.75em")
        .attr("y",scatterplotHeight+35)
        .text("test")
        .call(wrap,scatterplotWidth,"test")

    //console.log(d3.keys(covid_data));

    updateScatterplotSDG(sdg_ind);
    updateScatterplotCovid(cov_ind);
}

function updateScatterplotSDG(sdg_activated){
    let sdg_ind = sdg_dropdown.property("value")
    let cov_ind = covid_dropdown.property("value")
    let end_date = date_slider.property("value")
    tmp = build_dict(sdg_ind, cov_ind, end_date)

    vert_dict = tmp[0]
    min_val = tmp[1]
    max_val = tmp[2]


    if(!sdg_activated.match('SDG \\d+ Index Score')){
        sdg_activated = sdg_activated+" (Index)"
        console.log(sdg_activated)
    }

    // Scaling variables for the x axis
    let sdg_activated_values = sdg_data[sdg_activated];
    /*min_val = d3.min(d3.entries(sdg_activated_values),function(d){return d.value});
    max_val = d3.max(d3.entries(sdg_activated_values),function(d){return d.value});*/
    min_val = 0
    max_val = 100

    let svg = d3.select("#svg_scatterplot g");

    var x = d3.scaleLinear()
        .domain([min_val, max_val])
        .range([0, scatterplotWidth])

    // Removes the x axis
    //svg.selectAll(".axis_x").remove();

    // Re-adds the x axis again
    /*svg.append("g")
        .classed("axis_x",true)
        .attr("transform", "translate(0," + scatterplotHeight + ")")
        .call(d3.axisBottom(x));*/

    let missing_states = []

    svg.selectAll("circle").each(function(d){
        let c = d3.select(this)
        let s = c.attr("state")
        val = sdg_activated_values[s]
        if (val != null && vert_dict[s][cov_ind] != null){
            c.attr("visibility","visible").attr("cx",x(val))
        } else {
            c.attr("visibility","hidden")
            state_name = sdg_data["States/UTs"][s]
            missing_states.push(state_name)
        }
    })

    textbox = d3.select("#scatterplot_footnote text")
    if(missing_states.length == 0){
       textbox.text("")
    } else{
        textbox.text("Missing values for: "+missing_states.join(", "))
        .call(wrap,scatterplotWidth)
    }

}

function updateScatterplotCovid(){
    let sdg_ind = sdg_dropdown.property("value")
    let cov_ind = covid_dropdown.property("value")
    let end_date = date_slider.property("value")
    let isTotalRange = d3.select("#vertCompXRange").property("checked")
    let isPerPop = d3.select("#vertCompPerPop").property("checked")

    tmp = build_dict(sdg_ind, cov_ind, end_date)
    vert_dict = tmp[0]
    min_val = tmp[1]
    max_val = tmp[2]

    // Scaling variables for the y axis
    min_covid = 0;
    max_covid = 0;
    if(isTotalRange){
        max_covid = getMaxCovid(cov_ind);
    } else {
        max_covid = max_val;
    }

    let svg = d3.select("#svg_scatterplot g");

    var y = d3.scaleLinear()
        .domain([min_covid, max_covid])
        .range([scatterplotHeight, 0])

    // Removes the y axis
    svg.selectAll(".axis_y").remove();

    // Re-adds the y axis again
    svg.append("g")
        .classed("axis_y",true)
        .call(d3.axisLeft(y));

    let missing_states = []

    svg.selectAll("circle").each(function(d){
        let c = d3.select(this)
        let s = c.attr("state")
        val = vert_dict[s][cov_ind]
        if (val != null && sdg_data[sdg_ind][s] != null){
            c.attr("visibility","visible").attr("cy",y(val))
        } else {
            c.attr("visibility","hidden")
            state_name = sdg_data["States/UTs"][s]
            missing_states.push(state_name)
        }
    })

    textbox = d3.select("#scatterplot_footnote text")
    if(missing_states.length == 0){
       textbox.text("")
    } else{
        textbox.text("Missing values for: "+missing_states.join(", "))
        .call(wrap,scatterplotWidth)
    }

}