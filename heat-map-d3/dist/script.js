var w = 1000;
var h = 500;
var padding = 60;

var color1 = "#4667C3";
var color2 = "#6B72C1";
var color3 = "#907DBF";
var color4 = "#B589BE";
var color5 = "#DA94BC";
var color6 = "#FF9FBA";
var myColors = [color1, color2, color3, color4, color5, color6];

d3.select("#title").
append("h1").
text("Monthly Global Land-Surface Temperature");

d3.select("#description").
append("p").
text("1753 - 2015: base temperature 8.66 °C");

const svg = d3.select("#svg-container").
append("svg").
attr("width", w).
attr("height", h);

var xScale = d3.scaleBand().
range([padding, w - padding / 2]);

var yScale = d3.scaleBand().
range([0, h - padding]).
padding(0).
round([0, 0]);

var xAxis = d3.axisBottom(xScale);

var yAxis = d3.axisLeft(yScale).
tickFormat(function (month) {
  var date = new Date(2000, month, 1);
  return d3.timeFormat("%B")(date);
});

var legendWidth = 520;
var legendHeight = 80;
var legendPadding = 30;
var legendBarWidth = (legendWidth - legendPadding * 2) / myColors.length;

var legend = d3.select("#chart").
append("div").
attr("id", "legend");

var labelContainer = legend.append("div").
attr("id", "label-container");

var legendArr = ["< -2.5", "-2.5", "-1.25", "0", "1.25", "2.5", "> 2.5"];


var legendSvg = legend.append("svg").
attr("width", legendWidth).
attr("height", legendHeight);


for (let i = 0; i < myColors.length; i++) {
  legendSvg.append("rect").
  attr("width", legendBarWidth).
  attr("height", legendHeight - legendPadding).
  attr("fill", myColors[i]).
  attr("x", legendPadding + i * legendBarWidth).
  attr("y", legendPadding);
}

for (let i = 0; i < legendArr.length; i++) {
  legendSvg.append("text").
  text(legendArr[i]).
  attr("x", padding / 2 + i * legendBarWidth).
  attr("y", legendPadding - 7).
  attr("text-anchor", "middle");
}


d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json").
then(function (json) {
  var base = json.baseTemperature;
  var monthlyData = json.monthlyVariance;

  var xDomain = monthlyData.map(m => m.year);
  xScale.domain(xDomain);

  var yDomain = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  yScale.domain(yDomain);

  xAxis.tickValues(xScale.domain().filter(function (d, i) {return !(i % 15);}));

  svg.append("g").
  attr("transform", "translate(0," + (h - padding - 4) + ")").
  attr("id", "x-axis").
  call(xAxis);

  svg.append("g").
  attr("transform", "translate(" + padding + ", 0)").
  attr("id", "y-axis").
  call(yAxis).
  selectAll("text").
  attr("transform", "rotate(-40)").
  attr("text-anchor", "end").
  attr("dx", -1).
  attr("dy", -4);



  var tooltip = d3.select("#svg-container").
  append("div").
  attr("id", "tooltip").
  style("position", "absolute").
  attr("data-year", "").
  style("z-index", "1").
  style("visibility", "hidden").
  html("placeholder");

  var rects = svg.selectAll("rect").
  data(monthlyData).
  enter().
  append("rect").
  attr("class", "cell").
  attr("width", xScale.bandwidth()).
  attr("height", d => yScale.bandwidth()).
  attr("fill", (d) =>
  d.variance <= -2.5 ?
  color1 :
  d.variance <= -1.25 ?
  color2 :
  d.variance <= 0 ?
  color3 :
  d.variance <= 1.25 ?
  color4 :
  d.variance <= 2.50 ?
  color5 :
  color6).
  attr("data-month", d => d.month - 1).
  attr("data-year", d => d.year).
  attr("data-temp", d => ((d.variance * 100 + base * 100) / 100).toFixed(2)).
  attr("data-variance", d => d.variance).
  attr("x", d => xScale(d.year)).
  attr("y", d => yScale(d.month - 1));

  var myMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  rects.on("mouseover", function () {
    var month = d3.select(this).attr("data-month");
    var year = d3.select(this).attr("data-year");
    var temp = d3.select(this).attr("data-temp");
    var variance = d3.select(this).attr("data-variance");
    return tooltip.style("visibility", "visible").
    style("opacity", .9).
    attr("data-year", year).
    html(`<h3>${myMonths[month]} ${year}</h3><p>Temp: ${temp} °C </p><p> Variance: ${variance} °C </p>`);}).
  on("mousemove", function () {
    return tooltip.style("top",
    d3.mouse(this)[1] + 60 + "px").style("left", d3.mouse(this)[0] + 80 + "px");}).
  on("mouseout", function () {
    d3.select(this).attr("r", 5);
    return tooltip.style("visibility", "hidden").style("opacity", 0);});
});