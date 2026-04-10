-- MySQL dump 10.13  Distrib 8.0.43, for Linux (x86_64)
--
-- Host: localhost    Database: analisis_financiero_db
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `gastos_administrativos`
--

DROP TABLE IF EXISTS `gastos_administrativos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gastos_administrativos` (
  `id_gasto_admin` int NOT NULL AUTO_INCREMENT,
  `fk_id_proyecto` int NOT NULL,
  `concepto` varchar(255) DEFAULT NULL,
  `monto_mensual` decimal(18,4) DEFAULT NULL,
  PRIMARY KEY (`id_gasto_admin`),
  KEY `fk_id_proyecto` (`fk_id_proyecto`),
  CONSTRAINT `gastos_administrativos_ibfk_1` FOREIGN KEY (`fk_id_proyecto`) REFERENCES `proyectos` (`id_proyecto`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gastos_administrativos`
--

LOCK TABLES `gastos_administrativos` WRITE;
/*!40000 ALTER TABLE `gastos_administrativos` DISABLE KEYS */;
INSERT INTO `gastos_administrativos` VALUES (1,4,'Salarios',800.0000),(2,5,'Sueldos Oficina',1000.0000),(3,6,'Sueldo Gerente',15000.0000),(4,7,'Sueldo Gerente',15000.0000),(12,8,'Sueldo Gerente',15000.0000),(13,8,'Sueldo Gerente',15000.0000),(15,9,'Renta',20000.0000);
/*!40000 ALTER TABLE `gastos_administrativos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gastos_indirectos_fijos`
--

DROP TABLE IF EXISTS `gastos_indirectos_fijos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gastos_indirectos_fijos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fk_id_proyecto` int NOT NULL,
  `concepto` varchar(255) DEFAULT NULL,
  `monto_anual` decimal(18,4) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_id_proyecto` (`fk_id_proyecto`),
  CONSTRAINT `gastos_indirectos_fijos_ibfk_1` FOREIGN KEY (`fk_id_proyecto`) REFERENCES `proyectos` (`id_proyecto`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gastos_indirectos_fijos`
--

LOCK TABLES `gastos_indirectos_fijos` WRITE;
/*!40000 ALTER TABLE `gastos_indirectos_fijos` DISABLE KEYS */;
INSERT INTO `gastos_indirectos_fijos` VALUES (3,8,'Renta ',600000.0000),(4,8,'Renta ',600000.0000),(6,9,'sdasda',2121.0000);
/*!40000 ALTER TABLE `gastos_indirectos_fijos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gastos_indirectos_variables`
--

DROP TABLE IF EXISTS `gastos_indirectos_variables`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gastos_indirectos_variables` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fk_id_proyecto` int NOT NULL,
  `concepto` varchar(255) DEFAULT NULL,
  `por_unidad` decimal(18,4) DEFAULT NULL,
  `unidad` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_id_proyecto` (`fk_id_proyecto`),
  CONSTRAINT `gastos_indirectos_variables_ibfk_1` FOREIGN KEY (`fk_id_proyecto`) REFERENCES `proyectos` (`id_proyecto`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gastos_indirectos_variables`
--

LOCK TABLES `gastos_indirectos_variables` WRITE;
/*!40000 ALTER TABLE `gastos_indirectos_variables` DISABLE KEYS */;
INSERT INTO `gastos_indirectos_variables` VALUES (3,8,'Vasos y Tapas',2.0000,''),(4,8,'Vasos y Tapas9',2.0000,''),(6,9,'sasEE',10000.0000,'3');
/*!40000 ALTER TABLE `gastos_indirectos_variables` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gastos_ventas`
--

DROP TABLE IF EXISTS `gastos_ventas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gastos_ventas` (
  `id_gasto_ventas` int NOT NULL AUTO_INCREMENT,
  `fk_id_proyecto` int NOT NULL,
  `concepto` varchar(255) DEFAULT NULL,
  `porcentaje_sobre_ventas` decimal(10,4) DEFAULT NULL,
  PRIMARY KEY (`id_gasto_ventas`),
  KEY `fk_id_proyecto` (`fk_id_proyecto`),
  CONSTRAINT `gastos_ventas_ibfk_1` FOREIGN KEY (`fk_id_proyecto`) REFERENCES `proyectos` (`id_proyecto`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gastos_ventas`
--

LOCK TABLES `gastos_ventas` WRITE;
/*!40000 ALTER TABLE `gastos_ventas` DISABLE KEYS */;
INSERT INTO `gastos_ventas` VALUES (1,5,'Comisiones',10.0000),(2,6,'Publicidad',3.0000),(3,7,'Publicidad',3.0000),(11,8,'Publicidad',3.0000),(12,8,'Publicidad',3.0000),(14,9,'luz',3.0000);
/*!40000 ALTER TABLE `gastos_ventas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inversiones`
--

DROP TABLE IF EXISTS `inversiones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inversiones` (
  `id_inversion` int NOT NULL AUTO_INCREMENT,
  `fk_id_proyecto` int NOT NULL,
  `nombre_activo` varchar(255) DEFAULT NULL,
  `monto` decimal(18,4) DEFAULT NULL,
  `vida_util_anios` int DEFAULT NULL,
  `metodo_depreciacion` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id_inversion`),
  KEY `fk_id_proyecto` (`fk_id_proyecto`),
  CONSTRAINT `inversiones_ibfk_1` FOREIGN KEY (`fk_id_proyecto`) REFERENCES `proyectos` (`id_proyecto`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inversiones`
--

LOCK TABLES `inversiones` WRITE;
/*!40000 ALTER TABLE `inversiones` DISABLE KEYS */;
INSERT INTO `inversiones` VALUES (2,4,'CPU',12000.0000,5,'lineal'),(3,5,'Maquiana Cortadora',5000.0000,5,'lineal'),(4,6,'Maquina Espresso',100000.0000,5,'lineal'),(5,7,'Maquina Espresso',100000.0000,5,'lineal'),(6,6,'Mobiliario',50000.0000,10,'lineal'),(7,7,'Mobiliario',50000.0000,10,'lineal'),(22,8,'Maquina Espresso',100000.0000,5,'lineal'),(23,8,'Maquina Espresso',100000.0000,5,'lineal'),(24,8,'Mobiliario',50000.0000,10,'lineal'),(25,8,'Mobiliario',50000.0000,10,'lineal'),(27,9,'asdadqw',100.0000,5,'lineal');
/*!40000 ALTER TABLE `inversiones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `materias_primas`
--

DROP TABLE IF EXISTS `materias_primas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `materias_primas` (
  `id_materia_prima` int NOT NULL AUTO_INCREMENT,
  `fk_id_proyecto` int NOT NULL,
  `nombre_mp` varchar(255) DEFAULT NULL,
  `cantidad_por_unidad_prod` decimal(18,4) DEFAULT NULL,
  `unidad_medida` varchar(50) DEFAULT NULL,
  `costo_unitario` decimal(18,4) DEFAULT NULL,
  PRIMARY KEY (`id_materia_prima`),
  KEY `fk_id_proyecto` (`fk_id_proyecto`),
  CONSTRAINT `materias_primas_ibfk_1` FOREIGN KEY (`fk_id_proyecto`) REFERENCES `proyectos` (`id_proyecto`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `materias_primas`
--

LOCK TABLES `materias_primas` WRITE;
/*!40000 ALTER TABLE `materias_primas` DISABLE KEYS */;
INSERT INTO `materias_primas` VALUES (1,4,'Otros',8.0000,'100',75.0000),(2,5,'Madera',2.0000,'KG',10.0000),(3,6,'Cafe',0.5000,'KG',100.0000),(4,7,'Cafe',0.5000,'KG',100.0000),(5,6,'Leche',1.0000,'Litro',20.0000),(6,7,'Leche',1.0000,'Litro',20.0000),(21,8,'Cafe',0.5000,'KG',100.0000),(22,8,'Cafe',0.5000,'KG',100.0000),(23,8,'Leche',1.0000,'Litro',20.0000),(24,8,'Leche',1.0000,'Litro',20.0000),(26,9,'lolas',2.0000,'kg',13.0000);
/*!40000 ALTER TABLE `materias_primas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `proyectos`
--

DROP TABLE IF EXISTS `proyectos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `proyectos` (
  `id_proyecto` int NOT NULL AUTO_INCREMENT,
  `nombre_proyecto` varchar(255) NOT NULL,
  `poblacion_total` bigint DEFAULT NULL,
  `pct_mujeres` decimal(10,4) DEFAULT NULL,
  `pct_rango_edad` decimal(10,4) DEFAULT NULL,
  `pct_poblacion_ocupada` decimal(10,4) DEFAULT NULL,
  `pct_concentracion_mercado` decimal(10,4) DEFAULT NULL,
  `participacion_mercado` decimal(10,4) DEFAULT NULL,
  `incremento_poblacion` decimal(10,4) DEFAULT NULL,
  `incremento_producto` decimal(10,4) DEFAULT NULL,
  `penetracion_inicial` decimal(10,4) DEFAULT NULL,
  `incremento_penetracion` decimal(10,4) DEFAULT NULL,
  `precio_unitario_base` decimal(18,4) DEFAULT NULL,
  `incremento_precio` decimal(10,4) DEFAULT NULL,
  `unidades_venta_a1` decimal(18,2) DEFAULT NULL,
  `unidades_venta_a2` decimal(18,2) DEFAULT NULL,
  `unidades_venta_a3` decimal(18,2) DEFAULT NULL,
  `unidades_venta_a4` decimal(18,2) DEFAULT NULL,
  `unidades_venta_a5` decimal(18,2) DEFAULT NULL,
  `dias_credito_ventas` int DEFAULT NULL,
  `dias_credito_compras` int DEFAULT NULL,
  `descuento_pronto_pago` decimal(10,4) DEFAULT NULL,
  `inv_inicial_prod` decimal(18,2) DEFAULT NULL,
  `inv_final_a1` decimal(18,2) DEFAULT NULL,
  `inv_final_a2` decimal(18,2) DEFAULT NULL,
  `inv_final_a3` decimal(18,2) DEFAULT NULL,
  `inv_final_a4` decimal(18,2) DEFAULT NULL,
  `inv_final_a5` decimal(18,2) DEFAULT NULL,
  `inv_inicial_mp` decimal(18,2) DEFAULT NULL,
  `inv_final_mp_pct` decimal(10,4) DEFAULT NULL,
  `tiempo_unidad_mo` decimal(18,4) DEFAULT NULL,
  `costo_hora_mo` decimal(18,4) DEFAULT NULL,
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `inversion_inicial` decimal(18,4) DEFAULT NULL,
  `saldo_inicial` decimal(18,4) DEFAULT '0.0000',
  `pct_cobro_efectivo` decimal(10,4) DEFAULT '80.0000',
  `inflacion_anual` decimal(10,4) DEFAULT '0.0000',
  PRIMARY KEY (`id_proyecto`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `proyectos`
--

LOCK TABLES `proyectos` WRITE;
/*!40000 ALTER TABLE `proyectos` DISABLE KEYS */;
INSERT INTO `proyectos` VALUES (4,'PowerBalls',10000,65.0000,23.0000,39.0000,79.0000,30.0000,8.0000,25.0000,18.0000,4.0000,30.5000,6.0000,3.00,5.00,6.00,7.00,9.00,30,30,1.0000,0.00,0.00,0.00,0.00,0.00,0.00,100.00,83.0000,0.2000,30.0000,'2025-11-06 16:44:36',NULL,0.0000,80.0000,0.0000),(5,'Fabrica de Sillas',1000000,50.0000,10.0000,100.0000,100.0000,10.0000,0.0000,0.0000,10.0000,2.0000,100.0000,0.0000,500.00,600.00,700.00,800.00,900.00,30,30,1.0000,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.0000,0.5000,20.0000,'2025-11-07 17:44:12',NULL,0.0000,80.0000,0.0000),(6,'Cafeter├¡a Premium',500000,50.0000,20.0000,80.0000,10.0000,100.0000,2.0000,3.0000,20.0000,5.0000,150.0000,5.0000,8000.00,10500.00,13230.00,16207.00,19448.00,0,15,2.0000,50.00,80.00,100.00,0.00,0.00,0.00,0.00,15.0000,0.1000,50.0000,'2025-11-10 15:13:14',150000.0000,0.0000,80.0000,0.0000),(7,'Cafeter├¡a Premium',500000,50.0000,20.0000,80.0000,10.0000,100.0000,2.0000,3.0000,20.0000,5.0000,150.0000,5.0000,8000.00,10500.00,13230.00,16207.00,19448.00,0,15,2.0000,50.00,80.00,100.00,0.00,0.00,0.00,0.00,15.0000,0.1000,50.0000,'2025-11-10 15:13:17',150000.0000,0.0000,80.0000,0.0000),(8,'Cafet11er├¡a Premiumum',500000,50.0000,20.0000,80.0000,10.0000,100.0000,2.0000,3.0000,20.0000,5.0000,150.0000,5.0000,8000.00,10500.00,13230.00,16207.00,19448.00,0,15,2.0000,50.00,80.00,100.00,0.00,0.00,0.00,0.00,15.0000,0.1000,50.0000,'2025-11-10 15:13:20',150000.0000,0.0000,80.0000,0.0000),(9,'Profe redes loco',14353412,12.0000,34.0000,87.0000,79.0000,5.0000,2.0000,3.0000,10.0000,2.0000,26.0000,2.0000,1.00,2.00,3.00,5.00,9.00,34,23,3.0000,2.00,3.00,3.00,0.00,0.00,0.00,23.00,10.0000,0.7000,16.0000,'2025-11-12 17:58:11',100000.0000,0.0000,80.0000,0.0000);
/*!40000 ALTER TABLE `proyectos` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-26 21:15:19
