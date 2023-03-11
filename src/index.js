const process = require("process");
const { exec, spawn } = require("child_process");
const util = require("util");
const { existsSync } = require("fs");
const execAsync = util.promisify(exec);
const {
  parse,
  addDays,
  addYears,
  isWeekend,
  setHours,
  setMinutes,
  setSeconds
} = require("date-fns");
const chalk = require("chalk");
const ora = require("ora");
const boxen = require("boxen");

module.exports = function({
  commitsPerDay,
  workdaysOnly,
  startDate,
  endDate,
  historyFolder,
  regenerate
}) {
  (async function() {
    const spinner = ora("Generating your GitHub activity\n").start();

    // If a git history folder already exists then we should append the dates onto it
    if (existsSync(`./${historyFolder}`)) {
      // If Regenerate is on we should remove the git history folder 
      if(regenerate) {
        await execAsync(`${process.platform === "win32" ? "rmdir /s /q" : "rm -rf"} ${historyFolder}`);
        await execAsync(`mkdir ${historyFolder}`);
        process.chdir(historyFolder);
        await execAsync(`git init`);
      } else {
        process.chdir(historyFolder);
      }
      
      // If there is no start date & regenerate isn't turned on, let's grab the most recent Author Commit date and assign that to our startDate
      if(!startDate && !regenerate) {
        lastCommit = await execAsync(`git log -1 --format=%as`); 
        startDate = parse(lastCommit.stdout)

        if(today() === startDate.getTime()) {
          spinner.succeed();
          console.log(
            boxen(
              `${chalk.green("Success")}: No commits were generated as the most recent commit was today.`,
              { borderColor: "yellow", padding: 1, align: "center" }
            )
          );
          process.exit()
        }
      }

    // If there is not a historyFolder then we should create a history folder and initialize it
    } else {  
      await execAsync(`mkdir ${historyFolder}`);
      process.chdir(historyFolder);
      await execAsync(`git init`);
    }

    const commitDateList = createCommitDateList({
      workdaysOnly,
      commitsPerDay: commitsPerDay.split(","),
      startDate: startDate ? parse(startDate) : addYears(new Date(), -1),
      endDate: endDate ? parse(endDate) : new Date()
    });


    // Create ALL of the commits
    for (const date of commitDateList) {
      // Change spinner so user can get the progress right now.
      const dateFormatted = new Intl.DateTimeFormat("en", {
        day: "numeric",
        month: "long",
        year: "numeric"
      }).format(date);
      spinner.text = `Generating a distinguished github history full of lies... 😈 (${dateFormatted})\n`;

      await execAsync(`echo "${date}" > foo.txt`);
      await execAsync(`git add .`);
      await execAsync(`git commit --quiet --date "${date}" -m "fake commit"`);
    }

    spinner.succeed();

    console.log(
      boxen(
        `${chalk.green("Success")} ${commitDateList.length} commits have been created.
      If you rely on this tool, please consider buying me a cup of coffee. I would appreciate it 
      ${chalk.blueBright("https://www.buymeacoffee.com/artiebits")}`,
        { borderColor: "yellow", padding: 1, align: "center" }
      )
    );
  })();
};

function today() {
  var date = new Date();

  // Get year, month, and day part from the date
  var year = date.toLocaleString("default", { year: "numeric" });
  var month = date.toLocaleString("default", { month: "2-digit" });
  var day = date.toLocaleString("default", { day: "2-digit" });

  // Generate yyyy-mm-dd date string and then process it to epoch time
  return parse(year + "-" + month + "-" + day).getTime();
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createCommitDateList({
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
      const dateWithHours = setHours(currentDate, getRandomIntInclusive(9, 16));
      const dateWithHoursAndMinutes = setMinutes(
        dateWithHours,
        getRandomIntInclusive(0, 59)
      );
      const commitDate = setSeconds(
        dateWithHoursAndMinutes,
        getRandomIntInclusive(0, 59)
      );

      commitDateList.push(commitDate);
    }
    currentDate = addDays(currentDate, 1);
  }

  return commitDateList;
}
