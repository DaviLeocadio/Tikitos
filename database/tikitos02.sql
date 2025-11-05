-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: 10.189.80.96    Database: tikitos
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `caixa`
--

LOCK TABLES `caixa` WRITE;
/*!40000 ALTER TABLE `caixa` DISABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categorias`
--

LOCK TABLES `categorias` WRITE;
/*!40000 ALTER TABLE `categorias` DISABLE KEYS */;
INSERT INTO `categorias` VALUES (1,'Pelúcia','ativo'),(2,'Habilidade','ativo'),(3,'Movimento','ativo'),(4,'Montargem','ativo');
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
  `data_adicionado` date DEFAULT curdate(),
  `data_pag` date DEFAULT NULL,
  `descricao` varchar(255) NOT NULL,
  `preco` decimal(10,2) NOT NULL,
  `status` enum('pago','pendente') DEFAULT 'pendente',
  PRIMARY KEY (`id_despesa`),
  KEY `id_empresa` (`id_empresa`),
  CONSTRAINT `despesas_ibfk_1` FOREIGN KEY (`id_empresa`) REFERENCES `empresas` (`id_empresa`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `despesas`
--

LOCK TABLES `despesas` WRITE;
/*!40000 ALTER TABLE `despesas` DISABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=203 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `empresas`
--

LOCK TABLES `empresas` WRITE;
/*!40000 ALTER TABLE `empresas` DISABLE KEYS */;
INSERT INTO `empresas` VALUES (100,'Tikitos Matriz','matriz','R. Boa Vista, 825 - Boa Vista, São Caetano do Sul - SP, 09572-300','ativo'),(200,'Tikitos Mooca','filial','R. do Oratório, 215 - Mooca, São Paulo - SP, 03117-000','ativo'),(201,'Tikitos São Bernardo','filial','Av. Pereira Barreto, 456 - Baeta Neves, São Bernardo do Campo - SP, 09751-000','ativo'),(202,'Tikitos Santo André','filial','Av. Santos Dumont, 300 - Ipiranguinha, Santo André - SP, 09015-320','ativo');
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
  `data_criado` date DEFAULT curdate(),
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `movimento_estoque`
--

LOCK TABLES `movimento_estoque` WRITE;
/*!40000 ALTER TABLE `movimento_estoque` DISABLE KEYS */;
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
  `preco` decimal(10,2) NOT NULL,
  `desconto` decimal(10,2) DEFAULT 0.00,
  `estoque` int(11) DEFAULT 0,
  PRIMARY KEY (`id_produto_loja`),
  KEY `id_produto` (`id_produto`),
  KEY `id_empresa` (`id_empresa`),
  CONSTRAINT `produto_loja_ibfk_1` FOREIGN KEY (`id_produto`) REFERENCES `produtos` (`id_produto`),
  CONSTRAINT `produto_loja_ibfk_2` FOREIGN KEY (`id_empresa`) REFERENCES `empresas` (`id_empresa`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `produto_loja`
--

LOCK TABLES `produto_loja` WRITE;
/*!40000 ALTER TABLE `produto_loja` DISABLE KEYS */;
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
INSERT INTO `produtos` VALUES (1001,100,1,1,'Ursinho de Pelúcia','Ursinho de pelúcia macio e antialérgico, ideal para presentear e decorar o quarto das crianças.',35.00,25,59.90,'/img/produtos/ursinho_pelucia.jpg','ativo'),(2001,100,2,1,'Ioiô Clássico Tikitos','Ioiô de plástico resistente com corda reforçada. Desenvolve coordenação motora e diversão para todas as idades.',8.00,7,15.00,'/img/produtos/ioio_classico.jpg','ativo'),(3001,100,3,1,'Bola de Vinil Colorida','Bola de vinil leve, colorida e segura, perfeita para brincadeiras ao ar livre.',6.00,7,12.50,'/img/produtos/bola_vinil.jpg','ativo'),(4001,100,4,1,'Blocos de Madeira Castelinho','Conjunto de blocos de madeira coloridos para montar castelos e estimular a criatividade das crianças.',55.00,35,89.90,'/img/produtos/blocos_castelinho.jpg','ativo');
/*!40000 ALTER TABLE `produtos` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=102 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (100,'Bernardo de Souza Madureira','bernardomadureira.souza@gmail.com','5511993001135','47806468803','Rua Maurício Jacquey, 308, Bloco 5, Apto. 81 - Vila Helena, São Bernardo do Campo - SP, 09635-080','admin','deve_mudar','2008-01-24',100,'ativo'),(101,'Davi','davi.leocadio.sen@gmail.com','5511968561451','50519831896','Rua Ibatiba, 124','vendedor','$2b$10$OoEkMqA92/usSo97DC0teO/.oDBgx97zUx1w9HZV7Xu42xCNf6qKG','2008-04-14',100,'ativo');
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `venda_itens`
--

LOCK TABLES `venda_itens` WRITE;
/*!40000 ALTER TABLE `venda_itens` DISABLE KEYS */;
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
  `id_empresa` int(11) NOT NULL,
  `data_venda` datetime DEFAULT current_timestamp(),
  `tipo_pagamento` enum('dinheiro','cartão','pix') NOT NULL,
  `total` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id_venda`),
  KEY `id_usuario` (`id_usuario`),
  KEY `id_empresa` (`id_empresa`),
  CONSTRAINT `vendas_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`),
  CONSTRAINT `vendas_ibfk_2` FOREIGN KEY (`id_empresa`) REFERENCES `empresas` (`id_empresa`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vendas`
--

LOCK TABLES `vendas` WRITE;
/*!40000 ALTER TABLE `vendas` DISABLE KEYS */;
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

-- Dump completed on 2025-10-15 16:37:29
