let timerID;
let meetTime;
let url;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.cmd === 'START_TIMER') {
    meetTime = request.when;
    url = request.link;
    
     setTimeout(() => {
      chrome.tabs.create({ url: url })
    }, meetTime - Date.now());
  } 
});

// Make popup clickable on any url -- must be a better way to do this
chrome.runtime.onInstalled.addListener(function () {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({

      })],
      actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
});

