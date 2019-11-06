function loadModule(value) {
  var url = "/data/module/"+value;
  getData(url,insertForm);
}

function insertText(text) {
  document.getElementById("demo").innerHTML = text;
}

function loadHint(event) {
  var value = event.target.value;
  var url = "/data/module/like/"+value;
  getData(url, insertButton);
}

function insertButton(text) {
  var objdiv = document.getElementById("query_info");
  while(objdiv.firstChild) {
    objdiv.removeChild(objdiv.firstChild);
  }
  var data = JSON.parse(text);
  if (data) {
    var i;
    for (i in data) {
      tmp_button = document.createElement('input');
      tmp_button.type = 'button';
      tmp_button.className = 'button_hint';
      tmp_button.value = data[i];
      tmp_br = document.createElement('br');
      objdiv.appendChild(tmp_button);
      objdiv.appendChild(tmp_br);
    }
  }
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