var canvas = document.getElementById("graph");
var ctx = canvas.getContext("2d");

const NODE_R = 30;
const unit = "€";

var windowWidth = getWidth();
var windowHeight = getHeight();
var nodes = new NodeCollection();
var arcs = new ArcsCollection();

ctx.translate(windowWidth / 2, windowHeight / 2);
clear_graph();

function getWidth() {
    return $(window)[0].innerWidth;
}
function getHeight() {
    return $(window)[0].innerHeight;
}
// Node functions
function Node(name = "", wallet = 0, x = 0, y = 0) {
    this.name = name;
    if (Number(wallet) == NaN) {
        this.wallet = 0;
    } else {
        this.wallet = round_value(Number(wallet));
    }
    this.x = x;
    this.y = y;

    this.setName = function (name) {
        this.name = name;
    }

    this.getName = function () {
        return this.name;
    }

    this.setWallet = function (wallet) {
        this.wallet = wallet;
    }

    this.getWallet = function () {
        return this.wallet;
    }

    this.draw_node = function (x = this.x, y = this.y) {
        var xText;
        var yText;
        this.x = x;
        this.y = y;

        ctx.drawImage(imageNode, x - NODE_R, y - NODE_R, NODE_R * 2, NODE_R * 2);

        // Node name
        ctx.fillStyle = "#FFFFFF";
        xText = this.x - 10 * this.getName().length / 4;
        yText = this.y;
        ctx.fillText(this.getName(), xText, yText + 25);

        // Node wallet
        ctx.fillStyle = "#000000";
        var wallet = this.getWallet().toString() + unit;
        xText = this.x - 10 * wallet.length / 4;
        ctx.fillText(wallet, xText, yText + 12);
    }
}

function NodeCollection() {
    this.content = {};
    this.length = function () { return this.keys().length; };
    this.keys = function () { return Object.keys(this.content); };
    this.get = function (name) { return this.content[name] };
    this.set = function (name, obj) { this.content[name] = obj; };

    this.add = function (node) {
        // Check if node exists
        if (Object.keys(this.content).indexOf(node.getName()) == -1) {
            this.content[node.getName()] = node;

            // Add in selectors UI
            add_opt("addrelselec1", node.getName());
            add_opt("addrelselec2", node.getName());
            add_opt("editselec", node.getName());
            add_opt("delselec", node.getName());
            add_opt("delarcselec2", node.getName());
            add_opt("splitrelselec2", node.getName());
            
            // Bills selectors
            if (node.isbill) {
                add_opt("divrelselec1", node.getName());
            } else {
                add_opt("divrelselec2", node.getName());
            }

            reset_selector("addrelselec1");
            reset_selector("addrelselec2");
            reset_selector("divrelselec1");
            reset_selector("divrelselec2");
            reset_selector("editselec");
            reset_selector("delselec");
            reset_selector("delarcselec1");
            reset_selector("delarcselec2");
            reset_selector("splitrelselec2");

            console.log("Node \"", node.getName(), "\" created");
            return true;
        }
        else {
            console.log("Error, node \"", node.getName(), "\" exists");
            return false;
        }
    };

    this.edit = function (name, value) {
        var node = this.content[name];
        var list = arcs.get_from_node(name);
        console.log("edit Number(value): " + Number(value));
        if (isNaN(Number(value))) {
            return false;
        } else {
            value = round_value(Number(value));
        }
        node.setWallet(value);
        for (i in list) {
            if (name == list[i].nameA) {
                node.wallet = round_value(node.wallet - list[i].value);
            } else {
                if (name == list[i].nameB) {
                    node.wallet = round_value(node.wallet + list[i].value);
                }
            }
        }
        return true;
    }

    this.delete = function (name) {
        // var index;
        for (nameB in this.content) {
            if (name != nameB) {
                arcs.delete(gen_arc_key(name, nameB));
            }
        }
        if (nodes.get(name).isbill) {
            del_opt("divrelselec1", name);
            reset_selector("divrelselec1");
        } else {
            del_opt("divrelselec2", name);
            reset_selector("divrelselec2");
        }

        delete this.content[name];
        del_opt("addrelselec1", name);
        del_opt("addrelselec2", name);
        del_opt("editselec", name);
        del_opt("delselec", name);
        del_opt("delarcselec1", name);
        del_opt("delarcselec2", name);
        del_opt("splitrelselec2", name);

        reset_selector("addrelselec1");
        reset_selector("addrelselec2");
        reset_selector("editselec");
        reset_selector("delselec");
        reset_selector("delarcselec1");
        reset_selector("delarcselec2");
        reset_selector("splitrelselec2");
    };

    this.delete_all = function () {
        for (name in this.content) {
            this.delete(name);
        }
    }
}

