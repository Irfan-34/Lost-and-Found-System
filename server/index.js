require('dotenv').config(); // ADD THIS LINE AT THE TOP
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();
const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Middleware to authenticate admin
const authenticateAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await prisma.admin.findUnique({ where: { id: decoded.id } });
    
    if (!admin) {
      return res.status(401).json({ error: 'Invalid authentication' });
    }
    
    req.admin = admin;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Authentication failed' });
  }
};

// ADMIN ROUTES
app.get('/api/admin/exists', async (req, res) => {
  try {
    const adminCount = await prisma.admin.count();
    res.json({ exists: adminCount > 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/admin/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Check if admin already exists
    const adminCount = await prisma.admin.count();
    if (adminCount > 0) {
      return res.status(400).json({ error: 'Admin already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create admin
    const admin = await prisma.admin.create({
      data: {
        username,
        password: hashedPassword
      }
    });
    
    const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    
    res.json({ message: 'Admin registered successfully', token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const admin = await prisma.admin.findUnique({ where: { username } });
    
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    
    res.json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ITEM ROUTES
app.post('/api/items', async (req, res) => {
  try {
    const {
      description,
      category,
      location,
      date,
      reporterName,
      reporterContact,
      name: formName,
      contact: formContact,
      status: incomingStatus
    } = req.body;

    const item = await prisma.item.create({
      data: {
        name: req.body.itemName || description || 'Unnamed item',
        description,
        category,
        location,
        reporterName: reporterName || formName || null,
        reporterContact: reporterContact || formContact || null,
        date: date ? new Date(date) : new Date(),
        status: incomingStatus || 'reported'
      }
    });
    
    res.status(201).json(item);
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/items', async (req, res) => {
  try {
    const items = await prisma.item.findMany({
      include: { claims: true },
      orderBy: { date: 'desc' }
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/items/:id/status', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const item = await prisma.item.update({
      where: { id: parseInt(id) },
      data: { status }
    });
    
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CLAIM ROUTES
app.post('/api/items/:id/claim', async (req, res) => {
  try {
    const { id } = req.params;
    const { claimerName, claimerContact, proofOfOwnership } = req.body;
    
    const claim = await prisma.claim.create({
      data: {
        itemId: parseInt(id),
        claimerName,
        claimerContact,
        proofOfOwnership,
        status: 'Pending'
      }
    });
    
    // Update item status to Pending
    await prisma.item.update({
      where: { id: parseInt(id) },
      data: { status: 'Pending' }
    });
    
    res.status(201).json(claim);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/items/:id/approve', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { claimId } = req.body;
    
    // Update claim status
    await prisma.claim.update({
      where: { id: parseInt(claimId) },
      data: { status: 'Approved' }
    });
    
    // Update item status
    const item = await prisma.item.update({
      where: { id: parseInt(id) },
      data: { 
        status: 'Returned',
        returnDate: new Date()
      }
    });
    
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 5001; // Make sure this is 5001
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

