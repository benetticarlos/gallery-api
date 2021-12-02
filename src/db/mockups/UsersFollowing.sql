-- iconpunks (user_id 1) follows DrCryptoCollector (user_id 2)
INSERT INTO UsersFollowing(follower_id, followee_id)
   VALUES(1, 2);

-- Crypo-Warhol (user_id 3) follows DrCryptoCollector (user_id 2)
INSERT INTO UsersFollowing(follower_id, followee_id)
   VALUES(3, 2);


-- NOT USED FOR TESTING YET
-- the other way around: Dr DrCryptoCollector (user_id 2) follows iconpunks (user_id 1)
INSERT INTO UsersFollowing(follower_id, followee_id)
   VALUES(2, 1);




