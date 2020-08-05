var w = 700;
var h = 500;
var padding = 60;

d3.select("#title").
append("h1").
text("Doping in Professional Bicycle Racing");

const svg = d3.select("#svg-container").
append("svg").
attr("width", w).
attr("height", h);

var xScale = d3.scaleLinear().
range([padding, w - padding / 2]);

var yScale = d3.scaleTime().
range([h - padding, padding]);

var xAxis = d3.axisBottom(xScale).
tickFormat(d3.format("d"));
var yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));

var legend = d3.select("#svg-container").
append("div").
attr("id", "legend");

legend.append("h3").
attr("id", "legend-title").
text("Legend");

legend.append("div").
attr("id", "legend-info").
append("p").
text("Doping Allegations").
append("p").
text("No Doping Allegations");


var legendSvg = legend.append("svg").
attr("width", 15).
attr("height", 70);

legendSvg.append("circle").
attr("cy", 10).
attr("cx", 7).
attr("r", 5).
style("fill", "rgb(74, 78, 105)");

legendSvg.append("circle").
attr("cy", 60).
attr("cx", 7).
attr("r", 5).
style("fill", "rgb(154, 140, 152)");

d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json").
then(function (json) {

  var data = json.map(function (d) {
    var timeArr = d.Time.split(":");
    var myDate = new Date(2001, 0, 1, 0, timeArr[0], timeArr[1]);
    return [d.Year, myDate, d.Name, d.Doping, d.Time];
  });

  var xDomain = d3.extent(data, d => d[0]);
  xScale.domain(xDomain).nice();

  var yDomain = d3.extent(data, d => d[1]);
  yScale.domain(yDomain).nice();

  svg.append("g").
  attr("transform", "translate(0," + (h - padding) + ")").
  attr("id", "x-axis").
  call(xAxis);


  svg.append("g").
  attr("transform", "translate(" + padding + ", 0)").
  attr("id", "y-axis").
  call(yAxis);

  var tooltip = d3.select("#svg-container").
  append("div").
  attr("id", "tooltip").
  style("position", "absolute").
  attr("data-year", "").
  style("z-index", "10").
  style("visibility", "hidden").
  html("placeholder");

  var dots = svg.selectAll("circle").
  data(data).
  enter().
  append("circle").
  attr("class", "dot").
  attr("data-index", (d, i) => i).
  attr("data-xvalue", d => d[0]).
  attr("data-yvalue", d => d[1]).
  attr("cx", d => xScale(d[0])).
  attr("cy", d => yScale(d[1])).
  attr("r", 5).
  style("fill", d => d[3] !== "" ? "rgb(74, 78, 105)" : "rgb(154, 140, 152)");

  dots.on("mouseover", function () {
    d3.select(this).attr("r", 6);
    var index = d3.select(this).attr("data-index");
    var name = data[index][2];
    var doping = data[index][3];
    var year = d3.select(this).attr("data-xvalue");
    var time = data[index][4];
    return tooltip.style("visibility", "visible").
    style("opacity", .9).
    attr("data-year", year).
    html(`<h3>${name}, ${year}</h3><h4>Time: ${time}</h4><p>${doping}</p>`);}).
  on("mousemove", function () {
    return tooltip.style("top",
    d3.mouse(this)[1] + 20 + "px").style("left", d3.mouse(this)[0] + 90 + "px");}).
  on("mouseout", function () {
    d3.select(this).attr("r", 5);
    return tooltip.style("visibility", "hidden").style("opacity", 0);});

  svg.append("text").
  attr("id", "y-label").
  attr("transform", "rotate(-90)").
  attr("y", padding / 3).
  attr("x", 0 - h / 2).
  style("text-anchor", "middle").
  text("Time (min)");
});