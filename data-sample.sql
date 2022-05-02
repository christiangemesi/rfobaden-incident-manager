-- Mail values are only placeholders.
INSERT IGNORE INTO organization
VALUES (1, _utf8'1970-01-01 00:00:00.001000', _utf8'2021-12-30 11:53:51', _utf8'ZSO Baden'),
       (2, _utf8'2021-12-30 11:54:26', _utf8'2021-12-30 11:54:28', _utf8'RFO Baden'),
       (3, _utf8'2021-12-30 11:54:26', _utf8'2021-12-30 11:54:28', _utf8'StaPo Baden'),
       (4, _utf8'2021-12-30 11:54:26', _utf8'2021-12-30 11:54:28', _utf8'Repol Brugg'),
       (5, _utf8'2021-12-30 11:54:26', _utf8'2021-12-30 11:54:28', _utf8'Repol Zurzibiet'),
       (6, _utf8'2021-12-30 11:54:26', _utf8'2021-12-30 11:54:28', _utf8'Kantonspolizei Aargau'),
       (7, _utf8'2021-12-30 11:54:26', _utf8'2021-12-30 11:54:28', _utf8'Feuerwehr Baden'),
       (8, _utf8'2021-12-30 11:54:26', _utf8'2021-12-30 11:54:28', _utf8'Feuerwehr Birmenstorf-Mülligen'),
       (9, _utf8'2021-12-30 11:54:26', _utf8'2021-12-30 11:54:28', _utf8'Feuerwehr Ehrendingen-Freienwil'),
       (10, _utf8'2021-12-30 11:54:26', _utf8'2021-12-30 11:54:28', _utf8'Feuerwehr Gebenstorf-Turgi'),
       (11, _utf8'2021-12-30 11:54:26', _utf8'2021-12-30 11:54:28', _utf8'Feuerwehr Obersiggenthal'),
       (12, _utf8'2021-12-30 11:54:26', _utf8'2021-12-30 11:54:28', _utf8'Feuerwehr Würenlingen'),
       (13, _utf8'2021-12-30 11:54:26', _utf8'2021-12-30 11:54:28', _utf8'Betriebsfeuerwehr ABB Baden'),
       (14, _utf8'2021-12-30 11:54:26', _utf8'2021-12-30 11:54:28', _utf8'Betriebsfeuerwehr ABB Turgi'),
       (15, _utf8'2021-12-30 11:54:26', _utf8'2021-12-30 11:54:28', _utf8'Betriebsfeuerwehr PSI'),
       (16, _utf8'2021-12-30 11:54:26', _utf8'2021-12-30 11:54:28', _utf8'Regionalwerke AG'),
       (17, _utf8'2021-12-30 11:54:26', _utf8'2021-12-30 11:54:28', _utf8'Werkdienst Baden'),
       (18, _utf8'2021-12-30 11:54:26', _utf8'2021-12-30 11:54:28', _utf8'Werkdienst Birmenstorf'),
       (19, _utf8'2021-12-30 11:54:26', _utf8'2021-12-30 11:54:28', _utf8'Werkdienst Ennetbaden'),
       (20, _utf8'2021-12-30 11:54:26', _utf8'2021-12-30 11:54:28', _utf8'Werkdienst Ehrendingen'),
       (21, _utf8'2021-12-30 11:54:26', _utf8'2021-12-30 11:54:28', _utf8'Werkdienst Freienwil'),
       (22, _utf8'2021-12-30 11:54:26', _utf8'2021-12-30 11:54:28', _utf8'Werkdienst Gebenstorf'),
       (23, _utf8'2021-12-30 11:54:26', _utf8'2021-12-30 11:54:28', _utf8'Werkdienst Obersiggenthal'),
       (24, _utf8'2021-12-30 11:54:26', _utf8'2021-12-30 11:54:28', _utf8'Werkdienst Untersiggenthal'),
       (25, _utf8'2021-12-30 11:54:26', _utf8'2021-12-30 11:54:28', _utf8'Werkdienst Turgi'),
       (26, _utf8'2021-12-30 11:54:26', _utf8'2021-12-30 11:54:28', _utf8'Werkdienst Würenlingen');

