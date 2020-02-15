function save() {
    var obj = {
        "users":[],
        "dues":[]
    };
    if(nodes.length() == 0){
        return window.location.origin + window.location.pathname;
    }
    for(i in nodes.content){
        var obji = {
            "name":nodes.content[i].name, 
            "wallet":nodes.content[i].wallet
            
        };
        if(nodes.content[i].isbill){
            obji.isbill = 1;
        }
        obj.users[obj.users.length] = obji;
        // obj.users[i].name = nodes.content[i].name;
        // obj.users[i].wallet = nodes.content[i].wallet;
    }
    for(i in arcs.content){
        var obji = {
            "nameA":arcs.content[i].nameA,
            "nameB":arcs.content[i].nameB,
            "value":arcs.content[i].value,
        };
        obj.dues[obj.dues.length] = obji;
    }
    var url = window.location.origin + window.location.pathname +"?data=" + encodeURIComponent(JSON.stringify(obj));
    //url='http://jarki26.com/shorten?url='+encodeURIComponent(url);
    //var request = new XMLHttpRequest();
    // request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    //request.onreadystatechange = function() {
    //    if(request.readyState == 4 && request.status == 201) {
    //        save_cb(request.responseText);
    //    }
    //}
    //request.open("POST", url, true);
    //request.send();
    // return url2;
    save_cb(url);
}

function save_cb(item){
    document.getElementById("share-url").value = item;
    $('.modal').modal('hide');
    $('#share').modal('show');
}

function load(){
    var urlobj = new URL(window.location.href);
    var jsonstring = urlobj.searchParams.get("data");
    if(jsonstring == null){
        return null;
    }
    jsonObj = JSON.parse(jsonstring);
    nodes.delete_all();
    loadNodes(jsonObj.users);
    loadArcs(jsonObj.dues);
    update_graph();
}

function loadNodes(list){
    var node;
    for(i in list){
        if(list[i].isbill){
            node = new Bill(list[i].name, -list[i].wallet);
        }else{
            node = new Node(list[i].name, list[i].wallet);
        }
        nodes.add(node);
    }
}

function loadArcs(list){
    for(i in list){
        // var nodeA = nodes.get(list[i].nodeA.name);
        // var nodeB = nodes.get(list[i].nodeB.name);
        var arc = new Arc(list[i].nameA, list[i].nameB, list[i].value);
        console.log(arc);
        arcs.content[arc.key] = arc;
    }
}