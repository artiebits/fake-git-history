#!/usr/bin/env node

const meow = require("meow");
const fgh = require("./index");

const cli = meow(
  `
    Usage
      $ fake-git-history [options]
 
    Options
      --commitsPerDay, -c Customize the number of commits per day.
      --frequency, -f   Chance (0-100%) of generating commits for a day (default: 80).
      --startDate, -s Start date in yyyy/MM/dd format.
      --endDate, -e End date yyyy/MM/dd format.
      --distribution, -d Distribution pattern for commits:
                         - uniform (default): Evenly distributed random commits
                         - workHours: More commits during work hours (9am-5pm) and on weekdays
                         - afterWork: More commits during evenings and weekends
      --preview, -p Preview the activity graph.
      
    Examples
      $ fake-git-history --commitsPerDay "0,3"
      $ fake-git-history --frequency 80
      $ fake-git-history --startDate yyyy/MM/dd --endDate yyyy/MM/dd
      $ fake-git-history --distribution workHours
      $ fake-git-history --preview
`,
  {
    flags: {
      startDate: {
        type: "string",
        alias: "s"
      },
      endDate: {
        type: "string",
        alias: "e"
      },
      commitsPerDay: {
        type: "string",
        alias: "c",
        default: "0,4"
      },
      frequency: {
        type: "number",
        alias: "f",
        default: 80
      },
      distribution: {
        type: "string",
        alias: "d",
        default: "uniform"
      },
      preview: {
        type: "boolean",
        alias: "p",
        default: false
      }
    }
  }
);

fgh(cli.flags);
