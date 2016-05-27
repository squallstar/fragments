chrome.tabs.getSelected(null, function(tab) {
    var uri = encodeURIComponent(tab.url),
        url = 'https://fragments.me/add-fragment-popup?url=' + uri,
        iframe = document.createElement('iframe');

    iframe.src = url;
    document.body.appendChild(iframe);
});