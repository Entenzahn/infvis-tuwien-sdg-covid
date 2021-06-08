var sdg_data;
var covid_data;
var pop_data;

function load_data(){

    d3.json("static/data/sdg.json").then(function(data){
        sdg_data = data
        console.log(data)
        console.log(d3.entries(sdg_data))
        SDGDropdown();
    });

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
        createVerticalComp()
    });


    d3.json("static/data/pop.json").then(function(data){
        pop_data = data
    });

}