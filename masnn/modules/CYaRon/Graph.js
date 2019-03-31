var random = require('../py_random')
function Edge(u, v, w) {
    /*__init__(u, v, w) -> None
        Initialize a edge. 
        int u -> the start vertex
        int v -> the end vertex
        int w -> the weight.
    */
    this.start = u
    this.end = v
    this.weight = w
    this.__str__ = function () {
        /*__str__() -> str
            Return a string to output the edge. The string contains the start vertex, end vertex and weight(u,v,w) and splits with space.
        */
        return this.start + ' ' + this.end + ' ' + this.weight
    }
    this.unweighted_edge = function (edge) {
        /* unweighted_edge(edge) -> str
            Return a string to output the edge without weight. The string contains the start vertex, end vertex(u,v) and splits with space.
        */
        return edge.start + ' ' + edge.end
    }
}
function Graph(point_count, directed = false) {
    /*__init__(point_count) -> None
        Initialize a graph.
        int point_count -> the count of the vertexes in the graph.
        bool directed = False -> whether the graph is directed(true:directed,false:not directed)
    */
    this.directed = directed
    this.edges = []
    this.point=point_count
    this.edge=0;
    for (let i = 1; i <= point_count + 1; i++) this.edges.push([])
    this.to_str = function (args = {}) {
        /*to_str(args) -> str
            Convert the graph to string with format. Splits with "\n"
            args(Keyword args):
                bool shuffle = False -> whether shuffle the output or not
                str output(Edge) = str -> the convert function which converts object Edge to str. the default way is to use str()
        */
        shuffle = args.shuffle || false
        output = args.output || function (edge) { return edge.start + ' ' + edge.end + ' ' + edge.weight }
        buf = []
        if (shuffle) {
            new_node_id = []
            for (let i = 1; i < length(this.edges); i++)
                new_node_id.push(i)
            random.shuffle(new_node_id)
            new_node_id = [0] + new_node_id
            edge_buf = []
            for (edge in this.iterate_edges())
                edge_buf.push(Edge(new_node_id[edge.start], new_node_id[edge.end], edge.weight))
            edge_buf = random.shuffle(edge_buf)
            for (var edge in edge_buf) {
                if (!this.directed && random.randint(0, 1) == 0)
                    [edge.start, edge.end] = [edge.end, edge.start]
                buf.push(output(edge))
            }
        } else for (var edge in this.iterate_edges())
            buf.push(output(edge))
        return buf.join("\n")
    }
    this.iterate_edges = function () {
        /*iterate_edges() -> Edge
            Iter the graph. Order by the start vertex.
        */
        //for (var node in this.edges)
        //    for(var edge in node)
        //        if (edge.end >= edge.start || this.directed)
        //            yield
    }
    this.__add_edge = function (x, y, w) {
        /*__add_edge(x, y, w) -> None
            Add an edge to the graph.
        */
        this.edges[x].push(new Edge(x, y, w))
    }
    this.add_edge = function (x, y, args = {}) {
        /*add_edge(x, y, args) -> None
            int x -> the start vertex
            int y -> the end vertex
            args(Keyword args):
                int weight = 1 -> the weight 
        */
        weight = args.weight || 1
        this.__add_edge(x, y, weight)
        if (!this.directed && x != y)
            this.__add_edge(y, x, weight)
    }
    this.chain = function (point_count, args = {}) {
        /*chain(point_count, args) -> Graph
               Factory method. Return a chain graph with point_count vertexes.
               int point_count -> the count of vertexes
               args(Keyword args):
                   bool directed = True -> whether the chain is directed(true:directed,false:not directed)
                   (int,int) weight_limit = (1,1) -> the limit of weight. index 0 is the min limit, and index 1 is the max limit(both included)
                   int weight_limit -> If you use a int for this arg, it means the max limit of the weight(included)
                   int/float weight_gen() 
                   = lambda: random.randint(weight_limit[0], weight_limit[1]) 
                   -> the generator of the weights. It should return the weight. The default way is to use the random.randint()
        */
        return new Graph.tree(point_count, 1, 0, args)
    }
    this.flower = function (point_count, args = {}) {
        /*flower(point_count, args) -> Graph
               Factory method. Return a flower graph with point_count vertexes.
               int point_count -> the count of vertexes
               args(Keyword args):
                   bool directed = True -> whether the chain is directed(true:directed,false:not directed)
                   (int,int) weight_limit = (1,1) -> the limit of weight. index 0 is the min limit, and index 1 is the max limit(both included)
                   int weight_limit -> If you use a int for this arg, it means the max limit of the weight(included)
                   int/float weight_gen() 
                   = lambda: random.randint(weight_limit[0], weight_limit[1]) 
                   -> the generator of the weights. It should return the weight. The default way is to use the random.randint()
        */
        return new Graph.tree(point_count, 0, 1, args)
    }
    this.tree = function (point_count, chain = 0, flower = 0, args = {}) {
        /*tree(point_count, chain=0, flower=0, args) -> Graph
               Factory method. Return a tree with point_count vertexes.
               int point_count -> the count of vertexes
               float chain = 0 -> 1 means the tree is a chain
               float flower = 0 -> 1 means the tree is a flower
               NOTICE:only either chain or flower can be True
               args(Keyword args):
                   bool directed = False -> whether the chain is directed(true:directed,false:not directed)
                   (int,int) weight_limit = (1,1) -> the limit of weight. index 0 is the min limit, and index 1 is the max limit(both included)
                   int weight_limit -> If you use a int for this arg, it means the max limit of the weight(included)
                   int/float weight_gen() 
                   = lambda: random.randint(weight_limit[0], weight_limit[1]) 
                   -> the generator of the weights. It should return the weight. The default way is to use the random.randint()
        */
        var directed = args.directed || false
        var weight_limit = args.weight_limit || [1, 1]
        if (!Array.isArray(weight_limit))
            weight_limit = [1, weight_limit]
        var weight_gen = args.weight_gen || function () { return random.randint(weight_limit[0], weight_limit[1]) }
        if (!(0 <= chain && chain <= 1) || (!(0 <= flower && flower <= 1)))
            throw new Error("chain and flower must be between 0 and 1")
        if (chain + flower > 1)
            throw new Error("chain plus flower must be smaller than 1")
        var graph = new Graph(point_count, directed)
        var chain_count = Math.floor((point_count - 1) * chain)
        var flower_count = Math.floor((point_count - 1) * flower)
        if (chain_count > point_count - 1)
            chain_count = point_count - 1
        if (chain_count + flower_count > point_count - 1)
            flower_count = point_count - 1 - chain_count
        var random_count = point_count - 1 - chain_count - flower_count
        for (var i = 2; i < chain_count + 2; i++)
            graph.add_edge(i - 1, i, { weight: weight_gen() })
        for (var i = chain_count + 2; i < chain_count + flower_count + 2; i++)
            graph.add_edge(1, i, { weight: weight_gen() })
        for (var i = point_count - random_count + 1; i < point_count + 1; i++) {
            u = random.randrange(1, i)
            graph.add_edge(u, i, { weight: weight_gen() })
        }
        return graph
    }
    this.binary_tree = function (point_count, left = 0, right = 0, args = {}) {
        /*binary_tree(point_count, left=0, right=0, args) -> Graph
               Factory method. Return a binary tree with point_count vertexes.
               int point_count -> the count of vertexes
               float left = 0 -> random arg. should be in [0,1]
               float right = 0 -> random arg. should be in [0,1]
               NOTICE:left+right mustn't be greater than 1
               args(Keyword args):
                   bool directed = False -> whether the chain is directed(true:directed,false:not directed)
                   (int,int) weight_limit = (1,1) -> the limit of weight. index 0 is the min limit, and index 1 is the max limit(both included)
                   int weight_limit -> If you use a int for this arg, it means the max limit of the weight(included)
                   int/float weight_gen() 
                   = lambda: random.randint(weight_limit[0], weight_limit[1]) 
                   -> the generator of the weights. It should return the weight. The default way is to use the random.randint()
        */
        var directed = args.directed || false;
        var weight_limit = args.weight_limit || [1, 1]
        if (!Array.isArray(weight_limit))
            weight_limit = [1, weight_limit]
        var weight_gen = args.weight_gen || function () { return random.randint(weight_limit[0], weight_limit[1]) }
        if ((!(0 <= left && left <= 1)) || (!(0 <= right && right <= 1)))
            throw new Error("left and right must be between 0 and 1")
        if (left + right > 1)
            throw new Error("left plus right must be smaller than 1")
        var can_left = [1]
        var can_right = [1]
        var graph = new Graph(point_count, directed)
        for (var i = 2; i <= point_count; i++) {
            var edge_pos = Math.random()
            var node = 0
            if ((edge_pos < left) || (left + right < edge_pos && edge_pos <= (1.0 - left - right) / 2)) {
                node = random.choice(can_left)
                can_left.remove(node)
            }
            else if ((left <= edge_pos && edge_pos <= left + right) || ((1.0 - left - right) / 2 < edge_pos && edge_pos < 1)) {
                node = random.choice(can_right)
                can_right.remove(node)
            }
            graph.add_edge(node, i, { weight: weight_gen() })
            can_left.push(i)
            can_right.push(i)
        }
        return graph
    }
    this.graph = function (point_count, edge_count, args = {}) {
        /*graph(point_count, edge_count, args) -> Graph
               Factory method. Return a graph with point_count vertexes and edge_count edges.
               int point_count -> the count of vertexes
               int edge_count -> the count of edges
               args(Keyword args):
                   bool self_loop = True -> whether to allow self loops or not
                   bool repeated_edges = True -> whether to allow repeated edges or not
                   bool directed = False -> whether the chain is directed(true:directed,false:not directed)
                   (int,int) weight_limit = (1,1) -> the limit of weight. index 0 is the min limit, and index 1 is the max limit(both included)
                   int weight_limit -> If you use a int for this arg, it means the max limit of the weight(included)
                   int/float weight_gen() 
                   = lambda: random.randint(weight_limit[0], weight_limit[1]) 
                   -> the generator of the weights. It should return the weight. The default way is to use the random.randint()
        */
        var directed = args.directed || false
        var self_loop = args.self_loop || true
        var repeated_edges = args.repeated_edges || true
        var weight_limit = args.weight_limit || [1, 1]
        if (!Array.isArray(weight_limit))
            weight_limit = [1, weight_limit]
        weight_gen = args.weight_gen || function () {
            return random.randint(weight_limit[0], weight_limit[1])
        }
        point = point_count
        edge = edge_count
        var graph = new Graph(point_count, directed)
        var used_edges = []
        var i = 0
        while (i < edge_count) {
            u = random.randint(1, point_count)
            v = random.randint(1, point_count)
            if ((!self_loop && u == v) || (!repeated_edges && [u, v] in used_edges))
                continue
            graph.add_edge(u, v, { weight: weight_gen() })
            if (!repeated_edges) {
                used_edges.push([u, v])
                if (!directed) used_edges.push([v, u])
            }
            i += 1
        }
        return graph
    }
    this.DAG = function (point_count, edge_count, args) {
        /*DAG(point_count, edge_count, args) -> Graph
               Factory method. Return a graph with point_count vertexes and edge_count edges.
               int point_count -> the count of vertexes
               int edge_count -> the count of edges
               args(Keyword args):
                   bool self_loop = False -> whether to allow self loops or not
                   bool repeated_edges = True -> whether to allow repeated edges or not
                   bool loop = False -> whether to allow loops or not
                   (int,int) weight_limit = (1,1) -> the limit of weight. index 0 is the min limit, and index 1 is the max limit(both included)
                   int weight_limit -> If you use a int for this arg, it means the max limit of the weight(included)
                   int/float weight_gen() 
                   = lambda: random.randint(weight_limit[0], weight_limit[1]) 
                   -> the generator of the weights. It should return the weight. The default way is to use the random.randint()
        */
        if (edge_count < point_count - 1)
            throw new Error("the number of edges of connected graph must more than the number of nodes - 1")
        var self_loop = args.self_loop || false
        var repeated_edges = args.repeated_edges || true
        var loop = args.loop || true
        var weight_limit = args.weight_limit || [1, 1]
        if (!Array.isArray(weight_limit))
            weight_limit = [1, weight_limit]
        var weight_gen = args.weight_gen || function () {
            return random.randint(weight_limit[0], weight_limit[1])
        }
        var used_edges = []
        var edge_buf = list(new Graph.tree(point_count, { weight_limit: weight_limit }).iterate_edges())
        var graph = new Graph(point_count, { directed: True })
        for (var edge in edge_buf) {
            if (loop && random.randint(1, 2) == 1)
                [edge.start, edge.end] = [edge.end, edge.start]
            graph.add_edge(edge.start, edge.end, { weight: edge.weight })
            if (!repeated_edges) used_edges.add([edge.start, edge.end])
        }
        var i = point_count - 1, u = 0, v = 0
        while (i < edge_count) {
            u = random.randint(1, point_count)
            v = random.randint(1, point_count)
            if (!loop && u > v) [u, v] = [v, u]
            if ((!self_loop && u == v) || (!repeated_edges && [u, v] in used_edges))
                continue
            graph.add_edge(u, v, { weight: weight_gen() })
            if (!repeated_edges) used_edges.add([u, v])
            i += 1
        }
        return graph
    }
    this.UDAG = function (point_count, edge_count, args) {
        /*UDAG(point_count, edge_count, args) -> Graph
               Factory method. Return a graph with point_count vertexes and edge_count edges.
               int point_count -> the count of vertexes
               int edge_count -> the count of edges
               args(Keyword args):
                   bool self_loop = True -> whether to allow self loops or not
                   bool repeated_edges = True -> whether to allow repeated edges or not
                   (int,int) weight_limit = (1,1) -> the limit of weight. index 0 is the min limit, and index 1 is the max limit(both included)
                   int weight_limit -> If you use a int for this arg, it means the max limit of the weight(included)
                   int/float weight_gen() 
                   = lambda: random.randint(weight_limit[0], weight_limit[1]) 
                   -> the generator of the weights. It should return the weight. The default way is to use the random.randint()
        */
        if (edge_count < point_count - 1)
            throw new Error("the number of edges of connected graph must more than the number of nodes - 1")
        var self_loop = args.self_loop || true
        var repeated_edges = args.repeated_edges || true
        var weight_limit = args.weight_limit || [1, 1]
        if (!Array.isArray(weight_limit)) weight_limit = [1, weight_limit]
        var weight_gen = args.weight_gen || function () {
            return random.randint(weight_limit[0], weight_limit[1])
        }
        var used_edges = []
        var graph = new Graph.tree(point_count, { weight_limit: weight_limit, directed: false })
        for (var edge in graph.iterate_edges())
            if (!repeated_edges) {
                used_edges.push([edge.start, edge.end])
                used_edges.push([edge.end, edge.start])
            }
        var i = point_count - 1, u = 0, v = 0
        while (i < edge_count) {
            u = random.randint(1, point_count)
            v = random.randint(1, point_count)
            if ((!self_loop && u == v) || (!repeated_edges && [u, v] in used_edges))
                continue
            graph.add_edge(u, v, { weight: weight_gen() })
            if (!repeated_edges) {
                used_edges.push([u, v])
                used_edges.push([v, u])
            }
            i += 1
        }
        return graph
    }
    this.hack_spfa = function (point_count, args) {
        /*hack_spfa(point_count, args) -> None
           Factory method. Return a spfa graph with point_count vertexes
           int point_count -> the count of vertexes
           args(Keyword args):
               bool directed = False -> whether the chain is directed(true:directed,false:not directed)
               (int,int) weight_limit = (1,1) -> the limit of weight. index 0 is the min limit, and index 1 is the max limit(both included)
               int weight_limit -> If you use a int for this arg, it means the max limit of the weight(included)
               int extra_edge = 2 -> the number of extra edges
               int/float weight_gen() 
                   = lambda: random.randint(weight_limit[0], weight_limit[1]) 
                   -> the generator of the weights. It should return the weight. The default way is to use the random.randint()
        */
        var directed = args.directed || false
        var extraedg = args.extra_edge || 2
        var weight_limit = args.weight_limit || [1, 1]
        if (!Array.isArray(weight_limit))
            weight_limit = [1, weight_limit]
        var weight_gen = args.weight_gen || function () {
            return random.randint(weight_limit[0], weight_limit[1])
        }
        var point_to_skip = point_count + 3
        var graph = new Graph(point_count, directed)
        if (point_count % 2 == 1) point_to_skip = point_count / 2 + 1
        var half = Math.floor(point_count / 2)
        for (var i = 1; i < half; i++) {
            [x, y] = [i, i + 1]
            graph.add_edge(x + (x >= point_to_skip), y +
                (y >= point_to_skip), { weight: weight_gen() })
            [x, y] = [i + half, i + half + 1]
            graph.add_edge(x + (x >= point_to_skip), y +
                (y >= point_to_skip), { weight: weight_gen() })
        }
        for (var i = 1; i < half + 1; i++) {
            [x, y] = [i, i + half]
            graph.add_edge(x + (x >= point_to_skip), y +
                (y >= point_to_skip), { weight: weight_gen() })
        }
        for (var i = 0; i < extraedg; i++) {
            u = random.randint(1, point_count)
            v = random.randint(1, point_count)
            graph.add_edge(u, v, { weight: weight_gen() })
        }
        return graph
    }
}
module.exports = Graph