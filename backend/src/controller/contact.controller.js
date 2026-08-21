import Contact from "../model.js/contactSchema.js";
import mongoose from "mongoose";

export async function createContact(req, res) {
  try {
    const { name, email, phone, destination, travelDate, message } = req.body;

    const contact = await Contact.create({
      name,
      email,
      phone,
      destination: destination || "",
      travelDate: travelDate ? new Date(travelDate) : null,
      message,
    });

    return res.status(201).json({
      success: true,
      message: "Contact inquiry submitted successfully",
      data: contact,
    });
  } catch (error) {
    console.error("Create contact error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function getAllContacts(req, res) {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;
    const query = {};

    if (status && status !== "all") {
      query.status = status;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { destination: { $regex: search, $options: "i" } },
      ];
    }
    const currentPage = Math.max(Number(page) || 1, 1);
    const pageLimit = Math.min(Math.max(Number(limit) || 10, 1), 100);
    const skip = (currentPage - 1) * pageLimit;
    const totalContacts = await Contact.countDocuments(query);
    const totalPages = Math.ceil(totalContacts / pageLimit);
    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageLimit)
      .lean();
    return res.status(200).json({
      success: true,
      message: "Contacts fetched successfully",
      count: contacts.length,
      pagination: {
        totalContacts,
        totalPages,
        currentPage,
        limit: pageLimit,
        hasNextPage: currentPage < totalPages,
        hasPreviousPage: currentPage > 1,
      },
      data: contacts,
    });
  } catch (error) {
    console.error("Get contacts error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
export async function getContactById(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Contact ID",
      });
    }
    const contact = await Contact.findById(id).lean();
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Contact fetched successfully",
      data: contact,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function updateContactStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Contact ID",
      });
    }
    const contact = await Contact.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true },
    );
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Contact status updated successfully",
      data: contact,
    });
  } catch (error) {
    console.error("Update contact status error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
export async function deleteContact(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Contact ID",
      });
    }
    const contact = await Contact.findByIdAndDelete(id);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Contact deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}