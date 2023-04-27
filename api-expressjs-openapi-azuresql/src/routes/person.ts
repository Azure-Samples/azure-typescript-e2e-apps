import express, { Router, Request, Response } from "express";
import Database from "../dbazuresql";
import { noPasswordConfig, passwordConfig } from "../config";

const router: Router = express.Router();
router.use(express.json());

const config = noPasswordConfig;
console.log(`DB Config: ${JSON.stringify(config)}`)
const database = new Database(config);

// Define the GET handler for /users
router.get('/', async (req, res) => {
    try {
        // Return a list of users
        const users = await database.readAll('Users');
        console.log(`users: ${JSON.stringify(users)}`);
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: err?.message })
    }

});

// Define the POST handler for /users
router.post('/', async (req, res) => {
    try {
        const user = req.body;
        delete user.id;
        console.log(`user: ${JSON.stringify(user)}`);

        const rowsAffected = await database.create('Users', user)
        res.status(201).json({ rowsAffected })


    } catch (err) {
        res.status(500).json({ error: err?.message })
    }

});

// Define the GET handler for /users/:id
router.get('/:id', async (req, res) => {
    try {
        // Update the user with the specified ID
        const userId = req.params.id;
        console.log(`userId: ${userId}`);

        if (userId) {
            const result = await database.read('Users', userId);
            console.log(`users: ${JSON.stringify(result)}`);
            res.status(200).json(result);
        } else {
            res.status(404);
        }
    } catch (err) {
        res.status(500).json({ error: err?.message })
    }

});

// Define the PUT handler for /users/:id
router.put('/:id', async (req, res) => {
    try {
        // Update the user with the specified ID
        const userId = req.params.id;
        console.log(`userId: ${userId}`);

        const user = req.body;

        if (userId && user) {

            delete user.id;
            console.log(`user: ${JSON.stringify(user)}`);

            const rowsAffected = await database.update('Users', userId, user);
            res.status(200).json({ rowsAffected })
        } else {
            res.status(404);
        }
    } catch (err) {
        res.status(500).json({ error: err?.message })
    }
});

// Define the DELETE handler for /users/:id
router.delete('/:id', async (req, res) => {
    try {
        // Delete the user with the specified ID
        const userId = req.params.id;
        console.log(`userId: ${userId}`);

        if (!userId) {
            res.status(404)
        } else {
            const rowsAffected = await database.delete('Users', userId);
            res.status(204).json({ rowsAffected })
        }
    } catch (err) {
        res.status(500).json({ error: err?.message })
    }
});

export default router;