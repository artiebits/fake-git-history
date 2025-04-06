const chalk = require("chalk");
const { format, getDay, differenceInDays, addDays } = require("date-fns");

/**
 * Generate a visualization of the activity graph
 * @param {Array} commitDateList - List of commit dates
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {String} - Visualization of the activity graph
 */
function generateActivityVisualization(commitDateList, startDate, endDate) {
  // Count commits by day
  const commitsByDay = {};
  commitDateList.forEach(date => {
    const dateKey = format(date, "YYYY-MM-DD");
    if (!commitsByDay[dateKey]) {
      commitsByDay[dateKey] = 0;
    }
    commitsByDay[dateKey]++;
  });

  // Get the max number of commits in a day
  let maxCommitsInDay = 0;
  Object.values(commitsByDay).forEach(count => {
    if (count > maxCommitsInDay) {
      maxCommitsInDay = count;
    }
  });

  // Generate a list of all days between start and end date
  const totalDays = differenceInDays(endDate, startDate) + 1;
  const days = [];
  for (let i = 0; i < totalDays; i++) {
    days.push(addDays(startDate, i));
  }

  // Calculate the number of weeks
  const totalWeeks = Math.ceil(totalDays / 7);

  // Track month positions for labels
  const monthLabelPositions = [];
  let currentMonth = null;
  days.forEach((day, index) => {
    const month = format(day, "MMM");
    const week = Math.floor(index / 7);
    if (month !== currentMonth) {
      monthLabelPositions.push({ month, week });
      currentMonth = month;
    }
  });

  // Build the visualization
  const result = [];

  // Add a title
  result.push(
    chalk.bold.green("This is what you will see on your GitHub profile:")
  );
  result.push("");

  // Create month labels row
  let monthRow = "     "; // Space for day labels
  for (let i = 0; i < monthLabelPositions.length; i++) {
    const { month, week } = monthLabelPositions[i];

    // Add the month label
    monthRow += month;

    if (i < monthLabelPositions.length - 1) {
      // Add spaces to align with the next month or fill to the end
      const nextMonthWeek =
        monthLabelPositions.find(m => m.week > week)?.week || totalWeeks;
      const spacesToAdd = (nextMonthWeek - week - 1) * 1.7;
      monthRow += " ".repeat(spacesToAdd);
    }
  }
  result.push(monthRow);

  // Create day rows with contribution cells
  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // GitHub-like intensity blocks using Unicode characters
  const intensityBlocks = [
    chalk.hex("#fdfdfd")("■"), // Empty/no commits (white square)
    chalk.hex("#7feebb")("■"), // Few commits (light green)
    chalk.hex("#4ac26b")("■"), // Some commits (medium green)
    chalk.hex("#2da44e")("■"), // Many commits (darker green)
    chalk.hex("#116329")("■") // Most commits (darkest green)
  ];

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
          row += intensityBlocks[0] + " "; // No activity square
        } else {
          // There are commits on this day
          const commitCount = commitsByDay[dateKey];

          // Calculate intensity level (0-4)
          const intensity = Math.min(
            Math.ceil((commitCount / maxCommitsInDay) * 4),
            4
          );
          row += intensityBlocks[intensity] + " ";
        }
      } else {
        row += "  "; // No day (outside the date range)
      }
    }
    result.push(row);
  }

  result.push("");
  // Add a legend
  result.push(
    `Legend: ${intensityBlocks[0]} No commits  ${intensityBlocks[1]} Few  ${intensityBlocks[2]} Some  ${intensityBlocks[3]} Many  ${intensityBlocks[4]} Most`
  );
  result.push("");

  // Add statistics
  result.push("Statistics");
  result.push(`• Total commits: ${commitDateList.length}`);
  result.push(
    `• Date range: ${format(startDate, "YYYY-MM-DD")} to ${format(
      endDate,
      "YYYY-MM-DD"
    )}`
  );
  result.push(`• Distribution: ${process.env.DISTRIBUTION || "uniform"}`);
  result.push(`• Max commits in a day: ${maxCommitsInDay}`);

  if (process.env.PREVIEW) {
    result.push("");
    result.push(
      chalk.italic("Note: This is a preview only. No commits were created.")
    );
    result.push(
      chalk.italic(
        "To generate actual commits, run the command without the --preview flag."
      )
    );
  }

  return result.join("\n");
}

module.exports = generateActivityVisualization;
