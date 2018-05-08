<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <link rel="stylesheet" href="css/style.css">
  <title>Frontpage</title>
</head>

<body>
  <h1>cms</h1>
    <div class = "form-wrapper">
     <div class = "post-newEntry">
      <h2>Add User</h2>
        <form action="" id="newUser">
          <input type="text" id="usernameInput" placeholder="Username">
          <input type="password" id="passwordInput" placeholder="Password">
    <!--<button id="addEntry">Add Entry</button> -->
    <!-- <input type="text" name="content">
       --><input type="submit" id="addUser">
        </form>
     </div><!--end of post-newEntry-->
  </div><!--End of formwrapper-->
  <!-- <input type="text" id="entryTitleInput">
  <input type="text" id="entryContentInput">
  <button id="addEntry">Add Entry</button> -->
  <div class = "form-wrapper">
     <div class = "post-newEntry">
      <h2>Make a Post</h2>
        <form action="" id="newEntry">
          <input type="text" id="entryTitleInput" placeholder="Title">
          <input type="text" id="entryContentInput" placeholder="Content..">
    <!--<button id="addEntry">Add Entry</button> -->
    <!-- <input type="text" name="content">
       --><input type="submit" id="addEntry">
        </form>
     </div><!--end of post-newEntry-->
  </div><!--End of formwrapper-->

    <div class= "displayTodos"> </div>
   </div><!--End of form wrapper-->
    <div class="getIt">
       <h2>Get users and todos</h2>
          <p>Update, comment or delete</p>
    <div class="button-wrapper">
<button onclick="getAllEntries()" id="getEntries">Get all Entries</button>
<button onclick="getAllUsers()" id="getUsers">Get All Users</button>
</div>
</div><!--End of getIt-->
<div class = "article-wrapper">
<div class = "getPosts-wrapper" id ="getPosts-wrapper">
</div>


  <script src="scripts/main.js"></script>

</body>

</html>
