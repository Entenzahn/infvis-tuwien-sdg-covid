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

    console.log(cov_ind);
}