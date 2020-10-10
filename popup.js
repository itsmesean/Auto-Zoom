const submitMeeting = function () {
  let inputTime = document.querySelector('input[type="datetime-local"]');
  let url = document.getElementById("url-input");
  let alert = document.getElementById("url-alert");
  alert ? alert.remove() : null;

  if (urlValidator(url.value)) {
    chrome.runtime.sendMessage({
      cmd: "START_TIMER",
      when: inputTime.value,
      link: url.value,
    });
    getMeetings();
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
      `<li 
        class="meeting-li" 
        id=${meeting}>
        ${formatDate(date)}  
        ${items[meeting]}
        <button id='remove-li'>X</button>
      </li>`
    );
  }
};

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

document.getElementById("submit-button").onclick = function (e) {
  e.preventDefault();
  submitMeeting();
};

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
