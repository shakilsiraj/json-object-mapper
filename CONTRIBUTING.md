# Contributing

We would love for you to contribute to this project and help make it even better than it is today!
As a contributor, here are the guidelines we would like you to follow:

 * [Code of Conduct](#coc)
 * [Question or Problem?](#question)
 * [Issues and Bugs](#issue)
 * [Feature Requests](#feature)
 * [Submission Guidelines](#submit)
 * [Coding Rules](#rules)
 * [Commit Message Guidelines](#commit)


## <a name="coc"></a> Code of Conduct

Please read and follow our [Code of Conduct][coc], and help us keep this project open and inclusive.


## <a name="question"></a> Got a Question or Problem ?

Please open an issue and add the `question` label to it.


## <a name="issue"></a> Found a Bug ?

If you find a bug in the source code, you can help us by [submitting an issue](#submit-issue) to our [GitHub Repository][github].

Even better, you can [submit a Pull Request](#submit-pr) with a fix.


## <a name="feature"></a> Missing a Feature ?

You can *request* a new feature by [submitting an issue](#submit-issue) to our [GitHub Repository][github].

If you would like to *implement* a new feature, please consider the size of the change in order to determine the right steps to proceed:

* For a **Major Feature**, first open an issue and outline your proposal so that it can be discussed.
  This process allows us to better coordinate our efforts, prevent duplication of work, and help you to craft the change so that it is successfully accepted into the project.

  **Note**: Adding a new topic to the documentation, or significantly re-writing a topic, counts as a major feature.

* **Small Features** can be crafted and directly [submitted as a Pull Request](#submit-pr).


## <a name="submit"></a> Submission Guidelines

### <a name="submit-issue"></a> Submitting an Issue

Before you submit an issue, please search the issue tracker, maybe an issue for your problem already exists and the discussion might inform you of workarounds readily available.

We want to fix all the issues as soon as possible, but before fixing a bug we need to reproduce and confirm it.
In order to reproduce bugs, we require that you provide a minimal reproduction.
Having a minimal reproducible scenario gives us a wealth of important information without going back and forth to you with additional questions.

A minimal reproduction allows us to quickly confirm a bug (or point out a coding problem) as well as confirm that we are fixing the right problem.

We require a minimal reproduction to save maintainers' time and ultimately be able to fix more bugs.
Often, developers find coding problems themselves while preparing a minimal reproduction.
We understand that sometimes it might be hard to extract essential bits of code from a larger codebase but we really need to isolate the problem before we can fix it.

Unfortunately, we are not able to investigate / fix bugs without a minimal reproduction, so if we don't hear back from you, we are going to close an issue that doesn't have enough info to be reproduced.

You can file new issues by selecting and filling out the issue template from our [new issue templates][issue-templates].


### <a name="submit-pr"></a> Submitting a Pull Request (PR)

Before you submit your Pull Request (PR) consider the following guidelines:

1. Search [GitHub][github-pr] for an open or closed PR that relates to your submission.
   You don't want to duplicate existing efforts.

2. Be sure that an issue describes the problem you're fixing, or documents the design for the feature you'd like to add.
   Discussing the design upfront helps to ensure that we're ready to accept your work.

3. Fork this repository.

4. Make your changes in a new git branch:

     ```sh
     $ git checkout -b my-fix-branch master
     ```

5. Create your patch, **including appropriate test cases**.

6. Follow our [Coding Rules](#rules).

7. Run a full test suite and ensure that all tests pass.

8. Commit your changes using a descriptive commit message that follows our [commit message conventions](#commit).
   Adherence to these conventions is necessary because release notes are automatically generated from these messages.

     ```sh
     $ git commit --all
     ```
    Note: the optional commit `-a` command line option will automatically "add" and "rm" edited files.

9. Push your branch to GitHub:

    ```sh
    $ git push origin my-fix-branch
    ```

10. In GitHub, send a pull request to `develop` branch.

### Reviewing a Pull Request

Pull requests may not be accepted from community members who haven't been good citizens of the community.

Such behavior includes not following the [code of conduct](#coc) and applies within or outside of this repository.

#### Addressing review feedback

If we ask for changes via code reviews then:

1. Make the required updates to the code.

2. Re-run the test suites to ensure tests are still passing.

3. Create a fixup commit and push to your GitHub repository (this will update your Pull Request):

    ```sh
    $ git commit --all --fixup HEAD
    $ git push
    ```

That's it! Thank you for your contribution!

#### Updating the commit message

A reviewer might often suggest changes to a commit message (for example, to add more context for a change or adhere to our [commit message guidelines](#commit)).

In order to update the commit message of the last commit on your branch:

1. Check out your branch:

    ```sh
    $ git checkout my-fix-branch
    ```

2. Amend the last commit and modify the commit message:

    ```sh
    $ git commit --amend
    ```

3. Push to your GitHub repository:

    ```sh
    $ git push --force-with-lease
    ```

> NOTE:<br />
> If you need to update the commit message of an earlier commit, you can use `git rebase` in interactive mode.
> See the [git docs](https://git-scm.com/docs/git-rebase#_interactive_mode) for more details.

#### After your pull request is merged

After your pull request is merged, you can safely delete your branch and pull the changes from the main (upstream) repository:

* Delete the remote branch on GitHub either through the GitHub web UI or your local shell as follows:

    ```sh
    $ git push origin --delete my-fix-branch
    ```

* Check out the master branch:

    ```sh
    $ git checkout master -f
    ```

* Delete the local branch:

    ```sh
    $ git branch -D my-fix-branch
    ```

* Update your master with the latest upstream version:

    ```sh
    $ git pull --ff upstream master
    ```


## <a name="rules"></a> Coding Rules

To ensure consistency throughout the source code, keep these rules in mind as you are working:

* All features or bug fixes **must be tested** by one or more specs (unit-tests)
* All public API methods **must be documented**
* We follow [Google's JavaScript Style Guide][js-style-guide], but wrap all code at **100 characters**


## <a name="commit"></a> Commit Message Format

*This specification is inspired by and supersedes the [Conventional Commits message format][commit-message-format].*

We have very precise rules over how our Git commit messages must be formatted.

This format leads to **easier to read commit history**.

Each commit message consists of a **header**, a **body**, and a **footer**.


```
<header>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

The `header` is mandatory and must conform to the [Commit Message Header](#commit-header) format.

The `body` is mandatory for all commits except for those of type "docs". When the body is present it must be at least 20 characters long and must conform to the [Commit Message Body](#commit-body) format.

The `footer` is optional. The [Commit Message Footer](#commit-footer) format describes what the footer is used for and the structure it must have.

Any line of the commit message cannot be longer than 100 characters.


#### <a name="commit-header"></a> Commit Message Header

```
<type>(<scope>): <short summary>
  │       │             │
  │       │             └─⫸ Summary in present tense. Not capitalized. No period at the end.
  │       │
  │       └─⫸ Commit Scope (optional): provide additional contextual information
  │
  └─⫸ Commit Type: build|ci|docs|feat|fix|perf|refactor|test
```


##### Type

Must be one of the following:

* **build**: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
* **ci**: Changes to CI configuration files and scripts (example scopes: Circle, BrowserStack, SauceLabs)
* **docs**: Documentation only changes
* **feat**: A new feature
* **fix**: A bug fix
* **perf**: A code change that improves performance
* **refactor**: A code change that neither fixes a bug nor adds a feature
* **test**: Adding missing tests or correcting existing tests


##### Scope

Scope can be anything specifying place of the commit change.


##### Summary

Use the summary field to provide a succinct description of the change:

* use the imperative, present tense: "change" not "changed" nor "changes"
* don't capitalize the first letter
* no dot (.) at the end


#### <a name="commit-body"></a> Commit Message Body

Just as in the summary, use the imperative, present tense: "fix" not "fixed" nor "fixes".

Explain the motivation for the change in the commit message body. This commit message should explain _why_ you are making the change.

You can include a comparison of the previous behavior with the new behavior in order to illustrate the impact of the change.


#### <a name="commit-footer"></a> Commit Message Footer

The footer can contain information about breaking changes and is also the place to reference GitHub issues, Jira tickets, and other PRs that this commit closes or is related to.

```
BREAKING CHANGE: <breaking change summary>
<BLANK LINE>
<breaking change description + migration instructions>
<BLANK LINE>
<BLANK LINE>
Fixes #<issue number>
```

Breaking Change section should start with the phrase `BREAKING CHANGE: ` followed by a summary of the breaking change, a blank line, and a detailed description of the breaking change that also includes migration instructions.


### Revert commits

If the commit reverts a previous commit, it should begin with `revert: `, followed by the header of the reverted commit.

The content of the commit message body should contain:

* information about the SHA of the commit being reverted in the following format: `This reverts commit <SHA>`,
* a clear description of the reason for reverting the commit message




[coc]: https://github.com/DSI-HUG/eslint-config/blob/master/CODE_OF_CONDUCT.md
[github]: https://github.com/DSI-HUG/eslint-config
[issue-templates]: https://github.com/DSI-HUG/eslint-config/issues/new/choose
[github-pr]: https://github.com/angular/angular/pulls
[js-style-guide]: https://google.github.io/styleguide/jsguide.html
[commit-message-format]: https://www.conventionalcommits.org/en/v1.0.0