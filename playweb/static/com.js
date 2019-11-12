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
  if (data.length) {
    objdiv.parentNode.style.display = "block";
    var i;
    for (i in data) {
      var tmp_button = document.createElement('input');
      tmp_button.type = 'button';
      tmp_button.className = 'button_hint';
      tmp_button.value = data[i];
      tmp_button.id = data[i];
      tmp_button.onclick = mod_click(data[i]);
      tmp_button.ondblclick = mod_dbclick(data[i]);
      objdiv.appendChild(tmp_button);
    }
  }
  else {
    objdiv.parentNode.style.display = "none";
  }
}

function updateText(text) {
  document.getElementById('module_list').style.display = "none";
  document.getElementById('select_input').style.display = "none";
  document.getElementById('select_submit').style.display = "none";
  document.getElementById('select_finish').style.display = "block";
  var objdiv = document.getElementById('select_before');
  var mod = document.getElementById(text);
  mod.className = 'selected_module';
  mod.title = "Double click to remove.";
  objdiv.insertBefore(mod, document.getElementById('select_finish'));
  document.getElementById('select_before').id = 'select_after'
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
    if (document.getElementById(name).parentNode.id == "module_list") {
      updateText(name);
      loadModule(name, insertPara);
    }
    else {
      var mod = document.getElementById(name);
      mod.className = "button_hint";
      mod.removeAttribute("title");
      document.getElementById("module_list").appendChild(mod);
      document.getElementById("select_after").id = "select_before";
      clearChild("selected_opt");
      clearChild("desc_module");
      clearChild("desc_para");
      popup('module_list');
      popup('select_input');
      popup('select_submit');
      hidder('select_finish');
      hidder("module_para");
      hidder('selected_opt');
      hidder("desc_module");
      hidder("desc_para");
    }
  }
}

function mod_submit(name) {
  if (name) {
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
}

function mod_add() {
  var objdiv = document.getElementById("selected_opt");
  var divlist = objdiv.childNodes;
  var opt, value;
  var selected_module = document.getElementsByClassName("selected_module")[0].value;
  var arglist = [];
  var tasklist = {};
  var i;
  for (i=0;i<divlist.length;i++) {
    var tmp = {};
    opt = divlist[i].childNodes[0].id;
    value = divlist[i].childNodes[2].value;
    tmp[opt] = value;
    arglist.push(tmp);
  }
  tasklist['module'] = selected_module;
  tasklist['args'] = arglist;
  document.getElementById("desc_para").innerText = JSON.stringify(tasklist);
}

function loadModuleDesc(data) {
  var module = JSON.parse(data);
  if (module) {
    var div = document.getElementById('desc_module');
    if (!div.firstChild) {
      div.style.display = "block";
    }
    document.getElementById('module_name').value = module.module;
    div.innerText = module.module + ":\n" + module.description;
  }
}

function para_click(para, desc) {
  return function() {
    var div = document.getElementById('desc_para');
    if (!div.firstChild) {
      div.style.display = "block";
    }
    div.innerText = para + ':\n' + desc;
  }
}

function para_dbclick(parameter) {
  return function() {
    var para = document.getElementById(parameter);
    var objdiv = document.getElementById('selected_opt');
    if (para.parentNode.id == 'module_para') {
      if (!objdiv.firstChild) {
        objdiv.style.display = "block";
      }
      var subdiv = document.createElement('div');
      subdiv.id = parameter + '_div';
      subdiv.className = 'parameter_div';
      var box = document.createElement('input');
      var br = document.createElement('br');
      box.type = 'text';
      box.id = parameter + '_value';
      para.className = 'parameter_button';
      para.title = "Double click to remove.";
      subdiv.appendChild(para);
      subdiv.appendChild(br);
      subdiv.appendChild(box);
      objdiv.appendChild(subdiv);
    }
    else {
      para.className = 'button_hint';
      para.removeAttribute('title');
      document.getElementById('module_para').appendChild(para);
      var subdiv = document.getElementById(parameter + '_div');
      while (subdiv.firstChild) {
        subdiv.removeChild(subdiv.firstChild)
      }
      objdiv.removeChild(subdiv);
      if (!objdiv.firstChild) {
        objdiv.style.display = "none";
      }
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

function popup(id){
  document.getElementById(id).style.display="block";
}
function hidder(id){
  document.getElementById(id).style.display="none";
}
function task_close() {
  init_task();
  hidder("popup_task");
}

function clearChild(div) {
  var tmp = document.getElementById(div)
  while(tmp.firstChild) {
      tmp.removeChild(tmp.firstChild)
  }
}

function init_task() {
  clearChild("selected_opt");
  clearChild("module_list");
  clearChild("module_para")
  clearChild("desc_module");
  clearChild("desc_para");
  var mod = document.getElementsByClassName("selected_module")[0];
  if (mod) {
      mod.parentNode.removeChild(mod);
  }
  if (document.getElementById("select_after")) {
      document.getElementById("select_after").id = "select_before";
  }
  document.getElementById('module_name').value = null;
  popup('module_list');
  popup('select_input');
  popup('select_submit');
  hidder('select_finish');
  hidder("module_para");
  hidder('selected_opt');
  hidder("module_detail");
  hidder("desc_module");
  hidder("desc_para");
}