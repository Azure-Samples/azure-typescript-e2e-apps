import express, { Router, Request, Response } from "express";

const router: Router = express.Router();
router.use(express.json());

let nextId = 2;

let users = [
    {
        id: 1,
        name: 'jim',
        email: 'jim@contoso.com',
        password: '1234'
    }
];

// Define the GET handler for /users
router.get('/', (req, res) => {
    // Return a list of users
    res.status(200).json(users);
});

// Define the POST handler for /users
router.post('/', (req, res) => {

    const user = req.body;
    console.log(`user: ${JSON.stringify(user)}`);

    const newUser = { ...user, id: nextId++ };
    users.push(newUser);
    console.log(newUser)

    // Create a new user
    res.status(201).json(newUser);
});

// Define the GET handler for /users/:id
router.get('/:id', (req, res) => {
    // Update the user with the specified ID
    const userId = req.params.id;

    const pos = users.findIndex(x => x.id === +userId);
    if (pos!==-1) {
        console.log(`GET /:id - found user`)
        res.status(200).json(users[pos]);

    } else {
        console.log(`GET /:id - not found user`)
        res.status(404).json({error: 'User not found'})
    }
});

// Define the PUT handler for /users/:id
router.put('/:id', (req, res) => {
    // Update the user with the specified ID
    const userId = req.params.id;
    const user = req.body;

    const pos = users.findIndex(x => x.id === +userId);
    if (pos!==-1) {
        console.log(`PUT /:id - found user`)
        users[pos]={ ...user, id: +userId };
        res.status(200).json(user)
    } else {
        console.log(`PUT /:id - not found user`)
        res.status(404).json({error: 'User not found'})
    }
});

// Define the DELETE handler for /users/:id
router.delete('/:id', (req, res) => {
    // Delete the user with the specified ID
    const userId = req.params.id;

    const pos = users.findIndex(x => x.id === +userId);
    console.log(`pos: ${pos}`)

    if (pos!==-1) {
        console.log(`DELETE /:id - found user`)
        users.splice(pos,1);
        console.log(`delete, now users: ${JSON.stringify(users)}`)
        return res.status(204).json({'status': 'completed'});
    } else {
        console.log(`DELETE /:id - not found user`)
        res.status(404).json({error: 'User not found'})
    }
});

export default router;