-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: tikitos
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `caixa`
--

DROP TABLE IF EXISTS `caixa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `caixa` (
  `id_caixa` int(11) NOT NULL AUTO_INCREMENT,
  `id_usuario` int(11) NOT NULL,
  `id_empresa` int(11) NOT NULL,
  `abertura` datetime NOT NULL,
  `fechamento` datetime DEFAULT NULL,
  `valor_inicial` decimal(10,2) NOT NULL,
  `valor_final` decimal(10,2) DEFAULT NULL,
  `status` enum('aberto','fechado') DEFAULT 'aberto',
  PRIMARY KEY (`id_caixa`),
  KEY `id_usuario` (`id_usuario`),
  KEY `id_empresa` (`id_empresa`),
  CONSTRAINT `caixa_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`),
  CONSTRAINT `caixa_ibfk_2` FOREIGN KEY (`id_empresa`) REFERENCES `empresas` (`id_empresa`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `caixa`
--

LOCK TABLES `caixa` WRITE;
/*!40000 ALTER TABLE `caixa` DISABLE KEYS */;
INSERT INTO `caixa` VALUES (1,101,200,'2025-10-05 13:45:34','2025-10-05 13:47:04',100.00,2000.00,'fechado'),(2,101,200,'2025-10-03 08:42:46','2025-10-03 16:12:26',100.00,-71.50,'fechado'),(3,100,200,'2025-10-05 14:22:45','2025-10-05 20:02:09',100.00,798.50,'fechado'),(6,101,200,'2025-11-06 21:35:10','2025-11-24 21:55:48',100.00,691.30,'fechado'),(7,101,200,'2025-11-01 21:56:09',NULL,100.00,100.00,'aberto'),(8,101,200,'2025-11-01 21:56:09',NULL,100.00,100.00,'aberto');
/*!40000 ALTER TABLE `caixa` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categorias`
--

