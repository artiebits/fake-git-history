#!/usr/bin/env node

const meow = require("meow");
const fgh = require("./index");

const cli = meow(
  `
    Usage
      $ fake-git-history [options]
 
    Options
      --startDate, -s Start date in YYYY/MM/DD format.
      --endDate, -e End date in YYYY/MM/DD format.
      --workdaysOnly, -w Skip weekends.
      --commitsPerDay, -c The number of commits to generate per day.
      
    Examples
      $ fake-git-history --startDate <YYYY/MM/DD> --endDate <YYYY/MM/DD>
      $ fake-git-history --commitsPerDay "1,5" -s <YYYY/MM/DD> -e <YYYY/MM/DD>
      $ fake-git-history --workdaysOnly -s <YYYY/MM/DD> -e <YYYY/MM/DD>
`,
  {
    flags: {
      startDate: {
        type: "string",
        alias: "s",
        default: "false"
      },
      endDate: {
        type: "string",
        alias: "e",
        default: "false"
      },
      workdaysOnly: {
        type: "boolean",
        alias: "w",
        default: "false"
      },
      commitsPerDay: {
        type: "string",
        alias: "c",
        default: "0,3"
      }
    }
  }
);

fgh(cli.flags);
