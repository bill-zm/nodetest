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
) ENGINE=InnoDB AUTO_INCREMENT=99 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ir_protocol`
--

LOCK TABLES `ir_protocol` WRITE;
/*!40000 ALTER TABLE `ir_protocol` DISABLE KEYS */;
INSERT INTO `ir_protocol` VALUES (1,'47w6500-ca',1),(2,'50560',1),(3,'aokema01',1),(4,'aokema02',1),(5,'aokema02a',1),(6,'aokesi01',1),(7,'aokesi06',1),(8,'aokesi07',1),(9,'aux7',1),(10,'changhong02',1),(11,'changhong03',1),(12,'changhong04',1),(13,'chunlan2',1),(14,'custom_6bit',1),(16,'dongzhi1',1),(17,'dongzhi1s',1),(18,'dvb_40bit',1),(19,'dvb_pan_7051',1),(20,'fushitong30',1),(21,'geli05',1),(22,'geli06',1),(23,'geli07',1),(24,'geli08',1),(25,'geli09',1),(26,'geli10',1),(27,'r11gh',1),(28,'haier02',1),(29,'haier04',1),(30,'haier05',1),(31,'haier06',1),(32,'haier07',1),(33,'haier08',1),(34,'haier09',1),(35,'haier10',1),(36,'haier10s',1),(37,'haier15',1),(38,'haixin01',1),(39,'huabao06',1),(40,'hualing1',1),(41,'huizhou',1),(42,'kelong04',1),(43,'kelong05',1),(44,'konka_kk_y261',1),(45,'lc7461m_c13',1),(46,'lc7464m_panasonic',1),(47,'m3004_6c_lab1',1),(48,'m50119p',1),(49,'m50462',1),(50,'m50560-r3',1),(51,'m50560',1),(52,'m50560_001p_003p',1),(53,'meidi03',1),(54,'meidi04',1),(55,'mibox-r3',1),(56,'mibox-r6',1),(57,'mibox-r8',1),(58,'mn6014a_w_c6d6',1),(59,'mn6014w_c5d6',1),(60,'nec6122',1),(61,'philips',1),(62,'philips_rc6',1),(63,'r11hg',1),(64,'rca_38k',1),(65,'rca_53_8k',1),(66,'rca_56k',1),(67,'saa3010_rc5-10-r1',1),(68,'saa3010_rc5-11-r1',1),(69,'saa3010_rc5',1),(70,'sanling1',1),(71,'sanling388',1),(72,'sanling7',1),(73,'sanling9nv',1),(74,'sharp_ix0773ce-r2',1),(75,'sharp_ix0773ce-r3',1),(76,'sharp_ix0773ce',1),(77,'songxia',1),(78,'tc9012-1',1),(79,'tc9012',1),(80,'tc9012f',1),(81,'tcl01',1),(82,'tcl02',1),(83,'tcl03',1),(84,'tcl04',1),(85,'thomson_rct311',1),(86,'topway_hddvb',1),(87,'upd6121',1),(88,'upd6121g',1),(89,'upd6121g_001-r1',1),(90,'upd6121g_001-r2',1),(91,'upd6121g_001-r3',1),(92,'upd6124-r1',1),(93,'upd6124-r3',1),(94,'upd6124',1),(95,'victor_c8d8',1),(96,'xinfei1',1),(97,'xinnuo',1),(98,'dvb_pan_7051_samsung',1);
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

-- Dump completed on 2016-02-17 11:12:54
