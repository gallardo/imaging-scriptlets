/**
 * This program calculates the Huffman code for a set of symbos and
 * their weights.
 */

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
};

/**
 *  @class This class implements a Huffman's code construction algorithm. Add
 * nodes to this class using @link push(String, Number), @link calculate() the
 * codes and get the result with @link getNodes(). The nodes are instrumented
 * with the corresponding code.
 */
Huffman = function() {
    this.priorityQueue = [];

    /** Original alphabet */
    this.nodes = [];

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

    /*
     * Add a new symbol
     * @param {String} symbol
     * @param {Number} weight
     */
    this.push = function(symbol, weight) {
        var node = new Node(symbol, weight);
        this.priorityQueue.push(node);
        this.nodes.push(node);
    };

    /**
     * Sorts the array, so the nodes of highest priority are on the top
     * (ready to pop)
     */
    this.sortLeafsNodes = function() {
        this.priorityQueue.sort(Node.compareNodesDescending);
    };

    /*
     * Collapse the highest priority nodes into one
     * @pre priorityQueue should be sorted (lowest probability nodes at the end)
     * @pre priorityQueue has at least two nodes
     */
    this.popTwiceAndPush = function() {
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
    this.calculateTree = function() {
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
     *      in calculate. @link calculateTree should have been called first
     */
    this.calculateCodes = function() {
        console.log("-------------");
        console.log("Decoding root");
        var decodingQueue = [this.priorityQueue[0]];
        while (decodingQueue.length > 0) {
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

    this.calculate = function() {
        this.calculateTree();
        this.calculateCodes();
    };
};