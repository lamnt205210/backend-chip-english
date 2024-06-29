const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const routes = require("./src/routes");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const LessonProgress = require("./src/models/statistic/LessonProgress");
const Lesson = require("./src/models/course/LessonModel");
require("./passport");

dotenv.config({ path: "./config.env" });
app.use(
  cors({
    origin: "*",
  })
);

app.use(bodyParser.json());
app.use(cookieParser());
routes(app);

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

// mongoose
//   .connect(DB)
//   .then((con) => {
//     // console.log(con.connections);
//     console.log("DB connection successful");
//   })
//   .catch((err) => {
//     console.log(err);
//   });

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("DB connection successful");
    // await LessonProgress.deleteMany();

    const lessons = await Lesson.find();
    for (const lesson of lessons) {
      const maximumScore =
        ((lesson.videoURL ? 1 : 0) + lesson.games.length) * 100;
      await LessonProgress.updateMany(
        { lessonId: lesson._id },
        { $set: { maximumScore } }
      );
    }
  });

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
