const util = require("util");
const { exec } = require("child_process");
const execAsync = util.promisify(exec);
const {
  parse,
  addDays,
  addYears,
  isWeekend,
  setHours,
  setMinutes
} = require("date-fns");
const chalk = require("chalk");
const ora = require("ora");
const boxen = require("boxen");

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = function(props) {
  const filename = "foo.txt";

  const commitDateList = generateCommitDateList({
    workdaysOnly: props.workdaysOnly,
    commitsPerDay: props.commitsPerDay.split(","),
    startDate: props.startDate
      ? parse(props.startDate)
      : addYears(new Date(), -1),
    endDate: props.endDate ? parse(props.endDate) : new Date()
  });

  (async function generateHistory() {
    const spinner = ora("Generating your GitHub activity\n").start();

    for (const date of commitDateList) {
      await execAsync(`echo "${date}" > ${filename}`);
      await execAsync(`git add .`);
      await execAsync(`git commit --quiet --date "${date}" -m "fake commit"`);
    }

    spinner.succeed();

    console.log(
      boxen(
        `${chalk.green("Success")} ${
          commitDateList.length
        } commits have been created.
      If you rely on this tool, please consider buying me a cup of coffee. I would appreciate it 
      ${chalk.blueBright("https://www.buymeacoffee.com/artiebits")}`,
        { borderColor: "yellow", padding: 1, align: "center" }
      )
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
};
