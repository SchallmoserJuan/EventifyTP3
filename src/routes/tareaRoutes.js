import { Router } from "express";
const router = Router();
import {
  index,
  create,
  store,
  edit,
  update,
  destroy,
} from "../controllers/tareaController.js";

router.get("/", index);
router.get("/nueva", create);
router.post("/", store);
router.get("/:id/editar", edit);
router.put("/:id", update);
router.delete("/:id", destroy);

export default router;
