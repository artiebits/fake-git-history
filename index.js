const util = require("util");
const { exec, execSync } = require("child_process");
const execAsync = util.promisify(exec);
const {
  parse,
  compareAsc,
  addDays,
  isWeekend,
  setHours,
  setMinutes
} = require("date-fns");
const chalk = require("chalk");
const ora = require("ora");

module.exports = function({ startDate, endDate, workdaysOnly, commitsPerDay }) {
  const filename = "foo.txt";

  startDate = parse(startDate);
  endDate = parse(endDate);
  commitsPerDay = commitsPerDay.split(",");

  execSync(`touch ${filename}`);

  const commitDateList = generateCommitDateList({
    commitsPerDay,
    workdaysOnly,
    startDate,
    endDate
  });

  (async function generateHistory() {
    const spinner = ora("generating commit history\n").start();

    const sortedList = commitDateList.sort(compareAsc);

    await sortedList.reduce(async (prevPromise, date) => {
      await prevPromise;

      return execAsync(
        `echo "${date}" > ${filename}; git add ${filename}; git commit --date "${date}" -m "fake commit"`,
        {
          encoding: "utf8"
        }
      );
    }, Promise.resolve());

    spinner.succeed();

    const numberOfCommits = commitDateList.length;
    if (!numberOfCommits) {
      console.log(
        chalk.green(`There is nothing to create. Check your date range.`)
      );
      return;
    }
    console.log(
      chalk.green("success"),
      numberOfCommits,
      "commits have been created."
    );
  })();

  function generateCommitDateList({
    commitsPerDay,
    workdaysOnly,
    startDate,
    endDate
  }) {
    const commitDateList = [];
    let currentDate = startDate;

    while (currentDate <= endDate) {
      if (workdaysOnly && isWeekend(currentDate)) {
        currentDate = addDays(currentDate, 1);
        continue;
      }
      for (let i = 0; i < getRandomIntInclusive(...commitsPerDay); i++) {
        const dateWithHours = setHours(
          currentDate,
          getRandomIntInclusive(9, 16)
        );
        const commitDate = setMinutes(
          dateWithHours,
          getRandomIntInclusive(0, 59)
        );
        commitDateList.push(commitDate);
      }
      currentDate = addDays(currentDate, 1);
    }

    return commitDateList;
  }

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random#Getting_a_random_integer_between_two_values_inclusive
  function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
};
