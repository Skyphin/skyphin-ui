chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });

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

chrome.runtime.onMessage.addListener((message) => {
    if (message.event === "EXTENSION_OPENED") {
        handleExtensionOpened();
    } else if (message.event === "REST_API_REQUEST") {
        handleApiRequest(message.options);
    } else if (message.event === "GRAPHQL_REQUEST") {
        handleGraphQLRequest(message.requestId, message.options);
    }
});

function handleExtensionOpened() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.runtime.sendMessage({ type: "TAB_INITIATED", tab: tabs[0] });
    });
}

function handleTokenRefresh() {
    const refreshToken = localStorage.getItem("refreshToken");
    fetch(process.env.API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
    })
        .then((response) => response.json())
        .then((data) => {
            localStorage.setItem("token", data.token);
            localStorage.setItem("refreshToken", data.refreshToken);
        })
        .catch((error) => {
            console.error(error);
        });
}

function handleApiRequest(options) {
    fetch(process.env.API_URL, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    })
        .then((response) => response.json())
        .then((data) => {
            chrome.runtime.sendMessage({ type: "REST_API_RESPONSE", data });
        })
        .catch((error) => {
            if (error.status === 401) {
                handleTokenRefresh();
                handleApiRequest(options);
            } else {
                chrome.runtime.sendMessage({ type: "REST_API_RESPONSE", error });
            }
        });
}

function handleGraphQLRequest(requestId, options) {
    fetch(process.env.API_URL, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    })
        .then((response) => response.json())
        .then((data) => {
            chrome.runtime.sendMessage({
                type: "GRAPHQL_RESPONSE",
                requestId,
                data
            });
        })
        .catch((error) => {
            if (error.status === 401) {
                handleTokenRefresh();
                handleGraphQLRequest(requestId, options);
            } else {
                chrome.runtime.sendMessage({
                    type: "GRAPHQL_RESPONSE",
                    requestId,
                    error: error.message
                });
            }
        });
}
