




//
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import path from "path";

import { connectDB } from "./lib/db.js";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";

dotenv.config();

const PORT = process.env.PORT;
const __dirname = path.resolve();


app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to FriendChat</title>
      <style>
        body {
          background: linear-gradient(135deg, #614385, #516395);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Segoe UI', 'Arial', sans-serif;
          margin: 0;
        }
        .welcome-container {
          background: rgba(255,255,255,0.95);
          border-radius: 16px;
          padding: 2.8rem 2.2rem 2.2rem 2.2rem;
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.18);
          text-align: center;
          max-width: 375px;
        }
        .friendchat-logo {
          width: 74px;
          height: 74px;
          border-radius: 50%;
          background: #614385;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 0.8rem auto;
          box-shadow: 0 2px 8px #51639540;
        }
        .friendchat-logo span {
          font-size: 2.5rem;
          font-weight: bold;
          color: #fff;
          letter-spacing: 2px;
        }
        .welcome-container h1 {
          color: #614385;
          margin-bottom: 0.4rem;
        }
        .welcome-container p {
          color: #555;
          margin-top: 0.2rem;
          margin-bottom: 1.3rem;
          font-size: 1.04rem;
        }
        .chat-btn {
          display: inline-block;
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
          background-color: #516395;
          color: #fff;
          border: none;
          border-radius: 27px;
          cursor: pointer;
          font-weight: bold;
          box-shadow: 0 3px 9px rgba(97,67,133,0.09);
          transition: background 0.24s, transform 0.15s;
        }
        .chat-btn:hover {
          background: #614385;
          transform: translateY(-2px) scale(1.04);
        }
        .fade-in {
          opacity: 0;
          transform: translateY(25px);
          animation: fadeinmove 1s ease 0.2s forwards;
        }
        @keyframes fadeinmove {
          to {
            opacity: 1;
            transform: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="welcome-container fade-in">
        <div class="friendchat-logo"><span>💬</span></div>
        <h1>Welcome to FriendChat!</h1>
        <p>
          Connect, chat, and make friends easily on FriendChat.<br>
          Get started and enjoy seamless real-time conversations.
        </p>
       
      </div>
      <script>
        document.getElementById('startChatBtn').addEventListener('click', function() {
          alert('Welcome to FriendChat! Please log in or sign up to continue.');
        });
      </script>
    </body>
    </html>
  `);

  
});
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}
// Explanation:
// في الكود الحالي، تقوم باستدعاء connectDB() مرتين: مرة قبل server.listen، ومرة داخل callback الخاص بـ server.listen.
// إذا كانت دالة connectDB تقوم بطباعة اسم السيرفر عند الاتصال (أو المضيف)، وإذا لم يكن الاتصال جاهزًا أول مرة فقد يكون اسم المضيف undefined.
// أما المرة الثانية (داخل callback)، فقد يكون الاتصال جاهزًا وبالتالي يُظهر اسم المضيف الصحيح.

// الحل الأفضل: استدعاء connectDB() مرة واحدة فقط قبل بدء السيرفر، أو الأفضل: الاعتماد على تعليمة واحدة واضحة لتفادي اللبس.

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log("server is running on PORT:" + PORT);
  });
}).catch((err) => {
  console.error("Failed to connect to MongoDB:", err);
  process.exit(1);
});
