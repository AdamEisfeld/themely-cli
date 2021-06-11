# Themely CLI

Themely CLI is a set of command line tools that provide functionality for generating CSS and Stylus files from simple JSON files, which can be used with Themely.io for theming a web application.

## Installation

Themely CLI is available as a node package. For the latest stable version, run:

```
npm install themely-cli -g
```

## Commands

### themely
A CLI for creating and managing Themely.io themes.

Usage: 
```
themely [options] [command]
```

Options:
- -h, --help display help for command

Commands:
- generate Creates various files from theme JSON files.
- lint <themePath> <schemaPath>  Checks a theme file for any issues that would cause file generation to break.
- batch <configPath> Lints a set of theme JSON files against a schema JSON file, constructs CSS files for each theme, then constructs a Stylus file based off of the schema.

### themely lint
Checks a theme file for any issues that would cause file generation to break.

Usage: 
```
themely lint [options] <themePath> <schemaPath>
```

Arguments:
- themePath The path of a JSON file to construct a theme from.
- schemaPath  The path of a JSON file to check against the themePath looking for missing keypaths and broken referential values.

Options:
- -h, --help  display help for command

### themely generate
Creates various files from theme JSON files.

Usage: 
```
themely generate [options] [command]
```

Options:
- -h, --help  display help for command

Commands:
- css <themePath> <cssPath> <cssContainerName>  Generates a CSS file from an input theme JSON file.
- stylus <schemaPath> <stylusPath> <stylusContainerName>  Generates a Stylus file containing a nested dictionary of key/values, from an input schema JSON file.


### themely generate css
Generates a CSS file from an input theme JSON file.

Usage: 
 ```
 themely generate css [options] <themePath> <cssPath> <cssContainerName>
 ```

Arguments:
- themePath The path of a JSON file to create the CSS file from.
- cssPath The desired path of the CSS file to create.
- cssContainerName  The class name to wrap the CSS definition in. Specify root to expose the CSS variables globally.

Options:
- -h, --help  display help for command

### themely generate stylus
Generates a Stylus file containing a nested dictionary of key/values, from an input schema JSON file.

Usage: 
```
themely generate stylus [options] <schemaPath> <stylusPath> <stylusContainerName>
```

Arguments:
- schemaPath The path of a JSON schema file to create the Stylus file from.
- stylusPath The desired path of the Stylus file to create.
- stylusContainerName  The variable name to wrap the Stylus definition in.

Options:
- -h, --help display help for command

### themely batch
Lints a set of theme JSON files against a schema JSON file, constructs CSS files for each theme, then constructs a Stylus file based off of the schema.

Usage: 
```
themely batch [options] <configPath>
```

Arguments:
- configPath  The path of a JSON file describing the batch to run.

Options:
- -h, --help  display help for command
