const Teacher = require("../models/course/TeacherModel");
const Course = require("../models/course/CourseModel");
const Unit = require("../models/course/UnitModel");
const Lesson = require("../models/course/LessonModel");
const Semester = require("../models/course/SemesterModel");
const Material = require("../models/course/MaterialModel");
const Game = require("../models/course/GameModel");
const mongoose = require("mongoose");
// const getAllCourses = async () => {
//   try {
//     const courses = await Course.find().populate({
//       path: "teacher",
//       model: "Teacher",
//     });

//     return { courses: courses };
//   } catch (error) {
//     return error;
//   }
// };
const getAllCourses = async () => {
  try {
    const courses = await Course.find().populate("teacher");

    return { courses: courses };
  } catch (error) {
    return error;
  }
};

const getUnitsByCourseId = async (courseId, semesterId) => {
  try {
    const units = await Unit.find({
      courseId,
      semesterId,
    }).populate("courseId");

    return { units: units };
  } catch (error) {
    console.error("Error fetching units:", error);
    return error;
  }
};

const getUnitDetailsById = async (unitId) => {
  try {
    const lessons = await Lesson.find({ unitId: unitId }).populate("unitId");

    return { lessons: lessons };
  } catch (error) {
    return error;
  }
};
const getLessonDetailsById = async (lessonId) => {
  try {
    console.log(lessonId);
    const lesson = await Lesson.findById(lessonId).populate("games");
    return lesson;
  } catch (error) {
    return error;
  }
};
const getSemesterId = async (semesterNumber) => {
  try {
    const semester = await Semester.findOne({ semesterNumber: semesterNumber });
    return semester._id;
  } catch (error) {
    return error;
  }
};
const getCourseId = async (courseNumber) => {
  try {
    const course = await Course.findOne({ courseNumber: courseNumber });
    return course._id;
  } catch (error) {
    return error;
  }
};
const getMaterialById = async (materialId) => {
  try {
    const material = await Material.findById(materialId);
    return material;
  } catch (error) {
    return error;
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
