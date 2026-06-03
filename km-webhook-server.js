const express = require('express');
const app = express();
app.use(express.json());

const BOT_TOKEN = '8785347014:AAG2PPnhP9DHw6Cg8zIZHJdYi6gu6g_yjWY';
const CHAT_ID = '-1003753568907';

app.post('/km-webhook', async (req, res) => {
  try {
    const region = req.body.Region || 'Không rõ';
    const username = req.body.Username || 'Không rõ';
    const phone = req.body['Phone number'] || 'Không rõ';

    const text = `🎁 *Đăng ký nhận KM*\n\n🎮 Sảnh: ${region}\n👤 ID: ${username}\n🔢 Số chuỗi: ${phone}`;

    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text,
        parse_mode: 'Markdown'
      })
    });

    const result = await response.json();
    if (result.ok) {
      res.json({ success: true });
    } else {
      console.error('Telegram error:', result);
      res.status(500).json({ success: false, error: result.description });
    }
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/', (req, res) => res.send('KM Webhook Server is running'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