INSERT IGNORE INTO user
VALUES (1, _utf8'2021-12-02 14:51:47.581611', _utf8'2021-12-02 14:51:47.581611', _utf8'g@g.g', _utf8'Admin', _utf8'A', _utf8'ADMIN',1),
       (3, _utf8'2021-12-02 14:53:33.676581', _utf8'2021-12-02 14:53:33.676581', _utf8'a@a.a', _utf8'Agent', _utf8'C', _utf8'AGENT',1),
       (5, _utf8'2021-12-02 14:54:31.758215', _utf8'2021-12-02 14:54:31.758215', _utf8'a@b.c', _utf8'Ad', _utf8'Ad', _utf8'ADMIN',2),
       (7, _utf8'2021-12-02 14:55:59.500941', _utf8'2021-12-02 14:55:59.500941', _utf8'a@b.b', _utf8'cd', _utf8'cd', _utf8'AGENT',2);

INSERT IGNORE INTO user_credentials
VALUES (2, _utf8'2021-12-02 14:51:47.579464', _utf8'2021-12-02 14:52:31.555873', _utf8'$2a$10$jOSBFmH2aEupssLgdr.1POH.OG9FIks2HZs0ymnU8x5.QnMw2imQq', _utf8'2021-12-02 14:52:31.555873',1),
       (4, _utf8'2021-12-02 14:53:33.676537', _utf8'2021-12-02 14:54:03.574307', _utf8'$2a$10$OctDKD5QYsdrLMU8vkoqIOerDZtXFDJr.9MzTEZiFHJVdxD5az7lu', _utf8'2021-12-02 14:54:03.574307',3),
       (6, _utf8'2021-12-02 14:54:31.758092', _utf8'2021-12-02 14:55:09.385737', _utf8'$2a$10$wvCLMMHAckRla3HIIk.1W.Ru3wlU//CXEfJW.IA8Hd1icvqHrbvmy', _utf8'2021-12-02 14:55:09.385737',5),
       (8, _utf8'2021-12-02 14:55:59.500889', _utf8'2021-12-02 14:56:30.697138', _utf8'$2a$10$A2xYMyLTiZYsKAWLD02LzugnnOQ0K2hsKkRXIICnC9ToTfUzDgEka', _utf8'2021-12-02 14:56:30.697138',7);

INSERT IGNORE INTO close_reason
VALUES (1, _utf8'2021-12-02 15:06:18.886164', _utf8'Fertig',NULL),
       (2, _utf8'2021-12-02 15:06:23.404000', _utf8'Fertig',1),
       (3, _utf8'2021-12-02 15:07:11.104795', _utf8'Fertig',2),
       (4, _utf8'2021-12-02 15:07:11.104795', _utf8'Fertig',NULL);

INSERT IGNORE INTO entry_type
VALUES  (1,NULL,'PHONE'),
        (2,'1234','RADIO'),
        (3,'12','RADIO'),
        (4,'1','RADIO'),
        (5,'2','PHONE'),
        (6,'3','RADIO'),
        (7,'4','RADIO'),
        (8,'42','RADIO');

INSERT IGNORE INTO incident
VALUES (1, _utf8'2021-12-02 14:57:40.302645', _utf8'2021-12-02 15:30:37.272910', _utf8'Wassermassen in Turgi haben Insel zwischen Limmatkanal und Limmat teilweise abgetragen (bei Limmatkraftwerk)', _utf8'2021-12-22 15:30:40.332617',FALSE, _utf8'2021-11-02 15:30:40.332617', _utf8'Hochwasser Limmat',NULL),
       (2, _utf8'2021-12-02 14:58:08.700227', _utf8'2021-12-02 15:30:37.272910', _utf8'Dachstock',NULL,TRUE,NULL, _utf8'Brand Turgi',3),
       (3, _utf8'2021-12-02 14:58:08.700227', _utf8'2021-12-02 15:30:37.272910', _utf8'Dachstock',NULL,TRUE,NULL, _utf8'Brand Turgi',4),
       (4, _utf8'2021-12-02 14:58:08.700227', _utf8'2021-12-02 15:30:37.272910', _utf8'Dachstock',NULL,FALSE,NULL, _utf8'Brand Turgi',2);

