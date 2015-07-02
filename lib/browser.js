/*global document, location, navigator, SixSpeed, XMLHttpRequest */
var log = document.createElement('pre');
document.body.appendChild(log);

var grep = location.hash.replace(/^#/, ''),
    vms = {};
SixSpeed.bench({
  grep: grep,
  log: function(message) {
    log.appendChild(document.createTextNode(message + '\n'));
  },
  testDone: function() {
    // Sending this frequently, the data store will handle deduping, etc.
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {};
    request.open('POST', '/log', true);
    request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    request.send('browser=' + encodeURIComponent(navigator.userAgent) + '&data=' + encodeURIComponent(JSON.stringify(SixSpeed.stats)));
  },
  done: function() {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {};
    request.open('POST', '/done', true);
    request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    request.send();
  },

  runTest: function(name, type, complete) {
    function doIt() {
      SixSpeed.benchTest(name, type, function(result) {
        complete(result);
      });
    }

    var vm = vms[type];
    if (!vm) {
      vm = vms[type] = document.createElement('iframe');
      vm.src = type + '.html';
      vm.onload = function() {
        doIt();
        vm.onload = undefined;
      };
      document.body.appendChild(vm);
    } else {
      doIt();
    }
  }
});