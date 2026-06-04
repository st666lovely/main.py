const express = require('express');
const app = express();
app.use(express.json());

const BOT_TOKEN = '8785347014:AAG2PPnhP9DHw6Cg8zIZHJdYi6gu6g_yjWY';
const CHAT_ID = '-1003753568907';

app.post('/km-webhook', async (req, res) => {
  try {
    const attrs = req.body.attributes || {};

    const region = attrs.default_region || 'Không rõ';
    const username = attrs.default_username || 'Không rõ';
    const phone = attrs.default_phone_number || 'Không rõ';
    const imageUrl = attrs.image_attachment || null;

    const caption = `🎁 *Đăng ký nhận KM chuỗi thắng liên tiếp*\n\n🎮 Sảnh: ${region}\n👤 ID: ${username}\n🔢 Số chuỗi: ${phone}`;

    if (imageUrl) {
      // Gửi ảnh kèm caption
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          photo: imageUrl,
          caption,
          parse_mode: 'Markdown'
        })
      });
    } else {
      // Không có ảnh thì gửi text
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: caption,
          parse_mode: 'Markdown'
        })
      });
    }

    res.json({
      responses: [
        {
          type: 'text',
          message: 'Đã gửi đăng ký KM thành công ạ. Mình chú ý biến động số dư ví sau giây lát khi tiền thưởng đã được cập nhật giúp em nha, em cảm ơn ạ 🎁'
        }
      ]
    });

  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/km-webhook', (req, res) => {
  if (req.query.token !== 'km123') {
    res.writeHead(401);
    return res.end();
  }
  return res.end(req.query.challenge);
});

app.get('/', (req, res) => res.send('KM Webhook Server is running'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
