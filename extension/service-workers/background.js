// Service Worker for A9flow Chrome Extension
// Handles tab events, side panel, and communication with Firebase-authenticated backend

// Initialize side panel behavior
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });

// ============================================================================
// Tab Event Listeners
// ============================================================================

chrome.tabs.onActivated.addListener((activeInfo) => {
    chrome.tabs.get(activeInfo.tabId, (tab) => {
        if (chrome.runtime.lastError) {
            console.error('Error getting tab:', chrome.runtime.lastError);
            return;
        }
        // Notify side panel about tab change
        chrome.runtime.sendMessage({
            type: 'TAB_CHANGED',
            tab
        }).catch(() => {
            // Side panel might not be open, ignore error
        });
    });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
        // Notify side panel about tab update
        chrome.runtime.sendMessage({
            type: 'TAB_UPDATED',
            tab
        }).catch(() => {
            // Side panel might not be open, ignore error
        });
    }
});

chrome.tabs.onRemoved.addListener((tabId) => {
    // Clear chat history for the closed tab
    chrome.storage.local.remove(`chat_${tabId}`);
});

// ============================================================================
// Message Handlers
// ============================================================================

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.event === 'EXTENSION_OPENED') {
        handleExtensionOpened();
        return false;
    }
    return false;
});

// ============================================================================
// Extension Lifecycle
// ============================================================================

chrome.runtime.onInstalled.addListener(async (details) => {
    if (details.reason === 'install') {
        console.log('A9flow extension installed');
        // Set default settings
        await chrome.storage.local.set({
            settings: {
                autoOpen: false,
                theme: 'system'
            }
        });
    } else if (details.reason === 'update') {
        console.log('A9flow extension updated to version', chrome.runtime.getManifest().version);
    }
});

// ============================================================================
// Handler Functions
// ============================================================================

function handleExtensionOpened() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
            chrome.runtime.sendMessage({
                type: 'TAB_INITIATED',
                tab: tabs[0]
            }).catch(() => {
                // Side panel might not be open yet
            });
        }
    });
}

// ============================================================================
// Context Menu (Optional - for future use)
// ============================================================================

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: 'analyze-page',
        title: 'Analyze with A9flow',
        contexts: ['page']
    });

    chrome.contextMenus.create({
        id: 'analyze-selection',
        title: 'Analyze selection',
        contexts: ['selection']
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'analyze-page' || info.menuItemId === 'analyze-selection') {
        // Open side panel
        chrome.sidePanel.open({ windowId: tab.windowId });

        // Send context to side panel
        setTimeout(() => {
            chrome.runtime.sendMessage({
                type: 'CONTEXT_MENU_CLICKED',
                menuItemId: info.menuItemId,
                selectionText: info.selectionText,
                pageUrl: info.pageUrl
            }).catch(() => {
                // Side panel might not be ready yet
            });
        }, 500);
    }
});

// ============================================================================
// Keyboard Commands
// ============================================================================

chrome.commands.onCommand.addListener((command) => {
    if (command === 'open-side-panel') {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]) {
                chrome.sidePanel.open({ windowId: tabs[0].windowId });
            }
        });
    }
});
