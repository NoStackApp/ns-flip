ns-flip
========
A tool for creating and using *updatable* code templates.  Supports regeneration of code without losing custom changes. Framework agnostic.


[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/ns-flip.svg)](https://npmjs.org/package/ns-flip)
[![Downloads/week](https://img.shields.io/npm/dw/ns-flip.svg)](https://npmjs.org/package/ns-flip)
[![License](https://img.shields.io/npm/l/ns-flip.svg)](https://github.com/NoStackApp/ns-flip/blob/master/package.json)

<!-- toc -->
* [Why](#why)
* [What](#what)
* [How](#how)
* [Plans](#plans)
* [Contributing](#contributing)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->

# Why
After you generate code with a template or tool, you make changes to the code.  But then usually you can't regenerate it without losing your changes.  So you can't apply an updated template or change to another similar template. Keeping your "legacy code" current becomes an expensive pain.  

# What
ns-flip is a CLI to support code templates that can be exchanged as easily as WordPress themes.


A template can support three types of files:

1. standard (appear in every generated code base, e.g. 'App.jsx')
2. custom static (static, but must be custom specified for each code base, e.g. steps in an input stepper)
3. custom dynamic (based on queries e.g. components showing query results).

You can create templates with locations designated for custom code.  You can also name regions that can be replaced or removed in the generated code.  Ns-flip stores the custom changes before regenerating and restores them.

# How

A template is a directory with requirements explained in the [documentation](https://github.com/NoStackApp/ns-flip/wiki).  You can use it privately or distribute it.  To create one, you will need a basic working knowledge of [Handlebars](https://handlebarsjs.com/guide/) and not much more.

To create code from a template:
1. Create a "starter" directory by calling [`ns newstarter -t <template> -s <starter>`](#ns-newstarter).  
2. Create a code base using the starter: [`ns newcode -c <code path> -s <starter>`](#ns-newcode).
3. The code base will have a `meta` directory with a sample ns file `meta/ns.yml`.  You can modify the ns file to change data types for dynamic files and any static information needed.  After any modifications, regenerate the code using [`ns generate -c <code>`](#ns-generate)
4. Anyone can add custom code.  But periodically run  [`ns test -c <code>`](#ns-test) to be certain you did it right.  (Otherwise, some of your changes will not be preserved when `ns-generate` is run in the future.)

Whenever you want to run an updated version of the template, create a new starter (as in step 1) and then run `ns generate -c <code>` again.

See the [documentation](https://github.com/NoStackApp/ns-flip/wiki).  Here's a [sample template](https://github.com/YizYah/basicNsFrontTemplate).

# Plans
* Add a default test before generating unless `--force` is used
* Allow sample.custom.json for a starter.  A starter could optionally be a fully customized app.
* Remove the extra tags in custom delimiters (They are no longer necessary in the current implmentation)
* Allow the template to specify comment delimiters.  (Currently, the languages must support at least one of the comment formats of javascript (that is, `// comment` or `/* comment */`) or embed them within additional comment delimiters).
* Templates should contain precise specification of frameworks supported and code sections, so that different templates can be compared for compatibility.  That way, if a project's code base was generated with one template, it could be moved over to other compatible templates.
* A searchable repository of templates.
* A new command `ns checkVersion -t <template>` which checks for updates.
* Commands to simplify creation of templates from sample code.
* Instructions for using a template added to the `meta` directory.
* Input fields in `ns.yml` files to accept fields defined in another file. 
* `ns.yml` interactive generator.

# Contributing
Please do! [Open an issue](https://github.com/NoStackApp/ns-flip/issues/new) and start talking to us!  Or just reach out to info at nostack dot net.

# Usage
<!-- usage -->
```sh-session
$ npm install -g ns-flip
$ ns COMMAND
running command...
$ ns (-v|--version|version)
ns-flip/1.3.2 linux-x64 node-v14.9.0
$ ns --help [COMMAND]
USAGE
  $ ns COMMAND
...
```
<!-- usagestop -->

# Commands
<!-- commands -->
* [`ns generate`](#ns-generate)
* [`ns help [COMMAND]`](#ns-help-command)
* [`ns newcode`](#ns-newcode)
* [`ns newstarter`](#ns-newstarter)
* [`ns test`](#ns-test)

## `ns generate`

generates (or regenerates) code based on a meta file `ns.yml`, preserving custom changes. The code directory must have been created for the first time using `newcode`.

```
USAGE
  $ ns generate

OPTIONS
  -c, --codeDir=codeDir  code directory
  -h, --help             show CLI help

EXAMPLE
  $ nd generate -c ~/temp/myapp
```

_See code: [src/commands/generate.ts](https://github.com/NoStackApp/ns-flip/blob/v1.3.2/src/commands/generate.ts)_

## `ns help [COMMAND]`

display help for ns

```
USAGE
  $ ns help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.0/src/commands/help.ts)_

## `ns newcode`

new code base, based on a starter. You can use `generate` to update based on the `ns.yml` file.

```
USAGE
  $ ns newcode

OPTIONS
  -c, --codeDir=codeDir        code base directory
  -h, --help                   show CLI help
  -s, --starterDir=starterDir  starter directory.

EXAMPLE
  $ ns newcode -c ~/temp/myapp -s ~/temp/starter
```

_See code: [src/commands/newcode.ts](https://github.com/NoStackApp/ns-flip/blob/v1.3.2/src/commands/newcode.ts)_

## `ns newstarter`

create new starter from a template.  You can then generate a new code base from it using `newCode`.

```
USAGE
  $ ns newstarter

OPTIONS
  -h, --help                     show CLI help
  -s, --starterDir=starterDir    starter directory
  -t, --templateDir=templateDir  template directory

EXAMPLE
  $ ns newstarter -t ~/templates/basicTemplate -s ~/temp/mystarter
```

_See code: [src/commands/newstarter.ts](https://github.com/NoStackApp/ns-flip/blob/v1.3.2/src/commands/newstarter.ts)_

## `ns test`

Confirms that your custom changes have been entered safely, allowing you to generate with an updated or replaced template, or with a changed 'ns.yml' file. For documentation about the rules for custom code placement, please see https://github.com/NoStackApp/ns-flip/wiki/Safe-Custom-Code.

```
USAGE
  $ ns test

OPTIONS
  -c, --codeDir=codeDir  code base directory
  -h, --help             show CLI help

DESCRIPTION
  Essentially, the test generates a new version of the code and then simply compares it against your current version.  
  If there are differences, then there is a problem with your code.

EXAMPLE
  $ ns test -c ~/temp/myApp
```

_See code: [src/commands/test.ts](https://github.com/NoStackApp/ns-flip/blob/v1.3.2/src/commands/test.ts)_
<!-- commandsstop -->
