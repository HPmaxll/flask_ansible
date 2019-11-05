function loadModule(value) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      insertText(this.responseText);
    }
    else {
      insertText('loading...');
    }
  };
  xhttp.open("get", "/data/module/"+value, true);
  xhttp.send();
}

function insertText(text) {
  document.getElementById("demo").innerHTML = text;
}