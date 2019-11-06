function loadModule(value) {
  var url = "/data/module/"+value;
  getData(url,insertForm);
}

function insertText(text) {
  document.getElementById("demo").innerHTML = text;
}
function insertForm(text) {
  var objdiv = document.getElementById("module_detail");
  while(objdiv.firstChild) {
    objdiv.removeChild(objdiv.firstChild);
  }
  var desc = document.createElement("p");
  var data = JSON.parse(text);
  if (data) {
    desc.innerText = data.description;
  }
  else {
    desc.innerText = "loading..."
  }
  objdiv.appendChild(desc);
}

function getData(url,fn) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      fn(this.responseText);
    }
    else {
      fn(this.status);
    }
  };
  xhttp.open("get", url, true);
  xhttp.send();
}

function postData(data,url,fn) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      fn(this.responseText);
    }
    else {
      fn(this.status);
    }
  }
  xhttp.open("post", url, true);
  xhttp.setRequestHeader("Content-type", "Application/JSON");
  xhttp.send(data);
}