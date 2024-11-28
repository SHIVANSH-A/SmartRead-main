const express = require('express');
const multer = require('multer');
const path = require('path');
const ejs = require('ejs');
const pdf = require('pdf-parse');
const fs = require('fs');
const { spawn } = require('child_process'); // Import spawn

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));

// For parsing application/json
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });

app.use(express.json());
app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

let fileUrl;

app.get('/', (req, res) => {
  res.render('login'); // Change to your landing page EJS
});

app.get('/landing', (req, res) => {
  res.render('landing'); // Change to your landing page EJS
});
app.get('/wordstock', (req, res) => {
  res.render('wordstock'); // Change to your landing page EJS
});

app.get('/manual-dictionary', (req, res) => {
  res.render('manual-dictionary');  // assuming you're using a template engine like EJS
});

app.get('/tts', (req, res) => {
  res.render('tts');  // assuming you're using a template engine like EJS
});

// Route to handle the PDF viewer
app.get('/pdf-viewer', (req, res) => {
  res.render('index', { pdfUrl: null, difficultWords: null });
});


// app.get('/', (req, res) => {
//   res.render('index', { pdfUrl: null, difficultWords: null });
// });

app.post('/upload-pdf', upload.single('pdf'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }
  fileUrl = `/uploads/${req.file.filename}`;
  res.render('index', { pdfUrl: fileUrl, difficultWords: null }); // Pass difficultWords as null
});

app.post('/prediction', (req, res) => {
  const paragraph = req.body.paragraph; // Retrieve the paragraph text
  console.log(req.body);

  if (!paragraph) {
    return res.status(400).json({ error: 'Paragraph not provided' });
  }

  const pythonProcess = spawn('python', [path.join(__dirname, 'DifficultyPredictionModel.py')]);

  let dataOutput = '';

  // Send the paragraph input to the Python script
  pythonProcess.stdin.write(paragraph);
  pythonProcess.stdin.end();

  pythonProcess.stdout.on('data', (data) => {
    dataOutput += data.toString();
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  // Once the Python script finishes, handle the output
  pythonProcess.on('close', (code) => {
    if (code !== 0) {
      return res.status(500).send('Internal Server Error: Python process failed');
    }

    try {
      // Assume Python outputs a list of difficult words as JSON
      const difficultWords = JSON.parse(dataOutput);
      // Respond with JSON instead of rendering the view
      res.json({ difficultWords: difficultWords });
    } catch (error) {
      console.error(`Error parsing Python output: ${error}`);
      res.status(500).send('Internal Server Error');
    }
  });
});


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
