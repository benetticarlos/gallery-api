-- The first exhibition (exhibition_id 1) saves/shows artwork_id 1 (which name is IconPunk #211 Jesse James) and has first priority
INSERT INTO ExhibitionsArtworks(exhibition_id, artwork_id, priority)
   VALUES(1, 1, 1);

-- The first exhibition (exhibition_id 1) will also saves/shows artwork_id 2 (which name is Bumblebee #11810) and has second priority
INSERT INTO ExhibitionsArtworks(exhibition_id, artwork_id, priority)
   VALUES(1, 2, 2);

-- While the second exhibition (exhibition_id 2) saves/shows artwork_id 2 (which name is Bumblebee #11810) and has second priority
INSERT INTO ExhibitionsArtworks(exhibition_id, artwork_id, priority)
   VALUES(2, 2, 2);