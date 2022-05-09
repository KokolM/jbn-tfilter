function validateTimeStamp(itemDate, range, duration) {
  if (itemDate.isValid()) {
    var today = moment().utcOffset(2);
    var diff = itemDate.diff(today, "seconds");
    duration = duration * 60;
    if (range == "past" && diff + duration < 0) {
      return true;
    } else if (range == "future" && diff > 0) {
      return true;
    } else if (range == "live" && diff <= 0 && diff + duration >= 0) {
      return true;
    }
  }
  return false;
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

function findItemsAndSetTargets(list) {
  var defaultDuration = parseInt(list.getAttribute("jbn-tfilter-duration")) || 60;
  var range = list.getAttribute("jbn-tfilter-range") || "past";
  var items = list.querySelectorAll('[jbn-tfilter="element"]');
  var i = 0;
  for (i = 0; i < items.length; i++) {
    var item = items[i];
    var date = item.querySelector('[jbn-tfilter-element="date"]');
    var time = item.querySelector('[jbn-tfilter-element="time"]');
    var duration = parseInt(item.querySelector('[jbn-tfilter-element="duration"]')?.innerText) || defaultDuration;
    if (date && time) {
      var itemDate = moment(date.innerText + " " + time.innerText, "DD.MM.YYYY hh:mm");
      if (validateTimeStamp(itemDate, range, duration)) {
        setTargets(item);
      } else {
        item.style.display = "none";
      }
    }
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
