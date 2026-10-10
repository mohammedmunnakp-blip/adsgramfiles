const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123"; // Change your admin key here

app.use(cors());
app.use(express.json());

// In-Memory Database (Replace with MongoDB for permanent storage if needed)
let filesDB = [
  {
    id: "1",
    title: "Sample PDF Guide",
    url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&q=80",
    size: "2.1 MB",
    views: 12,
    downloads: 5
  }
];

app.get('/api/files', (req, res) => {
  res.json(filesDB);
});

app.post('/api/files/:id/view', (req, res) => {
  const file = filesDB.find(f => f.id === req.params.id);
  if (file) {
    file.views += 1;
    return res.json(file);
  }
  res.status(404).json({ message: "File not found" });
});

app.post('/api/files/:id/download', (req, res) => {
  const file = filesDB.find(f => f.id === req.params.id);
  if (file) {
    file.downloads += 1;
    return res.json(file);
  }
  res.status(404).json({ message: "File not found" });
});

app.post('/api/files', (req, res) => {
  const { title, url, thumbnail, size, adminPass } = req.body;

  if (adminPass !== ADMIN_PASSWORD) {
    return res.status(403).json({ message: "Unauthorized: Incorrect Admin Password" });
  }

  const newFile = {
    id: Date.now().toString(),
    title,
    url,
    thumbnail: thumbnail || '',
    size: size || 'Unknown',
    views: 0,
    downloads: 0
  };

  filesDB.push(newFile);
  res.status(201).json(newFile);
});

app.listen(PORT, () => {
  console.log(`Telegram Mini App server running on port ${PORT}`);
});
