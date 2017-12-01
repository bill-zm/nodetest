-- MySQL dump 10.13  Distrib 5.6.26, for Win64 (x86_64)
--
-- Host: localhost    Database: ucon_remote
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

USE `ucon_generic`

--
-- Table structure for table `brand`
--

DROP TABLE IF EXISTS `brand`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `brand` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `category_id` int(11) NOT NULL,
  `category_name` varchar(32) DEFAULT NULL,
  `status` tinyint(2) NOT NULL DEFAULT '1',
  `create_time` char(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8 COMMENT='brand of family equipment';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `brand`
--

LOCK TABLES `brand` WRITE;
/*!40000 ALTER TABLE `brand` DISABLE KEYS */;
INSERT INTO `brand` VALUES (1,'奥克斯',1,'空调',1,'2015-02-02 15:00:00'),(2,'长虹',1,'空调',1,'2015-02-02 15:00:00'),(3,'春兰',1,'空调',1,'2015-02-02 15:00:00'),(4,'格力',1,'空调',1,'2015-02-02 15:00:00'),(5,'海尔',1,'空调',1,'2015-02-02 15:00:00'),(6,'海信',1,'空调',1,'2015-02-02 15:00:00'),(7,'康佳',1,'空调',1,'2015-02-02 15:00:00'),(8,'科龙',1,'空调',1,'2015-02-02 15:00:00'),(9,'美的',1,'空调',1,'2015-02-02 15:00:00'),(10,'TCL',1,'空调',1,'2015-02-02 15:00:00'),(11,'志高',1,'空调',1,'2015-02-02 15:00:00'),(12,'澳柯玛',1,'空调',1,'2015-02-02 15:00:00'),(13,'LG',2,'电视机',1,'2015-02-02 15:00:00'),(14,'TCL',2,'电视机',1,'2015-02-02 15:00:00'),(15,'三星',2,'电视机',1,'2015-02-02 15:00:00'),(16,'东芝',2,'电视机',1,'2015-02-02 15:00:00'),(17,'创维',2,'电视机',1,'2015-02-02 15:00:00'),(18,'夏普',2,'电视机',1,'2015-02-02 15:00:00'),(19,'康佳',2,'电视机',1,'2015-02-02 15:00:00'),(20,'日立',2,'电视机',1,'2015-02-02 15:00:00'),(21,'松下',2,'电视机',1,'2015-02-02 15:00:00'),(22,'海信',2,'电视机',1,'2015-02-02 15:00:00'),(23,'海尔',2,'电视机',1,'2015-02-02 15:00:00'),(24,'索尼',2,'电视机',1,'2015-02-02 15:00:00'),(25,'长虹',2,'电视机',1,'2015-02-02 15:00:00'),(26,'飞利浦',2,'电视机',1,'2015-02-02 15:00:00'),(27,'小米盒子',4,'网络盒子',1,'2015-02-02 15:00:00'),(28,'小米盒子2',4,'网络盒子',1,'2015-02-02 15:00:00'),(29,'天猫魔盒',4,'网络盒子',1,'2015-02-02 15:00:00'),(30,'天猫魔盒2',4,'网络盒子',1,'2015-02-02 15:00:00'),(31,'华为盒子',4,'网络盒子',1,'2015-02-02 15:00:00');
/*!40000 ALTER TABLE `brand` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2015-08-03 17:05:32
