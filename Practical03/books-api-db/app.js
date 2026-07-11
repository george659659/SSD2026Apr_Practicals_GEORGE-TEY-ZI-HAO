app.put('/books/:id', async (req, res) => {
  const bookId = parseInt(req.params.id);
  const { title, author } = req.body; 

  if (!title || !author) {
    return res.status(400).json({ message: "Title and Author are required" });
  }

  let pool;
  try {
    pool = await sql.connect(dbConfig);

    const updateResult = await pool.request()
      .input('id', sql.Int, bookId)
      .input('title', sql.VarChar, title)
      .input('author', sql.VarChar, author)
      .query('UPDATE Books SET title = @title, author = @author WHERE id = @id');

    if (updateResult.rowsAffected[0] === 0) {
      return res.status(404).json({ message: "Book not found" });
    }

    const currentResult = await pool.request()
      .input('id', sql.Int, bookId)
      .query('SELECT * FROM Books WHERE id = @id');

    res.status(200).json(currentResult.recordset[0]);

  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  } finally {

    if (pool) await pool.close();
  }
});

app.delete('/books/:id', async (req, res) => {
  const bookId = parseInt(req.params.id);

  let pool;
  try {
    pool = await sql.connect(dbConfig);

    const result = await pool.request()
      .input('id', sql.Int, bookId)
      .query('DELETE FROM Books WHERE id = @id');

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(204).send();

  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  } finally {
    if (pool) await pool.close();
  }
});