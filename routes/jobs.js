const { Router } = require("express");
const pool = require("../config/db");
const router = Router();

router.get("/", async (req, res) => {
  try {
    const job = await pool.query("SELECT * FROM job");
    res.status(200).json({ success: true, jobs: job.rows });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post("/add", async (req, res) => {
  try {
    const { title } = req.body;
    const newJob = await pool.query(
      `
      insert into job (title) values ($1) returning *
    `,
      [title]
    );
    res.status(201).json({ success: true, job: newJob.rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query(
      `
    delete from employer where job_id=$1
    `,
      [id]
    );
    await pool.query(
      `
    delete from job where id=$1 returning *`,
      [id]
    );
    res.status(200).json({ success: true, job: [] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
