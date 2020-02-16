import Utils from "../Utils.js"
import {nodes,arcs,ctx} from "../graph.js"
export default class NodeCollection {
    constructor() {
        this.content = {};
    }

    get length() {
        return this.keys().length; 
    }
    
    get keys() {
        return Object.keys(this.content);
    }
    get(name) {
        return this.content[name];
    }

    set(name, obj) {
        this.content[name] = obj;
    }

    add(node) {
        // Check if node exists
        if (Object.keys(this.content).indexOf(node.getName()) == -1) {
            this.content[node.getName()] = node;
            // Add in selectors UI
            var addarcoption1 = document.createElement("option");
            var addarcoption2 = document.createElement("option");
            var editoption = document.createElement("option");
            var deloption = document.createElement("option");
            var delarcoption1 = document.createElement("option");
            var delarcoption2 = document.createElement("option");
            addarcoption1.text = node.getName();
            addarcoption2.text = node.getName();
            editoption.text = node.getName();
            deloption.text = node.getName();
            delarcoption1.text = node.getName();
            delarcoption2.text = node.getName();
            document.getElementById("addrelselec1").add(addarcoption1);
            document.getElementById("addrelselec2").add(addarcoption2);
            document.getElementById("editselec").add(editoption);
            document.getElementById("delselec").add(deloption);
            document.getElementById("delarcselec1").add(delarcoption1);
            document.getElementById("delarcselec2").add(delarcoption2);
            // Bills selectors
            if (node.isbill) {
                var divreloption1 = document.createElement("option");
                divreloption1.text = node.getName();
                document.getElementById("divrelselec1").add(divreloption1);
            }
            else {
                var divreloption2 = document.createElement("option");
                divreloption2.text = node.getName();
                document.getElementById("divrelselec2").add(divreloption2);
            }
            reset_selector("addrelselec1");
            reset_selector("addrelselec2");
            reset_selector("divrelselec1");
            reset_selector("divrelselec2");
            reset_selector("editselec");
            reset_selector("delselec");
            reset_selector("delarcselec1");
            reset_selector("delarcselec2");
            console.log("Node \"", node.getName(), "\" created");
            return true;
        }
        else {
            console.log("Error, node \"", node.getName(), "\" exists");
            return false;
        }
    }
    
    edit(name, value) {
        var node = this.content[name];
        var list = arcs.get_from_node(name);
        console.log("edit Number(value): " + Number(value));
        if (isNaN(Number(value))) {
            return false;
        }
        else {
            value = Utils.round_value(Number(value));
        }
        node.setWallet(value);
        for (i in list) {
            if (name == list[i].nameA) {
                node.wallet = Utils.round_value(node.wallet - list[i].value);
            }
            else {
                if (name == list[i].nameB) {
                    node.wallet = Utils.round_value(node.wallet + list[i].value);
                }
            }
        }
        return true;
    }

    delete(name) {
        // var index;
        for (nameB in this.content) {
            if (name != nameB) {
                arcs.delete(Utils.gen_arc_key(name, nameB));
            }
        }
        if (nodes.get(name).isbill) {
            del_opt("divrelselec1", name);
            reset_selector("divrelselec1");
        }
        else {
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
        reset_selector("addrelselec1");
        reset_selector("addrelselec2");
        reset_selector("editselec");
        reset_selector("delselec");
        reset_selector("delarcselec1");
        reset_selector("delarcselec2");
    }

    delete_all() {
        for (name in this.content) {
            this.delete(name);
        }
    }
}