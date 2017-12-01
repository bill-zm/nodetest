-- MySQL dump 10.13  Distrib 5.6.26, for Win64 (x86_64)
--
-- Host: localhost    Database: ucon_generic
-- ------------------------------------------------------
-- Server version	5.6.26-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

use `ucon_generic`;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `status` tinyint(2) DEFAULT '1',
  `create_time` char(20) NOT NULL,
  `radio_type` tinyint(4) DEFAULT NULL,
  `ble_mode` tinyint(4) DEFAULT NULL,
  `applied_version` varchar(20) DEFAULT NULL,
  `banned_version` varchar(20) DEFAULT NULL,
  `name_en` varchar(32) DEFAULT NULL,
  `name_tw` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8 COMMENT='category of family equipment';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES (1,'空调',1,'2015-02-02 15:00:00',0,0,'V1.0.0','V99.0.0','AC','空調'),(2,'电视机',1,'2015-02-02 15:00:00',0,0,'V1.0.0','V99.0.0','TV','電視機'),(3,'机顶盒',1,'2015-02-02 15:00:00',0,0,'V1.0.0','V99.0.0','STB','機上盒'),(4,'网络盒子',1,'2015-02-02 15:00:00',0,0,'V1.0.0','V99.0.0','BOX','網路盒子'),(5,'IPTV',1,'2015-04-07 22:00:00',0,0,'V1.5.3','V99.0.0','IPTV','IPTV'),(6,'DVD',1,'2015-04-07 22:00:00',0,0,'V1.8.5','V99.0.0','DVD','DVD'),(7,'风扇',1,'2015-04-07 22:00:00',0,0,'V1.8.5','V99.0.0','FAN','風扇'),(8,'投影仪',1,'2015-04-07 22:00:00',0,0,'V1.8.5','V99.0.0','AIR CLEANER','空氣淨化器'),(9,'音响',1,'2015-04-06 10:00:00',1,0,'V1.8.5','V99.0.0','PRO','音響'),(10,'蓝牙设备',2,'2015-04-06 10:00:00',0,0,'V99.0.0','V99.0.0','BLUETOOTH','藍牙設備'),(11,'WIFI设备',2,'2015-10-09 16:00:00',0,0,'V99.0.0','V99.0.0','WIFI','WIFI');
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-02-12 21:43:32
