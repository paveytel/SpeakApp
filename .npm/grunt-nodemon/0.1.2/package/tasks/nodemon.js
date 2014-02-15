/*
 * grunt-nodemon
 * https://github.com/ChrisWren/grunt-nodemon
 *
 * Copyright (c) 2013 Chris Wren
 * Licensed under the MIT license.
 */
module.exports = function (grunt) {
  'use strict';

  grunt.registerMultiTask('nodemon', 'Runs a nodemon monitor of your node.js server.', function () {

    var options = this.options();
    var done = this.async();
    var args = [require.resolve('nodemon')];
    var nodemonignoreMessage = '# Generated by grunt-nodemon';

    if (options.nodeArgs) {
      options.nodeArgs.forEach(function (arg) {
        args.push(arg);
      });
    }

    if (options.exec) {
      args.push('--exec');
      args.push(options.exec);
    }

    if (options.delayTime) {
      args.push('--delay');
      args.push(options.delayTime);
    }

    if (options.legacyWatch) {
      args.push('--legacy-watch');
    }

    if (options.ignoredFiles) {
      var fileContent = nodemonignoreMessage + '\n';
      options.ignoredFiles.forEach(function (ignoredGlob) {
        fileContent += ignoredGlob + '\n';
      });

      var fileDest;
      if (options.cwd) {
        fileDest = options.cwd + '/.nodemonignore';
      } else {
        fileDest = '.nodemonignore';
      }
      grunt.file.write(fileDest, fileContent);

    // If the ignoredFiles option is removed, remove the .nodemonignore file if it was
    // generated by grunt-nodemon
    } else if (grunt.file.exists('.nodemonignore') &&
               grunt.file.read('.nodemonignore').indexOf(nodemonignoreMessage) === 0) {
      grunt.file.delete('.nodemonignore');
    }

    if (options.watchedFolders) {
      options.watchedFolders.forEach(function (folder) {
        args.push('--watch');
        args.push(folder);
      });
    }

    if (options.watchedExtensions) {
      args.push('-e');
      args.push(options.watchedExtensions.join(','));
    }

    if (options.file) {
      args.push(options.file);
    }

    if (options.args) {
      options.args.forEach(function (arg) {
        args.push(arg);
      });
    }

    var spawnOpts = {
      stdio: 'inherit'
    };

    if (options.cwd) {
      spawnOpts.cwd = options.cwd;
    }

    if (options.env) {
      spawnOpts.env = process.env;
      var envProps = Object.keys(options.env);
      envProps.forEach(function (envProp) {
        spawnOpts.env[envProp] = options.env[envProp];
      });
    }

    grunt.util.spawn({
      cmd: 'node',
      args: args,
      opts: spawnOpts
    },
    function (error) {
      if (error) {
        grunt.fail.fatal(error);
      }
      done();
    });
  });
};