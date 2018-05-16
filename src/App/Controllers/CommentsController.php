<?php

namespace App\Controllers;

class CommentsController
{
    private $db;

    public function __construct(\PDO $pdo)
    {
        $this->db = $pdo;
    }

    public function getAll($limit)
    {
        $getAll = $this->db->prepare('SELECT * FROM comments LIMIT :limit');
        $getAll->bindParam(':limit', $limit, \PDO::PARAM_INT);
        $getAll->execute();
        return $getAll->fetchAll();
    }

    public function getOne($id)
    {
        $getOne = $this->db->prepare('SELECT * FROM comments WHERE commentID = :id');
        $getOne->execute([':id' => $id]);
        return $getOne->fetch();
    }

    public function deleteOne($id)
    {
        $deleteOne = $this->db->prepare('DELETE FROM comments WHERE commentID = :id');
        $deleteOne->execute([':id' => $id]);
    }

    public function add($comments)
    {    // fetches current datetime into Swedish datetime.
         $newDate= date("Y-m-d H:i:s", strtotime('+2 hours')); 

         $addOne = $this->db->prepare(
          'INSERT INTO comments (entryID, content, createdBy, createdAt) VALUES (:entryID, :content, :createdBy, :createdAt)'
        );

         $addOne->execute([':entryID' => $comments['entryID'], 
           ':content'   => $comments['content'],
           ':createdBy' => $comments['createdBy'],
           ':createdAt' => $newDate
          ]);

         return [
           ':content'   => $entry['content'],
           ':createdBy' => $comments['createdBy'], 
           ':createdAt' => $newDate
        ];
    }
}
