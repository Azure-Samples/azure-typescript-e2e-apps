import express, { Request, Response } from 'express';

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Simple GET endpoint
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, world!');
});

// Simple POST endpoint
app.post('/data', (req: Request, res: Response) => {
  const data = req.body;
  console.log(data);
  res.json({ received: data });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});