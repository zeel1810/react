const mysql = require('mysql');
const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require('cors');

const bcrypt = require("bcrypt");
const saltRounds = 10;

const fs = require('fs');
const path = require('path');
var formidable = require('formidable');
var http = require('http');

const bodyParser = require('body-parser');

const jwt = require('jsonwebtoken');
const secretKey = 'ZEEL123';

const authenticate = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).send('Access Denied. No token provided.');
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(400).send('Invalid Token.');
  }
};


// const multer = require('multer');
const upload = require('./multerSetup');
// Create a connection to the MySQL database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: null,
  database: 'student',
});

var app = express();
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(bodyParser.json());
console.log("directory name");
console.log(__dirname);


// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Example query
db.query('SELECT * FROM student', (err, results) => {
  if (err) {
    console.error('Error querying MySQL database:', err);
    return;
  }
  console.log('Query results:', results);
});

// Create
// app.post('/api/student', (req, res) => {
//     console.log("FSDfsf");
//     console.log(req.body);
//     const { name, email ,phone,enroll_no,date_of_admission } = req.body;
//     const sql = 'INSERT INTO student (name, email ,phone,enroll_no,date_of_admission) VALUES (?, ? ,? ,?,?)';
//     db.query(sql, [name, email ,phone,enroll_no,date_of_admission], (err, result) => {
//       if (err) {
//         console.log(err);
//         res.status(500).send({ error: err.sqlMessage });
//       } else {
//         console.log("Dsda");
//         res.status(201).send({ message: 'Student created successfully', id: result.insertId });
//       }
//     });
//   });

  app.post('/api/student', upload.single('file'), function (req, res, next) {
    // console.log("FSDfsf");
        // console.log(req);
        // console.log(req.body);
        // console.log(req.file.path);
        console.log(req.file);
        const photo = req.file.filename;
        const { name, email ,phone,enroll_no,date_of_admission } = req.body;
        const sql = 'INSERT INTO student (name, email ,phone,enroll_no,date_of_admission,photo) VALUES (?, ? ,? ,?,?,?)';
        db.query(sql, [name, email ,phone,enroll_no,date_of_admission,photo], (err, result) => {
          if (err) {
            console.log(err);
            res.status(500).send({ error: err.sqlMessage });
          } else {
            console.log("Dsda");
            res.status(201).send({ message: 'Student created successfully', id: result.insertId });
          }
        });
  });

//   app.post('/upload', (req, res) => {

//     var form = new formidable.IncomingForm();

//     form.parse(req, function (err, fields, files) {
//       console.log(files);
//       var oldpath = files.filepath;
//       console.log(oldpath);
//       console.log(files.originalFilename);
//       var newpath = 'C:/Users/111818/' + files.originalFilename;
//       fs.rename(oldpath, newpath, function (err) {
//         if (err) throw err;
//         res.write('File uploaded and moved!');
//         res.end();
//       });
//   });
// });
  
  
  // Read
  app.get('/api/student', (req, res) => {
    const sql = 'SELECT * FROM student';
    db.query(sql, (err, results) => {
      if (err) {
        
        res.status(500).send({ error: err.sqlMessage });
      } else {
        res.status(200).send(results);
      }
    });
  });

  app.get('/api/payment', (req, res) => {
    const sql = 'SELECT * FROM payment';
    db.query(sql, (err, results) => {
      if (err) {
        
        res.status(500).send({ error: err.sqlMessage });
      } else {
        res.status(200).send(results);
      }
    });
  });
  app.get('/api/student/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM student WHERE id=?';
    db.query(sql, [id], (err, results) => {
      if (err) {
        
        res.status(500).send({ error: err.sqlMessage });
      } else {
        res.status(200).send(results);
      }
    });
  });
  
  // Update
  app.put('/api/student/:id',upload.single('file'), function (req, res, next)  {
    const photo = req.file.filename;
    const { name, email, phone, enroll_no, date_of_admission } = req.body;
    const { id } = req.params;
    const sql = 'UPDATE student SET name=?, email=?, phone=?, enroll_no=?, date_of_admission=?,photo=? WHERE id=?';
    db.query(sql, [name, email, phone, enroll_no, date_of_admission,photo, id], (err, result) => {
        if (err) {
            res.status(500).send({ error: 'Error updating student' });
        } else {
            res.status(200).send({ message: 'Student updated successfully' });
        }
    });
});
  
  // Delete
  app.delete('/api/student/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM student WHERE id=?';
    db.query(sql, [id], (err, result) => {
      if (err) {
        res.status(500).send({ error: 'Error deleting product' });
      } else {
        res.status(200).send({ message: 'Product deleted successfully' });
      }
    });
  });

// Close the connection when done
app.get('/', (req, res) => {
    res.send('<h1>Hello, world!</h1>' + `<h1>MySQL Connection Status</h1><p>Connection status: ${db.state}</p>`);

  });

  app.post('/api/register', (req, res) => {
    console.log(req.body);
    const email = req.body.email;
    const password = req.body.password;
    console.log(email);
    console.log(password);

    // bcrypt.hash(password, saltRounds, (err, hash) => {
    //   if (err) {
    //     console.log(err);
    //   }
  
      db.query(
        "INSERT INTO user (email, password) VALUES (?,?)",
       [email, password],
        (err, result) => {
          if (err) {
            res.status(500).send({ error: 'Error saving user' });
          } else {
            res.status(200).send({ message: 'User saved successfully' });
          }
        }
      );
    // });
  });
  
  // app.get("/login", (req, res) => {
  //   if (req.session.user) {
  //     res.send({ loggedIn: true, user: req.session.user });
  //   } else {
  //     res.send({ loggedIn: false });
  //   }
  // });
  
  app.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const user = {
      email: email,
      password: password,
    };

  
    db.query(
      "SELECT * FROM user WHERE email = ?;",
      email,
      (err, result) => {
        if (err) {
          res.send({ err: err });
        }
        else{
          if (result.length > 0) {
            // compare(password, result[0].password, (error, response) => {
              // if (response) {
              //   req.session.user = result;
              //   console.log(req.session.user);
              const token = jwt.sign({user }, secretKey, { expiresIn: '1h' });

              res.header('Authorization', token).send(user);
                // res.status(200).send({ message: 'User login successfully',token:token });
            //   } else {
            //     res.send({ message: "Wrong username/password combination!" });
            //   }
            // });
          } else {
            res.send({ message: "User doesn't exist" });
          }
        }
      }
    );
  });

  
const PORT = process.env.PORT || 5000; // Default to port 3000 if not specified
db.on('connect', () => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
