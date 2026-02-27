const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const app = express();

app.use(bodyParser.json());

const port = 8000;

let conn = null;
const initMySQL = async () => {
    conn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'webdb',
        port: 8700
    });
    console.log('Connected to MySQL database');
}

// path: = GET / users สำรหับดึงข้อมูล users ทั้งหทด

app.get('/users', async (req, res) => {
    const results = await conn.query('SELECT * FROM users');
    res.json(results[0]);
});

//path: = POST / user สำหรับเพิ่ม user ใหม่
app.post('/users', async (req, res) => {
    try {
        let user = req.body;
        const result = await conn.query('INSERT INTO users SET ?', user);
        console.log('result', result);
        res.json({
            message: 'User added successfully',
            data: result[0]
        });
    } catch (error) {
        console.error('Error inserting user:', error);
        res.status(500).json({ message: 'Error adding user' });
    }
});

//path: = GET / user/:id สำหรับดึงข้อมูล user ตาม id
app.get('/users/:id', async (req, res) => {
    try {
        let id = req.params.id;
        const results = await conn.query('SELECT * FROM users WHERE id = ?', [id]);
        if (results[0].length === 0) {
            throw { statusCode: 404, message: 'User not found' };
        }
        res.json(results[0][0]);
     } catch (error) {
        console.error('Error fetching user:', error);
        let statusCode = error.statusCode || 500;
        res.status(500).json({ 
            message: 'Error fetching user'
        });
    }
});

//path: = PUT / user/:id สำหรับอัพเดทข้อมูล user ตาม id
app.put('/users/:id', async (req, res) => {
    try{
        let id = req.params.id;
        let updatedUser = req.body;
        const result = await conn.query('UPDATE users SET ? WHERE id = ?', [updatedUser, id]);
        res.json({
            message: 'User updated successfully',
            data: result[0]
        });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Error updating user' });
    }
})
//path: = DELETE / user/:id สำหรับลบ user ตาม id
app.delete('/users/:id', async (req, res) => {
    try {
        let id = req.params.id;
        const result = await conn.query('DELETE FROM users WHERE id = ?', [id]);
        res.json({
            message: 'User deleted successfully',
            data: result[0]
        });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Error deleting user' });
    }
})
// path: = GET / users
app.get('/users', (req, res) => {
    res.json(users);
});

//path: = POST / user
app.post('/user', (req, res) => {
    let user = (req.body);
    user.id = counter
    counter += 1;

    users.push(user);
    res.json({
        message: 'User added successfully',
        user: user
    });
});

// path: = PUT /user/:id
app.patch('/user/:id', (req, res) => {
    let id = req.params.id;
    let updatedUser = req.body;

    // หา user ที่จาก id ที่ส่งมา
    let selectedIndex = users.findIndex(user => user.id == id);

    // อัพเดทข้อมูล users
    users[selectedIndex].firstname = updatedUser.firstname || user[selectedIndex].firstname
    users[selectedIndex].lastname = updatedUser.lastname || user[selectedIndex].lastname

    if (updatedUser.firstname) {
        users[selectedIndex].firstname = updatedUser.firstname;
    }
    if (updatedUser.lastname) {
        users[selectedIndex].lastname = updatedUser.lastname;
    }

    res.json({
        message: 'User updated successfully',
        data: {
            user: updatedUser,
            indexUpdate: selectedIndex
        }
    });
    // ส่ง users ที่อัพเดทแล้วกลับไป
})

app.delete('/users/:id', (req, res) => {
    let id = req.params.id;
    // หา index จาก id ที่ต้องการลบ
    let selectedIndex = users.findIndex(user => user.id == id);

    // ลบ user ออกจาก users
    users.splice(selectedIndex, 1);

    res.json({
        message: 'User deleted successfully',
        indexDelete: selectedIndex
    });

})

app.listen(port, async () => {
    await initMySQL();
    console.log(`Server is running on http://localhost:${port}`);
});