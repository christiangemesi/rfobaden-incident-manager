-- MySQL dump 10.13  Distrib 8.0.27, for Linux (x86_64)
--
-- Host: localhost    Database: database
-- ------------------------------------------------------
-- Server version       8.0.27

/*!40101 SET @OLD_CHARACTER_SET_CLIENT = @@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS = @@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION = @@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE = @@TIME_ZONE */;
/*!40103 SET TIME_ZONE = '+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS = @@UNIQUE_CHECKS, UNIQUE_CHECKS = 0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS = @@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS = 0 */;
/*!40101 SET @OLD_SQL_MODE = @@SQL_MODE, SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES = @@SQL_NOTES, SQL_NOTES = 0 */;

--
-- Dumping data for table `close_reason`
--

LOCK
TABLES `close_reason` WRITE;
/*!40000 ALTER TABLE `close_reason`
    DISABLE KEYS */;
/*!40000 ALTER TABLE `close_reason`
    ENABLE KEYS */;
UNLOCK
TABLES;

LOCK
TABLES `entry_type` WRITE;
/*!40000 ALTER TABLE `entry_type` DISABLE KEYS */;
INSERT INTO `entry_type`
VALUES (11, NULL, 'PHONE'),
       (13, '1234', 'RADIO'),
       (106, '12', 'RADIO'),
       (108, '1', 'RADIO'),
       (110, '2', 'PHONE')
        ,
       (112, '3', 'RADIO'),
       (114, '4', 'RADIO'),
       (116, '42', 'RADIO'),
       (118, NULL, 'PHONE'),
       (120, '1234', 'PHONE'),
       (122, '1234', 'RADIO'),
       (124, '1234', 'PHONE'),
       (126, '1234', 'RADIO');
/*!40000 ALTER TABLE `entry_type` ENABLE KEYS */;
UNLOCK
TABLES;

--
-- Dumping data for table `hibernate_sequence`
--

LOCK
TABLES `hibernate_sequence` WRITE;
/*!40000 ALTER TABLE `hibernate_sequence`
    DISABLE KEYS */;
INSERT INTO `hibernate_sequence`
VALUES (128);
/*!40000 ALTER TABLE `hibernate_sequence`
    ENABLE KEYS */;
UNLOCK
TABLES;

--
-- Dumping data for table `incident`
--

LOCK
TABLES `incident` WRITE;
/*!40000 ALTER TABLE `incident`
    DISABLE KEYS */;
INSERT INTO `incident`
VALUES (5, '2022-01-02 19:00:36.378988', '2022-01-06 21:31:00.378889', 'Beschreibung', '2022-01-17 23:00:00.000000',
        _binary '\0', '2001-01-17 23:00:00.000000', 'Testereingnis Badenfahrt', NULL),
       (61, '2022-01-11 20:39:26.150514', '2022-01-11 20:39:26.150514',
        'NTP Betrieb infolge Swisscom-Systemausfall. Alle NTP müssen ab sofort bis auf weiteres betrieben werden. ',
        NULL, _binary '\0', NULL, 'NTP - Notfalltreffpunkte 11.01.2022', NULL),
       (76, '2022-01-26 09:46:39.618608', '2022-01-26 09:46:39.618608', 'Testing Autorefresh', NULL, _binary '\0', NULL,
        'Testing Autorefresh', NULL),
       (100, '2022-02-06 23:51:48.659154', '2022-02-06 23:51:48.659154',
        'Stromleitung infolge Sturm unterbrochen: NTP in Birmenstorf und Mülligen in Betrieb', NULL, _binary '\0',
        '2022-02-06 22:30:00.000000', 'Sturm/Stromausfall + NTP', NULL);
/*!40000 ALTER TABLE `incident`
    ENABLE KEYS */;
UNLOCK
TABLES;

--
-- Dumping data for table `organization`
--

LOCK
TABLES `organization` WRITE;
/*!40000 ALTER TABLE `organization`
    DISABLE KEYS */;
/*!40000 ALTER TABLE `organization`
    ENABLE KEYS */;
UNLOCK
TABLES;

--
-- Dumping data for table `report`
--

LOCK
TABLES `report` WRITE;
/*!40000 ALTER TABLE `report`
    DISABLE KEYS */;
