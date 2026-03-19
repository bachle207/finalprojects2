import express from "express";
import bcrypt from "bcryptjs";
import Account from "../models/Account.js";

const router = express.Router();

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { fullName, email, password, role, phone, company } = req.body;

    // Kiểm tra email đã tồn tại
    const existingUser = await Account.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email đã được sử dụng!" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const account = new Account({
      fullName,
      email,
      password: hashedPassword,
      role,
      phone: phone || "",
      company: company || ""
    });

    await account.save();

    // Trả về user info (không trả password)
    const userResponse = account.toObject();
    delete userResponse.password;
    res.status(201).json(userResponse);
  } catch (error) {
    res.status(500).json({ message: "Lỗi đăng ký", error: error.message });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Tìm user theo email
    const account = await Account.findOne({ email });
    if (!account) {
      return res.status(401).json({ message: "Email không tồn tại!" });
    }

    // Kiểm tra password
    const isMatch = await bcrypt.compare(password, account.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Mật khẩu không đúng!" });
    }

    // Kiểm tra role
    if (role && account.role !== role) {
      return res.status(401).json({ message: "Vai trò không đúng! Tài khoản này là " + account.role });
    }

    // Trả về user info (không trả password)
    const userResponse = account.toObject();
    delete userResponse.password;
    res.json(userResponse);
  } catch (error) {
    res.status(500).json({ message: "Lỗi đăng nhập", error: error.message });
  }
});

// PUT /api/auth/profile
router.put("/profile", async (req, res) => {
  try {
    const { email, fullName, phone, company, avatar } = req.body;

    const account = await Account.findOneAndUpdate(
      { email },
      { fullName, phone, company, avatar },
      { new: true }
    );

    if (!account) {
      return res.status(404).json({ message: "Không tìm thấy tài khoản!" });
    }

    const userResponse = account.toObject();
    delete userResponse.password;
    res.json(userResponse);
  } catch (error) {
    res.status(500).json({ message: "Lỗi cập nhật", error: error.message });
  }
});

// PUT /api/auth/change-password
router.put("/change-password", async (req, res) => {
  try {
    const { email, oldPassword, newPassword } = req.body;

    const account = await Account.findOne({ email });
    if (!account) {
      return res.status(404).json({ message: "Không tìm thấy tài khoản!" });
    }

    // Kiểm tra mật khẩu cũ
    const isMatch = await bcrypt.compare(oldPassword, account.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Mật khẩu cũ không đúng!" });
    }

    // Hash mật khẩu mới
    const salt = await bcrypt.genSalt(10);
    account.password = await bcrypt.hash(newPassword, salt);
    await account.save();

    res.json({ message: "Đổi mật khẩu thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi đổi mật khẩu", error: error.message });
  }
});

export default router;
