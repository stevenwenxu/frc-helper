chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create("storage cleanup", {
    // once every 2 days
    periodInMinutes: 2 * 24 * 60,
    delayInMinutes: 2
  });
});

chrome.alarms.onAlarm.addListener(alarm => {
  if (alarm.name === "storage cleanup") {
    chrome.storage.local.get(null, (items) => {
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
      console.log("Clearing families older than", twoDaysAgo.toDateString());
      for (const key in items) {
        if (items.hasOwnProperty(key)) {
          const family = items[key];
          const visitDate = new Date(family._visitDate);
          if (visitDate < twoDaysAgo) {
            chrome.storage.local.remove(key, () => {
              console.log(`Removed family with id ${key}`);
            });
          }
        }
      }
    });
  }
});
