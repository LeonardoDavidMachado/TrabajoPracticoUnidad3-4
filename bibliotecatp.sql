-- phpMyAdmin SQL Dump
-- version 5.0.3
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 05-01-2021 a las 20:21:59
-- Versión del servidor: 10.4.14-MariaDB
-- Versión de PHP: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `bibliotecatp`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categoria`
--

CREATE TABLE `categoria` (
  `nombre` varchar(50) NOT NULL,
  `categoria_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `categoria`
--

INSERT INTO `categoria` (`nombre`, `categoria_id`) VALUES
('CIENCIA FICCION', 1),
('NOVELA HISTORICA', 2),
('LIRICO', 3),
('EPICA', 4),
('POESIA KLINGON', 21),
('NARRATIVO', 22),
('RECETAS', 23);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `libro`
--

CREATE TABLE `libro` (
  `nombre` varchar(50) NOT NULL,
  `descripcion` varchar(100) NOT NULL,
  `categoria_id` int(11) NOT NULL,
  `persona_id` int(11) DEFAULT NULL,
  `libro_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `libro`
--

INSERT INTO `libro` (`nombre`, `descripcion`, `categoria_id`, `persona_id`, `libro_id`) VALUES
('ARTURO PENDRAGON', 'HISTORIAS DEL OSO DE INGLATERRA', 4, 2, 1),
('CUENTOS COMPLETOS DE ASIMOV', 'RECOPILACION DE CUENTOS DE ASIMOV', 1, 2, 2),
('LAS LEGIONES MALDITAS', 'SEGUNDA PARTE DE LA NOVELA AFRICANUS: EL HIJO DEL CONSUL', 2, 3, 5),
('ARTURO PENDRAG', 'PANCITO', 4, NULL, 6),
('STAR WARS', '', 1, NULL, 8);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `persona`
--

CREATE TABLE `persona` (
  `nombre` varchar(30) NOT NULL,
  `apellido` varchar(30) NOT NULL,
  `email` varchar(30) NOT NULL,
  `alias` varchar(30) NOT NULL,
  `persona_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `persona`
--

INSERT INTO `persona` (`nombre`, `apellido`, `email`, `alias`, `persona_id`) VALUES
('LEONARDO DAVID', 'MACHADO', 'leondav@hotmail.com', 'CESCIPION', 1),
('ROMUALDO', 'TORRES', 'romures@gmail.com', 'MANCO', 2),
('PATRICIA', 'GONZALES', 'pgonz@yahoo.com', 'PATA', 3),
('JUAN', 'CRUZ', 'juancito6@gmail.com', 'JUANCITO', 16),
('ANAKIN', 'SKYWALKER', 'anakin@jedi.com', 'SANDYLOVER123', 18);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `categoria`
--
ALTER TABLE `categoria`
  ADD PRIMARY KEY (`categoria_id`);

--
-- Indices de la tabla `libro`
--
ALTER TABLE `libro`
  ADD PRIMARY KEY (`libro_id`),
  ADD KEY `persona_id` (`persona_id`),
  ADD KEY `categoria_id` (`categoria_id`);

--
-- Indices de la tabla `persona`
--
ALTER TABLE `persona`
  ADD PRIMARY KEY (`persona_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `categoria`
--
ALTER TABLE `categoria`
  MODIFY `categoria_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT de la tabla `libro`
--
ALTER TABLE `libro`
  MODIFY `libro_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT de la tabla `persona`
--
ALTER TABLE `persona`
  MODIFY `persona_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `libro`
--
ALTER TABLE `libro`
  ADD CONSTRAINT `libro_ibfk_1` FOREIGN KEY (`persona_id`) REFERENCES `persona` (`persona_id`),
  ADD CONSTRAINT `libro_ibfk_2` FOREIGN KEY (`categoria_id`) REFERENCES `categoria` (`categoria_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
