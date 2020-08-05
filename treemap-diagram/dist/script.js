var w = 800;
var h = 500;
var marginRight = 100;

var svg = d3.select("#svg-container").
append("svg").
attr("width", w).
attr("height", h);

var tooltip = d3.select("#svg-container").
append("div").
attr("id", "tooltip").
style("position", "absolute").
style("z-index", 1).
style("opacity", 0).
style("visibility", "hidden").
html("placeholder");

var urlObject = {
  kickstarter: {
    url: "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json",
    title: "Kickstarter Pledges",
    description: "Top 100 Most Pledged Kickstarter Campaigns by Category" },

  movies: {
    url: "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json",
    title: "Movie Sales",
    description: "Top 100 Highest Domestic Grossing Movies by Genre" },

  videogames:
  { url: "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json",
    title: "Video Games Sales",
    description: "Top 100 Best Selling Video Games by Platform" } };



buttons = d3.select("#toggle").
selectAll("button").
data(Object.keys(urlObject)).
enter().
append("button").
text(d => d.charAt(0).toUpperCase() + d.slice(1) + " Treemap");

buttons.on("click", function (d) {
  d3.select(this).attr("");
  loadChart(urlObject[d].url, d);
  svg.selectAll("*").remove();
});

var link = urlObject.movies.url;

function loadChart(link, dataName = "movies") {

  console.log(urlObject[dataName].title);
  d3.select("#title").
  text(function () {
    return urlObject[dataName].title;});

  d3.select("#description").
  text(function () {
    return urlObject[dataName].description;});

  d3.json(link).
  then(function (data) {

    var root = d3.hierarchy(data).sum(function (d) {return d.value;});

    var treemap = d3.treemap().
    size([w - marginRight, h])(
    root);


    var categories = data.children.map(category => category.name);

    var colScale = d3.scaleOrdinal(d3.schemePastel1.concat(d3.schemePastel2)).domain(categories);

    var tiles = svg.selectAll("rect").
    data(root.leaves()).
    enter().
    append("rect").
    attr("class", "tile").
    attr('x', d => d.x0).
    attr('y', d => d.y0).
    attr('width', d => d.x1 - d.x0).
    attr('height', d => d.y1 - d.y0).
    style("fill", d => colScale(d.data.category)).
    attr("data-name", d => d.data.name).
    attr("data-category", d => d.data.category).
    attr("data-value", d => d.value);

    tiles.on("mouseover", function () {
      var name = d3.select(this).attr("data-name");
      var category = d3.select(this).attr("data-category");
      var value = d3.select(this).attr("data-value");
      var desc = dataName == "videogames" ? parseFloat(value).toLocaleString() + "M copies sold" : "$" + parseFloat(value).toLocaleString();

      return tooltip.style("visibility", "visible").
      style("opacity", .9).
      attr("data-value", value).
      html(`<p>${name}</p><p>Category: ${category}</p><hr><h3>${desc}</h3>`);

    }).on("mousemove", function () {
      return tooltip.style("top", d3.event.pageY + "px").
      style("left", d3.event.pageX + 10 + "px");
    }).on("mouseout", function () {
      return tooltip.style("visibility", "hidden").
      style("opacity", 0);
    });

    var legend = svg.append("g").
    attr("id", "legend");

    var legendS = marginRight / 6;
    var legendX = w - marginRight + 5;
    var legendY = 0;

    legend.selectAll("rect").
    data(categories).
    enter().
    append("rect").
    attr("class", "legend-item").
    attr("width", legendS).
    attr("height", legendS).
    attr("x", legendX).
    attr("y", (d, i) => legendY + i * (legendS + 10)).
    attr("fill", d => colScale(d));

    legend.selectAll("text").
    data(categories).
    enter().
    append("text").
    attr("x", legendX + legendS * 1.3).
    attr("y", (d, i) => legendY + i * (legendS + 10) + legendS / 1.5).
    text(d => d).
    style("font-size", legendS / 1.75);
  });
}

loadChart(link);