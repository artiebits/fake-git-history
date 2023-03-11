#!/usr/bin/env node

const meow = require("meow");
const fgh = require("./index");

const cli = meow(
  `
    Usage
      $ fake-git-history [options]
 
    Options
      --workdaysOnly, -w Use this option if you don't want to commit on weekends.
      --commitsPerDay, -c Customize how many commits a day to make.
      --startDate, -s Start date in yyyy/MM/dd format.
      --endDate, -e End date yyyy/MM/dd format.
      --historyFolder, -h Use this option to override the default folder
      --regenerate, -r Use this option to regenerate a folder where there already exists a git history
      
    Examples
      $ fake-git-history --workdaysOnly
      $ fake-git-history --commitsPerDay "0,3"
      $ fake-git-history --startDate yyyy/MM/dd --endDate yyyy/MM/dd
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
      workdaysOnly: {
        type: "boolean",
        alias: "w",
        default: "false"
      },
      commitsPerDay: {
        type: "string",
        alias: "c",
        default: "0,3"
      },
      historyFolder: {
        type: "string",
        alias: "h",
        default: "fake-history"
      },
      regenerate: {
        type: "boolean",
        alias: "r",
        default: "false"
      }
    }
  }
);

fgh(cli.flags);
