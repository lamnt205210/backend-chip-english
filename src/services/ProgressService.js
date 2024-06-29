const mongoose = require("mongoose");
const GameProgress = require("../models/statistic/GameProgress");
const LessonProgress = require("../models/statistic/LessonProgress");
const UnitProgress = require("../models/statistic/UnitProgress");
const CourseProgress = require("../models/statistic/CourseProgress");

const Lesson = require("../models/course/LessonModel");
const Unit = require("../models/course/UnitModel");
const Course = require("../models/course/CourseModel");
const User = require("../models/user/BaseUserModel");
const findIdsByLessonId = async (lessonId) => {
  try {
    // Find the lesson
    const lesson = await Lesson.findById(lessonId).exec();
    if (!lesson) {
      throw new Error(`No lesson found with lessonId: ${lessonId}`);
    }
    const unitId = lesson.unitId;

    const unit = await Unit.findById(unitId).exec();
    if (!unit) {
      throw new Error(`No unit found with unitId: ${unitId}`);
    }
    const courseId = unit.courseId;
    // Find the course containing the unit
    const course = await Course.findById(courseId).exec();

    if (!course) {
      throw new Error(`No course found with courseId: ${courseId}`);
    }
    return {
      unitId: unit._id,
      courseId: course._id,
    };
  } catch (error) {
    return error;
  }
};
const updateGameScore = async (userId, gameId, lessonId, score) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // Update game score
    await GameProgress.updateOne(
      { userId: userId, gameId: gameId },
      { $set: { score } },
      { upsert: true, session }
    );
    console.log("userId", userId);
    console.log("lessonId", lessonId);

    // Recalculate lesson progress
    const lessonProgress = await LessonProgress.findOne({
      userId: userId,
      lessonId: lessonId,
    }).session(session);
    if (!lessonProgress) throw new Error("Lesson progress not found");
    const videoScore = lessonProgress.videoScore;

    const gamesData = await Lesson.findById(lessonId)
      .select("games")
      .session(session);
    const gameIds = gamesData.games;

    const gameProgressDocs = await GameProgress.find({
      gameId: { $in: gameIds },
      userId: userId,
    }).session(session);

    //
    const gamesTotalScore = gameProgressDocs.reduce(
      (acc, game) => acc + (game.score || 0),
      0
    );

    const totalScore = videoScore + gamesTotalScore;

    const videoCompleted = lessonProgress.videoScore !== 0 ? 1 : 0;
    const gameCompleted = gameProgressDocs.some((game) => game.score !== 0)
      ? 1
      : 0;
    // Prevent NaN in the completed calculation
    let completed = 0;
    // if (gameProgressDocs.length > 0) {
    completed = Math.floor(
      ((videoCompleted + gameCompleted) / (1 + gameProgressDocs.length)) * 100
    );
    // }
    if (isNaN(completed) || isNaN(totalScore)) {
      throw new Error("Calculated values are NaN");
    }

    await LessonProgress.updateOne(
      { userId: userId, lessonId: lessonId },
      { $set: { completed, totalScore } },
      { upsert: true, session }
    );
    const { unitId, courseId } = await findIdsByLessonId(lessonId);
    // Recalculate unit progress
    const lessonsOfUnit = await Lesson.find({ unitId: unitId })
      .select("_id")
      .session(session);
    const lessonIds = lessonsOfUnit.map((lesson) => lesson._id);

    const lessonProgressDocs = await LessonProgress.find({
      lessonId: { $in: lessonIds },
      userId: userId,
    }).session(session);

    let unitCompleted = 0;
    if (lessonProgressDocs.length > 0) {
      unitCompleted = Math.floor(
        lessonProgressDocs.reduce((acc, lesson) => acc + lesson.completed, 0) /
          lessonProgressDocs.length
      );
    }

    await UnitProgress.updateOne(
      { userId: userId, unitId: unitId },
      { $set: { completed: unitCompleted } },
      { session }
    );

    // Recalculate course progress
    const unitsOfCourse = await Unit.find({ courseId: courseId })
      .select("_id")
      .session(session);
    const unitIds = unitsOfCourse.map((unit) => unit._id);
    const unitProgressDocs = await UnitProgress.find({
      unitId: { $in: unitIds },
      userId: userId,
    }).session(session);
    let courseCompleted = 0;
    if (unitProgressDocs.length > 0) {
      courseCompleted = Math.floor(
        unitProgressDocs.reduce((acc, unit) => acc + unit.completed, 0) /
          unitProgressDocs.length
      );
    }
    await CourseProgress.updateOne(
      { userId: userId, courseId: courseId },
      { $set: { completed: courseCompleted } },
      { session }
    );
    await session.commitTransaction();
    session.endSession();
    return { status: "OK", message: "Score updated" };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return { status: "ERR", message: error.message };
  }
};

