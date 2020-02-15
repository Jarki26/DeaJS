var language; 
function getLanguage() {
    (localStorage.getItem('language') == null) ? setLanguage('es') : false;
    $.ajax({ 
        url:  './language/' +  localStorage.getItem('language') + '.json', 
        dataType: 'json', async: false, dataType: 'json', 
        success: function (lang) { language = lang } 
    });
}

function setLanguage(lang) {
    localStorage.setItem('language', lang);
}

function translate(){
    $('#menu h4')[0].innerText = language.menu;

    // Menu buttons
    $('#button-addnode')[0].innerText = language.menu_addnode;
    $('#button-editnode')[0].innerText = language.menu_editnode;
    $('#button-rennode')[0].innerText = language.menu_rennode;
    $('#button-delnode')[0].innerText = language.menu_delnode;
    $('#button-update')[0].innerText = language.menu_update;
    $('#button-clear')[0].innerText = language.menu_clear;
    $('#button-addrel')[0].innerText = language.menu_addrel;
    $('#button-divrel')[0].innerText = language.menu_divrel;
    $('#button-delrel')[0].innerText = language.menu_delrel;
    $('#button-reset')[0].innerText = language.menu_reset;

    // Modals
    $("#menu-addnode h4")[0].innerText = language.menu_addnode;
    $("#menu-addnode label")[0].innerText = language.menu_addnode_name;
    $("#menu-addnode label")[1].innerText = language.menu_addnode_wallet;
    $("#menu-addnode label")[2].childNodes[1].textContent = language.menu_addnode_isbill;
    $("#menu-editnode h4")[0].innerText = language.menu_editnode;
    $("#menu-editnode label")[0].innerText = language.menu_delnode_node;
    $("#menu-editnode label")[1].innerText = language.menu_addnode_wallet;
    $("#menu-delnode h4")[0].innerText = language.menu_delnode;
    $("#menu-delnode label")[0].innerText = language.menu_delnode_node;
    $("#menu-addrel h4")[0].innerText = language.menu_addrel;
    $("#menu-addrel label")[0].innerText = language.menu_rel_to;
    $("#menu-addrel label")[1].innerText = language.menu_rel_from;
    $("#menu-addrel label")[2].innerText = language.menu_rel_value;
    $("#menu-divrel h4")[0].innerText = language.menu_divrel;
    $("#menu-divrel label")[0].innerText = language.menu_divrel_bill;
    $("#menu-divrel label")[1].innerText = language.menu_divrel_nodes;
    $("#menu-delrel h4")[0].innerText = language.menu_delrel;
    $("#menu-delrel label")[0].innerText = language.menu_rel_to;
    $("#menu-delrel label")[1].innerText = language.menu_rel_from;


    // Modal footer
    var okButtons = $(".modal-footer .btn-success")
    for(button in okButtons){
        okButtons[button].innerText = language.menu_ok;
    }
    var cancelButtons = $(".modal-footer .btn-default")
    for(button in cancelButtons){
        cancelButtons[button].innerText = language.menu_cancel;
    }
}

setLanguage('es');
getLanguage();
// Load text from selected language
$(document).ready(function(){
    translate();
});