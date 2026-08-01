import Router from "express"
const router = Router()
import { createHomePageHero, deleteHeroHomeImage, getAllHeroImage, updateHeroImage } from "../controller/heroHomePage.controller.js"
import { upload } from "../services/multer.js"
import { authenticate, isAdmin } from "../middleware/auth.middleware.js"

router.post("/", authenticate, isAdmin, upload.array("image"), createHomePageHero)
router.get("/", getAllHeroImage)
router.get("/admin/all", authenticate, isAdmin, getAllHeroImage)
router.put(
    "/:id",
    authenticate,
    isAdmin,
    upload.single("image"),
    updateHeroImage
);
router.delete("/:id", authenticate, isAdmin, deleteHeroHomeImage)



export default router