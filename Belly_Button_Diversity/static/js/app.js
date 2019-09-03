/*****************************************************************/
// @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
    // let metaDataPanel = d3.select('#sample-metadata');

    // Use `.html("") to clear any existing metadata

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
/*****************************************************************/
function buildMetadata(sample) {
  
  // Use d3 to select the panel with id of `#sample-metadata`
  let metaDataPanel = d3.select('#sample-metadata');
 
  // Use `.html("") to clear any existing metadata
  metaDataPanel.html("");

  //d3.json returns jsonified version of the sample metadata:
  d3.json(`/metadata/${sample}`)
    //once retrieved, build the table:
    .then(function(sampleMetaData) {
      
      Object.entries(sampleMetaData).forEach(([key, value]) => {
        // console.log(key, value);
        let trow = metaDataPanel.append('tr');
        trow.text(`${key}: ${value}`);

        let blankrow = metaDataPanel.append('tr');
        blankrow.text("-");
      });

      // BONUS: Build the Gauge Chart
      let weeklyScrubs = 0;
      weeklyScrubs = sampleMetaData.WFREQ;
      console.log(weeklyScrubs);

      let gaugeData = [{
        domain: {
          x: [0,1],
          y: [0,1]
        },
        value: weeklyScrubs,
        title: {
          text: "Scrubs per Week"
        },
        type: "indicator",
        mode: "gauge"
      }];

      let gaugeLayout = {
        height: 300,
        width: 300,
        margin: {
          t: 0, b: 0,
          r: 0, l: 0
        }
      };

      Plotly.newPlot("gauge", gaugeData, gaugeLayout);

    });
}


/*****************************************************************/
// @TODO: Use `d3.json` to fetch the sample data for the plots
    // @TODO: Build a Bubble Chart using the sample data

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
/*****************************************************************/
function buildCharts(sample) {

  d3.json(`/samples/${sample}`).then(function(sampleData) {
       
    //Buld Pie Chart:
    updatePieChart(sampleData);

    //Build Bubble Chart:
    updateBubbleChart(sampleData);

  });

}


/*****************************************************************/
//function to update the pie chart:
/*****************************************************************/
function updatePieChart(sampleData) {

  //assign values from json object to variables:
  let otuIDs = sampleData.otu_ids.slice(0, 10);
  let sampleValues = sampleData.sample_values.slice(0, 10);
  let otuLabels = sampleData.otu_labels.slice(0, 10);

  //must be in an array:
  let pieData = [{
    type: "pie",
    values: sampleValues,
    labels: otuIDs
    //RF: hover text is messing up the labels:
    // text: otuLabels
    // options: {
    //   tooltips: {
    //     mode: otuLabels,
    //     text: otuLabels
    //   }
    // }
  }];

  //mus be in a dictionary:
  let pieLayout = {
    height: 650,
    width: 650
  };

  Plotly.newPlot("pie", pieData, pieLayout);

}


/*****************************************************************/
//function to update the bubble chart:
/*****************************************************************/
function updateBubbleChart(sampleData) {

  //assign values from json object to variables:
  let otuIDs = sampleData.otu_ids;
  let sampleValues = sampleData.sample_values;
  let otuLabels = sampleData.otu_labels;

  let bubbleTraceData = [{
    x: otuIDs,
    y: sampleValues,
    text: otuLabels,  //hover labels
    mode: 'markers',
    marker: {
      size: sampleValues,
      color: otuIDs 
    }
  }];

  let bubbleLayout = {
    height: 600,
    width: 1200
  };

  //must be newPlot to clear out old data:
  Plotly.newPlot("bubble", bubbleTraceData, bubbleLayout);
}





/*****************************************************************/
//initialization:
/*****************************************************************/
function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}


/*****************************************************************/
//function to run when user changes the sample selection:
//called by the HTML file
/*****************************************************************/
function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}



/*****************************************************************/
// Call the initialization function to Initialize the dashboard
/*****************************************************************/
init();
