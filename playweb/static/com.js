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
  var objdiv = document.getElementById("module_list");
  while(objdiv.firstChild) {
    objdiv.removeChild(objdiv.firstChild);
  }
  var data = JSON.parse(text);
  if (data) {
    var i;
    for (i in data) {
      var tmp_button = document.createElement('input');
      tmp_button.type = 'button';
      tmp_button.className = 'button_hint';
      tmp_button.value = data[i];
      var tmp_br = document.createElement('br');
      objdiv.appendChild(tmp_button);
      objdiv.appendChild(tmp_br);
      tmp_button.onclick = (function(param){
          var childrenparam=param;
          return function() {
            objdiv.style.display = "none";
            clearChlid('define');
            updateText(childrenparam);
            generate_para(childrenparam);
          }
      })(data[i]); 
    }
  }
}

function clearChlid(id) {
  var objdiv = document.getElementById(id);
  while(objdiv.firstChild) {
    objdiv.removeChild(objdiv.firstChild);
  }
}

function updateText(text) {
  var objdiv = document.getElementById('define');
  var define_module = document.createElement('p');
  define_module.innerText = 'Module: ' + text;
  objdiv.appendChild(define_module);
}

function generate_para(module) {
  var url = "/data/module/" + module;
  getData(url, insertPara);
}

function insertPara(text) {
  var objdiv = document.getElementById('module_para');
  objdiv.style.display = "block";
  while(objdiv.firstChild) {
    objdiv.removeChild(objdiv.firstChild);
  }
  var data = JSON.parse(text);
  if (data) {
    var para = data.parameter;
    for (var i in para) {
      var tmp_button = document.createElement('input');
      tmp_button.type = 'button';
      tmp_button.className = 'button_hint';
      tmp_button.value = para[i].parameter;
      var tmp_br = document.createElement('br');
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