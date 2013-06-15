-- phpMyAdmin SQL Dump
-- version 3.5.3
-- http://www.phpmyadmin.net
--
-- Host: 10.0.100.1
-- Generation Time: Jun 15, 2013 at 06:41 PM
-- Server version: 5.5.29-0ubuntu0.12.04.1
-- PHP Version: 5.3.10-1ubuntu3.6

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `infect`
--

-- --------------------------------------------------------

--
-- Table structure for table `bacteria`
--

CREATE TABLE IF NOT EXISTS `bacteria` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_species` int(11) NOT NULL,
  `id_shape` int(11) NOT NULL,
  `id_grouping` int(11) NOT NULL,
  `gram` tinyint(1) NOT NULL,
  `aerobic` tinyint(1) NOT NULL,
  `aerobic-optional` tinyint(1) NOT NULL,
  `anaerobic` tinyint(1) NOT NULL,
  `anaerobic-optional` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `species` (`id_species`),
  KEY `grouping` (`id_grouping`),
  KEY `shape` (`id_shape`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `bacteriaLocale`
--

CREATE TABLE IF NOT EXISTS `bacteriaLocale` (
  `id_bacteria` int(11) NOT NULL,
  `id_language` int(11) NOT NULL,
  `name` varchar(200) NOT NULL,
  PRIMARY KEY (`id_bacteria`,`id_language`),
  KEY `id_language` (`id_language`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `bacteriaName`
--

CREATE TABLE IF NOT EXISTS `bacteriaName` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_bacteria` int(11) NOT NULL,
  `name` varchar(200) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_bacteria` (`id_bacteria`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `compound`
--

CREATE TABLE IF NOT EXISTS `compound` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `iv` tinyint(1) NOT NULL DEFAULT '0',
  `po` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `compound_substance`
--

CREATE TABLE IF NOT EXISTS `compound_substance` (
  `id_compound` int(11) NOT NULL,
  `id_substance` int(11) NOT NULL,
  PRIMARY KEY (`id_compound`,`id_substance`),
  KEY `id_substance` (`id_substance`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `country`
--

CREATE TABLE IF NOT EXISTS `country` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `iso2` int(11) NOT NULL,
  `iso3` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `countryLocale`
--

CREATE TABLE IF NOT EXISTS `countryLocale` (
  `id_country` int(11) NOT NULL,
  `id_language` int(11) NOT NULL,
  PRIMARY KEY (`id_country`,`id_language`),
  KEY `id_language` (`id_language`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `diagnosis`
--

CREATE TABLE IF NOT EXISTS `diagnosis` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_country` int(11) NOT NULL,
  `id_topic` int(11) NOT NULL,
  `id_primaryTherapy` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_country` (`id_country`),
  KEY `id_topic` (`id_topic`),
  KEY `id_primaryTherapy` (`id_primaryTherapy`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `diagnosisLocale`
--

CREATE TABLE IF NOT EXISTS `diagnosisLocale` (
  `id_diagnosis` int(11) NOT NULL,
  `id_language` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  PRIMARY KEY (`id_diagnosis`,`id_language`),
  KEY `title` (`title`),
  KEY `id_language` (`id_language`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `diagnosis_bacteria`
--

CREATE TABLE IF NOT EXISTS `diagnosis_bacteria` (
  `id_diagnosis` int(11) NOT NULL,
  `id_bacteria` int(11) NOT NULL,
  PRIMARY KEY (`id_diagnosis`,`id_bacteria`),
  KEY `id_bacteria` (`id_bacteria`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `drug`
--

CREATE TABLE IF NOT EXISTS `drug` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_compound` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_compound` (`id_compound`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `drugLocale`
--

CREATE TABLE IF NOT EXISTS `drugLocale` (
  `id_drug` int(11) NOT NULL,
  `id_language` int(11) NOT NULL,
  `id_country` int(11) NOT NULL,
  PRIMARY KEY (`id_drug`,`id_language`,`id_country`),
  KEY `id_language` (`id_language`),
  KEY `id_country` (`id_country`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `genus`
--

CREATE TABLE IF NOT EXISTS `genus` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `grouping`
--

CREATE TABLE IF NOT EXISTS `grouping` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `language`
--

CREATE TABLE IF NOT EXISTS `language` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `shape`
--

CREATE TABLE IF NOT EXISTS `shape` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `species`
--

CREATE TABLE IF NOT EXISTS `species` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_genus` int(11) NOT NULL,
  `name` varchar(200) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_genus` (`id_genus`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `substance`
--

CREATE TABLE IF NOT EXISTS `substance` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `substanceClass`
--

CREATE TABLE IF NOT EXISTS `substanceClass` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_parent` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_parent` (`id_parent`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `substanceClassLocale`
--

CREATE TABLE IF NOT EXISTS `substanceClassLocale` (
  `id_substanceClass` int(11) NOT NULL,
  `id_language` int(11) NOT NULL,
  `name` varchar(200) NOT NULL,
  PRIMARY KEY (`id_substanceClass`,`id_language`),
  KEY `id_language` (`id_language`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `substanceLocale`
--

CREATE TABLE IF NOT EXISTS `substanceLocale` (
  `id_substance` int(11) NOT NULL,
  `id_language` int(11) NOT NULL,
  `name` int(11) NOT NULL,
  PRIMARY KEY (`id_substance`,`id_language`),
  KEY `id_language` (`id_language`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `substance_substanceClass`
--

CREATE TABLE IF NOT EXISTS `substance_substanceClass` (
  `id_substance` int(11) NOT NULL,
  `id_substanceClass` int(11) NOT NULL,
  PRIMARY KEY (`id_substance`,`id_substanceClass`),
  KEY `id_substanceClass` (`id_substanceClass`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `therapy`
--

CREATE TABLE IF NOT EXISTS `therapy` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_diagnosis` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_diagnosis` (`id_diagnosis`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `therapyLocale`
--

CREATE TABLE IF NOT EXISTS `therapyLocale` (
  `id_therapy` int(11) NOT NULL,
  `id_language` int(11) NOT NULL,
  `text` text NOT NULL,
  PRIMARY KEY (`id_therapy`,`id_language`),
  KEY `id_language` (`id_language`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `therapy_compounds`
--

CREATE TABLE IF NOT EXISTS `therapy_compounds` (
  `id_therapy` int(11) NOT NULL,
  `id_compounds` int(11) NOT NULL,
  PRIMARY KEY (`id_therapy`,`id_compounds`),
  KEY `id_compounds` (`id_compounds`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `topic`
--

CREATE TABLE IF NOT EXISTS `topic` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `topicLocale`
--

CREATE TABLE IF NOT EXISTS `topicLocale` (
  `id_topic` int(11) NOT NULL,
  `id_language` int(11) NOT NULL,
  `title` varchar(200) NOT NULL,
  PRIMARY KEY (`id_topic`,`id_language`),
  KEY `title` (`title`),
  KEY `id_language` (`id_language`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bacteria`
