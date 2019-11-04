function loadDoc(name,value) {
    var data = {
        'request':name,
        'arg':value
    }
    rdata = JSON.parse(sendText(JSON.stringify(data), "/data/"))
    var mytable = document.createElement('table')
    var table_head = document.createElement('tr')
    var table_td = document.createElement('td')
    for
    table_td.innerHTML = "Name";
    table_head.appendChild(table_td)
}
function sendText(value,url) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      return this.responseText;
    }
  };
  xhttp.open("post", url, true);
  xhttp.setRequestHeader("Content-type", "text/plain");
  xhttp.send(value);
}