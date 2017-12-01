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
-- Table structure for table `ir_protocol`
--

DROP TABLE IF EXISTS `ir_protocol`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ir_protocol` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) DEFAULT NULL,
  `status` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=85 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ir_protocol`
--

LOCK TABLES `ir_protocol` WRITE;
/*!40000 ALTER TABLE `ir_protocol` DISABLE KEYS */;
INSERT INTO `ir_protocol` VALUES (1,'tcl01',1),(2,'m50560',1),(3,'changhong04',1),(4,'rca_53_8k',1),(5,'songxia',1),(6,'upd6121',1),(7,'lc7464m_panasonic',1),(8,'dvb_40bit',1),(9,'changhong03',1),(10,'geli05',1),(11,'haier06',1),(12,'lc7461m_c13',1),(13,'chunlan2',1),(14,'sanling388',1),(15,'aokema02a',1),(16,'tc9012f',1),(17,'aokesi01',1),(18,'geli07',1),(19,'changhong02',1),(20,'fushitong30',1),(21,'tcl04',1),(22,'tc9012',1),(23,'m50462',1),(24,'kelong04',1),(25,'m50560_001p_003p',1),(26,'geli06',1),(27,'meidi04',1),(28,'huizhou',1),(29,'hualing1',1),(30,'dongzhi1',1),(31,'kelong05',1),(32,'xinfei1',1),(33,'konka_kk_y261',1),(34,'philips_rc6',1),(35,'xinnuo',1),(36,'rca_38k',1),(37,'mn6014w_c5d6',1),(38,'custom_6bit',1),(39,'geli10',1),(40,'dongzhi1s',1),(41,'sanling9nv',1),(42,'haier07',1),(43,'haier05',1),(44,'tcl03',1),(45,'aokema02',1),(46,'upd6124',1),(47,'sanling1',1),(48,'haier15',1),(49,'m3004_6c_lab1',1),(50,'r11hg',1),(51,'50560',1),(52,'haier08',1),(53,'sanling7',1),(54,'philips',1),(55,'geli08',1),(56,'aokesi07',1),(57,'upd6121g',1),(58,'dvb_pan_7051',1),(59,'haier02',1),(60,'haier09',1),(61,'rca_56k',1),(62,'saa3010_rc5',1),(63,'aokema01',1),(64,'meidi03',1),(65,'m50119p',1),(66,'r11gh',1),(67,'custom_6bit',1),(68,'aokesi06',1),(69,'huabao06',1),(70,'nec6122',1),(71,'victor_c8d8',1),(72,'thomson_rct311',1),(73,'topway_hddvb',1),(74,'sharp_ix0773ce',1),(75,'geli09',1),(76,'haier10s',1),(77,'haier10',1),(78,'aux7',1),(79,'haier04',1),(80,'mn6014a_w_c6d6',1),(81,'47w6500-ca',1),(82,'tcl02',1),(83,'xinnuo',1),(84,'haixin01',1);
/*!40000 ALTER TABLE `ir_protocol` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2015-08-03 17:06:10
