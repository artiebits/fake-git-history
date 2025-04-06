const process = require("process");
const { exec } = require("child_process");
const util = require("util");
const { existsSync } = require("fs");
const execAsync = util.promisify(exec);
const {
  parse,
  addDays,
  addYears,
  setHours,
  setMinutes,
  setSeconds,
  getDay
} = require("date-fns");
const chalk = require("chalk");
const ora = require("ora");
const boxen = require("boxen");
// Import visualization function
const generateActivityVisualization = require("./visualization");

module.exports = function({
  commitsPerDay,
  frequency,
  startDate,
  endDate,
  distribution,
  preview
}) {
  // Parse dates once to avoid inconsistencies
  const startDateObj = startDate ? parse(startDate) : addYears(new Date(), -1);
  const endDateObj = endDate ? parse(endDate) : new Date();

  const commitDateList = createCommitDateList({
    commitsPerDay: commitsPerDay.split(","),
    frequency,
    startDate: startDateObj,
    endDate: endDateObj,
    distribution: distribution || "uniform"
  });

  // If preview mode is enabled, just show the visualization and exit
  if (preview) {
    console.log(
      generateActivityVisualization(commitDateList, startDateObj, endDateObj)
    );
    return;
  }

  (async function() {
    const spinner = ora("Generating your GitHub activity\n").start();

    const historyFolder = "my-history";

    // Remove git history folder in case if it already exists.
    if (existsSync(`./${historyFolder}`)) {
      await execAsync(
        `${
          process.platform === "win32" ? "rmdir /s /q" : "rm -rf"
        } ${historyFolder}`
      );
    }

    // Create git history folder.
    await execAsync(`mkdir ${historyFolder}`);
    process.chdir(historyFolder);
    await execAsync(`git init`);

    // Create commits.
    for (const date of commitDateList) {
      // Change spinner so user can get the progress right now.
      const dateFormatted = new Intl.DateTimeFormat("en", {
        day: "numeric",
        month: "long",
        year: "numeric"
      }).format(date);
      spinner.text = `Generating your Github activity... (${dateFormatted})\n`;

      await execAsync(`echo "${date}" > foo.txt`);
      await execAsync(`git add .`);
      await execAsync(`git commit --quiet --date "${date}" -m "fake commit"`);
    }

    spinner.succeed();

    // Show visualization of the created commits
    console.log(chalk.bold("\nActivity Graph:\n"));
    console.log(
      generateActivityVisualization(commitDateList, startDateObj, endDateObj)
    );

    console.log(
      boxen(
        `${chalk.yellow.bold(
          "If you rely on this tool, please consider buying me a cup of coffee, "
        )}\n` +
          `${chalk.yellow.bold("I would appreciate it!")}\n\n` +
          `${chalk.blueBright.bold("https://www.buymeacoffee.com/artiebits")}`,
        {
          borderColor: "yellow",
          padding: 1,
          align: "center",
          borderStyle: "double",
          margin: 1
        }
      )
    );
  })();
};

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Normal distribution (Bell curve) using Box-Muller transform
function normalRandom(mean, stdDev) {
  let u = 0,
    v = 0;
  while (u === 0) u = Math.random(); // Converting [0,1) to (0,1)
  while (v === 0) v = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  // Transform to the desired mean and standard deviation
  return Math.round(z * stdDev + mean);
}

// Work hours pattern - more commits on weekdays (especially Tue-Thu) during work hours
function workHoursPattern(date, minCommits, maxCommits) {
  const day = getDay(date); // 0 is Sunday, 1 is Monday, etc.

  // Weekday multipliers - Tuesday(2), Wednesday(3), Thursday(4) have higher activity
  // Weekend days have very low activity
  const dayMultipliers = [0.1, 0.8, 1.2, 1.3, 1.2, 0.7, 0.1]; // Sun-Sat

  // Calculate a base number of commits based on the day of the week
  const avgCommits = (parseInt(minCommits) + parseInt(maxCommits)) / 2;
  const adjustedMean = avgCommits * dayMultipliers[day];

  // Use normal distribution around the adjusted mean
  const stdDev = (maxCommits - minCommits) / 4; // Reasonable standard deviation
  let commits = normalRandom(adjustedMean, stdDev);

  // Ensure commits are within the specified range
  commits = Math.max(
    parseInt(minCommits),
    Math.min(parseInt(maxCommits), commits)
  );
  return commits;
}

