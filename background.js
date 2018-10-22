var settings = {};

function enqueueDownloading(magnet) {
    const tokenHeaderName = 'X-Transmission-Session-Id';
    let xhr1 = new XMLHttpRequest();
    let authHeaderValue = 'Basic ' + btoa(settings.username + ':' + settings.password);

    xhr1.open('POST', settings.hostname, true);
    xhr1.setRequestHeader('Authorization', authHeaderValue)
    xhr1.setRequestHeader('Content-type', 'application/json');
    xhr1.onreadystatechange = function () {
        if (xhr1.readyState == 4) {
            let xhr2 = new XMLHttpRequest();

            xhr2.open('POST', settings.hostname, true);
            xhr2.setRequestHeader('Authorization', authHeaderValue)
            xhr2.setRequestHeader('Content-type', 'application/json');
            xhr2.setRequestHeader(tokenHeaderName, xhr1.getResponseHeader(tokenHeaderName));
            xhr2.send(JSON.stringify({
                'method': 'torrent-add',
                'arguments': {
                    'filename': magnet
                }
            }));
        }
    };
    xhr1.send(JSON.stringify({
        'method': 'session-get'
    }));
}

function addLink() {
    var magnetLinkElement = document.querySelector('a.magnet-link');

    var downloadLinkElement = document.createElement('a');
    downloadLinkElement.innerHTML = 'Enqueue Downloading';
    downloadLinkElement.id = 'transmission-enqueue-downloading-button'
    downloadLinkElement.onclick = function (ev) {
        var successMessageElement = document.createElement('span');
        successMessageElement.innerHTML = 'Enqueued ✓';
        downloadLinkElement.parentNode.replaceChild(successMessageElement, downloadLinkElement);

        enqueueDownloading(magnetLinkElement.href);

        return false;
    };

    magnetLinkElement.parentNode.insertBefore(downloadLinkElement, magnetLinkElement.nextSibling);
}

chrome.storage.sync.get(['hostname', 'username', 'password'], function (result) {
    settings = result;

    if (result.hostname) {
        addLink();
    } else {
        console.log('Empty transmission hostname');
    }
});