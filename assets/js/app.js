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

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .classed("chart", true)
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

//Read CSV with D3 and convert to integer from string
d3.csv("./assets/data/data.csv").then(function(stateData) {

    console.log(stateData);
  
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


// Define Y 
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
   .append("text")
   .classed("stateText", true)
   .text((d) => (d.abbr))
   .attr("x", d => xScale(d.income))
   .attr("y", d => yScale(d.smokes));
   // Add Text Labels
// var circles = d3.select("g").selectAll(".stateCircle")
//    .data(stateData)

// circles.enter()
//     .append("text")
//     .classed("stateText", true)
//     .text((d) => (d.abbr))
//     .attr("x", d => xScale(d.income)-1)
//     .attr("y", d => yScale(d.smokes)+5);   
   
   
  
//    // Step 6: Initialize tool tip
//     // ==============================
//     var toolTip = d3.tip()
//       .attr("class", "tooltip")
//       .offset([80, -60])
//       .html(function(d) {
//         return (`${stateData.states}<br>Median Income: ${stateData.income}<br>Percentage of smokers: ${stateData.smokes}`);
//       });

//     // Step 7: Create tooltip in the chart
//     // ==============================
//     chartGroup.call(toolTip);

//     // Step 8: Create event listeners to display and hide the tooltip
//     // ==============================
//     circlesGroup.on("click", function(data) {
//       toolTip.show(data, this);
//     })
//       // onmouseout event
//       .on("mouseout", function(data, index) {
//         toolTip.hide(data);
//       });



    // Create axes labels
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