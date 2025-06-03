window.addEventListener("message", function (event) {
  if (event.data && event.data.iframeStyle) {
    console.log(event.data.iframeStyle);

    if (event.data.iframeStyle.iframeType === "login-button") {
      const iframes = document.querySelectorAll(".login-button-iframe");
      if (!iframes.length) return;

      iframes.forEach((iframe) => {
        iframe.style.height = event.data.iframeStyle.height + "px";
        iframe.style.width = event.data.iframeStyle.width + 1 + "px";
      });
    }

    // if (event.data.iframeStyle.iframeType === "login") {
    //   const iframes = document.querySelectorAll(".login-iframe");
    //   if (!iframes.length) return;

    //   iframes.forEach((iframe) => {
    //     iframe.style.height = event.data.iframeStyle.height + "px";
    //     iframe.style.width = event.data.iframeStyle.width + 1 + "px";
    //   });
    // }
  }
});
