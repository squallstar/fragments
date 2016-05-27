chrome.tabs.getSelected(null, function(tab) {
    var uri = encodeURIComponent(tab.url),
        url = 'http://localhost:3000/add-fragment-popup?url=' + uri,
        iframe = document.createElement('iframe');

    iframe.src = url;
    document.body.appendChild(iframe);
});