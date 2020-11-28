const express = require('express'); 
const shortid = require('shortid');

const generate = require('shortid').generate; 



const app = express(); 
app.use(express.json()); 


const PORT = 5000; 

let users = [
    {
        id: shortid(), 
        name: 'Cristian', 
        bio: 'I like to watch and play soccer', 
    }
]

//get all users

app.get('/api/users', (req, res) => {
    
    try {
        res.send(users)
        res.status(200).send(); 
    }
    catch(e){
        res.status(500).send({errorMessage: 'The users information could not be retrieved. '}); 
    }
})


//get user by id
app.get('/api/users/:id', (req, res) => {

    const id = req.params.id; 

    const filteredArr = users.filter(cur => id === cur.id); 

    if(filteredArr.length === 0){
        return res.status(404).send(); 
    }
    else {
        res.send(filteredArr[0]); 
    }
})

//add a new user
app.post('/users', (req, res) => {
    
    const { name, bio } = req.body; 

    if(!name || !bio){
     return res.status(400).send({errorMessage: 'Please provide name and bio for the user.'}); 
    }

  /*   users = [...users, {
        id: shortid(), 
        name: name, 
        bio: bio, 
    }] */

    const newUser = { id: shortid(), name, bio }; 

    users.push(newUser); 
    
    res.status(201).send(req.body); 
})

//delete a new user
app.delete('/api/users/:id', (req, res) => {

const found = users.find( cur => cur.id === req.params.id); 

if(found){
    users = users.filter(cur => req.params.id !== cur.id); 
    return res.status(200).send({message: "User successfully removed"}); 
}
else {
    return res.status(400).send({message: "The user could not be removed"}); 
}

    
})

//edit/update a user
app.put('/api/users/:id', (req, res) => {

    const found = users.find( cur => cur.id === req.params.id);

    if(!found){
        return res.status(404).send({message: "The user with the specified ID does not exist"}); 
    }

    const updates = Object.keys(req.body); 
    const allowedUpdates = ['name', 'bio']; 
    const isValidUpdate = updates.every(cur => allowedUpdates.includes(cur)); 

    if(!isValidUpdate){
        return res.status(400).send({errorMessage: "Please provide name and bio for the user"})
    }
    else {
        const user = found; 

        updates.forEach(cur => user[cur] = req.body[cur]); 
        return res.status(200).send(user); 
    }
})


app.listen(PORT, () => {
    console.log('server is up on port ' + PORT)
})