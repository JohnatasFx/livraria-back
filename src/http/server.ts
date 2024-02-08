import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { createBook, updateBook, getBook, getAllBooks, deleteBook} from '../controllers/book';

const app = express();
const port = process.env.PORT || 3000;

// app.get("/", (req: Request, res: Response) => {
//     res.send("Hello World!");
// });

app.use(bodyParser.json());

app.post("/book", createBook);

app.put("/book", updateBook);

app.get("/book", getBook);

app.get("/book/all", getAllBooks);

app.delete("/book", deleteBook);

app.listen(port, ()=>{
    console.log(`Server rodando na porta ${port}!`);
})