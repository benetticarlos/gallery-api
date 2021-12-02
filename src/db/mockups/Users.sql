-- Update mockups since Carlos refactor Users model/table.


INSERT INTO Users(username, public_address, nonce)
   VALUES('devco-nft', '0xdb28f4ac4d1482394c8a57c35627de69311f2f4a', 123456);

INSERT INTO Users(username, profile_img_url, cover_img_url, public_address, config, email, nonce, bio, website, twitter, instagram, discord_id, youtube, facebook, tiktok, snapchat)
   VALUES('DrCryptoCollector', 'https://storage.googleapis.com/opensea-static/opensea-profile/5.png', '', '0x4a20de27d1346d80046910dc428338a49cec53e6', '', 'drcrypto_collector@gmail.com', 'Empty_nonce', 'Im DrCripto, hello', '', '@drCrpyto','Crpto_Dr','#drCrpto2012','','','','');

-- New mockup to test follow routes
INSERT INTO Users(username, profile_img_url, cover_img_url, public_address, config, email, nonce, bio, website, twitter, instagram, discord_id, youtube, facebook, tiktok, snapchat)
   VALUES('Crypto-Warhol', 'https://storage.googleapis.com/opensea-static/opensea-profile/10.png', '', '0xac4a7bd52afc1fb9f533c778546656b7612f59e6', '', 'warholcryptoholic@gmail.com','Empty_nonce', 'No bio, only NFTS', 'www.warholcrpyto.com', '@warholCrypt0', '__CWarhol__', '', '', '', '', '');

-- New mockup to test follow routes
INSERT INTO Users(username, profile_img_url, cover_img_url, public_address, config, email, nonce, bio, website, twitter, instagram, discord_id, youtube, facebook, tiktok, snapchat)
VALUES('Suqingyan', 'https://storage.googleapis.com/opensea-static/opensea-profile/25.png', '', '0x94782a9182217af5861735ba5a2ea1ed8204a08c', '', 'suqingyan_1985@gmail.com','Empty_nonce', 'Lets all get swifty', '', '@suqingyan', '__SUQIN_YAN__', '', '', '', '', '');

-- New mockup to test follow routes
INSERT INTO Users(username, profile_img_url, cover_img_url, public_address, config, email, nonce, bio, website, twitter, instagram, discord_id, youtube, facebook, tiktok, snapchat)
VALUES('PlagueDoctor', 'https://storage.googleapis.com/opensea-static/opensea-profile/14.png', '', '0xabfcd439736da90fa3038cab5e770e3ffe2556b2', '', 'plague_doc@gmail.com','Empty_nonce', 'Covid has come to all', '', '@plague_deli', '__dr_plague__', '', '', '', '', '');
