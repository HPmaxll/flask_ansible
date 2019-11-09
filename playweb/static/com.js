function loadModule(name, fn) {
  if (!sessionStorage.getItem(name)) {
      getModuleData("/data/module/", name, fn);
  }
  else {
      var data = sessionStorage.getItem(name);
      fn(data);
  }
}

function getModuleData(prefix, value, fn) {
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
        return function() {
          if (!sessionStorage.getItem(param)) {
            var url = "/data/module/" + param;
            getData(url,loadModuleDesc);
          }
          else {
            var data = sessionStorage.getItem(param);
            loadModuleDesc(data);
          }
          
        }
      })(data[i]);

      tmp_button.ondblclick = (function(param){
          return function() {
            updateText(param);
            loadModule(param, insertPara);
          }
      })(data[i]); 
    }
  }
}

function loadModuleDesc(data) {
  var module = JSON.parse(data);
  document.getElementById('desc_module').innerText = module.module + "\n" + module.description;
}

function updateText(text) {
  document.getElementById('module_list').style.display = "none";
  var objdiv = document.getElementById('define');
  while(objdiv.firstChild) {
    objdiv.removeChild(objdiv.firstChild);
  }
  var define_module = document.createElement('p');
  define_module.innerText = 'Module: ' + text;
  objdiv.appendChild(define_module);
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
      tmp_button.onclick = para_click(para[i].description);
      tmp_button.ondblclick = para_dbclick(para[i].parameter);
      objdiv.appendChild(tmp_button);
      objdiv.appendChild(tmp_br);
    }
  }
}

function para_click(desc) {
  return function() {
    document.getElementById('desc_para').innerText = desc;
  }
}

function para_dbclick(parameter) {
  return function() {
    var objdiv = document.getElementById('define');
    var para = document.createElement('p');
    para.innerText = parameter;
    objdiv.appendChild(para);
  }
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