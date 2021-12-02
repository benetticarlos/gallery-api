-- Commented first 2 mockups no longer in use due to recent changes from Adrian.

-- User iconpuks (user_id 1), whose user_address is '0x4841f2ef7531022ad515d606875a0538e5337e9c' likes the artwork_id 1 (which name is '039b - Strato x Silvia Libutti - "3D Duck" - Edition of 30') and it's first priority.
-- INSERT INTO FavoritesArtworks(user_id, user_address, artwork_id, priority)
--    VALUES(1, '0x4841f2ef7531022ad515d606875a0538e5337e9c', 1, 1);


-- User iconpuks (user_id 1), whose user_address is  likes the artwork_id 2 as well (which name is '039a - Strato - "0 Problems" - Genesis Piece - 1 of 1') but it's second priority.
-- INSERT INTO FavoritesArtworks(user_id, user_address, artwork_id, priority)
--    VALUES(1, '0x4841f2ef7531022ad515d606875a0538e5337e9c', 2, 2);

-- User DrCryptoCollector (user_id 2), whose user_address is '0x4a20de27d1346d80046910dc428338a49cec53e6' likes the artwork_id 1 (which name is '039b - Strato x Silvia Libutti - "3D Duck" - Edition of 30') and it's first priority.
INSERT INTO FavoritesArtworks(user_id, user_address, artwork_id, priority)
   VALUES(1, '0x4a20de27d1346d80046910dc428338a49cec53e6', 1, 1);

-- User DrCryptoCollector (user_id 2), whose user_address is '0x4a20de27d1346d80046910dc428338a49cec53e6' likes the artwork_id 2 (which name is '039b - Strato x Silvia Libutti - "3D Duck" - Edition of 30') and it's first priority.
INSERT INTO FavoritesArtworks(user_id, user_address, artwork_id, priority)
   VALUES(1, '0x4a20de27d1346d80046910dc428338a49cec53e6', 2, 1);


-- User Crypto-Warhol (user_id 2), whose user_address is '0xac4a7bd52afc1fb9f533c778546656b7612f59e6' likes the artwork_id 1 (which name is '039b - Strato x Silvia Libutti - "3D Duck" - Edition of 30') and it's first priority.
INSERT INTO FavoritesArtworks(user_id, user_address, artwork_id, priority)
   VALUES(2, '0xac4a7bd52afc1fb9f533c778546656b7612f59e6', 1, 1);

-- User Crypto-Warhol (user_id 2), whose user_address is '0xac4a7bd52afc1fb9f533c778546656b7612f59e6' likes the artwork_id 3 (which name is 038b - Lugosis - "Graff Bunny" - Edition of 30') and it's first priority.
INSERT INTO FavoritesArtworks(user_id, user_address, artwork_id, priority)
   VALUES(2, '0xac4a7bd52afc1fb9f533c778546656b7612f59e6', 3, 1);


