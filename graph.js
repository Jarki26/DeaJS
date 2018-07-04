var canvas = document.getElementById("graph");
var ctx = canvas.getContext("2d");

const NODE_R = 30;
const WINDOW_WIDTH = canvas.width;
const WINDOW_HEIGHT = canvas.height;

var nodes = {};
var arcs = {};

ctx.translate(WINDOW_WIDTH/2, WINDOW_HEIGHT/2);
clear();
// Node functions
function add_node(name="", wallet=0, x=0, y=0){
    // Check if node exists
    if(Object.keys(nodes).indexOf(name) == -1){
        nodes[name] = {"x":x, "y":y, "wallet":wallet, "arcs":[]};
        var option1 = document.createElement("option");
        option1.text = name;
        var option2 = document.createElement("option");
        option2.text = name;
        document.getElementById("selec1").add(option1);
        document.getElementById("selec2").add(option2);
        console.log("Node \"",name,"\" created");
    }
    else{
        console.log("Error, node \"", name, "\" exists");
    }
}

function del_node(name){
    var index;
    for(keyPos in nodes[name].arcs){
        console.log("keypos:",keyPos);
        var key = nodes[name].arcs[keyPos];
        console.log("key:",key);
        nodeB = decomp_key(name, key);
        console.log("nodeB",nodeB);
        index = nodes[nodeB].arcs.indexOf(key);
        console.log("index nodeB:",index);
        //nodes[name].arcs.splice(keyPos,1);
        //console.log("del key from A:",nodes[name].arcs);
        nodes[nodeB].arcs.splice(index,1);
        console.log("del key from B:",nodes[nodeB].arcs);
        delete arcs[key];
    }
    delete nodes[name];
    del_opt("selec1", name);
    del_opt("selec2", name);
}

function del_nodes(){
    for(element in nodes){
        del_node(element);
    }
}

function draw_node(name="", x=0, y=0){
    // Node background
    ctx.fillStyle = "#00FF00";
    ctx.beginPath();
    ctx.arc(x,y,NODE_R,0,2*Math.PI);
    ctx.fill();
    ctx.stroke();

    // Node name
    ctx.fillStyle = "#000000";
    var xText = x - 10 * name.length/4;
    var yText = y + 2.5;
    ctx.fillText(name, xText, yText);
    
    // Node wallet
    var wallet = nodes[name].wallet.toString();
    xText = x - 10 * wallet.length/4;
    ctx.fillText(wallet, xText, yText+20);

    // Node shape
    ctx.beginPath();
    ctx.arc(x,y,NODE_R,0,2*Math.PI);
    ctx.stroke();
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
function add_arc(nodeA, nodeB, value){
    var key = gen_arc_key(nodeA, nodeB);
    arcs[key] = value;
    nodes[nodeA].arcs.push(key);
    nodes[nodeB].arcs.push(key);
}

function del_arc(nodeA, nodeB){
    var key = gen_arc_key(nodeA, nodeB);
    delete arcs[key];
}

function del_arcs(){
    for(element in arcs){
        delete arcs[element];
    }
}

function draw_arc(nodeA, nodeB){
    var posA = nodes[nodeA];
    var posB = nodes[nodeB];
    // if any node doesn't exist, abort process
    if(posA == undefined || posB == undefined){
        return null;
    }
    var key = gen_arc_key(nodeA, nodeB);
    if(arcs[key] == undefined){return null;}
    var value = arcs[key].toString();
    // console.log("key:",key);
    // console.log("value:",value);

    // Draw line
    ctx.beginPath();
    ctx.moveTo(posA.x, posA.y);
    ctx.lineTo(posB.x, posB.y);
    ctx.stroke();

    var vec = {};
    vec.x = posB.x - posA.x;
    vec.y = posB.y - posA.y;
    round_vec(vec);
    // console.log("vec:",vec);
    vecMod = Math.round(Math.sqrt(Math.pow(vec.x,2) + Math.pow(vec.y,2)));
    var vecnorm = Math.max(Math.abs(vec.x), Math.abs(vec.y));
    
    // Draw triangle
    ctx.save();
    ctx.translate(Math.round(posA.x + vec.x/2), Math.round(posA.y + vec.y/2));
    // Arc value
    var xText = -10 * value.length/4;
    var yText = 20;
    ctx.fillStyle = "#000000";
    ctx.fillText(value, xText, yText);

    ctx.rotate(Math.atan(vec.y/vec.x));
    //if(vec.x<0 || (vec.x==0 && vec.y<0)){ctx.rotate(Math.PI); }
    if(vec.x*vec.y<0){ctx.rotate(Math.PI); }
    ctx.beginPath();
    ctx.moveTo(5,0);
    ctx.lineTo(-5,10);
    ctx.lineTo(-5,-10);
    ctx.lineTo(5,0);
    ctx.stroke();
    ctx.restore();

    draw_node(nodeA,posA.x,posA.y);
    draw_node(nodeB,posB.x,posB.y);
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
    var n = Object.keys(nodes).length;
    Object.keys(nodes).forEach((element,i) => {
        pos = calc_pos(i,n);
        draw_node(element, pos.x, pos.y);
        nodes[element].x = pos.x;
        nodes[element].y = pos.y;
    });
}

function arcs_graph(){
    var arc;
    var list = [];
    var nodeA;
    var nodeB;
    for(arc in arcs){
        list = arc.split(";");
        if(list.length!=2){return null;}
        list.sort();
        draw_arc(list[0], list[1]);
    }
}

function update_graph(){
    clear();
    nodes_graph();
    arcs_graph();
}

function clear(){
    ctx.fillStyle = "#e6e6e6";
    ctx.save();
    ctx.translate(-WINDOW_WIDTH/2,-WINDOW_HEIGHT/2);
    ctx.fillRect(0,0,WINDOW_WIDTH,WINDOW_HEIGHT);
    ctx.restore();
}