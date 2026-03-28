import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// In-memory data stores with professional dummy data
let leads = [
  { id: 1, name: 'Vikram Singhania', email: 'vikram@techventures.in', phone: '+91 98765 43210', status: 'New', source: 'Website' },
  { id: 2, name: 'Ananya Desai', email: 'ananya@desaicapital.com', phone: '+91 87654 32109', status: 'Contacted', source: 'Referral' },
  { id: 3, name: 'Rahul Mehta', email: 'rahul@meridian.com', phone: '+91 76543 21098', status: 'Qualified', source: 'LinkedIn' },
  { id: 4, name: 'Priya Sharma', email: 'priya@sharma.co', phone: '+91 65432 10987', status: 'New', source: 'Website' },
  { id: 5, name: 'Aryan Kapoor', email: 'kapoor.a@outlook.com', phone: '+91 99911 22233', status: 'Qualified', source: 'Referral' },
  { id: 6, name: 'Meera Singhal', email: 'meera@singhalestates.com', phone: '+91 88877 66655', status: 'Contacted', source: 'Website' },
  { id: 7, name: 'Zoya Khan', email: 'zoya.design@gmail.com', phone: '+91 70707 07070', status: 'New', source: 'LinkedIn' },
];

let tasks = [
  { id: 1, title: 'Follow up with Vikram Singhania', priority: 'High', status: 'Pending', dueDate: '2026-04-02' },
  { id: 2, title: 'Schedule property viewing - Bandra Villa', priority: 'Medium', status: 'In Progress', dueDate: '2026-04-05' },
  { id: 3, title: 'Prepare contract for Alibaug Estate', priority: 'High', status: 'Pending', dueDate: '2026-04-01' },
  { id: 4, title: 'Update website property listings', priority: 'Low', status: 'Completed', dueDate: '2026-03-28' },
  { id: 5, title: 'VIP Site Visit - Sky Penthouse', priority: 'High', status: 'In Progress', dueDate: '2026-03-31' },
  { id: 6, title: 'Legal document review - JV project', priority: 'High', status: 'Pending', dueDate: '2026-04-04' },
  { id: 7, title: 'Monthly Sales Portfolio Presentation', priority: 'Medium', status: 'Pending', dueDate: '2026-04-10' },
];

let users = [
  { id: 1, name: 'Admin User', email: 'admin@grovevista.com', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Ravi Kumar', email: 'ravi@grovevista.com', role: 'Senior Portfolio Manager', status: 'Active' },
  { id: 3, name: 'Sneha Patel', email: 'sneha@grovevista.com', role: 'Luxury Associate', status: 'Active' },
  { id: 4, name: 'Amit Joshi', email: 'amit@grovevista.com', role: 'Legal Consultant', status: 'Inactive' },
  { id: 5, name: 'Karan Malhotra', email: 'karan@grovevista.com', role: 'Relationship Manager', status: 'Active' },
  { id: 6, name: 'Saira Banu', email: 'saira@grovevista.com', role: 'Office Coordinator', status: 'Active' },
];

let nextIds = { leads: 8, tasks: 8, users: 7 };

import Property from '../models/Property.js';

// ──── Dashboard summary (protected) ────
router.get('/summary', protect, async (req, res) => {
  try {
    const propertyCount = await Property.countDocuments();
    res.json({
      leads: leads.length,
      tasks: tasks.filter(t => t.status !== 'Completed').length,
      users: users.filter(u => u.status === 'Active').length,
      properties: propertyCount,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching summary' });
  }
});

// ──── LEADS CRUD ────
router.get('/leads', protect, (req, res) => res.json(leads));

router.post('/leads', protect, admin, (req, res) => {
  const lead = { id: nextIds.leads++, ...req.body };
  leads.push(lead);
  res.status(201).json(lead);
});

router.put('/leads/:id', protect, admin, (req, res) => {
  const idx = leads.findIndex(l => l.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ message: 'Lead not found' });
  leads[idx] = { ...leads[idx], ...req.body };
  res.json(leads[idx]);
});

router.delete('/leads/:id', protect, admin, (req, res) => {
  leads = leads.filter(l => l.id !== parseInt(req.params.id));
  res.json({ message: 'Lead deleted' });
});

// ──── TASKS CRUD ────
router.get('/tasks', protect, (req, res) => res.json(tasks));

router.post('/tasks', protect, admin, (req, res) => {
  const task = { id: nextIds.tasks++, ...req.body };
  tasks.push(task);
  res.status(201).json(task);
});

router.put('/tasks/:id', protect, admin, (req, res) => {
  const idx = tasks.findIndex(t => t.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ message: 'Task not found' });
  tasks[idx] = { ...tasks[idx], ...req.body };
  res.json(tasks[idx]);
});

router.delete('/tasks/:id', protect, admin, (req, res) => {
  tasks = tasks.filter(t => t.id !== parseInt(req.params.id));
  res.json({ message: 'Task deleted' });
});

// ──── USERS CRUD ────
router.get('/users', protect, (req, res) => res.json(users));

router.post('/users', protect, admin, (req, res) => {
  const user = { id: nextIds.users++, ...req.body };
  users.push(user);
  res.status(201).json(user);
});

router.put('/users/:id', protect, admin, (req, res) => {
  const idx = users.findIndex(u => u.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ message: 'User not found' });
  users[idx] = { ...users[idx], ...req.body };
  res.json(users[idx]);
});

router.delete('/users/:id', protect, admin, (req, res) => {
  users = users.filter(u => u.id !== parseInt(req.params.id));
  res.json({ message: 'User deleted' });
});

export default router;
