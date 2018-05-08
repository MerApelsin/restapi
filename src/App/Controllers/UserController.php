<?php

namespace App\Controllers;

class UserController
{
    private $db;
    
    public function __construct($pdo)
    {
        $this->db = $pdo;
    }

    public function getAll()
    {
        $getAllUsers = $this->db->prepare("SELECT * FROM users");
        $getAllUsers->execute();
        $allUsers = $getAllUsers->fetchAll();
        return $allUsers;
    }

    public function getOne($id)
    {
        $getOneUser = $this->db->prepare("SELECT * FROM users WHERE userID = :id");
        $getOneUser->execute([
          ":id" => $id
        ]);
        // Fetch -> single resource
        $oneUser = $getOneUser->fetch();
        return $oneUser;
    }

      public function add($user)
    {
        $hashed = password_hash($user["password"], PASSWORD_DEFAULT);
        $newDate= date("Y-m-d H:i:s", strtotime('+2 hours'));

        $addOne = $this->db->prepare(
            'INSERT INTO users (username, password, createdAt) 
             VALUES (:username, :password, :createdAt)'
        );
        $addOne->execute([
            ':username' => $user['username'],
            ':password' => $hashed,
            ':createdAt' => $newDate
            ]);

        return [
         /* 'id'          => (int)$this->db->lastInsertId(),*/
          'username' => $user['username'],
          'password' => $user['password']
        
          ];

    }
}
