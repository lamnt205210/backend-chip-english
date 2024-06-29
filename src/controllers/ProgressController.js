const ProgressService = require("../services/ProgressService");

const updateGameScore = async (req, res) => {
  try {
    const userId = req.params.userId;
    const gameId = req.params.gameId;
    const lessonId = req.params.lessonId;
    const score = req.body.score;
    const response = await ProgressService.updateGameScore(
      userId,
      gameId,
      lessonId,
      score
    );
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
};
const updateVideoScore = async (req, res) => {
  try {
    const userId = req.params.userId;
    const lessonId = req.params.lessonId;
    const score = req.body.score;
    const response = await ProgressService.updateVideoScore(
      userId,
      lessonId,
      score
    );
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
};
const getCourseProgress = async (req, res) => {
  try {
    const userId = req.params.userId;
    const courseNumber = req.params.courseNumber;
    const response = await ProgressService.getCourseProgress(
      userId,
      courseNumber
    );
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
};
const getUnitProgress = async (req, res) => {
  try {
    const userId = req.params.userId;
    const unitId = req.params.unitId;
    const response = await ProgressService.getUnitProgress(userId, unitId);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
};
const getLessonProgress = async (req, res) => {
  try {
    const userId = req.params.userId;
    const lessonId = req.params.lessonId;
    const response = await ProgressService.getLessonProgress(userId, lessonId);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
};
const getGameProgress = async (req, res) => {
  try {
    const userId = req.params.userId;
    const lessonId = req.params.lessonId;
    const response = await ProgressService.getGameProgress(userId, lessonId);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
};
const getAverageScoreCourse = async (req, res) => {
  try {
    const userId = req.params.userId;
    const courseId = req.params.courseId;

    const response = await ProgressService.getAverageScoreCourse(
      userId,
      courseId
    );
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
};
const getRanking = async (req, res) => {
  try {
    const response = await ProgressService.getRanking();
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
};
module.exports = {
  updateGameScore,
  updateVideoScore,
  getCourseProgress,
  getUnitProgress,
  getLessonProgress,
  getGameProgress,
  getAverageScoreCourse,
  getRanking,
};
