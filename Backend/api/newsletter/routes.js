const express = require("express");
const { subscribe, confirm } = require("./controller");

const router = express.Router();

router.post("/subscribe", subscribe);
router.post("/", subscribe);
router.get("/confirm/:token", confirm);

module.exports = router;

