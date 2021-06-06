function activateSDG(sdg_ind){
    console.log(sdg_ind)
    cov_ind = "test"

    //Map behaviour on SDG indicator change:

    //Bar chart behaviour:
    createVerticalComp()

    //Scatterplot:

    //Trend overview:
}

function activateCovid(cov_ind){
    console.log(cov_ind)
    sdg_ind = "test"
    //Map behaviour on Covid indicator change:

    //Bar chart behaviour:
    createVerticalComp(sdg_ind, cov_ind)

    //Scatterplot:

    //Trend overview:
}