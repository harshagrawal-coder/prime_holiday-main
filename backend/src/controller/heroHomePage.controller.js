import HeroHomePage from "../model.js/HeroHomepage.schema.js";
import { uploadFile, deleteFile } from "../services/imagekit.js"

export const createHomePageHero = async (req, res) => {
    const uploadFileIds = [];
    const { isActive } = req.body
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Hero image is required",
            });
        }
        const heroImages = [];
        for (const [index, image] of req.files.entries()) {
            const uploaded = await uploadFile({
                file: image.buffer,
                fileName: image.originalname,
                folder: "/herohomepage/image",
            });
            uploadFileIds.push(uploaded.fileId);
            const hero = await HeroHomePage.create({
                image: {
                    url: uploaded.url,
                    fileId: uploaded.fileId,
                    alt: image.originalname,
                },
                order: index + 1,
                isActive,
            });
            heroImages.push(hero);
        }
        return res.status(201).json({
            success: true,
            message: "Hero images uploaded successfully",
            data: heroImages,
        });
    } catch (error) {
        if (uploadFileIds.length > 0) {
            await Promise.all(
                uploadFileIds.map(async (fileId) => {
                    try {
                        await deleteFile(fileId);
                    } catch (err) {
                        console.log(err.message);
                    }
                })
            );
        }
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
export const getAllHeroImage = async (req, res) => {
    try {
        const query = {};
        if (req.query.isActive !== undefined) {
            query.isActive = req.query.isActive === "true";
        }
        const heroImages = await HeroHomePage
            .find(query)
            .sort({ order: 1 });
        return res.status(200).json({
            success: true,
            message: "Hero images fetched successfully",
            data: heroImages,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
export const updateHeroImage = async (req, res) => {
    const { id } = req.params
    const herohomeImage = await HeroHomePage.findById(id)
    if (!herohomeImage) {
        return res.status(404).json({
            success: false,
            message: "hero Image not found"
        })
    }
    const oldFileId = herohomeImage.image.fileId
    if (req.file) {
        const uploaded = await uploadFile({
            file: req.file.buffer,
            fileName: req.file.originalname,
            folder: "/herohomepage/image",
        });
        await deleteFile(oldFileId)
        herohomeImage.image = {
            url: uploaded.url,
            fileId: uploaded.fileId,
            alt: req.file.originalname,
        };
    }
    if (req.body.order) {
        herohomeImage.order = req.body.order;
    }

    if (req.body.isActive !== undefined) {
        herohomeImage.isActive = req.body.isActive === "true"
    }
    await herohomeImage.save();
    return res.status(200).json({
        success: true,
        message: "Hero updated successfully",
        data: herohomeImage,
    });
}
export const deleteHeroHomeImage = async (req, res) => {
    try {
        const { id } = req.params;
        const heroImage = await HeroHomePage.findById(id);
        if (!heroImage) {
            return res.status(404).json({
                success: false,
                message: "Hero image not found",
            });
        }
        // Try to delete image from ImageKit
        try {
            if (heroImage.image?.fileId) {
                await deleteFile(heroImage.image.fileId);
            }
        } catch (err) {
            console.error("ImageKit Delete Error:", err.message);
            // Ignore the error and continue
        }
        // Delete MongoDB document
        await HeroHomePage.findByIdAndDelete(id);
        return res.status(200).json({
            success: true,
            message: "Hero image deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};