INSERT INTO `report`
VALUES (7, '2022-01-02 19:02:30.123942', '2022-01-02 19:02:30.123942', 'Beschreibung von Schlüssel',
        '2022-01-17 23:00:00.000000', FALSE, _binary '', _binary '', 'Mordor', 'Der Schlüssel ist wichtig', 2,
        '2001-01-17 23:00:00.000000', 'Schlüssel', 3, 11, 5),
       (41, '2022-01-06 21:14:50.468796', '2022-01-06 21:14:50.468796', 'Brand zwischen Schlossbergplatz und Gstühl',
        '2022-01-05 23:00:00.000000', FALSE, _binary '', _binary '', '5400 Baden', 'Feuerwehr vor Ort', 1,
        '2022-01-05 23:00:00.000000', 'Brand bei McDonalds', 3, 13, 5),
       (55, '2022-01-06 21:22:36.774615', '2022-01-06 21:33:09.209732',
        'Beim Steg / Rostbalken ist eine Person in die Limmat gefallen. Flussrettung ist aufgeboten, Rettung läuft.',
        NULL, FALSE, _binary '\0', _binary '\0', NULL, 'FW, Sani und Polizei vor Ort', 2, NULL,
        'Person in Limmat gefallen ',
        1, 106, 5),
       (56, '2022-01-06 21:26:09.149640', '2022-01-06 21:33:28.887013',
        'Bei Schichtende um 22:00h muss eine Verpflegung für 50 Einsatzkräfte bei der Turnhalle XY bereitgestellt werden.\n- Div. Sandwiches\n- Getränke',
        NULL, FALSE, _binary '\0', _binary '\0', '5400 Baden', 'ZSO anfragen', 0, '2020-01-07 13:00:00.000000',
        'Verpflegung für 50 Einsatzkräfte organisieren', 1, 108, 5),
       (64, '2022-01-15 11:20:07.158494', '2022-01-15 11:20:07.158494',
        'Velo-/Fussgänger-Unfall, 2 verletzte Personen, Rettungsdienst ist aufgeboten.', NULL, FALSE, _binary '',
        _binary '',
        '5400 Baden', NULL, 1, NULL, 'Verkehrsunfall Corula-Passage', 1, 110, 5),
       (65, '2022-01-15 11:23:08.891079', '2022-01-15 11:23:08.891079',
        'Velo-/Fussgänger-Unfall, 2 verletzte Personen, Rettungsdienst ist aufgeboten.', NULL, FALSE, _binary '',
        _binary '',
        '5400 Baden', NULL, 1, NULL, 'Verkehrsunfall Corula-Passage', 1, 112, 5),
       (66, '2022-01-15 11:23:09.718219', '2022-01-15 11:23:09.718219',
        'Velo-/Fussgänger-Unfall, 2 verletzte Personen, Rettungsdienst ist aufgeboten.', NULL, FALSE, _binary '',
        _binary '',
        '5400 Baden', NULL, 1, NULL, 'Verkehrsunfall Corula-Passage', 1, 114, 5),
       (93, '2022-01-29 09:02:37.888113', '2022-01-29 09:02:37.888113', 'Alle NTP müssen ab sofort betrieben werden.',
        NULL, FALSE, _binary '', _binary '\0', NULL, NULL, 2, NULL, 'NTP Baden', NULL, 116, 61),
       (98, '2022-01-29 09:07:27.011724', '2022-01-29 09:08:02.130273', NULL, NULL, _binary '', _binary '\0', NULL,
        NULL, FALSE, 2, NULL, 'NTP Ehrendingen', NULL, 118, 61),
       (101, '2022-02-06 23:54:39.867284', '2022-02-06 23:54:39.867284',
        'FW Birmenstorf, Kdt Herzog meldet 23:31 per Tel, dass Birmenstorf und Mülligen ohne Strom sind. \n', NULL,
        FALSE,
        _binary '', _binary '\0', '5413 Birmenstorf', NULL, 1, NULL,
        'Stromausfall in Birmenstorf und Mülligen infolge Sturm', 1, 120, 100),
       (102, '2022-02-06 23:58:40.589150', '2022-02-06 23:58:40.589150',
        'Info von SPOC per Tel um 23:40\n\nInfo Update ca. 23:55h betreffend Dauer könnte erste Prognose gemacht werden',
        NULL, FALSE, _binary '', _binary '\0', '5413 Birmentorf', NULL, 1, NULL,
        'Stromausfall in Birmensttorf und Mülligen',
        NULL, 122, 100),
       (103, '2022-02-07 00:01:08.736510', '2022-02-07 00:01:08.736510',
        'ZSO Baden liefert NTP-Material an FW Birmenstorf-Mülligen', NULL, FALSE, _binary '', _binary '\0',
        '5413 Birmensdorf',
        NULL, 1, NULL, 'NTP-Material an FW', 3, 124, 100),
       (104, '2022-02-07 00:28:11.646109', '2022-02-07 00:28:11.646109',
        'Kdt ZSO, 00:24 NTP Material geliefert, Strom wieder da. ', NULL, FALSE, _binary '', _binary '', NULL, NULL, 1,
        '2022-02-06 23:25:00.000000', 'Strom wieder vorhanden, Netz  i.O.', NULL, 126, 100);
