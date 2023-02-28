# Generate Git Commits

A command-line tool that generates GitHub or GitLab activity graph to make it look like you have been coding regularly.

<img src="https://dl.dropboxusercontent.com/s/q2iinti6v0zbhzs/contributions.gif?dl=0" alt="How it works" />

## How To Use

1. Make sure you have [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) and
   [Node.js](https://nodejs.org/en/download/) installed on your machine.
2. Generate your commits:
   ```shell script
   npx fake-git-history
   ```
   This command creates a my-history folder, initializes git, and generates commits for every day within the last year (0-3 commits per day).
3. Create [a private repository](https://github.com/new) called `my-history` in your GitHub or GitLab, and push the changes:
   and push the changes:
   ```shell script
   cd my-history
   git remote add origin git@github.com:<USERNAME>/my-history.git
   git push -u origin master
   ```

Done! Now take a look at your GitHub profile 😉

## Support This Project

If you rely on this tool and find it useful, please consider supporting it. Maintaining an open source project takes time and a cup of coffee would be greatly appreciated!

<a href="https://www.buymeacoffee.com/artiebits" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>

## Customizations

### `--commitsPerDay`

Specify the number of commits to be created for each day.
The default value is `0,3`, which means it will randomly generate from 0 to 3 commits per day. For example, to generate commits randomly between 0 and 5 per day, you can do:

```shell script
npx fake-git-history --commitsPerDay "0,5"
```

### `--workdaysOnly`

Use this option if you don't want to commit on weekends. Example:

```shell script
npx fake-git-history --workdaysOnly
```

### `--startDate` and `--endDate`

By default, the script generates GitHub commits for every day within the last year.
However, if you want to generate activity for specific dates, use these options:

```shell script
npx fake-git-history --startDate "2020/09/01" --endDate "2020/09/30"
```

## PS

This tool was created as a joke, so please don't take it seriously. While cheating is never encouraged, if someone is judging your professional skills based on your GitHub activity graph, they deserve to see a rich activity graph 🤓
