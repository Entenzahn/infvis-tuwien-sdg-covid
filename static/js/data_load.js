var sdg_data;
var covid_data

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
        CovidDropdown()
    });


}