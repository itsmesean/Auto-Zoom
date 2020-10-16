let meetings = {};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("bg");
  if (request.cmd === "START_TIMER") {
    let meetTime = Date.parse(request.when);
    let url = request.link;
    meetings[request.when] = url;

    setTimeout(() => {
      delete meetings[request.when];
      chrome.tabs.create({ url: url, active: true }, (tab) => {
        setTimeout(function () {
          chrome.tabs.remove(tab.id);
        }, 1500);
      });
    }, meetTime - Date.now());
    sendResponse(meetings);
  }

  if (request.cmd === "GET_MEETINGS") {
    sendResponse(meetings);
  }

  if (request.cmd === "REMOVE_ITEM") {
    delete meetings[request.id];
    sendResponse(meetings);
  }
});