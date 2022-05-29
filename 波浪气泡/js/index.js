
// old code ahead...

Math.TWO_PI = Math.PI * 2;

var canvas,
context,
settings = {},
bubbles = [],
points = [],
turbs = [],
turbsIndex,
turbulence;

settings.turbulence = 125;

// ========================================================================================
// Bubble
// ----------------------------------------------------------------------------------------

function Bubble(options) {
    this.init(options);
}

Bubble.prototype = {

    init: function init(options) {

        if (!options) options = {};

        this.radius = Math.random() * 7;
        this.x = options.x || Math.random() * canvas.width;
        this.y = options.y || canvas.height + this.radius;
        this.vx = Math.random() * 0.03;
        this.vy = 1 + Math.random() * 4;
        this.sway = 0.25 + Math.random() * 0.25; // 0.25-0.5
        this.angle = Math.random() * Math.TWO_PI;
        this.opacity = 0.05 + Math.random() * 0.2;

        return this;
    },

    update: function update() {
        this.x += Math.cos(this.angle) * this.sway;
        this.y -= this.vy;
        this.angle += this.vx;
        if (this.y <= canvas.center.y) this.init();
        return this;
    },

    draw: function draw() {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.TWO_PI, false);
        context.fillStyle = 'rgba(255,255,255,' + this.opacity + ')';
        context.fill();
        return this;
    },

    render: function render() {
        this.update();
        this.draw();
        return this;
    } };


// ========================================================================================
// Vertex
// ----------------------------------------------------------------------------------------

function Vertex(options) {
    this.x = options.x;
    this.y = options.y;
    this.vy = 0;
    this.target = 0;
    this.friction = 0.035;
    this.deceleration = 0.95;
}

Vertex.prototype.update = function (turb) {
    this.target = canvas.center.y + turb;
    this.vy *= this.deceleration;
    this.vy += this.target - this.y;
    this.y += this.vy * this.friction;
};

// ----------------------------------------------------------------------------------------

function loop() {

    context.clearRect(0, 0, canvas.width, canvas.height);

    var i,d,length,dist = 15;

    for (i = 0, length = bubbles.length; i < length; i++) {
        bubbles[i].render();
    }

    // decrease turbulance and set to zero
    // if too small so it doesn't run continuously
    // update current turbulence value at turbsIndex

    turbulence -= turbulence * 0.85;
    if (Math.abs(turbulence) < 0.1) turbulence = 0;
    turbs[turbsIndex] = turbulence;

    // loop backwards through all points BEFORE turbsIndex
    // get the distance from the turbulance index and
    // if it's greater than the turbulance distance
    // set distance to max ripple distance
    for (i = turbsIndex - 1; i >= 0; i--) {
        d = turbsIndex - i;
        if (d > dist) d = dist;
        turbs[i] -= (turbs[i] - turbs[i + 1]) * (1 - 0.01 * d);
    }

    length = points.length;

    // loop forward through all points AFTER turbsIndex
    // and do the same thing as above
    for (i = turbsIndex; i < length; i++) {
        d = i - turbsIndex;
        if (d > dist) d = dist;
        turbs[i] -= (turbs[i] - turbs[i - 1]) * (1 - 0.01 * d);
    }

    // loop through ALL points and call update()
    // which updates targetY based on turbulence
    for (i = 0; i < length; i++) {
        points[i].update(turbs[i]);
    }

    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(points[0].x, points[0].y);

    for (i = 1; i < length; i++) {
        context.lineTo(points[i].x, points[i].y);
    }

    context.lineTo(canvas.width, 0);
    context.lineTo(0, 0);
    context.fillStyle = '#252424';
    context.fill();

    requestAnimationFrame(loop);
}

function resize() {

    var width = canvas.width = window.innerWidth,
    height = canvas.height = window.innerHeight,
    numPoints = Math.round(width * 0.15),
    point;

    turbulence = settings.turbulence * 5;

    canvas.center.x = width * 0.5;
    canvas.center.y = height * 0.5;
    points = [];

    for (var i = 0; i < numPoints + 1; i++) {

        points.push(new Vertex({
            x: i / numPoints * width,
            y: canvas.center.y }));


        // reset all turblence values
        turbs[i] = 0;
    }
}

function mousemove(event) {

    var mouseX = event.pageX,
    mouseY = event.pageY,
    numPoints;

    if (mouseY < canvas.center.y + 100 && mouseY > canvas.center.y - 100) {

        numPoints = points.length;
        turbulence = settings.turbulence;
        if (event.movementY < 0) turbulence *= -1;

        turbsIndex = 1 + Math.floor(mouseX * numPoints / canvas.width);
        turbs[turbsIndex] = turbulence;
    }
}

function init() {

    canvas = document.createElement('canvas');
    canvas.center = {};
    context = canvas.getContext('2d');

    resize();

    var numBubbles = Math.round(0.125 * canvas.width);
    turbsIndex = Math.round(numBubbles / 2);

    for (var i = 0; i < numBubbles; i++) {

        bubbles.push(new Bubble({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height }));

    }

    document.body.appendChild(canvas);
    document.body.style.cssText = 'margin:0;padding:0;overflow:hidden;background:#eb8a00;background-image:radial-gradient(circle, #ffb900, #da5900);';

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', mousemove);

    requestAnimationFrame(loop);
}

init();