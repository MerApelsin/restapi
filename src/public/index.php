<?php
if (session_status() == PHP_SESSION_NONE) {
    session_set_cookie_params(3600);
    session_start();
}

/**
 * Require the autoload script, this will automatically load our classes
 * so we don't have to require a class everytime we use a class. Evertime
 * you create a new class, remember to runt 'composer update' in the terminal
 * otherwise your classes may not be recognized.
 */
require_once '../../vendor/autoload.php';

/**
 * Here we are creating the app that will handle all the routes. We are storing
 * our database config inside of 'settings'. This config is later used inside of
 * the container inside 'App/container.php'
 */

$container = require '../App/container.php';
$app = new \Slim\App($container);
$auth = require '../App/auth.php';
require '../App/cors.php';


/********************************
 *          ROUTES              *
 ********************************/
   $app->post('/register', function ($request, $response, $args) {
        /**
         * Everything sent in 'body' when doing a POST-request can be
         * extracted with 'getParsedBody()' from the request-object
         * https://www.slimframework.com/docs/v3/objects/request.html#the-request-body
         */
        $body = $request->getParsedBody();
        $newUser = $this->users->add($body);
        return $response->withJson(['data' => $newUser]);
    });

$app->get('/', function ($request, $response, $args) {
    /**
     * This fetches the 'index.php'-file inside the 'views'-folder
     */
    return $this->view->render($response, 'index.php');
});


/**
 * I added basic inline login functionality. This could be extracted to a
 * separate class. If the session is set is checked in 'auth.php'
 */
$app->post('/login', function ($request, $response, $args) {
    /**
     * Everything sent in 'body' when doing a POST-request can be
     * extracted with 'getParsedBody()' from the request-object
     * https://www.slimframework.com/docs/v3/objects/request.html#the-request-body
     */
    $body = $request->getParsedBody();
    $fetchUserStatement = $this->db->prepare('SELECT * FROM users WHERE username = :username');
    $fetchUserStatement->execute([
        ':username' => $body['username']
    ]);
    $user = $fetchUserStatement->fetch();
       /*  die(var_dump($_SESSION));*/
    if (password_verify($body['password'], $user['password'])) {
        $_SESSION['loggedIn'] = true;
        $_SESSION['userID'] = $user['userID'];
        $cookie_name = 'userID';
        $cookie_value = $_SESSION['userID'];
        setcookie($cookie_name, $cookie_value, time() + (86400 * 30), '/'); // 86400 = 1 day
      
        if(isset($_SESSION['loggedIn'])){
        /*    return $response->withJson('logged in is set');*/
        }
        return $response->withJson(['data' => [ $user['userID'], $user['username'] ]]);
    }
    return $response->withJson(['error' => 'wrong password']);
});


/**
 * Basic implementation, implement a better response
 */
$app->get('/logout', function ($request, $response, $args) {
    // No request data is being sent
    if($_SESSION['loggedIn'] == true){
    session_destroy();
    $cookie_name = 'userID';
    unset($_COOKIE[$cookie_name]);
// empty value and expiration one hour before
$res = setcookie($cookie_name, '', time() - 3600);
    return $response->withJson('Success');
    }
    else{
        return $response->withJson('You are not login!!');
    }
});

/**
 * The group is used to group everything connected to the API under '/api'
 * This was done so that we can check if the user is authed when calling '/api'
 * but we don't have to check for auth when calling '/signin'
 */
