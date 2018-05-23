document.getElementById("update").style.display="none";
document.getElementById("searchResult").style.display = "none";
document.getElementById("renderEntries").style.display = "none";
document.getElementById("renderComments").style.display = "none";
document.getElementById("renderUsers").style.display = "none";

function search()
{
  //Check if user has written anything in the searchbar, if yes (value.lenght > 0)
  //use that and make a query, else tell user to write something cause it's a searchbar.
  const searchTerm = document.getElementById("search").value;
  const url = 'api/entries?title=' + searchTerm;

  if ( searchTerm.length > 0)
  {
    document.getElementById("errorMessage").innerHTML = "";
    document.getElementById("errorMessage").style.display = "none";
    fetch(url, { credentials:'include'})
    .then(res => res.json())
    .then((res) => {
      if(!res.data.length)
      {
        document.getElementById("searchResult").innerHTML = "";
        document.getElementById("errorMessage").style.display = "block";
        document.getElementById("errorMessage").innerHTML = "No results for this query!";
      }
      else
      {
        createArticle(res, "searchResult");
      }
    })
  }
  else
  {
    document.getElementById("searchResult").innerHTML = "";
    document.getElementById("errorMessage").style.display = "block";
    document.getElementById("errorMessage").innerHTML = "Write something!";
  }
}

function getAllUsers()
{
  //Hides the other elements so the user isn't spammed and it feels clean
  document.getElementById("renderUsers").style.display = "block";
  document.getElementById("searchResult").style.display = "none";
  document.getElementById("renderEntries").style.display = "none";
  document.getElementById("renderComments").style.display = "none";

  document.getElementById("renderUsers").innerHTML = "";

  const mainParent = document.getElementById("renderUsers");

  //Get url for fetch depending on if limit is set or not
  let url = getLimit("api/users");

  fetch(url,{credentials: 'include'})
    .then(res => res.json())
    .then(res =>
      {
          //Render the result
          for (let i = 0; i < res.length; i++)
          {
              const article = document.createElement("div");
              article.setAttribute("class", "post-wrapper");
              const tag1 = document.createElement("h4");
              const text1 = res[i].username;
              const textNode1 = document.createTextNode(text1);
              tag1.appendChild(textNode1);
              article.appendChild(tag1);
              mainParent.appendChild(article);
          }
      });
}

function createArticle(res,name)
{
  //render result (res) and depending on where the function gets called it will
  //add the result to that specific div
  //clear div to remove earlier results
  document.getElementById(name).innerHTML = "";
  var isSearched = false;
  if (name == "renderEntries")
  {
    document.getElementById("searchResult").style.display = "none";
    document.getElementById("renderEntries").style.display = "block";
    document.getElementById("renderComments").style.display = "none";
    document.getElementById("renderUsers").style.display = "none";
  }
  else
  {
    document.getElementById("searchResult").style.display = "block";
    document.getElementById("renderEntries").style.display = "none";
    document.getElementById("renderComments").style.display = "none";
    document.getElementById("renderUsers").style.display = "none";
    isSearched = true;
  }
  const mainParent = document.getElementById(name);

   for (let i = 0; i < res.data.length; i++)
        {
          const article = document.createElement("div");
          article.setAttribute("class", "post-wrapper");
          const entryId = res.data[i].entryID;
          article.setAttribute("id", entryId);

          document.getElementById("getPosts-wrapper").appendChild(article);
          const tag1 = document.createElement("h4");
          const text1 = res.data[i].title;
          const textNode1 = document.createTextNode(text1);
          tag1.appendChild(textNode1);
          article.appendChild(tag1);
          document.getElementById("getPosts-wrapper").appendChild(article);

          const textDiv = document.createElement("div");
          textDiv.setAttribute("class", "textDiv");
          const content = document.createElement("p");
          const text2 = res.data[i].content;
          const textNode2 = document.createTextNode(text2);
          content.appendChild(textNode2);
          textDiv.appendChild(content);
          article.appendChild(textDiv);
          document.getElementById("getPosts-wrapper").appendChild(article);

          const btnWrapper = document.createElement("div");
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
          //create button for removing the specific entry
          deleteBtn.onclick = function() {deleteEntries(entryId);}
          btnWrapper.appendChild(deleteBtn);

          const commentBtn = document.createElement("input");
          commentBtn.setAttribute("type", "button");
          commentBtn.setAttribute("value", "comments");
          commentBtn.setAttribute("class", "btn");
          //create a button which gets the entryID for fetching its comments
          //Anonymous function to handle arguments, a function calling another function.
          commentBtn.onclick = function() {getComments(entryId,isSearched);}
          btnWrapper.appendChild(commentBtn);

          article.appendChild(btnWrapper);

          const commentsInput = document.createElement("textarea");
          commentsInput.setAttribute("class", "textarea");
          article.appendChild(commentsInput);

          const commentButton = document.createElement("input");
          commentButton.setAttribute("type", "submit");
          commentButton.setAttribute("id", "addComment");
          commentButton.innerHTML ="Make a comment";
          commentButton.setAttribute( "onClick", "postComment();");
          //button for part 1 of updating an existing entry
          commentButton.onclick = function(){ getTextValue(entryId);}
          article.appendChild(commentButton);

          const commentDiv = document.createElement("div");
          commentDiv.setAttribute("id", "comment"+entryId);
          article.appendChild(commentDiv);

          mainParent.appendChild(article);
        }
}

