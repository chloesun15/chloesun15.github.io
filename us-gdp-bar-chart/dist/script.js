d3.select("#title").
append("h1").
attr("id", "title").
text("US GDP (1947 - 2015)");
const w = 900;
const h = 600;
const padding = 80;
const barWidth = 4;

const svg = d3.select("#svgcontainer").
append("svg").
attr("width", w).
attr("height", h);

d3.json("https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json").
then(function (json) {
  var data = json.data;
  var years = data.map(d => new Date(d[0]));


  var domain = d3.extent(years);

  var xScale = d3.scaleTime().
  domain(domain).
  range([padding, w - padding]);

  var yScale = d3.scaleLinear().
  domain([0, d3.max(data, d => d[1])]).
  range([h - padding, padding]);


  var tooltip = d3.select("#svgcontainer").
  append("div").
  attr("id", "tooltip").
  attr("data-date", 0).
  style("visibility", "hidden").
  style("opacity", 0).
  style("position", "absolute").
  html("placeholder");

  var bars = svg.selectAll("rect").
  data(data).
  enter().
  append("rect").
  attr("class", "bar").
  attr("data-gdp", (d, i) => d[1]).
  attr("data-date", d => d[0]).
  attr("x", (d, i) => xScale(years[i])).
  attr("y", (d, i) => yScale(d[1])).
  attr("width", barWidth).
  attr("height", (d, i) => h - padding - yScale(d[1]));


  bars.on("mouseover", function () {
    var thisDate = d3.select(this).attr("data-date");
    var thisGDP = d3.select(this).attr("data-gdp");
    var arr = thisDate.split("-");
    var q = "";
    switch (arr[1]) {
      case "01":
        q = "Q1";
        break;
      case "04":
        q = "Q2";
        break;
      case "07":
        q = "Q3";
        break;
      case "10":
        q = "Q4";}


    var text = `<h2>${arr[0]} ${q}</h2> </br>
<p>$${parseFloat(thisGDP).toLocaleString()} Billion</p>`;
    return tooltip.style("visibility", "visible").
    style("opacity", .9).
    attr("data-date", thisDate).
    html(text);}).
  on("mousemove", function () {
    return tooltip.style("top", d3.mouse(this)[1] - 20 + "px").
    style("left", d3.mouse(this)[0] + 20 + "px");}).
  on("mouseout", function () {
    return tooltip.style("visibility", "hidden").
    style("opacity", 0);});

  var xAxis = d3.axisBottom(xScale);

  var yAxis = d3.axisLeft(yScale);

  svg.append("g").
  attr("id", "x-axis").
  attr("transform", "translate(0, " + (h - padding) + ")").
  call(xAxis);


  svg.append("g").
  attr("id", "y-axis").
  attr("transform", "translate(" + padding + ",0)").
  call(yAxis);

  svg.append("text").
  attr("id", "gdp-label").
  attr("transform", "rotate(-90)").
  attr("y", padding / 3).
  attr("x", 0 - h / 2).
  style("text-anchor", "middle").
  text("Gross Domestic Product").
  style("font-size", 25);
});