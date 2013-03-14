/**
 * @class Represents a node as described in
 * <a href="http://en.wikipedia.org/wiki/Huffman_coding#Compression"/>
 * 
 * @param s (String) node's textual representation
 * @param w (Number) node's weight
 * @type node
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
 * @class This class implements a Huffman's code construction algorithm. Add
 * nodes to this class using {@link push(String, Number)}, {@link calculate()}
 * the codes and get the result with {@link getNodes()}. The nodes are
 * instrumented with the corresponding code.
 */
function huffman() {
    var priorityQueue = [];
    /** Original alphabet */
    var nodes = [];
    /** Map of symbols to nodes for optimazed accessibility. Calculated in
     *  {@link calculateCodes()}. */
    var codes = [];
    /**
     * Sorts the array, so the nodes of highest priority are on the top
     * (ready to pop)
     */
    function sortLeafsNodes() {
        priorityQueue.sort(compareNodesDescending);
    }

    /*
     * Collapse the highest priority nodes into one
     * @pre priorityQueue should be sorted (lowest probability nodes at the end)
     * @pre priorityQueue has at least two nodes
     */
    function popTwiceAndPush() {
        // nodeA is more probable than nodeB
        var nodeB = priorityQueue.pop();
        var nodeA = priorityQueue.pop();
        console.log("poping the two nodes with lowest probability {"
                + nodeA + "} and {" + nodeB + "}");
        parent = node(nodeA.symbol + nodeB.symbol, nodeA.weight + nodeB.weight);
        nodeA.parent = parent;
        nodeB.parent = parent;
        parent.children = [nodeA, nodeB];
        priorityQueue.push(parent);
        console.log("pushed new node {" + parent + "}");
    }

    /**
     * Calculates the binary tree of nodes (see
     *  http://en.wikipedia.org/wiki/Huffman_coding#Compression)
     */
    function calculateTree() {
        console.log("------");
        console.log("Step 0");
        console.log("Original queue: " + priorityQueue);
        var step = 1;
        sortLeafsNodes();
        while (priorityQueue.length > 1) {
            console.log("------");
            console.log("Step " + step);
            console.log("Queue at the beginning of step " + step + ": " + priorityQueue);
            popTwiceAndPush();
            sortLeafsNodes();
            console.log("Queue at the end of step " + step + ": " + priorityQueue);
            step++;
        }
    }

    /**
     * Walks the root node up to the leafs and assing the leafs a huffman code
     * @pre the priorityQueue contains only one node: the root of the tree built
     *      in calculate. {@link calculateTree()} should have been called first
     */
    function calculateCodes() {
        console.log("-------------");
        console.log("Decoding root");
        var decodingQueue = [priorityQueue[0]];
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
        for (var i = 0; i < nodes.length; i++) {
            codes[nodes[i].symbol] = nodes[i];
        }
    }

    return {
        getAlphabetLength: function() {
            return nodes.length;
        },
        getSymbolAt: function(index) {
            return nodes[index].symbol;
        },
        getWeightAt: function(index) {
            return nodes[index].weight;
        },
        getCodeAt: function(index) {
            return nodes[index].code;
        },
        /** @param {String} symbol symbol representation */
        getCodeFor: function(symbol) {
            return codes[symbol].code;
        },
        getBinUnicodeAt: function(index) {
            return encodeToBinaryUnicode(nodes[index].symbol);
        },
        /**
         * Add a new symbol
         * @param {String} symbol
         * @param {Number} weight
         */
        push: function(symbol, weight) {
            var n = node(symbol, weight);
            priorityQueue.push(n);
            nodes.push(n);
        },
        /** Calculates the Huffman tree and the code for each symbol */
        calculate: function() {
            calculateTree();
            calculateCodes();
        },
        /**
         * @param {String} text to encode
         * @param {String} separator the output string uses this separator between the
         *          original symbols, to help recognize them.
         * @returns {String} the encoded input text using the calculated
         *       Huffman's code
         */
        encode: function(text, separator) {
            var encodingMap = {};
            nodes.forEach(function(n) {
                encodingMap[n.symbol] = n.code;
            });
            console.log("Encoding text: '" + text + "'");
            return customEncoding(text, encodingMap, separator);
        }
    };
}

/**
 * @param {String} text text to encode
 * @param {String} separator the output string uses this separator between the
 *          original symbols, to help recognize them.
 * @returns {String} binary representation of the unicode text representation
 */
function encodeToBinaryUnicode(text, separator) {
    var unicode = '';
    var s = (separator === undefined) ? ' ' : separator;
    for (var i = 0; i < text.length; i++) {
        if (i > 0) {
            unicode += s;
        }
        unicode += parseInt(text.charCodeAt(i)).toString(2);
    }
    return unicode;
}

/**
 * @param {String} text text to encode
 * @param {Object} encodingMap symbol to code mapping
 * @param {String} separator the output string uses this separator between the
 *          original symbols, to help recognize them.
 * @returns {String} custom encoding of text
 */
function customEncoding(text, encodingMap, separator) {
    var encodedText = '';
    var s = (separator === undefined) ? ' ' : separator;
    for (var i = 0; i < text.length; i++) {
        if (i > 0) {
            encodedText += s;
        }
        encodedText += encodingMap[text.charAt(i)];
    }
    return encodedText;
}