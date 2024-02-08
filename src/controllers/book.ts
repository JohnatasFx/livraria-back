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

const updateBookSchema  = z.object({
    id: z.string().cuid(),
    nomeLivro: z.string().min(2).max(255).optional(),
    nomeAutor: z.string().min(2).max(255).optional(),
    preco: z.number().min(0.01).max(1000000).optional()
});

const createBook = async ( req: Request, res: Response) => {
    const result = createBookSchema.safeParse(req.body);

    if(!result.success){
        res.status(400).json({message: 'Dados inválidos.'})
        return;
    }

    try {
        const {nomeLivro, nomeAutor, preco} = result.data;
        
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

const updateBook = async (req: Request, res: Response) => {
    const result = updateBookSchema.safeParse(req.body);

    if(!result.success){
        res.status(400).json({message: 'Dados inválidos'});
        return;
    }

    try {
        const {id, nomeLivro, nomeAutor, preco} = result.data;

        const book = await prisma.livro.update({
            where: {id: id as string},
            data: {
                ...(nomeLivro && {nomeLivro}),
                ...(nomeAutor && {nomeAutor}),
                ...(preco && {preco})
            }
        })

        if(!book){
            res.status(500).json({message: 'Erro ao atualizar livro.'});
            return;
        }

        res.status(200).json(book.id);
        return;

    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Erro ao atualizar livro.'});
        return;
    }
}

export {createBook, updateBook};