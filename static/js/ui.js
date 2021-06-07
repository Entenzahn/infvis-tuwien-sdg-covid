var sdg_dropdown
var covid_dropdown
var end_date

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
    //Find mind and max dates:
    min_dates = []
    d3.values(covid_data).forEach(function(d){min_dates.push(d[0].DateUNIX)})

    max_dates = []
    d3.values(covid_data).forEach(function(d){max_dates.push(d[d.length-1].DateUNIX)})

    console.log(min_dates)
    console.log(max_dates)

    min_date = new Date(Math.min.apply(null,min_dates))
    max_date = new Date(Math.max.apply(null,max_dates))

    let margin = {top:0, right:50, bottom:0, left:50},
    width = 1200 -margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

    let formatDateIntoMonth = d3.timeFormat("%m/%Y");
    let formatDate = d3.timeFormat("%d %b %Y");

    let svg = d3.select("#date_select")

    svg.attr("width", width+margin.left+margin.right)
        .attr("height", height);

    let x = d3.scaleTime()
        .domain([min_date,max_date])
        .range([0, width])
        .clamp(true);

    let slider = svg.append("g")
        .attr("class","slider")
        .attr("transform", "translate("+margin.left + ","+height/2+")");

     slider.append("line")
    .attr("class", "track")
    .attr("x1", x.range()[0])
    .attr("x2", x.range()[1])
  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "track-inset")
  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "track-overlay")
    .call(d3.drag()
        .on("start.interrupt", function() { slider.interrupt(); })
        .on("start drag", function() {date_select(x.invert(d3.event.x)); }));

slider.insert("g", ".track-overlay")
    .attr("class", "ticks")
    .attr("transform", "translate(0," + 18 + ")")
  .selectAll("text")
    .data(x.ticks(10))
    .enter()
    .append("text")
    .attr("x", x)
    .attr("y", 10)
    .attr("text-anchor", "middle")
    .text(function(d) { return formatDateIntoMonth(d); });

var label = slider.append("text")
    .attr("class", "label")
    .attr("text-anchor", "middle")
    .text(formatDate(min_date))
    .attr("transform", "translate(0," + (-25) + ")")

var handle = slider.insert("circle", ".track-overlay")
    .attr("class", "handle")
    .attr("r", 9);

function date_select(d) {
  handle.attr("cx", x(d));
  label
    .attr("x", x(d))
    .text(formatDate(d));
  end_date = d;
}
}