INSERT IGNORE INTO report
VALUES (1, _utf8'2021-12-02 15:00:01.257671', _utf8'2021-12-02 15:06:18.886201', _utf8'Baumstämme und Schutt bedrohen die alte Holzbrücke am Limmatweg.', _utf8'2021-12-22 15:00:01.257671',FALSE,TRUE,TRUE, _utf8'Turgi', _utf8'ACHTUNG: starke Strömung und morsches Holz',2, _utf8'2021-12-02 15:00:01.257671', _utf8'Bedrohung alte Holzbrücke 2',1,1,1),
       (2, _utf8'2021-12-02 15:06:39.928700', _utf8'2021-12-02 15:06:39.928737', _utf8'Baumstämme und Schutt bedrohen die alte Holzbrücke am Limmatweg.', _utf8'2021-12-12 15:00:01.257671',FALSE,TRUE,FALSE, _utf8'Turgi', _utf8'ACHTUNG: starke Strömung und morsches Holz',1,NULL, _utf8'Bedrohung alte Holzbrücke',3,2,1),
       (3, _utf8'2021-12-02 15:06:46.951669', _utf8'2021-12-02 15:07:11.104841', _utf8'Baumstämme und Schutt bedrohen die alte Holzbrücke am Limmatweg.',NULL,FALSE,FALSE,TRUE, _utf8'Turgi', _utf8'ACHTUNG: starke Strömung und morsches Holz',0, _utf8'2021-11-02 15:00:01.257671', _utf8'Bedrohung alte Holzbrücke',3,3,1),
       (4, _utf8'2021-12-02 15:06:54.018947', _utf8'2021-12-02 15:06:54.018980', _utf8'Baumstämme und Schutt bedrohen die alte Holzbrücke am Limmatweg.',NULL,TRUE,FALSE,TRUE, _utf8'Turgi', _utf8'ACHTUNG: starke Strömung und morsches Holz',1, _utf8'2022-12-02 15:00:01.257671', _utf8'Bedrohung alte Holzbrücke',5,4,1),
       (5, _utf8'2021-12-02 15:07:01.171723', _utf8'2021-12-02 15:07:01.171755', _utf8'Baumstämme und Schutt bedrohen die alte Holzbrücke am Limmatweg.',NULL,FALSE,TRUE,TRUE, _utf8'Turgi', _utf8'ACHTUNG: starke Strömung und morsches Holz',1,NULL, _utf8'Bedrohung alte Holzbrücke',7,5,1),
       (6, _utf8'2021-12-02 15:00:01.257671', _utf8'2021-12-02 15:00:01.257717', _utf8'Baumstämme und Schutt bedrohen die alte Holzbrücke am Limmatweg.',NULL,FALSE,TRUE,FALSE, _utf8'Turgi', _utf8'ACHTUNG: starke Strömung und morsches Holz',2,NULL, _utf8'Bedrohung alte Holzbrücke',1,6,1),
       (7, _utf8'2021-12-02 15:00:01.257671', _utf8'2021-12-02 15:00:01.257717', _utf8'Baumstämme und Schutt bedrohen die alte Holzbrücke am Limmatweg.',NULL,TRUE,FALSE,FALSE, _utf8'Turgi', _utf8'ACHTUNG: starke Strömung und morsches Holz',2,NULL, _utf8'Bedrohung alte Holzbrücke',1,7,1),
       (8, _utf8'2021-12-02 15:00:01.257671', _utf8'2021-12-02 15:00:01.257717', _utf8'Baumstämme und Schutt bedrohen die alte Holzbrücke am Limmatweg.',NULL,TRUE,FALSE,FALSE, _utf8'Turgi', _utf8'ACHTUNG: starke Strömung und morsches Holz',2,NULL, _utf8'Bedrohung alte Holzbrücke',1,8,2);

