//ToDo: deal with null values, consistent coloring, perhaps only use index values and display SDG numbers in tooltip, legend

let mapWidth = 1105;
let mapHeight = 800;
let map = null;
let heatmap = null;

// Initiates a blank map of India
function initMap() {

    // Loads the Indian svg by accessing the image document in xml language
    d3.xml("static/data/india.svg").then(function (data) {

        // Selects the div for the map
        d3.select("#svg_map")
            .attr("width", mapWidth) // Scales the svg container
            .attr("height", mapHeight) // Scales the svg container
            .node().append(data.documentElement) // Attaches the xml data to the div

        // Styles the SVG path
        map = d3.select("#svg_map").select("#svg2").selectAll("path")
            .attr("fill", "white")
            // updateMap(sdg_ind))
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
                    .range(["#FF0000","#FEFB01"])

    // Creates the heatmap
    d3.select("#svg_map").select("#svg2").selectAll("path")
        .attr("fill", function(d){
                val = sdg_activated_values[this.id]
                if(val == null){
                    return "grey";
                } else {
                    return color_scale(sdg_activated_values[this.id])
                }
            })
        .attr("state",function(){return this.id})
        // Adds hovering events
        .on("mouseover",highlightState)
        .on('mouseout', state_mouseout)
        .on('mousemove',move_tooltip);
}