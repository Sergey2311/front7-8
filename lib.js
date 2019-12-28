export class Api {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }
    getJSON(path, onSuccess, onFail) {
        this.makeRequest(path, 'GET', [], null, onSuccess, onFail)
    };

    postJSON(path, data, onSuccess, onFail) {
        if (data === null) {
            this.makeRequest(path, 'POST', [], null, onSuccess, onFail)
            return;
        }
        this.makeRequest(path, 'POST', [
            {name: 'Content-Type', value: 'application/json'}
        ], JSON.stringify(data), onSuccess, onFail);
    };

    deleteJSON(path, onSuccess, onFail) {
        this.makeRequest(path, 'DELETE', [], null, onSuccess, onFail)
    };

    makeRequest(path, method, headers = [], body=null, onSuccess, onError) {
        const xhr = new XMLHttpRequest();
        xhr.open(method, `${this.baseUrl}${path}`);
        for (const header of headers) {
            xhr.setRequestHeader(header.name, header.value);
        }
        xhr.addEventListener('load', ev => {
            if (xhr.status >= 200 && xhr.status < 300) {
                const data = JSON.parse(xhr.responseText);
                if (onSuccess !== undefined) {
                    onSuccess(data)
                    return;
                }
                return;
            }
            if (onError !== undefined) {
                onError(xhr.statusText)
                return;
            }
        });
        xhr.addEventListener('error', ev => {
            if (onError !== undefined) {
                onError('Unexpected error');
                }
        });
        xhr.send(body);
    };
};