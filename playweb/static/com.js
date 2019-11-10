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
      tmp_button.onclick = mod_click(data[i]);
      tmp_button.ondblclick = mod_dbclick(data[i]); 
      var tmp_br = document.createElement('br');
      objdiv.appendChild(tmp_button);
      objdiv.appendChild(tmp_br); 
    }
  }
}

function updateText(text) {
  document.getElementById('module_list').style.display = "none";
  var objdiv = document.getElementById('selected_name');
  while(objdiv.firstChild) {
    objdiv.removeChild(objdiv.firstChild);
  }
  var define_module = document.createElement('p');
  define_module.innerText = 'Module: ' + text;
  var define_finish = document.createElement('input');
  define_finish.value = 'OK';
  define_finish.id = 'define_finish';
  define_finish.type = 'button';
  
  objdiv.appendChild(define_module);
  objdiv.appendChild(define_finish);
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
      tmp_button.id = para[i].parameter
     // var tmp_br = document.createElement('br');
      tmp_button.onclick = para_click(para[i].parameter, para[i].description);
      tmp_button.ondblclick = para_dbclick(para[i].parameter);
      objdiv.appendChild(tmp_button);
     // objdiv.appendChild(tmp_br);
    }
  }
}

function mod_click(name) {
  return function() {
    if (!sessionStorage.getItem(name)) {
      var url = "/data/module/" + name;
      getData(url,loadModuleDesc);
    }
    else {
      var data = sessionStorage.getItem(name);
      loadModuleDesc(data);
    }
  }
}

function mod_dbclick(name) {
  return function() {
    updateText(name);
    loadModule(name, insertPara);
  }
}

function mod_submit(name) {
  if (!sessionStorage.getItem(name)) {
    var url = "/data/module/" + name;
    getData(url,loadModuleDesc);
  }
  else {
    var data = sessionStorage.getItem(name);
    loadModuleDesc(data);
  }
  updateText(name);
  loadModule(name, insertPara);
}

function loadModuleDesc(data) {
  var module = JSON.parse(data);
  if (module) {
    document.getElementById('desc_module').innerText = module.module + ":\n" + module.description;
  }
}

function para_click(para, desc) {
  return function() {
    document.getElementById('desc_para').innerText = para + ':\n' + desc;
  }
}

function para_dbclick(parameter) {
  return function() {
    var para = document.getElementById(parameter);
    if (para.parentNode.id == 'module_para') {
      var objdiv = document.getElementById('selected_name');
      var subdiv = document.createElement('div');
      subdiv.id = parameter + '_div';
      subdiv.className = 'parameter_div';
      var box = document.createElement('input');
      var br = document.createElement('br');
      box.type = 'text';
      box.id = parameter + '_value';
      para.className = 'parameter_button';
      subdiv.appendChild(para);
      subdiv.appendChild(br);
      subdiv.appendChild(box);
      objdiv.insertBefore(subdiv, document.getElementById('define_finish'));
    }
    else {
      para.className = 'button_hint';
      document.getElementById('module_para').appendChild(para);
      var subdiv = document.getElementById(parameter + '_div');
      while (subdiv.firstChild) {
        subdiv.removeChild(subdiv.firstChild)
      }
      subdiv.parentNode.removeChild(subdiv);
    }
    
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

function nothing() {
  //pass;
}