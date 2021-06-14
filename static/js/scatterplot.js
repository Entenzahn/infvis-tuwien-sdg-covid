// Sets the dimensions and margins of the graph
var scatterplotWidth;
var scatterplotHeight;
var scatterplotStageWidth;

function initScatterplot() {
    scatterplotStageWidth = d3.select("#main").node().clientWidth*0.20;
    let map_height = d3.select("#svg_map").node().clientHeight;

    let margin = {top: 10, right: 30, bottom: 30, left: 60};
    scatterplotWidth = 400 - margin.left - margin.right;
    scatterplotHeight = 340 - margin.top - margin.bottom;

    let sdg_ind = sdg_dropdown.property("value"),
        cov_ind = covid_dropdown.property("value");

    // Append the svg object to the body of the page
    let svg = d3.select("#svg_scatterplot")
        .attr("width", scatterplotStageWidth)// + margin.left + margin.right)
        //.attr("height", scatterplotHeight + margin.top + margin.bottom)
        .attr("viewBox","0 0 "+(scatterplotWidth+ margin.left + margin.right)+" "+(scatterplotHeight+ margin.top + margin.bottom))
        .attr("transform", "translate(0,"+(map_height-scatterplotHeight)+")")
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //console.log(sdg_ind, cov_ind);

    // Add X axis
    min_ind = -10,
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

    //console.log(d3.keys(covid_data));

    updateScatterplotSDG(sdg_ind);
    updateScatterplotCovid(cov_ind);
}

function updateScatterplotSDG(sdg_activated){
    let sdg_ind = sdg_dropdown.property("value")
    let cov_ind = covid_dropdown.property("value")
    let end_date = date_slider.property("value")


    if(!sdg_activated.match('SDG \\d+ Index Score')){
        sdg_activated = sdg_activated+" (Index)"
        console.log(sdg_activated)
    }

    // Scaling variables for the x axis
    let sdg_activated_values = sdg_data[sdg_activated];
    /*min_val = d3.min(d3.entries(sdg_activated_values),function(d){return d.value});
    max_val = d3.max(d3.entries(sdg_activated_values),function(d){return d.value});*/
    min_val = -10
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

    svg.selectAll("circle").each(function(d){
        let c = d3.select(this)
        let s = c.attr("state")
        val = sdg_activated_values[s]

        c.attr("cx",x(val))
    })

    //ToDo push null values into -5 area
    //d3.select("#svg_scatterplot").select(".axis_x").selectAll("text").filter(function(d){return d=="-10"}).text("No data")
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

    svg.selectAll("circle").each(function(d){
        let c = d3.select(this)
        let s = c.attr("state")
        val = vert_dict[s][cov_ind]

        c.attr("cy",y(val))
    })

    /*d3.entries(covid_data).forEach(function(d){
        let state = d.key;
        d.value.forEach(function(d){
                val = d[cov_ind]
                console.log(val)})})*/

}