const mongoose = require("mongoose");
const Course = require("../models/course/CourseModel");
const Unit = require("../models/course/UnitModel");
const Lesson = require("../models/course/LessonModel");
const CourseProgress = require("../models/statistic/CourseProgress");
const UnitProgress = require("../models/statistic/UnitProgress");
const LessonProgress = require("../models/statistic/LessonProgress");
const GameProgress = require("../models/statistic/GameProgress");

const initializeProgress = async (userId) => {
  const courses = await Course.find();
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    for (const course of courses) {
      await CourseProgress.create(
        [{ userId: userId, courseId: course._id, completed: 0 }],
        { session }
      );
      const units = await Unit.find({ courseId: course._id }).session(session);
      for (const unit of units) {
        await UnitProgress.create(
          [{ userId: userId, unitId: unit._id, completed: 0 }],
          { session }
        );
        const lessons = await Lesson.find({ unitId: unit._id }).session(
          session
        );
        for (const lesson of lessons) {
          const gamesCount = lesson.games.length;
          const maximumScore = 100 * (1 + gamesCount);

          // Initialize game scores
          for (const game of lesson.games) {
            await GameProgress.create(
              [{ userId: userId, gameId: game._id, score: 0 }],
              { session }
            );
          }

          await LessonProgress.create(
            [
              {
                userId: userId,
                lessonId: lesson._id,
                completed: 0,
                videoScore: 0,
                totalScore: 0,
                maximumScore,
              },
            ],
            { session }
          );
        }
      }
    }

    await session.commitTransaction();
    session.endSession();
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
module.exports = { initializeProgress };
