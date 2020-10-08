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