// After work pattern - more commits on evenings and weekends
function afterWorkPattern(date, minCommits, maxCommits) {
  const day = getDay(date); // 0 is Sunday, 1 is Monday, etc.

  // Weekday multipliers - weekends have higher activity
  const dayMultipliers = [1.3, 0.6, 0.5, 0.5, 0.7, 0.9, 1.4]; // Sun-Sat

  // Calculate a base number of commits based on the day of the week
  const avgCommits = (parseInt(minCommits) + parseInt(maxCommits)) / 2;
  const adjustedMean = avgCommits * dayMultipliers[day];

  // Use normal distribution around the adjusted mean
  const stdDev = (maxCommits - minCommits) / 4; // Reasonable standard deviation
  let commits = normalRandom(adjustedMean, stdDev);

  // Ensure commits are within the specified range
  commits = Math.max(
    parseInt(minCommits),
    Math.min(parseInt(maxCommits), commits)
  );
  return commits;
}

// Get number of commits based on the selected distribution
function getCommitsForDay(date, commitsPerDay, distribution) {
  const [min, max] = commitsPerDay.map(Number);

  switch (distribution) {
    case "workHours":
      return workHoursPattern(date, min, max);

    case "afterWork":
      return afterWorkPattern(date, min, max);

    case "uniform":
    default:
      return getRandomIntInclusive(min, max);
  }
}

function createCommitDateList({
  commitsPerDay,
  frequency = 100,
  startDate,
  endDate,
  distribution
}) {
  const commitDateList = [];
  let currentDate = startDate;

  while (currentDate <= endDate) {
    // Apply frequency - randomly skip some days based on the frequency percentage
    if (Math.random() * 100 <= frequency) {
      // Get number of commits for this day based on the selected distribution
      let n = getCommitsForDay(currentDate, commitsPerDay, distribution);

      for (let i = 0; i < n; i++) {
        // Create a time distribution based on the selected pattern
        let hour;

        if (distribution === "workHours") {
          // Work hours distribution: more commits during 9am-5pm
          const hourDistribution = [
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            1,
            3,
            8,
            12,
            15, // 0-11
            15,
            14,
            12,
            10,
            8,
            5,
            2,
            1,
            0,
            0,
            0,
            0 // 12-23
          ];

          // Weighted random selection of hour
          const totalWeight = hourDistribution.reduce(
            (sum, weight) => sum + weight,
            0
          );
          let random = Math.random() * totalWeight;

          for (hour = 0; hour < 24; hour++) {
            random -= hourDistribution[hour];
            if (random <= 0) break;
          }
        } else if (distribution === "afterWork") {
          // After work hours distribution: more commits in evenings and early morning
          const hourDistribution = [
            3,
            2,
            1,
            0,
            0,
            0,
            1,
            2,
            2,
            2,
            1,
            1, // 0-11
            1,
            1,
            1,
            2,
            3,
            5,
            10,
            15,
            18,
            15,
            10,
            5 // 12-23
          ];

          // Weighted random selection of hour
          const totalWeight = hourDistribution.reduce(
            (sum, weight) => sum + weight,
            0
          );
          let random = Math.random() * totalWeight;

          for (hour = 0; hour < 24; hour++) {
            random -= hourDistribution[hour];
            if (random <= 0) break;
          }
        } else {
          // More realistic hour distribution: more commits during work hours
          const hourDistribution = [
            1,
            1,
            0,
            0,
            0,
            0,
            1,
            2,
            5,
            8,
            10,
            12, // 0-11
            10,
            15,
            18,
            16,
            12,
            8,
            5,
            3,
            2,
            2,
            1,
            1 // 12-23
          ];

          // Weighted random selection of hour
          const totalWeight = hourDistribution.reduce(
            (sum, weight) => sum + weight,
            0
          );
          let random = Math.random() * totalWeight;

          for (hour = 0; hour < 24; hour++) {
            random -= hourDistribution[hour];
            if (random <= 0) break;
          }
        }

        const dateWithHours = setHours(currentDate, hour);
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
    }
    currentDate = addDays(currentDate, 1);
  }

  return commitDateList;
}
