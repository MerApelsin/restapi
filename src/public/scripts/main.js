function main(){
  fetch('api/entries')
    .then(res => res.json())
    .then(console.log);
}

function getAllUsers(){
  fetch('api/users')
    .then(res => res.json())
        .then(res => {  
   for (let i = 0; i < res.length; i++)
        {
         /* document.body.append(res.data[i].content);*/
          const article = document.createElement("post-wrapper");
          article.setAttribute("class", "post-wrapper");
          const tag1 = document.createElement("h4");
          /*tag1.setAttribute("class", "post-wrapper");*/
          const text1 = res[i].username;
          const textNode1 = document.createTextNode(text1);
          tag1.appendChild(textNode1);
          article.appendChild(tag1);
          document.getElementById("getPosts-wrapper").appendChild(article);
        }
    });
}


function getAllEntries(){
  fetch('api/entries')
  .then(res => res.json())
  .then(res => {
      
      for (let i = 0; i < res.data.length; i++)
        {
          const article = document.createElement("post-wrapper");
          article.setAttribute("class", "post-wrapper");
          const tag1 = document.createElement("h4");
          /*tag1.setAttribute("class", "post-wrapper");*/
          const text1 = res.data[i].title;
          const textNode1 = document.createTextNode(text1);
          tag1.appendChild(textNode1);
          article.appendChild(tag1);
          document.getElementById("getPosts-wrapper").appendChild(article);
          
          const content = document.createElement("p");
          const text2 = res.data[i].content; 
          const textNode2 = document.createTextNode(text2);
          content.appendChild(textNode2);
          article.appendChild(content);
          document.getElementById("getPosts-wrapper").appendChild(article);

          const commentsInput = document.createElement("textarea");
          commentsInput.setAttribute("class", "textarea");
          commentsInput.setAttribute("id", "commentsInput");
          article.appendChild(commentsInput);

          const commentButton = document.createElement("input");
          commentButton.setAttribute("type", "submit");
          commentButton.setAttribute("id", "addComment");
          commentButton.innerHTML ="Make a comment";
          /*commentButton.addEventListener("click", postComment());*/
          commentButton.setAttribute( "onClick", "postComment();");
           /*commentButton.onclick = function(){postComment();}*/
          //Add Eventlistner..".// res.data[i].entryID*/
          article.appendChild(commentButton);

          const btnWrapper = document.createElement("btn-wrapper");
          btnWrapper.setAttribute("class","btn-wrapper");
          const updateBtn = document.createElement("input");
          updateBtn.setAttribute("type", "button");
          updateBtn.setAttribute("value", "Update");
          updateBtn.setAttribute("class", "btn");

          btnWrapper.appendChild(updateBtn);

          const deleteBtn = document.createElement("input");
          deleteBtn.setAttribute("type", "button");
          deleteBtn.setAttribute("value", "delete");
          deleteBtn.setAttribute("class", "btn");
          btnWrapper.appendChild(deleteBtn);

          const commentBtn = document.createElement("input");
          commentBtn.setAttribute("type", "button");
          commentBtn.setAttribute("value", "comment");
          commentBtn.setAttribute("class", "btn");
          btnWrapper.appendChild(commentBtn);

          article.appendChild(btnWrapper);
        }
    });
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
function postUser(){
  // x-www-form-urlencoded
  const formData = new FormData();
  const username = document.getElementById('usernameInput');
  const password = document.getElementById('passwordInput');
  formData.append('username', username.value);
  formData.append('password', password.value);

  //for( let [key,value] of formData.entries()) { console.log(key,value);}
  const postOptions = {
    method: 'POST',
    body: formData,
    // MUCH IMPORTANCE!
    credentials: 'include'
  }

  fetch('/register', postOptions)
    .then(res => res.json())
    .then(console.log);
}

function postComment(){
  // x-www-form-urlencoded
  const formData = new FormData();
  const comment = document.getElementById('commentsInput');// from texarea.
  formData.append('comment', comment.value);

  for(let [key,value] of formData.entries()) { console.log(key,value);}
  const postOptions = {
    method: 'POST',
    body: formData,
    // MUCH IMPORTANCE!
    credentials: 'include'
  }

  fetch('api/comments', postOptions)//
    .then(res => res.json())
    .then(console.log);
}



function login(){
  const formData = new FormData();
  const username = document.getElementById('loginUserInput');
  const password = document.getElementById('loginPassInput');
  formData.append('username', username.value);
  formData.append('password', password.value);

  const postOptions = {
    method: 'POST',
    body: formData,
    credentials: 'include'
  }

  fetch('/login', postOptions)
    .then(res => res.json())
    .then(console.log);
}

function logout(){

  fetch('/logout')
    .then(res => res.json())
    .then(console.log);
}

const form = document.getElementById('login');
form.addEventListener('submit', function (e) {
  e.preventDefault();
  const formData = new FormData(this);
});

const form2 = document.getElementById('newUser');
form2.addEventListener('submit', function (e) {
  e.preventDefault();
  const formData = new FormData(this);
});

const addEntryButton = document.getElementById('addEntry');
addEntryButton.addEventListener('click', postEntry);

const addUserButton = document.getElementById('addUser');
addUserButton.addEventListener('click', postUser);

const loginButton = document.getElementById("loginBtn");
loginButton.addEventListener('click', login);
/*
const addCommentButton = document.getElementById('addComment');
addCommentButton.addEventListener('click', postComment);*/