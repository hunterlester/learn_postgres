var results = [];

function apiRequest(method, endpoint) {
  var elements = document.getElementsByTagName('input');
  var dataArray = [];
  Array.prototype.map.call(elements, function(elem) {
    dataArray.push(elem.value);
  });

  var dataObj = {};
  dataObj.breed = dataArray[0];
  dataObj.name = dataArray[1];
  dataObj.purchase_date = dataArray[2];

  var body = Object.keys(dataObj).map(function(key) {
    return key + "=" + dataObj[key];
  }).join('&');

  return fetch(endpoint, {
    method: method,
    body: body,
    headers: {
      'Content-Type':'application/x-www-form-urlencoded'
    }
  })
  .then(checkStatus)
  .then(function(res) {
    results = res;
    appendData(res);
  })
}

function checkStatus(response) {
  if(response.status >= 200 && response.status < 300) {
    return response.json();
  } else {
    return response.json()
      .then(function(err) {
        console.log(err);
      });
    // var error = new Error(response.statusText)
    // error.response = response;
    // throw error;
  }
}


function appendData(data) {
   var table_body = document.getElementById('tbody');
   data.map(function(datum) {
     var tr = document.createElement('tr');
     table_body.appendChild(tr);
     Object.keys(datum).filter(function(key) {
       if(key !== "id") {
         return key;
       }
     }).map(function(key) {
       var td = document.createElement('td');
       td.textContent = datum[key];
       tr.appendChild(td);
     });
   });
}
