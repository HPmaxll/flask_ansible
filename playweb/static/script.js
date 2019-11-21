function loadModule(name, fn) {
    if (!sessionStorage.getItem(name)) {
        getDataAndSave("/data/module/", name, fn);
    }
    else {
        var data = sessionStorage.getItem(name);
        fn(data);
    }
  }
  
function getDataAndSave(prefix, value, fn) {
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
    hidder('module_list');
    hidder('select_input');
    hidder('select_submit');
    popup('select_finish');
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
        
            tmp_button.onclick = para_click(para[i].parameter, para[i].description);
            tmp_button.ondblclick = para_dbclick(para[i].parameter);
            objdiv.appendChild(tmp_button);
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
  
function getData(url, fn, ...rest) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status == 200) {
                if (rest) {
                    fn(this.responseText, rest);
                }
                else {
                    fn(this.responseText);
                }
            }
            else {
                if (rest) {
                    fn(this.statusText, rest);
                }
                else {
                    fn(this.statusText);
                }
            }
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
    xhttp.send(JSON.stringify(data));
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
  
function deleChild(parent){
    var child =parent.childNodes;
    for (var i=0; i < child.length; i++) {
        if (child[i].hasChildNodes()) {
            deleChild(child[i]);
        }
        else {
            parent.removeChild(child[i])
        }
    }
}
  