/*!40000 ALTER TABLE `report`
    ENABLE KEYS */;
UNLOCK
TABLES;

--
-- Dumping data for table `subtask`
--

LOCK
TABLES `subtask` WRITE;
/*!40000 ALTER TABLE `subtask`
    DISABLE KEYS */;
INSERT INTO `subtask`
VALUES (9, '2022-01-02 19:03:28.179795', '2022-01-02 19:03:28.179795', 'weit', NULL, _binary '\0', 1, NULL,
        'Wirf ihn in das Lava', 3, 8),
       (59, '2022-01-06 21:28:44.888660', '2022-01-07 15:25:53.237455', 'Fleisch, Käse, Vegi', NULL, _binary '\0', 1,
        NULL, 'Metzgerei Müller 50 Sandwiches bestellen', NULL, 57),
       (60, '2022-01-06 21:29:41.392258', '2022-01-07 15:25:55.006571', '100 Fl. 0.5 lt div. Getränke ', NULL,
        _binary '', 1, NULL, 'Müllerbräu Getränke bestellen', 3, 57);
/*!40000 ALTER TABLE `subtask`
    ENABLE KEYS */;
UNLOCK
TABLES;

--
-- Dumping data for table `task`
--

LOCK
TABLES `task` WRITE;
/*!40000 ALTER TABLE `task`
    DISABLE KEYS */;
INSERT INTO `task`
VALUES (8, '2022-01-02 19:03:06.449672', '2022-01-02 19:03:06.449672', 'Bringe den Ring', '2022-01-17 23:00:00.000000',
        FALSE,
        'Mordor', 1, '2001-01-17 23:00:00.000000', 'Auftrag', 3, 7),
       (51, '2022-01-06 21:18:03.663932', '2022-01-06 21:18:03.663932', NULL, NULL, FALSE, NULL, 1, NULL,
        'Medienstelle aufbieten', 1, 41),
       (52, '2022-01-06 21:18:45.906572', '2022-01-06 21:18:54.919747', NULL, NULL, FALSE, NULL, 1, NULL,
        'FV Feuerwehr aufbieten', 3, 41),
       (57, '2022-01-06 21:26:58.130592', '2022-01-06 21:26:58.130592', 'ZSO Baden anfragen', NULL, FALSE, NULL, 1,
        NULL,
        'Anfrage für Verpflegung an ZSO', 1, 56),
       (58, '2022-01-06 21:27:48.908125', '2022-01-06 21:27:48.908125', 'ZSO betr. Kontakt Turnhalle XY anfragen', NULL,
        FALSE,
        NULL, 1, NULL, 'Turnhalle XY für Verpflung reservieren', NULL, 56),
       (95, '2022-01-29 09:03:50.879722', '2022-01-29 09:03:50.879722', NULL, NULL, FALSE, '5400 Baden, Cordulapassage',
        1,
        NULL, 'NTP Baden Cordulaplatz betreiben', NULL, 93),
       (96, '2022-01-29 09:04:37.111373', '2022-01-29 09:09:23.214773', 'Bahnhofplatz 1', '2022-01-29 08:09:00.000000',
        FALSE,
        '5400 Baden, Bahnhofplatz 1', 1, NULL, 'NTP Baden Mobil betreiben', NULL, 93),
       (97, '2022-01-29 09:05:34.158949', '2022-01-29 09:05:34.158949', NULL, NULL, FALSE, '5406 Rütihof', 2, NULL,
        'NTP Baden Rütihof betreiben', 1, 93),
       (99, '2022-01-29 09:08:36.441110', '2022-01-29 09:08:36.441110', NULL, NULL, FALSE, NULL, 1, NULL,
        'NTP Ehrendingen Oberdorf in Betrieb nehmen', NULL, 98);
