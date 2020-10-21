let meetings = {};

chrome.alarms.onAlarm.addListener(function (time) {
  console.log(time.name);
  chrome.tabs.create({ url: meetings[time.name], active: true }, (tab) => {
    setTimeout(function () {
      chrome.tabs.remove(tab.id);
    }, 1500);
  });
  chrome.alarms.clear(time.name);
  delete meetings[time.name];
  chrome.storage.sync.set({ meetings: meetings }, function () {});
  chrome.runtime.sendMessage(
    { cmd: "REFRESH_LIST" },
    function (response) {}
  );
});

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
    chrome.alarms.create(request.when, { when: meetTime });
  }

  if (request.cmd === "GET_MEETINGS") {
    chrome.storage.sync.get("meetings", function (items) {
      sendResponse(items.meetings);
    });
  }

  if (request.cmd === "REMOVE_ITEM") {
    delete meetings[request.id];
    chrome.alarms.clear(request.id);
    chrome.storage.sync.set({ meetings: meetings }, function () {
      sendResponse(true);
    });
  }
  if (request.cmd === "REMOVE_FLASH") {
    meetings[request.id].new = false
    chrome.storage.sync.set({ meetings: meetings }, function () {
      sendResponse(true);
    });
  }
  return true;
});
