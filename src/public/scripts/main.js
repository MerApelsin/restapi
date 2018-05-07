function main(){
  fetch('api/entries')
    .then(res => res.json())
    .then(console.log);
}

function getAllUsers(){
  fetch('api/users')
    .then(res => res.json())
    .then(console.log);
}

function postEntry(){
  // x-www-form-urlencoded
  const formData = new FormData();
  const entryTitle = document.getElementById('entryTitleInput');
  const entryContent = document.getElementById('entryContentInput');
  formData.append('title', entryTitle.value);
  formData.append('content', entryContent.value);
  formData.append('createdBy', 1);

  //for( let [key,value] of formData.entries()) { console.log(key,value);}
  const postOptions = {
    method: 'POST',
    body: formData,
    // MUCH IMPORTANCE!
    credentials: 'include'
  }

  fetch('api/entries', postOptions)
    .then(res => res.json())
    .then((newEntry) => {
        document.body.insertAdjacentHTML('beforeend', newEntry.data.content);
        console.log(res);
        window.stop();
    });
}


function login(){
  const formData = new FormData();
  formData.append('username', 'goran');
  formData.append('password', 'bunneltan');
  const postOptions = {
    method: 'POST',
    body: formData,
    // DON'T FORGET
    credentials: 'include'
  }

  fetch('/login', postOptions)
    .then(res => res.json())
    .then(console.log);
}

/*const form = document.getElementById('newEntry');
form.addEventListener('submit', function (e) {
  e.preventDefault();
  const formData = new FormData(this);
});*/

const addEntryButton = document.getElementById('addEntry');
addEntryButton.addEventListener('click', postEntry);
