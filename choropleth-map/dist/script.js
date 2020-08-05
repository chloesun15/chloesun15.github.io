var width = 950;
var height = 600;

d3.select("#title").append("h1").text("United States Educational Attainment");

d3.select("#description").text("Percentage of adults age 25 and older with a bachelor's degree or higher (2010-2014)");
var svg = d3.select("#svg-container").append("svg").attr("width", width).attr("height", height);

var path = d3.geoPath();

const EDUCATION_FILE = 'https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json';
const COUNTY_FILE = 'https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json';

var files = [COUNTY_FILE, EDUCATION_FILE];

Promise.all(files.map(url => d3.json(url))).then(function (values) {


  var tooltip = d3.select("#chart").
  append("div").
  attr("id", "tooltip").
  style("position", "absolute").
  attr("data-year", "").
  style("z-index", "10").
  style("visibility", "hidden").
  html("placeholder");

  var edDomain = d3.extent(values[1].map(d => d.bachelorsOrHigher));

  var color = d3.scaleSequential(d3.interpolateBlues).domain(edDomain);

  var g = svg.append("g");

  var counties = g.selectAll("path").
  data(topojson.feature(values[0], values[0].objects.counties).features).
  enter().
  append("path").
  attr("class", "county").
  attr("fill", function (d, i) {
    var percentage = values[1].filter(obj => obj.fips == d.id);
    return percentage[0] ? color(percentage[0].bachelorsOrHigher) : color(0);
  }).
  attr("data-fips", (d, i) => d.id).
  attr("data-education", function (d) {
    var percentage = values[1].filter(obj => obj.fips == d.id);
    return percentage[0] ? percentage[0].bachelorsOrHigher : 0;
  }).
  attr("county-name", function (d) {
    var percentage = values[1].filter(obj => obj.fips == d.id);
    return percentage[0] ? percentage[0].area_name : "N/A";
  }).
  attr("state-name", function (d) {
    var percentage = values[1].filter(obj => obj.fips == d.id);
    return percentage[0] ? percentage[0].state : "N/A";
  }).
  attr("d", path);


  counties.on("mouseover", function () {
    var education = d3.select(this).attr("data-education");
    var name = d3.select(this).attr("county-name");
    var state = d3.select(this).attr("state-name");
    return tooltip.style("visibility", "visible").
    style("opacity", .9).
    attr("data-education", education).
    style("top",
    d3.mouse(this)[1] + 70 + "px").
    style("left", d3.mouse(this)[0] + 50 + "px").
    html(`<h3>${name}, ${state}: ${education}%</h3>`);}).
  on("mouseout", function () {
    d3.select(this).attr("r", 5);
    return tooltip.style("visibility", "hidden").style("opacity", 0);});


  svg.append("path").
  datum(topojson.mesh(values[0], values[0].objects.states)).
  attr("d", path).
  attr("fill", "none").
  attr("stroke", "white").
  attr("stroke-width", 1);

  var legendVal = [2, 12, 22, 32, 42, 52, 72];
  var legendX = width - width / 2.6;

  var legend = svg.append("g").
  attr("id", "legend");

  legend.selectAll("rect").
  data(legendVal).
  enter().
  append("rect").
  attr("width", 40).
  attr("height", 10).
  attr("x", (d, i) => legendX + i * 40).
  attr("y", 30).
  attr("fill", d => color(d));


  legend.selectAll("text").
  data(legendVal).
  enter().
  append("text").
  text((d, i) => i != legendVal.length - 1 ? d + "%" : ">" + d + "%").
  attr("y", 60).
  attr("x", (d, i) => legendX + i * 40).
  attr("text-anchor", "middle");

  for (var i = 0; i < legendVal.length; i++) {
    var x = legendX + i * 40;
    legend.append("rect").
    attr("width", 1).
    attr("height", 15).
    attr("x", x).
    attr("y", 30);
  }


});