--
ALTER TABLE `bacteria`
  ADD CONSTRAINT `bacteria_ibfk_3` FOREIGN KEY (`id_grouping`) REFERENCES `grouping` (`id`),
  ADD CONSTRAINT `bacteria_ibfk_1` FOREIGN KEY (`id_species`) REFERENCES `species` (`id`),
  ADD CONSTRAINT `bacteria_ibfk_2` FOREIGN KEY (`id_shape`) REFERENCES `shape` (`id`);

--
-- Constraints for table `bacteriaLocale`
--
ALTER TABLE `bacteriaLocale`
  ADD CONSTRAINT `bacteriaLocale_ibfk_2` FOREIGN KEY (`id_language`) REFERENCES `language` (`id`),
  ADD CONSTRAINT `bacteriaLocale_ibfk_1` FOREIGN KEY (`id_bacteria`) REFERENCES `bacteria` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `bacteriaName`
--
ALTER TABLE `bacteriaName`
  ADD CONSTRAINT `bacteriaName_ibfk_1` FOREIGN KEY (`id_bacteria`) REFERENCES `bacteria` (`id`);

--
-- Constraints for table `compound_substance`
--
ALTER TABLE `compound_substance`
  ADD CONSTRAINT `compound_substance_ibfk_2` FOREIGN KEY (`id_substance`) REFERENCES `substance` (`id`),
  ADD CONSTRAINT `compound_substance_ibfk_1` FOREIGN KEY (`id_compound`) REFERENCES `compound` (`id`);

--
-- Constraints for table `countryLocale`
--
ALTER TABLE `countryLocale`
  ADD CONSTRAINT `countryLocale_ibfk_2` FOREIGN KEY (`id_language`) REFERENCES `language` (`id`),
  ADD CONSTRAINT `countryLocale_ibfk_1` FOREIGN KEY (`id_country`) REFERENCES `country` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `diagnosis`
--
ALTER TABLE `diagnosis`
  ADD CONSTRAINT `diagnosis_ibfk_3` FOREIGN KEY (`id_primaryTherapy`) REFERENCES `therapy` (`id`),
  ADD CONSTRAINT `diagnosis_ibfk_1` FOREIGN KEY (`id_country`) REFERENCES `country` (`id`),
  ADD CONSTRAINT `diagnosis_ibfk_2` FOREIGN KEY (`id_topic`) REFERENCES `topic` (`id`);