$app->group('/api', function () use ($app) {

    // GET http://localhost:XXXX/api/todos
    $app->get('/entries', function ($request, $response, $args) {
        /**
         * $this->get('Todos') is available to us because we injected it into the container
         * in 'App/container.php'. This makes it easier for us to call the database
         * inside our routes.
         */
        // $this === $app
      /*  $executeParams = [];*/
        $query = $request->getQueryParams();

        if (isset($query['limit'])){
            $limit = $query['limit'];
        }
        else{
             $limit= 20; 
        }


        if (isset($query['title'])){
            $title = $query['title'];
        }

        $allEntries = $this->entries->getAll($limit, $title);
        /**
         * Wrapping the data when returning as a safety thing
         * https://www.owasp.org/index.php/AJAX_Security_Cheat_Sheet#Server_Side
         */
        return $response->withJson(['data' => $allEntries]);
    });

    // GET http://localhost:XXXX/api/todos/5
    $app->get('/entries/{id}', function ($request, $response, $args) {
        /**
         * {id} is a placeholder for whatever you write after todos. So if we write
         * /todos/4 the {id} will be 4. This gets saved in the $args array
         * $args['id'] === 4
         * The name inside of '$args' must match the placeholder in the url
         * https://www.slimframework.com/docs/v3/objects/router.html#route-placeholders
         */
        $id = $args['id'];
        $singleEntry = $this->entries->getOne($id);
        return $response->withJson(['data' => $singleEntry]);
    });

       $app->patch('/entries/{id}', function ($request, $response, $args){
        
        $id = $args['id'];
        $body = $request->getParsedBody();
        $newEntry = $this->entries->update($id, $body);
        return $response->withJson(['data' => $newEntry]);
    });
        $app->delete('/entries/{id}', function ($request, $response, $args) {

        $id = $args['id'];
        $singleEntry = $this->entries->deleteOne($id);
        return $response->withJson(['data' => $singleEntry]);
    });

        $app->get('/entries/{id}/comments', function ($request, $response, $args) {

            $query = $request->getQueryParams();

            if (isset($query['limit'])){

            $limit = $query['limit'];
            $entryComments = $this->entries->getEntryComments($args['id'], $limit);
            return $response->withJson($entryComments);
        }
        else 
        {
            $entryComments = $this->entries->getEntryComments($args['id']);
            return $response->withJson($entryComments);
        }
    });


    // POST http://localhost:XXXX/api/todos
    $app->post('/entries', function ($request, $response, $args) {
        /**
         * Everything sent in 'body' when doing a POST-request can be
         * extracted with 'getParsedBody()' from the request-object
         * https://www.slimframework.com/docs/v3/objects/request.html#the-request-body
         */
        $body = $request->getParsedBody();
        $newEntry = $this->entries->add($body);
        return $response->withJson(['data' => $newEntry]);
    });

    // Users

    $app->get('/users', function ($request, $response, $args) {
        $query = $request->getQueryParams();

        if (isset($query['limit'])){
            $limit = $query['limit'];
            $allUsers = $this->users->getAll($limit);
            return $response->withJson($allUsers);
        }
        else 
        {
            $allUsers = $this->users->getAll();
            return $response->withJson($allUsers);
        }
    });

    $app->get('/users/{id}', function ($request, $response, $args) {
        $allUsers = $this->users->getOne($args['id']);
        return $response->withJson($allUsers);
    });

   $app->get('/users/{id}/posts', function ($request, $response, $args) {
      /*  $userPosts = $this->users->getUserPosts($args['id']);
        return $response->withJson($userPosts);*/
        $query = $request->getQueryParams();

            if (isset($query['limit'])){

            $limit = $query['limit'];
            $userPosts = $this->users->getUserPosts($args['id'], $limit);
            return $response->withJson($userPosts);
        }
        else 
        {
            $userPosts = $this->users->getUserPosts($args['id']);
            return $response->withJson($userPosts);
        }
    });
    //Comments
        $app->get('/comments', function ($request, $response, $args) {
        $query = $request->getQueryParams();

        if (isset($query['limit'])){
            $limit = $query['limit'];
        }
        else{
             $limit= 20; 
        }

        $allComments = $this->comments->getAll($limit);
        return $response->withJson($allComments);
    });
        $app->get('/comments/{id}', function ($request, $response, $args) {
        $allUsers = $this->comments->getOne($args['id']);
        return $response->withJson($allUsers);
    });
        $app->post('/comments', function ($request, $response, $args) {
        $body = $request->getParsedBody();
        $newComment = $this->comments->add($body);
        return $response->withJson(['data' => $newComment]);
    });
        $app->delete('/comments/{id}', function ($request, $response, $args) {

        $id = $args['id'];
        $singleEntry = $this->comments->deleteOne($id);
        return $response->withJson(['data' => $singleEntry]);
    });
})->add($auth);

$app->run();
