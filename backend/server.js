const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

// Mongoose schema
const LinkSchema = new mongoose.Schema({
  url: String
});
const Link = mongoose.model('Link', LinkSchema);

// Routes

// Get latest link
app.get('/api/link', async (req, res) => {
  const link = await Link.findOne();
  if (!link) return res.json({ url: '' });
  res.json(link);
});

// Update the link
app.post('/api/link', async (req, res) => {
  const { url } = req.body;
  let link = await Link.findOne();
  if (link) {
    link.url = url;
    await link.save();
  } else {
    link = new Link({ url });
    await link.save();
  }
  res.json({ message: 'Link updated!', url });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
