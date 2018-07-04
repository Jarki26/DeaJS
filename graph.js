var canvas = document.getElementById("graph");
var ctx = canvas.getContext("2d");

const NODE_R = 30;
const WINDOW_WIDTH = canvas.width;
const WINDOW_HEIGHT = canvas.height;

var nodes = new NodeCollection();
var arcs = new ArcsCollection();

ctx.translate(WINDOW_WIDTH/2, WINDOW_HEIGHT/2);
clear_graph();

// Node functions
function Node(name="", wallet=0, x=0, y=0){
    this.name = name;
    this.wallet = Number(wallet);
    this.x = x;
    this.y = y;

    this.draw_node = function(x=this.x, y=this.y){
        this.x = x;
        this.y = y;
        // Node background
        ctx.fillStyle = "#00FF00";
        ctx.beginPath();
        ctx.arc(this.x,this.y,NODE_R,0,2*Math.PI);
        ctx.fill();
        ctx.stroke();
    
        // Node name
        ctx.fillStyle = "#000000";
        var xText = this.x - 10 * this.name.length/4;
        var yText = this.y + 2.5;
        ctx.fillText(this.name, xText, yText);
        
        // Node wallet
        xText = this.x - 10 * this.wallet.toString().length/4;
        ctx.fillText(this.wallet.toString(), xText, yText+20);
    
        // Node shape
        ctx.beginPath();
        ctx.arc(this.x,this.y,NODE_R,0,2*Math.PI);
        ctx.stroke();
    }
}

function NodeCollection(){
    this.content = {};
    this.length = function() {return this.keys().length;};
    this.keys = function() {return Object.keys(this.content);};
    this.get = function(name) {return this.content[name]};
    this.set = function(name,obj) {this.content[name] = obj;};

    this.add = function(node){
        // Check if node exists
        if(Object.keys(this.content).indexOf(node.name) == -1){
            this.content[node.name] = node;
            var option1 = document.createElement("option");
            var option2 = document.createElement("option");
            option1.text = node.name;
            option2.text = node.name;
            document.getElementById("selec1").add(option1);
            document.getElementById("selec2").add(option2);
            console.log("Node \"",node.name,"\" created");
        }
        else{
            console.log("Error, node \"", node.name, "\" exists");
        }
    };

    this.delete = function(name){
        // var index;
        for(nameB in this.content){
            if(name != nameB){
                arcs.delete(gen_arc_key(name, nameB));
            }
        }
        delete this.content[name];
        del_opt("selec1", name);
        del_opt("selec2", name);
    };

    this.delete_all = function(){
        for(name in this.content){
            this.delete(name);
        }
    }
}

function calc_pos(i, n){
    var x = 0;
    var y = 0;
    var rad = 70*n/Math.PI;
    if(n>1){
        var delta = 2*Math.PI/n;
        if(i<n/2){
            x = Math.round(Math.cos(i*delta) * rad);
            y = Math.round(Math.sin(i*delta) * rad);
        }else{
            x = Math.round(Math.cos(i*delta) * 1.2*rad);
            y = Math.round(Math.sin(i*delta) * 1.2*rad);
        }
    }
    return {"x":x, "y":y};
}

function gen_arc_key(nodeA, nodeB){
    var list = [];
    list.push(nodeA);
    list.push(nodeB);
    list.sort();
    return "".concat(list[0],";",list[1]);
}

function decomp_key(node, key){
    var list = [];
    list = key.split(";");
    if(list.length != 2){
        return node;
    }
    if(list[0]==node){
        return list[1];
    }else{
        return list[0];
    }
}

