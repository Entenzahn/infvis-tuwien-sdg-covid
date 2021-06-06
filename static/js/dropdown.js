var sdg_dropdown
var covid_dropdown

function SDGDropdown(){

    sdg_dropdown = d3.select("#selector_sdg")
        .select("select")

    sdg_dropdown.selectAll("option")
        .data(d3.entries(sdg_data))
        .enter()
        .filter(function (d){return (d.key !== "States/UTs")})
        .append("option")
        .attr("value",function (d){return d.key})
        .text(function (d){return d.key});

    sdg_dropdown.on("change", function(d) {
        activateSDG(d3.select(this).property("value"));
    })
}
function CovidDropdown(){

    covid_dropdown = d3.select("#selector_covid")
        .select("select")

    covid_dropdown.selectAll("option")
        .data(d3.entries(d3.entries(covid_data)[0].value[0]))
        .enter()
        .filter(function (d){return (d.key !== "State" && d.key !== "Date")})
        .append("option")
        .attr("value",function (d){return d.key})
        .text(function (d){return d.key})

    covid_dropdown.on("change", function(d) {
        activateCovid(d3.select(this).property("value"));
    })
}

function DateSlider(){
    dateslider = d3.select("#date_select")

    //Find mind and max dates:

    //tmp
    min_date = "2021-01-01"
    max_date = "2021-06-01"

    d3.entries(covid_data).min(function(d){return d[0].Date})

    dateslider.append("g")
}