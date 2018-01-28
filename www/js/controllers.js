angular.module('app.controllers', [])

.controller('page2Ctrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {

  $scope.labels = [];
  $scope.series = ['Total HASH/s'];
  $scope.data = [
    ['1']
  ];
  $scope.onClick = function (points, evt) {
    
  };
  $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
  $scope.options = {
    scales: {
      yAxes: [
        {
          id: 'y-axis-1',
          type: 'linear',
          display: true,
          position: 'left'
        }
      ]
    }
  };

  var cores = navigator.hardwareConcurrency||1;
  var thread = $('#thread');
  thread.text(cores);

  $('#increment').on('click',function(){
    cores++;
    $('#thread').text(cores);
  });

  $('#decrement').on('click',function(){
    if(cores == 1) return false;
    cores--;
    $('#thread').text(cores);
  });

  var host = 'zny.coiner.site'; //ここは
  var port = '19666';           //変更してください
  var user = $('#username').val();
  var pass = $('#password').val();

  var setdiff = function(work, diff){
    work['diff'] = diff;
    $('#message').text('Current difficulty: ' + diff);
  };

  var noncestr2int = function(noncestr){
    var x = parseInt(noncestr, 16);
    var y = ((x & 0x000000ff) << 24) |
            ((x & 0x0000ff00) << 8) |
            ((x & 0x00ff0000) >> 8) |
            ((x >> 24) & 0xff);
    return y;
  };

  var rarity = function(hashi){
    var rstr = 'n';
    if (hashi < 0x1000) {
      rstr = 'ur';
    }
    else if (hashi < 0x4000) {
      rstr = 'sr';
    }
    else if (hashi < 0x10000) {
      rstr = 'r';
    }
    else if (hashi < 0x40000) {
      rstr = 'nr';
    }
    rstr = '#rare_' + rstr;
    //$(rstr).show();
    var c = parseInt($(rstr + '_count').text());
    c++;
    $(rstr + '_count').text(c);
  };

  const workers = [];
  var ws = null;
  $('#start').click(function(){
    var worker = new Worker('js/em.js');
    $('#start').prop('disabled', true);
    $('#stop').prop('disabled', false);
    var auth = false;
    ws = new WebSocket('wss://zny.coiner.site/proxy');
    ws.onopen = function(ev) {
      $('.status').hide();
      $('#connected').show();

      var msg = {"id": 0, "method": "proxy.connect", "params": []};
      msg.params[0] = host;
      msg.params[1] = port;
      ws.send(JSON.stringify(msg) + "\n");

      auth = false;
      msg = {"id": 1, "method": "mining.subscribe", "params": []};
      var user_agent = 'webminer/0.1';
      var session_id = null;
      msg.params[0] = user_agent;
      if (session_id) {
        msg.params[1] = session_id;
      }
      ws.send(JSON.stringify(msg) + "\n");
    };
    ws.onclose = function(ev) {
      $('.status').hide();
      $('#disconnected').show();
    };
    var work = {};
    ws.onmessage = function(ev) {
      $('.status').hide();
      $('#message').show();
      var doauth = false;
      var json = JSON.parse(ev.data);
      var result = json.result;
      if (result) {
        var res0 = result[0];
        if (json.id == 1) {
          // for bunnymining.work
          var res00 = res0[0];
          if (res00 == 'mining.notify') {
            var sessionid = res0[1];
            var xnonce1 = result[1];
            var xnonce2len = result[2];
            work['sessionid'] = sessionid;
            work['xnonce1'] = xnonce1;
            work['xnonce2len'] = xnonce2len;
            doauth = true;
          }

          // for jp.lapool.me
          var res000 = res00[0];
          if (res000 == 'mining.set_difficulty') {
            var xnonce1 = result[1];
            var xnonce2len = result[2];
            work['xnonce1'] = xnonce1;
            work['xnonce2len'] = xnonce2len;
            doauth = true;
          }
        }
      }
      if (json.id == 4 && !json.method) {
        if (json.result) {
          $('#yay').show();
          var yc = parseInt($('#yaycount').text());
          yc++;
          $('#yaycount').text(yc);
        }
        else {
          $('#boo').show();
          var bc = parseInt($('#boocount').text());
          bc++;
          $('#boocount').text(bc);
        }
      }
      var method = json.method;
      var params = json.params;
      if (json.id == null) {
        if (method == 'mining.set_difficulty') {
          var diff = params[0];
          setdiff(work, diff);
        }
        else if (method == 'mining.notify') {
          work['jobid'] = params[0];
          work['prevhash'] = params[1];
          work['coinb1'] = params[2];
          work['coinb2'] = params[3];
          work['merkles'] = params[4];
          work['version'] = params[5];
          work['nbits'] = params[6];
          work['ntime'] = params[7];
          work['clean'] = params[8];
          for (var i = 0; i < cores; i++) {
            var worker = workers[i];
            if (worker) {
              worker.terminate();
            }
            worker = new Worker('js/em.js');
            var now = new Date();
            worker.startt = now.getTime();
            worker.startn = 0x10000000 * i;
            worker.coren = i;
            workers[i] = worker;
            worker.onmessage = function(e) {
              var result = e.data;
              var xnonce2 = result[0];
              var nonce = result[1];
              var hashstr = result[2];
              var hashi = noncestr2int(hashstr.substr(-8));
              rarity(hashi);
              var noncei = noncestr2int(nonce);
              var username = user;
              var msg = {"id": 4, "method": "mining.submit",
                "params": [username, work.jobid, xnonce2, work.ntime, nonce]
              };
              ws.send(JSON.stringify(msg) + "\n");
              var now = new Date();
              var endt = now.getTime();
              var difft = endt - this.startt;
              var diffn = noncei - this.startn;
              var speed = 1000.0*diffn/difft;
              $('#meter' + (this.coren + 1)).text(parseInt(speed));
              $scope.data[0].push(parseInt(speed));
              $scope.labels.push(parseInt($('#yaycount').text()))
              $scope.data = $scope.data.map(function (data) {
                return data.map(function (y) {
                  return parseInt(y < 0 ? 0 : y > 500 ? 500 : y);
                });
              });
              $scope.$apply();
              this.startt = endt;
              noncei++;
              work['nonce'] = noncei;
              this.startn = noncei;
              this.postMessage($.extend({}, work));
            }
          }
          //
          var threads = 2;
          for (var i = 0; i < threads; i++) {
            var worker = workers[i];
            work['nonce'] = 0x10000000 * i;
            worker.postMessage($.extend({}, work));
          }
        }
      }
      if (!auth && doauth) {
        auth = true;
        msg = {"id": 2, "method": "mining.authorize", "params": []};
        msg.params[0] = user;
        msg.params[1] = pass;
        ws.send(JSON.stringify(msg) + "\n");
      }
    };
    ws.onerror = function(ev) {
      $('.status').hide();
      $('#error').show();
      for (var i = 0; i < workers.length; i++) {
        var worker = workers[i];
        if (worker) {
          worker.postMessage('stop');
          workers[i] = null;
        }
      }
    };
    return false;
  });

  $('#stop').click(function(){
    ws.close();
    for (var i = 0; i < cores; i++) {
      var worker = workers[i];
      if (worker) {
        worker.terminate();
      }
    }
    $('#start').prop('disabled', false);
    $('#stop').prop('disabled', true);
    return false;
  });
}])