const express = require("express");
const router = express.Router();
const courseController = require("../controllers/CourseController");

router.get("/", courseController.getAllCourses);
router.get(
  "/:courseId/semester/:semesterId",
  courseController.getUnitsByCourseId
);
router.get("/unit/:unitId", courseController.getUnitDetailsById);
router.get("/lesson/:lessonId", courseController.getLessonDetailsById);

router.get("/semester/:semesterNumber", courseController.getSemesterId);
router.get("/:courseNumber", courseController.getCourseId);
router.get("/material/:materialId", courseController.getMaterialById);
module.exports = router;
