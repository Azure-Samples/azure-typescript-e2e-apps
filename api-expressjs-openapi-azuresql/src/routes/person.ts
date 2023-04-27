import express, { Router, Request, Response } from "express";
import Database from "../dbazuresql";
import { passwordlessConfiguration } from "../config";

const router: Router = express.Router();
router.use(express.json());

const database = new Database(passwordlessConfiguration);

// Define the GET handler for /users
router.get('/', async(req, res) => {
    // Return a list of users
    const users = await database.readAll('Users');
    res.status(200).json(users.recordset[0]);
});

// Define the POST handler for /users
router.post('/', async (req, res) => {

    const user = req.body;
    delete user.id;
    console.log(`user: ${JSON.stringify(user)}`);

    const result = await database.create('Users', user)
    console.log(`result: ${JSON.stringify(result)}`);
    // Create a new user
    res.status(201).json(user);
});

// Define the GET handler for /users/:id
router.get('/:id', async (req, res) => {
    // Update the user with the specified ID
    const userId = req.params.id;

    const result = await database.read('Users', userId);
    res.status(200).json(result);
});

// Define the PUT handler for /users/:id
router.put('/:id', async (req, res) => {
    // Update the user with the specified ID
    const userId = req.params.id;
    const user = req.body;
    delete user.id;

    const result = await database.update('Users', userId, user);
});

// Define the DELETE handler for /users/:id
router.delete('/:id', async (req, res) => {
    // Delete the user with the specified ID
    const userId = req.params.id;

    const result = await database.delete('Users', userId);
    
});

export default router;