# SkillSync: EC2 Deployment Guide

This guide explains how to deploy the SkillSync web application (Frontend + Backend Node.js) on an Amazon EC2 instance.
[▶️ วิดีโอแนะนำการใช้งานระบบ](https://www.youtube.com/watch?v=XXXXXXXXXXX)
[📦 ดาวน์โหลดระบบ SkillSync (ZIP)](https://your-s3-bucket.s3.amazonaws.com/SkillSync.zip)
---

## ✅ Prerequisites

* AWS account with EC2 access
* A `.pem` SSH key file (e.g., `labsuser.pem`)
* Files to deploy: `index.html`, `server.js`, `package.json`, etc.

---

## 🔹 Step 1: Launch EC2 Instance

1. Go to AWS Console → EC2 → Launch Instance
2. Choose **Amazon Linux 2023**
3. Instance type: `t2.micro` (Free Tier)
4. Configure security group:

   * Allow **SSH (22)** from your IP
   * Allow **HTTP (80)** from Anywhere
   * Allow **Custom TCP (3000)** from Anywhere

---

## 🔹 Step 2: SSH into EC2

```bash
ssh -i labsuser.pem ec2-user@<EC2-PUBLIC-IP>
```

---

## 🔹 Step 3: Install Node.js and unzip

```bash
sudo dnf install -y nodejs unzip
```

---

## 🔹 Step 4: Upload Your Project

### Option 1: Upload files directly

```bash
scp -i labsuser.pem -r * ec2-user@<EC2-PUBLIC-IP>:/home/ec2-user/
```

### Option 2: Zip and upload

```bash
zip -r project.zip *
scp -i labsuser.pem project.zip ec2-user@<EC2-PUBLIC-IP>:/home/ec2-user/
```

On EC2:

```bash
unzip project.zip
```

---

## 🔹 Step 5: Install Dependencies & Start Server

```bash
cd /home/ec2-user
npm install
node server.js   # or use pm2: npx pm2 start server.js
```

---

## 🔹 Step 6: Test Your Web App

In your browser, visit:

```
http://<EC2-PUBLIC-IP>:3000/
```

You should see your Node.js web application running.

---

## ✅ Optional: Serve Static HTML via Nginx

If you want to serve static files:

```bash
sudo dnf install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
sudo cp -r public/* /usr/share/nginx/html/
```

Visit: `http://<EC2-PUBLIC-IP>/`

---

## 💡 Tips

* Use `pm2` to keep server.js running persistently
* Monitor logs with `pm2 logs`
* Restart server with `pm2 restart all`

---

Enjoy your SkillSync deployment on EC2! 🚀