--
-- Constraints for table `diagnosisLocale`
--
ALTER TABLE `diagnosisLocale`
  ADD CONSTRAINT `diagnosisLocale_ibfk_2` FOREIGN KEY (`id_language`) REFERENCES `language` (`id`),
  ADD CONSTRAINT `diagnosisLocale_ibfk_1` FOREIGN KEY (`id_diagnosis`) REFERENCES `diagnosis` (`id`);

--
-- Constraints for table `diagnosis_bacteria`
--
ALTER TABLE `diagnosis_bacteria`
  ADD CONSTRAINT `diagnosis_bacteria_ibfk_4` FOREIGN KEY (`id_bacteria`) REFERENCES `bacteria` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `diagnosis_bacteria_ibfk_3` FOREIGN KEY (`id_diagnosis`) REFERENCES `diagnosis` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `drug`
--
ALTER TABLE `drug`
  ADD CONSTRAINT `drug_ibfk_1` FOREIGN KEY (`id_compound`) REFERENCES `compound` (`id`);

--
-- Constraints for table `drugLocale`
--
ALTER TABLE `drugLocale`
  ADD CONSTRAINT `drugLocale_ibfk_3` FOREIGN KEY (`id_country`) REFERENCES `country` (`id`),
  ADD CONSTRAINT `drugLocale_ibfk_1` FOREIGN KEY (`id_drug`) REFERENCES `drug` (`id`),
  ADD CONSTRAINT `drugLocale_ibfk_2` FOREIGN KEY (`id_language`) REFERENCES `language` (`id`);

--
-- Constraints for table `species`
--
ALTER TABLE `species`
  ADD CONSTRAINT `species_ibfk_1` FOREIGN KEY (`id_genus`) REFERENCES `genus` (`id`);

--
-- Constraints for table `substanceClass`
--
ALTER TABLE `substanceClass`
  ADD CONSTRAINT `substanceClass_ibfk_1` FOREIGN KEY (`id_parent`) REFERENCES `substance` (`id`);

--
-- Constraints for table `substanceClassLocale`
--
ALTER TABLE `substanceClassLocale`
  ADD CONSTRAINT `substanceClassLocale_ibfk_2` FOREIGN KEY (`id_language`) REFERENCES `language` (`id`),
  ADD CONSTRAINT `substanceClassLocale_ibfk_1` FOREIGN KEY (`id_substanceClass`) REFERENCES `substanceClass` (`id`);

--
-- Constraints for table `substanceLocale`
--
ALTER TABLE `substanceLocale`
  ADD CONSTRAINT `substanceLocale_ibfk_2` FOREIGN KEY (`id_language`) REFERENCES `language` (`id`),
  ADD CONSTRAINT `substanceLocale_ibfk_1` FOREIGN KEY (`id_substance`) REFERENCES `substance` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `substance_substanceClass`
--
ALTER TABLE `substance_substanceClass`
  ADD CONSTRAINT `substance_substanceClass_ibfk_2` FOREIGN KEY (`id_substanceClass`) REFERENCES `substanceClass` (`id`),
  ADD CONSTRAINT `substance_substanceClass_ibfk_1` FOREIGN KEY (`id_substance`) REFERENCES `substance` (`id`);

--
-- Constraints for table `therapy`
--
ALTER TABLE `therapy`
  ADD CONSTRAINT `therapy_ibfk_1` FOREIGN KEY (`id_diagnosis`) REFERENCES `diagnosis` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `therapyLocale`
--
ALTER TABLE `therapyLocale`
  ADD CONSTRAINT `therapyLocale_ibfk_2` FOREIGN KEY (`id_language`) REFERENCES `language` (`id`),
  ADD CONSTRAINT `therapyLocale_ibfk_1` FOREIGN KEY (`id_therapy`) REFERENCES `therapy` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `therapy_compounds`
--
ALTER TABLE `therapy_compounds`
  ADD CONSTRAINT `therapy_compounds_ibfk_2` FOREIGN KEY (`id_compounds`) REFERENCES `compound` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `therapy_compounds_ibfk_1` FOREIGN KEY (`id_therapy`) REFERENCES `therapy` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `topicLocale`
--
ALTER TABLE `topicLocale`
  ADD CONSTRAINT `topicLocale_ibfk_2` FOREIGN KEY (`id_language`) REFERENCES `language` (`id`),
  ADD CONSTRAINT `topicLocale_ibfk_1` FOREIGN KEY (`id_topic`) REFERENCES `topic` (`id`) ON DELETE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
