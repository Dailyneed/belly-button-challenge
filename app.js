const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";


// Promise Pending
const dataPromise = d3.json(url);
console.log("Data Promise: ", dataPromise);
// View the data array
d3.json(url).then(function(data){
    console.log(data);
});

// function to set values in drowp down
function dropdown(data) {
    let samples = Object.values(data.names);
    let selector = d3.select("#selDataset");
    for (let i = 0; i < samples.length; i++) {
        selector.append("option").text(samples[i]).property("value", samples[i]);
    }

}

// To display demographic info based on drop down selection
function displayDemographicInfo(data, selectedId) {
    let metaData = Object.values(data.metadata);
    for (let i =0; i < metaData.length; i++){
        let currentmetaData = metaData[i];
        if (currentmetaData.id == selectedId) {
            console.log(currentmetaData);

            let id = currentmetaData.id;
            let ethnicity = currentmetaData.ethnicity;
            let gender = currentmetaData.gender;
            let age = currentmetaData. age;
            let location = currentmetaData.location;
            let bbtype = currentmetaData.bbtype;
            let wfreq = currentmetaData.wfreq;

            let statement1 = 'id:' + id;
            let statement2 ='ethnicity:' + ethnicity;
            let statement3 = 'gende:' + gender;
            let statement4 = 'age:' + age;
            let statement5 = 'location:' + location;
            let statement6 = 'bbtype:' + bbtype;
            let statement7 = 'wfreq:' + wfreq;
            demogBox = d3.select("#sample-metadata");

            demogBox.html(statement1 + '<br>' + statement2 + '<br>' + statement3 + '<br>' 
            + statement4 + '<br>' + statement5 + '<br>' + statement6 + '<br>' + statement7);                
        };
    };
}

// Get top 10 OTUs and create horizontal bar chart
function charts(data, id) {
    let sampleOtus = Object.values(data.samples);
    // create an array to hold label
    let topTenOtusIds = [];
    // create an array to hold value
    let topTenValues = [];
    // create an array to hover test
    let topTenHoverText = [];

    let otu_ID = [];
    let sample_Values = [];
    let otu_Labels = [];
    let sortedOtu_ID =[];

    for (let i = 0; i < sampleOtus.length; i++) {
        currentSampleOtus = sampleOtus[i];
        if (currentSampleOtus.id == id) {
            console.log(currentSampleOtus);

            otu_ID = currentSampleOtus.otu_ids;
            sample_Values = currentSampleOtus.sample_values;
            otu_Labels = currentSampleOtus.otu_labels;
            sortedOtu_ID = otu_ID.slice(0,10);
            // To invert graph
            for (let j = sortedOtu_ID.length -1; j >= 0; j--) {
                topTenOtusIds.push("OTU" + " " + sortedOtu_ID[j]);
            };
            let sortedSample_Values = sample_Values.slice(0,10);
            for (let k = sortedSample_Values.length -1; k >= 0; k--) {
                topTenValues.push(sortedSample_Values[k]);
            };
            let sortedOtu_Labels = otu_Labels.slice(0, 10);
            for (let l = sortedOtu_Labels.length -1; l >= 0; l--) {
                topTenHoverText.push(sortedOtu_Labels[i]);
            };
           
        };
    };
    // Create the trace for the bar chart
    let plotData =[{
        type: 'bar',
        x: topTenValues,
        y: topTenOtusIds,
        orientation: 'h',
        mode: 'markers',
        marker: { size: 16},
        text: topTenHoverText
    }];
    // Create layout for bar chart
    let barLayout = {
        title: "Top 10 Bacteria in Belly Button",
        //xaxis: {title: "Bacteria Sample Values"},
        //yaxis:{title: "OTU IDs"}
    };
    // Display bar chart
    Plotly.newPlot('bar', plotData, barLayout);
    
    // Create trace for bubble chart
    let bubbleData = [{
        type: 'bubble',
        x: otu_ID,
        y: sample_Values,
        text: otu_Labels,
        hoverinfo: topTenHoverText,
        mode: 'markers',
        marker: {size: sample_Values, color: otu_ID, colorscale: "Earth"}

    }];
    // Create layout for bubble chart
    let bubbleLayout = {
        title: "Belly Button Bacteria Per Sample",
        xaxis: {title: "OTU ID"},
        hovermode: "closet",
        margin: {l:100, r:35, b:50, t:75, pad:4}

    };
    // Display bubble chart
    // ADDED BY MUBARAK -> capital P for Plot in newPlot
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    // Create trace for guage chart
    // Create variable for washing frequency
    let selectedId = d3.select("#selDataset").property("value");
    let metaData = Object.values(data.metadata);
    for (let i = 0; i < metaData.length; i++) {
        let currentmetaData = metaData[i];
        if (currentmetaData.id == selectedId) {
            console.log(currentmetaData);
            let washfreq = currentmetaData.wfreq;
            console.log(washfreq);
            let gaugeData = [{
                value: washfreq,
                title:{text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week", font: {size:20}, align: 'center'},
                type: "indicator",
                mode: 'gauge+number',
                gauge: {
                    shape: 'angular',
                    bar: {color: 'white'},
                    axis: { 
                        range: [null, 10], 
                        visible: true,
                        tickmode: 'array',
                        tickvals: [0, 2, 4, 6, 8, 10],
                        ticks: "outside"
                    },          
                                         
                    steps:[
                        {range: [0, 2], color: 'red'},
                        {range: [2, 4], color: 'orange'},
                        {range: [4, 6], color: 'yellow'},
                        {range: [6, 8], color: 'lime'},
                        {range: [8, 10], color: 'green'},
                    ],
                    
                }
            }];
             // Create guage layout
            let gaugeLayout = {margin:{ t: 25, r: 25, l: 25, b: 25 
                
            }};
    
            // Display guage plot
            Plotly.newPlot("gauge", gaugeData, gaugeLayout);

        }
    }
    

}

// Initial functiom
function init() {
    d3.json(url).then(function(data) {
        let sample = Object.values(data.names);
        console.log(sample);
        // set value in drop down
        dropdown(data);
        // get current selected value in drop down
        let selectedId = d3.select("#selDataset").property("value");
        console.log(selectedId);

        //display demographic info
        displayDemographicInfo(data, selectedId);

        //display bar chart
        charts(data, selectedId);
    });
}
// To update info on change of of drop down
function optionChanged(){
    // get new value selcted
    let selected = d3.select("#selDataset").property("value");
    // get data and update demographicInfo
    d3.json(url).then(function(data) {
        displayDemographicInfo(data, selected);
        charts(data, selected)
    });
}
// initialize the dashboard
init();