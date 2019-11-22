export default class Http {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }
    getRequest(url, onSuccess, onError) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `${this.baseUrl}${url}`);
        xhr.addEventListener('load', e => {
            if (e.currentTarget.status >= 200 && e.currentTarget.status < 300) {
                onSuccess(e);
                return;
            }
            onError(e);
        });
        xhr.addEventListener('error', onError);
        xhr.send();
    }
    postRequest(url, onSuccess, onError, body, headers) {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${this.baseUrl}${url}`);
        for (const header of headers) {
            xhr.setRequestHeader(header.name, header.value);
        }
        xhr.addEventListener('load', e => {
            if (e.currentTarget.status >= 200 && e.currentTarget.status < 300) {
                onSuccess(e);
                return;
            }
            onError(e);
        });
        xhr.addEventListener('error', onError);
        xhr.send(body);
    }
    deleteRequest(url, onSuccess, onError) {
        const xhr = new XMLHttpRequest();
        xhr.open('DELETE', `${this.baseUrl}${url}`);
        xhr.addEventListener('load', e => {
            if (e.currentTarget.status >= 200 && e.currentTarget.status < 300) {
                onSuccess(e);
                return;
            }
            onError(e);
        });
        xhr.addEventListener('error', onError);
        xhr.send();
    }
    postLikesRequest(url, onSuccess, onError){
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${this.baseUrl}${url}`);
        xhr.addEventListener('load', e => {
            if (e.currentTarget.status >= 200 && e.currentTarget.status < 300) {
                onSuccess(e);
                return;
            }
            onError(e);
        });
        xhr.addEventListener('error', onError);
        xhr.send();
    }
}