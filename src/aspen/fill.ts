chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if(request.hasOwnProperty("familyUniqueId") && request.hasOwnProperty("personIndex")) {
      fill(request.familyUniqueId, request.personIndex);
      sendResponse({ message: "ok" });
    }
  }
);

function fill(familyUniqueId: string, personIndex: number) {
  console.log("Start filling", familyUniqueId, personIndex);
}
