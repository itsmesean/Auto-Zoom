let meetings = {};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.cmd === "START_TIMER") {
    let meetTime = Date.parse(request.when);
    let url = request.link;

    // Set in local and sync
    meetings[request.when] = url;
    chrome.storage.sync.set({ meetings: meetings }, function () {
      sendResponse(true);
    });

    // Start countdown timer
    setTimeout(() => {
      delete meetings[request.when];
      chrome.storage.sync.set({ meetings: meetings }, function () {
        sendResponse(true);
      });

      chrome.tabs.create({ url: url, active: true }, (tab) => {
        setTimeout(function () {
          chrome.tabs.remove(tab.id);
        }, 1500);
      });
    }, meetTime - Date.now());
  }

  if (request.cmd === "GET_MEETINGS") {
    chrome.storage.sync.get("meetings", function (items) {
      sendResponse(items.meetings);
    });
  }

  if (request.cmd === "REMOVE_ITEM") {
    delete meetings[request.id];
    chrome.storage.sync.set({ meetings: meetings }, function () {
      sendResponse(true);
    });
  }
  return true;
});
