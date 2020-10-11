let meetings = {};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.cmd === "START_TIMER") {
    let meetTime = Date.parse(request.when);
    let url = request.link;
    meetings[request.when] = url;

    setTimeout(() => {
      delete meetings[request.when];
      chrome.tabs.create({ url: url, active: true }, (tab) => {
        setTimeout(function () {
          chrome.tabs.remove(tab.id);
        }, 1500);
      });
    }, meetTime - Date.now());
    sendResponse(meetings);
  }

  if (request.cmd === "GET_MEETINGS") {
    sendResponse(meetings);
  }

  if (request.cmd === "REMOVE_ITEM") {
    delete meetings[request.id];
    sendResponse(meetings);
  }
});

/**
 * Google calendar
 */

// formatGoogleCalendar.init({
//   calendarUrl:
//     "https://www.googleapis.com/calendar/v3/calendars/c_u4duk1akiid79g389ct0uls408@group.calendar.google.com/events?key=AIzaSyBpKwNWACBMVaviycc8chx-NbMbpzSxwuw",
//   past: false,
//   upcoming: true,
//   sameDayTimes: true,
//   dayNames: false,
//   pastTopN: -1,
//   upcomingTopN: 5,
//   recurringEvents: true,
//   itemsTagName: "li",
//   upcomingSelector: "#events-upcoming",
//   pastSelector: "#events-past",
//   upcomingHeading: "",
//   q: "zoom",
//   pastHeading: "<h2>Past events</h2>",
//   format: ["*date*", ": ", "*summary*", " — ", "*location*"],
//   timeMin: "2016-06-03T10:00:00-07:00",
//   timeMax: "2021-06-03T10:00:00-07:00",
// });
