chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });

chrome.runtime.onMessage.addListener((message) => {
    if (message.event == 'EXTENSION_OPENED') {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.runtime.sendMessage({ type: "TAB_INITIATED", tab: tabs[0] });
        });
    }
})

chrome.tabs.onActivated.addListener((activeInfo) => {
    console.log(activeInfo);
    chrome.tabs.get(activeInfo.tabId, (tab) => {
        console.log(tab);
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
            return;
        }
        chrome.runtime.sendMessage({ type: "TAB_CHANGED", tab });
    });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    console.log(tabId, changeInfo, tab);
    if (tab.status === "complete") {
        chrome.runtime.sendMessage({ type: "TAB_UPDATED", tab });
    }
});
