'use strict';

module.exports = {
  client: {
    lib: {
      css: [
        // 'public/lib/bootstrap/dist/css/bootstrap.css',
        // 'public/lib/bootstrap/dist/css/bootstrap-theme.css',

        //template:css
        'public/template/css/master.css',

        // <!-- SWITCHER -->
        'public/template/assets/switcher/css/switcher.css',
        'public/template/assets/switcher/css/color1.css'
        // ,
        // 'public/template/assets/switcher/css/color2.css',
        // 'public/template/assets/switcher/css/color3.css',
        // 'public/template/assets/switcher/css/color4.css'
        //end_template

      ],
      js: [
        // bower:js
        'public/lib/angular/angular.js',
        'public/lib/angular-resource/angular-resource.js',
        'public/lib/angular-animate/angular-animate.js',
        'public/lib/angular-messages/angular-messages.js',
        'public/lib/angular-ui-router/release/angular-ui-router.js',
        'public/lib/angular-ui-utils/ui-utils.js',
        'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
        'public/lib/angular-file-upload/angular-file-upload.js',
        'public/lib/owasp-password-strength-test/owasp-password-strength-test.js',
        // endbower

        //template
        'public/lib/assets/js/jquery-1.11.2.min.js',
        // 'public/lib/jquery/dist/jquery.min.js',
        // 'public/lib/jquery/dist/jquery-2.0.0.min.js',
        

        'public/lib/assets/js/bootstrap.min.js',

        'public/lib/assets/js/waypoints.min.js',
        'public/lib/assets/js/smoothscroll.min.js',
        'public/lib/assets/js/isotope.pkgd.min.js',
        
        'public/lib/assets/switcher/js/dmss.js',
        'public/lib/assets/js/jquery-ui.min.js',
        'public/lib/assets/js/modernizr.custom.js',
        'public/lib/assets/js/wow.min.js',

        //boostrap select
        'public/lib/assets/bootstrap-select/bootstrap-select.min.js',

        //asset


        // <!-- Countdown Timer -->
        'public/lib/assets/countdown/dscountdown.min.js',


        // <!--Owl Carousel-->
        'public/lib/assets/owl-carousel/owl.carousel.min.js',
        
        // <!--bx slider-->
        'public/lib/assets/bxslider/jquery.bxslider.min.js',

        // <!-- slider-pro-master -->
        'public/lib/assets/slider-pro-master/js/jquery.sliderPro.min.js',
        
        'public/lib/assets/prettyPhoto/js/jquery.prettyPhoto.js',


        'public/lib/assets/js/jquery.easypiechart.min.js',
        'public/lib/assets/js/jquery.spinner.min.js',
        'public/lib/assets/js/jquery.placeholder.min.js',
        'public/lib/assets/js/theme.js'

      ],
      tests: ['public/lib/angular-mocks/angular-mocks.js']
    },
    css: [
      'modules/*/client/css/*.css'
    ],
    less: [
      'modules/*/client/less/*.less'
    ],
    sass: [
      'modules/*/client/scss/*.scss'
    ],
    js: [
      'modules/core/client/app/config.js',
      'modules/core/client/app/init.js',
      'modules/*/client/*.js',
      'modules/*/client/**/*.js'
    ],
    views: ['modules/*/client/views/**/*.html'],
    templates: ['build/templates.js']
  },
  server: {
    gruntConfig: 'gruntfile.js',
    gulpConfig: 'gulpfile.js',
    allJS: ['server.js', 'config/**/*.js', 'modules/*/server/**/*.js'],
    models: 'modules/*/server/models/**/*.js',
    routes: ['modules/!(core)/server/routes/**/*.js', 'modules/core/server/routes/**/*.js'],
    sockets: 'modules/*/server/sockets/**/*.js',
    config: 'modules/*/server/config/*.js',
    policies: 'modules/*/server/policies/*.js',
    views: 'modules/*/server/views/*.html'
  }
};
