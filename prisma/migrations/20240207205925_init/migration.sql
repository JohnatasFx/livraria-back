-- CreateTable
CREATE TABLE `Livro` (
    `id` VARCHAR(191) NOT NULL,
    `nomeLivro` VARCHAR(191) NOT NULL,
    `nomeAutor` VARCHAR(191) NOT NULL,
    `preco` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