/*!40000 ALTER TABLE `task`
    ENABLE KEYS */;
UNLOCK
TABLES;

--
-- Dumping data for table `user`
--

LOCK
TABLES `user` WRITE;
/*!40000 ALTER TABLE `user`
    DISABLE KEYS */;
INSERT INTO `user`
VALUES (1, '2022-01-02 18:58:09.751407', '2022-01-02 18:58:09.751407', 'admin@rfo.ch', 'Adam', 'Admin', 'ADMIN', NULL),
       (3, '2022-01-02 18:59:14.866300', '2022-01-02 18:59:14.866300', 'agent@rfo.ch', 'Alice', 'Agent',
        'AGENT', NULL);
/*!40000 ALTER TABLE `user`
    ENABLE KEYS */;
UNLOCK
TABLES;

--
-- Dumping data for table `user_credentials`
--

LOCK
TABLES `user_credentials` WRITE;
/*!40000 ALTER TABLE `user_credentials`
    DISABLE KEYS */;
INSERT INTO `user_credentials`
VALUES (2, '2022-01-02 18:58:09.751341', '2022-01-02 18:58:43.206546',
        '$2a$10$TtXih8lHxfMGLAOYJUZpFOuiB4Uc2OV2Jx0ZSIGIJgkwM337SkyF.', '2022-01-02 18:58:43.206546', 1),
       (4, '2022-01-02 18:59:14.866284', '2022-01-02 18:59:45.431084',
        '$2a$10$jLH2ZeY.ejnuD3aV94k/iuk8Sfr8lzaU3/.5VEvuff3Q8FoE7eCs6', '2022-01-02 18:59:45.431084', 3);
/*!40000 ALTER TABLE `user_credentials`
    ENABLE KEYS */;
UNLOCK
TABLES;

--
-- Dumping data for table `vehicle`
--

LOCK
TABLES `vehicle` WRITE;
/*!40000 ALTER TABLE `vehicle` DISABLE KEYS */;
INSERT INTO `vehicle`
VALUES (1,'2022-05-09 19:22:15.000000','2022-05-09 19:22:18.000000',TRUE,'Toyota Van 8 Plätze'),
       (2,'2022-05-09 19:22:15.000000','2022-05-09 19:22:18.000000',TRUE,'Skoda Kombi 4 Plätze'),
       (3,'2022-05-09 19:22:15.000000','2022-05-09 19:22:18.000000',TRUE,'Mercedes Bus 16 Plätze'),
       (4,'2022-05-09 19:22:15.000000','2022-05-09 19:22:18.000000',FALSE,'Car 40 Plätze'),
       (5,'2022-05-09 19:22:15.000000','2022-05-09 19:22:18.000000',TRUE,'Mercedes Bus 30 Plätze');
/*!40000 ALTER TABLE `vehicle` ENABLE KEYS */;
UNLOCK
TABLES;

--
-- Dumping data for table `trailer`
--

LOCK
TABLES `trailer` WRITE;
/*!40000 ALTER TABLE `trailer` DISABLE KEYS */;
INSERT INTO `trailer`
VALUES (1,_utf8'2022-05-09 19:22:15.000000',_utf8'2022-05-09 19:22:18.000000',TRUE,_utf8'Beleuchtungsanhänger'),
       (2,_utf8'2022-05-09 19:22:15.000000',_utf8'2022-05-09 19:22:18.000000',TRUE,_utf8'3-Seiten-Kipper - Ring'),
       (3,_utf8'2022-05-09 19:22:15.000000',_utf8'2022-05-09 19:22:18.000000',FALSE,_utf8'ZS-Anhänger - Ring'),
       (4,_utf8'2022-05-09 19:22:15.000000',_utf8'2022-05-09 19:22:18.000000',TRUE,_utf8'Wasseranhänger'),
       (5,_utf8'2022-05-09 19:22:15.000000',_utf8'2022-05-09 19:22:18.000000',TRUE,_utf8'Ring-Kupplung'),
       (6,_utf8'2022-05-09 19:22:15.000000',_utf8'2022-05-09 19:22:18.000000',TRUE,_utf8'Kugel-Kupplung');
/*!40000 ALTER TABLE `trailer` ENABLE KEYS */;
UNLOCK
    TABLES;

/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE = @OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS = @OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS = @OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT = @OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS = @OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION = @OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES = @OLD_SQL_NOTES */;

-- Dump completed on 2022-02-16 10:27:47