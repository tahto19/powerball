window.addEventListener("message", function (event) {
  if (event.data && event.data.iframeStyle) {
    console.log(event.data.iframeStyle);
    if (!document.getElementById("myIframe")) return;
    document.getElementById("myIframe").style.height =
      event.data.iframeStyle.height + "px";
    document.getElementById("myIframe").style.width =
      event.data.iframeStyle.width + 10 + "px";
  }
});
