'use strict';

let uniqueURLs = [];
let tabsToRemove = [];

function getCurrentWindowTabs() {
    // Populate all tabs for current window
    chrome.windows.getCurrent(
        {'populate': true},
        removeDuplicateTabs
    );
}

function removeDuplicateTabs(currentWindow) {
    // Find duplicate URLs in the current window's tabs
    currentWindow.tabs.forEach(findDuplicateUrls);
    // Close tabs with an exact URL match to another tab
    chrome.tabs.remove(tabsToRemove);

    // Reset vars to not persist between unsuspended deduplication
    uniqueURLs = [];
    tabsToRemove = [];
}

// Find unique URLs and duplicate tabs
function findDuplicateUrls(tab) {
    if (uniqueURLs.includes(tab.url)) {
        tabsToRemove.push(tab.id);
    } else {
        uniqueURLs.push(tab.url);
    }
}

// Handle keyboard shortcut for extension
function processShortcutCommand(command) {
    if (command == 'close-exact-tab-duplicates') {
        getCurrentWindowTabs();
    }
}
  
// On extension icon click
chrome.action.onClicked.addListener(getCurrentWindowTabs);

// On command shortcut
chrome.commands.onCommand.addListener(processShortcutCommand);
