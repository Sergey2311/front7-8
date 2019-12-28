import { Api } from './lib.js';

const api = new Api('https://myserver7-8.herokuapp.com');


const rootEl = document.getElementById('root')

const addFormEl = document.createElement('form');

addFormEl.innerHTML = `
<div class="container">
    <div class="row">
        <div class="col">
            <div class="form-group">
                <input data-id="link" class="form-control mb-2" type="text" placeholder="Введите текст">
                <select data-id="type" class="custom-select mb-2">
                    <option value="regular">Обычный</option>
                    <option value="image">С картинкой</option>
                    <option value="audio">С музыкой</option>
                    <option value="video">С видео</option>
                </select>
                <button data-id="button" class="btn btn-primary">Добавить</button>
            </div>
        </div>
    </div>
</div>    
`;
rootEl.appendChild(addFormEl);

const linkEl = addFormEl.querySelector('[data-id=link]');
linkEl.value = localStorage.getItem('link');
linkEl.addEventListener('input', (ev) => {
    localStorage.setItem('link', ev.currentTarget.value)
});
const typeEl = addFormEl.querySelector('[data-id=type]');
typeEl.value = localStorage.getItem('type');
typeEl.addEventListener('input', (ev) => {
    localStorage.setItem('type', ev.currentTarget.value)
});

const buttonEl = addFormEl.querySelector('[data-id=button]');
buttonEl.addEventListener('click', (ev) => {
    ev.preventDefault();
    const data = {
        id: 0,
        type: typeEl.value,
        value: linkEl.value,
    };
    
    api.postJSON('/posts',data, (ev) => {
        loadData();
        linkEl.value = '';
        typeEl.value = 'regular';
        localStorage.clear();
        },handleError());
});

const postsEl = document.createElement('div');
rootEl.appendChild(postsEl);

const rebuildList = data => {
    postsEl.innerHTML = '';

    data.sort((a, b) => {
        return b.likes - a.likes
    });

    for (const item of data) {
        const postEl = document.createElement('div');
        postEl.className = 'card mb-2'
        if (item.type == 'image') {
            postEl.innerHTML = `
            <div class = "col px-md-7">
                <img src = "${item.value}" class = "card-img-top" width = "100" height = "100">
            <div class = "card-body">
                    <span class="badge badge-secondary">${item.likes}</span>
                    <button type="button" class="btn btn-primary btn-sm" data-action="like">👍</button>
                    <button type="button" class="btn btn-primary btn-sm" data-action="dislike">👎</button>
                </div>
            </div>
            `;
        }
        else if (item.type == 'video') {
            postEl.innerHTML = `
            <div class = "col px-md-5">
                <div class = "card-img-topcard-img-top embed-responsive embed-responsive-16by9 mb-2">
                    <video src = "${item.value}" class = "embed-responsive-item" controls>
                </div>
                <div class = "col">
                    <span class="badge badge-secondary">${item.likes}</span>
                    <button type="button" class="btn btn-primary btn-sm" data-action="like">👍</button>
                    <button type="button" class="btn btn-primary btn-sm" data-action="dislike">👎</button>
                </div>
            </div>
            `;
        }

        else if (item.type == 'audio') {
            postEl.innerHTML = `
            <div class = "col px-md-5">
                <div class = "card-img-topcard-img-top embed-responsive embed-responsive-16by9 mb-2">
                    <audio src = "${item.value}" class = "embed-responsive-item" controls>
                </div>
                <div class ="col">
                    <span class="badge badge-secondary">${item.likes}</span>
                    <button type="button" class="btn btn-primary btn-sm" data-action="like">👍</button>
                    <button type="button" class="btn btn-primary btn-sm" data-action="dislike">👎</button>
            `;

        }
        else if (item.type == 'regular') {
            postEl.innerHTML = `
            <div class = "card">
                <div class = "card-body">
                    <p class="card-text">${item.value}</p>
                    <span class="badge badge-secondary">${item.likes}</span>
                    <button type="button" class="btn btn-primary btn-sm" data-action="like">👍</button>
                    <button type="button" class="btn btn-primary btn-sm" data-action="dislike">👎</button>
                </div>
            </div>
            `;
        }
        postEl.addEventListener('click', (ev) => {
            if (ev.target.dataset.action === 'like') {
                api.postJSON(`/posts/${item.id}/likes`, null, rebuildList, handleError);
            } else if (ev.target.dataset.action === 'dislike') {
                api.deleteJSON(`/posts/${item.id}/likes`, rebuildList, handleError);
            } else if (ev.target.dataset.action === 'remove') {
                api.deleteJSON(`/posts/${item.id}`, rebuildList, handleError);
            }
        })
        postsEl.appendChild(postEl);
    }
}

const handleError = (ev) => {
    console.log(ev);
};
const loadData = () => {
    api.getJSON('/posts', rebuildList, handleError);
};
loadData();