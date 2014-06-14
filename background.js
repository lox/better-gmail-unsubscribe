
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status !== 'complete')
    {
        return;
    }
    var match = 'https://mail.google.com/';
    if (tab.url.substring(0, match.length) === match)
    {
        chrome.tabs.executeScript(tabId, { file: 'gmail.js' });
    }
});