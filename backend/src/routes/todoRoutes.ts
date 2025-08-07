import express from 'express';
import {
  getTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
  toggleTodo
} from '../controllers/todoController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// All todo routes require authentication
router.use(requireAuth);

// GET /api/todos - Get all todos with optional filtering and sorting
router.get('/', getTodos);

// GET /api/todos/:id - Get single todo by ID
router.get('/:id', getTodoById);

// POST /api/todos - Create new todo
router.post('/', createTodo);

// PUT /api/todos/:id - Update todo
router.put('/:id', updateTodo);

// PATCH /api/todos/:id/toggle - Toggle todo completion status
router.patch('/:id/toggle', toggleTodo);

// DELETE /api/todos/:id - Delete todo
router.delete('/:id', deleteTodo);

export default router;
