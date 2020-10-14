const submitMeeting = function () {
  let meetingTime = document.querySelector('input[type="datetime-local"]');
  let meetingUrl = document.getElementById("url-input");
  let urlFormatAlert = document.getElementById("url-alert");

  urlFormatAlert ? urlFormatAlert.remove() : null;

  if (urlValidator(meetingUrl.value)) {
    chrome.runtime.sendMessage(
      {
        cmd: "START_TIMER",
        when: meetingTime.value,
        link: meetingUrl.value,
      },
      function (response) {
        populate(response);
      }
    );
  } else {
    document
      .getElementById("url-alert-div")
      .insertAdjacentHTML(
        "afterbegin",
        `<p class="url-alert">Please enter a valid Zoom link</p>`
      );
  }
};

const populate = function (items) {
  document.getElementById("meetings-list").innerHTML = "";
  for (meeting in items) {
    let _id = meeting;
    let date = new Date(meeting);
    let element = document.getElementById("meetings-list");

    element.insertAdjacentHTML(
      "afterbegin",
      `<div id=${_id} class=" text-list__textbox">
      <span>${formatDate(date)}</span>
      <a target="_blank" href="${items[meeting]}">
      ${items[meeting].slice(8, -1)}</a>
      <input type="image" id='remove-li' class="remove-li" src="../images/LogoMakr-1epUwy.png" />
      </div>`
    );
  }
};

const getMeetings = function () {
  chrome.runtime.sendMessage({ cmd: "GET_MEETINGS" }, function (response) {
    populate(response);
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
        populate(response);
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
