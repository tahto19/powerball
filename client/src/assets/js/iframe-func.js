window.addEventListener("message", function (event) {
  if (event.data && event.data.iframeStyle) {
    console.log(event.data.iframeStyle);
    if (!document.getElementById("login-button-iframe")) return;
    document.getElementById("login-button-iframe").style.height =
      event.data.iframeStyle.height + "px";
    document.getElementById("login-button-iframe").style.width =
      event.data.iframeStyle.width + 10 + "px";
  }
});
