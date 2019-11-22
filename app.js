import Http from './lib.js'

const rootEl = document.getElementById('root');
const formEl = document.createElement('form');
formEl.className = `form-inline mt-4 justify-content-center`;

formEl.innerHTML = `
    <div class="form-group">   
        <input class="form-control" data-type="content" placeholder="Введите текст">
    </div>
    <div class="form-group">
        <select class="form-control" data-type="type">
            <option>Обычный</option>
            <option>Изображение</option>
            <option>Видео</option>
            <option>Аудио</option>
        </select>
    </div>
    <button class="btn btn-primary" data-type="button">Добавить</button>
`;

const http = new Http('https://asel-express-server.herokuapp.com');
const contentEl = formEl.querySelector('[data-type=content]');
contentEl.value = localStorage.getItem('content');
contentEl.addEventListener('input', e => {
    localStorage.setItem('content', e.currentTarget.value);
})
const typeEl = formEl.querySelector('[data-type=type]');
typeEl.value = localStorage.getItem('type');
typeEl.addEventListener('input', e => {
    localStorage.setItem('type', e.currentTarget.value);
})
const buttonEl = formEl.querySelector('[data-type=button]');
buttonEl.addEventListener('click', e => {
    e.preventDefault();
    const content = contentEl.value;
    const type = typeEl.value;
    const data = {
        content,
        type,
    };
    http.postRequest('/posts', e => {
        loadData();
        contentEl.value = '';
        typeEl.value = 'Обычный';
        contentEl.focus();
        localStorage.clear();
    }, handleError, JSON.stringify(data), [{name: 'Content-Type', value: 'application/json'}]);
})

rootEl.appendChild(formEl);

const postsEl = document.createElement('div');
rootEl.appendChild(postsEl);

function rebuildList(e) {
    const data = JSON.parse(e.currentTarget.responseText);
    postsEl.innerHTML = '';
    data.sort((a, b) => b.likes - a.likes)
    for (const item of data) {
        const postEl = document.createElement('div');
        postEl.className = 'card mt-3';

        if (item.type === 'Обычный') {
            postEl.innerHTML = `
                <div class="card">
                    <div class="card-body">
                        <p class="card-text">${item.content}</p>
                        <button data-action="like" class="btn btn-primary mr-2">♡ ${item.likes}</button>
                        <button data-action="dislike" class="btn btn-danger mr-2">👎</button>
                        <button data-action="delete" class="btn btn-danger">Удалить</button>
                    </div>
                </div>
           `;
        } else if (item.type === 'Изображение') {
            postEl.innerHTML = `
                <div class="card">
                    <img src="${item.content}" class="card-img-top">
                    <div class="card-body">
                        <button data-action="like" class="btn btn-primary mr-2">♡ ${item.likes}</button>
                        <button data-action="dislike" class="btn btn-danger mr-2">👎</button>
                        <button data-action="delete" class="btn btn-danger">Удалить</button>
                    </div>
                </div>
           `;
        } else if (item.type === 'Видео') {
            postEl.innerHTML = `
                <div class="card">
                    <div class="card-img-top embed-responsive embed-responsive-16by9">
                        <video src="${item.content}" controls=""></video>
                    </div>
                    <div class="card-body">
                        <button data-action="like" class="btn btn-primary mr-2">♡ ${item.likes}</button>
                        <button data-action="dislike" class="btn btn-danger mr-2">👎</button>
                        <button data-action="delete" class="btn btn-danger">Удалить</button>
                    </div>
                </div>
           `;
        } else if (item.type === 'Аудио') {
            postEl.innerHTML = `
                <div class="card">
                    <audio controls="" class="card-img-top" src="${item.content}"></audio>
                    <div class="card-body">
                        <button data-action="like" class="btn btn-primary mr-2">♡ ${item.likes}</button>
                        <button data-action="dislike" class="btn btn-danger mr-2">👎</button>
                        <button data-action="delete" class="btn btn-danger">Удалить</button>
                    </div>
                </div>
           `;
        }

        postEl.addEventListener('click', e => {
            if (e.target.dataset.action === 'like') {
                http.postLikesRequest(`/posts/like/${item.id}`, rebuildList, handleError);
            } else if (e.target.dataset.action === 'dislike') {
                http.deleteRequest(`/posts/dislike/${item.id}`, rebuildList, handleError);
            } else if (e.target.dataset.action === 'delete') {
                http.deleteRequest(`/posts/${item.id}`, rebuildList, handleError);
            }
        })
        postsEl.appendChild(postEl);
    }
}
const handleError = (e) => {
    console.log(e)
}
const loadData = () => {
    http.getRequest('/posts', rebuildList, handleError)
}
loadData();
