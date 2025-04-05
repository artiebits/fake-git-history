const chalk = require("chalk");
const {
  format,
  getDay,
  getMonth,
  getYear,
  addDays,
  differenceInDays,
  isSameDay,
  isWeekend
} = require("date-fns");

/**
 * Generate an ASCII visualization of the git activity graph
 * @param {Date[]} commitDates - Array of commit dates
 * @param {Date} startDate - Start date of the visualization
 * @param {Date} endDate - End date of the visualization
 * @returns {string} ASCII representation of the activity graph
 */
function generateActivityVisualization(commitDates, startDate, endDate) {
  // Group commits by day
  const commitsByDay = {};
  commitDates.forEach(date => {
    const dateKey = format(date, "YYYY-MM-DD");
    if (!commitsByDay[dateKey]) {
      commitsByDay[dateKey] = 0;
    }
    commitsByDay[dateKey]++;
  });

  // Generate array of all days in the interval
  const days = [];
  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    days.push(new Date(currentDate));
    currentDate = addDays(currentDate, 1);
  }

  // Find max commits in a day for scaling
  let maxCommitsInDay = 0;
  days.forEach(day => {
    const dateKey = format(day, "YYYY-MM-DD");
    const count = commitsByDay[dateKey] || 0;
    if (count > maxCommitsInDay) {
      maxCommitsInDay = count;
    }
  });

  // Calculate how many weeks we need to display
  const totalWeeks = Math.ceil(days.length / 7);

  // Create a more GitHub-like visualization
  const result = [];

  // Add a title
  result.push(chalk.bold.green("GitHub Contribution Graph Simulation"));
  result.push("");

  // Create month labels row
  let monthRow = "     "; // Space for day labels
  let currentMonth = -1;
  let monthLabelPositions = [];

  days.forEach((day, index) => {
    const month = getMonth(day);
    const weekIndex = Math.floor(index / 7);

    if (month !== currentMonth) {
      currentMonth = month;
      const monthName = format(day, "MMM");
      monthLabelPositions.push({ week: weekIndex, name: monthName });
    }
  });

  // Place month names at appropriate positions
  for (let week = 0; week < totalWeeks; week++) {
    const monthLabel = monthLabelPositions.find(m => m.week === week);
    if (monthLabel) {
      monthRow += chalk.bold(monthLabel.name) + " ";
      // Add spaces to align with the next month or fill to the end
      const nextMonthWeek =
        monthLabelPositions.find(m => m.week > week)?.week || totalWeeks;
      const spacesToAdd = (nextMonthWeek - week - 1) * 2;
      monthRow += " ".repeat(spacesToAdd);
    }
  }
  result.push(monthRow);

  // Create day rows with contribution cells
  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  // GitHub-like intensity blocks (from empty to most filled)
  const intensityBlocks = ["⬜", "🟩", "🟨", "🟧", "🟥"];

  // Organize days by day of week and week number
  const calendar = Array(7)
    .fill()
    .map(() => Array(totalWeeks).fill(null));

  days.forEach((day, index) => {
    const dayOfWeek = getDay(day); // 0 = Sunday, 1 = Monday, etc.
    const week = Math.floor(index / 7);
    calendar[dayOfWeek][week] = day;
  });

  // Generate rows for each day of the week
  for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
    let row = chalk.bold(dayLabels[dayOfWeek]) + " ";

    for (let week = 0; week < totalWeeks; week++) {
      const day = calendar[dayOfWeek][week];

      if (day) {
        const dateKey = format(day, "YYYY-MM-DD");

        // If there are no commits on this day
        if (!commitsByDay[dateKey]) {
          row += "⬜ "; // Empty square
        } else {
          // There are commits on this day
          const commitCount = commitsByDay[dateKey];

          // Calculate intensity level (0-4)
          let intensityLevel = 0;
          if (commitCount > 0) {
            // Scale to 1-4 based on commit count relative to max
            intensityLevel = Math.max(
              1,
              Math.min(4, Math.ceil((commitCount / maxCommitsInDay) * 4))
            );
          }

          // Add the appropriate block for this day
          row += intensityBlocks[intensityLevel] + " ";
        }
      } else {
        row += "  "; // No day in this position
      }
    }
    result.push(row);
  }

  // Add legend
  result.push("");
  result.push(
    chalk.bold("Legend: ") +
      intensityBlocks[0] +
      " No commits  " +
      intensityBlocks[1] +
      " Few  " +
      intensityBlocks[2] +
      " Some  " +
      intensityBlocks[3] +
      " Many  " +
      intensityBlocks[4] +
      " Most"
  );

  // Add statistics
  result.push("");
  result.push(chalk.bold.underline("Statistics"));
  result.push(`• ${chalk.bold("Total commits:")} ${commitDates.length}`);
  result.push(
    `• ${chalk.bold("Date range:")} ${format(
      startDate,
      "YYYY-MM-DD"
    )} to ${format(endDate, "YYYY-MM-DD")}`
  );

  // Get distribution type from command line args
  const distributionArg = process.argv.includes("--distribution")
    ? process.argv[process.argv.indexOf("--distribution") + 1]
    : process.argv.includes("-d")
    ? process.argv[process.argv.indexOf("-d") + 1]
    : "uniform";

  result.push(`• ${chalk.bold("Distribution:")} ${distributionArg}`);

  result.push(`• ${chalk.bold("Max commits in a day:")} ${maxCommitsInDay}`);

  // Add a note about the preview only if we're in preview mode
  if (process.argv.includes("--preview") || process.argv.includes("-p")) {
    result.push("");
    result.push(
      chalk.yellow.bold(
        "Note: This is a preview only. No commits were created."
      )
    );
    result.push(
      chalk.yellow(
        "To generate actual commits, run the command without the --preview flag."
      )
    );
  }

  return result.join("\n");
}

module.exports = {
  generateActivityVisualization
};
