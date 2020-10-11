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
        `<p id="url-alert">Please enter a valid Zoom link</p>`
      );
  }
};

const getMeetings = function () {
  chrome.runtime.sendMessage({ cmd: "GET_MEETINGS" }, function (response) {
    populate(response);
  });
};

const populate = function (items) {
  document.getElementById("meetings-list").innerHTML = "";

  for (meeting in items) {
    let date = new Date(meeting);
    let element = document.getElementById("meetings-list");

    element.insertAdjacentHTML(
      "afterbegin",
      `<div class="li-div" id=${meeting}>
        <li class="meeting-li" >
          ${formatDate(date)}</br>${items[meeting]}
        </li>
        <button id='remove-li'>X</button>
      </div>`
    );
  }
};

/**
 * Event Listeners
 */

document.addEventListener("click", function (e) {
  if (e.target && e.target.id == "submit-button") {
    e.preventDefault();
    submitMeeting();
  }
});

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

chrome.runtime.onStartup.addListener(getMeetings());

/**
 * Utils
 */

const formatDate = function (date) {
  const timeOptions = {
    hour12: true,
    hour: "numeric",
    minute: "2-digit",
  };

  const dateOptions = {
    weekday: "long",
    month: "long",
    day: "numeric",
  };

  return date.toLocaleString("en-US", { ...timeOptions, ...dateOptions });
};

const urlValidator = function (url) {
  let regex = /^https:\/\/zoom\.us\/j\/\d{5,}/gm;
  return regex.test(url);
};
