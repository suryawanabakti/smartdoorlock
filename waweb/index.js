require("dotenv").config();

const express = require("express");
const cors = require("cors");
const qrcode = require("qrcode");
const { Client, LocalAuth } = require("whatsapp-web.js");

const app = express();
const PORT = process.env.PORT || 3001;
const API_TOKEN = process.env.API_TOKEN;

app.use(express.json());
app.use(cors());

const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: process.env.SESSION_DIR || "./session",
    }),
    puppeteer: {
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
    },
});

let qrPngBuffer = null;
let lastQr = null;

client.on("qr", async (qr) => {
    lastQr = qr;
    qrPngBuffer = await qrcode.toBuffer(qr, { width: 300, margin: 2 });
    console.log("QR Code diterima, scan di http://localhost:" + PORT + "/api/qr");
});

client.on("ready", () => {
    console.log("WhatsApp terhubung sebagai:", client.info.wid.user);
});

client.on("authenticated", () => {
    console.log("WhatsApp berhasil diautentikasi");
});

client.on("auth_failure", (msg) => {
    console.error("Autentikasi gagal:", msg);
});

client.on("disconnected", (reason) => {
    console.log("WhatsApp terputus:", reason);
    lastQr = null;
    qrPngBuffer = null;
});

function normalizePhone(number) {
    let phone = String(number).replace(/[^\d]/g, "");
    if (phone.startsWith("0")) {
        phone = "62" + phone.slice(1);
    } else if (phone.startsWith("8")) {
        phone = "62" + phone;
    } else if (phone.startsWith("+")) {
        phone = phone.replace("+", "");
    }
    return phone + "@c.us";
}

function requireAuth(req, res, next) {
    if (!API_TOKEN) return next();
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (token !== API_TOKEN) {
        return res.status(401).json({ success: false, message: "Token API tidak valid" });
    }
    next();
}

app.get("/api/qr", (req, res) => {
    if (!qrPngBuffer) {
        return res
            .status(404)
            .send("QR Code belum tersedia. Cek log server untuk status koneksi.");
    }
    res.set("Content-Type", "image/png");
    res.set("Cache-Control", "no-store");
    res.send(qrPngBuffer);
});

app.get("/api/status", (req, res) => {
    const state = client.info
        ? {
              connected: client.info.wid ? true : false,
              phone: client.info.wid.user,
              state: "ready",
          }
        : {
              connected: false,
              state: lastQr ? "waiting_qr" : "connecting",
          };
    res.json({ success: true, ...state });
});

app.post("/api/send", requireAuth, async (req, res) => {
    const { phone, message } = req.body;

    if (!phone || !message) {
        return res.status(400).json({
            success: false,
            message: "Parameter 'phone' dan 'message' wajib diisi",
        });
    }

    if (!client.info) {
        return res.status(503).json({
            success: false,
            message: "WhatsApp belum terhubung, scan QR dulu",
        });
    }

    try {
        const number = normalizePhone(phone);
        const sent = await client.sendMessage(number, message);
        res.json({
            success: true,
            messageId: sent?.id?.id || null,
            message: "Pesan terkirim",
        });
    } catch (error) {
        console.error("Gagal mengirim pesan:", error);
        res.status(500).json({
            success: false,
            message: "Gagal mengirim pesan: " + error.message,
        });
    }
});

client.initialize();

app.listen(PORT, () => {
    console.log("Waweb server berjalan di http://localhost:" + PORT);
});
