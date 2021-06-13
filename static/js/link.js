function highlightState(){
    let s = d3.select(this).attr("state")
    d3.selectAll("#svg_map path[state=" + s + "]")
        .attr('stroke', 'green')
        .attr('stroke-width', 2)
        .raise();
    d3.selectAll("#svg_state_compare g[state=" + s + "] .vertComp_val")
        .attr('fill', '#000080')
        .attr('stroke-width', 2)
        .raise();
    d3.selectAll("#svg_scatterplot circle[state=" + s + "]")
        .style('fill', '#000080')
        .raise();

    updateLinePlot(s);
    updateTooltip(s);

    tooltip.style("visibility","visible")
    tooltip.select("h3").text(sdg_data["States/UTs"][s]);
    //tooltip.select("p").text(ind + ": " + val);
}
function move_tooltip(){
    let tooltip_width = d3.select(".tooltip").node().getBoundingClientRect().width
    if(d3.select(this).classed("vertComp_bar")){
        tooltip.style("top",event.pageY + 10 + "px").style("left", event.pageX - tooltip_width - 10 +"px")
    } else {
        tooltip.style("top",event.pageY + 10 + "px").style("left", event.pageX + 10 +"px")
    }
}
function state_mouseout(){
    let s = d3.select(this).attr("state");
    d3.select("#svg_state_compare g[state=" + s + "] .vertComp_val").attr("fill", "#138808");
    d3.select("#svg_map path[state=" + s + "]").attr("stroke", "black").attr("stroke-width", 0.5);
    d3.selectAll("#svg_scatterplot circle[state=" + s + "]").style('fill', '#138808');
    d3.select(".tooltip").style("visibility","hidden")
}

//On hover for OECD country elements
/*
function highlightCountry(){
    let c = d3.select(this).attr("country");

    //Select the related circle/path, color and put in foreground
    d3.select("circle[country=" + c + "]").attr("fill", "red").raise();
    d3.select("path[country=" + c + "]").attr("stroke", "red").attr("stroke-width", 1).raise();

    //Extract index from our data structure (filter reduces our location array to one hit with a key-value object)
    let i = d3.entries(data.LOCATION).filter(function(d){return d.value == c})[0].key

    //Find full name in our data element and add to top section
    d3.select("p#country").text(data["Country"][i])

    //Additional behaviour if indicator is active (=element exists for which class is set)
    if(!d3.select(".biplot_indicator.active").empty()){

        //Get indicator name and index of country in our data structure
        let ind = d3.select(".biplot_indicator.active").attr("indicator");
        let i = d3.entries(data.LOCATION).filter(function(d){return d.value == c})[0].key

        //Use index and indicator name to extract data from our data structure
        name = data["Country"][i]
        val = data[ind][i]

        //Blend in the tooltip and add our data
        tooltip.style("visibility","visible")
        tooltip.select("h3").text(name);
        tooltip.select("p").text(ind + ": " + val);
    }
}

//On mouseout, reset country path/circle to default, remove text and hide tooltip
function country_mouseout(){
    let c = d3.select(this).attr("country");
    d3.select("circle[country=" + c + "]").attr("fill", "grey");
    d3.select("path[country=" + c + "]").attr("stroke", "black").attr("stroke-width", 0.5);
    d3.select("p#country").text("\u00A0")
    d3.select(".tooltip").style("visibility","hidden")
}

//Update tooltip based on mouse position
function move_tooltip(){
    tooltip.style("top",event.pageY + 10 + "px").style("left", event.pageX + 10 +"px")
}

//Removes active class from all indicator selection elements, resets choropleth map and removes indicator name
function deactivateIndicator(){
        d3.selectAll(".biplot_indicator").classed("active",false)
        d3.selectAll("#indicator-list p").classed("active",false)
        d3.selectAll("path.oecd").attr("fill-opacity",0.8).attr("fill","grey")
        d3.select("p#indicator").text("\u00A0")
}

//When clicking on an indicator selector
function activateIndicator(){
    event.stopPropagation() //This is necessary so the body's deactiveIndicator() doesn't trigger

    if (d3.select(this).classed("active")){ //click the same indicator again to turn off
        deactivateIndicator()
    } else {
        deactivateIndicator()

        //Get indicator name
        let ind = d3.select(this).attr("indicator");

        //Get respective selection elements
        line = d3.select("line[indicator=\"" + ind + "\"]");
        p = d3.select("#indicator-list p[indicator=\"" + ind + "\"]")

        //Set elements active and put in foreground (active styling through CSS)
        p.classed("active", true);
        line.classed("active", true);
        line.raise();

        //Add text to top section
        d3.select("p#indicator").text(ind)

        For choropleth map scaling I decided to scale from min to max value.
        I feel this is the most proper solution next to setting ranges for each indicator individually.
        E.g. mapping everything to 0-max or 0-100 would deliver a flawed impression.
        indMax = d3.max(d3.entries(data[ind]),function(d){return d.value}) //d3.entries to transform our dict to array
        indMin = d3.min(d3.entries(data[ind]),function(d){return d.value})

        //Map the values to our opacity range
        let op = d3.scaleLinear()
            .domain([indMin,indMax])
            .range([0.1,1])

        //Change fill color to highlight active indicator selection
        d3.selectAll("path.oecd").data(d3.entries(data.LOCATION)).attr("fill","purple")

        //Go through each entry in our OECD data
        d3.entries(data.LOCATION)
            .map(function(d){
                d3.select("path[country=" + d.value + "]") //select the path
                .attr("fill-opacity", op(data[ind][d.key])) //extract our data and map to opacity
            })
    }
}*/