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
            //.attr("width", mapWidth) // Scales the svg container
            //.attr("height", mapHeight) // Scales the svg container
            .node().append(data.documentElement) // Attaches the xml data to the div

        // Styles the SVG path
        map = d3.select("#svg_map").select("#svg2")
            .attr("width", stageWidth) // Scales the svg container
            .attr("height", null) // Scales the svg container
            .attr("viewBox","0 0 "+mapWidth+" "+mapHeight)
            .selectAll("path")
            .attr("fill", "white")
            .attr('stroke', 'black')
            .attr('stroke-width', 0.5);

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
        console.log(sdg_activated)
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
                    .range(["#FFEEDD","#FF9933"])

    /*let color_scale = d3.scaleLinear()
                    .domain([0, 100])
                    .range([0.2,1.0])*/

    // Creates the heatmap
    d3.select("#svg_map").select("#svg2").selectAll("path")
        .attr("fill", function(d){
                val = sdg_activated_values[this.id]
                if(val == null){
                    return "grey";
                } else {
                    //return "#FF9933"
                    return color_scale(sdg_activated_values[this.id])
                }
            })
        /*.attr("fill-opacity",function(d){
            val = sdg_activated_values[this.id]
            if(val == null){
                    return 1;
                } else {
                    return color_scale(val)
                }
            })*/
        .attr("state",function(){return this.id})
        // Adds hovering events
        .on("mouseover",highlightState)
        .on('mouseout', state_mouseout)
        .on('mousemove',move_tooltip);
}