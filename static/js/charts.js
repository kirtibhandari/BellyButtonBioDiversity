function init() {
   // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

//   // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
     var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

// Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
  
};

// Initialize the dashboard
init();

function optionChanged(newSample) {
  buildMetadata(newSample);
  buildCharts(newSample);
};

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var result = resultArray[0];
   
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;
    var sample_values = result.sample_values;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    

    topTen_otu_ids = otu_ids.slice(0, 10);
    new_ids = topTen_otu_ids.map(function(num){
      return "OTU   " + String(num)
    });
    new_ids = new_ids.reverse();
    var yTicks = new_ids;
    
    new_sample_values = sample_values.slice(0, 10);
    new_sample_values = new_sample_values.reverse();

    new_otu_labels=otu_labels.slice(0, 10);
    new_otu_labels = new_otu_labels.reverse();
    
   // 8. Create the trace for the bar chart. 
    var trace1 = {
      x: new_sample_values,
      y: yTicks,
      text: new_otu_labels,
      type: "bar",
      orientation: "h"
      
    };

    var barData = [trace1];

    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      paper_bgcolor: "lightcyan" ,     
      width: 500,
      height: 450
    };
    
    //To make the chart responsive to screen
    var config = {responsive: true};

    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout,config);
    
    //Create trace for bubble chart
    var trace2 = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode:"markers",
      marker:{size:sample_values, color:otu_ids, colorscale:'Earth'}
      
    };
    var bubbleData = [trace2];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: { title: 'OTU ID'} , 
      hovermode:'closest'
     };
     var config_bubble = {responsive: true};
    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout,config_bubble);


    // 4. Create the trace for the gauge chart.
    d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    
    // Create a variable that holds the first sample in the array.
    var result = resultArray[0];
    var washing_freq = parseFloat(result.wfreq);

    var trace3 = {
      value : washing_freq,
      type: "indicator",
      mode: "gauge+number",
      title: { text: "Scrubs Per Week", font: { size: 15 } },
      gauge: {
        axis: { range: [null, 10] },
        bar: { color: "black" },
      steps: [
        { range: [0, 2], color: "red" },
        { range: [2, 4], color: "orange" },
        { range: [4, 6], color: "gold" },
        { range: [6, 8], color: "limegreen" },
        { range: [8, 10], color: "green" }
      ]
      }
    };
    var gaugeData = [trace3];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 400,
      height: 400,
      margin: { t: 25, r: 25, l: 25, b: 25 },
      title:"<b>Belly Button Washing Frequency</b>",
      font: { color: "darkblue",size:12},
   
    };
    var config = {responsive: true};
    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge', gaugeData, gaugeLayout,config);
  });
});



}
