//Bar chart for vertical comparison (next to map)
function createVerticalComp(){
    let sdg_ind = sdg_dropdown.property("value")
    let cov_ind = covid_dropdown.property("value")

    let vert_dict = {};
    let min_val = null;
    let max_val = null;

    d3.entries(sdg_data[sdg_ind]).forEach(function(d){
            let state = d.key;
            let sdg_val = d.value;

            vert_dict[state] = {}
            vert_dict[state][sdg_ind] = sdg_val

            covid_data_days = covid_data[state].filter(function(d){return d.DateUNIX.getTime()===end_date.getTime()})
            if (covid_data_days.length == 0){
                //No recording of day
                vert_dict[state][cov_ind] = null
            } else {
                vert_dict[state][cov_ind] = covid_data_days[0][cov_ind]
                min_val = Math.min(min_val, covid_data_days[0][cov_ind])
                max_val = Math.max(max_val, covid_data_days[0][cov_ind])
            }
        }
    )
    console.log(vert_dict)
    console.log(min_val)
    console.log(max_val)

    //let x = d3.scaleLinear

    /*d3.select("#svg_state_compare").append("g").selectAll("rect")
        .data(d3.entries(vert_dict))
        .enter()
        .append("rect")
        .text(function(d){
            let state = d.key;
            let sdg_val = d.value;
            let cov_val = covid_data[d.key].filter(function(d){return d.Date==="2021-02-02"})[0][cov_ind]
            return state + " " + sdg_val + " " + cov_val
        })*/
    //iterate through sdg_data[sdg_ind]
        //For each state:
        //sdg = sdg_data[sdg_ind][state] -> Value
        //cov_dict = covid_data[state].filter(function(d){return d.Date===DATE}) -> dict object for date
        //cov = cov_dict[cov_ind]

    //Figure out sorting
}

function updateVerticalCompSDG(sdg_ind){
    //Update coloring and sorting of states
}

function updateVerticalCompCovid(sdg_ind){
    //Update sorting of states and linear scaling and length of bar charts
}