const fetchUsers = fetch("http://localhost:3000/admin/users");
const fetchNotes = fetch("http://localhost:3000/admin/notes");
let text = `<header><div><h1>Dagboken</h1>
<h2>Welcome Reader! Below you can see our subcribed users and their blogpost!</h2></div></header>`
let page = document.getElementById('page')
page.insertAdjacentHTML('beforebegin', text)
Promise.all([fetchUsers, fetchNotes])
.then(data => {
    return Promise.all(data.map(res => res.json()))
}).then(([users, notes]) => {
    for(let user in users) {
        let userDiv = `<div id= 'userSection'><strong><u> ${users[user].user}</u></strong>:</div>`;
        for(let note in notes) {
            notes.sort(function(a,b) {
                return new Date(a.createDate) - new Date(b.createDate) 
            })
            if(users[user].id == notes[note].noteId) {
                let noteDiv = `<div id= 'noteSection'><h3>${notes[note].title}</h3> ${notes[note].note} </div>`;
                page.insertAdjacentHTML("afterbegin", noteDiv)
            }
        }
        page.insertAdjacentHTML("afterbegin", userDiv)
    }
});



