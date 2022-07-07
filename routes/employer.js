const { Router } = require("express");
const pool = require("../config/db");
const router = Router();

router.get("/", async (req, res) => {
  try {
    const employer = await pool.query("SELECT * FROM employer");
    res.status(200).json({ success: true, employers: employer.rows });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const employer = await pool.query(
      `
        select employer.name, employer.salary, job.title from employer left join job on employer.job_id=job.id where employer.id=$1
        `,
      [id]
    );
    res.status(200).json({ success: true, employer: employer.rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post("/add", async (req, res) => {
  try {
    const { name, degree, salary, job_id } = req.body;
    const newEmployer = await pool.query(
      `
      insert into employer (name, degree, salary, job_id) values ($1, $2, $3, $4) returning *
      `,
      [name, degree, salary, job_id]
    );
    res.status(201).json({ success: true, employer: newEmployer.rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, degree, salary, job_id } = req.body;

    const oldEmployer = await pool.query(
      `
      select * from employer where id=$1
      `,
      [id]
    );

    const updatedEmployer = await pool.query(
      `
        update employer set name=$1, degree=$2, salary=$3, job_id=$4 where id=$5 returning *
        `,
      [
        name ? name : oldEmployer.rows[0].name,
        degree ? degree : oldEmployer.rows[0].degree,
        salary ? salary : oldEmployer.rows[0].salary,
        job_id ? job_id : oldEmployer.rows[0].job_id,
        id,
      ]
    );
    res.status(200).json({ success: true, employer: updatedEmployer.rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedEmployer = await pool.query(
      `
        delete from employer where id=$1 returning *
        `,
      [id]
    );
    res.status(200).json({ success: true, employer: deletedEmployer.rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
module.exports = router;