// Arcs functions
function Arc(nodeA, nodeB, value){
    this.key = gen_arc_key(nodeA.name, nodeB.name);
    this.nodeA = nodeA;
    this.nodeB = nodeB;
    this.value = Number(value);

    this.draw_arc = function(){
        // var posA = nodes[nodeA];
        // var posB = nodes[nodeB];
        // if any node doesn't exist, abort process
        // if(posA == undefined || posB == undefined){
        //     return null;
        // }
        console.log("nodeA:",this.nodeA);
        console.log("nodeB:",this.nodeB);
            
        // Draw line
        ctx.beginPath();
        ctx.moveTo(this.nodeA.x, this.nodeA.y);
        ctx.lineTo(this.nodeB.x, this.nodeB.y);
        ctx.stroke();
    
        var vec = {};
        vec.x = this.nodeB.x - this.nodeA.x;
        vec.y = this.nodeB.y - this.nodeA.y;
        round_vec(vec);
        // vecMod = Math.round(Math.sqrt(Math.pow(vec.x,2) + Math.pow(vec.y,2)));
        // var vecnorm = Math.max(Math.abs(vec.x), Math.abs(vec.y));
        
        // Draw triangle
        ctx.save();
        ctx.translate(Math.round(this.nodeA.x + vec.x/2), Math.round(this.nodeA.y + vec.y/2));
        // Arc value
        var xText = -10 * this.value.toString().length/4;
        var yText = 20;
        ctx.fillStyle = "#000000";
        ctx.fillText(this.value.toString(), xText, yText);
    
        ctx.rotate(Math.atan(vec.y/vec.x));
        console.log("vec:",vec);
        console.log("angle:",Math.atan(vec.y/vec.x));
        //if(vec.x<0 || (vec.x==0 && vec.y<0)){ctx.rotate(Math.PI); }
        if(vec.x<0){ctx.rotate(Math.PI); }
        ctx.beginPath();
        ctx.moveTo(5,0);
        ctx.lineTo(-5,10);
        ctx.lineTo(-5,-10);
        ctx.lineTo(5,0);
        ctx.stroke();
        ctx.restore();
    
        this.nodeA.draw_node();
        this.nodeB.draw_node();
    }
}

function ArcsCollection(){
    this.content = {};
    this.length = function() {return this.keys().length;};
    this.keys = function() {return Object.keys(this.content);};
    this.get = function(name) {return this.content[name]};
    this.set = function(name,obj) {this.content[name] = obj;};

    this.add = function(arc){
        var key = gen_arc_key(arc.nodeA.name, arc.nodeB.name);
        this.content[key] = arc;
    }

    this.delete = function(key){
        delete this.content[key];
    }

    this.delete_all = function(){
        for(element in this.content){
            delete this.content[element];
        }
    }
}

function del_opt(idSelec, name){
    var optionPos;
    var selector = document.getElementById(idSelec);
    for(optionPos in selector.options){
        if(selector.options[optionPos].value == name){
            break;
        }
    }
    selector.remove(optionPos);
}

function round_vec(vec){
    vec.x = Math.round(vec.x * 10000)/10000;
    vec.y = Math.round(vec.y * 10000)/10000;
    if(vec.x==-0){vec.x=0}
    if(vec.y==-0){vec.y=0}
    return vec;
}

// Graph functions
function nodes_graph(){
    var n = nodes.length();
    var pos = {};
    for(i in nodes.keys()) {
        console.log("i:",i,"n:",n);
        pos = calc_pos(Number(i),n);
        console.log(pos);
        nodes.get(nodes.keys()[i]).draw_node(pos.x, pos.y);
    }
}

function arcs_graph(){
    for(i in arcs.keys()){
        arcs.get(arcs.keys()[i]).draw_arc();
    }
}

function update_graph(){
    clear_graph();
    nodes_graph();
    arcs_graph();
}

function clear_graph(){
    ctx.fillStyle = "#e6e6e6";
    ctx.save();
    ctx.translate(-WINDOW_WIDTH/2,-WINDOW_HEIGHT/2);
    ctx.fillRect(0,0,WINDOW_WIDTH,WINDOW_HEIGHT);
    ctx.restore();
}