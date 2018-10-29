let settings = {};

async function enqueueDownloading(magnet) {
    const tokenHeaderName = 'X-Transmission-Session-Id';
    const authHeaderValue = 'Basic ' + btoa(settings.username + ':' + settings.password);

    const session = await fetch(settings.hostname, {
        method: 'POST',
        headers: {
            'Authorization': authHeaderValue,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'method': 'session-get'
        })
    });

    await fetch(settings.hostname, {
        headers: {
            'Authorization': authHeaderValue,
            'Content-Type': 'application/json',
            [tokenHeaderName]: session.headers.get('tokenHeaderName')
        },
        body: JSON.stringify({
            'method': 'torrent-add',
            'arguments': {
                'filename': magnet
            }
        })
    });
}

function addLink() {
    const magnetLinkElement = document.querySelector('a.magnet-link');

    const downloadLinkElement = document.createElement('a');
    downloadLinkElement.innerHTML = 'Enqueue Downloading';
    downloadLinkElement.id = 'transmission-enqueue-downloading-button'
    downloadLinkElement.addEventListener('click', function () {
        const successMessageElement = document.createElement('span');
        successMessageElement.innerHTML = 'Enqueued ✓';
        downloadLinkElement.parentNode.replaceChild(successMessageElement, downloadLinkElement);

        enqueueDownloading(magnetLinkElement.href);

        return false;
    });

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
