// Sets the dimensions and margins of the graph
let margin = {top: 10, right: 30, bottom: 30, left: 60},
    scatterplotWidth = 460 - margin.left - margin.right,
    scatterplotHeight = 400 - margin.top - margin.bottom;

function initScatterplot() {

    let sdg_ind = sdg_dropdown.property("value"),
        cov_ind = covid_dropdown.property("value");

    // Append the svg object to the body of the page
    let svg = d3.select("#svg_scatterplot")
        .attr("width", scatterplotWidth + margin.left + margin.right)
        .attr("height", scatterplotHeight + margin.top + margin.bottom)
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
          return d})
          .attr("cx", 50)
          .attr("cy", 0.55)
          .attr("r", 3)
          .style("fill", "#FF0000")

    //console.log(d3.keys(covid_data));

    updateScatterplotSDG(sdg_ind);
    updateScatterplotCovid(cov_ind);
}

function updateScatterplotSDG(sdg_activated){

    // Scaling variables for the x axis
    let sdg_activated_values = sdg_data[sdg_activated];
    min_val = d3.min(d3.entries(sdg_activated_values),function(d){return d.value});
    max_val = d3.max(d3.entries(sdg_activated_values),function(d){return d.value});

    //console.log("SDG :", min_val, max_val);
    //console.log(sdg_activated_values);

    let svg = d3.select("#svg_scatterplot g");

    var x = d3.scaleLinear()
        .domain([min_val, max_val])
        .range([0, scatterplotWidth])

    // Removes the x axis
    svg.selectAll(".axis_x").remove();

    // Re-adds the x axis again
    svg.append("g")
        .classed("axis_x",true)
        .attr("transform", "translate(0," + scatterplotHeight + ")")
        .call(d3.axisBottom(x));

    svg.selectAll("circle")
    .data(d3.values(sdg_activated_values))
    .attr("cx", function(d){
    console.log(d);
    // Why not the same scale/px ?
    return x(d)});
}

function updateScatterplotCovid(covid_activated){

    // Scaling variables for the y axis
    min_covid = 0;
    max_covid = getMaxCovid(covid_activated);

    //console.log("Covid :", min_covid, max_covid);
    console.log(covid_data);

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

    /*d3.entries(covid_data).forEach(function(d){
        let state = d.key;
        d.value.forEach(function(d){
                val = d[cov_ind]
                console.log(val)})})*/

}