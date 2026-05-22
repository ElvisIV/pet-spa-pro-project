-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 22-05-2026 a las 02:11:08
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.1.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `pet_spa_pro`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `audit_logs`
--

CREATE TABLE `audit_logs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `action` varchar(50) NOT NULL,
  `details` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`details`)),
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `audit_logs`
--

INSERT INTO `audit_logs` (`id`, `user_id`, `action`, `details`, `ip_address`, `user_agent`, `created_at`, `updated_at`) VALUES
(1, 1, 'login_success', NULL, '127.0.0.1', NULL, '2026-05-11 01:59:25', '2026-05-11 01:59:25'),
(2, 1, 'user_status_changed', '\"{\\\"target_user_id\\\":2,\\\"new_status\\\":\\\"inactivo\\\"}\"', '127.0.0.1', NULL, '2026-05-11 01:59:44', '2026-05-11 01:59:44'),
(3, 1, 'user_status_changed', '\"{\\\"target_user_id\\\":2,\\\"new_status\\\":\\\"activo\\\"}\"', '127.0.0.1', NULL, '2026-05-11 01:59:51', '2026-05-11 01:59:51'),
(4, 1, 'logout', NULL, '127.0.0.1', NULL, '2026-05-11 02:07:46', '2026-05-11 02:07:46'),
(5, 2, 'login_success', NULL, '127.0.0.1', NULL, '2026-05-11 02:07:56', '2026-05-11 02:07:56'),
(6, 2, 'logout', NULL, '127.0.0.1', NULL, '2026-05-11 02:08:08', '2026-05-11 02:08:08'),
(7, 1, 'login_success', NULL, '127.0.0.1', NULL, '2026-05-11 02:45:15', '2026-05-11 02:45:15'),
(8, 1, 'staff_created', '\"{\\\"created_user_id\\\":3,\\\"rol\\\":\\\"groomer\\\",\\\"created_by\\\":1}\"', '127.0.0.1', NULL, '2026-05-11 02:49:58', '2026-05-11 02:49:58'),
(9, 1, 'logout', NULL, '127.0.0.1', NULL, '2026-05-11 02:50:44', '2026-05-11 02:50:44'),
(10, 1, 'login_success', NULL, '127.0.0.1', NULL, '2026-05-11 02:50:52', '2026-05-11 02:50:52'),
(11, 1, 'logout', NULL, '127.0.0.1', NULL, '2026-05-11 02:50:58', '2026-05-11 02:50:58'),
(12, NULL, 'login_success', NULL, '127.0.0.1', NULL, '2026-05-11 02:55:02', '2026-05-11 02:55:02'),
(13, NULL, 'password_changed', NULL, '127.0.0.1', NULL, '2026-05-11 02:55:25', '2026-05-11 02:55:25'),
(14, NULL, 'logout', NULL, '127.0.0.1', NULL, '2026-05-11 02:55:56', '2026-05-11 02:55:56'),
(15, 1, 'login_success', NULL, '127.0.0.1', NULL, '2026-05-11 02:56:03', '2026-05-11 02:56:03'),
(16, 1, 'user_status_changed', '\"{\\\"target_user_id\\\":3,\\\"new_status\\\":\\\"inactivo\\\"}\"', '127.0.0.1', NULL, '2026-05-11 02:56:07', '2026-05-11 02:56:07'),
(17, 1, 'logout', NULL, '127.0.0.1', NULL, '2026-05-11 02:56:09', '2026-05-11 02:56:09'),
(18, NULL, 'user_registered', NULL, '127.0.0.1', NULL, '2026-05-11 03:23:17', '2026-05-11 03:23:17'),
(19, NULL, 'logout', NULL, '127.0.0.1', NULL, '2026-05-11 03:23:30', '2026-05-11 03:23:30'),
(20, 1, 'login_success', NULL, '127.0.0.1', NULL, '2026-05-11 03:25:02', '2026-05-11 03:25:02'),
(21, 1, 'user_status_changed', '\"{\\\"target_user_id\\\":3,\\\"new_status\\\":\\\"activo\\\"}\"', '127.0.0.1', NULL, '2026-05-11 04:13:32', '2026-05-11 04:13:32'),
(22, NULL, 'user_registered', NULL, '127.0.0.1', NULL, '2026-05-11 04:26:08', '2026-05-11 04:26:08'),
(23, NULL, 'user_registered', NULL, '127.0.0.1', NULL, '2026-05-11 04:30:28', '2026-05-11 04:30:28'),
(24, NULL, 'user_registered', NULL, '127.0.0.1', NULL, '2026-05-11 04:33:41', '2026-05-11 04:33:41'),
(25, NULL, 'login_success', NULL, '127.0.0.1', NULL, '2026-05-11 04:34:18', '2026-05-11 04:34:18'),
(26, NULL, 'logout', NULL, '127.0.0.1', NULL, '2026-05-11 04:34:36', '2026-05-11 04:34:36'),
(27, 1, 'login_success', NULL, '127.0.0.1', NULL, '2026-05-11 04:35:42', '2026-05-11 04:35:42'),
(28, 1, 'user_status_changed', '\"{\\\"target_user_id\\\":7,\\\"new_status\\\":\\\"inactivo\\\"}\"', '127.0.0.1', NULL, '2026-05-11 04:35:47', '2026-05-11 04:35:47'),
(29, 1, 'logout', NULL, '127.0.0.1', NULL, '2026-05-11 04:35:48', '2026-05-11 04:35:48'),
(30, 1, 'login_success', NULL, '127.0.0.1', NULL, '2026-05-11 04:38:22', '2026-05-11 04:38:22'),
(31, 1, 'staff_created', '\"{\\\"created_user_id\\\":8,\\\"rol\\\":\\\"recepcion\\\",\\\"created_by\\\":1}\"', '127.0.0.1', NULL, '2026-05-11 05:04:50', '2026-05-11 05:04:50'),
(32, 1, 'logout', NULL, '127.0.0.1', NULL, '2026-05-11 05:05:05', '2026-05-11 05:05:05'),
(33, 1, 'login_success', NULL, '127.0.0.1', NULL, '2026-05-11 05:05:26', '2026-05-11 05:05:26'),
(34, 1, 'user_status_changed', '\"{\\\"target_user_id\\\":7,\\\"new_status\\\":\\\"activo\\\"}\"', '127.0.0.1', NULL, '2026-05-11 05:05:44', '2026-05-11 05:05:44'),
(35, 1, 'logout', NULL, '127.0.0.1', NULL, '2026-05-11 05:05:51', '2026-05-11 05:05:51'),
(36, NULL, 'login_success', NULL, '127.0.0.1', NULL, '2026-05-11 05:06:56', '2026-05-11 05:06:56'),
(37, NULL, 'logout', NULL, '127.0.0.1', NULL, '2026-05-11 05:07:01', '2026-05-11 05:07:01'),
(38, 1, 'login_success', NULL, '127.0.0.1', NULL, '2026-05-11 05:07:24', '2026-05-11 05:07:24'),
(39, 1, 'logout', NULL, '127.0.0.1', NULL, '2026-05-11 05:12:02', '2026-05-11 05:12:02'),
(40, NULL, 'login_failed', '\"{\\\"email\\\":\\\"elviscantuta@gmail.com\\\"}\"', '127.0.0.1', NULL, '2026-05-11 05:12:28', '2026-05-11 05:12:28'),
(41, NULL, 'login_failed', '\"{\\\"email\\\":\\\"qe@gmai.com\\\"}\"', '127.0.0.1', NULL, '2026-05-11 05:12:37', '2026-05-11 05:12:37'),
(42, 1, 'login_failed', '\"{\\\"email\\\":\\\"admin@petspapro.com\\\"}\"', '127.0.0.1', NULL, '2026-05-11 05:12:45', '2026-05-11 05:12:45'),
(43, 2, 'login_success', NULL, '127.0.0.1', NULL, '2026-05-11 05:34:42', '2026-05-11 05:34:42'),
(44, 2, 'logout', NULL, '127.0.0.1', NULL, '2026-05-11 05:34:48', '2026-05-11 05:34:48'),
(45, 2, 'login_failed', '\"{\\\"email\\\":\\\"recepcion@petspapro.com\\\",\\\"attempts\\\":1}\"', '127.0.0.1', NULL, '2026-05-11 05:35:24', '2026-05-11 05:35:24'),
(46, 2, 'login_failed', '\"{\\\"email\\\":\\\"recepcion@petspapro.com\\\",\\\"attempts\\\":2}\"', '127.0.0.1', NULL, '2026-05-11 05:35:29', '2026-05-11 05:35:29'),
(47, 2, 'login_failed', '\"{\\\"email\\\":\\\"recepcion@petspapro.com\\\",\\\"attempts\\\":3}\"', '127.0.0.1', NULL, '2026-05-11 05:35:45', '2026-05-11 05:35:45'),
(48, 2, 'login_failed', '\"{\\\"email\\\":\\\"recepcion@petspapro.com\\\",\\\"attempts\\\":4}\"', '127.0.0.1', NULL, '2026-05-11 05:44:26', '2026-05-11 05:44:26'),
(49, 2, 'login_failed', '\"{\\\"email\\\":\\\"recepcion@petspapro.com\\\",\\\"attempts\\\":0}\"', '127.0.0.1', NULL, '2026-05-11 05:44:35', '2026-05-11 05:44:35'),
(50, 1, 'login_success', NULL, '127.0.0.1', NULL, '2026-05-11 05:45:12', '2026-05-11 05:45:12'),
(51, 1, 'logout', NULL, '127.0.0.1', NULL, '2026-05-11 05:45:16', '2026-05-11 05:45:16'),
(52, 1, 'login_failed', '\"{\\\"email\\\":\\\"admin@petspapro.com\\\",\\\"attempts\\\":1}\"', '127.0.0.1', NULL, '2026-05-11 05:49:00', '2026-05-11 05:49:00'),
(53, 1, 'login_failed', '\"{\\\"email\\\":\\\"admin@petspapro.com\\\",\\\"attempts\\\":2}\"', '127.0.0.1', NULL, '2026-05-11 05:49:44', '2026-05-11 05:49:44'),
(54, 1, 'login_failed', '\"{\\\"email\\\":\\\"admin@petspapro.com\\\",\\\"attempts\\\":3}\"', '127.0.0.1', NULL, '2026-05-11 05:54:14', '2026-05-11 05:54:14'),
(55, 1, 'login_failed', '\"{\\\"email\\\":\\\"admin@petspapro.com\\\",\\\"attempts\\\":4}\"', '127.0.0.1', NULL, '2026-05-11 05:54:16', '2026-05-11 05:54:16'),
(56, 1, 'login_failed', '\"{\\\"email\\\":\\\"admin@petspapro.com\\\",\\\"attempts\\\":0}\"', '127.0.0.1', NULL, '2026-05-11 05:54:17', '2026-05-11 05:54:17'),
(57, NULL, 'login_success', NULL, '127.0.0.1', NULL, '2026-05-11 05:57:07', '2026-05-11 05:57:07'),
(58, NULL, 'logout', NULL, '127.0.0.1', NULL, '2026-05-11 05:59:20', '2026-05-11 05:59:20'),
(59, 1, 'login_success', NULL, '127.0.0.1', NULL, '2026-05-11 06:09:37', '2026-05-11 06:09:37'),
(60, 1, 'logout', NULL, '127.0.0.1', NULL, '2026-05-11 06:10:22', '2026-05-11 06:10:22'),
(61, 2, 'login_failed', '\"{\\\"email\\\":\\\"recepcion@petspapro.com\\\",\\\"attempts\\\":1}\"', '127.0.0.1', NULL, '2026-05-11 06:10:43', '2026-05-11 06:10:43'),
(62, 2, 'login_failed', '\"{\\\"email\\\":\\\"recepcion@petspapro.com\\\",\\\"attempts\\\":2}\"', '127.0.0.1', NULL, '2026-05-11 06:10:44', '2026-05-11 06:10:44'),
(63, 2, 'login_failed', '\"{\\\"email\\\":\\\"recepcion@petspapro.com\\\",\\\"attempts\\\":3}\"', '127.0.0.1', NULL, '2026-05-11 06:10:46', '2026-05-11 06:10:46'),
(64, 2, 'login_failed', '\"{\\\"email\\\":\\\"recepcion@petspapro.com\\\",\\\"attempts\\\":4}\"', '127.0.0.1', NULL, '2026-05-11 06:10:47', '2026-05-11 06:10:47'),
(65, 2, 'login_failed', '\"{\\\"email\\\":\\\"recepcion@petspapro.com\\\",\\\"attempts\\\":0}\"', '127.0.0.1', NULL, '2026-05-11 06:10:48', '2026-05-11 06:10:48'),
(66, 1, 'login_success', NULL, '127.0.0.1', NULL, '2026-05-11 06:10:57', '2026-05-11 06:10:57'),
(67, 1, 'staff_created', '\"{\\\"created_user_id\\\":9,\\\"rol\\\":\\\"recepcion\\\",\\\"created_by\\\":1}\"', '127.0.0.1', NULL, '2026-05-11 06:12:11', '2026-05-11 06:12:11'),
(68, 1, 'logout', NULL, '127.0.0.1', NULL, '2026-05-11 06:34:15', '2026-05-11 06:34:15'),
(69, 1, 'login_success', NULL, '127.0.0.1', NULL, '2026-05-11 06:36:03', '2026-05-11 06:36:03'),
(70, 1, 'staff_created', '\"{\\\"created_user_id\\\":10,\\\"rol\\\":\\\"recepcion\\\"}\"', '127.0.0.1', NULL, '2026-05-11 06:36:52', '2026-05-11 06:36:52'),
(71, NULL, 'user_registered', NULL, '127.0.0.1', NULL, '2026-05-11 06:40:53', '2026-05-11 06:40:53'),
(72, NULL, 'email_verified', NULL, '127.0.0.1', NULL, '2026-05-11 06:44:09', '2026-05-11 06:44:09'),
(73, NULL, 'logout', NULL, '127.0.0.1', NULL, '2026-05-11 06:44:16', '2026-05-11 06:44:16'),
(74, 13, 'user_registered', NULL, '127.0.0.1', NULL, '2026-05-11 06:46:27', '2026-05-11 06:46:27'),
(75, 13, 'email_verified', NULL, '127.0.0.1', NULL, '2026-05-11 06:46:55', '2026-05-11 06:46:55'),
(76, 13, 'logout', NULL, '127.0.0.1', NULL, '2026-05-11 06:47:02', '2026-05-11 06:47:02'),
(77, 1, 'login_success', NULL, '127.0.0.1', NULL, '2026-05-11 06:47:09', '2026-05-11 06:47:09'),
(78, 1, 'logout', NULL, '127.0.0.1', NULL, '2026-05-11 06:48:12', '2026-05-11 06:48:12'),
(79, 1, 'login_success', NULL, '127.0.0.1', NULL, '2026-05-11 07:00:38', '2026-05-11 07:00:38'),
(80, 1, 'staff_created', '\"{\\\"created_user_id\\\":14,\\\"rol\\\":\\\"groomer\\\"}\"', '127.0.0.1', NULL, '2026-05-11 07:02:31', '2026-05-11 07:02:31'),
(81, 1, 'logout', NULL, '127.0.0.1', NULL, '2026-05-11 07:02:36', '2026-05-11 07:02:36'),
(82, NULL, 'login_failed', '\"{\\\"email\\\":\\\"xxxviolamentesxxx@gmail.com\\\",\\\"attempts\\\":1}\"', '127.0.0.1', NULL, '2026-05-11 07:02:50', '2026-05-11 07:02:50'),
(83, NULL, 'email_verified', NULL, '127.0.0.1', NULL, '2026-05-11 07:07:51', '2026-05-11 07:07:51'),
(84, NULL, 'password_changed', NULL, '127.0.0.1', NULL, '2026-05-11 07:08:11', '2026-05-11 07:08:11'),
(85, NULL, 'logout', NULL, '127.0.0.1', NULL, '2026-05-11 07:09:30', '2026-05-11 07:09:30'),
(86, 13, 'login_success', NULL, '127.0.0.1', NULL, '2026-05-11 07:10:12', '2026-05-11 07:10:12'),
(87, 13, 'logout', NULL, '127.0.0.1', NULL, '2026-05-11 07:28:17', '2026-05-11 07:28:17'),
(88, 1, 'login_success', NULL, '127.0.0.1', NULL, '2026-05-11 07:28:26', '2026-05-11 07:28:26'),
(89, 1, 'staff_created', '\"{\\\"created_user_id\\\":15,\\\"rol\\\":\\\"recepcion\\\"}\"', '127.0.0.1', NULL, '2026-05-11 07:33:41', '2026-05-11 07:33:41'),
(90, 1, 'logout', NULL, '127.0.0.1', NULL, '2026-05-11 07:33:46', '2026-05-11 07:33:46'),
(91, NULL, 'email_verified', NULL, '127.0.0.1', NULL, '2026-05-11 07:34:31', '2026-05-11 07:34:31'),
(92, NULL, 'user_registered', NULL, '127.0.0.1', NULL, '2026-05-11 07:35:07', '2026-05-11 07:35:07'),
(93, NULL, 'email_verified', NULL, '127.0.0.1', NULL, '2026-05-11 07:35:20', '2026-05-11 07:35:20'),
(94, NULL, 'login_success', NULL, '127.0.0.1', NULL, '2026-05-11 07:35:43', '2026-05-11 07:35:43'),
(95, NULL, 'logout', NULL, '127.0.0.1', NULL, '2026-05-11 07:35:48', '2026-05-11 07:35:48'),
(96, 1, 'login_success', NULL, '127.0.0.1', NULL, '2026-05-11 08:08:01', '2026-05-11 08:08:01'),
(97, 1, 'login_success', NULL, '127.0.0.1', NULL, '2026-05-11 08:08:11', '2026-05-11 08:08:11'),
(98, 1, 'logout', NULL, '127.0.0.1', NULL, '2026-05-11 08:10:38', '2026-05-11 08:10:38'),
(99, 1, 'login_success', NULL, '127.0.0.1', NULL, '2026-05-12 07:47:26', '2026-05-12 07:47:26'),
(100, 1, 'logout', NULL, '127.0.0.1', NULL, '2026-05-12 07:48:49', '2026-05-12 07:48:49'),
(101, 1, 'login_success', NULL, '127.0.0.1', NULL, '2026-05-12 08:00:27', '2026-05-12 08:00:27'),
(102, 1, 'logout', NULL, '127.0.0.1', NULL, '2026-05-12 08:00:47', '2026-05-12 08:00:47'),
(103, 1, 'login_success', NULL, '127.0.0.1', NULL, '2026-05-12 08:01:59', '2026-05-12 08:01:59'),
(104, 1, 'staff_created', '\"{\\\"created_user_id\\\":17,\\\"rol\\\":\\\"recepcion\\\"}\"', '127.0.0.1', NULL, '2026-05-12 08:03:34', '2026-05-12 08:03:34'),
(105, 1, 'logout', NULL, '127.0.0.1', NULL, '2026-05-12 08:03:42', '2026-05-12 08:03:42'),
(106, 17, 'email_verified', NULL, '127.0.0.1', NULL, '2026-05-12 08:04:51', '2026-05-12 08:04:51'),
(107, 17, 'password_changed', NULL, '127.0.0.1', NULL, '2026-05-12 08:05:18', '2026-05-12 08:05:18'),
(108, 17, 'logout', NULL, '127.0.0.1', NULL, '2026-05-12 08:05:37', '2026-05-12 08:05:37'),
(109, 18, 'user_registered', NULL, '127.0.0.1', NULL, '2026-05-12 08:06:57', '2026-05-12 08:06:57'),
(110, 18, 'email_verified', NULL, '127.0.0.1', NULL, '2026-05-12 08:07:36', '2026-05-12 08:07:36'),
(111, 18, 'login_success', NULL, '127.0.0.1', NULL, '2026-05-12 08:08:13', '2026-05-12 08:08:13'),
(112, 18, 'logout', NULL, '127.0.0.1', NULL, '2026-05-12 08:08:24', '2026-05-12 08:08:24'),
(113, 17, 'login_failed', '\"{\\\"email\\\":\\\"elviscantuta@gmail.com\\\",\\\"attempts\\\":1}\"', '127.0.0.1', NULL, '2026-05-12 08:08:38', '2026-05-12 08:08:38'),
(114, 17, 'login_failed', '\"{\\\"email\\\":\\\"elviscantuta@gmail.com\\\",\\\"attempts\\\":2}\"', '127.0.0.1', NULL, '2026-05-12 08:08:43', '2026-05-12 08:08:43'),
(115, 17, 'login_failed', '\"{\\\"email\\\":\\\"elviscantuta@gmail.com\\\",\\\"attempts\\\":3}\"', '127.0.0.1', NULL, '2026-05-12 08:08:44', '2026-05-12 08:08:44'),
(116, 17, 'login_failed', '\"{\\\"email\\\":\\\"elviscantuta@gmail.com\\\",\\\"attempts\\\":4}\"', '127.0.0.1', NULL, '2026-05-12 08:08:45', '2026-05-12 08:08:45'),
(117, 17, 'login_failed', '\"{\\\"email\\\":\\\"elviscantuta@gmail.com\\\",\\\"attempts\\\":0}\"', '127.0.0.1', NULL, '2026-05-12 08:08:51', '2026-05-12 08:08:51'),
(118, 1, 'login_success', NULL, '127.0.0.1', NULL, '2026-05-12 08:09:16', '2026-05-12 08:09:16'),
(119, 1, 'user_status_changed', '\"{\\\"target_user_id\\\":18,\\\"new_status\\\":\\\"inactivo\\\"}\"', '127.0.0.1', NULL, '2026-05-12 08:09:27', '2026-05-12 08:09:27'),
(120, 1, 'logout', NULL, '127.0.0.1', NULL, '2026-05-12 08:09:33', '2026-05-12 08:09:33'),
(121, 18, 'login_failed', '\"{\\\"email\\\":\\\"elvisaux@gmail.com\\\",\\\"attempts\\\":1}\"', '127.0.0.1', NULL, '2026-05-12 08:09:46', '2026-05-12 08:09:46'),
(122, 18, 'login_failed', '\"{\\\"email\\\":\\\"elvisaux@gmail.com\\\",\\\"attempts\\\":2}\"', '127.0.0.1', NULL, '2026-05-12 08:09:52', '2026-05-12 08:09:52'),
(123, 18, 'login_failed', '\"{\\\"email\\\":\\\"elvisaux@gmail.com\\\",\\\"attempts\\\":3}\"', '127.0.0.1', NULL, '2026-05-12 08:09:54', '2026-05-12 08:09:54'),
(124, 18, 'login_failed', '\"{\\\"email\\\":\\\"elvisaux@gmail.com\\\",\\\"attempts\\\":4}\"', '127.0.0.1', NULL, '2026-05-12 08:09:55', '2026-05-12 08:09:55'),
(125, 18, 'login_failed', '\"{\\\"email\\\":\\\"elvisaux@gmail.com\\\",\\\"attempts\\\":0}\"', '127.0.0.1', NULL, '2026-05-12 08:09:56', '2026-05-12 08:09:56'),
(126, 1, 'login_success', NULL, '127.0.0.1', NULL, '2026-05-12 08:10:17', '2026-05-12 08:10:17'),
(127, 1, 'user_status_changed', '\"{\\\"target_user_id\\\":18,\\\"new_status\\\":\\\"activo\\\"}\"', '127.0.0.1', NULL, '2026-05-12 08:10:21', '2026-05-12 08:10:21');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `citas`
--

CREATE TABLE `citas` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `staff_id` bigint(20) UNSIGNED DEFAULT NULL,
  `fecha` date NOT NULL,
  `hora` time NOT NULL,
  `servicio` varchar(100) NOT NULL,
  `estado` enum('pendiente','completada','cancelada') NOT NULL DEFAULT 'pendiente',
  `notas` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '2014_10_12_000000_create_users_table', 1),
(2, '2014_10_12_100000_create_password_reset_tokens_table', 1),
(3, '2019_08_19_000000_create_failed_jobs_table', 1),
(4, '2019_12_14_000001_create_personal_access_tokens_table', 1),
(5, '2026_05_10_213640_create_audit_logs_table', 1),
(6, '2026_05_10_213644_create_citas_table', 1),
(7, '2026_05_10_222730_add_must_change_password_to_users_table', 2),
(8, '2026_05_10_230949_add_fields_to_users_table', 3),
(9, '2026_05_11_011742_add_login_attempts_and_locked_until_to_users_table', 4),
(10, '2026_05_11_021646_add_verification_code_to_users_table', 5);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(1, 'App\\Models\\User', 1, 'auth-token', '85493bb542b457eeaddd6fba0fdafe114c195f863438fa4191cc2ac93ad14631', '[\"*\"]', NULL, NULL, '2026-05-11 01:55:38', '2026-05-11 01:55:38'),
(9, 'App\\Models\\User', 1, 'auth-token', 'ef9021b5846d38f6cab42a52b3252ef5496effddfea13aa6677f56a8aaf5142b', '[\"*\"]', '2026-05-11 04:13:32', NULL, '2026-05-11 03:25:02', '2026-05-11 04:13:32'),
(21, 'App\\Models\\User', 1, 'auth-token', '44d91819e0eb4dfe9787f0b2f8cd5d52540e4d874757e6a725336cd038bbb698', '[\"*\"]', '2026-05-11 06:36:55', NULL, '2026-05-11 06:36:03', '2026-05-11 06:36:55'),
(29, 'App\\Models\\User', 15, 'auth-token', 'c32ae1c29ba673510b0a67c20e001992c0aa2944b5feca53228fd7d388714fb8', '[\"*\"]', NULL, NULL, '2026-05-11 07:34:31', '2026-05-11 07:34:31'),
(30, 'App\\Models\\User', 16, 'auth-token', 'dcd298769eb5e863e69acb2495077c837fc5391be8758dbdfacaf2920cb20dec', '[\"*\"]', NULL, NULL, '2026-05-11 07:35:20', '2026-05-11 07:35:20'),
(32, 'App\\Models\\User', 1, 'auth-token', '296c8f0730957be95520d660363e518ffe84add61aa742950e0d4915ca4a15a4', '[\"*\"]', NULL, NULL, '2026-05-11 08:08:01', '2026-05-11 08:08:01'),
(38, 'App\\Models\\User', 18, 'auth-token', '0e0b77379679e59d15c1eb71cc4c22176b39cd4e5f34dad854bb031ba58435ae', '[\"*\"]', NULL, NULL, '2026-05-12 08:07:36', '2026-05-12 08:07:36'),
(41, 'App\\Models\\User', 1, 'auth-token', '39e7464539ffe726e9b4d552e19a1d0903c9517a95481a97e91e76c3e1d01ce8', '[\"*\"]', '2026-05-12 08:10:57', NULL, '2026-05-12 08:10:17', '2026-05-12 08:10:57');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `rol` enum('admin','groomer','recepcion','cliente') NOT NULL DEFAULT 'cliente',
  `estado` enum('activo','inactivo') NOT NULL DEFAULT 'activo',
  `telefono` varchar(20) DEFAULT NULL,
  `ci` varchar(20) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `especialidad` varchar(100) DEFAULT NULL,
  `turno` enum('mañana','tarde','noche') DEFAULT NULL,
  `must_change_password` tinyint(1) NOT NULL DEFAULT 0,
  `login_attempts` tinyint(3) UNSIGNED NOT NULL DEFAULT 0,
  `locked_until` timestamp NULL DEFAULT NULL,
  `verification_code` varchar(10) DEFAULT NULL,
  `verification_code_expires_at` timestamp NULL DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `rol`, `estado`, `telefono`, `ci`, `direccion`, `especialidad`, `turno`, `must_change_password`, `login_attempts`, `locked_until`, `verification_code`, `verification_code_expires_at`, `remember_token`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Administrador', 'admin@petspapro.com', '2026-05-11 01:43:18', '$2y$12$X536Q0kjYSHq3zfdRX1sUOp1gU1ADoJ8GSDtAXHnZw9HwQ5A.VTnO', 'admin', 'activo', NULL, NULL, NULL, NULL, NULL, 0, 0, '2026-05-11 06:09:17', NULL, NULL, NULL, '2026-05-11 01:43:18', '2026-05-11 05:54:17', NULL),
(2, 'María Recepción', 'recepcion@petspapro.com', '2026-05-11 01:43:18', '$2y$12$AordyTw8m.1Fv5vYSSMh0ePoBKRw.nuO8zugYW7Dl2iQQz8RVjkKi', 'recepcion', 'activo', NULL, NULL, NULL, NULL, NULL, 0, 0, '2026-05-11 06:25:48', NULL, NULL, NULL, '2026-05-11 01:43:18', '2026-05-11 06:10:48', NULL),
(8, 'e', 'as@gmail.com', NULL, '$2y$12$MK4X.eF1xXmD2OnGpaIz/e9Fw.kYOo5npkvbF7K4CPOOgQRLiPBrS', 'recepcion', 'activo', '123', NULL, NULL, NULL, 'mañana', 1, 0, NULL, NULL, NULL, NULL, '2026-05-11 05:04:47', '2026-05-11 05:04:47', NULL),
(13, 'Ruben', 'rubenales568@gmail.com', '2026-05-11 06:46:55', '$2y$12$qHcPmaxSqVT7/Emwvse9g.DiKVtc0Rr5BTjwiT7dRMBrjEBxGBygG', 'cliente', 'activo', '772632123', '12321321', 'vin o', NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, '2026-05-11 06:46:24', '2026-05-11 06:46:55', NULL),
(17, 'Elvis Alberth Cantuta Quispe', 'elviscantuta@gmail.com', '2026-05-12 08:04:51', '$2y$12$yrHXzgaM.S02kyDiyFbszeiSiJpn70YeKIU7pFp6YBCQHV4B1Gye6', 'recepcion', 'activo', '77227645', NULL, NULL, NULL, 'tarde', 0, 0, '2026-05-12 08:23:51', NULL, NULL, NULL, '2026-05-12 08:03:27', '2026-05-12 08:08:51', NULL),
(18, 'Elvis Alberth Cantuta Quisoe', 'elvisaux@gmail.com', '2026-05-12 08:07:36', '$2y$12$xfatACEN9.zUgrWpxiNQiuEiMjhQWRKBo5femXBdKJq4fqcFLCG0m', 'cliente', 'activo', '123', '123', 'Vinotinto', NULL, NULL, 0, 0, '2026-05-12 08:24:56', NULL, NULL, NULL, '2026-05-12 08:06:55', '2026-05-12 08:10:21', NULL);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `audit_logs_user_id_foreign` (`user_id`),
  ADD KEY `audit_logs_action_index` (`action`),
  ADD KEY `audit_logs_created_at_index` (`created_at`);

--
-- Indices de la tabla `citas`
--
ALTER TABLE `citas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `citas_user_id_foreign` (`user_id`),
  ADD KEY `citas_staff_id_foreign` (`staff_id`),
  ADD KEY `citas_fecha_hora_index` (`fecha`,`hora`),
  ADD KEY `citas_estado_index` (`estado`);

--
-- Indices de la tabla `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indices de la tabla `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indices de la tabla `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `audit_logs`
--
ALTER TABLE `audit_logs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=128;

--
-- AUTO_INCREMENT de la tabla `citas`
--
ALTER TABLE `citas`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD CONSTRAINT `audit_logs_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `citas`
--
ALTER TABLE `citas`
  ADD CONSTRAINT `citas_staff_id_foreign` FOREIGN KEY (`staff_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `citas_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
