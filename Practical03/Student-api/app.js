const express = require("express");
const sql = require("mssql");
const dbConfig = require("./dbConfig");

const app = express();
app.use(express.json());

// GET all students
app.get("/students", async (req, res) => {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const result = await connection.request().query("SELECT student_id, name, address FROM Students");
    res.json(result.recordset);
  } catch (error) {
    res.status(500).send("Error retrieving students");
  } finally {
    if (connection) await connection.close();
  }
});

// GET student by ID
app.get("/students/:id", async (req, res) => {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const request = connection.request();
    request.input("id", sql.Int, parseInt(req.params.id));
    const result = await request.query("SELECT * FROM Students WHERE student_id = @id");

    if (!result.recordset[0]) return res.status(404).send("Student not found");
    res.json(result.recordset[0]);
  } catch (error) {
    res.status(500).send("Error retrieving student");
  } finally {
    if (connection) await connection.close();
  }
});

// POST create new student
app.post("/students", async (req, res) => {
  if (!req.body.name) return res.status(400).send("Name is required");

  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const request = connection.request();
    request.input("name", sql.VarChar, req.body.name);
    request.input("address", sql.VarChar, req.body.address);
    const result = await request.query("INSERT INTO Students (name, address) VALUES (@name, @address); SELECT SCOPE_IDENTITY() AS student_id;");

    const newId = result.recordset[0].student_id;
    const getRequest = connection.request();
    getRequest.input("id", sql.Int, newId);
    const newStudentResult = await getRequest.query("SELECT * FROM Students WHERE student_id = @id");

    res.status(201).json(newStudentResult.recordset[0]);
  } catch (error) {
    res.status(500).send("Error creating student");
  } finally {
    if (connection) await connection.close();
  }
});

// PUT update student by ID
app.put("/students/:id", async (req, res) => {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const request = connection.request();
    request.input("id", sql.Int, parseInt(req.params.id));
    request.input("name", sql.VarChar, req.body.name);
    request.input("address", sql.VarChar, req.body.address);
    const result = await request.query("UPDATE Students SET name = @name, address = @address WHERE student_id = @id");

    if (result.rowsAffected[0] === 0) return res.status(404).send("Student not found");

    const getRequest = connection.request();
    getRequest.input("id", sql.Int, parseInt(req.params.id));
    const updatedResult = await getRequest.query("SELECT * FROM Students WHERE student_id = @id");

    res.json(updatedResult.recordset[0]);
  } catch (error) {
    res.status(500).send("Error updating student");
  } finally {
    if (connection) await connection.close();
  }
});

// DELETE student by ID
app.delete("/students/:id", async (req, res) => {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const request = connection.request();
    request.input("id", sql.Int, parseInt(req.params.id));
    const result = await request.query("DELETE FROM Students WHERE student_id = @id");

    if (result.rowsAffected[0] === 0) return res.status(404).send("Student not found");
    res.status(204).send();
  } catch (error) {
    res.status(500).send("Error deleting student");
  } finally {
    if (connection) await connection.close();
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));