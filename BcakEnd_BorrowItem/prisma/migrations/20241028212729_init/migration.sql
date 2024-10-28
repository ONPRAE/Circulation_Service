-- CreateTable
CREATE TABLE `borrow` (
    `borrow_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `borrow_date` DATETIME(0) NULL,
    `borrow_return` DATETIME(0) NULL,
    `status` ENUM('Pending', 'Borrowing', 'Return', 'Cancel', 'Late') NULL,

    INDEX `users_ibfk_1`(`user_id`),
    PRIMARY KEY (`borrow_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `borrowdetail` (
    `borrow_id` INTEGER NOT NULL,
    `product_id` INTEGER NOT NULL,
    `amount` INTEGER NOT NULL,

    INDEX `product_id`(`product_id`),
    PRIMARY KEY (`borrow_id`, `product_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `products` (
    `product_id` INTEGER NOT NULL AUTO_INCREMENT,
    `product_name` VARCHAR(100) NULL,
    `product_type` ENUM('ToolKids', 'Projector', 'Mouse', 'Laptop', 'Keyboard', 'Speaker', 'Monitor') NULL,
    `stock` INTEGER NULL,
    `image` VARCHAR(255) NULL,

    PRIMARY KEY (`product_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    `first_name` VARCHAR(100) NOT NULL,
    `last_name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `role` ENUM('Admin', 'User') NULL,

    UNIQUE INDEX `email`(`email`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
