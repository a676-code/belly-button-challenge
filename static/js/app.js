const samples_url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// getting the data from the url and logging it
d3.json(samples_url).then(function(data) {
    console.log("Data: ", data.samples);
});

function init() {
    let menu = d3.select("#selDataset"); 

    // We need to append the options to the dropdown menu
    d3.json(samples_url).then((data) => {
        // taking the "names" entry from the dictionary
        let names = data.names;

        names.map((name) => {
            menu.append("option").text(name).property("value", name);
        });

        // logging names[0] gives 940, the first id
        // In other words, we want the default menu to display the first name in the list

        console.log("names 0:", names[0])

        demographicInfo(names[0]);
        barPlot(names[0]);
        bubblePlot(names[0]);
    });
};

function barPlot(sample) {
    d3.json(samples_url).then((data) => {
        let samples = data.samples;

        // filtering so that the id matches that of the sample
        let matchedSamples = samples.filter((item) => {
            return item.id == sample;
        });

        sample_values = matchedSamples[0].sample_values;
        otu_ids = matchedSamples[0].otu_ids;
        otu_labels = matchedSamples[0].otu_labels;

        // slicing the ten values and putting them in descending order
        let xticks = sample_values.slice(0,10);
        let yticks = otu_ids.slice(0,10).map(item => `OTU ${item}`);
        let labels = otu_labels.slice(0,10);

        let trace1 = {
            x:xticks.reverse(),
            y:yticks.reverse(),
            text:labels.reverse(),
            type:"bar",
            orientation: "h"
        };

        let layout = {
            title: "Top Ten OTUs"
        };

        traceData = [trace1]

        Plotly.newPlot("bar", traceData, layout);
    });
};

function bubblePlot(sample) {
    d3.json(samples_url).then((data) => {
        let samples = data.samples;

        // filtering for results that match the sample
        let matchedSamples = samples.filter((item) => {
            return item.id == sample;
        });

        sample_values = matchedSamples[0].sample_values;
        otu_ids = matchedSamples[0].otu_ids;
        otu_labels = matchedSamples[0].otu_labels;

        let xticks = otu_ids;
        let yticks = sample_values;

        let trace1 = {
            x: xticks,
            y: yticks,
            text: otu_labels,
            mode: "markers",
            // https://plotly.com/javascript/bubble-charts/
            // https://plotly.com/javascript/colorscales/
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
        }

        traceData = [trace1]

        layout = {
            title: "OTUs"
        }

        Plotly.newPlot("bubble", traceData, layout)
    });
};

function demographicInfo(sample) {
    d3.json(samples_url).then((data) => {
        let metadata = data.metadata;

        let value = metadata.filter(item => item.id == sample);

        console.log("value:", value)
        
        // clear the div so that it's ready for the new info
        d3.select("#sample-metadata").html("");

        // https://stackoverflow.com/questions/54651873/how-to-map-key-value-pairs-of-a-map-in-javascript
        Object.entries(value[0]).map(([key,value]) => {
            // append each key, value pair to the div that corresponds to id="sample-metadata"
            d3.select("#sample-metadata").append("p").text(`${key}: ${value}`);
        });
    });
};

function optionChanged(sample) {

    console.log("next value:", sample);
    // rerunning these functions so that the metadata and plots get updated
    demographicInfo(sample);
    barPlot(sample);
    bubblePlot(sample);
};

// running the init function to initialize the aspects of the page
init();