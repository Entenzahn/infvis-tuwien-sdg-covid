function activateSDG(sdg_ind){
    console.log(sdg_ind)
    cov_ind = "test"

    //Map behaviour on SDG indicator change:
    updateMap(sdg_ind);

    //Bar chart behaviour:
    updateVerticalCompSDG();

    //Scatterplot:
    updateScatterplotSDG(sdg_ind);

    //Trend overview:
    updateLinePlot("JK")
}

function activateCovid(cov_ind){
    console.log(cov_ind)
    sdg_ind = "test"
    //Map behaviour on Covid indicator change:

    //Bar chart behaviour:
    updateVerticalCompCovid();

    //Scatterplot:
    updateScatterplotCovid();

    //Trend overview:
    updateLinePlot("JK")
}

function updateDate(cur_date){
    //console.log(cur_date)
    //Map behaviour on Covid indicator change:

    //Bar chart behaviour:
    updateVerticalCompDate();
    //Scatterplot:
    updateScatterplotCovid();

    //Trend overview:
    updateLinePlot("JK")
}