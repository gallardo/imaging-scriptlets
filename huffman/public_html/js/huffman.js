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
function node(s, w) {
    return {
        symbol: s,
        weight: w,
        parent: null,
        children: [],
        code: '', // Will be calculated
        toString: function() {
            return this.symbol + "/" + this.weight.toPrecision(2) + "/" + this.code;
        }
    };
}

/**
 * @param {node} nodeA
 * @param {node} nodeB
 * @returns {Number} a number lower than 0 if the symbol of nodeA has higher
 *      probability than the symbol of nodeB; 0 if both symbols have the same
 *      probability; a number greater than 0 otherwise
 */
function compareNodesDescending(nodeA, nodeB) {
    return nodeB.weight - nodeA.weight;
}

/**
 *  @class This class implements a Huffman's code construction algorithm. Add
 * nodes to this class using @link push(String, Number), @link calculate() the
 * codes and get the result with @link getNodes(). The nodes are instrumented
 * with the corresponding code.
 */
function huffman() {
    var that = {
        priorityQueue: function() {
            var that = [];
            /**
             * For debugging purposes
             * @returns {String} output format:
             *  <tt>priorityQueue: [symbol/weight/code]</tt>
             */
            that.toString = function() {
                var result = "priorityQueue: [";
                for (var i = 0; i < this.length; i++) {
                    result += this[i];
                    if (i === this.length - 1) {
                        return result += "]";
                    }
                    result += ", ";
                }
            };
            return that;
        }(),
        /** Original alphabet */
        nodes: [],
        /*
         * Add a new symbol
         * @param {String} symbol
         * @param {Number} weight
         */
        push: function(symbol, weight) {
            var n = node(symbol, weight);
            this.priorityQueue.push(n);
            this.nodes.push(n);
        },
        /**
         * Sorts the array, so the nodes of highest priority are on the top
         * (ready to pop)
         */
        sortLeafsNodes: function() {
            this.priorityQueue.sort(Node.compareNodesDescending);
        },
        /*
         * Collapse the highest priority nodes into one
         * @pre priorityQueue should be sorted (lowest probability nodes at the end)
         * @pre priorityQueue has at least two nodes
         */
        popTwiceAndPush: function() {
            // nodeA is more probable than nodeB
            nodeB = this.priorityQueue.pop();
            nodeA = this.priorityQueue.pop();
            console.log("poping the two nodes with lowest probability {"
                    + nodeA + "} and {" + nodeB + "}");
            parent = node(nodeA.symbol + nodeB.symbol, nodeA.weight + nodeB.weight);
            nodeA.parent = parent;
            nodeB.parent = parent;
            parent.children = [nodeA, nodeB];
            this.priorityQueue.push(parent);
            console.log("pushed new node {" + parent + "}");
        },
        /**
         * Calculates the binary tree of nodes (see
         *  http://en.wikipedia.org/wiki/Huffman_coding#Compression)
         */
        calculateTree: function() {
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
        },
        /**
         * Walks the root node up to the leafs and assing the leafs a huffman code
         * @pre the priorityQueue contains only one node: the root of the tree built
         *      in calculate. @link calculateTree should have been called first
         */
        calculateCodes: function() {
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
        },
        calculate: function() {
            this.calculateTree();
            this.calculateCodes();
        }
    };
    return that;
}