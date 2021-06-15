var sdg_data;
var covid_data;
var pop_data;
var tooltip;
var stage_width;

function load_data(){

    d3.json("static/data/sdg.json").then(function(data){
        state_width = d3.select("#main").node().clientWidth
        sdg_data = data
        console.log(data)
        console.log(d3.entries(sdg_data))
        SDGDropdown();
        setTimeout(function(){
            initMap();

            d3.json("static/data/covid.json").then(function(data){
                covid_data = data
                console.log(data)
                console.log(d3.entries(covid_data))
                d3.values(covid_data)
                    .forEach(function(d){
                        d.forEach(function(d2){
                            d2.DateUNIX = new Date(d3.timeParse(d2.Date))
                        })
                    })
                CovidDropdown()

                DateSlider()
                setTimeout(function(){
                    createVerticalComp()
                    initScatterplot()
                    updateVerticalCompSDG();
                    tooltip = initTooltip()
                    generateLineChart(tooltip.select("#tooltip_trend"),"JK",400,150)
                    d3.select("#svg_map").node().style.marginLeft = scatterplotStageWidth+"px"
                },100);
            });
        },100)

    });

    d3.json("static/data/pop.json").then(function(data){
        pop_data = data
    });

}