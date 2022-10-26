//Crearting the selectData Opition
d3.json("samples.json").then(function(incomingData) {
    
  //Populate the dropdown
  d3.select("#selDataset")
      .selectAll("option")
      .data(incomingData.names)
      .enter()
      .append("option")
      .text(d=>d)
      .attr("value",d=>d);

  optionChanged(d3.select("#selDataset").property("value"));
});

//Creating the Horizontal Bar
function CreateHorizontalBar(x,y,text) 
{
  var data = [{
      type: 'bar',
      orientation: 'h',
      x: x,
      y: y,
      marker: {
        color: 'rgb(158,202,225)',
        opacity: 0.6,
        line: {
          color: 'rgb(8,48,107)',
          width: 1.5
        }}
  }];

  Plotly.newPlot('bar', data);
}

//Creating the Bubble Chart
function CreateBubbleChart(x,y,text) {
  var data = [{
      x: x,
      y: y,
      mode: 'markers',
      marker: {
        size: y,
        color: x.map(value=>value), 
      }
  }];

  var layout = {
      xaxis: {
          title: {text: 'OTU ID'}
      }
  };
  Plotly.newPlot('bubble', data, layout);
}

//Creating the Gauge
function CreateGauge(num) {
  
  var data = [
  {
      domain: { x: [0, 1], y: [0, 1] },
      value: num,
      title: {'text':"<b>Belly Button Washing Freguency</b><br><span style='color: gray; font-size:0.8em'>Scrubs per Week<br></span>", 'font': {"size": 14}},      
      type: "indicator",
      mode: "gauge+number",
      gauge: {
          axis: { range: [0, 9]},
          steps: [
            { range: [0, 1], color: "#F6F2EC" },
            { range: [1, 2], color: "#F3F0E5" },
            { range: [2, 3], color: "#E8E6CB" },
            { range: [3, 4], color: "#E5E8B5" },
            { range: [4, 5], color: "#D7E39D" },
            { range: [5, 6], color: "#BACB91" },
            { range: [6, 7], color: "#92BE85" },
            { range: [7, 8], color: "#90BA8E" },
            { range: [8, 9], color: "#8AB389" },
          ],
      }
  }];
  Plotly.newPlot('gauge', data);
}

// Creating the metadata.
function CreateMeta(data) {
  var div = d3.select("#sample-metadata");
  div.html("")
  var list = div.append("ul");
  Object.entries(data).forEach(([key, value]) => {
      list.append("li").text(key + ": " + value);
   });
}

// This 'master function' loads in the json data and executes each function so all charts are populated.
function optionChanged(value) {
  d3.json("samples.json").then(function(incomingData) {
      var metadata = incomingData.metadata.filter(data => data.id ==value);
      console.log(metadata);

      var sample = incomingData.samples.filter(data => data.id ==value);
      console.log(sample);

      CreateHorizontalBar(sample[0].sample_values.slice(0,10).reverse(),sample[0].otu_ids.slice(0,10).reverse().map(a=>"OTU "+ a),sample[0].otu_labels.slice(0,10).reverse());
      CreateBubbleChart(sample[0].otu_ids,sample[0].sample_values,sample[0].otu_labels);
      CreateMeta(metadata[0]);
      CreateGauge(metadata[0].wfreq);
  });


}