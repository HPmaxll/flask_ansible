function getData(prefix, value, fn) {
    var url = prefix + value;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status == 200) {
                sessionStorage.setItem(value, this.responseText);
                fn(this.responseText);
            }
            else {
                sessionStorage.setItem(value, this.statusText);
                fn(this.statusText);
            }
        }
    };
    xhttp.open("get", url, true);
    xhttp.send();
}

function insertText(text) {
    document.getElementById("display").innerHTML = text;
}

function loadModule(name) {
    if (!sessionStorage.getItem(name)) {
        getData("/data/module/", name, insertText);
    }
    else {
        var data = sessionStorage.getItem(name);
        insertText(data);
    }
}