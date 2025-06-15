import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Worker from "./models/Worker.js";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import cors from "cors";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "my api",
      version: "1.0.0",
    },
  },
  apis: ["./index.js"], // or ['./routes/*.ts'] if you split routes
});

app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("connected to mongo"))
  .catch((err) => console.error("mongo error:", err));

// GET hello world
/**
 * @swagger
 * /:
 *   get:
 *     tags: [Init]
 *     summary: Returns a hello world message
 *     responses:
 *       200:
 *         description: A simple hello world message
 */
app.get("/", (_req, res) => {
  res.send("hello world");
});

// GET workers
/**
 * @swagger
 * /workers:
 *   get:
 *     tags: [Workers]
 *     summary: Get all workers
 *     responses:
 *       200:
 *         description: A list of workers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Worker'
 */
app.get("/workers", async (_req, res) => {
  const workers = await Worker.find();
  res.json(workers);
  console.log("GET /workers");
});

// GET worker by id
/**
 * @swagger
 * /worker/{id}:
 *   get:
 *     tags: [Workers]
 *     summary: Get a worker by id
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: integer
 *     responses:
 *       200:
 *         description: A worker object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Worker'
 */
app.get("/worker/:id", async (req, res) => {
  const { id } = req.params;
  const worker = await Worker.findById(id);
  res.json(worker);
  console.log(`GET ${id}`);
});

// PUT update worker
/**
 * @swagger
 * /worker/{id}/updateRMPaid:
 *   put:
 *     tags: [Workers]
 *     summary: Update the RMPaid of a worker
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               RMPaid:
 *                 type: number
 *     responses:
 *       200:
 *         description: The worker object with the updated RMPaid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Worker'
 */
app.put("/worker/:id/updateRMPaid", async (req, res) => {
  const { id } = req.params;
  const { RMPaid } = req.body;
  const worker = await Worker.findByIdAndUpdate(id, { RMPaid }, { new: true });
  res.json(worker);
  console.log(`PUT ${id}`);
});

// PUT update worker
/**
 * @swagger
 * /worker/{id}:
 *   put:
 *     tags: [Workers]
 *     summary: Update a worker
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               status:
 *                 type: string
 *               passportNumber:
 *                 type: string
 *               permitVisaExpiry:
 *                 type: string
 *               RMPaid:
 *                 type: number
 *     responses:
 *       200:
 *         description: The worker object with the updated fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Worker'
 */
app.put("/worker/:id", async (req, res) => {
  const { id } = req.params;
  const worker = await Worker.findByIdAndUpdate(id, req.body, { new: true });
  res.json(worker);
  console.log(`PUT ${id}`);
});

// POST worker
/**
 * @swagger
 * /worker:
 *   post:
 *     tags: [Workers]
 *     summary: Create a new worker
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Worker'
 *     responses:
 *       201:
 *         description: The created worker
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Worker'
 *       400:
 *         description: Bad request
 */
app.post("/worker", async (req, res) => {
  const worker = new Worker({
    name: req.body.name,
    phoneNumber: req.body.phoneNumber,
    status: req.body.status,
    passportNumber: req.body.passportNumber,
    permitVisaExpiry: req.body.permitVisaExpiry,
    RMPaid: req.body.RMPaid,
  });

  try {
    await worker.save();
    res.status(201).json(worker);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
  console.log("POST /worker");
});

// POST multiple workers
/**
 * @swagger
 * /workers:
 *   post:
 *     tags: [Workers]
 *     summary: Create multiple new workers
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/Worker'
 *     responses:
 *       201:
 *         description: The created workers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Worker'
 *       400:
 *         description: Bad request
 */
app.post("/workers", async (req, res) => {
  const workers = req.body.map((worker) => new Worker(worker));

  try {
    await Worker.insertMany(workers);
    res.status(201).json(workers);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
  console.log("POST /workers");
});

// DELETE worker by id
/**
 * @swagger
 * /worker/{id}:
 *   delete:
 *     tags: [Workers]
 *     summary: Delete a worker by id
 *     parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The worker ID
 *     responses:
 *       200:
 *         description: The deleted worker
 *       400:
 *         description: Bad request
 *       404:
 *         description: Worker not found
 */
app.delete("/worker/:id", async (req, res) => {
  try {
    const worker = await Worker.findByIdAndDelete(req.params.id);
    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }
    res.status(200).json(worker);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
  console.log("DELETE /worker/:id");
});

// DELETE all workers
/**
 * @swagger
 * /workers:
 *   delete:
 *     tags: [Workers]
 *     summary: Delete all workers
 *     responses:
 *       200:
 *         description: All workers deleted
 */
app.delete("/workers", async (req, res) => {
  await Worker.deleteMany();
  res.status(200).json({ message: "All workers deleted" });
  console.log("DELETE /workers");
});

// Swagger schema for Worker
/**
 * @swagger
 * components:
 *   schemas:
 *     Worker:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         nationality:
 *           type: string
 *         passportNumber:
 *           type: string
 *         permitVisaNumber:
 *           type: string
 *         permitVisaExpiry:
 *           type: string
 *           format: date
 *         phoneNumber:
 *           type: string
 *         siteProject:
 *           type: string
 *         status:
 *           type: string
 */

// start server
app.listen(port, () => {
  console.log(`server running at http://localhost:${port}`);
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
