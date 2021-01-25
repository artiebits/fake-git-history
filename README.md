# Fake GitHub Commits

A command-line tool to generate your GitHub activity graph.

Does your profile look like you have stopped coding at all?
No worries, this script will help you!

<img src="https://dl.dropboxusercontent.com/s/q2iinti6v0zbhzs/contributions.gif?dl=0" alt="How it works" />

## How To Use

1. Make sure you have [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) and [Node.js](https://nodejs.org/en/download/) installed on your machine.
2. Create a new repository:
   ```shell script
   mkdir my-history
   cd my-history
   git init
   ```
3. Generate your commits:
   ```shell script
   npx fake-git-history
   ```
   It will generate changes to the file for every day within the last year (0-3 commits per day).
4. Create [a private repository](https://github.com/new) called `my-history`
   and push your fake history to the remote repository:
   ```shell script 
   git remote add origin git@github.com:<USERNAME>/my-history.git 
   git branch -M main
   git push -u origin main
   ```

Done! Go take a look at your GitHub profile 😉

## Customizations

### `--commitsPerDay`

Specify how many commits should be created for every single day.
Default is `0,3` which means it will randomly make from 0 to 3 commits a day. Example:

```shell script
npx fake-git-history --commitsPerDay "0,5"
```

### `--workdaysOnly`

Use it if you don't want to commit on weekends. Example:

```shell script
npx fake-git-history --workdaysOnly
```

### `--startDate` and `--endDate`

By default, the script generates GitHub commits for every day within the last year.
If you want to generate activity for a specific dates, then use these options:

```shell script
npx fake-git-history --startDate "2020/09/01" --endDate "2020/09/30"
```

## PS 

It is something I wrote as a joke, so don't take it seriously. 
I don't encourage people to cheat. But if anybody is judging your professional skills by the graph at your GitHub profile, they deserve to see a rich graph 🤓