function getAllEntries()
{
  //render entries depending on if limit is set or not, default is 20
    let url = getLimit("api/entries");
    //sends the result and which div we want to render the result to
    fetch(url,{credentials: 'include'})
      .then(res => res.json())
      .then(res => createArticle(res, "renderEntries"));
}

function getComments(entryId,searchBool)
{
  //fetches comment for specific entry and renders them for the div of the entry

    const url = 'api/entries/'+entryId+'/comments';
    fetch(url ,{credentials: 'include'})
      .then(res => res.json())
      .then(res => createComments(res,entryId,searchBool));
}

function getTextValue(id)
{
    //We have a hiddenfield to inject userID from php-serverside to clientside
    //to record which user is logged in and thus creating posts.
    //This method also extracts the values from post to actually post them to server
    const getTextValue = document.getElementById(id).getElementsByTagName("textarea")[0];
    const userID = document.getElementById("hiddenField").value;
    const textValue = getTextValue.value;
    postComment(id, textValue, userID);
}

function getAllComments()
{
    let url = getLimit("api/comments");

    fetch(url,{credentials: 'include'})
        .then(res => res.json())
        .then(res => {createComments(res,"renderComments",false)});
}

function createComments(res,name,searchedBool)
{

    var useName = "";
    if (name == "renderComments")
    {
        document.getElementById(name).innerHTML = "";
        document.getElementById("searchResult").style.display = "none";
        document.getElementById("renderEntries").style.display = "none";
        document.getElementById("renderComments").style.display = "block";
        document.getElementById("renderUsers").style.display = "none";
        useName = name;
    }
    else if(searchedBool == true)
    {
        document.getElementById("comment"+name).innerHTML = "";
        document.getElementById("searchResult").style.display = "block";
        document.getElementById("renderEntries").style.display = "none";
        document.getElementById("renderComments").style.display = "none";
        document.getElementById("renderUsers").style.display = "none";
        useName = "comment"+name;
    }
    else
    {
        document.getElementById("comment"+name).innerHTML = "";
        document.getElementById("searchResult").style.display = "none";
        document.getElementById("renderEntries").style.display = "block";
        document.getElementById("renderComments").style.display = "none";
        document.getElementById("renderUsers").style.display = "none";
        useName = "comment"+name;
    }
    const mainParent = document.getElementById(useName);

    for (let i = 0; i < res.length; i++)
    {
          const article = document.createElement("div");
          article.setAttribute("class", "post-wrapper");
          const id = res[i].commentID;

          const tag = document.createElement("h3");
          const text = "Comment";
          const textNode = document.createTextNode(text);
          tag.appendChild(textNode);
          article.appendChild(tag);

          const textDiv = document.createElement("div");
          textDiv.setAttribute("class", "textDiv");
          const tag1 = document.createElement("p");
          const text1 = res[i].content;
          const textNode1 = document.createTextNode(text1);
          tag1.appendChild(textNode1);
          textDiv.appendChild(tag1);
          article.appendChild(textDiv);
          document.getElementById("getPosts-wrapper").appendChild(article);

          const deleteBtn = document.createElement("input");
          deleteBtn.setAttribute("type", "button");
          deleteBtn.setAttribute("value", "delete");
          deleteBtn.setAttribute("class", "btn");
          deleteBtn.onclick = function() {deleteComment(id);}
          article.appendChild(deleteBtn);

          const divider = document.createElement("div");
          divider.setAttribute("class", "divider");
          article.appendChild(divider);
          mainParent.appendChild(article);
    }
};

