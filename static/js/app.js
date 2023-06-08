const samples_url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// getting the data from the url
d3.json(samples_url).then(function(data) {
    console.log("Data: ", data.samples);

    let samples = data.samples;
    let sample_values = samples.sample_values;
    let ids = samples.otu_ids;
    let labels = samples.otu_labels;

    console.log("samples: ", samples);
    console.log("sample values: ", sample_values);
    console.log("ids: ", ids);
    console.log("labels: ", labels);
});

function init() {
    let menu = d3.select("#selDataset"); 

    // We need to append the options to the dropdown menu
    d3.json(samples_url).then((data) => {
        // taking the "names" entry from the dictionary
        let names = data.names;

        names.map((name) => {
            menu.append("option")
            .text(name)
            .property("value", name);
        });

        // logging this gives 940, the first id
        first = names[0];

        // IOW, we want the default menu to display the first name in the list
        barPlot(first);
        bubblePlot(first);
        metadata(first);
    });
}

function barPlot(sample) {
    d3.json(samples_url).then((data) => {
        let samples = data.samples;

        // filtering for results that match the sample
        function matchSample (sample) {
            console.log("SAMPLE", sample)
            return samples.id == sample;
        }
        let matchedSamples = samples.filter(matchSample)

        sample_values = matchedSamples.sample_values;
        otu_ids = matchedSamples.otu_ids;
        otu_labels = matchedSamples.otu_labels;

        console.log("ids:", otu_ids);
        console.log("labels", otu_labels);
        console.log("SV:", sample_values);

        // slicing the ten values and putting them in descending order
        // FIX: doesn't like slice
        let xticks = sample_values.slice(0,10).reverse();
        let yticks = otu_ids.slice(0,10).reverse();
        let lables = otu_labels.slice(0,10).reverse()

        let trace1 = {
            x:xticks,
            y:yticks,
            text:labels,
            type:"bar",
            orientation: "h"
        };

        let layout = {
            title: "Top Ten OTUs"
        };

        traceData = [trace]

        Plotly.newPlot("bar", traceData, layout)
    });
};

function bubblePlot(sample) {
    let samples = data.samples;

    // filtering for results that match the sample
    function matchSample (sample) {
        return (something => something.id == sample);
    }
    matchedSamples = samples.filter(matchSample)

    sample_values = matchedSamples.sample_values;
    otu_ids = matchedSamples.otu_ids;
    otu_labels = matchedSamples.otu_labels;

    console.log("ids:", otu_ids);
    console.log("labels", otu_labels);
    console.log("SV:", sample_values);

    xticks = otu_ids;
    yticks = sample_values;

    trace1 = {
        x: xticks,
        y: yticks,
        text: otu_labels,
    }

    traceData = [trace1]

    layout = {
        title: "OTUs"
    }

    Plotly.newPlot("bubble", traceData, layout)
}

function metadata(sample) {
    d3.json(samples_url).then((data) => {
        let metadata = data.metadata;

        let value = metadata.filter(result => result.id == sample);

        console.log("value:", value)
        let valueMetadata = value[0];
        console.log("value 0:", value[0])
        
        // clear the table so that it's ready for the new info
        d3.select("#sample-metadata").html("");

        // FIX
        valueMetadata.map((key,value) => {
            // append each key, value pair div that corresponds to id="sample-metadata"
            d3.select("#sample-metadata").append("p").text(`${key}: ${value}`);
        });
    });
}

function optionChanged(sample) {
    // rerunning these functions so that the metadata and plots get updated
    metadata(sample);
    barPlot(sample);
    bubblePlot(sample);
}

init();