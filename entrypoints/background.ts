export default defineBackground(() => {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Background script received message:", request);
    // optional request action 
    if (request?.action === 'connect') {
        // Query the active tab in the current window
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length > 0 && tabs[0].id !== undefined) {
                console.log("Sending connect action to tab:", tabs[0]);
                chrome.tabs.sendMessage(tabs[0].id, { action: 'connect' }, (response) => {
                    // Ensure sendResponse is called after receiving a response from content script
                    sendResponse(response);
                });
            } else {
                sendResponse({ status: "no active tab" });
            }
        });
        return true; // Indicates asynchronous response
    } 
    
    else if (request?.action === 'stop') {
        // Query the active tab in the current window
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length > 0 && tabs[0].id !== undefined) {
                console.log("Sending stop action to tab:", tabs[0]);
                chrome.tabs.sendMessage(tabs[0].id, { action: 'stop' }, (response) => {
                    // Ensure sendResponse is called after receiving a response from content script
                    sendResponse(response);
                });
            } else {
                sendResponse({ status: "no active tab" });
            }
        });
        return true; // Indicates asynchronous response
    }
  });
});
