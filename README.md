# Fake commit history

A command-line tool to generate your git activity ¯\\_(ツ)_/¯.

Does your profile look like you have stopped coding at all? 
No worries, this script will help you!

<img src="https://dl.dropboxusercontent.com/s/q2iinti6v0zbhzs/contributions.gif?dl=0" alt="How it works" />

## Installation

Make sure you have [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) and [Node.js](https://nodejs.org/en/download/) installed on your machine. 
Then install this tool:

```shell script
npm i -g fake-git-history
```

## Usage

```shell script
mkdir my-fake-history
cd my-fake-history
git init

# Generate your commit history.
fake-git-history
```

Then create [a private repository](https://github.com/new) on GitHub,
and follow the instructions to push the history to the remote repository.

```shell script
git remote add origin git@github.com:<USERNAME>/my-fake-history.git
git push -u origin master
```

Done! Go take a look at your contributions graph.

## Customizations

Specify how many commits should be created for every single day. 
Default is `0,3` which means it will randomly make from 0 to 3 commits a day.

```shell script
fake-git-history --commitsPerDay "1,5"
```

Use `--workdaysOnly` if you don't want to commit on weekends.

```shell script
fake-git-history --workdaysOnly
```

## CLI

- `--workdaysOnly` or `-w` Use this option if you don't want to commit on weekends.
- `--commitsPerDay` or `-c` Customize how many commits a day to make.
- `--startDate`, or `-s` Start date in yyyy/MM/dd format.
- `--endDate`, `-e` End date yyyy/MM/dd format.
      
## P.S.

It is something I wrote as a joke, so don't take it seriously. I don't encourage people to cheat. But if anybody is judging your professional skills by the graph at your GitHub profile, they deserve to see a rich graph.

Enjoy using this tool? I would appreciate it if you buy me a coffee.
 
<a href="https://www.buymeacoffee.com/artiebits" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" style="height: 41px !important;width: 174px !important;box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;" ></a>
