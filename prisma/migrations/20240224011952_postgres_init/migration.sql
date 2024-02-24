-- CreateTable
CREATE TABLE "Livro" (
    "id" TEXT NOT NULL,
    "nomeLivro" TEXT NOT NULL,
    "nomeAutor" TEXT NOT NULL,
    "preco" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Livro_pkey" PRIMARY KEY ("id")
);
