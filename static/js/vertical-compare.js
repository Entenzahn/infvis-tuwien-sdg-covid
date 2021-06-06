//Bar chart for vertical comparison (next to map)
function createVerticalComp(){
    let sdg_ind = sdg_dropdown.property("value")
    let cov_ind = covid_dropdown.property("value")
    let end_date = "2021-02-02"

    let vert_dict = {}
    d3.entries(sdg_data[sdg_ind]).forEach(function(d){
            let state = d.key;

            let sdg_val = d.value;

            vert_dict[state] = {}
            vert_dict[state][sdg_ind] = sdg_val

            covid_data_days = covid_data[state].filter(function(d){return d.Date===end_date})
            if (covid_data_days.length == 0){
                //No recording of day
                vert_dict[state][cov_ind] = null
            } else {
                vert_dict[state][cov_ind] = covid_data_days[0][cov_ind]
            }
        }
    )
    console.log(vert_dict)

    d3.select("#svg_state_compare").append("g").selectAll("p")
        .data(d3.entries(sdg_data[sdg_ind]))
        .enter()
        .append("p")
        .text(function(d){
            let state = d.key;
            let sdg_val = d.value;
            let cov_val = covid_data[d.key].filter(function(d){return d.Date==="2021-02-02"})[0][cov_ind]
            return state + " " + sdg_val + " " + cov_val
        })
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