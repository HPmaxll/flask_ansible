function popup(id){
    document.getElementById(id).style.display="block";
}
function hidder(id){
    document.getElementById(id).style.display="none";
}

function switchToImport() {
    document.getElementById("define").style.display="none";
    document.getElementById("import").style.display="block";
}

function switchToDefine() {
    document.getElementById("import").style.display="none";
    document.getElementById("define").style.display="block";
}
