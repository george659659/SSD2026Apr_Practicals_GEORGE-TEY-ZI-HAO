const express = require('express');
const app = express();
const PORT = 3000; 

const student = {
    "name": "GEORGE TEY",
    "hobbies": ["Coding", "Reading", "Gaming"],
    "intro": "Hello! I am a student learning web development and building my first API."
};

// 1. GET / -> Returns "Welcome to Homework API"
app.get('/', (req, res) => {
    res.send('Welcome to Homework API');
});

// 2. GET /intro 
app.get('/intro', (req, res) => {
    res.send(student.intro);
});

// 3. GET /name 
app.get('/name', (req, res) => {
    res.send(student.name); 
});

// 4. GET /hobbies 
app.get('/hobbies', (req, res) => {
    res.json(student.hobbies); 
});

// 5. GET /food 
app.get('/food', (req, res) => {
    res.json(['Pizza', 'Sushi', 'Hotpot']);
});

// 6. GET /student -
app.get('/student', (req, res) => {
    res.json(student);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});