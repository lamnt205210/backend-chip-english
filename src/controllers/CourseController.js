const CourseService = require("../services/CourseService");

const getAllCourses = async (req, res) => {
  try {
    const response = await CourseService.getAllCourses();
    console.log(response);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
};

const getUnitsByCourseId = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const semesterId = req.params.semesterId;

    const response = await CourseService.getUnitsByCourseId(
      courseId,
      semesterId
    );

    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
};
const getUnitDetailsById = async (req, res) => {
  try {
    const unitId = req.params.unitId;
    const response = await CourseService.getUnitDetailsById(unitId);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
};

const getLessonDetailsById = async (req, res) => {
  try {
    const lessonId = req.params.lessonId;

    const response = await CourseService.getLessonDetailsById(lessonId);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
};
const getSemesterId = async (req, res) => {
  try {
    const semesterNumber = req.params.semesterNumber;
    const response = await CourseService.getSemesterId(semesterNumber);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
};
const getCourseId = async (req, res) => {
  try {
    const courseNumber = req.params.courseNumber;
    const response = await CourseService.getCourseId(courseNumber);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
};
const getMaterialById = async (req, res) => {
  try {
    const materialId = req.params.materialId;
    const response = await CourseService.getMaterialById(materialId);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
};
module.exports = {
  getAllCourses,
  getUnitsByCourseId,
  getUnitDetailsById,
  getLessonDetailsById,
  getSemesterId,
  getCourseId,
  getMaterialById,
};
