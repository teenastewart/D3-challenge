//Create the SVG settings
var svgWidth = 1000;
var svgHeight = 1000;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group for the chart and shift by the established margins
var chartGroup = svg.append("g")
  .classed("chart", true)
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

//Read CSV with D3 and 
d3.csv("./assets/data/data.csv").then(function(stateData) {
    //Check the data
    console.log(stateData);
    //Convert to integer from string
    stateData.forEach(function(data) {
        data.income = +data.income;
        data.smokes = +data.smokes;
      });

    // Define Scales
    let extent = d3.extent(stateData);
    var xScale = d3.scaleLinear()
    .domain([d3.min(stateData, d => d.income)-5000, d3.max(stateData, d => d.income)])
    .range([0, width]);

    var yScale = d3.scaleLinear()
    .domain([d3.min(stateData, d => d.smokes)-2, d3.max(stateData, d => d.smokes)+2])
    .range([height, 0]);

    // Define X axis
    var bottomAxis = d3.axisBottom(xScale);


    // Define Y axis
    var leftAxis = d3.axisLeft(yScale);

    //Append axes to chart
    chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

    chartGroup.append("g")
    .call(leftAxis);


    // Add circles from data
    chartGroup.selectAll("circle")
    .data(stateData)
    .enter()
    .append("circle")
    .classed("stateCircle", true)
    .attr("cx", d => xScale(d.income))
    .attr("cy", d => yScale(d.smokes))
    .attr("r", "15")

    
    //Create label group
    var labelGroup = svg.append("g")
        .classed("stateText", true)
    //Add the label text
    labelGroup.selectAll("text")
        .data(stateData)
        .enter()
        .append("text")
        .classed("stateText", true)
        .text((d) => (d.abbr))
        .attr("x", d => xScale(d.income)+100)
        .attr("y", d => yScale(d.smokes)+25); 
   
   
  
    // Create axis labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Percentage of population that Smokes");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("Median Household Income");
  }).catch(function(error) {
    console.log(error);
});