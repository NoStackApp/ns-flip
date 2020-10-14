ns-flip
========
<<<<<<< HEAD
A meta-tool for creating and using *updateable* code templates.  Separates custom code from the rest of a stack.  Framework agnostic.
=======
A tool for creating and using *updatable* code templates.  Supports regeneration of code without losing custom changes. Framework agnostic.
>>>>>>> resolvedTSCError

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/ns-flip.svg)](https://npmjs.org/package/ns-flip)
[![Downloads/week](https://img.shields.io/npm/dw/ns-flip.svg)](https://npmjs.org/package/ns-flip)
[![License](https://img.shields.io/npm/l/ns-flip.svg)](https://github.com/https://github.com/NoStackApp/ns-flip/blob/master/package.json)

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
<<<<<<< HEAD
The hard part of software development isn't usually building it, but rather maintaining it.

Any template can generate code quickly.  But usually, the generated code cannot be updated without losing any custom changes. The problem is that custom changes are mixed in with the template-based code as "legacy code".  If the template maintainer updates to a new version, the generated code does not update with it.  Or what if the code developer wants to switch the legacy code a different template?

Today, software is built on top of endless packages evolving underneath us. The smart developer minimizes as much as possible their custom code, relying on experts to maintain the rest.
                                             
So we are humbly offering this tool to handle changes to templates or to custom code independently.

Creating an exchangeable or updatable template lets you and others build the same type of app quicker and maintain them easily.  Also, the template maintainer can be a more advanced coder, leaving the simpler tasks to less skilled or informed developers.

It is based on the philosophy of NoStack, that your code and the code of your stack should be maintained completely independently and leverage the work of others.

# What
ns-flip (short for "No Stack Flip") is CLI for front end templates that can be exchanged as easily as WordPress themes.  It's got commands for both the template creator and the user.  It can be used to generate most types of code, including frameworks.

You can create templates for yourself or others that have regions built in for customized code.  Then users of the template can upgrade easily, or even exchange templates that use the same custom regions, without losing their custom changes.

You can store a template in a repo and distribute it separately, or just use your own privately.  A template must conform to required standards explained below.  Creating a template requires working knowledge of the simple Handlebars language, and not much more.
=======
After you generate code with a template or tool, you make changes to the code.  But then usually you can't regenerate it without losing your changes.  So you can't apply an updated template or change to another similar template. Keeping your "legacy code" current becomes an expensive pain.  

# What
ns-flip is a CLI to support code templates that can be exchanged as easily as WordPress themes.
>>>>>>> resolvedTSCError

A template can support three types of files:

<<<<<<< HEAD
1. standard files (appear in every generated code base)
2. custom static files (are static, but custom created for each code base)
3. custom dynamic files (based on queries e.g. components for query results).

When you use a template to generate code, first you create "starter".  You can use a starter as frequently as you like, creating with it multiple code bases.  Every code base contains a `meta` directory.  You can modify the ns yaml file `meta/ns.yml` to specify data types for dynamic files and any static information needed for the code base.  Whenever you want to change either your ns file or your starter, you can test your code to be sure that no custom changes will be lost and then regenerate the code.

#Features
* A `newapp` command to generate an "empty" placeholder app of the type used by a template.  (The way that `create-react-app` creates a placeholder React app.) The template specifies how such a placeholder gets created, so if you like you can use ns-flip to let others generate some unique type of application.
* A command `makecode` that generates an app from a template.
* A `test` command to be sure that no custom code that the template user created violates the standards for the template. The test ensures that custome code conforms to the [NoStack Front End Guidelines](https://bit.ly/nsFrontEndRules). (Otherwise, you could lose your custom code when you update your template!)
* Two markup options for giving complete flexibility to coders using a template: 
    1. delimiters for a named custom code region that will be persist through template updates
    2. delimiters for template sections so that a developer can replace a section if needed (less optimal but it is sometimes needed) and the replacement will persist through a mockup.
* A flexible, hierarchical approach for specifying specific data types needed for a generated dynamic code base. Rather than limiting an app to standard pages (you know, a cookie cutter), a `ns-flip` template relies upon a flexible specification with the units and hierarchies of components that you need in your app.
* Easy to use: Simple handlebars with a simple standard structure for templates.
* [Coming Soon] A searchable list for registering templates, so that if you create a template others can find it.
=======
1. standard (appear in every generated code base, e.g. 'App.jsx')
2. custom static (static, but must be custom specified for each code base, e.g. steps in an input stepper)
3. custom dynamic (based on queries e.g. components showing query results).

You can create templates with locations designated for custom code.  You can also name regions that can be replaced or removed in the generated code.  Ns-flip stores the custom changes before regenerating and restores them.

# How
>>>>>>> resolvedTSCError

A template is a directory with requirements explained in the [documentation](https://github.com/NoStackApp/ns-flip/wiki).  You can use it privately or distribute it.  To create one, you will need a basic working knowledge of [Handlebars](https://handlebarsjs.com/guide/) and not much more.

To create code from a template:
1. Create a "starter" directory by calling [`ns newstarter -t <template> -s <starter>`](#ns-newstarter).  
2. Create a code base using the starter: [`ns newcode -c <code path> -s <starter>`](#ns-newcode).
3. The code base will have a `meta` directory with a sample ns file `meta/ns.yml`.  You can modify the ns file to change data types for dynamic files and any static information needed.  After any modifications, regenerate the code using [`ns generate -c <code>`](#ns-generate)
4. Anyone can add custom code.  But periodically run  [`ns test -c <code>`](#ns-test) to be certain you did it right.  (Otherwise, some of your changes will not be preserved when `ns-generate` is run in the future.)

Whenever you want to run an updated version of the template, create a new starter (as in step 1) and then run `ns generate -c <code>` again.

<<<<<<< HEAD
Templates that support the [NoStack](https:www.nostack.net) service will extend the power of the template to include autogenerated backends, so that you can throw together and then modify your whole stack with minimal code.  But the `ns-flip` package is generalized to allow for templating of any type of code, independent of no-stack.
 
 So far, we've got [one template](https://github.com/YizYah/basicNsFrontTemplate), and we are pulling together the documentation.

## Planned Work
There are a number of planned improvements to `ns-flip`:
1. Templates should contain lists of custom regions and sections, so that different templates can be compared for compatibility.  That way, if a project's code base was generated with one template, it could be moved over to other compatible templates.
4. A searchable repository of templates is planned.
5. A new command `checkVersion` which looks for updates.  
6. A new command `changeTemplate` to update or exchange the template automatically.
7. Commands to simplify creation of templates from sample code.
8. Instructions for using a template should be copied over to the generated code base in the `meta` directory to assist in updating the `ns.yml` file correctly.
9. Updating the `ns.yml` file to accept fields defined in another file to simplify app generation. 

If you want to help with this project, we'd love to talk to you!  Please [open an issue](https://github.com/https://github.com/NoStackApp/ns-flip/issues/new) and start talking to us!  Or just reach out to info at nostack dot net.

Please see instructions for usage below.
=======
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
Please do! [Open an issue](https://github.com/https://github.com/NoStackApp/ns-flip/issues/new) and start talking to us!  Or just reach out to info at nostack dot net.
>>>>>>> resolvedTSCError

# Usage
<!-- usage -->
```sh-session
$ npm install -g ns-flip
$ ns COMMAND
running command...
$ ns (-v|--version|version)
ns-flip/1.0.0-0 linux-x64 node-v14.9.0
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
  $ nostack makecode -a ~/temp/myapp
```

_See code: [src/commands/generate.ts](https://github.com/NoStackApp/ns-flip/blob/v1.0.0-0/src/commands/generate.ts)_

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
  $ nostack newcode -c ~/temp/myapp -s ~/temp/starter
```

_See code: [src/commands/newcode.ts](https://github.com/NoStackApp/ns-flip/blob/v1.0.0-0/src/commands/newcode.ts)_

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
  $ nostack newstarter -t ~/templates/basicTemplate -s ~/temp/mystarter
```

_See code: [src/commands/newstarter.ts](https://github.com/NoStackApp/ns-flip/blob/v1.0.0-0/src/commands/newstarter.ts)_

## `ns test`

Confirms that your custom changes have been entered safely, allowing you to generate with an updated or replaced template, or with a changed 'ns.yml' file. For documentation about the rules for custom code placement, please see https://www.nostack.net/ns-flip/.

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
  $ nsfront test -c ~/temp/myApp
```

_See code: [src/commands/test.ts](https://github.com/NoStackApp/ns-flip/blob/v1.0.0-0/src/commands/test.ts)_
<!-- commandsstop -->

<<<<<<< HEAD
#Using Templates
Here is a sample session where a code base is generated from a template for an app.  A lot of these steps should only be done once.

```
TEMPLATE_DIR=~/projects/nsBasicTemplate
STARTER_DIR=~/temp/baseapp4
CODE_DIR=~/temp/multitask4

npm i ns-flip
nsfront newstarter -t $TEMPLATE_DIR -s $STARTER_DIR
nsfront generate -c $CODE_DIR
nsfront generate -c $CODE_DIR
```

To delete prior to starting over:
```
sudo rm -r $CODE_DIR
sudo rm -r $STARTER_DIR
cd ~/temp
nsfront newstarter -t $TEMPLATE_DIR -s $STARTER_DIR
nsfront newapp -t $TEMPLATE_DIR -a $STARTER_DIR
nsfront newapp -t $TEMPLATE_DIR -a $CODE_DIR -b $STARTER_DIR
cd $CODE_DIR

sudo rm -r $CODE_DIR
mv $CODE_DIR.old $CODE_DIR

```

Follow these steps:
1. You will need to install `ns-flip` globally: `npm i ns-flip`. 
2. Clone the template that you want to use to your local.
3. Call `nsfront newapp -t <template dir> -a <placeholder app directory>` and the placeholder app will be created wherever you specified. This step may take some time (for instance, if the template has to install a lot of packages).
4. Edit the `ns.yml` file in the "meta" directory.  That is a yaml file.  If you have not worked with yaml files, you should take a minute to search them and learn their syntax.
  
    a. You need to replace `myApp` with the name that you want, and if necessary globally replace `user` with whatever you want for the user for that app, e.g. `buyer`.
    
    b. You need to create a set of units under
     `units`. The semantic meaning of a unit will vary depending upon the template, but you can roughly think of them as pages or screens in your app. Each one must have a `hierarchy` of data types.  See [Creating a Data Type Hierarchy](##Creating a Data Type Hierarchy) below.
6. Call `nsfront makecode -a <app dir>` to generate your app code according to the template.
7. In your `ns.yml` file is a path from your directory root specified in `dirs.custom`.  It may simply be `src/custom`.  You can put any code or other files into that file, and add as many directories as you'd like. 
8. Any custom modifications to code must conform to the [NoStack Front End Guidelines](https://bit.ly/nsFrontEndRules) or it will be lost when you update the template.
9. It is a good practice to run `nsfront test -a <appDir>` regularly, maybe before pushing.
10. You can update or replace the template whenever you like. Common sense dictates that you should push to a safe branch before you do so, and make sure to run `nsfront test -a <appDir>` first to be certain that your custom changes are safe.  Then, you can update `template.dir` in the `ns.yml` file, or simply replace the template in its current directory.  Finally, run `nsfront makecode` as before. 

##Creating a Data Type Hierarchy

### Intro to Units
A unit is a building block for a dynamic UI.  It's typically a query to the back end.

An `ns.yml` for an app contains the `units` section. It is an object of units, each of which contains a `hierarchy` of data types.  

Here's a typical unit specification in the `ns.yml` file:
```
  products:
    hierarchy:
      constrain#seller:
          create#product:
              create#spec:
                  create#details: null
              create#location: null
```
First note that every string to describe a data type contains a pound sign ('#") as a delimiter.  

* To the left of the pound sign is the name of a type of data node permitted by the template.  In this case, the template allows for at least 2 types of data nodes: `constrain` and `create`.  (The template specifies types of files generated for each.).  
* To the right of the pound sign is the name of the data type.  

Each data type in the hierarchy contains as a value it's children.  If there are no children, the value is `null`.  So for instance, in this case a `seller` has `products`, which have `specs` that have `details`.  In addition, `products` have `locations` where they are sold. 

An important constraint is that in a given unit's hieararchy each data type appears only once.  

You can, of course, start simple and build them up.  Any time you like, you can call `makecode` and it will modify the code that you have so far to include changes to your units and their hierarchies.

To create a hierarchy, think in terms of what you want to display.  If for instance you expect to show a list of watches as the highest level of a UI unit, then your hierarchy should be rooted in watches.  Maybe for each watch you will have a list of sellers.  
```
catalog:
    hierarchy:
        watch:
            store:
                location: null
                hours: null
                phone: null
        cost: null
```
Look in the README file of your template for information about the types of elements used.

But if you want the sellers to be shown on the top with the watches that they carry, then you'd reverse that.
 
```
catalog:
    hierarchy:
        store:
            location: null
            hours: null
            phone: null
            watch
                cost: null
```
You can extend a hierarchy as many levels deep as you like.  When a type has no child types, it should receive the value of null.

### Data Types
Note that nothing is stated in the hierarchy about data type.  By default, everything is a string.  Other types may be supported by specific templates and by various frameworks.  For instance, the NoStack backend currently supports strings, numbers, booleans and sets.

By default, everything is a string.  When you want to generate a backend as well, you need to provide more information. A template may also support multiple data types.

To start, you can try producing something with just strings.  In addition to the required `hierarchy`, a unit specification may also include a `properties` section that specifies various properties for data types.  For instance, the following exerpt from an `ns.yml` file shows that for the type `done` the data type is `boolean`.
```
    properties:
        done:
            dataType: boolean
```

### Joins 
More complex interfaces can be built with joining units, which provides complete querying expressive power if the template is used for connecting to an actual backend.

[//]: # (add)

#Working with Test Results
The diff files in `<appPath>.test/diffs` show a number of problems.  If you understand what's happening, the solutions are usually straightforward, but it may seem confusing at first. 

It helps to understand clearly that your code files in `<appPath>/src/components` are being compared to generated versions in `<appPath>.test/src/components`.  You may want to learn the basics of `diff` outputs if you haven't already.

The problems (and their likely causes and solutions) are shown below.  They can be one of the following:
1. There are lines in the generated test code that do not appear in yours.  That would indicate that you removed some code, or that something in the version of your ns-flip is more uptodate than the version used to generate your code.  The solution is to add those lines to your code in the line number indicated, and then to try the test again.
2. Your code has lines not in the generated code.  That usually indicates that you added code in places not permitted in the code.  You need to insert all of your custom code in ns-custom areas, or to replace a section of the generated code using the "replacement" delimiter.  It's always preferred to place code into a custom area rather than replacing, but if you must then replacement works.  
3. Your code is simply different.  That situation can arise from one of two situations:
  a. You may simply need to lint your code and remove linting errors.  For instance, it could be that your code using a double quote and the generated code uses a single quote. 
  b. Your code may have missing or altered comment lines for delimiting sections or custom code areas. You may have to look at the generated code a bit to identify the discrepancies.
4. Your code has files that don't appear in the generated code.  You need to move them to the `src/custom` directory.
5. The generated code has files that don't appear in your code.  That normally means that you deleted a generated file.  Technically, that doesn't pose an immediate problem, given that in the worst case a future regeneration of code will add a file.  But the deletion won't last.  Probably there's a better solution by replacement of sections, possibly incorporating code or components programmed within the `src/custom` directory.

# Creating Templates
See our [Sample Template](https://github.com/YizYah/basicNsFrontTemplate) for a model.

Note that to create templates, you have to know the basics of the templating language [Handlebars](https://handlebarsjs.com/guide/).  (It's a very simple language to learn.)

It will take a bit of effort to generate your first template, but once you get the hang of it it's not that difficult and lets you build powerful tools.

## Create Basic Directories
1. Create a new template directory
2. add your basic directories and files
```
TEMPLATE_DIR=~/templates/myTemplate

cd $TEMPLATE_DIR
mkdir standard
mkdir partials
mkdir helpers
touch config.yml
touch generic.hbs
touch sample.ns.yml
```

## Start with Standard Files
1. Select code for a sample app or something that you want to template from working.
2. append to every standard file (that will appear in every code base generated from your template) an ".hbs" extension.  (E.g. a file named `index.js` becomes `index.js.hbs`.)

## Marking up the text
 In every hbs file, you can specify sections and custom areas that you want to produce.

### File identification 
 At the beginning, you need to insert this line:
 ```
// ns__file {{fileInfo}}
```
But you could create a partial for it, and call it, e.g.
```
{{> START_OF_FILE this}}
```

Then you can create your START_OF_FILE partial in `START_OF_FILE.hbs` and put it into the `partials` dir.  (See the sample template for an example.)

## Create `config.yml`
Copy something like this sample into config.yml:
```
name: <template name>
version: 1.0
category: <Frameworks for usage e.g. React & Nostack>

dirs:
  components: src/components
  queries: src/components/source-props
  custom: src/custom

componentTypes:
  creation:
    suffix: CreationForm
    singular: true
  list:
    singular: false
  single:
    singular: true

dataFunctionTypes:
  selectable:
    components:
      - list
      - single
    requiresSource: true
    nodeType: selectable
  constrain:
    components: null
  create:
    components:
      - list
      - single
      - creation
  use:
    components:
      - list
      - single
    requiresSource: true
  property:
    components:
      - list
      - single
```
* The three dirs are all relative to the code base generated by users of your app. `components` is where any dynamically generated components will be.  `custom` is a place where they can put additional custom code. `queries` is optional if you will be requiring queries to a backend.
* `componentTypes`
* `dataFunctionTypes`


## Create Dynamic Data
### Supported Data

1. Create a `partials` directory.
2. Identify types of dynamic files that you are using.

Move from the 
5. remove any files for data components--those you will have to reproduce based on dynamic data.  But everything that remains is your standard files.


Then 

It's also helpful to understand clearly that ns-flip templates generate two types of files:
1. _type files_ are files generated for particular data types in an app's hierarchy.  That hierarchy is dynamically determined from an `ns.yml` file when `nsfront makecode` is run.  For instance, if an app uses watches, there may be a type `watch` in the `ns.yml` file, and there may be multiple component files created for watches, included `Watch.jsx`, `Watches.jsx` and `CreateWatchForm.jsx`.
2. _standard files_ are always generated, regardless of specifics about the app.  So for instance every app may contain a standard file `client.js`.

A template is a directory containing the following:
* A `config.yml` file telling various configurations.
* A general file template `generic.hbs` from which files for data are generated (see below).
* a `fileTemplates` directory containing handlebars templates for the standard files. Files should have an `.hbs` extension.  You can create any number of subdirectories.
* An optional `partials` directory containing handebars partials files.  As with `fileTemplates, you can add any number of subdirectories.  NsFront will read in your partials before generating files and you can make reference to them in your template files.


=======
>>>>>>> resolvedTSCError
[//]: # (add)
