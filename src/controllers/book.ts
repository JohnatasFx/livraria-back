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

const getBook = async (req: Request, res: Response) => {
    const result = updateBookSchema.safeParse({id: req.query?.id})
    if(!result.success){
        res.status(400).json({message: 'Dados inválidos.'});
        return;
    }

    try {
        const {id} = result.data;
        const book = await prisma.livro.findUnique({where: {id}});

        if(!book){
            res.status(404).json({message: 'Livro não encontrado.'});
            return;
        }

        res.status(200).json(book);

    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Erro ao buscar o livro'});
        return;
    }
}

const getAllBooks = async (req: Request, res: Response) => {
    try {
        const books = await prisma.livro.findMany();
        if(!books){
            res.status(404).json({message: 'Não foi possivel encontrar livros.'});
            return;
        }

        res.status(200).json(books);
        return;

    } catch (error) {
        console.error(error)
        res.status(500).json({message: 'Erro ao encontrar livros.'});
    }
}

const deleteBook = async (req: Request, res: Response) => {
    const result = updateBookSchema.safeParse({id: req.query.id});

    if(!result.success){
        res.status(400).json({message: 'Dados invalidos'});
        return;
    }

    try {
        const {id} = result.data;

        const bookExist = prisma.livro.findUnique({where: {id: id as string}});

        if(!bookExist){
            res.status(404).json({message: 'Livro não encontrado'});
            return;
        }

        const book = await prisma.livro.delete({where: {id: id as string}});

        if(!book){
            res.status(500).json({message: 'Erro ao deletar livro'});
            return
        }

        res.status(200).json(book.id);
        return;

    } catch (error) {
        console.error(error);
        res.status(400).json({message: 'Erro ao deletar livro.'});
        return;
    }

}

export {createBook, updateBook, getBook, getAllBooks, deleteBook};