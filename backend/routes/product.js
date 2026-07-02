// routes/products.js
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const authMiddleware = require('../middleware/auth');

const prisma = new PrismaClient();

// Fetch all products
router.get('/', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read database records' });
  }
});

// Create a new product (admin only)
router.post('/', authMiddleware('ADMIN'), async (req, res) => {
  const { title, price, category, imageUrl, stockQuantity } = req.body;

  if (!title || !price || !category) {
    return res.status(400).json({ error: 'Title, price, and category are required' });
  }

  try {
    const newProduct = await prisma.product.create({
      data: {
        title,
        price: parseFloat(price),
        category,
        imageUrl,
        stockQuantity: parseInt(stockQuantity, 10) || 10
      }
    });

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ error: 'Database transaction aborted: ' + error.message });
  }
});

// Update product details or stock (admin only)
router.put('/:id', authMiddleware('ADMIN'), async (req, res) => {
  const { id } = req.params;
  const { title, price, category, imageUrl, stockQuantity } = req.body;

  try {
    const updatedProduct = await prisma.product.update({
      where: { id: Number(id) },
      data: {
        ...(title && { title }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(category && { category }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(stockQuantity !== undefined && { stockQuantity: parseInt(stockQuantity, 10) })
      }
    });

    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update product: ' + error.message });
  }
});

// Delete a product (admin only)
router.delete('/:id', authMiddleware('ADMIN'), async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.product.delete({ where: { id: Number(id) } });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete product: ' + error.message });
  }
});

module.exports = router;