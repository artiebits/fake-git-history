const util = require("util");
const { exec, execSync } = require("child_process");
const execAsync = util.promisify(exec);
const {
  parse,
  compareAsc,
  addDays,
  addYears,
  isWeekend,
  setHours,
  setMinutes
} = require("date-fns");
const chalk = require("chalk");
const ora = require("ora");
const boxen = require("boxen");

module.exports = function(props) {
  const filename = "foo.txt";

  execSync(`touch ${filename}`);

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

    const sortedList = commitDateList.sort(compareAsc);

    const command = sortedList
      .map(date => {
        return `echo "${date}" > ${filename}; git add ${filename}; git commit --date "${date}" -m "fake commit"`;
      })
      .join(";");

    await execAsync(command, { encoding: "utf8" });

    spinner.succeed();

    const successMessage = boxen(
      `${chalk.green("Success")} ${
        commitDateList.length
      } commits have been created.
      Enjoy using this tool? I would appreciate it if you buy me a cup of coffee 
      ${chalk.blueBright("https://www.buymeacoffee.com/artiebits")}`,
      { borderColor: "yellow", padding: 1, align: "center" }
    );
    console.log(successMessage);
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

  function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
};
