function SDGDropdown(){

    let selector = d3.select("#selector_sdg")
        .select("select")

    selector.selectAll("option")
        .data(d3.entries(sdg_data))
        .enter()
        .filter(function (d){return (d.key !== "States/UTs")})
        .append("option")
        .attr("value",function (d){return d.key})
        .text(function (d){return d.key});

    selector.on("change", function(d) {
        activateSDG(d3.select(this).property("value"));
    })
}
function CovidDropdown(){

    let selector = d3.select("#selector_covid")
        .select("select")

    selector.selectAll("option")
        .data(d3.entries(d3.entries(covid_data)[0].value[0]))
        .enter()
        .filter(function (d){return (d.key !== "State" && d.key !== "Date")})
        .append("option")
        .attr("value",function (d){return d.key})
        .text(function (d){return d.key})

    selector.on("change", function(d) {
        activateCovid(d3.select(this).property("value"));
    })
}