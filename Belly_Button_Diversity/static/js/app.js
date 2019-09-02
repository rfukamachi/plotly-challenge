/*****************************************************************/
// @TODO: Complete the following function that builds the metadata panel
/*****************************************************************/
function buildMetadata(sample) {
    
    //use d3 to select the tbody:
    let metaDataTable = d3.select('.table tbody');
    // console.log(metaDataTable);

    //clear the table before refilling if any:
    metaDataTable.html("");


    //d3.json returns jsonified version of the sample metadata:
    d3.json(`/metadata/${sample}`)
      //once retrieved, build the table:
      .then(function(sampleMetaData) {
        
        Object.entries(sampleMetaData).forEach(([key, value]) => {
          // console.log(key, value);
          let trow = metaDataTable.append('tr');
          let tkey = trow.append('td');
          let tvalue = trow.append('td');
          tkey.text(key);
          tvalue.text(value);
        });


      });



        // // console.log(sampleMetaData);

        // let metaDataArr = Object.entries(sampleMetaData);

        // metaDataArr.forEach(function(factItem){
        //   console.log('k', factItem[0]);
        //   console.log('v', factItem[1]);
        //   console.log('***');


        // });


        

        // });



// Use `d3.json` to fetch the metadata for a sample
  // Use d3 to select the panel with id of `#sample-metadata`
    // let metaDataPanel = d3.select('#sample-metadata');
      // Use `.html("") to clear any existing metadata

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.



    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  // d3.json(`/samples/${sample}`).then(...)
    // @TODO: Build a Bubble Chart using the sample data

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
}

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

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
