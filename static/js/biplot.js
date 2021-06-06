//REFERENCE ONLY - DELETE WHEN DONE

let margin = {left: 50, right: 50, top: 50, bottom: 50}
let plotWidth = 500;
let plotHeight = 500;
let drawWidth =  plotWidth-margin.left-margin.right;
let drawHeight =  plotHeight-margin.top-margin.bottom;

function initBiplot(biplot_cnt, biplot_ind) {

    //Group both biplot layers
    let svg = d3.select("#svg_chart")
        .attr("width", plotWidth)
        .attr("height", plotHeight)
      .append("g")
        .attr("transform", "translate(" + margin.left +"," + margin.top + ")") //Shift drawing area to account for margin

    //Extract min/max domain values to establish linear mapping
    let maxpc1 = d3.max(biplot_cnt, function(d){return d.PC1});
    let maxpc2 = d3.max(biplot_cnt, function(d){return d.PC2});
    let minpc1 = d3.min(biplot_cnt, function(d){return d.PC1});
    let minpc2 = d3.min(biplot_cnt, function(d){return d.PC2});

    //Establish mapping of PC domain range to plot area
    let x = d3.scaleLinear()
        .domain([minpc1,maxpc1])
        .range([0,drawWidth]) //0 starts at translated point, width must account for margins

    let y = d3.scaleLinear()
        .domain([minpc2,maxpc2])
        .range([drawHeight,0]) //Must be from max to min

    //Create arrowhead elements
    svg.append("svg:defs").append("svg:marker")
        .attr("id", "arrow")
        .attr("viewBox", "0 -3 10 10")
        .attr("refX", 0.5)
        .attr("markerWidth", 5)
        .attr("markerHeight", 5)
        .attr("orient", "auto")
        .attr("fill", "grey")
        .attr("opacity", 0.8)
      .append("svg:path")
        .attr("d", "M0,-3L6,0L0,3");

    //Active arrowheads are the same except colored (assigned through CSS)
    svg.append("svg:defs").append("svg:marker")
        .attr("id", "arrow-active")
        .attr("viewBox", "0 -3 10 10")
        .attr("refX", 0.5)
        .attr("markerWidth", 5)
        .attr("markerHeight", 5)
        .attr("orient", "auto")
        .attr("fill", "purple")
        .attr("opacity", 0.8)
      .append("svg:path")
        .attr("d", "M0,-3L6,0L0,3");


    //Add arrows to plot
    svg.append("g")
        .selectAll("line")
        .data(biplot_ind).enter() //for each indicator
      .append("line")
        .attr("x1", x(0))
        .attr("y1", y(0))
        .attr("x2", function(d){return x(d.PC1*(maxpc1-minpc1))}) //Map component influence to PC value ranges
        .attr("y2", function(d){return y(d.PC2*(maxpc2-minpc2))})
        .attr("marker-end", "url(#arrow)")
        .attr("stroke", "grey")
        .attr("stroke-width", 5)
        .attr("opacity", 0.8)
        .attr("indicator", function(d){return d.attribute}) //Store indicator name for easy reference
        .attr("class", "biplot_indicator")
        .on("click", activateIndicator);


    //Draw the circles
    svg.append("g")
        .selectAll("circle")
        .data(biplot_cnt).enter() //for each country
      .append("circle")
        .attr("cx", function(d){return x(d.PC1)}) //x axis is PC1
        .attr("cy", function(d){return y(d.PC2)}) //y axis is PC2
        .attr("r",7)
        .attr("fill","grey")
        .attr("fill-opacity", 0.7)
        .attr("country", function(d){return d.LOCATION}) //Store location in element for easy reference
        .on("mouseover", highlightCountry)
        .on("mousemove", move_tooltip)
        .on("mouseout", country_mouseout);


}