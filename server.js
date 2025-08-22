const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 3001;

// 미들웨어 설정
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3002', 'http://localhost:3003', 'http://localhost:3004', 'http://localhost:3005', 'http://localhost:3006', 'https://admin.thevida.co.kr'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(express.json());
app.use(express.static('public'));

// 이미지 업로드 설정
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'public/uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB 제한
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('이미지 파일만 업로드 가능합니다!'));
    }
  }
});

// 데이터베이스 초기화
const db = new sqlite3.Database('thevida.db');

// 테이블 생성
db.serialize(() => {
  // 이미지 테이블
  db.run(`CREATE TABLE IF NOT EXISTS images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    imageUrl TEXT NOT NULL,
    category TEXT NOT NULL,
    subcategory TEXT,
    order_num INTEGER DEFAULT 0,
    isActive INTEGER DEFAULT 1,
    location TEXT,
    uploadDate TEXT DEFAULT CURRENT_TIMESTAMP,
    actualPath TEXT
  )`);

  // 사용자 테이블 (인증용)
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'staff',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`);

  // 홈페이지 이미지 테이블
  db.run(`CREATE TABLE IF NOT EXISTS homepage_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    imageUrl TEXT NOT NULL,
    category TEXT NOT NULL,
    subcategory TEXT,
    order_num INTEGER DEFAULT 0,
    isActive INTEGER DEFAULT 1,
    uploadDate TEXT DEFAULT CURRENT_TIMESTAMP
  )`);

  // 활동기록 테이블
  db.run(`CREATE TABLE IF NOT EXISTS activity_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    images TEXT NOT NULL,
    location TEXT NOT NULL,
    category TEXT NOT NULL,
    date TEXT NOT NULL,
    isActive INTEGER DEFAULT 1,
    uploadDate TEXT DEFAULT CURRENT_TIMESTAMP,
    author TEXT
  )`);
});

// 기본 라우트
app.get('/', (req, res) => {
  res.json({ message: 'TheVida Backend API is running!' });
});

// 이미지 관련 API
// 모든 이미지 조회
app.get('/api/images', (req, res) => {
  const { category } = req.query;
  let query = 'SELECT * FROM images ORDER BY order_num ASC';
  let params = [];

  if (category && category !== 'all') {
    query = 'SELECT * FROM images WHERE category = ? ORDER BY order_num ASC';
    params = [category];
  }

  db.all(query, params, (err, rows) => {
    if (err) {
      console.error('Error fetching images:', err);
      return res.status(500).json({ error: '이미지 조회 중 오류가 발생했습니다.' });
    }
    res.json(rows);
  });
});

// 이미지 업로드
app.post('/api/images', upload.single('image'), (req, res) => {
  const { title, description, category, subcategory, location } = req.body;
  
  if (!req.file) {
    return res.status(400).json({ error: '이미지 파일이 필요합니다.' });
  }

  const imageUrl = `/uploads/${req.file.filename}`;
  
  const query = `
    INSERT INTO images (title, description, imageUrl, category, subcategory, location, order_num)
    VALUES (?, ?, ?, ?, ?, ?, (SELECT COALESCE(MAX(order_num), 0) + 1 FROM images))
  `;
  
  db.run(query, [title, description, imageUrl, category, subcategory, location], function(err) {
    if (err) {
      console.error('Error uploading image:', err);
      return res.status(500).json({ error: '이미지 업로드 중 오류가 발생했습니다.' });
    }
    
    res.json({ 
      id: this.lastID,
      message: '이미지가 성공적으로 업로드되었습니다.',
      imageUrl: imageUrl
    });
  });
});

// 이미지 수정
app.put('/api/images/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, category, subcategory, location, isActive, order_num } = req.body;
  
  const query = `
    UPDATE images 
    SET title = ?, description = ?, category = ?, subcategory = ?, 
        location = ?, isActive = ?, order_num = ?
    WHERE id = ?
  `;
  
  db.run(query, [title, description, category, subcategory, location, isActive, order_num, id], function(err) {
    if (err) {
      console.error('Error updating image:', err);
      return res.status(500).json({ error: '이미지 수정 중 오류가 발생했습니다.' });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: '이미지를 찾을 수 없습니다.' });
    }
    
    res.json({ message: '이미지가 성공적으로 수정되었습니다.' });
  });
});

// 이미지 삭제
app.delete('/api/images/:id', (req, res) => {
  const { id } = req.params;
  
  // 먼저 이미지 정보를 조회
  db.get('SELECT imageUrl FROM images WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error('Error fetching image:', err);
      return res.status(500).json({ error: '이미지 조회 중 오류가 발생했습니다.' });
    }
    
    if (!row) {
      return res.status(404).json({ error: '이미지를 찾을 수 없습니다.' });
    }
    
    // 데이터베이스에서 삭제
    db.run('DELETE FROM images WHERE id = ?', [id], function(err) {
      if (err) {
        console.error('Error deleting image:', err);
        return res.status(500).json({ error: '이미지 삭제 중 오류가 발생했습니다.' });
      }
      
      // 파일 시스템에서도 삭제
      const filePath = path.join(__dirname, 'public', row.imageUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      
      res.json({ message: '이미지가 성공적으로 삭제되었습니다.' });
    });
  });
});

// 이미지 순서 변경
app.put('/api/images/:id/order', (req, res) => {
  const { id } = req.params;
  const { direction } = req.body; // 'up' or 'down'
  
  db.get('SELECT order_num FROM images WHERE id = ?', [id], (err, currentImage) => {
    if (err || !currentImage) {
      return res.status(404).json({ error: '이미지를 찾을 수 없습니다.' });
    }
    
    const currentOrder = currentImage.order_num;
    let targetOrder;
    
    if (direction === 'up') {
      targetOrder = currentOrder - 1;
    } else if (direction === 'down') {
      targetOrder = currentOrder + 1;
    } else {
      return res.status(400).json({ error: '잘못된 방향입니다.' });
    }
    
    // 대상 이미지 찾기
    db.get('SELECT id FROM images WHERE order_num = ?', [targetOrder], (err, targetImage) => {
      if (err || !targetImage) {
        return res.status(400).json({ error: '순서를 변경할 수 없습니다.' });
      }
      
      // 순서 교환
      db.run('UPDATE images SET order_num = ? WHERE id = ?', [targetOrder, id], (err) => {
        if (err) {
          return res.status(500).json({ error: '순서 변경 중 오류가 발생했습니다.' });
        }
        
        db.run('UPDATE images SET order_num = ? WHERE id = ?', [currentOrder, targetImage.id], (err) => {
          if (err) {
            return res.status(500).json({ error: '순서 변경 중 오류가 발생했습니다.' });
          }
          
          res.json({ message: '순서가 성공적으로 변경되었습니다.' });
        });
      });
    });
  });
});

// 홈페이지 이미지 전용 API (활성화된 이미지만 반환)
app.get('/api/homepage-images', (req, res) => {
  const { category, subcategory } = req.query;
  let query = 'SELECT * FROM images WHERE isActive = 1 ORDER BY order_num ASC';
  let params = [];

  if (category && category !== 'all') {
    query = 'SELECT * FROM images WHERE category = ? AND isActive = 1 ORDER BY order_num ASC';
    params = [category];
    
    if (subcategory && subcategory !== 'all') {
      query = 'SELECT * FROM images WHERE category = ? AND subcategory = ? AND isActive = 1 ORDER BY order_num ASC';
      params = [category, subcategory];
    }
  }

  db.all(query, params, (err, rows) => {
    if (err) {
      console.error('Error fetching homepage images:', err);
      return res.status(500).json({ error: '홈페이지 이미지 조회 중 오류가 발생했습니다.' });
    }
    res.json(rows);
  });
});

// 홈페이지 이미지 관련 API
// 홈페이지 이미지 조회
app.get('/api/homepage-images', (req, res) => {
  const { category, subcategory } = req.query;
  let query = 'SELECT * FROM homepage_images ORDER BY order_num ASC';
  let params = [];

  if (category) {
    query = 'SELECT * FROM homepage_images WHERE category = ? ORDER BY order_num ASC';
    params = [category];
    
    if (subcategory) {
      query = 'SELECT * FROM homepage_images WHERE category = ? AND subcategory = ? ORDER BY order_num ASC';
      params = [category, subcategory];
    }
  }

  db.all(query, params, (err, rows) => {
    if (err) {
      console.error('Error fetching homepage images:', err);
      return res.status(500).json({ error: '홈페이지 이미지 조회 중 오류가 발생했습니다.' });
    }
    res.json(rows);
  });
});

// 홈페이지 이미지 업로드
app.post('/api/homepage-images', upload.single('image'), (req, res) => {
  const { title, description, category, subcategory, order_num } = req.body;
  
  if (!req.file) {
    return res.status(400).json({ error: '이미지 파일이 필요합니다.' });
  }

  const imageUrl = `/uploads/${req.file.filename}`;
  
  const query = `
    INSERT INTO homepage_images (title, description, imageUrl, category, subcategory, order_num, isActive)
    VALUES (?, ?, ?, ?, ?, ?, 1)
  `;
  
  db.run(query, [title, description, imageUrl, category, subcategory, order_num || 0], function(err) {
    if (err) {
      console.error('Error uploading homepage image:', err);
      return res.status(500).json({ error: '홈페이지 이미지 업로드 중 오류가 발생했습니다.' });
    }
    
    res.json({ 
      id: this.lastID,
      message: '홈페이지 이미지가 성공적으로 업로드되었습니다.',
      imageUrl: imageUrl
    });
  });
});

// 홈페이지 이미지 수정
app.put('/api/homepage-images/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, category, subcategory, order_num, isActive } = req.body;
  
  const query = `
    UPDATE homepage_images 
    SET title = ?, description = ?, category = ?, subcategory = ?, 
        order_num = ?, isActive = ?
    WHERE id = ?
  `;
  
  db.run(query, [title, description, category, subcategory, order_num, isActive, id], function(err) {
    if (err) {
      console.error('Error updating homepage image:', err);
      return res.status(500).json({ error: '홈페이지 이미지 수정 중 오류가 발생했습니다.' });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: '홈페이지 이미지를 찾을 수 없습니다.' });
    }
    
    res.json({ message: '홈페이지 이미지가 성공적으로 수정되었습니다.' });
  });
});

// 홈페이지 이미지 삭제
app.delete('/api/homepage-images/:id', (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT imageUrl FROM homepage_images WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error('Error fetching homepage image:', err);
      return res.status(500).json({ error: '홈페이지 이미지 조회 중 오류가 발생했습니다.' });
    }
    
    if (!row) {
      return res.status(404).json({ error: '홈페이지 이미지를 찾을 수 없습니다.' });
    }
    
    db.run('DELETE FROM homepage_images WHERE id = ?', [id], function(err) {
      if (err) {
        console.error('Error deleting homepage image:', err);
        return res.status(500).json({ error: '홈페이지 이미지 삭제 중 오류가 발생했습니다.' });
      }
      
      const filePath = path.join(__dirname, 'public', row.imageUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      
      res.json({ message: '홈페이지 이미지가 성공적으로 삭제되었습니다.' });
    });
  });
});

// 홈페이지 이미지 순서 변경
app.put('/api/homepage-images/:id/order', (req, res) => {
  const { id } = req.params;
  const { direction } = req.body;
  
  db.get('SELECT order_num FROM homepage_images WHERE id = ?', [id], (err, currentRow) => {
    if (err || !currentRow) {
      return res.status(404).json({ error: '이미지를 찾을 수 없습니다.' });
    }
    
    const currentOrder = currentRow.order_num;
    const newOrder = direction === 'up' ? currentOrder - 1 : currentOrder + 1;
    
    if (newOrder < 0) {
      return res.status(400).json({ error: '이미지가 이미 맨 위에 있습니다.' });
    }
    
    db.get('SELECT id FROM homepage_images WHERE order_num = ?', [newOrder], (err, targetRow) => {
      if (err) {
        return res.status(500).json({ error: '순서 변경 중 오류가 발생했습니다.' });
      }
      
      if (!targetRow) {
        return res.status(400).json({ error: '이미지가 이미 맨 아래에 있습니다.' });
      }
      
      db.run('BEGIN TRANSACTION');
      
      db.run('UPDATE homepage_images SET order_num = ? WHERE id = ?', [newOrder, id], function(err) {
        if (err) {
          db.run('ROLLBACK');
          return res.status(500).json({ error: '순서 변경 중 오류가 발생했습니다.' });
        }
        
        db.run('UPDATE homepage_images SET order_num = ? WHERE id = ?', [currentOrder, targetRow.id], function(err) {
          if (err) {
            db.run('ROLLBACK');
            return res.status(500).json({ error: '순서 변경 중 오류가 발생했습니다.' });
          }
          
          db.run('COMMIT');
          res.json({ message: '이미지 순서가 성공적으로 변경되었습니다.' });
        });
      });
    });
  });
});

// 활동기록 관련 API
// 모든 활동기록 조회
app.get('/api/activity-records', (req, res) => {
  const { location, category } = req.query;
  let query = 'SELECT * FROM activity_records ORDER BY date DESC, uploadDate DESC';
  let params = [];

  if (location) {
    query = 'SELECT * FROM activity_records WHERE location = ? ORDER BY date DESC, uploadDate DESC';
    params = [location];
    
    if (category) {
      query = 'SELECT * FROM activity_records WHERE location = ? AND category = ? ORDER BY date DESC, uploadDate DESC';
      params = [location, category];
    }
  } else if (category) {
    query = 'SELECT * FROM activity_records WHERE category = ? ORDER BY date DESC, uploadDate DESC';
    params = [category];
  }

  db.all(query, params, (err, rows) => {
    if (err) {
      console.error('Error fetching activity records:', err);
      return res.status(500).json({ error: '활동기록 조회 중 오류가 발생했습니다.' });
    }
    
    // images 필드를 JSON 배열로 파싱
    const records = rows.map(row => ({
      ...row,
      images: JSON.parse(row.images || '[]')
    }));
    
    res.json(records);
  });
});

// 활동기록 업로드
app.post('/api/activity-records', upload.array('images', 10), (req, res) => {
  const { title, content, location, category, date } = req.body;
  
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: '최소 1개의 이미지가 필요합니다.' });
  }

  if (!title || !content || !location || !category || !date) {
    return res.status(400).json({ error: '모든 필수 필드를 입력해주세요.' });
  }

  // 업로드된 이미지 경로들을 배열로 저장
  const imageUrls = req.files.map(file => `/uploads/${file.filename}`);
  const imagesJson = JSON.stringify(imageUrls);
  
  const query = `
    INSERT INTO activity_records (title, content, images, location, category, date, author)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  
  db.run(query, [title, content, imagesJson, location, category, date, '관리자'], function(err) {
    if (err) {
      console.error('Error uploading activity record:', err);
      return res.status(500).json({ error: '활동기록 업로드 중 오류가 발생했습니다.' });
    }
    
    res.json({ 
      id: this.lastID.toString(),
      message: '활동기록이 성공적으로 업로드되었습니다.'
    });
  });
});

