/**
 * This program calculates the Huffman code for a set of symbos and
 * their weights.
 */

// Change these to see how a Huffman code is built
// The example data comes from the wikipedia http://en.wikipedia.org/wiki/Huffman_coding#Samples
var alphabet = ["a", "b", "c", "d", "e"];
var weights = [0.10, 0.15, 0.30, 0.16, 0.29];

// GUI constants
var TEXT_PADDING = 5;
var LINE_HEIGHT = textAscent() + TEXT_PADDING * 2;
var BORDER = [10, 10, 10, 10]; // top, right, bottom, left
var PADDING = [8, 5, 8, 5]; // top, right, bottom, left
var CORNER_RADII = 10;
var FG_COLOR = color(15, 15, 15);
var BG_COLOR = color(189, 189, 189);

/** Draw text centered in x,y
 * @param {String} string text to render
 * @param {Number} x horizontal pos
 * @param {Number} y vertical pos
 */
var centerText = function(string, x, y) {
    text(string,
            x - textWidth(string) / 2,
            y + (LINE_HEIGHT - TEXT_PADDING * 2) / 2);
};

/**
 * Represents a node as described in
 * http://en.wikipedia.org/wiki/Huffman_coding#Compression
 * 
 * @Param s (String) node's textual representation
 * @Param w (Number) node's weight
 */
var Node = function(s, w) {
    this.symbol = s;
    this.weight = w;
    this.parent = null;
    this.children = [];
    this.code = ''; // Will be calculated
    this.toString = function() {
        return this.symbol + "/" + this.weight.toPrecision(2) + "/" + this.code;
    };
};

var Menu = function() {
    this.height = 0; // To draw the GUI rectangle. Will be recalculated
    this.lines = []; // Lines to be render inside the rectangle
    this.nodes = []; // Data
};

/**
 * Recalculates lines to render (based upon the list of nodes), and the height
 * of the bounding rectangle.
 */
Menu.prototype.recalculate = function() {
    this.lines[0] = "Alphabet: {";
    for (var i = 0; i < this.nodes.length; i++) {
        this.lines[0] += this.nodes[i].symbol;
        if (i === this.nodes.length - 1) {
            break;
        }
        this.lines[0] += ", ";
    }
    this.lines[0] += "}";

    var sum = 0;
    this.lines[1] = "Weights: {";
    for (i = 0; i < this.nodes.length; i++) {
        sum += this.nodes[i].weight;
        this.lines[1] += this.nodes[i].weight.toPrecision(2);
        if (i === this.nodes.length - 1) {
            break;
        }
        this.lines[1] += ", ";
    }
    this.lines[1] += "}; SUM = " + sum;

    this.lines[2] = "Codes: {";
    for (i = 0; i < this.nodes.length; i++) {
        this.lines[2] += this.nodes[i].code;
        if (i === this.nodes.length - 1) {
            break;
        }
        this.lines[2] += ", ";
    }
    this.lines[2] += "}";

    this.height = (this.lines.length + 1) * LINE_HEIGHT +
            BORDER[0] + BORDER[2];
};

/**
 * Renders the info
 */
Menu.prototype.draw = function() {
    this.recalculate();
    stroke(FG_COLOR);
    fill(BG_COLOR);
    rect(0, 0, width - 1, this.height, CORNER_RADII);

    for (var i = 0,
            x = 0 + BORDER[3],
            y = BORDER[0] + LINE_HEIGHT;
            i < this.lines.length; i++) {
        fill(FG_COLOR);
        text(this.lines[i], x, y);
        y += LINE_HEIGHT;
    }
};

/**
 * Add data to the GUI
 * @param {Node} n
 */
Menu.prototype.push = function(n) {
    this.nodes.push(n);
};

/**
 * This class implements a Huffman's code construction algorithm
 */
