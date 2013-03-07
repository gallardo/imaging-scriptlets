width=400;
height=400;

var LINE_HEIGHT = textAscent() + 8;
var BORDER = [10, 10, 10, 10]; // top, right, bottom, left
var CORNER_RADII = 10;
var FG_COLOR = color(15, 15, 15);
var BG_COLOR = color(189, 189, 189);
var BALL_FG_COLOR = color(125, 135, 153);
var BALL_BG_COLOR = color(153, 153, 153);

var Ball = function(symbol) {
    this.symbol = symbol;
    var RADIUS = 291;
};

Ball.prototype.draw = function() {
    stroke(BALL_FG_COLOR);
    fill(BALL_BG_COLOR);
    ellipse(this.x, this.y, RADIUS, RADIUS);
};

var Menu = function(x, y) {
    this.x = x;
    this.y = y;
    this.lines = ["Alphabet:", "Weights:", "Debug:"];
    this.height = (this.lines.length + 1) * LINE_HEIGHT +
            BORDER[0] + BORDER[2];
    this.width = width - 1;
    this.symbols = [];
};

Menu.prototype.draw = function() {
    stroke(FG_COLOR);
    fill(BG_COLOR);
    rect(this.x, this.y, this.width, this.height, CORNER_RADII);
    for (var i = 0, x = this.x + BORDER[3],
            y = BORDER[0] + LINE_HEIGHT;
            i < this.lines.length; i++) {
        fill(FG_COLOR);
        text(this.lines[i], x, y);
        y += LINE_HEIGHT;
    }
};

Menu.prototype.addSymbol = function(s) {
    this.symbols.push(s);
};

var balls = [new Ball()];
var menu = new Menu(0, 0, 3);

var setup = function() {
    balls[0].x = 100;
    balls[0].y = 100;
};

setup();

var draw = function() {
    background(BG_COLOR);
    menu.draw();
    for (var i = 0; i < balls.length; i++) {
        balls[i].draw();
    }
}