function init_task() {
    list_1 = ["selected_opt", "module_list", "module_para", "desc_module", "desc_para"];
    for (var i in list_1) {
        clearChild(list_1[i]);
    }
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
  
function add_inv(data) {
    if(data) {
        var namelist = JSON.parse(data);
        var sel = document.getElementsByClassName('inv_sel');
        var i,j;
        for (i=0; i < sel.length; i++) {
            for (j=1; j < namelist.length; j++) {
                var opt = document.createElement('option');
                opt.value = namelist[j];
                opt.innerText = namelist[j];
                sel[i].appendChild(opt);
            }
        }    
    }
}
  
function add_grp(data) {
    if(data) {
        var namelist = JSON.parse(data);
        var sel = document.getElementsByClassName('grp_sel');
        var i,j;
        for (i=0; i < sel.length; i++) {
            for (j=1; j < namelist.length; j++) {
                var opt = document.createElement('option');
                opt.value = namelist[j];
                opt.innerText = namelist[j];
                sel[i].appendChild(opt);
            }
        }    
    }
}
  
function inv_change_1(inv, sel_id, keep_count, table_id) {
    var url = '/data/grps_of_inv/name/' + inv;
    getData(url, update_grp, sel_id, keep_count);
    var url_2 = '/data/hosts_of_inv_grp/' + inv + '/all';
    document.getElementById(sel_id).childNodes[1].selected = true;
    getData(url_2, update_table, table_id)
}

function inv_change_2(inv, id, keep_count) {
    var url = '/data/grps_of_inv/name/' + inv;
    getData(url, update_grp, id, keep_count);
}

function inv_change_3(inv, table_id) {
    var url = '/data/grps_of_inv/' + inv;
    getData(url, update_table, table_id)

}

function inv_change_4(inv, grp_id, table_id, keep_count) {
    var url = '/data/grps_of_inv/name/' + inv;
    getData(url, update_grp, grp_id, keep_count);
    var url_2 = '/data/hosts_of_inv_grp/' + inv + '/all';
    document.getElementById(grp_id).childNodes[1].selected = true;
    getData(url_2, update_table_2, table_id);
}

function inv_change_5(inv, table_id) {
    var url = '/data/grps_of_inv/' + inv;
    getData(url, update_table_2, table_id);

}

function grp_change(inv, grp, table_id) {
    var url = '/data/hosts_of_inv_grp/' + inv + '/' + grp;
    getData(url, update_table, table_id);
}

function grp_change_2(inv, grp, table_id) {
    var url = '/data/hosts_of_inv_grp/' + inv + '/' + grp;
    getData(url, update_table_2, table_id);
}

function update_table(data, arglist) {
    hostlist = JSON.parse(data);
    var table = document.getElementById(arglist[0]);
    var content= table.getElementsByTagName('tbody')[0];
    if(!content) {
        content = table;
    }
    var trlist = content.getElementsByClassName('table_content')
    while(trlist[0]) {
        deleChild(trlist[0]);
        trlist[0].parentNode.removeChild(trlist[0]);
    }
    for (var i=0; i< hostlist.length; i++) {
        var row = document.createElement('tr');
        row.className = 'table_content';
        var row_name = document.createElement('td');
        var checkbox = document.createElement('input');
        var node_id, start_point;
        switch(arglist[0][6]) {
            case 'i':
                node_id = 'i____' + hostlist[i][0];
                start_point = 0;
                break;
            case 'g':
                node_id = 'g_' + hostlist[i][0] + '____' + hostlist[i][1];
                start_point = 1;
                break;
            case 'h':
                node_id = 'h_' + hostlist[i][0] + '_' + hostlist[i][1] + '_' + hostlist[i][2];
                start_point = 2;
                break;
        }
        checkbox.id =  node_id
        checkbox.type = 'checkbox';
        var row_act = document.createElement('a');
        row_act.innerText = hostlist[i][start_point];
        row_act.href = 'javascript:void(0)';
        row_name.appendChild(checkbox);
        row_name.appendChild(row_act);
        row.appendChild(row_name);
        for (var j=start_point + 1; j< hostlist[i].length; j++) {
            var box = document.createElement('td');
            box.innerText = hostlist[i][j];
            row.appendChild(box);
        }
        var row_opt = document.createElement('td');
        var row_opt_1 = document.createElement('a');
        row_opt_1.href = 'javascript:void(0)';
        row_opt_1.innerText = 'Edit';
        row_opt_1.onclick = function () {
            return edit_row(event);
        }
        var row_opt_2 = document.createElement('a');
        row_opt_2.href = 'javascript:void(0)';
        row_opt_2.innerText = 'Remove';
        row_opt_2.onclick = function () {
            return remove_row(event);
        }
        row_opt.appendChild(row_opt_1);
        row_opt.appendChild(row_opt_2);
        row.appendChild(row_opt);
        content.appendChild(row);
    }
}

function update_table_2(data, arglist) {
    hostlist = JSON.parse(data);
    var table = document.getElementById(arglist[0]);
    var content= table.getElementsByTagName('tbody')[0];
    if(!content) {
        content = table;
    }
    var trlist = content.getElementsByClassName('table_content')
    while(trlist[0]) {
        deleChild(trlist[0]);
        trlist[0].parentNode.removeChild(trlist[0]);
    }
    for (var i=0; i< hostlist.length; i++) {
        var row = document.createElement('tr');
        row.className = 'table_content';
        var row_name = document.createElement('td');
        var checkbox = document.createElement('input');
        var node_id, start_point;
        switch(arglist[0][6]) {
            case 'i':
                node_id = 'i____' + hostlist[i][0];
                start_point = 0;
                break;
            case 'g':
                node_id = 'g_' + hostlist[i][0] + '____' + hostlist[i][1];
                start_point = 1;
                break;
            case 'h':
                node_id = 'h_' + hostlist[i][0] + '_' + hostlist[i][1] + '_' + hostlist[i][2];
                start_point = 2;
                break;
        }
        checkbox.id =  node_id
        checkbox.type = 'checkbox';
        checkbox.onchange = function(id) {
            return function () { row_status(id) };
        }(node_id);
        var text = document.createTextNode(hostlist[i][start_point]);
        row_name.appendChild(checkbox);
        row_name.appendChild(text);
        row.appendChild(row_name);
        for (var j=start_point + 1; j< hostlist[i].length; j++) {
            var box = document.createElement('td');
            box.innerText = hostlist[i][j];
            row.appendChild(box);
        }
        content.appendChild(row);
        if (collection.indexOf(checkbox.id) != -1) {
            checkbox.checked = true;
            row_check(checkbox.id);
        }
    }
}

function update_grp(data, arglist) {
    var namelist = JSON.parse(data);
    var sel = document.getElementById(arglist[0]);
    while (sel.childNodes[arglist[1]]) {
        sel.removeChild(sel.lastChild)
    }
    var i;
    for (i=1; i < namelist.length; i++) {
        var opt = document.createElement('option');
        opt.value = namelist[i];
        opt.innerText = namelist[i];
        sel.appendChild(opt);
    }    
}

function add_hosts() {
    var area = document.getElementById('popup_host');
    area.style.display = 'block';
}

function host_close() {
    hidder('popup_host');
}

function show_res(data) {
    document.getElementsByClassName('add_result')[0].innerText = data;
    if (data == 'success') {
        window.setTimeout(window.location.reload(), 1000)
    }
}

function show_res_2(data) {
    document.getElementById('remove_res').innerText = data;
}

function edit_row(event) {
    var row = event.target.parentNode.parentNode;
    var checkbox = row.getElementsByTagName('input')[0]
    console.log(checkbox.id);
}

let id_remove = '';

function remove_row(event) {
    popup('popup_remove');
    var row = event.target.parentNode.parentNode;
    var text = row.getElementsByTagName('a')[0].innerText;
    document.getElementById('remove_text').innerText = text;
    var checkbox = row.getElementsByTagName('input')[0]
    id_remove = checkbox.id
    console.log(id_remove);
    /* var data = {'id': checkbox.id};
    postData(data, '/inventory/del', show_res_2);
    popup('popup_res') */
}