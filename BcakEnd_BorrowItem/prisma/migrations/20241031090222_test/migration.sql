-- AddForeignKey
ALTER TABLE `borrowdetail` ADD CONSTRAINT `borrowdetail_borrow_id_fkey` FOREIGN KEY (`borrow_id`) REFERENCES `borrow`(`borrow_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `borrowdetail` ADD CONSTRAINT `borrowdetail_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`product_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