const updateVideoScore = async (userId, lessonId, score) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // Update video score
    await LessonProgress.updateOne(
      { userId: userId, lessonId: lessonId },
      { $set: { videoScore: score } },
      { upsert: true, session }
    );

    // Recalculate lesson progress
    const lessonProgress = await LessonProgress.findOne({
      userId: userId,
      lessonId: lessonId,
    }).session(session);
    if (!lessonProgress) throw new Error("Lesson progress not found");

    const videoScore = lessonProgress.videoScore;

    const gamesData = await Lesson.findById(lessonId)
      .select("games")
      .session(session);
    const gameIds = gamesData.games;

    const gameProgressDocs = await GameProgress.find({
      gameId: { $in: gameIds },
      userId: userId,
    }).session(session);

    //
    const gamesTotalScore = gameProgressDocs.reduce(
      (acc, game) => acc + (game.score || 0),
      0
    );

    const totalScore = videoScore + gamesTotalScore;
    console.log("totalScore", totalScore);
    console.log("videoScore", videoScore);
    const videoCompleted = lessonProgress.videoScore !== 0 ? 1 : 0;
    const gameCompleted = gameProgressDocs.some((game) => game.score !== 0)
      ? 1
      : 0;
    console.log("videoCompleted", videoCompleted);
    console.log("gameCompleted", gameCompleted);
    // Prevent NaN in the completed calculation
    let completed = 0;

    completed = Math.floor(
      ((videoCompleted + gameCompleted) / (1 + gameProgressDocs.length)) * 100
    );

    if (isNaN(completed) || isNaN(totalScore)) {
      throw new Error("Calculated values are NaN");
    }
    console.log("completed", completed);
    await LessonProgress.updateOne(
      { userId: userId, lessonId: lessonId },
      { $set: { completed, totalScore } },
      { upsert: true, session }
    );
    const { unitId, courseId } = await findIdsByLessonId(lessonId);
    // Recalculate unit progress
    const lessonsOfUnit = await Lesson.find({ unitId: unitId })
      .select("_id")
      .session(session);
    const lessonIds = lessonsOfUnit.map((lesson) => lesson._id);

    const lessonProgressDocs = await LessonProgress.find({
      lessonId: { $in: lessonIds },
      userId: userId,
    }).session(session);
    let unitCompleted = 0;
    if (lessonProgressDocs.length > 0) {
      unitCompleted = Math.floor(
        lessonProgressDocs.reduce((acc, lesson) => acc + lesson.completed, 0) /
          lessonProgressDocs.length
      );
    }
    await UnitProgress.updateOne(
      { userId: userId, unitId: unitId },
      { $set: { completed: unitCompleted } },
      { session }
    );
    // Recalculate course progress
    const unitsOfCourse = await Unit.find({ courseId: courseId })
      .select("_id")
      .session(session);
    const unitIds = unitsOfCourse.map((unit) => unit._id);
    const unitProgressDocs = await UnitProgress.find({
      unitId: { $in: unitIds },
      userId: userId,
    }).session(session);
    let courseCompleted = 0;
    if (unitProgressDocs.length > 0) {
      courseCompleted = Math.floor(
        unitProgressDocs.reduce((acc, unit) => acc + unit.completed, 0) /
          unitProgressDocs.length
      );
    }
    await CourseProgress.updateOne(
      { userId: userId, courseId: courseId },
      { $set: { completed: courseCompleted } },
      { session }
    );

    await session.commitTransaction();
    session.endSession();
    return { status: "OK", message: "Score updated" };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return { status: "ERR", message: error.message };
  }
};
const getCourseProgress = async (userId, courseNumber) => {
  try {
    const course = await Course.findOne({ courseNumber: courseNumber });
    const courseId = course._id;

    const courseProgress = await CourseProgress.findOne({
      userId: userId,
      courseId: courseId,
    });
    return courseProgress;
  } catch (error) {
    return error;
  }
};
const getUnitProgress = async (userId, unitId) => {
  try {
    const unitProgress = await UnitProgress.findOne({
      userId: userId,
      unitId: unitId,
    });
    return unitProgress;
  } catch (error) {
    return error;
  }
};
const getLessonProgress = async (userId, lessonId) => {
  try {
    const lessonProgress = await LessonProgress.findOne({
      userId: userId,
      lessonId: lessonId,
    });
    return lessonProgress;
  } catch (error) {
    return error;
  }
};
const getGameProgress = async (userId, lessonId) => {
  try {
    const lesson = await Lesson.findById(lessonId).exec();
    const gameIds = lesson.games;
    const gameProgress = await GameProgress.find({
      userId: userId,
      gameId: { $in: gameIds },
    });

    console.log("gameProgress", gameProgress);
    return gameProgress;
  } catch (error) {
    return error;
  }
};
const getAverageScoreCourse = async (userId, courseId) => {
  try {
    const course = await Course.findOne({ courseNumber: courseId });
    let count = 0;
    let total = 0;
    const units = await Unit.find({
      courseId: course._id,
    });

    for (const unit of units) {
      const lessons = await Lesson.find({
        unitId: unit._id,
      });
      for (const lesson of lessons) {
        const lessonProgress = await LessonProgress.findOne({
          lessonId: lesson._id,
          userId: userId,
        });

        if (lessonProgress && lessonProgress.completed > 0) {
          count++;
          const lessonAve =
            (lessonProgress.totalScore * 10000) /
            (lessonProgress.maximumScore * lessonProgress.completed);
          total += lessonAve;
        }
      }
    }

    if (count === 0) return 0;
    const courseAve = total / count;
    return courseAve;
  } catch (error) {
    return error;
  }
};
const getRanking = async () => {
  try {
    const users = await User.find();

    const usersWithRankingPoints = await Promise.all(
      users.map(async (user) => {
        let rankingPoint = 0;
        const lessonProgresses = await LessonProgress.find({
          userId: user._id,
        });

        for (const lessonProgress of lessonProgresses) {
          rankingPoint += lessonProgress.totalScore;
        }

        return {
          userName: user.userName || user.displayName || user.email,
          userId: user._id,
          rankingPoint: rankingPoint,
        };
      })
    );
    usersWithRankingPoints.sort((a, b) => b.rankingPoint - a.rankingPoint);
    return usersWithRankingPoints;
  } catch (error) {
    console.error(error);
    return error;
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
