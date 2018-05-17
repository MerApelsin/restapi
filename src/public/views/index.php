<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <link rel="stylesheet" href="css/style.css">
  <link href='https://fonts.googleapis.com/css?family=Quicksand' rel='stylesheet'>
  <title>Frontpage</title>
</head>

<body>
<div class = "header-wrapper">
<div class = "search-wrapper">
   <div class ="searchField">
      <input type ="text" id="search" placeholder="Search title"/>
      <button id ="searchBtn"><img src = "../magnifying-glass.png"></button>
   </div>
   <div class= "logout">
      <button onclick="logout()">Logout</button>
   </div>
</div>

    <div class ="error-wrapper">
  <p id= "errorMessage"></p>
  <div class= "article-wrapper">
     <div id="searchResult"></div>
  </div>
  </div>
  <div class = "h1-background">
  <h1>cms</h1>
  </div>
  </div><!--header-wrapper-->

  <input type="hidden" name ="userID" id ="hiddenField" value= "<?php echo $_SESSION['userID']?>"/>

  <div class = "login-wrapper">
    <div class = "register">
      <h2>Register</h2>
      <form action="" id="newUser">
          <input type="text" id="usernameInput" placeholder="Username">
          <input type="password" id="passwordInput" placeholder="Password">
          <input type="submit" id="addUser">
      </form>
    </div><!--End of register-->

    <div class = "signin">
      <h2>Sign in</h2>
      <form action="" id="login"><!--ändra form action-->
        <label for="username">Username</label>
        <input type="text" name="username" id="loginUserInput" placeholder="Username">
        <label for="password">Password</label>
        <input type="password" name="password" id="loginPassInput" placeholder="Password">
        <input type="submit" value="Sign in" id="loginBtn">
      </form>
    </div><!--End of Signin-->
  </div><!--login-wrapper-->
 
  <div class = "form-wrapper" id ="makePost">
     <div class = "post-newEntry">
        <h2>Make a Post</h2>
        <form action="" id="newEntry">
          <input type="text" id="entryTitleInput" placeholder="Title"/>
          <input type="text" id="entryContentInput" placeholder="Content.."/>
          <input type="hidden" id ="updateId" value=""/>
          <input type="submit" value="Send" id="addEntry"/>
          <input type="submit" value="Update" id="update"/>
        </form>
     </div><!--end of post-newEntry-->
  </div><!--End of formwrapper-->

  <div class="getIt">
    <h2>Get entries, users and comments</h2>
    <p>Update, comment or delete</p>
    <div class ="addLimit">
      <p>Add Limit</p>
      <input type ="number" id ="limitInput"/>
    </div>
    <div class="button-wrapper">
      <button onclick="getAllEntries()" id="getEntries">Get all Entries</button>
      <button onclick="getAllUsers()" id="getUsers">Get All Users</button>
      <button onclick="getAllComments()" id="getComments">Get All Comments</button>
    </div><!--End of button-Wrapper-->
  </div><!--End of getIt-->

  <div class = "article-wrapper">
    <div class = "getPosts-wrapper" id ="getPosts-wrapper">
      <div id = "renderEntries"></div>
      <div id = "renderComments"></div>
      <div id = "renderUsers"></div> 
    </div><!--End of getPost-wrapper-->
  </div><!--End of article-wrapper-->

  <script src="scripts/main.js"></script>

</body>

</html>
