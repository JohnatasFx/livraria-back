import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

const createBookSchema = z.object({
    nomeLivro: z.string().min(2).max(255),
    nomeAutor: z.string().min(2).max(255),
    preco: z.number().min(0.01).max(1000000)
});

const createBook = async ( req: Request, res: Response) => {
    const {nomeLivro, nomeAutor, preco} = req.body;

    try {
        const newBook: Prisma.LivroCreateInput = {nomeLivro, nomeAutor, preco};

        const book = await prisma.livro.create({data: newBook});

        if(!book){
            res.status(500).json({message: 'erro ao criar livro'});
            return;
        }

        res.status(201).json(book.id);
        return;

    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Erro ao criar livro'});
        return;
    }
}

export {createBook};