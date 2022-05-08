function validateTimeStamp(itemDate, range, duration) {
  if (itemDate.isValid()) {
    var today = moment().utcOffset(2);
    var diff = itemDate.diff(today, "minutes");
    if (range == "past" && diff + duration < 0) {
      return true;
    } else if (range == "future" && diff > 0) {
      return true;
    } else if (range == "live" && diff + duration >= 0) {
      return true;
    }
  }
  return false;
}

function findItemsAndHideRest(list) {
  var defaultDuration = parseInt(list.getAttribute("jbn-tfilter-duration")) || 60;
  var range = list.getAttribute("jbn-tfilter-range") || "past";
  var items = list.querySelectorAll('[jbn-tfilter-element="item"]');
  var retval = [];
  var i = 0;
  for (i = 0; i < items.length; i++) {
    var item = items[i];
    var date = item.querySelector('[jbn-tfilter-element="date"]');
    var time = item.querySelector('[jbn-tfilter-element="time"]');
    var duration = parseInt(item.querySelector('[jbn-tfilter-element="duration"]')?.innerText) || defaultDuration;
    if (date && time) {
      var itemDate = moment(date.innerText + " " + time.innerText, "DD.MM.YYYY hh:mm");
      if (validateTimeStamp(itemDate, range, duration)) {
        retval.push(item);
      } else {
        item.style.display = "none";
      }
    }
  }
  return retval;
}

function setDisplay(targets) {
  var i = 0;
  for (i = 0; i < targets.length; i++) {
    var target = targets[i];
    var display = target.getAttribute("jbn-tfilter-display");
    target.style.display = display;
  }
}

function parseLists() {
  var lists = document.querySelectorAll('[jbn-tfilter-element="list"]');
  var i = 0;
  for (i = 0; i < lists.length; i++) {
    var list = lists[i];
    var items = findItemsAndHideRest(list);
    var j = 0;
    for (j = 0; j < items.length; j++) {
      var item = items[j];
      var targets = item.querySelectorAll("[jbn-tfilter-display]");
      setDisplay(targets);
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const script = document.createElement("script");
  script.type = "text/javascript";
  script.src = "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.3/moment.min.js";
  script.onload = parseLists;
  document.head.appendChild(script);
});
