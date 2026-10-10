import express from "express";
import Student from "../models/Student.js";
import Teacher from "../models/Teacher.js";
import GroupTarget from "../models/GroupTarget.js";

const router = express.Router();

router.post("/students", async (req, res) => {
  try {
    const studentData = req.body;
    const existing = await Student.findOne({ regNo: studentData.regNo });
    if (existing) {
      Object.assign(existing, studentData);
      await existing.save();
      return res.status(200).json(existing);
    }
    const student = new Student(studentData);
    await student.save();
    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/students", async (req, res) => {
  try {
    const { college, branch, group } = req.query;
    const query = {};
    if (college) query.college = college;
    if (branch) query.branch = branch;
    if (group) query.group = group;
    const students = await Student.find(query);
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/teachers/signup", async (req, res) => {
  try {
    const { name, email, password, college, branch, group } = req.body;
    const existing = await Teacher.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "Teacher email already registered" });
    }
    const teacher = new Teacher({ name, email, password, college, branch, group, status: "pending" });
    await teacher.save();
    res.status(201).json(teacher);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/teachers/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const teacher = await Teacher.findOne({ email });
    if (!teacher || teacher.password !== password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    res.status(200).json(teacher);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/teachers/status/:email", async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ email: req.params.email });
    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }
    res.status(200).json({ status: teacher.status, teacher });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/teachers/target", async (req, res) => {
  try {
    const { groupKey, target } = req.body;
    const existing = await GroupTarget.findOne({ groupKey });
    if (existing) {
      existing.target = target;
      await existing.save();
      return res.status(200).json(existing);
    }
    const groupTarget = new GroupTarget({ groupKey, target });
    await groupTarget.save();
    res.status(201).json(groupTarget);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/teachers/target/:groupKey", async (req, res) => {
  try {
    const groupTarget = await GroupTarget.findOne({ groupKey: req.params.groupKey });
    res.status(200).json(groupTarget || { groupKey: req.params.groupKey, target: 30 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/admin/login", (req, res) => {
  const { email, password } = req.body;
  if (email === "admin@evalx.in" && password === "admin123") {
    return res.status(200).json({ success: true, email });
  }
  res.status(401).json({ error: "Invalid credentials" });
});

router.get("/admin/teachers", async (req, res) => {
  try {
    const teachers = await Teacher.find({});
    res.status(200).json(teachers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/admin/teachers/:email/approve", async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ email: req.params.email });
    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }
    teacher.status = "approved";
    await teacher.save();
    res.status(200).json(teacher);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/admin/teachers/:email", async (req, res) => {
  try {
    const result = await Teacher.findOneAndDelete({ email: req.params.email });
    if (!result) {
      return res.status(404).json({ error: "Teacher not found" });
    }
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/seed", async (req, res) => {
  try {
    await Student.deleteMany({});
    await Teacher.deleteMany({});
    await GroupTarget.deleteMany({});

    const initialStudents = [
      {
        name: "Rahul Sharma",
        regNo: "230120101",
        college: "C. V. Raman Global University",
        branch: "CSE",
        group: "4",
        timeline: { tenth: true, twelfth: true, diploma: false, btech: true },
        marks: {
          tenth: { board: "CBSE", score: 91.2 },
          twelfth: { board: "CHSE Odisha", score: 84.5 },
          diploma: { stream: "", score: null, weak: "" },
          btech: [
            {
              sem: 1,
              subjects: [
                { name: "Mathematics - I", score: 72 },
                { name: "Engineering Physics", score: 80 },
                { name: "Basic Electrical Engineering", score: 68 },
                { name: "Engineering Graphics", score: 85 }
              ]
            },
            {
              sem: 2,
              subjects: [
                { name: "Mathematics - II", score: 68 },
                { name: "Engineering Chemistry", score: 74 },
                { name: "Basic Electronics Engineering", score: 44 },
                { name: "Programming in C", score: 88 }
              ]
            },
            {
              sem: 3,
              subjects: [
                { name: "Data Structures", score: 62 },
                { name: "Discrete Mathematics", score: 71 },
                { name: "Digital Logic Design", score: 80 },
                { name: "OOP using Java", score: 85 }
              ]
            },
            {
              sem: 4,
              subjects: [
                { name: "Database Management Systems", score: 75 },
                { name: "Computer Org & Architecture", score: 69 },
                { name: "Design & Analysis of Algorithms", score: 48 },
                { name: "Formal Languages & Automata", score: 65 }
              ]
            },
            {
              sem: 5,
              subjects: [
                { name: "Operating Systems", score: 78 },
                { name: "Computer Networks", score: 82 },
                { name: "Software Engineering", score: 80 },
                { name: "Microprocessors & Microcontrollers", score: 71 }
              ]
            }
          ]
        },
        cgpa: 7.23,
        weakSubjects: [
          { name: "Basic Electronics Engineering", score: 44, reason: "B.Tech Sem 2 (Score: 44/100)" },
          { name: "Design & Analysis of Algorithms", score: 48, reason: "B.Tech Sem 4 (Score: 48/100)" }
        ]
      },
      {
        name: "Ananya Misra",
        regNo: "230120105",
        college: "C. V. Raman Global University",
        branch: "CSE",
        group: "4",
        timeline: { tenth: true, twelfth: true, diploma: false, btech: true },
        marks: {
          tenth: { board: "ICSE", score: 94.6 },
          twelfth: { board: "CBSE", score: 92.4 },
          diploma: { stream: "", score: null, weak: "" },
          btech: [
            {
              sem: 1,
              subjects: [
                { name: "Mathematics - I", score: 88 },
                { name: "Engineering Physics", score: 92 },
                { name: "Basic Electrical Engineering", score: 85 },
                { name: "Engineering Graphics", score: 90 }
              ]
            },
            {
              sem: 2,
              subjects: [
                { name: "Mathematics - II", score: 90 },
                { name: "Engineering Chemistry", score: 94 },
                { name: "Basic Electronics Engineering", score: 82 },
                { name: "Programming in C", score: 96 }
              ]
            },
            {
              sem: 3,
              subjects: [
                { name: "Data Structures", score: 91 },
                { name: "Discrete Mathematics", score: 85 },
                { name: "Digital Logic Design", score: 49 },
                { name: "OOP using Java", score: 94 }
              ]
            },
            {
              sem: 4,
              subjects: [
                { name: "Database Management Systems", score: 92 },
                { name: "Computer Org & Architecture", score: 88 },
                { name: "Design & Analysis of Algorithms", score: 87 },
                { name: "Formal Languages & Automata", score: 90 }
              ]
            },
            {
              sem: 5,
              subjects: [
                { name: "Operating Systems", score: 93 },
                { name: "Computer Networks", score: 95 },
                { name: "Software Engineering", score: 92 },
                { name: "Microprocessors & Microcontrollers", score: 88 }
              ]
            }
          ]
        },
        cgpa: 8.95,
        weakSubjects: [
          { name: "Digital Logic Design", score: 49, reason: "B.Tech Sem 3 (Score: 49/100)" }
        ]
      },
      {
        name: "Siddharth Das",
        regNo: "230120110",
        college: "C. V. Raman Global University",
        branch: "CSE",
        group: "4",
        timeline: { tenth: true, twelfth: false, diploma: true, btech: true },
        marks: {
          tenth: { board: "BSE Odisha", score: 82.0 },
          twelfth: { board: "", score: null },
          diploma: { stream: "Information Technology", score: 81.5, weak: "Applied Mathematics" },
          btech: [
            {
              sem: 3,
              subjects: [
                { name: "Data Structures", score: 55 },
                { name: "Discrete Mathematics", score: 43 },
                { name: "Digital Logic Design", score: 62 },
                { name: "OOP using Java", score: 65 }
              ]
            },
            {
              sem: 4,
              subjects: [
                { name: "Database Management Systems", score: 68 },
                { name: "Computer Org & Architecture", score: 52 },
                { name: "Design & Analysis of Algorithms", score: 46 },
                { name: "Formal Languages & Automata", score: 58 }
              ]
            },
            {
              sem: 5,
              subjects: [
                { name: "Operating Systems", score: 64 },
                { name: "Computer Networks", score: 70 },
                { name: "Software Engineering", score: 68 },
                { name: "Microprocessors & Microcontrollers", score: 55 }
              ]
            }
          ]
        },
        cgpa: 5.92,
        weakSubjects: [
          { name: "Discrete Mathematics", score: 43, reason: "B.Tech Sem 3 (Score: 43/100)" },
          { name: "Design & Analysis of Algorithms", score: 46, reason: "B.Tech Sem 4 (Score: 46/100)" },
          { name: "Applied Mathematics", score: 50, reason: "Flagged in Diploma Records" }
        ]
      }
    ];

    const initialTeachers = [
      {
        name: "Dr. Priyadarshi Sen",
        email: "priyadarshi@cvrgi.edu.in",
        password: "password123",
        college: "C. V. Raman Global University",
        branch: "CSE",
        group: "4",
        status: "pending"
      },
      {
        name: "Prof. Mamata Mohanty",
        email: "mamata@cvrgi.edu.in",
        password: "password123",
        college: "C. V. Raman Global University",
        branch: "CSIT",
        group: "2",
        status: "approved"
      }
    ];

    const initialGroupTargets = [
      { groupKey: "C. V. Raman Global University_CSE_4", target: 30 },
      { groupKey: "C. V. Raman Global University_CSIT_2", target: 25 }
    ];

    await Student.insertMany(initialStudents);
    await Teacher.insertMany(initialTeachers);
    await GroupTarget.insertMany(initialGroupTargets);

    res.status(200).json({ message: "Database seeded successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/health", (req, res) => res.status(200).json({ status: "ok" }));

router.post("/ai/chat", async (req, res) => {
  try {
    const { apiKey, model, messages, temperature, max_tokens } = req.body;
    const key = apiKey || process.env.NVIDIA_API_KEY;
    if (!key) {
      return res.status(400).json({ error: "Missing API key" });
    }
    const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${key}`
      },
      body: JSON.stringify({
        model: model || "meta/llama-3.1-70b-instruct",
        messages,
        temperature: temperature !== undefined ? temperature : 0.2,
        max_tokens: max_tokens || 1024
      })
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
