function get_inv() {
    var url = '/data/server/all_inv';
    getData(url, add_select);
} 
  
function add_select(data) {
    if(data) {
        var namelist = JSON.parse(data);
        var sel = document.getElementById('inv_sel');
        var i;
        for (i=1; i < namelist.length;i++) {
            var opt = document.createElement('option');
            opt.value = namelist[i];
            opt.innerText = namelist[i];
            sel.appendChild(opt);
        }
    }
}

function showvalue() {
    var sel = document.getElementById('inv_sel');
    var index = sel.selectedIndex;
    var val = sel.options[index].value;
    document.getElementById('display').innerText = val;
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