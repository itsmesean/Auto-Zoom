import "../styles/popup.scss";

const submitMeeting = function () {
  let meetingTime = document.querySelector("#meeting-time").value;
  let meetingUrl = document.querySelector("#url-input").value;

  if (urlValidator(meetingUrl)) {
    chrome.runtime.sendMessage(
      {
        cmd: "START_TIMER",
        when: meetingTime,
        link: meetingUrl,
      },
      (res) => getMeetings()
    );
  } else {
    let alert = document.querySelector("#url-alert-text");
    alert.setAttribute("class", "flash");
    setTimeout(() => {
      alert.removeAttribute("class");
    }, 1400);
  }
};

const populate = function (items) {
  let meetingsList = document.querySelector("#meetings-list");
  meetingsList.innerHTML = ""

  for (let meeting in items) {
    let meetingLi = document.getElementById(`${meeting}`);
      let _id = meeting;
      let date = new Date(meeting);

      meetingsList.insertAdjacentHTML(
        "beforeend",
        `<div id=${_id} class="list-item ${items[meeting].new ? 'flash-added' : null}">
        <label  class="checkbox">
          <input id='checkbox' type="checkbox" ${items[meeting].checked ? 'checked' : null}/>
          <span></span>
        </label>
        <span>${formatDate(date)}</span>
        <a class="link" target="_blank" href="${items[meeting].url}"><img src="/assets/LogoMakr-4a7yZk.png"></a>
        <input type="image" id='remove-li' class="remove-li" src="/assets/LogoMakr-1epUwy.png" />
        </div>`
      );
      let alert = document.getElementById(`${_id}`);
      setTimeout(() => {
        alert.classList.remove("flash-added");
        chrome.runtime.sendMessage(
          { cmd: "REMOVE_FLASH", id: _id},
          function (response) {}
        );
      }, 500);
  }
};

const getMeetings = function () {
  chrome.runtime.sendMessage({ cmd: "GET_MEETINGS" }, function (response) {
    const ordered = {};
    if (response !== null) {
      Object.keys(response)
        .sort()
        .forEach(function (key) {
          ordered[key] = response[key];
        });
      populate(ordered);
    }
  });
};

/**
 * Event Listeners
 */

document.addEventListener("click", function (e) {
  if (e.target && e.target.id == "remove-li") {
    e.preventDefault();
    chrome.runtime.sendMessage(
      { cmd: "REMOVE_ITEM", id: e.target.parentElement.id },
      function (response) {}
    );
    let removedLi = document.getElementById(`${e.target.parentElement.id}`);
    removedLi.remove();
  }
});

document.addEventListener("click", function (e) {
  if (e.target && e.target.id == "submit-button") {
    e.preventDefault();
    submitMeeting();
  }
});

document.addEventListener( 'change', function(e) {
  if (e.target.id == "checkbox") {
    chrome.runtime.sendMessage(
      { cmd: "TOGGLE_ITEM", id: e.target.parentElement.parentElement.id, checked: e.target.checked },
      function (response) {}
    );
  } 
});
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if(request.cmd === 'REFRESH_LIST') {
    getMeetings();
    sendResponse(true);
  }
});

/**
 * Utils
 */

function toLocaleISOString(date = new Date()) {
  function pad(n) {
    return ("0" + n).substr(-2);
  }

  var day = [
      date.getFullYear(),
      pad(date.getMonth() + 1),
      pad(date.getDate()),
    ].join("-"),
    time = [date.getHours(), date.getMinutes()].map(pad).join(":");
  var o = date.getTimezoneOffset(),
    h = Math.floor(Math.abs(o) / 60),
    m = Math.abs(o) % 60,
    o = o == 0 ? "Z" : (o < 0 ? "+" : "-") + pad(h) + ":" + pad(m);
  let dtt = document.getElementById("meeting-time");
  dtt.value = day + "T" + time;
}

const formatDate = function (date) {
  const timeOptions = {
    hour12: true,
    hour: "numeric",
    minute: "2-digit",
  };

  const dateOptions = {
    month: "short",
    day: "numeric",
  };

  return date.toLocaleString("en-US", { ...timeOptions, ...dateOptions });
};

const urlValidator = function (url) {
  let regex = /^https:\/\/zoom\.us\/j\/\d{5,}/gm;
  return regex.test(url);
};

/**
 * Function calls
 */

// Set placeholder to current date/time
toLocaleISOString();
getMeetings();
