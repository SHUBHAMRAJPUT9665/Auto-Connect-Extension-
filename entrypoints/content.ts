export default defineContentScript({
  matches: ["https://www.linkedin.com/mynetwork/grow/*"],
  main() {
    let isConnecting = false;
    let index = 0;
    let connectButtons: string | any[] | NodeListOf<Element> = [];
    let connectionTimeout: string | number | NodeJS.Timeout | undefined; 

    // Function to send connection requests
    const sendConnectionRequest = () => {
      if (!isConnecting) return; // Check if connecting is still true
      if (index < connectButtons.length) {
        connectButtons[index].click();
        index++;
        connectionTimeout = setTimeout(
          sendConnectionRequest,
          Math.random() * 2000 + 1000
        ); // Random delay between 1-3 seconds
      } else {
        isConnecting = false;
        console.log("All connection requests sent.");
        showToast("All connection requests sent."); 
      }
    };

    const showToast = (message: string) => {
      const toast = document.createElement("div");
      toast.style.position = "fixed";
      toast.style.top = "10px";
      toast.style.left = "10px";
      toast.style.backgroundColor = "#333";
      toast.style.color = "#fff";
      toast.style.padding = "15px 20px";
      toast.style.borderRadius = "5px";
      toast.style.zIndex = "9999";
      toast.style.transition = "opacity 0.5s ease";
      toast.style.opacity = "1";
      toast.style.marginBottom = "10px";
      toast.style.fontSize = "14px";
      toast.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.5)";

      toast.innerText = message;

      // Append toast to body
      document.body.appendChild(toast);

      setTimeout(() => {
        toast.style.opacity = "0";
      }, 2500);

      // Remove toast after fade out
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 3000); // Total duration before removing
    };



    // Function to handle messages from the background script
    const handleMessage = (
      request: { action: string },
      sender: any,
      sendResponse: (arg0: { status: string }) => void
    ) => {
      console.log("Content script received message:", request);

      if (request.action === "connect") {
        if (isConnecting) {
          showToast("Already connecting."); 
          sendResponse({ status: "already connecting" });
          return;
        }

        showToast("connecting......");
        isConnecting = true;
        index = 0; 
        connectButtons = document.querySelectorAll(
          'button[aria-label^="Invite"]'
        ); 

        console.log(`Found ${connectButtons.length} connect buttons.`);

        if (connectButtons.length === 0) {
          showToast(
            "No connect buttons found. Please make sure you are on the right page."
          ); 
          isConnecting = false; 
          sendResponse({ status: "no buttons found" });
          return;
        }

        sendConnectionRequest();
        sendResponse({ status: "connecting" });
      } else if (request.action === "stop") {
        if (isConnecting == false) {
          showToast("no action needed!!");
        } else {
          isConnecting = false; // Set connecting state to false
          clearTimeout(connectionTimeout); // Clear the timeout if it's set
          console.log("Connection requests stopped.");
          showToast("Connection requests stopped."); // Use custom toast
          sendResponse({ status: "stopped" });
        }
      }
    };

    // Create and append buttons to the page
    const createButton = () => {
      const container = document.createElement("div");
      container.style.position = "fixed";
      container.style.top = "10px";
      container.style.right = "10px";
      container.style.zIndex = "1000";
      container.style.display = "flex"; 
      container.style.justifyContent = "center";
      container.style.alignItems = "center";
      container.style.padding = "10px";
      container.style.backgroundColor = "#f9f9f9";
      container.style.border = "1px solid #ccc";
      container.style.borderRadius = "8px";
      container.style.boxShadow = "0px 4px 8px rgba(0, 0, 0, 0.1)";
      container.style.fontFamily = "Arial, sans-serif";

      const connectButton = document.createElement("button");
      connectButton.innerText = "Connect All";
      connectButton.style.marginRight = "10px";
      connectButton.style.padding = "8px 12px";
      connectButton.style.backgroundColor = "#0073b1"; 
      connectButton.style.color = "#fff";
      connectButton.style.border = "none";
      connectButton.style.borderRadius = "4px";
      connectButton.style.cursor = "pointer";
      connectButton.style.fontSize = "14px";
      connectButton.style.transition = "background-color 0.3s";
      connectButton.onmouseover = () =>
        (connectButton.style.backgroundColor = "#005582");
      connectButton.onmouseout = () =>
        (connectButton.style.backgroundColor = "#0073b1");
      connectButton.onclick = () => {
        // Trigger connect action
        chrome.runtime.sendMessage({ action: "connect" }, (response) => {
          if (chrome.runtime.lastError) {
            console.error("Error sending message:", chrome.runtime.lastError);
          }
        });
      };

      const stopButton = document.createElement("button");
      stopButton.innerText = "Stop";
      stopButton.style.padding = "8px 12px";
      stopButton.style.backgroundColor = "#d9534f"; 
      stopButton.style.color = "#fff";
      stopButton.style.border = "none";
      stopButton.style.borderRadius = "4px";
      stopButton.style.cursor = "pointer";
      stopButton.style.fontSize = "14px";
      stopButton.style.transition = "background-color 0.3s";
      stopButton.onmouseover = () =>
        (stopButton.style.backgroundColor = "#c9302c");
      stopButton.onmouseout = () =>
        (stopButton.style.backgroundColor = "#d9534f");
      stopButton.onclick = () => {
        // Trigger stop action
        chrome.runtime.sendMessage({ action: "stop" }, (response) => {
          if (chrome.runtime.lastError) {
            console.error("Error sending message:", chrome.runtime.lastError);
          }
        });
      };

      container.appendChild(connectButton);
      container.appendChild(stopButton);
      document.body.appendChild(container);
    };

    // Listen for messages from the background script
    chrome.runtime.onMessage.addListener(handleMessage);

    // Create buttons when the content script runs
    createButton();
  },
});
