function loadModule(value) {
  var data = {
      'arg':value
  }
  sendText(JSON.stringify(data), "/data/module")
}

function sendText(value,url) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      insertText(this.responseText);
    }
  };
  xhttp.open("POST", url, true);
  xhttp.setRequestHeader("Content-type", "Application/JSON");
  xhttp.send(value);
}

function insertText(text) {
  document.getElementById("demo").innerHTML = text;
}

function insertForm(text) {
  
}