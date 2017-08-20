// Variables
var ids = [0]; // Store stroke Ids
var main = document.getElementById('main');

// Invoked by the "Create" button being pressed
function refresh(){
    var base = parseInt(document.getElementsByName("base")[0].value);
    var armWidth = parseInt(document.getElementsByName("armWidth")[0].value);
    var vertexExtrusion = parseInt(document.getElementsByName("vertexExtrusion")[0].value);
    var vertexDiameter = parseInt(document.getElementsByName("vertexDiameter")[0].value);
    var sideRadius = parseInt(document.getElementsByName("sideRadius")[0].value);
    triangle(base, armWidth, vertexExtrusion, vertexDiameter, sideRadius);
}

// Draws a triangle
function triangle(base, armWidth, vertexExtrusion, vertexDiameter, sideRadius){
    // Common variables
    var degree = Math.PI / 3;
    extrusionx = Math.sin(degree) * vertexExtrusion;
    extrusiony = Math.cos(degree) * vertexExtrusion;
    var arcBase = base - 2 * (vertexDiameter + extrusionx);
    // Center the image
    var startx = (window.innerWidth / 2) - (document.getElementById('1').getBoundingClientRect().width / 2);
    console.log(document.getElementById('1').getBoundingClientRect().width);
    var starty = (vertexExtrusion + extrusiony + vertexDiameter + (Math.sin(degree) * arcBase) + 100);
    var deltax, deltay;
    var d = "";
    clearView();
    
    // Bottom-left vertex
    deltax = Math.cos(degree) * (2 * armWidth);
    deltay = Math.sin(degree) * (2 * armWidth);
    d += "M " + startx + " " + starty + " " + " a " + vertexDiameter + " " + vertexDiameter + " 0 0 0 " + deltax + " " + deltay;
    
    // Bottom-left extrusion
    deltax = extrusionx;
    deltay = -extrusiony;
    d += " l " + deltax + " " + deltay;
    
    // Bottom side-radius
    d += " a " + sideRadius + " " + sideRadius + " 0 0 1 " + arcBase  + " 0";
    
    // Bottom-right extrusion
    deltax = extrusionx;
    deltay = extrusiony;
    d += " l " + deltax + " " + deltay;
    
    // Bottom-right vertex
    deltax = Math.cos(degree) * (2 * armWidth);
    deltay = -Math.sin(degree) * (2 * armWidth);
    d += " a " + vertexDiameter + " " + vertexDiameter + " 0 0 0 " + deltax + " " + deltay;
    
    // Right-lower extrusion
    deltax = -extrusionx;
    deltay = -extrusiony;
    d += " l " + deltax + " " + deltay;
    
    // Right side-radius
    deltax = -Math.cos(degree) * arcBase;
    deltay = -Math.sin(degree) * arcBase;
    d += " a " + sideRadius + " " + sideRadius + " 0 0 1 " + deltax  + " " + deltay;
    
    // Right-upper extrusion
    d += " l " + 0 + " " + -vertexExtrusion;
    
    // Top vertex
    d += " a " + vertexDiameter + " " + vertexDiameter + " 0 0 0 " + (2 * -armWidth) + " 0";
    
    // Left-upper extrusion
    d += " l " + 0 + " " + vertexExtrusion;
    
    // Left side-radius
    deltax = -Math.cos(degree) * arcBase;
    deltay = Math.sin(degree) * arcBase;
    d += " a " + sideRadius + " " + sideRadius + " 0 0 1 " + deltax  + " " + deltay;
    
    //Left-lower extrusion
    deltax = -extrusionx;
    deltay = extrusiony;
    d += " l " + deltax + " " + deltay;
    
    createElement(d, 1);
}

// Saves the contents on "main" as an SVG file
function saveSVG(){
    svg = "<svg>\n\t" + main.innerHTML + "\n</svg>";
    var link = document.createElement('a');
    mimeType = 'image/svg+xml' || 'text/plain';
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate() + '_' + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
	var base = document.getElementsByName('base')[0].value;
	var armWidth = document.getElementsByName('armWidth')[0].value;
	var vertexExtrusion = document.getElementsByName('vertexExtrusion')[0].value;
	var vertexDiameter = document.getElementsByName('vertexDiameter')[0].value;
	var sideRadius = document.getElementsByName('sideRadius')[0].value;
    var filename = 'Triangle_' + date + '_Base' + base + '_ArmWidth' + armWidth + 
		'_VertexExtrusion' + vertexExtrusion + '_VertexDiameter' + vertexDiameter +
		'_SideRadius' + sideRadius + '.svg';
    link.setAttribute('download', filename);
    link.setAttribute('href', 'data:image/svg+xml; charset=utf-8,' + encodeURIComponent(svg));
    document.body.append(link);
    link.click();
    document.body.removeChild(link);
    console.log(link);
}

// Creates any path element
function createElement(d, id){
    if (!ids.includes(id)){
        ids.push(id);
    }
    var fill = "#000000";
    var stroke = "#000000";
    var strokeWidth = "1";
    var path = document.createElement('path');
    path.setAttribute("id", id);
    path.setAttribute("fill", fill);
    path.setAttribute("stroke", stroke);
    path.setAttribute("stroke-width", strokeWidth);
    path.setAttribute("d", d);
    
    main.appendChild(path);
    updateView();
}

// Updates the current view
function updateView(){
    mainContents = clearView();
    document.getElementById('main').innerHTML = mainContents;
}

function clearView(){
    mainContents = document.getElementById('main').innerHTML;
    document.getElementById('main').innerHTML = "";
    return mainContents;
}

// Converts polar coordinates to cartesian coordinates
function polarToCartesian(centerX, centerY, diameter, angleInDegrees) {
  var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;

  return {
    x: centerX + (diameter * Math.cos(angleInRadians)),
    y: centerY + (diameter * Math.sin(angleInRadians))
  };
}

// Defines a circular arc formatted for an svg path's "d" attribute
function describeArc(x, y, diameter, startAngle, endAngle){

    var start = polarToCartesian(x, y, diameter, endAngle);
    var end = polarToCartesian(x, y, diameter, startAngle);

    var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    var d = [
        "M", start.x, start.y, 
        "A", diameter, diameter, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");

    return d;
}
