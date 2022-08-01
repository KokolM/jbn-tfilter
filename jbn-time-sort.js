
function isLive(diff, duration) {
  return diff <= 0 && diff + duration >= 0;
}

function isFuture(diff, duration) {
  return isLive(diff, duration) || diff > 0;
}

function isPast(diff, duration) {
  return diff + duration < 0;
}

function setTargets(item) {
  var targets = item.querySelectorAll("[jbn-tfilter-display]");
  var i = 0;
  for (i = 0; i < targets.length; i++) {
    var target = targets[i];
    var display = target.getAttribute("jbn-tfilter-display");
    target.style.display = display;
  }
}

function setLiveTargets(item, hide) {
  var targets = item.querySelectorAll("[jbn-tfilter-display-live]");
  var i = 0;
  for (i = 0; i < targets.length; i++) {
    var target = targets[i];
    var display = target.getAttribute("jbn-tfilter-display-live");
    target.style.display = hide ? "none": display;
  }
}

function validateTimeStamp(item, range, defaultDuration) {
  var date = item.querySelector('[jbn-tfilter-element="date"]');
  var time = item.querySelector('[jbn-tfilter-element="time"]');
  var duration = parseInt(item.querySelector('[jbn-tfilter-element="duration"]')?.innerText) || defaultDuration;
  if (date && time) {
    var itemDate = moment(date.innerText + " " + time.innerText, "DD.MM.YYYY hh:mm");
    if (itemDate.isValid()) {
      var today = moment().utcOffset(2);
      var diff = itemDate.diff(today, "seconds");
      duration = duration * 60;
      if (range == "past" && isPast(diff, duration)) {
        setTargets(item);
        return;
      } else if (range == "future" && isFuture(diff, duration)) {
        if (isLive(diff, duration)) {
          setLiveTargets(item, false);
        } else {
          setLiveTargets(item, true);
        }
        setTargets(item);
        return;
      } else if (range == "live" && isLive(diff, duration)) {
        setTargets(item);
        return;
      }
    }
  }
  item.style.display = "none";
}

function findItemsAndSetTargets(list) {
  var defaultDuration = parseInt(list.getAttribute("jbn-tfilter-duration")) || 60;
  var range = list.getAttribute("jbn-tfilter-range") || "past";
  var items = list.querySelectorAll('[jbn-tfilter="element"]');
  var i = 0;
  for (i = 0; i < items.length; i++) {
    var item = items[i];
    validateTimeStamp(item, range, defaultDuration);
  }
}

function parseLists() {
  var lists = document.querySelectorAll('[jbn-tfilter="list"]');
  var i = 0;
  for (i = 0; i < lists.length; i++) {
    var list = lists[i];
    findItemsAndSetTargets(list);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const script = document.createElement("script");
  script.type = "text/javascript";
  script.src = "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.3/moment.min.js";
  script.onload = parseLists;
  document.head.appendChild(script);
});
