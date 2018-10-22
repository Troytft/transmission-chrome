var hostnameInputElement = document.getElementById('hostname-input');
var usernameInputElement = document.getElementById('username-input');
var passwordInputElement = document.getElementById('password-input');
var saveButtonElement = document.getElementById('save-button');

document.addEventListener('DOMContentLoaded', function () {
    chrome.storage.sync.get(['hostname', 'username', 'password'], function (result) {
        hostnameInputElement.value = result.hostname || '';
        usernameInputElement.value = result.username || '';
        passwordInputElement.value = result.password || '';
    });
});

saveButtonElement.onclick = function (ev) {
    saveButtonElement.disabled = true;
    saveButtonElement.innerText = 'Saved ✓';

    setTimeout(function () {
        saveButtonElement.disabled = false;
        saveButtonElement.innerText = 'Save';
    }, 500);
    chrome.storage.sync.set({
        'hostname': hostnameInputElement.value,
        'username': usernameInputElement.value,
        'password': passwordInputElement.value
    });
};