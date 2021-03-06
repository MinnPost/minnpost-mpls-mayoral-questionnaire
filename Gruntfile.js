/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    meta: {
      banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") + "\\n" %>' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */' +
        '<%= "\\n\\n" %>'
    },
    data_embed: {
      app_data: {
        options: {
          output: 'dist/data.js'
        },
        files: {
          'questions_answers.json': ['data/questions_answers.json']
        }
      }
    },
    jshint: {
      options: {
        curly: true,
        //es3: true,
        forin: true,
        latedef: true,
        //maxlen: 80,
        indent: 2
      },
      files: ['Gruntfile.js', 'js/*.js', 'data-processing/*.js']
    },
    sass: {
      dist: {
        options: {
          style: 'compressed'
        },
        files: {
          'css/styles.min.css': 'sass/main.scss',
          'css/styles.ie.min.css': 'sass/main.ie.scss'
        }
      },
      dev: {
        options: {
          style: 'expanded'
        },
        files: {
          'css/styles.css': 'sass/main.scss',
          'css/styles.ie.css': 'sass/main.ie.scss'
        }
      }
    },
    clean: {
      folder: 'dist/'
    },
    mustache: {
      templates: {
        src: 'js/templates/',
        dest: 'dist/templates.js',
        options: {
          prefix: 'mpTemplates = mpTemplates || {}; mpTemplates[\'<%= pkg.name %>\'] = ',
          postfix: ';',
          verbose: true
        }
      }
    },
    concat: {
      options: {
        separator: '\r\n\r\n'
      },
      // JS application
      dist: {
        src: ['js/core.js', 'dist/data.js', 'dist/templates.js',
          'js/app.js', 'js/*.js'],
        dest: 'dist/<%= pkg.name %>.<%= pkg.version %>.js'
      },
      dist_latest: {
        src: ['<%= concat.dist.src %>'],
        dest: 'dist/<%= pkg.name %>.latest.js'
      },
      // CSS application
      dist_css: {
        src: ['css/styles.min.css'],
        dest: 'dist/<%= pkg.name %>.<%= pkg.version %>.css'
      },
      dist_css_latest: {
        src: ['css/styles.min.css'],
        dest: 'dist/<%= pkg.name %>.latest.css'
      },
      dist_css_ie: {
        src: ['css/styles.ie.min.css'],
        dest: 'dist/<%= pkg.name %>.<%= pkg.version %>.ie.css'
      },
      dist_css_latest_ie: {
        src: ['css/styles.ie.min.css'],
        dest: 'dist/<%= pkg.name %>.latest.ie.css'
      },

      // JS libs
      libs: {
        src: [
          'bower_components/jquery/jquery.min.js',
          'bower_components/jquery-jsonp/src/jquery.jsonp.js',
          'bower_components/underscore/underscore-min.js',
          'bower_components/backbone/backbone-min.js',
          'bower_components/ractive/build/Ractive-legacy.min.js',
          'bower_components/ractive/plugins/adaptors/Backbone.js',
          'bower_components/sticky-kit/jquery.sticky-kit.min.js'
        ],
        dest: 'dist/<%= pkg.name %>.libs.js',
        options: {
          separator: ';\r\n\r\n'
        }
      },
      // CSS libs
      libs_css: {
        src: [
          'bower_components/unsemantic/assets/stylesheets/unsemantic-grid-responsive-tablet.css'
        ],
        dest: 'dist/<%= pkg.name %>.libs.css'
      },
      libs_css_ie: {
        src: [
          'bower_components/unsemantic/assets/stylesheets/ie.css'
        ],
        dest: 'dist/<%= pkg.name %>.libs.ie.css'
      }
    },
    uglify: {
      options: {
        banner: '<%= meta.banner %>'
      },
      dist: {
        src: ['<%= concat.dist.dest %>'],
        dest: 'dist/<%= pkg.name %>.<%= pkg.version %>.min.js'
      },
      dist_latest: {
        src: ['<%= concat.dist_latest.dest %>'],
        dest: 'dist/<%= pkg.name %>.latest.min.js'
      }
    },
    copy: {
      images: {
        files: [
          {
            cwd: './css/images/',
            expand: true,
            filter: 'isFile',
            src: ['*'],
            dest: 'dist/images/'
          }
        ]
      },
      data: {
        files: [
          {
            cwd: './data/',
            expand: true,
            filter: 'isFile',
            src: ['**/*.json'],
            dest: 'dist/data/'
          }
        ]
      }
    },
    gss_pull: {
      mayor_data: {
        src: ['0AjYft7IGrHzNdEtNMzF3YXJUbE43QnFFS1BqRlpFdEE'],
        dest: 'data/questions_answers.json'
      }
    },
    s3: {
      options: {
        // This is specific to MinnPost
        //
        // These are assumed to be environment variables:
        //
        // AWS_ACCESS_KEY_ID
        // AWS_SECRET_ACCESS_KEY
        //
        // See https://npmjs.org/package/grunt-s3
        //key: 'YOUR KEY',
        //secret: 'YOUR SECRET',
        bucket: 'data.minnpost',
        access: 'public-read'
      },
      mp_deploy: {
        upload: [
          {
            src: 'dist/*',
            dest: 'projects/<%= pkg.name %>/'
          },
          {
            src: 'dist/data/**/*',
            dest: 'projects/<%= pkg.name %>/data/',
            rel: 'dist/data'
          },
          {
            src: 'dist/images/**/*',
            dest: 'projects/<%= pkg.name %>/images/',
            rel: 'dist/images'
          }
        ]
      }
    },
    connect: {
      server: {
        options: {
          port: 8899
        }
      }
    },
    watch: {
      files: ['<%= jshint.files %>', 'sass/*.scss'],
      tasks: 'lint-watch'
    }
  });

  // Load plugin tasks
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-mustache');
  grunt.loadNpmTasks('grunt-gss-pull');
  grunt.loadNpmTasks('grunt-s3');


  // Custom task to save json data into a JS file for concatentation
  grunt.registerMultiTask('data_embed', 'Make data embeddable', function() {
    var options = this.options();
    var config = grunt.config.get();
    var finalOutput = '';
    console.log(options);

    this.files.forEach(function(f) {
      var data = grunt.file.readJSON(f.src[0]);
      finalOutput += 'mpData = mpData || {}; mpData["' + config.pkg.name + '"] = mpData["' + config.pkg.name + '"] || {}; mpData["' + config.pkg.name + '"]["' + f.dest + '"] = ' + JSON.stringify(data) + '; \n\n';
      grunt.log.write('Read file: ' + f.src[0] + '...').ok();

    });

    grunt.file.write(options.output, finalOutput);
    grunt.log.write('Wrote data to: ' + options.output + '...').ok();
  });

  // Default build task
  grunt.registerTask('default', ['jshint', 'sass', 'clean', 'gss_pull', 'data_embed', 'mustache', 'concat', 'uglify', 'copy']);

  // Data tasks
  grunt.registerTask('data', ['gss_pull']);

  // Watch tasks
  grunt.registerTask('lint-watch', ['jshint', 'sass:dev']);
  grunt.registerTask('server', ['connect', 'watch']);

  // Deploy tasks
  grunt.registerTask('mp-deploy', ['s3']);

};