function deleteComment(id)
{
    //gets id from when creating button for that specific entry and then deletes it
    const url = 'api/comments/' + id;

    fetch(url, {
        method: 'DELETE',
        credentials: 'include'})
        .then(res => res.json())
        .then(console.log);
}

function postEntry()
{
  // x-www-form-urlencoded
  const formData = new FormData();
  const entryTitle = document.getElementById('entryTitleInput');
  const entryContent = document.getElementById('entryContentInput');
  const id = document.getElementById('hiddenField').value;
  formData.append('title', entryTitle.value);
  formData.append('content', entryContent.value);
  formData.append('createdBy', id );

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

function getUpdate(id)
{
    //fetches the specific entry and puts the information into
    //the 'make a post' form to let the user edit the post.
    //We "transform" the send button to update instead which
    //calls the actually-uploading-function
    const title = document.getElementById("entryTitleInput");
    const content = document.getElementById("entryContentInput");
    const hiddenId = document.getElementById("updateId");
    document.getElementById("addEntry").style.display="none";
    document.getElementById("update").style.display="block";

    const url ='api/entries/' + id;

    fetch(url, {credentials: 'include'})
      .then(res => res.json())
      .then(res => {
          title.value = res.data.title;
          content.value = res.data.content;
          hiddenId.value = id;
          self.location = "#makePost";
      });
}

function updateEntry()
{
  //updates the entry, where updateId is a hiddenvalue stored to contain
  //information between the two functions
    const entryId = document.getElementById("updateId").value;
    const updateTitle = document.getElementById("entryTitleInput").value;
    const updateContent = document.getElementById("entryContentInput").value;
    const url = 'api/entries/' + entryId;
    const string = 'title='+ updateTitle + '&content='+ updateContent;

    fetch( url ,{
        method: 'PATCH',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: string,
        credentials: 'include'
    });

    document.getElementById("addEntry").style.display="block";
    document.getElementById("update").style.display="none";
    self.location = '/';
}

function deleteEntries(id)
{
    const url = 'api/entries/' + id;

    fetch(url, {
        method: 'DELETE',
        credentials: 'include'
    })
    .then(res => res.json())
    .then(console.log);
}

function postUser()
{
  // x-www-form-urlencoded
    const formData = new FormData();
    const username = document.getElementById('usernameInput');
    const password = document.getElementById('passwordInput');
    formData.append('username', username.value);
    formData.append('password', password.value);

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

function postComment(id, textValue, userID)
{
  // x-www-form-urlencoded
  const formData = new FormData();
  formData.append('entryID', id);
  formData.append('content', textValue);
  formData.append('createdBy', userID);

  const postOptions = {
    method: 'POST',
    body: formData,
    credentials: 'include'
  }

  fetch('api/comments', postOptions)//
    .then(res => res.json())
    .then(console.log);
}

function login()
{
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

function logout()
{
  fetch('/logout', {credentials: 'include'})
    .then(res => res.json())
    .then(console.log);
}

//Fetches limit from input and adjusts fetch url(inpara) if there is a limit
function getLimit(url)
{
  //Get limit from input and check if it's set to begin with
  const limitValue = document.getElementById("limitInput").value;
  if ( limitValue > 0)
  {
    //if set - adjust url and return the new one
    return url+"?limit="+limitValue;
  }
  else
  {
    //else return as-is.
    return url;
  }
}

//BUTTONS AND THEIR EVENT LISTENERS AND STUFF
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