var Huffman = function() {
    this.priorityQueue = [];
    
    /**
     * For debugging purposes
     * @returns {String} output format:
     *  <tt>priorityQueue: [symbol/weight/code]</tt>
     */
    this.priorityQueue.toString = function() {
        var result = "priorityQueue: [";
        for (var i = 0; i < this.length; i++) {
            result += this[i];
            if (i === this.length - 1) {
                return result += "]";
            }
            result += ", ";
        }
    };
};

/*
 * Add a new symbol
 * @param {Node} node
 */
Huffman.prototype.push = function(node) {
    this.priorityQueue.push(node);
};

/**
 * Sorts the array, so the nodes of highest priority are on the top
 * (ready to pop)
 */
Huffman.prototype.sortLeafsNodes = function() {
    this.priorityQueue.sort(compareNodesDescending);
};

/*
 * Collapse the highest priority nodes into one
 * @pre priorityQueue should be sorted (lowest probability nodes at the end)
 * @pre priorityQueue has at least two nodes
 */
Huffman.prototype.popTwiceAndPush = function() {
    // nodeA is more probable than nodeB
    nodeB = this.priorityQueue.pop();
    nodeA = this.priorityQueue.pop();
    console.log("poping the two nodes with lowest probability {"
            + nodeA + "} and {" + nodeB + "}");
    parent = new Node(nodeA.symbol + nodeB.symbol, nodeA.weight + nodeB.weight);
    nodeA.parent = parent;
    nodeB.parent = parent;
    parent.children = [nodeA, nodeB];

    this.priorityQueue.push(parent);
    console.log("pushed new node {" + parent + "}");
};

/**
 * Calculates the binary tree of nodes (see
 *  http://en.wikipedia.org/wiki/Huffman_coding#Compression)
 */
Huffman.prototype.calculateTree = function() {
    console.log("------");
    console.log("Step 0");
    console.log("Original queue: " + this.priorityQueue);
    
    var step = 1;
    this.sortLeafsNodes();
    
    while (this.priorityQueue.length > 1) {
        console.log("------");
        console.log("Step " + step);
        console.log("Queue at the beginning of step " + step + ": " + this.priorityQueue);
        this.popTwiceAndPush();
        this.sortLeafsNodes();
        console.log("Queue at the end of step " + step + ": " + this.priorityQueue);
        step++;
    }
};

/**
 * Walks the root node up to the leafs and assing the leafs a huffman code
 * @pre the priorityQueue contains only one node: the root of the tree built
 *      in calculate
 */
Huffman.prototype.calculateCodes = function() {
    console.log("-------------");
    console.log("Decoding root");
    var decodingQueue = [this.priorityQueue[0]];
    while(decodingQueue.length > 0) {
        var parent = decodingQueue.pop();
        console.log("Poping " + parent);
        if (parent.children.length === 0) { // leaf node
            console.log("Removing leaf node: " + parent);
        } else {
            var mostFrequent = parent.children[0];
            var leastFrequent = parent.children[1];
            console.log("Most frequent symbol: " + mostFrequent);
            console.log("Least frequent symbol: " + leastFrequent);
            mostFrequent.code = parent.code + '1';
            leastFrequent.code = parent.code + '0';
            decodingQueue.push(leastFrequent, mostFrequent);
        }
    }
};

/**
 * @param {Node} nodeA
 * @param {Node} nodeB
 * @returns {Number} a number lower than 0 if the symbol of nodeA has higher
 *      probability than the symbol of nodeB; 0 if both symbols have the same
 *      probability; a number greater than 0 otherwise
 */
var compareNodesDescending = function(nodeA, nodeB) {
    return nodeB.weight - nodeA.weight;
};

var menu = new Menu();
var huffman = new Huffman();

/**
 * The setup function. Renamed for compatibility with Khan Academy's Computer
 * Science code editor.
 */
var init = function() {
    for (var i = 0; i < alphabet.length; i++) {
        var node = new Node(alphabet[i], weights[i]);
        menu.push(node);
        huffman.push(node);
    }
    huffman.calculateTree();
    huffman.calculateCodes();
};

init();

draw = function() {
    background(BG_COLOR);
    menu.draw();
};
