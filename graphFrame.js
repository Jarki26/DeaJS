
$("#graph")[0].width = $(window)[0].innerWidth;
$("#graph")[0].height = $(window)[0].innerHeight;
var imageNode;
var imageBill;
var imageArrow;
window.onload = function() {
	loadedNode = false;
	loadedArrow = false;
	loadedBill = false;

	imageNode = new Image();
	imageNode.src = "./images/node.PNG";
	imageNode.onload = function(){
		loadedNode = true;
		if(!(loadedNode && loadedArrow && loadedBill)){
			console.log("loadednode:",loadedNode);
			console.log("loadedarrow:",loadedArrow);
			console.log("loadedbill:",loadedBill);
			return null;
		}
		console.log("image node loaded");
		load();
	};
	imageBill = new Image();
	imageBill.src = "./images/bill.PNG";
	imageBill.onload = function(){
		loadedBill = true;
		if(!(loadedNode && loadedArrow && loadedBill)){
			console.log("loadednode:",loadedNode);
			console.log("loadedarrow:",loadedArrow);
			console.log("loadedbill:",loadedBill);
			return null;
		}
		console.log("image bill loaded");
		load();
	};
	imageArrow = new Image();
	imageArrow.src = "./images/arrow.PNG";
	imageArrow.onload = function(){
		loadedArrow = true;
		if(!(loadedNode && loadedArrow && loadedBill)){
			console.log("loadednode:",loadedNode);
			console.log("loadedarrow:",loadedArrow);
			console.log("loadedbill:",loadedBill);
			return null;
		}
		console.log("image arrow loaded");
		load();
	};
};

function modalTransition(id1, id2){
	$("#"+id1).modal("hide");
	$("#"+id2).modal("show");
}

// Node text functions
function get_textnode(){
	return document.getElementById('node_text').value;
}
function set_textnode(input){
	document.getElementById('node_text').value = input;
}
function clear_textnode(){
	set_textnode("");
}

// Wallet text functions
function get_textwallet(){
	if(document.getElementById('wallet_text').value == ""){
		return "0";
	}
	return document.getElementById('wallet_text').value;
}
function set_textwallet(input){
	document.getElementById('wallet_text').value = input;
}
function clear_textwallet(){
	set_textwallet("");
}

function get_textwalletedit(){
	if(document.getElementById('walletedit_text').value == ""){
		return "0";
	}
	return document.getElementById('walletedit_text').value;
}
function set_textwalletedit(input){
	document.getElementById('walletedit_text').value = input;
}
function clear_textwalletedit(){
	set_textwalletedit("");
}

// Bill checkbox functions
function get_checkbill(){
	return document.getElementById("bill_checkbox").checked;
}

function set_checkbill(val){
	document.getElementById("bill_checkbox").checked = val;
}

function clear_checkbill(){
	set_checkbill(false);
}

// Value text functions
function get_textvalue(){
	if(document.getElementById('textValue').value == ""){
		return "0";
	}
	return document.getElementById('textValue').value;
}
function set_textvalue(input){
	document.getElementById('textValue').value = input;
}
function clear_textvalue(){
	set_textvalue("");
}

// Sector functions
function reset_selector(id){
	document.getElementById(id).selectedIndex = -1;
}

// Alert text
function alert_text(alertClass, text){
	// return null;
	$("#alert").removeClass("alert-success");
	$("#alert").removeClass("alert-danger");
	$("#alert").addClass(alertClass);
	$("#alert div")[0].textContent = text;
	$("#alert").removeClass("hidden");
}

// UI functions
function alert_onclick(){
	$("#alert").removeClass("hidden");
	$("#alert").addClass("hidden");
	$("#alert").removeClass("alert-success");
	$("#alert").removeClass("alert-danger");
}

function share_onclick(){
	save();
}

function addNode_onclick(){
	var text=get_textnode();
	var wallet = get_textwallet();
	var node;
	if($("#bill_checkbox")[0].checked){
		node = new Bill(text, wallet);
	}else{
		node = new Node(text, wallet);
	}
	if(nodes.add(node)){
		alert_text("alert-success", language.alert_addnode_succ.replace("%s", node.name));
		clear_textnode();
		clear_textwallet();
		clear_checkbill();
		update_graph();
	}else{
		alert_text("alert-danger", language.alert_addnode_fail.replace("%s", node.name));
		clear_textnode();
		clear_textwallet();
	}
}
function editNode_onclick(){
	var text = document.getElementById('editselec').value;
	var value = get_textwalletedit();
	if(nodes.edit(text, value)){
		alert_text("alert-success", language.alert_editnode_succ.replace("%s", text));
		clear_textwalletedit();
		reset_selector('editselec');
		update_graph();
	}else{
		alert_text("alert-danger", language.alert_editnode_fail.replace("%s", value));
		clear_textwalletedit();
	}
}
function deleteNode_onclick(){
	var text = document.getElementById('delselec').value;
	nodes.delete(text);
	reset_selector('delselec');
	update_graph();
}
function update_onclick(){
	update_graph();
}
function clear_onclick(){
	nodes.delete_all();
	update_graph();
}
function addRel_onclick(){
	var nameA = document.getElementById('addrelselec1').value;
	var nameB = document.getElementById('addrelselec2').value;
	var value = get_textvalue();
	if(isNaN(Number(value))){
		alert_text("alert-danger", language.alert_addrel_fail1.replace("%s", value));
		clear_textvalue();
		return null;
	}
	var arc = new Arc(nameA, nameB, value);
	if(arc == null){
		alert_text("alert-danger", language.alert_addrel_fail2);
		return null;
	}
	arcs.add(arc);
	clear_textvalue();
	reset_selector('addrelselec1');
	reset_selector('addrelselec2');
	update_graph();
	alert_text("alert-success", language.alert_addrel_succ.replace("%s1", nameA).replace("%s2", nameB).replace("%s3", value));
}
function divRel_onclick(){
	if(document.getElementById('divrelselec1').selectedIndex == -1){
		return null;
	}
	if(document.getElementById('divrelselec2').selectedIndex == -1){
		return null;
	}
	var nameBill = document.getElementById('divrelselec1').value;
	var bill = nodes.get(nameBill);
	var nodesL = document.getElementById('divrelselec2').selectedOptions;
	var value = ceil_value(-bill.getWallet()/nodesL.length);
	console.log("namebill:",nameBill);
	console.log("bill:",bill);
	console.log("nodes:",nodesL);
	for(var i = 0; i<nodesL.length; i++){
		var nameB = nodesL[i].textContent;
		var arc = new Arc(nameB, nameBill, value);
		arcs.add(arc);
		console.log("nameB:",nameB);
		console.log("i:",i);
		console.log("value:",value);
		console.log("arc:",arc);
	}
	update_graph();
	reset_selector('divrelselec1');
	reset_selector('divrelselec2');
}
function delRel_onclick(){
	var nameA = document.getElementById('delarcselec1').value;
	var nameB = document.getElementById('delarcselec2').value;
	var key = gen_arc_key(nameA, nameB);
	arcs.delete(key);
	reset_selector('delarcselec1');
	reset_selector('delarcselec2');
	update_graph();
}
function resRel_onclick(){
	arcs.delete_all();
	update_graph();
}
