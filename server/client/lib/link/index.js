window.onload = function(d) {
    var iframe = document.createElement('iframe');
    win = iframe.contentWindow || iframe;
    iframe.style.border = 'none';
    iframe.style.height = '52px';
    iframe.style.width = '100%';
    iframe.style.position = 'absolute';
    iframe.style.top = '0';
    iframe.src = 'http://localhost:8080/cdn/link/link.html?token=' + window.parent.feedbackApp.widget;

    document.body.appendChild(iframe);
    createPusher();
  };
  
  function createPusher() {
    var pusher = document.createElement('div');
    win = pusher.contentWindow || pusher;
    pusher.style.border = 'none';
    pusher.style.height = '100px';//'52px';
    pusher.style.width = '100%';
    pusher.style.position = 'relative';
    pusher.style.flex = 'none';
    pusher.style.overflow = 'hidden';
    pusher.style.boxShadow = '0 1px 3px 2px rgba(0,0,0,.15)';
    document.body.insertBefore(pusher, document.body.firstChild);
  }