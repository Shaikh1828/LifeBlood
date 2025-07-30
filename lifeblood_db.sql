-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 30, 2025 at 08:04 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `lifeblood_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `donation_records`
--

CREATE TABLE `donation_records` (
  `id` int(11) NOT NULL,
  `donor_id` int(11) DEFAULT NULL,
  `recipient_contact` varchar(20) DEFAULT NULL,
  `donation_date` datetime NOT NULL,
  `location` varchar(255) NOT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `donation_records`
--

INSERT INTO `donation_records` (`id`, `donor_id`, `recipient_contact`, `donation_date`, `location`, `notes`, `created_at`) VALUES
(1, 1, '01777777777', '2025-07-28 06:00:00', 'Dhaka Medical', 'Emergency patient', '2025-07-28 15:10:05');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `blood_group` enum('A+','A-','B+','B-','AB+','AB-','O+','O-') NOT NULL,
  `division` varchar(100) NOT NULL,
  `district` varchar(100) NOT NULL,
  `upazila` varchar(100) NOT NULL,
  `address` text NOT NULL,
  `role` enum('donor','recipient','admin') DEFAULT 'donor',
  `is_active` tinyint(1) DEFAULT 1,
  `is_verified` tinyint(1) DEFAULT 0,
  `last_donation_date` datetime DEFAULT NULL,
  `total_donations` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `password_hash`, `name`, `phone`, `blood_group`, `division`, `district`, `upazila`, `address`, `role`, `is_active`, `is_verified`, `last_donation_date`, `total_donations`, `created_at`, `updated_at`) VALUES
(1, 'test@example.com', '123456', 'Test User', '01700000000', 'A+', 'Dhaka', 'Dhaka', 'Dhanmondi', 'House 1, Road 2', 'donor', 1, 0, '2025-07-28 06:00:00', 1, '2025-07-28 10:32:51', '2025-07-28 15:10:05'),
(2, 'naima@example.com', '$2a$12$L7s2CzN8mXobhwnUvsTxZOyYVTvonGb/RWSYLm.MMhadJdWzz8Tey', 'Test User', '01700000000', 'O-', 'Dhaka', 'Dhaka', 'Dhanmondi', 'House 1, Road 2', 'donor', 1, 0, NULL, 0, '2025-07-28 18:14:34', '2025-07-28 18:14:34');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `donation_records`
--
ALTER TABLE `donation_records`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_donation_records_date` (`donation_date`),
  ADD KEY `donor_id` (`donor_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_users_blood_group` (`blood_group`),
  ADD KEY `idx_users_location` (`division`,`district`,`upazila`),
  ADD KEY `idx_users_role_active` (`role`,`is_active`,`is_verified`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `donation_records`
--
ALTER TABLE `donation_records`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `donation_records`
--
ALTER TABLE `donation_records`
  ADD CONSTRAINT `donation_records_ibfk_1` FOREIGN KEY (`donor_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
