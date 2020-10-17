import "../styles/popup.scss";

const submitMeeting = function () {
  let meetingTime = document.querySelector('input[type="datetime-local"]');
  let meetingUrl = document.getElementById("url-input");

  if (urlValidator(meetingUrl.value)) {
    console.log("test");
    chrome.runtime.sendMessage({
      cmd: "START_TIMER",
      when: meetingTime.value,
      link: meetingUrl.value,
    });
    getMeetings();
  } else {
    document.querySelector("#url-alert-text").setAttribute("class", "flash");
    setTimeout(() => {
      document.querySelector("#url-alert-text").removeAttribute("class");
    }, 1400);
  }
};

const populate = function (items) {
  console.log("test3");
  document.getElementById("meetings-list").innerHTML = "";
  console.log("test4");
  console.log(items);
  for (let meeting in items) {
    let _id = meeting;
    let date = new Date(meeting);
    let element = document.getElementById("meetings-list");
    element.insertAdjacentHTML(
      "beforeend",
      `<div id=${_id} class="list-item">
      <span>${formatDate(date)}</span>
      <a target="_blank" href="${items[meeting]}">
      ${items[meeting].slice(8, -1)}</a>
      <input type="image" id='remove-li' class="remove-li" src="/assets/LogoMakr-1epUwy.png" />
      </div>`
    );
  }
};

const getMeetings = function () {
  chrome.runtime.sendMessage({ cmd: "GET_MEETINGS" }, function (response) {
    const ordered = {};
    Object.keys(response)
      .sort()
      .forEach(function (key) {
        ordered[key] = response[key];
      });
    populate(ordered);
  });
};
/**
 * Function calls
 */

// Set placeholder to current date/time
toLocaleISOString();

getMeetings();

/**
 * Event Listeners
 */

document.addEventListener("click", function (e) {
  if (e.target && e.target.id == "remove-li") {
    e.preventDefault();
    chrome.runtime.sendMessage(
      { cmd: "REMOVE_ITEM", id: e.target.parentElement.id },
      function (response) {
        getMeetings();
      }
    );
  }
});

document.addEventListener("click", function (e) {
  if (e.target && e.target.id == "submit-button") {
    e.preventDefault();
    submitMeeting();
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
