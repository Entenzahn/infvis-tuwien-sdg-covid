let mapWidth = 612;
let mapHeight = 696;
let map = null;
let heatmap = null;

// Initiates a blank map of India
function initMap() {
    stageWidth = d3.select("#main").node().clientWidth*0.35;

    // Loads the Indian svg by accessing the image document in xml language
    d3.xml("static/data/india.svg").then(function (data) {

        // Selects the div for the map
        d3.select("#svg_map")
            .node().append(data.documentElement) // Attaches the xml data to the div

        // Styles the SVG path
        map = d3.select("#svg_map").select("#svg2")
            .attr("width", stageWidth) // Scales the svg container
            .attr("height", null) // Scales the svg container
            .attr("viewBox","0 0 "+mapWidth+" "+mapHeight)
            .selectAll("path")
            .attr("fill", "white")
            .attr('stroke', 'white')
            .attr('stroke-width', 0.5);

        //Initiate legend

    let color_scale = d3.scaleLinear()
                    .domain([0, 100])
                    .range(["#EEEEEE","#000080"])

         let w = 300, h = 50;

    let key = d3.select("#svg2")
      .append("svg")
      .classed("map_legend",true)
      .attr("width", w)
      .attr("height", h*2+50)
      .attr("y",30)
      .attr("x",300);

    key.append("text")
      .attr("y", 22)
      .attr("x",15)
      .attr("dy", ".71em")
      .append("svg:tspan")
      .attr("x",15)
      .attr("y",22)
      .text("Heatmap is based on SDG-indexed values")
      .attr("font-size","0.66em")
      .append("svg:tspan")
      .attr("x",15)
      .attr("dy",13)
      .text("for each selected indicator")

    let legend = key.append("defs")
      .append("svg:linearGradient")
      .attr("id", "map_gradient")
      .attr("x1", "0%")
      .attr("y1", "100%")
      .attr("x2", "100%")
      .attr("y2", "100%")
      .attr("spreadMethod", "pad");

    legend.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", color_scale(0))
      .attr("stop-opacity", 1);

    legend.append("stop")
      .attr("offset", "33%")
      .attr("stop-color", color_scale(33.3))
      .attr("stop-opacity", 1);

    legend.append("stop")
      .attr("offset", "66%")
      .attr("stop-color", color_scale(66.6))
      .attr("stop-opacity", 1);

    legend.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", color_scale(100))
      .attr("stop-opacity", 1);

    key.append("rect")
      .attr("width", w-30)
      .attr("x",15)
      .attr("y",h-5)
      .attr("height", h - 30)
      .style("fill", "url(#map_gradient)")
      .attr("transform", "translate(0,10)");

    let y = d3.scaleLinear()
      .range([285, 15])
      .domain([100, 0]);

    let yAxis = d3.axisBottom()
      .scale(y)
      .ticks(8);

    key.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(0,"+(h+25)+")")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("axis title");

      let note = key.append("g")
        .attr("class","note")
      key.append("rect")
        .attr("y",h*2+10)
        .attr("x",15)
        .attr("width",10)
        .attr("height",10)
      key.append("text")
        .attr("y",h*2+19)
        .attr("x",30)
        .text("No data")
        .attr("font-size","0.7em")
        .attr("vertical_align","bottom")

        // Displays the first heatmap in the beginning
        let sdg_ind = sdg_dropdown.property("value");
        updateMap(sdg_ind);
    });
}

// Displays the heatmap of the activated SDG
function updateMap(sdg_activated){
    // Scaling variables for the choropleth map
    if(!sdg_activated.match('SDG \\d+ Index Score')){
        sdg_activated = sdg_activated+" (Index)"
    }
    let sdg_activated_values = sdg_data[sdg_activated];
    max_val = d3.max(d3.entries(sdg_activated_values),function(d){return d.value})
    min_val = d3.min(d3.entries(sdg_activated_values),function(d){return d.value})
    //console.log(min_val, max_val);

    // Builds the color scale mapping the minimum and maximum values
    /*let color_scale = d3.scaleLinear()
                    .domain([min_val, max_val])
                    .range(["#FEFB01", "#FF0000"])*/

    let color_scale = d3.scaleLinear()
                    .domain([0, 100])
                    .range(["#EEEEEE","#000080"])

    /*let color_scale = d3.scaleLinear()
                    .domain([0, 100])
                    .range([0.2,1.0])*/

    // Creates the heatmap
    d3.select("#svg_map").select("#svg2").selectAll("path")
        .attr("fill", function(d){
                if(this.id!=""){
                    val = sdg_activated_values[this.id]
                    if(val == null){
                        return "black";
                    } else {
                        //return "#FF9933"
                        return color_scale(sdg_activated_values[this.id])
                    }
                } else return null
            })
        .attr("stroke",function(d){
            val = sdg_activated_values[this.id]
            if(this.id == "LD"){
                    return color_scale(sdg_activated_values[this.id])
                } else return "white";
            })
        .attr("stroke-width",0.5)
        .attr("state",function(){return this.id})
        // Adds hovering events
        .on("mouseover",highlightState)
        .on('mouseout', state_mouseout)
        .on('mousemove',move_tooltip);
}