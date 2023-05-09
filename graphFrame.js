
$("#graph")[0].width = $(window)[0].innerWidth;
$("#graph")[0].height = $(window)[0].innerHeight;
var imageNode;
var imageBill;
var imageArrow;
window.onload = function () {
	loadedNode = false;
	loadedArrow = false;
	loadedBill = false;

	imageNode = new Image();
	imageNode.src = "./images/node.PNG";
	imageNode.onload = function () {
		loadedNode = true;
		if (!(loadedNode && loadedArrow && loadedBill)) {
			console.log("loadednode:", loadedNode);
			console.log("loadedarrow:", loadedArrow);
			console.log("loadedbill:", loadedBill);
			return null;
		}
		console.log("image node loaded");
		load();
	};
	imageBill = new Image();
	imageBill.src = "./images/bill.PNG";
	imageBill.onload = function () {
		loadedBill = true;
		if (!(loadedNode && loadedArrow && loadedBill)) {
			console.log("loadednode:", loadedNode);
			console.log("loadedarrow:", loadedArrow);
			console.log("loadedbill:", loadedBill);
			return null;
		}
		console.log("image bill loaded");
		load();
	};
	imageArrow = new Image();
	imageArrow.src = "./images/arrow.PNG";
	imageArrow.onload = function () {
		loadedArrow = true;
		if (!(loadedNode && loadedArrow && loadedBill)) {
			console.log("loadednode:", loadedNode);
			console.log("loadedarrow:", loadedArrow);
			console.log("loadedbill:", loadedBill);
			return null;
		}
		console.log("image arrow loaded");
		load();
	};
};

function modalTransition(id1, id2) {
	$("#" + id1).modal("hide");
	$("#" + id2).modal("show");
}

// Node text functions
function get_textnode() {
	return document.getElementById('node_text').value;
}
function set_textnode(input) {
	document.getElementById('node_text').value = input;
}
function clear_textnode() {
	set_textnode("");
}

// Wallet text functions
function get_textwallet() {
	if (document.getElementById('wallet_text').value == "") {
		return "0";
	}
	return document.getElementById('wallet_text').value;
}
function set_textwallet(input) {
	document.getElementById('wallet_text').value = input;
}
function clear_textwallet() {
	set_textwallet("");
}

function get_textwalletedit() {
	if (document.getElementById('walletedit_text').value == "") {
		return "0";
	}
	return document.getElementById('walletedit_text').value;
}
function set_textwalletedit(input) {
	document.getElementById('walletedit_text').value = input;
}
function clear_textwalletedit() {
	set_textwalletedit("");
}

// Discount text functions
function get_textwalletdis() {
	if (document.getElementById('walletdis_text').value == "") {
		return "0";
	}
	return document.getElementById('walletdis_text').value;
}
function set_textwalletdis(input) {
	document.getElementById('walletdis_text').value = input;
}
function clear_textwalletdis() {
	set_textwalletdis("");
}

// Tax text functions
function get_textwallettax() {
	if (document.getElementById('wallettax_text').value == "") {
		return "0";
	}
	return document.getElementById('wallettax_text').value;
}
function set_textwallettax(input) {
	document.getElementById('wallettax_text').value = input;
}
function clear_textwallettax() {
	set_textwallettax("");
}

// Bill checkbox functions
function get_checkbill() {
	return document.getElementById("bill_checkbox").checked;
}

function set_checkbill(val) {
	document.getElementById("bill_checkbox").checked = val;
}

function clear_checkbill() {
	set_checkbill(false);
}

// Cant wallet functions
function get_textcant() {
	return document.getElementById('cant_text').value;
}

function set_textcant(val) {
	return document.getElementById('cant_text').value = val;
}

function clear_textcant() {
	set_textcant("1");
}

// Value text functions
function get_textvalue() {
	if (document.getElementById('textValue').value == "") {
		return "0";
	}
	return document.getElementById('textValue').value;
}
function set_textvalue(input) {
	document.getElementById('textValue').value = input;
}
function clear_textvalue() {
	set_textvalue("");
}

// Sector functions
function reset_selector(id) {
	document.getElementById(id).selectedIndex = -1;
}

function delete_children(id) {
	document.getElementById(id).innerHTML = '';
}

// Alert text
function alert_text(alertClass, text) {
	// return null;
	$("#alert").removeClass("alert-success");
	$("#alert").removeClass("alert-danger");
	$("#alert").addClass(alertClass);
	$("#alert div")[0].textContent = text;
	$("#alert").removeClass("hidden");
}

// UI functions
function alert_onclick() {
	$("#alert").removeClass("hidden");
	$("#alert").addClass("hidden");
	$("#alert").removeClass("alert-success");
	$("#alert").removeClass("alert-danger");
}

function share_onclick() {
	save();
}

