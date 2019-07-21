window.onload = function(d) {
  var iframe = document.createElement('iframe');
  win = iframe.contentWindow || iframe;
  iframe.style.border = 'none';
  iframe.style.height = '250px';
  iframe.style.width = '250px';
  iframe.style.position = 'absolute';
  iframe.style.top = '0';
  iframe.style.bottom = '0';
  iframe.style.margin = 'auto';
  iframe.src = 'http://localhost:8080/cdn/app.html?token=' + window.parent.feedbackApp.widget;
  document.body.appendChild(iframe);
};
