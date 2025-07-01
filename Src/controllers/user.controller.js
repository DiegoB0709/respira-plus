import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const getUserProfile = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.status(200).json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener perfil de usuario", error });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const {
      role,
      isActive,
      username,
      email,
      phone,
      page = 1,
      limit = 10,
      hasToken,
    } = req.query;

    const query = {};

    if (role && ["doctor", "patient"].includes(role)) {
      query.role = role;
    }

    if (isActive === "true" || isActive === "false") {
      query.isActive = isActive === "true";
    }

    if (username) {
      query.username = { $regex: username, $options: "i" };
    }

    if (email) {
      query.email = { $regex: email, $options: "i" };
    }

    if (phone) {
      query.phone = { $regex: phone, $options: "i" };
    }

    if (hasToken === "true") {
      query.registrationToken = { $exists: true, $ne: "" };
    } else {
      query.registrationToken = { $in: [null, ""] };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

  const users = await User.find(query)
    .select("-password")
    .populate({ path: "doctor", select: "username" })
    .skip(skip)
    .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.status(200).json({
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      users,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener usuarios", error });
  }
};

export const getDoctors = async (req, res) => {
  try {
    const doctors = await User.find({
      role: "doctor",
      $or: [
        { registrationToken: { $exists: false } },
        { registrationToken: null },
        { registrationToken: "" },
      ],
    }).select("username _id");

    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los doctores" });
  }
};

export const updateUser = async (req, res) => {
  const userId = req.user.id;

  try {
    const updates = req.body;
    const allowedUpdates = ["username", "email", "phone", "password"];
    const filteredUpdates = {};

    for (const key of allowedUpdates) {
      if (updates[key] !== undefined) {
        filteredUpdates[key] = updates[key];
      }
    }

    if (filteredUpdates.password) {
      filteredUpdates.password = await bcrypt.hash(
        filteredUpdates.password,
        10
      );
    }

    const updatedUser = await User.findByIdAndUpdate(userId, filteredUpdates, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar usuario", error });
  }
};