INSERT IGNORE INTO task
VALUES (1, _utf8'2021-12-02 15:00:01.257671', _utf8'2021-12-02 15:00:01.257671', _utf8'Test 1',NULL,FALSE, _utf8'Turgi',0,NULL, _utf8'Umleitung aufstellen',1,1),
       (2, _utf8'2021-12-02 15:00:01.257671', _utf8'2021-12-02 15:00:01.257671', _utf8'Test',NULL,FALSE, _utf8'Turgi',1,NULL, _utf8'Brücke sperren',1,1),
       (3, _utf8'2021-12-02 15:00:01.257671', _utf8'2021-12-02 15:00:01.257671', _utf8'Test',NULL,FALSE, _utf8'Visp',2,NULL, _utf8'Brücke sperren',1,1),
       (4, _utf8'2021-12-02 15:00:01.257671', _utf8'2021-12-02 15:00:01.257671', _utf8'Test',NULL,FALSE, _utf8'Turgi',1,NULL, _utf8'Brücke sperren',1,1),
       (5, _utf8'2021-12-02 15:00:01.257671', _utf8'2021-12-02 15:00:01.257671', _utf8'Test',NULL,TRUE, _utf8'Turgi',0,NULL, _utf8'Brücke sperren',1,1),
       (6, _utf8'2021-12-02 15:00:01.257671', _utf8'2021-12-02 15:00:01.257671', _utf8'Test',NULL,FALSE, _utf8'Herzogenbuchsee',0,NULL, _utf8'Brücke sperren',1,1),
       (7, _utf8'2021-12-02 15:00:01.257671', _utf8'2021-12-02 15:00:01.257671', _utf8'Test',NULL,TRUE, _utf8'Turgi',0,NULL, _utf8'Brücke sperren',1,1);

