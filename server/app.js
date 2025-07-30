const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const PORT = 5005;
const cors = require("cors");
const mongoose = require("mongoose");

//Import the model
const Cohort = require("./models/Cohort.model")
const Student = require("./models/Student.model")


// INITIALIZE EXPRESS APP - https://expressjs.com/en/4x/api.html#express
const app = express();

// connecting to database

mongoose
  .connect("mongodb://127.0.0.1:27017/cohort-tools-api")
  .then(x => console.log(`Connected to Database: "${x.connections[0].name}"`))
  .catch(err => console.error("Error connecting to MongoDB", err));

// MIDDLEWARE
// Research Team - Set up CORS middleware here:
// ...
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());



// ROUTES - https://expressjs.com/en/starter/basic-routing.html
// Devs Team - Start working on the routes here:
// ...
app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});


// GET /cohorts - retrieve all the cohorts
app.get("/api/cohorts", (req, res) => {
  Cohort.find({})
    .then((cohorts) => {
      console.log("Retrieved cohorts ->", cohorts);
      res.json(cohorts);
    })
    .catch((error) => {
      console.error("Error while retrieving cohorts ->", error);
      res.status(500).send({ error: "Failed to retrieve cohorts" });
    });
});

//  POST  /cohort route

app.post("/api/cohorts", (req, res, next) => {
  const newCohort = req.body;

  Cohort.create(newCohort)
    .then((cohortFromDB) => {
      res.status(201).json(cohortFromDB)
    })
    .catch((error) => {
      console.error("Error creating a new Cohort in the DB..", error)
      res.status(500).json({ error: "Failed to creat a new Cohort" })
    })
})

// GET /students/cohort/:cohortId

app.get("/api/students/cohort/:cohortId", (req, res) => {
  Student.find({ cohort: req.params.cohortId })
    .populate("cohort")
    .then(students => res.json(students))
    .catch((error) => {
      console.error("Error retrieving Students by Cohort", error);
      res.status(500).json({ error: "Failed to retrieve Students by Cohort" });
    });
});

//  GET  /cohorts/:id route
app.get("/api/cohorts/:cohortId", (req, res, next) => {
  const { cohortId } = req.params

  Cohort.findById(cohortId)
    .then((cohortFromDB) => {
      res.json(cohortFromDB)
    })
    .catch((error) => {
      console.error("Error while retrieving Cohort", error)
      res.status(500).send({ error: "Failed to retrieve Cohort" })
    })
})

//  PUT (update) /cohorts/:id route
app.put("/api/cohorts/:cohortId", (req, res, next) => {
  const { cohortId } = req.params
  const newDetails = req.body

  Cohort.findByIdAndUpdate(cohortId, newDetails, { new: true })
    .then((cohortFromDB) => {
      res.json(cohortFromDB)
    })
    .catch((error) => {
      console.error("Error updating Cohort", error)
      res.status(500).send({ error: "Failed to update Cohort" })
    })
})

//  DELETE  /cohorts/:id route

app.delete("/api/cohorts/:cohortId", (req, res, next) => {

  const { cohortId } = req.params

  Cohort.findByIdAndDelete(cohortId)
    .then((response) => {
      res.sendStatus(204)
    })
    .catch((error) => {
      console.error("Error while deleting Cohort", error)
      res.status(500).send({ error: "Failed to delete Cohort" })
    })
})




// GET /students - retrieve all the students
app.get("/api/students", (req, res) => {
  Student.find({})
    .populate("cohort")
    .then((students) => {
      console.log("Retrieved students ->", students);
      res.json(students);
    })
    .catch((error) => {
      console.error("Error while retrieving students ->", error);
      res.status(500).send({ error: "Failed to retrieve students" });
    });
});

//  POST  /students route

app.post("/api/students", (req, res, next) => {
  const newStudent = req.body;

  Student.create(newStudent)
    .then((studentFromDB) => {
      res.status(201).json(studentFromDB)
    })
    .catch((error) => {
      console.error("Error creating a new Student in the DB..", error)
      res.status(500).json({ error: "Failed to creat a new Student" })
    })
})

//  GET  /students/:id route
app.get("/api/students/:studentId", (req, res, next) => {
  const { studentId } = req.params

  Student.findById(studentId)
    .populate("cohort")
    .then((studentFromDB) => {
      res.json(studentFromDB)
    })
    .catch((error) => {
      console.error("Error while retrieving Student", error)
      res.status(500).send({ error: "Failed to retrieve Student" })
    })
})

//  PUT (update) /students/:id route
app.put("/api/students/:studentId", (req, res, next) => {
  const { studentId } = req.params
  const newDetails = req.body

  Student.findByIdAndUpdate(studentId, newDetails, { new: true })
    .then((studentFromDB) => {
      res.json(studentFromDB)
    })
    .catch((error) => {
      console.error("Error updating Student", error)
      res.status(500).send({ error: "Failed to update Student" })
    })
})

//  DELETE  /students/:id route

app.delete("/api/students/:studentId", (req, res, next) => {

  const { studentId } = req.params

  Student.findByIdAndDelete(studentId)
    .then((response) => {
      res.sendStatus(204)
    })
    .catch((error) => {
      console.error("Error while deleting Student", error)
      res.status(500).send({ error: "Failed to delete Student" })
    })
})



// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});