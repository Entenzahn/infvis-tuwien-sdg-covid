let mapWidth = 1105;
let mapHeight = 800;

function initMap() {
    // Loads the indian svg
        // Accesses the image document in xml language
    d3.xml("static/data/india.svg").then(function (data) {
        // Selects the right div for the map
        d3.select("#svg_map")
        // Scales the svg container
        .attr("width", mapWidth)
        .attr("height", mapHeight)
        // Attaches the xml data to the div
        .node().append(data.documentElement)
        });
}