// Bill functions
function Bill(name = "", wallet = 0, x = 0, y = 0) {
    var node = new Node(name, wallet * -1);
    node.isbill = true;
    node.setWallet = function (wallet) {
        this.wallet = wallet * -1;
    };
    node.draw_node = function (x = this.x, y = this.y) {
        var xText;
        var yText;
        this.x = x;
        this.y = y;

        ctx.drawImage(imageBill, x - NODE_R, y - NODE_R, NODE_R * 2, NODE_R * 2);

        // Node name
        ctx.fillStyle = "#000000";
        xText = this.x - 10 * this.getName().length / 4;
        yText = this.y;
        ctx.fillText(this.getName(), xText, yText + 25);

        // Node wallet
        ctx.fillStyle = "#FF0000";
        var wallet = (this.getWallet() * -1).toString() + unit;
        xText = this.x - 10 * wallet.length / 4;
        ctx.fillText(wallet, xText, yText + 12);
    };
    return node;
}

function calc_pos(i, n) {
    var x = 0;
    var y = 0;
    var rad = 70 * n / Math.PI;
    if (n > 1) {
        var delta = 2 * Math.PI / n;
        if (i < n / 2) {
            x = Math.round(Math.cos(i * delta) * rad);
            y = Math.round(Math.sin(i * delta) * rad);
        } else {
            x = Math.round(Math.cos(i * delta) * 1.2 * rad);
            y = Math.round(Math.sin(i * delta) * 1.2 * rad);
        }
    }
    return { "x": x, "y": y };
}

function gen_arc_key(nodeA, nodeB) {
    if (nodeA < nodeB) {
        return "".concat(nodeA, ";", nodeB);
    } else {
        return "".concat(nodeB, ";", nodeA);
    }
}

function decomp_key(node, key) {
    var list = [];
    list = key.split(";");
    if (list.length != 2) {
        return node;
    }
    if (list[0] == node) {
        return list[1];
    } else {
        return list[0];
    }
}

// Arcs functions
function Arc(nameA, nameB, value) {
    if (Number(value) == NaN) {
        this.value = 0;
    } else {
        this.value = round_value(Number(value));
    }
    var nodeA;
    var nodeB;
    if (this.value < 0) {
        nodeB = nodes.get(nameA);
        nodeA = nodes.get(nameB);
        this.nameB = nameA;
        this.nameA = nameB;
        this.value *= -1;
    } else {
        nodeA = nodes.get(nameA);
        nodeB = nodes.get(nameB);
        this.nameA = nameA;
        this.nameB = nameB;
    }
    if (nodeA == undefined || nodeB == undefined) {
        return null;
    }
    this.key = gen_arc_key(nameA, nameB);

    this.sum = function (arc) {
        var result = this.clone();
        if (result.key == arc.key) {
            if (result.getNameA() == arc.getNameA() && result.getNameB() == arc.getNameB()) {
                result = new Arc(result.getNameA(), result.getNameB(), result.getValue() + arc.getValue());
            } else if (result.getNameA() == arc.getNameB() && result.getNameB() == arc.getNameA()) {
                result = new Arc(result.getNameA(), result.getNameB(), result.getValue() - arc.getValue());
            } else {
                console.error("ERROR al sumar arc:" + result + " and " + arc);
            }
        } else {
            console.error("ERROR key " + result.key + " y " + arc.key + " no coinciden");
        }
        if(round_value(result.getValue) == 0){
            return undefined;
        }
        return result
    }

    this.clone = function () {
        return new Arc(this.nameA, this.nameB, this.value);
    }

    this.setNameA = function (nameA) {
        this.nameA = nameA;
    }

    this.getNameA = function () {
        return this.nameA;
    }

    this.setNameB = function (nameB) {
        this.nameB = nameB;
    }

    this.getNameB = function () {
        return this.nameB;
    }

    this.setValue = function (value) {
        this.value = value;
    }

    this.getValue = function () {
        return this.value;
    }

    this.draw_arc = function () {
        // var posA = nodes[nodeA];
        // var posB = nodes[nodeB];
        // if any node doesn't exist, abort process
        // if(posA == undefined || posB == undefined){
        //     return null;
        // }
        if (this.getNameA() == this.getNameB()) {
            return null;
        }

        var nodeA = nodes.get(this.getNameA());
        var nodeB = nodes.get(this.getNameB());

        // Draw line
        ctx.strokeStyle = "#777777";
        ctx.beginPath();
        ctx.moveTo(nodeA.x, nodeA.y);
        ctx.lineTo(nodeB.x, nodeB.y);
        ctx.stroke();

        var vec = {};
        vec.x = nodeB.x - nodeA.x;
        vec.y = nodeB.y - nodeA.y;
        round_vec(vec);

        // Draw triangle
        ctx.save();
        ctx.translate(Math.round(nodeA.x + vec.x / 2), Math.round(nodeA.y + vec.y / 2));
        ctx.rotate(Math.atan(vec.y / vec.x));
        if (vec.x < 0) { ctx.rotate(Math.PI); }
        ctx.drawImage(imageArrow, -10, -10, 20, 20);
        ctx.restore();

        // Arc value
        ctx.save();
        ctx.translate(Math.round(nodeA.x + vec.x / 2), Math.round(nodeA.y + vec.y / 2));
        var value = this.getValue().toString() + unit;
        var xText = -10 * value.length / 4;
        var yText = 20;
        ctx.fillStyle = "#000000";
        ctx.fillText(value, xText, yText);
        ctx.restore();

        nodeA.draw_node();
        nodeB.draw_node();
    }
}

