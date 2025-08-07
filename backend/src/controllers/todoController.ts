import { Request, Response } from 'express';
import Todo, { ITodo } from '../models/Todo.js';

// Get all todos for authenticated user
export const getTodos = async (req: Request, res: Response): Promise<void> => {
  try {
    const { completed, priority, sortBy = 'createdAt', order = 'desc' } = req.query;

    // Build filter object - always filter by user
    const filter: any = { userId: (req.user as any)._id };
    if (completed !== undefined) {
      filter.completed = completed === 'true';
    }
    if (priority) {
      filter.priority = priority;
    }

    // Build sort object
    const sortOrder = order === 'asc' ? 1 : -1;
    const sortObj: any = {};
    sortObj[sortBy as string] = sortOrder;

    const todos = await Todo.find(filter).sort(sortObj);
    res.json(todos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
};

// Get single todo by ID for authenticated user
export const getTodoById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const todo = await Todo.findOne({ _id: id, userId: (req.user as any)._id });

    if (!todo) {
      res.status(404).json({ error: 'Todo not found' });
      return;
    }

    res.json(todo);
  } catch (error) {
    console.error('Error fetching todo:', error);
    res.status(500).json({ error: 'Failed to fetch todo' });
  }
};

// Create new todo
export const createTodo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, priority, dueDate } = req.body;

    if (!title || title.trim() === '') {
      res.status(400).json({ error: 'Title is required' });
      return;
    }

    const todoData: any = {
      title: title.trim(),
      description: description?.trim(),
      priority: priority || 'medium',
      userId: (req.user as any)._id
    };

    if (dueDate) {
      todoData.dueDate = new Date(dueDate);
    }

    const todo = new Todo(todoData);
    const savedTodo = await todo.save();

    res.status(201).json(savedTodo);
  } catch (error) {
    console.error('Error creating todo:', error);
    if (error instanceof Error && error.name === 'ValidationError') {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to create todo' });
    }
  }
};

// Update todo
export const updateTodo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, completed, priority, dueDate } = req.body;

    const updateData: any = {};

    if (title !== undefined) {
      if (!title || title.trim() === '') {
        res.status(400).json({ error: 'Title cannot be empty' });
        return;
      }
      updateData.title = title.trim();
    }

    if (description !== undefined) {
      updateData.description = description?.trim();
    }

    if (completed !== undefined) {
      updateData.completed = Boolean(completed);
    }

    if (priority !== undefined) {
      updateData.priority = priority;
    }

    if (dueDate !== undefined && dueDate) {
      updateData.dueDate = new Date(dueDate);
    }

    const todo = await Todo.findOneAndUpdate(
      { _id: id, userId: (req.user as any)._id },
      updateData,
      { new: true, runValidators: true }
    );

    if (!todo) {
      res.status(404).json({ error: 'Todo not found' });
      return;
    }

    res.json(todo);
  } catch (error) {
    console.error('Error updating todo:', error);
    if (error instanceof Error && error.name === 'ValidationError') {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to update todo' });
    }
  }
};

// Delete todo
export const deleteTodo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const todo = await Todo.findOneAndDelete({ _id: id, userId: (req.user as any)._id });
    
    if (!todo) {
      res.status(404).json({ error: 'Todo not found' });
      return;
    }
    
    res.json({ message: 'Todo deleted successfully', todo });
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ error: 'Failed to delete todo' });
  }
};

// Toggle todo completion status
export const toggleTodo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const todo = await Todo.findOne({ _id: id, userId: (req.user as any)._id });
    
    if (!todo) {
      res.status(404).json({ error: 'Todo not found' });
      return;
    }
    
    todo.completed = !todo.completed;
    const updatedTodo = await todo.save();
    
    res.json(updatedTodo);
  } catch (error) {
    console.error('Error toggling todo:', error);
    res.status(500).json({ error: 'Failed to toggle todo' });
  }
};
