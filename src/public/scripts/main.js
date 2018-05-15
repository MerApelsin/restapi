document.getElementById("update").style.display="none";

function main(){
  fetch('api/entries',{
    credentials: 'include'
  })
    .then(res => res.json())
    .then(console.log);
}

function search(){
  const searchTerm = document.getElementById("search").value;
  const url = 'api/entries?title=' + searchTerm;

  if ( searchTerm.length >0){

  fetch(url, {
    credentials:'include'
  })
  .then(res => res.json())
  .then(res => createArticle(res));
 }
}
function getAllUsers(){
  fetch('api/users',{
    credentials: 'include'
  })
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

function createArticle(res){

   for (let i = 0; i < res.data.length; i++)
        {
          const article = document.createElement("post-wrapper");
          article.setAttribute("class", "post-wrapper");
          const entryId = res.data[i].entryID;
          article.setAttribute("id", entryId);

          document.getElementById("getPosts-wrapper").appendChild(article);
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

          const btnWrapper = document.createElement("btn-wrapper");
          btnWrapper.setAttribute("class","btn-wrapper");
          const updateBtn = document.createElement("input");
          updateBtn.setAttribute("type", "button");
          updateBtn.setAttribute("value", "Update");
          updateBtn.setAttribute("class", "btn");
          updateBtn.onclick = function() {getUpdate(entryId);}

          btnWrapper.appendChild(updateBtn);

          const deleteBtn = document.createElement("input");
          deleteBtn.setAttribute("type", "button");
          deleteBtn.setAttribute("value", "delete");
          deleteBtn.setAttribute("class", "btn");
          deleteBtn.onclick = function() {deleteEntries(entryId);}
          btnWrapper.appendChild(deleteBtn);
  

          const commentBtn = document.createElement("input");
          commentBtn.setAttribute("type", "button");
          commentBtn.setAttribute("value", "comment");
          commentBtn.setAttribute("class", "btn");
          commentBtn.onclick = function() {getComments(entryId);}
          btnWrapper.appendChild(commentBtn);

          article.appendChild(btnWrapper);

          const commentsInput = document.createElement("textarea");
          commentsInput.setAttribute("class", "textarea");
          article.appendChild(commentsInput);

          const commentButton = document.createElement("input");
          commentButton.setAttribute("type", "submit");
          commentButton.setAttribute("id", "addComment");
          commentButton.innerHTML ="Make a comment";
          /*commentButton.addEventListener("click", postComment());*/
          commentButton.setAttribute( "onClick", "postComment();");
          commentButton.onclick = function(){ getTextValue(entryId);}
          //Add Eventlistner..".// res.data[i].entryID*/
          article.appendChild(commentButton);

        }
}

function getAllEntries(){
  fetch('api/entries',{
    credentials: 'include'
  } )
  .then(res => res.json())
  .then(res => createArticle(res));
}
function getComments(entryId){
  const url = 'api/entries/'+entryId+'/comments';
  fetch(url ,{
    credentials: 'include'
  } )
  .then(res => res.json())
  .then(res => createComments(res));
}

function getTextValue(id){
  const getTextValue = document.getElementById(id).getElementsByTagName("textarea")[0];
  const userID = document.getElementById("hiddenField").value;
  const textValue = getTextValue.value;
  postComment(id, textValue, userID);
}

function getAllComments(){
  fetch('api/comments',{
    credentials: 'include'
  })
    .then(res => res.json())
        .then(res => {createComments(res)});
}
function createComments(res){

    for (let i = 0; i < res.length; i++)
        {
          const article = document.createElement("post-wrapper");
          article.setAttribute("class", "post-wrapper");
          const tag= document.createElement("h4");
          const id = res[i].commentID;
          const textNode = document.createTextNode(id);
          tag.appendChild(textNode);
          article.appendChild(tag);

          const tag1 = document.createElement("p");
          /*tag1.setAttribute("class", "post-wrapper");*/
          const text1 = res[i].content;
          const textNode1 = document.createTextNode(text1);
          tag1.appendChild(textNode1);
          article.appendChild(tag1);
          document.getElementById("getPosts-wrapper").appendChild(article);

          const deleteBtn = document.createElement("input");
          deleteBtn.setAttribute("type", "button");
          deleteBtn.setAttribute("value", "delete");
          deleteBtn.setAttribute("class", "btn");
          deleteBtn.onclick = function() {deleteComment(id);}
          article.appendChild(deleteBtn);
        }
    }; 


function deleteComment(id){
  const url = 'api/comments/' + id;
  
  fetch(url, {
    method: 'DELETE',
    credentials: 'include'
  })
    .then(res => res.json())
    .then(console.log);
}

function postEntry(){
  // x-www-form-urlencoded
  const formData = new FormData();
  const entryTitle = document.getElementById('entryTitleInput');
  const entryContent = document.getElementById('entryContentInput');
  const id = document.getElementById('hiddenField').value;
  formData.append('title', entryTitle.value);
  formData.append('content', entryContent.value);
  formData.append('createdBy', id );

  //for( let [key,value] of formData.entries()) { console.log(key,value);}
  const postOptions = {
    method: 'POST',
    body: formData,
    // MUCH IMPORTANCE!
    credentials: 'include'
  }

  fetch('api/entries', postOptions)

    .then(res => res.json())
    .then(console.log);
}

function getUpdate(id){
  const title = document.getElementById("entryTitleInput");
  const content = document.getElementById("entryContentInput");
  const hiddenId = document.getElementById("updateId");
  document.getElementById("addEntry").style.display="none";
  document.getElementById("update").style.display="block";

  const url ='api/entries/' + id;

  fetch(url, {
    credentials: 'include'
  }) 
  .then(res => res.json())
  .then(res => {

    title.value = res.data.title;
    content.value = res.data.content;
    hiddenId.value = id;
    self.location = "#makePost";
  });
}

function updateEntry(){
  const entryId = document.getElementById("updateId").value;
  const updateTitle = document.getElementById("entryTitleInput").value;
  const updateContent = document.getElementById("entryContentInput").value;
  const url = 'api/entries/' + entryId;
  const string = 'title='+ updateTitle + '&content='+ updateContent;

  fetch( url ,{
    method: 'PATCH',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: JSON.stringify(string),
    credentials: 'include'
 });

   document.getElementById("addEntry").style.display="block";
   document.getElementById("update").style.display="none";
   self.location = '/';
}

function deleteEntries(id){
  const url = 'api/entries/' + id;
  
  fetch(url, {
    method: 'DELETE',
    credentials: 'include'
  })
    .then(res => res.json())
    .then(console.log);
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

function postComment(id, textValue, userID){
  // x-www-form-urlencoded
  const formData = new FormData();
  formData.append('entryID', id);
  formData.append('content', textValue);
  formData.append('createdBy', userID);

  for(let [key,value] of formData.entries()) { console.log(key,value);}
  const postOptions = {
    method: 'POST',
    body: formData,
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

  fetch('/logout', {
    credentials: 'include'
  })
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

const searchButton = document.getElementById('searchBtn');
searchButton.addEventListener('click', search);

const updateButton = document.getElementById('update');
updateButton.addEventListener('click', updateEntry);