function ArcsCollection() {
    this.content = {};
    this.length = function () { return this.keys().length; };
    this.keys = function () { return Object.keys(this.content); };
    this.get = function (name) { return this.content[name] };
    this.set = function (name, obj) { this.content[name] = obj; };

    this.add = function (arc, is_load = false) {
        if (arc.getNameA() == arc.getNameB()) {
            return null;
        }
        var key = gen_arc_key(arc.getNameA(), arc.getNameB());
        if (this.content[key] != undefined) {
            var current = this.content[key].clone();
            this.delete(key);
            this.content[key] = current.sum(arc);
            if(!is_load) {
                var nodeA = nodes.get(this.content[key].getNameA());
                var nodeB = nodes.get(this.content[key].getNameB());
                nodeA.wallet = round_value(nodeA.getWallet() - this.content[key].value);
                nodeB.wallet = round_value(nodeB.getWallet() + this.content[key].value);
            }
        } else {
            this.content[key] = arc;
            if(!is_load) {
                var nodeA = nodes.get(arc.getNameA());
                var nodeB = nodes.get(arc.getNameB());
                nodeA.wallet = round_value(nodeA.getWallet() - arc.value);
                nodeB.wallet = round_value(nodeB.getWallet() + arc.value);
            }
        }

        // Add in selectors UI
        console.log("added to arc:", arc);
        var splitreloption1 = document.createElement("option");
        splitreloption1.text = key;
        document.getElementById("splitrelselec1").add(splitreloption1);

        reset_selector("splitrelselec1");
    }

    this.delete = function (key) {
        var arc = arcs.get(key);
        if (arc != undefined) {
            var nodeA = nodes.get(arc.getNameA());
            var nodeB = nodes.get(arc.getNameB());
            nodeA.wallet = round_value(nodeA.getWallet() + arc.getValue());
            nodeB.wallet = round_value(nodeB.getWallet() - arc.getValue());
            delete this.content[key];

            del_opt("splitrelselec1", key);
            reset_selector("splitrelselec1");
        }
    }

    this.delete_all = function () {
        for (key in this.content) {
            this.delete(key);
        }
    }

    this.get_from_node = function (name) {
        var nameB;
        var arc;
        var list = [];
        for (i in nodes.keys()) {
            nameB = nodes.keys()[i];
            arc = arcs.get(gen_arc_key(name, nameB));
            if (arc != undefined) {
                list[list.length] = arc;
            }
        }
        return list;
    }
}

function add_opt(elementId, name) {
    var optionElement = document.createElement("option");
    optionElement.text = name;
    document.getElementById(elementId).add(optionElement);
}

function del_opt(idSelec, name) {
    var optionPos;
    var selector = document.getElementById(idSelec);
    for (optionPos in selector.options) {
        if (selector.options[optionPos].value == name) {
            break;
        }
    }
    selector.remove(optionPos);
}

function round_value(num) {
    return Math.round((num + Number.EPSILON) * 100) / 100;
}

function ceil_value(num) {
    return Math.ceil((num + Number.EPSILON) * 100) / 100;
}

function round_vec(vec) {
    vec.x = Math.round(vec.x * 10000) / 10000;
    vec.y = Math.round(vec.y * 10000) / 10000;
    if (vec.x == -0) { vec.x = 0 }
    if (vec.y == -0) { vec.y = 0 }
    return vec;
}

// Graph functions
function nodes_graph() {
    var n = nodes.length();
    var pos = {};
    for (i in nodes.keys()) {
        console.log("i:", i, "n:", n);
        pos = calc_pos(Number(i), n);
        console.log(pos);
        nodes.get(nodes.keys()[i]).draw_node(pos.x, pos.y);
    }
}

function arcs_graph() {
    for (i in arcs.keys()) {
        arcs.get(arcs.keys()[i]).draw_arc();
    }
}

function update_graph() {
    clear_graph();
    nodes_graph();
    arcs_graph();
}

function clear_graph() {
    ctx.fillStyle = "#e6e6e6";
    ctx.save();
    ctx.translate(-windowWidth / 2, -windowHeight / 2);
    if (windowWidth != getWidth() || windowHeight != getHeight()) {
        ctx.translate(windowWidth / 2, windowHeight / 2);
        $("#graph")[0].width = getWidth();
        $("#graph")[0].height = getHeight();
        windowWidth = $("#graph")[0].width;
        windowHeight = $("#graph")[0].height;

        ctx = canvas.getContext("2d");
        ctx.fillStyle = "#e6e6e6";
        ctx.fillRect(0, 0, windowWidth, windowHeight);
        ctx.translate(windowWidth / 2, windowHeight / 2);
    }
    else {
        ctx.fillRect(0, 0, windowWidth, windowHeight);
        ctx.restore();
    }
}