// 활동기록 수정
app.put('/api/activity-records/:id', (req, res) => {
  const { id } = req.params;
  const { title, content, location, category, date, isActive } = req.body;
  
  const query = `
    UPDATE activity_records 
    SET title = ?, content = ?, location = ?, category = ?, date = ?, isActive = ?
    WHERE id = ?
  `;
  
  db.run(query, [title, content, location, category, date, isActive, id], function(err) {
    if (err) {
      console.error('Error updating activity record:', err);
      return res.status(500).json({ error: '활동기록 수정 중 오류가 발생했습니다.' });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: '활동기록을 찾을 수 없습니다.' });
    }
    
    res.json({ message: '활동기록이 성공적으로 수정되었습니다.' });
  });
});

// 활동기록 삭제
app.delete('/api/activity-records/:id', (req, res) => {
  const { id } = req.params;
  
  // 먼저 활동기록 정보를 조회
  db.get('SELECT images FROM activity_records WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error('Error fetching activity record:', err);
      return res.status(500).json({ error: '활동기록 조회 중 오류가 발생했습니다.' });
    }
    
    if (!row) {
      return res.status(404).json({ error: '활동기록을 찾을 수 없습니다.' });
    }
    
    // 데이터베이스에서 삭제
    db.run('DELETE FROM activity_records WHERE id = ?', [id], function(err) {
      if (err) {
        console.error('Error deleting activity record:', err);
        return res.status(500).json({ error: '활동기록 삭제 중 오류가 발생했습니다.' });
      }
      
      // 이미지 파일들도 삭제
      try {
        const images = JSON.parse(row.images || '[]');
        images.forEach(imageUrl => {
          const filePath = path.join(__dirname, 'public', imageUrl);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        });
      } catch (error) {
        console.error('Error deleting image files:', error);
      }
      
      res.json({ message: '활동기록이 성공적으로 삭제되었습니다.' });
    });
  });
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`🚀 TheVida Backend API 서버가 포트 ${PORT}에서 실행 중입니다.`);
  console.log(`📁 이미지 업로드 경로: http://localhost:${PORT}/uploads/`);
  console.log(`🔗 API 문서: http://localhost:${PORT}/`);
});