DROP TABLE IF EXISTS `categorias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categorias` (
  `id_categoria` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `status` enum('ativo','inativo') DEFAULT 'ativo',
  PRIMARY KEY (`id_categoria`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categorias`
--

LOCK TABLES `categorias` WRITE;
/*!40000 ALTER TABLE `categorias` DISABLE KEYS */;
INSERT INTO `categorias` VALUES (1,'Pelúcias','ativo'),(2,'Bonecos','ativo'),(3,'Veículos','ativo'),(4,'Construção','ativo'),(5,'Jogos e Quebra-Cabeças','ativo'),(6,'Movimento','ativo'),(7,'Aventura e Fantasia','ativo'),(8,'Movimento','ativo');
/*!40000 ALTER TABLE `categorias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `despesas`
--

DROP TABLE IF EXISTS `despesas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `despesas` (
  `id_despesa` int(11) NOT NULL AUTO_INCREMENT,
  `id_empresa` int(11) NOT NULL,
  `data_adicionado` date DEFAULT (curdate()),
  `data_pag` date DEFAULT NULL,
  `descricao` varchar(255) NOT NULL,
  `preco` decimal(10,2) NOT NULL,
  `status` enum('pago','pendente') DEFAULT 'pendente',
  PRIMARY KEY (`id_despesa`),
  KEY `id_empresa` (`id_empresa`),
  CONSTRAINT `despesas_ibfk_1` FOREIGN KEY (`id_empresa`) REFERENCES `empresas` (`id_empresa`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `despesas`
--

LOCK TABLES `despesas` WRITE;
/*!40000 ALTER TABLE `despesas` DISABLE KEYS */;
INSERT INTO `despesas` VALUES (1,200,'2025-10-01','2025-10-01','Compra de papel de embrulho',150.00,'pago'),(2,200,'2025-10-03','2025-10-05','Reparo de vitrine',320.50,'pendente'),(3,200,'2025-10-06','2025-10-06','Compra de brinquedos de reposição',890.00,'pago'),(4,200,'2025-10-10','2025-10-10','Serviço de limpeza externa',250.00,'pago'),(5,200,'2025-10-15','2025-10-18','Conta de energia elétrica',430.75,'pago'),(6,200,'2025-10-20','2025-10-25','Material de escritório',120.00,'pendente'),(7,200,'2025-11-05','2025-11-07','Compra de embalagens',139.90,'pendente'),(9,200,'2025-11-01','2025-11-01','Conta de energia elétrica',680.50,'pago'),(10,200,'2025-11-02','2025-11-03','Compra de embalagens e sacolas',245.90,'pago'),(11,200,'2025-11-05','2025-11-05','Manutenção do ar-condicionado',320.00,'pago'),(12,200,'2025-11-08','2025-11-10','Material de limpeza',156.70,'pago'),(13,200,'2025-11-10','2025-11-10','Conta de água',189.30,'pago'),(14,200,'2025-11-12','2025-11-15','Reposição de estoque - Fornecedor',1850.00,'pago'),(15,200,'2025-11-15','2025-11-15','Material de escritório',98.50,'pago'),(16,200,'2025-11-18','2025-11-20','Serviço de contabilidade',450.00,'pago'),(17,200,'2025-11-20','2025-11-22','Decoração natalina',380.00,'pago'),(18,200,'2025-11-22',NULL,'Manutenção preventiva equipamentos',520.00,'pendente'),(19,200,'2025-11-23','2025-11-23','Internet e telefone',199.90,'pago'),(20,200,'2025-11-25',NULL,'Compra de fitas e adesivos',87.40,'pendente');
/*!40000 ALTER TABLE `despesas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `empresas`
--

DROP TABLE IF EXISTS `empresas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `empresas` (
  `id_empresa` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `tipo` enum('matriz','filial') NOT NULL,
  `endereco` varchar(200) DEFAULT NULL,
  `status` enum('ativo','inativo') DEFAULT 'ativo',
  PRIMARY KEY (`id_empresa`)
) ENGINE=InnoDB AUTO_INCREMENT=206 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `empresas`
--

LOCK TABLES `empresas` WRITE;
/*!40000 ALTER TABLE `empresas` DISABLE KEYS */;
INSERT INTO `empresas` VALUES (100,'Tikitos Matriz','matriz','R. Boa Vista, 825 - Boa Vista, São Caetano do Sul - SP, 09572-300','ativo'),(200,'Tikitos Mooca','filial','R. do Oratório, 215 - Mooca, São Paulo - SP, 03117-000','ativo'),(203,'Tikitos Piracicaba','filial','Av. Mal. Castelo Branco, 1000 - Jardim Primavera, Piracicaba - SP, 13412-010','inativo'),(204,'Tikitos São Bernardo','filial','Av. Pereira Barreto, 456 - Baeta Neves, São Bernardo do Campo - SP, 09751-000','ativo'),(205,'Tikitos Santo André','filial','Av. Santos Dumont, 300 - Ipiranguinha, Santo André - SP, 09015-320','ativo');
/*!40000 ALTER TABLE `empresas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fornecedores`
--

DROP TABLE IF EXISTS `fornecedores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fornecedores` (
  `id_fornecedor` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL,
  `data_criado` date DEFAULT (curdate()),
  `status` enum('ativo','inativo') DEFAULT 'ativo',
  PRIMARY KEY (`id_fornecedor`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fornecedores`
--

LOCK TABLES `fornecedores` WRITE;
/*!40000 ALTER TABLE `fornecedores` DISABLE KEYS */;
INSERT INTO `fornecedores` VALUES (1,'Tikitos Indústria de Brinquedos S.A.','2025-10-15','ativo'),(2,'Embalagens Criativas LTDA','2025-10-15','ativo'),(3,'Transportadora Alegria Express','2025-10-15','ativo');
/*!40000 ALTER TABLE `fornecedores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `movimento_estoque`
--

DROP TABLE IF EXISTS `movimento_estoque`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `movimento_estoque` (
  `id_movimento` int(11) NOT NULL AUTO_INCREMENT,
  `id_produto` int(11) NOT NULL,
  `id_empresa` int(11) NOT NULL,
  `tipo` enum('entrada','saída','ajuste') NOT NULL,
  `quantidade` int(11) NOT NULL,
  `data_movimento` datetime DEFAULT current_timestamp(),
  `origem` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id_movimento`),
  KEY `id_produto` (`id_produto`),
  KEY `id_empresa` (`id_empresa`),
  CONSTRAINT `movimento_estoque_ibfk_1` FOREIGN KEY (`id_produto`) REFERENCES `produtos` (`id_produto`),
  CONSTRAINT `movimento_estoque_ibfk_2` FOREIGN KEY (`id_empresa`) REFERENCES `empresas` (`id_empresa`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `movimento_estoque`
--

LOCK TABLES `movimento_estoque` WRITE;
/*!40000 ALTER TABLE `movimento_estoque` DISABLE KEYS */;
INSERT INTO `movimento_estoque` VALUES (1,2003,200,'saída',1,'2025-11-22 22:58:55','Venda #26 - Caixa 6 (Davi)'),(2,3002,200,'saída',1,'2025-11-24 11:24:14','Venda #27 - Caixa 6 (Davi)'),(3,2001,200,'saída',1,'2025-11-24 11:54:19','Venda #28 - Caixa 6 (Davi)'),(4,1001,200,'saída',1,'2025-11-24 11:54:19','Venda #28 - Caixa 6 (Davi)'),(5,2002,200,'saída',1,'2025-11-24 11:54:19','Venda #28 - Caixa 6 (Davi)'),(6,2003,200,'saída',1,'2025-11-24 11:54:19','Venda #28 - Caixa 6 (Davi)'),(7,2005,200,'saída',1,'2025-11-24 11:54:19','Venda #28 - Caixa 6 (Davi)'),(8,2004,200,'saída',1,'2025-11-24 11:54:19','Venda #28 - Caixa 6 (Davi)'),(9,1001,200,'saída',1,'2025-11-24 12:08:44','Venda #29 - Caixa 6 (Davi)'),(10,2003,200,'saída',1,'2025-11-24 12:14:29','Venda #30 - Caixa 6 (Davi)'),(11,2005,200,'saída',1,'2025-11-24 12:14:30','Venda #30 - Caixa 6 (Davi)'),(12,1001,200,'saída',1,'2025-11-24 21:52:47','Venda #31 - Caixa 6 (Davi)'),(13,2004,200,'saída',1,'2025-11-24 21:52:48','Venda #31 - Caixa 6 (Davi)'),(14,2005,200,'saída',1,'2025-11-24 21:52:48','Venda #31 - Caixa 6 (Davi)'),(15,3002,200,'saída',1,'2025-11-24 21:52:48','Venda #31 - Caixa 6 (Davi)'),(16,3001,200,'saída',1,'2025-11-24 21:52:48','Venda #31 - Caixa 6 (Davi)'),(17,2006,200,'saída',1,'2025-11-24 21:52:48','Venda #31 - Caixa 6 (Davi)'),(18,1001,200,'entrada',1,'2025-11-24 22:15:31','Estorno #31 - Caixa 2 (Davi)'),(19,3001,200,'entrada',2,'2025-11-24 22:15:31','Estorno #31 - Caixa 2 (Davi)'),(20,2003,200,'entrada',1,'2025-11-24 22:15:31','Estorno #31 - Caixa 2 (Davi)'),(21,3002,200,'entrada',1,'2025-11-24 22:15:31','Estorno #31 - Caixa 2 (Davi)'),(22,2001,200,'entrada',1,'2025-11-24 22:15:31','Estorno #31 - Caixa 2 (Davi)'),(23,1001,200,'entrada',1,'2025-11-24 22:15:31','Estorno #31 - Caixa 2 (Davi)'),(24,2002,200,'entrada',1,'2025-11-24 22:15:31','Estorno #31 - Caixa 2 (Davi)'),(25,2003,200,'entrada',1,'2025-11-24 22:15:31','Estorno #31 - Caixa 2 (Davi)'),(26,2005,200,'entrada',1,'2025-11-24 22:15:31','Estorno #31 - Caixa 2 (Davi)'),(27,2004,200,'entrada',1,'2025-11-24 22:15:31','Estorno #31 - Caixa 2 (Davi)'),(28,1001,200,'entrada',1,'2025-11-24 22:15:31','Estorno #31 - Caixa 2 (Davi)'),(29,2003,200,'entrada',1,'2025-11-24 22:15:31','Estorno #31 - Caixa 2 (Davi)'),(30,2005,200,'entrada',1,'2025-11-24 22:15:31','Estorno #31 - Caixa 2 (Davi)'),(31,1001,200,'entrada',1,'2025-11-24 22:15:31','Estorno #31 - Caixa 2 (Davi)'),(32,2006,200,'entrada',1,'2025-11-24 22:15:31','Estorno #31 - Caixa 2 (Davi)'),(33,2005,200,'entrada',1,'2025-11-24 22:15:32','Estorno #31 - Caixa 2 (Davi)'),(34,3001,200,'entrada',1,'2025-11-24 22:15:32','Estorno #31 - Caixa 2 (Davi)'),(35,2004,200,'entrada',1,'2025-11-24 22:15:32','Estorno #31 - Caixa 2 (Davi)'),(36,3002,200,'entrada',1,'2025-11-24 22:15:32','Estorno #31 - Caixa 2 (Davi)'),(37,1001,200,'entrada',50,'2025-11-01 08:00:00','Reposição - Fornecedor 1'),(38,2003,200,'entrada',30,'2025-11-01 08:00:00','Reposição - Fornecedor 1'),(39,3001,200,'entrada',40,'2025-11-12 09:00:00','Pedido #125 - Fornecedor 1'),(40,3002,200,'entrada',35,'2025-11-12 09:00:00','Pedido #125 - Fornecedor 1'),(41,4001,200,'entrada',25,'2025-11-12 09:00:00','Pedido #125 - Fornecedor 1');
/*!40000 ALTER TABLE `movimento_estoque` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `produto_loja`
--

DROP TABLE IF EXISTS `produto_loja`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `produto_loja` (
  `id_produto_loja` int(11) NOT NULL AUTO_INCREMENT,
  `id_produto` int(11) NOT NULL,
  `id_empresa` int(11) NOT NULL,
  `desconto` decimal(10,2) DEFAULT 0.00,
  `estoque` int(11) DEFAULT 0,
  PRIMARY KEY (`id_produto_loja`),
  KEY `id_produto` (`id_produto`),
  KEY `id_empresa` (`id_empresa`),
  CONSTRAINT `produto_loja_ibfk_1` FOREIGN KEY (`id_produto`) REFERENCES `produtos` (`id_produto`),
  CONSTRAINT `produto_loja_ibfk_2` FOREIGN KEY (`id_empresa`) REFERENCES `empresas` (`id_empresa`)
) ENGINE=InnoDB AUTO_INCREMENT=145 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `produto_loja`
--

LOCK TABLES `produto_loja` WRITE;
/*!40000 ALTER TABLE `produto_loja` DISABLE KEYS */;
INSERT INTO `produto_loja` VALUES (5,1001,200,10.00,15),(6,2001,200,0.00,1),(7,2002,200,0.00,7),(8,2003,200,0.00,8),(9,2004,200,0.00,9),(10,2005,200,0.00,6),(11,2006,200,0.00,20),(12,3001,200,0.00,12),(13,3002,200,0.00,18),(14,3003,200,0.00,20),(15,3004,200,0.00,20),(16,3005,200,0.00,20),(17,3006,200,0.00,20),(18,3007,200,0.00,20),(19,3008,200,0.00,20),(20,4001,200,0.00,14),(21,4002,200,0.00,20),(22,4003,200,0.00,20),(23,4004,200,0.00,20),(24,5001,200,0.00,20),(25,5002,200,0.00,20),(26,5003,200,0.00,20),(27,5004,200,0.00,20),(28,6001,200,0.00,20),(29,6002,200,0.00,20),(30,6003,200,0.00,20),(31,6004,200,0.00,20),(32,6005,200,0.00,20),(33,6006,200,0.00,20),(34,6007,200,0.00,20),(35,7001,200,0.00,20),(36,7002,200,0.00,20),(37,8001,200,0.00,20),(38,8002,200,0.00,20),(39,8003,200,0.00,20),(40,1001,203,0.00,0),(41,3004,203,0.00,0),(42,3005,203,0.00,0),(43,3006,203,0.00,0),(44,2002,203,0.00,0),(45,2001,203,0.00,0),(46,2005,203,0.00,0),(47,2006,203,0.00,0),(48,3002,203,0.00,0),(49,3003,203,0.00,0),(50,3007,203,0.00,0),(51,2004,203,0.00,0),(52,2003,203,0.00,0),(53,3001,203,0.00,0),(54,3008,203,0.00,0),(55,4001,203,0.00,0),(56,4002,203,0.00,0),(57,4003,203,0.00,0),(58,4004,203,0.00,0),(59,5001,203,0.00,0),(60,5002,203,0.00,0),(61,5003,203,0.00,0),(62,5004,203,0.00,0),(63,6001,203,0.00,0),(64,6002,203,0.00,0),(65,6003,203,0.00,0),(66,6004,203,0.00,0),(67,6005,203,0.00,0),(68,6006,203,0.00,0),(69,6007,203,0.00,0),(70,7001,203,0.00,0),(71,7002,203,0.00,0),(72,8001,203,0.00,0),(73,8002,203,0.00,0),(74,8003,203,0.00,0),(75,1001,204,0.00,0),(76,2001,204,0.00,0),(77,2002,204,0.00,0),(78,3004,204,0.00,0),(79,3005,204,0.00,0),(80,3006,204,0.00,0),(81,2004,204,0.00,0),(82,2003,204,0.00,0),(83,2005,204,0.00,0),(84,3007,204,0.00,0),(85,2006,204,0.00,0),(86,3003,204,0.00,0),(87,3001,204,0.00,0),(88,3002,204,0.00,0),(89,4001,204,0.00,0),(90,3008,204,0.00,0),(91,4002,204,0.00,0),(92,4003,204,0.00,0),(93,4004,204,0.00,0),(94,5001,204,0.00,0),(95,5002,204,0.00,0),(96,5003,204,0.00,0),(97,5004,204,0.00,0),(98,6001,204,0.00,0),(99,6002,204,0.00,0),(100,6003,204,0.00,0),(101,6004,204,0.00,0),(102,6005,204,0.00,0),(103,6006,204,0.00,0),(104,6007,204,0.00,0),(105,7001,204,0.00,0),(106,7002,204,0.00,0),(107,8001,204,0.00,0),(108,8002,204,0.00,0),(109,8003,204,0.00,0),(110,1001,205,0.00,0),(111,2002,205,0.00,0),(112,2001,205,0.00,0),(113,2005,205,0.00,0),(114,3001,205,0.00,0),(115,2004,205,0.00,0),(116,2003,205,0.00,0),(117,2006,205,0.00,0),(118,3003,205,0.00,0),(119,3004,205,0.00,0),(120,3002,205,0.00,0),(121,3005,205,0.00,0),(122,3006,205,0.00,0),(123,3007,205,0.00,0),(124,3008,205,0.00,0),(125,4001,205,0.00,0),(126,4002,205,0.00,0),(127,4003,205,0.00,0),(128,4004,205,0.00,0),(129,5001,205,0.00,0),(130,5002,205,0.00,0),(131,5003,205,0.00,0),(132,5004,205,0.00,0),(133,6001,205,0.00,0),(134,6002,205,0.00,0),(135,6003,205,0.00,0),(136,6004,205,0.00,0),(137,6005,205,0.00,0),(138,6006,205,0.00,0),(139,6007,205,0.00,0),(140,7001,205,0.00,0),(141,7002,205,0.00,0),(142,8001,205,0.00,0),(143,8002,205,0.00,0),(144,8003,205,0.00,0);
/*!40000 ALTER TABLE `produto_loja` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `produtos`
--

DROP TABLE IF EXISTS `produtos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `produtos` (
  `id_produto` int(11) NOT NULL AUTO_INCREMENT,
  `id_empresa` int(11) NOT NULL,
  `id_categoria` int(11) DEFAULT NULL,
  `id_fornecedor` int(11) DEFAULT NULL,
  `nome` varchar(255) NOT NULL,
  `descricao` varchar(1000) DEFAULT NULL,
  `custo` decimal(10,2) NOT NULL,
  `lucro` int(11) NOT NULL,
  `preco` decimal(10,2) NOT NULL,
  `imagem` varchar(1000) DEFAULT NULL,
  `status` enum('ativo','inativo') DEFAULT 'ativo',
  PRIMARY KEY (`id_produto`),
  KEY `id_empresa` (`id_empresa`),
  KEY `id_categoria` (`id_categoria`),
  KEY `id_fornecedor` (`id_fornecedor`),
  CONSTRAINT `produtos_ibfk_1` FOREIGN KEY (`id_empresa`) REFERENCES `empresas` (`id_empresa`),
  CONSTRAINT `produtos_ibfk_2` FOREIGN KEY (`id_categoria`) REFERENCES `categorias` (`id_categoria`),
  CONSTRAINT `produtos_ibfk_3` FOREIGN KEY (`id_fornecedor`) REFERENCES `fornecedores` (`id_fornecedor`)
) ENGINE=InnoDB AUTO_INCREMENT=2147483648 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `produtos`
--

LOCK TABLES `produtos` WRITE;
/*!40000 ALTER TABLE `produtos` DISABLE KEYS */;
INSERT INTO `produtos` VALUES (1001,100,1,1,'Urso Teddy','Ursinho de pelúcia macio e antialérgico, ideal para presentear e decorar o quarto das crianças.',35.00,25,59.90,'/img/produtos/urso_teddy.png','ativo'),(2001,100,2,1,'Boneka Dora','Boneca de pano colorida, feita à mão com detalhes em tecido suave.',28.00,18,45.90,'/img/produtos/boneka_dora.png','ativo'),(2002,100,2,1,'Boneko Igolinho','Boneco de urso azul claro com roupa de inverno e desenho de floco de neve.',30.00,20,49.90,'/img/produtos/boneko_igolinho.png','ativo'),(2003,100,2,1,'Senhor Patonildo','Pato de borracha com óculos e expressão divertida. Ideal para banho.',12.00,9,20.90,'/img/produtos/senhor_patonildo.png','ativo'),(2004,100,2,1,'Alien Neco','Alienígena roxo com um olho só e antenas, corpo arredondado e textura macia.',18.00,12,29.90,'/img/produtos/alien_neco.png','ativo'),(2005,100,2,1,'Kachorrilo','Cachorrinho salchicha com rodinhas e corda para puxar. Estimula coordenação motora.',22.00,14,35.90,'/img/produtos/kachorrilo.png','ativo'),(2006,100,2,1,'Robociclo','Boneco robô articulado com design futurista e peças resistentes.',27.00,19,45.90,'/img/produtos/robociclo.png','ativo'),(3001,100,3,1,'Bomber Kar','Carrinho de bombeiro vermelho com escada retrátil e rodas livres.',25.00,15,39.90,'/img/produtos/bomber_kar.png','ativo'),(3002,100,3,1,'Avião Divertido','Avião rosa com asas amarelas e hélices móveis. Seguro e educativo.',30.00,20,49.90,'/img/produtos/aviao_divertido.png','ativo'),(3003,100,3,1,'Aviãozinho','Avião biplano colorido de duas asas paralelas, feito em plástico resistente.',22.00,14,35.90,'/img/produtos/aviao_biplano.png','ativo'),(3004,100,3,1,'Trenziko','Frente de trem estilo maria-fumaça com 6 rodas. Azul e amarelo.',33.00,22,54.90,'/img/produtos/trenziko.png','ativo'),(3005,100,3,1,'Trenzito','Trem de madeira com 3 vagões coloridos, ideal para brincadeiras educativas.',42.00,28,69.90,'/img/produtos/trenzito.png','ativo'),(3006,100,3,1,'Barco Navioleiro','Navio de brinquedo azul e amarelo, flutua na água e estimula a imaginação.',28.00,18,45.90,'/img/produtos/barco_navioleiro.png','ativo'),(3007,100,3,1,'Carriko','Carrinho de corda retrátil. Basta girar a chave e ver ele correr!',12.00,9,20.90,'/img/produtos/carriko.png','ativo'),(3008,100,3,1,'Foguetim','Foguete de brinquedo branco com detalhes vermelhos. Ideal para aventuras espaciais.',25.00,15,39.90,'/img/produtos/foguetim.png','ativo'),(4001,100,4,1,'Blocos Kandy','Blocos plásticos coloridos de montar, compatíveis com outros conjuntos.',35.00,25,59.90,'/img/produtos/blocos_kandy.png','ativo'),(4002,100,4,1,'Blokibetos','Blocos de madeira com letras do alfabeto, ideais para alfabetização infantil.',40.00,30,69.90,'/img/produtos/blokibetos.png','ativo'),(4003,100,4,1,'Blokolos','Blocos de madeira coloridos para construir castelos e casas. Estimula a criatividade.',38.00,27,64.90,'/img/produtos/blokolos.png','ativo'),(4004,100,4,1,'Konstru Jengo','Jogo tipo jenga com peças coloridas de madeira para diversão em grupo.',22.00,15,36.90,'/img/produtos/konstru_jengo.png','ativo'),(5001,100,5,1,'Kebra Cabeça','Quebra-cabeça educativo com peças grandes e resistentes. Ideal para crianças pequenas.',18.00,12,29.90,'/img/produtos/kebra_cabeca.png','ativo'),(5002,100,5,1,'Cartikas','Cartas de baralho ilustradas, resistentes à água e de fácil manuseio.',10.00,8,17.90,'/img/produtos/cartikas.png','ativo'),(5003,100,5,1,'Cubo Magiko','Cubo mágico 3x3 colorido, estimula raciocínio e coordenação motora.',14.00,9,22.90,'/img/produtos/cubo_magiko.png','ativo'),(5004,100,5,1,'Kone do Palhaço','Brinquedo de argolas coloridas para empilhar e desenvolver coordenação.',16.00,11,26.90,'/img/produtos/kone_palhaco.png','ativo'),(6001,100,6,1,'Bola de Praia','Bola inflável colorida, leve e ideal para brincadeiras na areia ou piscina.',8.00,7,14.90,'/img/produtos/bola_praia.png','ativo'),(6002,100,6,1,'Baskete','Mini bola de basquete com cesta, ideal para jogos em casa.',22.00,15,36.90,'/img/produtos/baskete.png','ativo'),(6003,100,6,1,'Pipa Lipa','Pipa colorida e resistente com rabiola longa e fácil de empinar.',10.00,7,16.90,'/img/produtos/pipa_lipa.png','ativo'),(6004,100,6,1,'Balaozinho','Mini balão de passeio colorido. Decoração lúdica e segura.',18.00,12,29.90,'/img/produtos/balaozinho.png','ativo'),(6005,100,6,1,'Tricilo Iclo','Triciclo infantil seguro, colorido e ergonômico.',65.00,35,99.90,'/img/produtos/tricilo_iclo.png','ativo'),(6006,100,6,1,'Vento Kata','Catavento colorido que gira facilmente com o vento. Feito em plástico leve.',6.00,6,11.90,'/img/produtos/vento_kata.png','ativo'),(6007,100,6,1,'Tikoio','Ioiô azul com estrela branca e círculo amarelo no centro. Brinquedo clássico.',8.00,7,15.00,'/img/produtos/tikoio.png','ativo'),(7001,100,7,1,'Dinossauro','Brinquedo de dinossauro articulado, ideal para colecionar e brincar.',28.00,18,45.90,'/img/produtos/dinossauro.png','ativo'),(7002,100,7,1,'Koroa','Coroa de fantasia dourada com pedras coloridas, ideal para brincadeiras de rei e rainha.',10.00,8,17.90,'/img/produtos/koroa.png','ativo'),(8001,100,8,1,'Xilofone Filo','Xilofone colorido infantil que estimula coordenação e percepção musical.',26.00,19,44.90,'/img/produtos/xilofone_filo.png','ativo'),(8002,100,8,1,'Tamborilo','Mini tambor infantil com baquetas, ideal para iniciar na música.',22.00,14,35.90,'/img/produtos/tamborilo.png','ativo'),(8003,100,8,1,'Chokito','Chocalho colorido e seguro para bebês, feito em plástico livre de BPA.',12.00,9,20.90,'/img/produtos/chokito.png','ativo');
/*!40000 ALTER TABLE `produtos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tokens`
--

DROP TABLE IF EXISTS `tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tokens` (
  `id_token` int(11) NOT NULL AUTO_INCREMENT,
  `id_usuario` int(11) NOT NULL,
  `codigo` varchar(255) NOT NULL,
  `expira_em` datetime NOT NULL,
  `verificado` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id_token`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tokens`
--

LOCK TABLES `tokens` WRITE;
/*!40000 ALTER TABLE `tokens` DISABLE KEYS */;
INSERT INTO `tokens` VALUES (2,100,'$2b$10$dHbcS.gs47PMEVJDoQAaSuQnkf8aG6BSb9wyTTqExKSXmfpG1b/li','2025-10-17 16:02:47',0),(4,100,'$2b$10$7G3zYcRiUB.luMz48d4QzeaZQby417RMycE80N0QpnIlfJ.QykHAe','2025-10-22 08:31:11',1),(5,101,'$2b$10$v/K425EXKBqPh.6a2QcAIuMC9H5udJb9lgJlReLE2ZW2tApEdimOy','2025-10-24 13:29:26',0),(6,101,'$2b$10$wkFY51AmKRjIWEy/ij5z1eORn/I9sM0fWhWnxBcMYAzCzUEjdhcSm','2025-10-24 14:06:26',0),(7,101,'$2b$10$TtwHi.m0D4s9sp.fZKzSEO/u20tYHNV9bVMFsufUfCja7ggfp63du','2025-10-24 14:11:01',0),(8,101,'$2b$10$.z1qCE397ZN/HHvqRU72dOErHQUP8Osak./GCtLOqznKiFvSVVUjO','2025-10-24 14:12:45',0),(9,101,'$2b$10$dIZPPd0wBU22X4TaGi201erCrJeN8eIAp7T88LogUXWKxhw51Sl6a','2025-10-24 14:15:07',0),(10,101,'$2b$10$2YFm3KY53xQ97eit5gamkOP6y80HDxOvDbmp2KOtdj.GFaDieM2fq','2025-10-24 14:22:08',1),(11,101,'$2b$10$N2q0QAeiWGV8X.4w1ne6BuSE8QAuyUh.Cr.bBRx94TP4XMgWsv10.','2025-10-24 14:40:39',1),(12,101,'$2b$10$E43i5sMJ25ZbjAFdeYX9yODn80/RQCZCb2.MAImAZ1xu.f.XFzLe.','2025-10-24 16:50:05',1),(13,101,'$2b$10$vw.ua0ka4aMqmvtInDTUou4Gc6VunWLavY.u0ErNJt7T4r9pYexGe','2025-10-24 16:52:46',1),(14,103,'$2b$10$zoejtACIkJ/EfpIdONNQPuHD29m3dsbZ35U6C42znaPl0hxSZrgDC','2025-11-07 14:07:36',1);
/*!40000 ALTER TABLE `tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `telefone` varchar(15) DEFAULT NULL,
  `cpf` char(11) DEFAULT NULL,
  `endereco` varchar(255) DEFAULT NULL,
  `perfil` enum('admin','gerente','vendedor') NOT NULL,
  `senha` varchar(255) NOT NULL,
  `data_nasc` date DEFAULT NULL,
  `id_empresa` int(11) NOT NULL,
  `status` enum('ativo','inativo') DEFAULT 'ativo',
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `cpf` (`cpf`),
  KEY `id_empresa` (`id_empresa`),
  CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`id_empresa`) REFERENCES `empresas` (`id_empresa`)
) ENGINE=InnoDB AUTO_INCREMENT=105 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (100,'Bernardo de Souza Madureira','bernardomadureira.souza@gmail.com','11993001135','47806468803','Rua Maurício Jacquey, 308, Bloco 5, Apto. 81 - Vila Helena, São Bernardo do Campo - SP, 09635-080','gerente','$2b$10$qA/Kd81BFiTOO9hGxYMrdexhnHqrMnkgwt1113yxRbKLsxl.DYEjm','2008-01-24',200,'ativo'),(101,'Davi','davi.leocadio.sen@gmail.com','11968561451','50519831896','Rua Ibatiba, 124','vendedor','$2b$10$QypAp3YAOBMdWwz./y2X7.Vgkp9kCDTK/Bf5QThjiYzlGEzgY/Y1W','2008-04-14',200,'ativo'),(102,'Fernanda Silva K','fernanda.fernanda@fernanda.fer','11987654321','12345678900','Rua das Flores, 123, Apto 12B, Jardim Primavera, São Paulo/SP, 04567-890','vendedor','deve_mudar','1998-07-15',200,'ativo'),(103,'Nicoly Carine Martinelli Beja','nicoly.beja@yahoo.com','11944257329','12345678922','Rua das Flores, 78, Apto 502, Primavera Jardim, São Paulo/SP, 04141-410','admin','$2b$10$Cv3AEWtwRxPOCoJjvlDcTOp/rUh9nDpV5u1UCyZPPbgo42kbCmodG','2007-08-05',100,'ativo'),(104,'Júlia Guizzardi Sanches','juliatica@outlook.com','(11) 98360-1549','477.972.528','Rua Escorpião, 1090, Aracnídeos, Santa Animália/SP, 09874-750','gerente','','0000-00-00',204,'ativo');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `venda_itens`
--

DROP TABLE IF EXISTS `venda_itens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `venda_itens` (
  `id_item` int(11) NOT NULL AUTO_INCREMENT,
  `id_venda` int(11) NOT NULL,
  `id_produto` int(11) NOT NULL,
  `quantidade` int(11) NOT NULL,
  `preco_unitario` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id_item`),
  KEY `id_venda` (`id_venda`),
  KEY `id_produto` (`id_produto`),
  CONSTRAINT `venda_itens_ibfk_1` FOREIGN KEY (`id_venda`) REFERENCES `vendas` (`id_venda`),
  CONSTRAINT `venda_itens_ibfk_2` FOREIGN KEY (`id_produto`) REFERENCES `produtos` (`id_produto`)
) ENGINE=InnoDB AUTO_INCREMENT=78 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `venda_itens`
--

LOCK TABLES `venda_itens` WRITE;
/*!40000 ALTER TABLE `venda_itens` DISABLE KEYS */;
INSERT INTO `venda_itens` VALUES (25,20,1001,1,59.90,59.90),(26,20,3001,2,39.90,79.80),(37,26,2003,1,20.90,20.90),(38,27,3002,1,49.90,49.90),(39,28,2001,1,45.90,45.90),(40,28,1001,1,59.90,59.90),(41,28,2002,1,49.90,49.90),(42,28,2003,1,20.90,20.90),(43,28,2005,1,35.90,35.90),(44,28,2004,1,29.90,29.90),(45,29,1001,1,59.90,59.90),(46,30,2003,1,20.90,20.90),(47,30,2005,1,35.90,35.90),(54,32,1001,2,59.90,119.80),(55,32,2003,2,20.90,41.80),(56,32,3007,1,20.90,20.90),(57,33,3002,1,49.90,49.90),(58,33,4001,1,59.90,59.90),(59,33,6007,1,15.00,15.00),(60,34,2005,1,35.90,35.90),(61,34,3001,1,39.90,39.90),(62,34,6007,1,15.00,15.00),(63,35,1001,3,59.90,179.70),(64,35,2004,1,29.90,29.90),(65,35,6002,1,36.90,36.90),(66,36,2002,2,49.90,99.80),(67,36,3003,1,35.90,35.90),(68,36,5002,1,17.90,17.90),(69,37,3001,3,39.90,119.70),(70,37,4003,1,64.90,64.90),(71,37,6001,2,14.90,29.80),(72,38,1001,1,59.90,59.90),(73,38,2006,1,45.90,45.90),(74,38,3002,1,49.90,49.90),(75,39,3004,2,54.90,109.80),(76,39,5001,1,29.90,29.90),(77,39,6003,2,16.90,33.80);
/*!40000 ALTER TABLE `venda_itens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vendas`
--

DROP TABLE IF EXISTS `vendas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vendas` (
  `id_venda` int(11) NOT NULL AUTO_INCREMENT,
  `id_usuario` int(11) NOT NULL,
  `id_caixa` int(11) DEFAULT NULL,
  `id_empresa` int(11) NOT NULL,
  `data_venda` datetime DEFAULT current_timestamp(),
  `tipo_pagamento` enum('dinheiro','cartão','pix') NOT NULL,
  `total` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id_venda`),
  KEY `id_usuario` (`id_usuario`),
  KEY `id_empresa` (`id_empresa`),
  KEY `fk_vendas_caixa` (`id_caixa`),
  CONSTRAINT `fk_vendas_caixa` FOREIGN KEY (`id_caixa`) REFERENCES `caixa` (`id_caixa`),
  CONSTRAINT `vendas_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`),
  CONSTRAINT `vendas_ibfk_2` FOREIGN KEY (`id_empresa`) REFERENCES `empresas` (`id_empresa`)
) ENGINE=InnoDB AUTO_INCREMENT=87 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vendas`
--

LOCK TABLES `vendas` WRITE;
/*!40000 ALTER TABLE `vendas` DISABLE KEYS */;
INSERT INTO `vendas` VALUES (9,101,2,200,'2025-10-22 09:54:53','pix',2.00),(11,101,2,200,'2025-10-22 09:54:53','pix',10.00),(12,101,2,200,'2025-10-22 10:32:24','dinheiro',89.90),(13,101,2,200,'2025-10-22 10:34:50','pix',89.90),(14,101,2,200,'2025-10-22 10:51:39','pix',89.90),(15,101,2,200,'2025-10-22 10:52:14','pix',89.90),(16,101,2,200,'2025-10-22 10:52:41','pix',89.90),(17,101,2,200,'2025-10-22 10:55:03','cartão',89.90),(18,101,2,200,'2025-10-21 10:55:40','pix',89.90),(19,101,2,200,'2025-10-22 10:59:05','pix',89.90),(20,100,3,200,'2025-10-24 14:59:25','pix',139.70),(26,101,6,200,'2025-11-22 22:58:55','pix',20.90),(27,101,6,200,'2025-11-24 11:24:14','pix',49.90),(28,101,6,200,'2025-11-24 11:54:19','pix',242.40),(29,101,6,200,'2025-11-24 12:08:44','pix',59.90),(30,101,6,200,'2025-11-24 12:14:29','pix',56.80),(32,101,6,200,'2025-11-01 09:15:00','pix',189.60),(33,101,6,200,'2025-11-01 10:30:00','cartão',125.70),(34,101,6,200,'2025-11-01 14:20:00','dinheiro',89.80),(35,101,6,200,'2025-11-02 09:45:00','pix',234.50),(36,101,6,200,'2025-11-02 11:00:00','pix',156.80),(37,101,6,200,'2025-11-02 15:30:00','cartão',298.60),(38,101,6,200,'2025-11-03 10:10:00','dinheiro',167.40),(39,101,6,200,'2025-11-03 13:25:00','pix',203.70),(40,101,6,200,'2025-11-04 09:00:00','pix',145.80),(41,101,6,200,'2025-11-04 11:40:00','cartão',312.40),(42,101,6,200,'2025-11-04 16:15:00','dinheiro',98.70),(43,101,6,200,'2025-11-05 10:20:00','pix',276.90),(44,101,6,200,'2025-11-05 14:50:00','pix',189.50),(45,101,6,200,'2025-11-06 09:30:00','cartão',223.60),(46,101,6,200,'2025-11-06 12:00:00','dinheiro',156.40),(47,101,6,200,'2025-11-07 10:45:00','pix',198.80),(48,101,6,200,'2025-11-07 15:20:00','pix',267.30),(49,101,6,200,'2025-11-08 09:10:00','pix',312.50),(50,101,6,200,'2025-11-08 11:30:00','cartão',178.90),(51,101,6,200,'2025-11-08 14:00:00','dinheiro',245.60),(52,101,6,200,'2025-11-09 10:00:00','pix',189.70),(53,101,6,200,'2025-11-09 13:15:00','pix',298.40),(54,101,6,200,'2025-11-10 09:45:00','cartão',156.80),(55,101,6,200,'2025-11-10 12:20:00','dinheiro',223.50),(56,101,6,200,'2025-11-11 10:30:00','pix',367.20),(57,101,6,200,'2025-11-11 14:45:00','pix',198.60),(58,101,6,200,'2025-11-12 09:20:00','cartão',276.30),(59,101,6,200,'2025-11-12 11:50:00','dinheiro',145.70),(60,101,6,200,'2025-11-13 10:15:00','pix',289.50),(61,101,6,200,'2025-11-13 15:00:00','pix',234.80),(62,101,6,200,'2025-11-14 09:40:00','cartão',312.90),(63,101,6,200,'2025-11-14 13:30:00','dinheiro',167.20),(64,101,6,200,'2025-11-15 10:00:00','pix',398.60),(65,101,6,200,'2025-11-15 14:20:00','pix',245.30),(66,101,6,200,'2025-11-16 09:30:00','cartão',189.70),(67,101,6,200,'2025-11-16 12:45:00','dinheiro',276.40),(68,101,6,200,'2025-11-17 10:50:00','pix',334.80),(69,101,6,200,'2025-11-17 15:15:00','pix',198.50),(70,101,6,200,'2025-11-18 09:15:00','cartão',267.90),(71,101,6,200,'2025-11-18 11:40:00','dinheiro',156.60),(72,101,6,200,'2025-11-19 10:25:00','pix',423.70),(73,101,6,200,'2025-11-19 14:00:00','pix',289.30),(74,101,6,200,'2025-11-20 09:50:00','cartão',234.80),(75,101,6,200,'2025-11-20 13:20:00','dinheiro',198.40),(76,101,6,200,'2025-11-21 10:30:00','pix',356.20),(77,101,6,200,'2025-11-21 15:45:00','pix',223.60),(78,101,6,200,'2025-11-22 09:20:00','pix',298.50),(79,101,6,200,'2025-11-22 12:00:00','cartão',167.80),(80,101,6,200,'2025-11-22 15:30:00','dinheiro',234.90),(81,101,6,200,'2025-11-23 10:15:00','pix',389.60),(82,101,6,200,'2025-11-23 13:45:00','pix',245.70),(83,101,6,200,'2025-11-24 09:30:00','cartão',198.40),(84,101,6,200,'2025-11-24 11:50:00','dinheiro',276.80),(85,101,6,200,'2025-11-25 10:00:00','pix',334.50),(86,101,6,200,'2025-11-25 14:20:00','pix',223.90);
/*!40000 ALTER TABLE `vendas` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-26  0:23:09
