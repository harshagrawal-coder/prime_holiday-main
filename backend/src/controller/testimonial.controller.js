import Testimonial from "../model.js/testimonialSchema.js";
import { uploadFile, deleteFile } from "../services/imagekit.js";
export async function createTestimonial(req, res) {
  let uploadedFileId = null;
  try {
    const { name, location, text, rating, isActive, isVerified } = req.body;
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "testimonial image is required",
      });
    }
    const uploadedImage = await uploadFile({
      file: req.file.buffer,
      fileName: req.file.originalname,
      folder: "/testimonials"
    });
    uploadedFileId = uploadedImage.fileId;
    const testimonial = await Testimonial.create({
      name,
      location,
      text,
      rating:
        rating !== undefined
          ? Number(rating)
          : 5,
      isActive,
      isVerified,
      image: {
        url: uploadedImage.url,
        fileId: uploadedImage.fileId,
        alt: name,
      },
    });
    return res.status(201).json({
      success: true,
      message: "Testimonial created successfully",
      testimonial,
    });
  } catch (error) {
    if (uploadedFileId) {
      await deleteFile(uploadedFileId);
    }
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
export async function getTestimonials(req, res) {
  try {
    const query = { isActive: true };
    const testimonials = await Testimonial.find(query).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      message: "Testimonials fetched successfully",
      testimonials,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function getAdminTestimonials(req, res) {
  try {
    const { isActive, search, page = 1, limit = 10 } = req.query;
    const query = {};
    if (isActive !== undefined) {
      query.isActive = isActive === "true";
    }
    if (search?.trim()) {
      const searchValue = search.trim();
      query.$or = [
        { name: { $regex: searchValue, $options: "i" } },
        { location: { $regex: searchValue, $options: "i" } },
        { text: { $regex: searchValue, $options: "i" } },
      ];
    }
    const currentPage = Math.max(Number(page) || 1, 1);
    const pageLimit = Math.min(Math.max(Number(limit) || 10, 1), 100);
    const skip = (currentPage - 1) * pageLimit;
    const totalTestimonials = await Testimonial.countDocuments(query);
    const totalPages = Math.ceil(totalTestimonials / pageLimit);
    const testimonials = await Testimonial.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageLimit)
      .lean();
    return res.status(200).json({
      success: true,
      count: testimonials.length,
      pagination: {
        totalTestimonials,
        totalPages,
        currentPage,
        limit: pageLimit,
        hasNextPage: currentPage < totalPages,
        hasPreviousPage: currentPage > 1,
      },
      data: testimonials,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
export async function getTestimonialById(req, res) {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Testimonial fetched successfully",
      testimonial,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
export async function updateTestimonial(req, res) {
  try {
    const { name, location, text, image, rating, isActive, isVerified } = req.body;
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }
    if (name !== undefined) testimonial.name = name;
    if (location !== undefined) testimonial.location = location;
    if (text !== undefined) testimonial.text = text;
    if (image !== undefined) testimonial.image = image;
    if (rating !== undefined) testimonial.rating = Number(rating);
    if (isActive !== undefined) testimonial.isActive = isActive;
    if (isVerified !== undefined) testimonial.isVerified = isVerified;
    await testimonial.save();
    return res.status(200).json({
      success: true,
      message: "Testimonial updated successfully",
      testimonial,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function deleteTestimonial(req, res) {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Testimonial deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function updateTestimonialStatus(req, res) {
  try {
    const { isActive } = req.body;
    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isActive must be a boolean",
      });
    }
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }
    testimonial.isActive = isActive;
    await testimonial.save();
    return res.status(200).json({
      success: true,
      message: "Testimonial status updated successfully",
      testimonial,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
