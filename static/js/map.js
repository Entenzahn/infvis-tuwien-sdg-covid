let mapWidth = 800;
let mapHeight = 500;
let map = null;
let mapData = null;


function initMap(data) {

    // loads the world map as topojson
    d3.json("../static/data/world-topo.json").then(function (countries) {

        // defines the map projection method and scales the map within the SVG
        let projection = d3.geoEqualEarth()
            .scale(180)
            .translate([mapWidth / 2, mapHeight / 2]);

        // generates the path coordinates from topojson
        let path = d3.geoPath()
            .projection(projection);

        // configures the SVG element
        let svg = d3.select("#svg_map")
            .attr("width", mapWidth)
            .attr("height", mapHeight);

        // map geometry
        mapData = topojson.feature(countries, countries.objects.countries).features;


        // generates and styles the SVG path
        map = svg.append("g")
            .selectAll("path")
            .data(mapData)
            .enter().append("path")
            .attr("d", path)
            .attr("stroke", "black")
            .attr("stroke-width", 0.5)
            .attr("fill-opacity",0.8)
            .attr("fill", function(d){ if (d3.values(data.LOCATION).includes(d.properties.id)){
                                          return "grey"
                                     } else return "white"}) //OECD data gets special coloring
            //For each country that is present in our OECD data:
            .each(function (d) {if (d3.values(data.LOCATION).includes(d.properties.id)){
            d3.select(this)
            .attr("country", function(d){ return d.properties.id}) //Store country name as attribute for easy reference
            .classed("oecd", true) //Add OECD class
            .on("mouseover", highlightCountry) //Add event behaviours
            .on("mousemove", move_tooltip)
            .on("mouseout", country_mouseout)}});

    });



}
