# Fake commit history

<a href="https://www.buymeacoffee.com/artiebits" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" style="height: 41px !important;width: 174px !important;box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;" ></a>

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
# The date must be in `YYYY/MM/DD` format. Example `2019/01/01`
fake-git-history --startDate <YYYY/MM/DD> --endDate <YYYY/MM/DD>
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
fake-git-history --commitsPerDay "1,5" -s <YYYY/MM/DD> -e <YYYY/MM/DD>
```

Generate commit history for weekdays only.

```shell script
fake-git-history --workdaysOnly -s <YYYY/MM/DD> -e <YYYY/MM/DD>
```

## CLI

- `--startDate` or `-s` Start date in YYYY/MM/DD format.
- `--endDate`, `-e` End date in YYYY/MM/DD format.
- `--workdaysOnly`, `-w` Skip weekends.
- `--commitsPerDay`, `-c` The number of commits to generate for every single day.

## P.S.

It is something I wrote as a joke, so don't take it seriously.
