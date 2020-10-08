
  const timeChecker = function() {
    let inputTime = document.querySelector('input[type="datetime-local"]');
    let url = document.getElementById('url-input').value;
    console.log(url)
    let meetTime = Date.parse(inputTime.value)
    startTime(meetTime, url)
  }
  
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.cmd === 'DONE') {
      window.location = request.link
    } 
  });

document.getElementById("submit-button").onclick = function() {timeChecker()};

function startTime(time, url) {
  chrome.runtime.sendMessage({ cmd: 'START_TIMER', when: time, link: url });
}