INSERT IGNORE INTO subtask
VALUES (1, _utf8'2021-12-02 15:00:01.257671', _utf8'2021-12-02 15:00:01.257671', _utf8'Test',NULL,FALSE,0,NULL, _utf8'Umleitung aufstellen',1,1),
       (2, _utf8'2021-12-02 15:00:01.257671', _utf8'2021-12-02 15:00:01.257671', _utf8'Test',NULL,FALSE,1,NULL, _utf8'Umleitung erstellen',3,2),
       (3, _utf8'2021-12-02 15:00:01.257671', _utf8'2021-12-02 15:00:01.257671', _utf8'Test',NULL,FALSE,2,NULL, _utf8'Brücke sperren',3,1),
       (4, _utf8'2021-12-02 15:00:01.257671', _utf8'2021-12-02 15:00:01.257671', _utf8'Test',NULL,FALSE,1,NULL, _utf8'Brücke sperren',3,4),
       (5, _utf8'2021-12-02 15:00:01.257671', _utf8'2021-12-02 15:00:01.257671', _utf8'Test',NULL,FALSE,0,NULL, _utf8'Umleitung erstellen',5,7),
       (6, _utf8'2021-12-02 15:00:01.257671', _utf8'2021-12-02 15:00:01.257671', _utf8'Test',NULL,FALSE,0,NULL, _utf8'Brücke sperren',5,5),
       (7, _utf8'2021-12-02 15:00:01.257671', _utf8'2021-12-02 15:00:01.257671', _utf8'Test',NULL,FALSE,0,NULL, _utf8'Brücke sperren',7,1),
       (8, _utf8'2021-12-02 15:00:01.257671', _utf8'2021-12-02 15:00:01.257671', _utf8'Test',NULL,FALSE,0,NULL, _utf8'Umleitung aufstellen',1,4),
       (9, _utf8'2021-12-02 15:00:01.257671', _utf8'2021-12-02 15:00:01.257671', _utf8'Test',NULL,FALSE,1,NULL, _utf8'Umleitung erstellen',5,3),
       (10, _utf8'2021-12-02 15:00:01.257671', _utf8'2021-12-02 15:00:01.257671', _utf8'Test',NULL,FALSE,2,NULL, _utf8'Brücke sperren',5,1),
       (11, _utf8'2021-12-02 15:00:01.257671', _utf8'2021-12-02 15:00:01.257671', _utf8'Test',NULL,FALSE,1,NULL, _utf8'Brücke sperren',3,7),
       (12, _utf8'2021-12-02 15:00:01.257671', _utf8'2021-12-02 15:00:01.257671', _utf8'Test',NULL,FALSE,0,NULL, _utf8'Umleitung erstellen',3,6),
       (13, _utf8'2021-12-02 15:00:01.257671', _utf8'2021-12-02 15:00:01.257671', _utf8'Test',NULL,FALSE,0,NULL, _utf8'Brücke sperren',5,6),
       (14, _utf8'2021-12-02 15:00:01.257671', _utf8'2021-12-02 15:00:01.257671', _utf8'Test',NULL,FALSE,0,NULL, _utf8'Brücke sperren',7,6),
       (15, _utf8'2021-12-02 15:00:01.257671', _utf8'2021-12-02 15:00:01.257671', _utf8'Test',NULL,FALSE,0,NULL, _utf8'Umleitung aufstellen',1,4),
       (16, _utf8'2021-12-02 15:00:01.257671', _utf8'2021-12-02 15:00:01.257671', _utf8'Test',NULL,FALSE,1,NULL, _utf8'Umleitung erstellen',1,4),
       (17, _utf8'2021-12-02 15:00:01.257671', _utf8'2021-12-02 15:00:01.257671', _utf8'Test',NULL,FALSE,2,NULL, _utf8'Brücke sperren',3,4),
       (18, _utf8'2021-12-02 15:00:01.257671', _utf8'2021-12-02 15:00:01.257671', _utf8'Test',NULL,FALSE,1,NULL, _utf8'Brücke sperren',3,4),
       (19, _utf8'2021-12-02 15:00:01.257671', _utf8'2021-12-02 15:00:01.257671', _utf8'Test',NULL,FALSE,0,NULL, _utf8'Umleitung erstellen',5,4),
       (20, _utf8'2021-12-02 15:00:01.257671', _utf8'2021-12-02 15:00:01.257671', _utf8'Test',NULL,FALSE,0,NULL, _utf8'Brücke sperren',5,4),
       (21, _utf8'2021-12-02 15:00:01.257671', _utf8'2021-12-02 15:00:01.257671', _utf8'Test',NULL,FALSE,0,NULL, _utf8'Brücke sperren',7,4);

INSERT INTO `transport`
VALUES (1,'2022-04-13 08:35:40.294436','2022-04-13 08:35:40.294436',NULL,'-',NULL,_binary '\0',0,NULL,NULL,1,NULL,'Fahrt 1','-','-',1,4),
       (2,'2022-04-13 08:35:40.294436','2022-04-13 08:35:40.294436',NULL,'-',NULL,_binary '\0',0,NULL,NULL,1,NULL,'Fahrt 2','-','-',1,4),
       (3,'2022-04-13 08:35:40.294436','2022-04-13 08:35:40.294436',NULL,'-',NULL,_binary '\0',0,NULL,NULL,1,NULL,'Fahrt 3','-','-',1,4),
       (4,'2022-04-13 08:35:40.294436','2022-04-13 08:35:40.294436',NULL,'-',NULL,_binary '\0',0,NULL,NULL,1,NULL,'Fahrt 4','-','-',1,4),
       (5,'2022-04-13 08:35:40.294436','2022-04-13 08:35:40.294436',NULL,'-',NULL,_binary '\0',0,NULL,NULL,1,NULL,'Fahrt 5','-','-',1,4);

UPDATE hibernate_sequence
SET next_val = 30;