function addNode_onclick() {
	var text = get_textnode();
	var wallet = (get_textwallet() * get_textcant()) * (1 - get_textwalletdis() / 100) * (1 + get_textwallettax() / 100);
	var node;
	if (get_checkbill()) {
		node = new Bill(text, wallet);
	} else {
		node = new Node(text, wallet);
	}
	if (nodes.add(node)) {
		alert_text("alert-success", language.alert_addnode_succ.replace("%s", node.name));
		clear_textnode();
		clear_textwallet();
		clear_checkbill();
		clear_textcant();
		clear_textwalletdis();
		clear_textwallettax();
		update_graph();
	} else {
		alert_text("alert-danger", language.alert_addnode_fail.replace("%s", node.name));
		clear_textnode();
		clear_textwallet();
	}
}
function editNode_onclick() {
	var text = document.getElementById('editselec').value;
	var value = get_textwalletedit();
	if (nodes.edit(text, value)) {
		alert_text("alert-success", language.alert_editnode_succ.replace("%s", text));
		clear_textwalletedit();
		reset_selector('editselec');
		update_graph();
	} else {
		alert_text("alert-danger", language.alert_editnode_fail.replace("%s", value));
		clear_textwalletedit();
	}
}
function deleteNode_onclick() {
	var text = document.getElementById('delselec').value;
	nodes.delete(text);
	reset_selector('delselec');
	update_graph();
}
function update_onclick() {
	update_graph();
}
function clear_onclick() {
	nodes.delete_all();
	update_graph();
}
function addRel_onclick() {
	var nameA = document.getElementById('addrelselec1').value;
	var nameB = document.getElementById('addrelselec2').value;
	var value = get_textvalue();
	if (isNaN(Number(value))) {
		alert_text("alert-danger", language.alert_addrel_fail1.replace("%s", value));
		clear_textvalue();
		return null;
	}
	var arc = new Arc(nameA, nameB, value);
	if (arc == null) {
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
function divrelrange_onchange() {
	delete_children('divrelranges');
	var rangeCont = document.getElementById('divrelranges');
	if (document.getElementById('divrelselec2').selectedIndex == -1) {
		return null;
	}
	var nodesL = document.getElementById('divrelselec2').selectedOptions;
	var value = ceil_value(100 / nodesL.length);
	for (var i = 0; i < nodesL.length; i++) {
		var nameB = nodesL[i].textContent;
		var range = document.createElement("input");
		range.setAttribute("type", "range");
		range.setAttribute("id", "divrel_" + nameB + "_range");
		range.setAttribute("name", nameB);
		range.setAttribute("min", 1);
		range.setAttribute("max", 101 - nodesL.length);
		range.onchange = function (event) {
			var range = event.target;
			var name = range.attributes["name"].value;
			var label = document.getElementById("divrel_" + name + "_label");
			label.textContent = name + ": " + range.value + "%";

			var rangeL = document.querySelectorAll('#divrelranges input');
			var suma = divrelranges_suma() - Number(range.value);
			var dueLeft = 100 - Number(range.value);
			console.log('dueLeft: ' + dueLeft);
			console.log('Suma: ' + suma);

			if (suma == 0) {
				return;
			}
			console.log('recorre lista: ');
			console.log(rangeL);
			for (var range of rangeL) {
				console.log('range: ' + range.attributes['name'].value);
				if (range.attributes['name'].value == name) {
					console.log('no se toca');
					continue;
				}
				console.log('Number(range.value)/suma: ' + (Number(range.value) / suma));
				var valueUpdated = (Number(range.value) / suma) * dueLeft;
				console.log('valueUpdated: ' + valueUpdated);
				divrelranges_update(range, valueUpdated);
			}
		};
		range.value = value;
		var txtrangeValue = document.createElement("p");
		txtrangeValue.setAttribute("id", "divrel_" + nameB + "_label");
		txtrangeValue.textContent = nameB + ": " + range.value + "%";

		rangeCont.append(range);
		rangeCont.append(txtrangeValue);
		/*
		console.log("nameB:",nameB);
		console.log("i:",i);
		console.log("value:",value);
		console.log("arc:",arc);
		*/
	}
}

function divrelranges_update(range, value) {
	if (value != null) {
		range.value = value;
	}
	var name = range.attributes["name"].value;
	var label = document.getElementById("divrel_" + name + "_label");
	label.textContent = name + ": " + range.value + "%";
}

function divrelranges_suma() {
	var sum = 0;
	var rangeL = document.querySelectorAll('#divrelranges input');
	for (var range of rangeL) {
		sum += Number(range.value);
	}
	return sum;
}

function divRel_onclick() {
	if (document.getElementById('divrelselec1').selectedIndex == -1) {
		return null;
	}
	if (document.getElementById('divrelselec2').selectedIndex == -1) {
		return null;
	}
	var nameBill = document.getElementById('divrelselec1').value;
	var bill = nodes.get(nameBill);
	var nodesL = document.getElementById('divrelselec2').selectedOptions;
	//var value = ceil_value(-bill.getWallet()/nodesL.length);
	console.log("namebill:", nameBill);
	console.log("bill:", bill);
	console.log("nodes:", nodesL);
	var suma = divrelranges_suma();
	var dueBill = -bill.getWallet();
	for (var i = 0; i < nodesL.length; i++) {
		var nameB = nodesL[i].textContent;
		var valueB = Number(document.getElementById("divrel_" + nameB + "_range").value);
		console.log("nameB: " + nameB);
		console.log("valueB: " + valueB);
		console.log("suma: " + suma);
		console.log("ceil_value(valueB/suma): " + ceil_value(valueB / suma));
		var value = ceil_value(dueBill * (valueB / suma));
		var arc = new Arc(nameB, nameBill, value);
		arcs.add(arc);
		console.log("nameB:", nameB);
		console.log("i:", i);
		console.log("value:", value);
		console.log("arc:", arc);
	}
	update_graph();
	reset_selector('divrelselec1');
	reset_selector('divrelselec2');
	delete_children('divrelranges');
}
function delRel_onclick() {
	var nameA = document.getElementById('delarcselec1').value;
	var nameB = document.getElementById('delarcselec2').value;
	var key = gen_arc_key(nameA, nameB);
	arcs.delete(key);
	reset_selector('delarcselec1');
	reset_selector('delarcselec2');
	update_graph();
}
function resRel_onclick() {
	arcs.delete_all();
	update_graph();
}
