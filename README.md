# Fake commit history

A command-line tool to fake your commit history ¯\\_(ツ)_/¯.

Does your profile look like you have stopped coding at all? 
No worries, this CLI is gonna help you!

<img src="https://dl.dropboxusercontent.com/s/q2iinti6v0zbhzs/contributions.gif?dl=0" alt="How it works" />

## Installation

```shell script
yarn global add fake-git-history
```

## Usage

```shell script
mkdir my-fake-history
cd my-fake-history
git init

# Generate commit history for a specific date range.
# The date must be in `YY/MM/DD` format. Example `2019/01/01`
fake-git-history --startDate <YY/MM/DD> --endDate <YY/MM/DD>
```

Then create [a private repository](https://github.com/new) on GitHub,
add follow the instructions to push the history to the remote repository.

```shell script
git remote add origin git@github.com:<USERNAME>/my-fake-history.git
git push -u origin master
```

Done! Go take a look at your contributions graph.

## More examples

Specify how many commits should be created for every single day. 
Default is `0,3` which means it will randomly create from 0 to 3 commit messages for a day.

```shell script
fake-git-history --commitsPerDay "1,5" -s <YY/MM/DD> -e <YY/MM/DD>
```

Generate commit history for weekdays only.

```shell script
fake-git-history --workdaysOnly -s <YY/MM/DD> -e <YY/MM/DD>
```

## CLI

- `--startDate` or `-s` Start date in YY/MM/DD format.
- `--endDate`, `-e` End date in YY/MM/DD format.
- `--workdaysOnly`, `-w` Skip weekends.
- `--commitsPerDay`, `-c` The number of commits to generate for every single day.

## P.S.

It is something I wrote as a joke, so don't take it seriously.
