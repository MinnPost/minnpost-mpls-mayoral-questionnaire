/**
 * Some core functionality for minnpost applications
 */

/**
 * Global variable to hold the "application", templates, and data.
 */
var mpApps = mpApps || {};
var mpTemplates = mpTemplates || {};
mpTemplates['minnpost-mpls-mayoral-questionnaire'] = mpTemplates['minnpost-mpls-mayoral-questionnaire'] || {};
var mpData = mpData || {};
mpData['minnpost-mpls-mayoral-questionnaire'] = mpData['minnpost-mpls-mayoral-questionnaire'] || {};

/**
 * Extend underscore
 */
_.mixin({
  /**
   * Formats number
   */
  formatNumber: function(num, decimals) {
    decimals = (_.isUndefined(decimals)) ? 2 : decimals;
    var rgx = (/(\d+)(\d{3})/);
    split = num.toFixed(decimals).toString().split('.');

    while (rgx.test(split[0])) {
      split[0] = split[0].replace(rgx, '$1' + ',' + '$2');
    }
    return (decimals) ? split[0] + '.' + split[1] : split[0];
  },

  /**
   * Formats number into currency
   */
  formatCurrency: function(num) {
    return '$' + _.formatNumber(num, 2);
  },

  /**
   * Formats percentage
   */
  formatPercent: function(num) {
    return _.formatNumber(num * 100, 1) + '%';
  },

  /**
   * Formats percent change
   */
  formatPercentChange: function(num) {
    return ((num > 0) ? '+' : '') + _.formatPercent(num);
  }
});

/**
 * Create "class" for the main application.  This way it could be
 * used more than once.
 */
(function($, undefined) {
  // Create "class"
  App = mpApps['minnpost-mpls-mayoral-questionnaire'] = function(options) {
    this.options = _.extend(this.defaultOptions, options);
    this.$el = $(this.options.el);
    this.templates = mpTemplates['minnpost-mpls-mayoral-questionnaire'] || {};
    this.data = mpData['minnpost-mpls-mayoral-questionnaire'] || {};
    this.id = _.uniqueId('mp-');
  };

  _.extend(App.prototype, {
    // Use backbone's extend function
    extend: Backbone.Model.extend,

    // Default options
    defaultOptions: {
      dataPath: './data/',
      imagePath: './css/images/',
      jsonpProxy: 'http://mp-jsonproxy.herokuapp.com/proxy?callback=?&url=',
      localStorageKey: _.uniqueId('minnpost-mpls-mayoral-questionnaire-')
    },

    /**
     * Template handling.  For development, we want to use
     * the template files directly, but for build, they should be
     * compiled into JS.
     *
     * See JST grunt plugin to understand how templates
     * are compiled.
     *
     * Expects callback like: function(compiledTemplate) {  }
     */
    getTemplates: function(names) {
      var thisApp = this;
      var defers = [];
      names = _.isArray(names) ? names : [names];

      // Go through each file and add to defers
      _.each(names, function(n) {
        var defer;
        var path = 'js/templates/' + n + '.mustache';

        if (_.isUndefined(thisApp.templates[n])) {
          defer = $.ajax({
            url: path,
            method: 'GET',
            async: false,
            contentType: 'text'
          });

          $.when(defer).done(function(data) {
            thisApp.templates[n] = data;
          });
          defers.push(defer);
        }
      });

      return $.when.apply($, defers);
    },
    // Wrapper around getting a template
    template: function(name) {
      return this.templates[name];
    },

    /**
     * Data source handling.  For development, we can call
     * the data directly from the JSON file, but for production
     * we want to proxy for JSONP.
     *
     * `name` should be name of file, minus .json
     *
     * Returns jQuery's defferred object.
     */
    getLocalData: function(name) {
      var thisApp = this;
      var proxyPrefix = this.options.jsonpProxy;
      var useJSONP = false;
      var defers = [];

      name = (_.isArray(name)) ? name : [ name ];

      // If the data path is not relative, then use JSONP
      if (this.options && this.options.dataPath.indexOf('http') === 0) {
        useJSONP = true;
      }

      // Go through each file and add to defers
      _.each(name, function(d) {
        var defer;
        d = d + '.json';

        if (_.isUndefined(thisApp.data[d])) {
          if (useJSONP) {
            defer = $.jsonp({
              url: proxyPrefix + encodeURI(thisApp.options.dataPath + d)
            });
          }
          else {
            defer = $.getJSON(thisApp.options.dataPath + d);
          }

          $.when(defer).done(function(data) {
            thisApp.data[d] = data;
          });
          defers.push(defer);
        }
        else {
          defer = $.Deferred();
          defer.resolveWith(thisApp, [thisApp.data[d]]);
          defers.push(defer);
        }
      });

      return $.when.apply($, defers);
    },

    /**
     * Get remote data.  Provides a wrapper around
     * getting a remote data source, to use a proxy
     * if needed, such as using a cache.
     */
    getRemoteData: function(options) {
      if (this.options.remoteProxy) {
        options.url = options.url + '&callback=proxied_jqjsp';
        options.url = app.options.remoteProxy + encodeURIComponent(options.url);
        options.callback = 'proxied_jqjsp';
        options.cache = true;
      }
      else {
        options.url = options.url + '&callback=?';
      }

      return $.jsonp(options);
    },

    // Placeholder start
    start: function() {
    }
  });
})(jQuery);

mpData = mpData || {}; mpData["minnpost-mpls-mayoral-questionnaire"] = mpData["minnpost-mpls-mayoral-questionnaire"] || {}; mpData["minnpost-mpls-mayoral-questionnaire"]["questions_answers.json"] = {"2013 Mayoral Questionnaire":{"answers":[{"id":1,"candidate":"Mark Andrew","image":"MarkAndrew250.png","summary-1":"sdfsdfds","question-1":"answer here M 1","summary-2":"sdfdsf","question-2":"answer here M 2","summary-3":"sdlkfjsdf","question-3":"answer here M 3","question-4":"answer here.  answer here.  answer here.  answer here.  answer here.  answer here.  answer here.  answer here.  answer here.  answer here.  answer here.  answer here.  answer here.  answer here.  answer here.  answer here.  answer here.  answer here.  answer here.  answer here.  answer here.  answer here.  answer here.  answer here.  answer here.  answer here.  answer here.  answer here.  answer here.  answer here.  answer here.  answer here.  answer here.  answer here.  answer here.  ","question-5":"answer here M 3","rowNumber":1},{"id":2,"candidate":"Ron Samuels","image":"DonSamuels250.png","summary-1":"sdfsdfds","question-1":"answer here R 1","summary-2":"sdfdsf","question-2":"answer here R 2","summary-3":"ssssssssss","question-3":"answer here R 3","question-4":"answer here R 3","question-5":"answer here R 3","rowNumber":2},{"id":3,"candidate":"Besty Hodges","image":"BetsyHodges250.png","summary-1":"a","question-1":"aaa","summary-2":"","question-2":"","summary-3":"","question-3":"","question-4":"","question-5":"","rowNumber":3},{"id":4,"candidate":"Bob Fine","image":"BobFine250.png","summary-1":"b","question-1":"bbbb","summary-2":"","question-2":"","summary-3":"","question-3":"","question-4":"","question-5":"","rowNumber":4},{"id":5,"candidate":"Cam Winton","image":"CamWinton250.png","summary-1":"c","question-1":"","summary-2":"","question-2":"","summary-3":"","question-3":"","question-4":"","question-5":"","rowNumber":5},{"id":6,"candidate":"Dan Cohen","image":"dancohen250.jpg","summary-1":"d","question-1":"","summary-2":"","question-2":"","summary-3":"","question-3":"","question-4":"","question-5":"","rowNumber":6},{"id":7,"candidate":"Gary Schiff","image":"GarySchiff250.png","summary-1":"e","question-1":"","summary-2":"","question-2":"","summary-3":"","question-3":"","question-4":"","question-5":"","rowNumber":7},{"id":8,"candidate":"Jackie Cherryhomes","image":"JackieCherryhomes250.png","summary-1":"f","question-1":"","summary-2":"","question-2":"","summary-3":"","question-3":"","question-4":"","question-5":"","rowNumber":8},{"id":9,"candidate":"Jim Thomas","image":"JimThomas250.png","summary-1":"g","question-1":"","summary-2":"","question-2":"","summary-3":"","question-3":"","question-4":"","question-5":"","rowNumber":9},{"id":10,"candidate":"Stephanie Woodruff","image":"StephanieWoodruff250.png","summary-1":"h","question-1":"","summary-2":"","question-2":"","summary-3":"","question-3":"","question-4":"","question-5":"","rowNumber":10}],"questions":[{"id":1,"shortname":"Closing the Gap","question":"In this campaign we have heard frequent references to the gaps that separate Minneapolis residents in terms of education, employment and housing.  Explain how you, as mayor, will work to eliminate one of these gaps. (<a href=\"http://www.minnpost.com/learning-curve/2013/03/reset-effort-focuses-achievement-gap-and-shows-ways-close-it\">Learn more</a>)","rowNumber":1},{"id":2,"shortname":"Property Taxes","question":"What would you do as mayor to prevent yearly increases in property taxes? (<a href=\"http://www.startribune.com/politics/statelocal/228488671.html\">Learn more</a>)","rowNumber":2},{"id":3,"shortname":"Vikings Stadium","question":"With continuing opposition to the funding and process surrounding construction of the Vikings stadium, how would you proceed both in terms of bringing the community together and ensuring that future development in that area benefits all of Minneapolis? (<a href=\"http://www.minnpost.com/cityscape/2013/08/sorting-out-ins-and-outs-downtown-east\">Learn more</a>)","rowNumber":3},{"id":4,"shortname":"Police Chief","question":"After a year of high-profile controversies, what would you do as mayor to bring change to the Police Department, and are you likely to retain Janee Harteau as police chief?  Why? (<a href=\"http://www.minnpost.com/two-cities/2013/05/minneapolis-officials-back-police-chief-harteau-s-limited-comments-friday-events\">Learn more</a>)","rowNumber":4},{"id":5,"shortname":"SWLRT","question":"When you take office, one of your first key decisions may involve the controversial Southwest LRT line. What will you do to help influence the final route and its impact on city neighborhoods? And what will you do if you are unhappy with the route selected? (<a href=\"http://www.minnpost.com/politics-policy/2013/10/mayor-rybak-calls-intense-study-southwest-lrt-options-during-90-day-delay\">Learn more</a>) ","rowNumber":5},{"id":6,"shortname":"Streetcars","question":"Do you favor streetcars or expanded bus service for the proposed Nicollet/Central transit route -- and why? What’s your overall transit philosophy for the city? (<a href=\"http://www.minnpost.com/politics-policy/2013/09/streetcars-endorsed-minneapolis-central-nicollet-transit-line\">Learn more</a>)  ","rowNumber":6},{"id":7,"shortname":"Education","question":"With the schools and achievement gap emerging as major issues in the mayor’s race, what's the most surprising thing you've learned about education since you began campaigning, and how might it change your thinking? (<a href=\"http://www.minnpost.com/learning-curve/2013/08/why-minneapolis-mayoral-candidates-are-making-strong-schools-such-big-issue\">Learn more</a>)","rowNumber":7},{"id":8,"shortname":"Orchestra Lockout","question":"With the resignation of musical director Osmo Vänskä and the newly remodeled Orchestra Hall vacant and silent, what would you do as mayor to help resolve the dispute if the lockout is still in effect in January?  (<a href=\"http://www.minnpost.com/politics-policy/2013/09/politicians-frustrated-too-orchestra-dispute-approaches-do-or-die-weekend\">Learn more</a>)","rowNumber":8}]}}; 



mpTemplates = mpTemplates || {}; mpTemplates['minnpost-mpls-mayoral-questionnaire'] = {"template-application":"<div class=\"grid-container grid-parent {{ (canStore) ? 'can-store' : '' }}\">\n  <div class=\"grid-100 message-container\"></div>\n\n  <div class=\"grid-100 grid-parent content-container\"></div>\n\n  <div class=\"grid-100 grid-parent footnote-container\"></div>\n</div>","template-candidates":"<div class=\"question-menu grid-20 mobile-grid-20 tablet-grid-20\">\n  <div class=\"question-menu-inner\">\n    <h5>Issues</h5>\n\n    <ul>\n      {{#questions:q}}\n        <li><a href=\"#question-{{ id }}\" on-tap=\"slideTo:{{ id }}\">{{ shortname }}</a></li>\n      {{/questions}}\n    </ul>\n\n    <h5>Candidates</h5>\n\n    <ul>\n      {{#candidates:c}}\n        <li>{{ starred }} &mdash; {{ candidate }}</li>\n      {{/candidates}}\n    </ul>\n  </div>\n</div>\n\n<div class=\"candidates-questions-answers grid-80 mobile-grid-80 tablet-grid-80\">\n  {{#questions:q}}\n    <div class=\"question grid-100 grid-parent\" id=\"question-{{ id }}\">\n      <p class=\"question-text\"><span class=\"question-title\">{{ shortname }}:</span> {{{ question }}}</p>\n\n      {{#answers:a}}\n        <div class=\"answer grid-50\" id=\"answer-{{ q }}-{{ a }}\">\n          <div class=\"answer-inner\">\n            <div class=\"answer-image\"><img src=\"{{ imagePath }}{{ image }}\" /></div>\n            <div class=\"star {{ (starred) ? 'starred' : '' }}\" on-tap=\"star:{{ q }},{{ a }}\">★</div>\n\n            <h5>{{ candidate }}</h5>\n\n            <div class=\"summary-answer\">\n              <p class=\"summary-text\"><strong>Summary</strong>: {{ summary }}</p>\n\n              {{#answer}}\n                <a class=\"read-more\" href=\"read-more-{{ q }}-{{ a }}\" on-tap=\"readMore:{{ q }},{{ a }}\">Read more</a>\n                <p class=\"answer-text\">{{ answer }}</p>\n              {{/answer}}\n            </div>\n          </div>\n        </div>\n      {{/answers}}\n    </div>\n  {{/questions}}\n</div>","template-footnote":"<div class=\"footnote\">\n  <p>Candidate answers were recieved via a questionnaire that MinnPost sent to candidates.  <span class=\"remove-local-storage\">Your preferences are stored locally on your browser, and for your own privacy, you can <a class=\"remove-storage\" on-tap=\"removeStorage\" href=\"#remove\">remove the local data</a>.</span>  Some code, techniques, and data on <a href=\"https://github.com/zzolo/minnpost-mpls-mayoral-questionnaire\" target=\"_blank\">Github</a>.</p>\n</div>","template-loading":"<div class=\"loading-container\">\n  <div class=\"loading\"><span>Loading...</span></div>\n</div>"};

/**
 * Main app logic for: minnpost-mpls-mayoral-questionnaire
 */
(function(App, $, undefined) {
  _.extend(App.prototype, {
    // Start function that starts the application.
    start: function() {
      var thisApp = this;
      var templates = ['template-application', 'template-footnote', 'template-candidates', 'template-loading'];

      // Check if we can use local storage
      this.checkCanStore();

      // Get templates
      this.getTemplates(templates).done(function() {
        // Render the container and "static" templates.
        thisApp.applicationView = new App.prototype.ApplicationView({
          el: thisApp.$el,
          template: thisApp.template('template-application'),
          data: {
            canStore: thisApp.canStore
          }
        });
        thisApp.footnoteView = new App.prototype.FootnoteView({
          el: thisApp.$el.find('.footnote-container'),
          template: thisApp.template('template-footnote')
        });
        thisApp.footnoteView.app = thisApp;

        // Get data.  Can't seem to find a way to use mustache and nested
        // loops to be able to reference question ids, so that means
        // we repeat data into a question collection
        thisApp.getLocalData(['questions_answers']).done(function(data) {
          var questionsAnswers = [];
          answers = data['2013 Mayoral Questionnaire'].answers;
          questions = data['2013 Mayoral Questionnaire'].questions;

          // Get local data
          thisApp.questions = thisApp.fetch();

          // We actually want to see if things have changed so that
          // the localstorage can be replaced.  In another version, the starred
          // should have been saved separately
          _.each(questions, function(q, qi) {
            var qID = 'question-' + q.id;
            var sID = 'summary-' + q.id;
            q.answers = [];

            _.each(answers, function(a, ai) {
              var answer = {};
              answer.answer = a[qID];
              answer.summary = a[sID];

              _.each(a, function(c, ci) {
                if (ci.indexOf('question') !== 0 && ci.indexOf('summary') !== 0) {
                  answer[ci] = c;
                }
              });

              q.answers.push(answer);
            });

            questionsAnswers.push(q);
          });

          if (_.isUndefined(thisApp.questions)) {
            // Create collections container and store locally
            thisApp.questions = new App.prototype.QuestionsCollection(questionsAnswers);
            thisApp.save();
          }
          else {
            // Check if things have changed
            thisApp.invalidateLocalStorage(questionsAnswers);
          }

          // Aggregate the data
          thisApp.aggregateCandidates();

          // Create view
          thisApp.candidatesView = new App.prototype.CandidatesView({
            el: thisApp.$el.find('.content-container'),
            template: thisApp.template('template-candidates'),
            data: {
              candidates: thisApp.candidates,
              questions: thisApp.questions,
              imagePath: thisApp.options.imagePath
            },
            adaptors: [ 'Backbone' ]
          });
          thisApp.candidatesView.app = thisApp;
        });
      });
    },

    // Function to turn questions data into candidates model
    aggregateCandidates: function() {
      var thisApp = this;

      // Create collection if needed
      if (!_.isObject(this.candidates)) {
        this.candidates = new App.prototype.CandidatesCollection();
      }

      // Go through the questions and answers and get
      // any candidates to add to collection
      this.questions.each(function(q, qi) {
        _.each(q.get('answers'), function(a, ai) {
          var c = thisApp.candidates.get(a.id);

          if (_.isUndefined(c)) {
            c = new App.prototype.CandidateModel(a);
            thisApp.candidates.add(c);
          }
        });
      });

      // Go through each candidate, then count the stars of each question
      this.candidates.each(function(c, ci) {
        var starred = 0;

        thisApp.questions.each(function(q, qi) {
          _.each(q.get('answers'), function(a, ai) {
            if (a.starred && a.id === c.id) {
              starred++;
            }
          });
        });

        c.set('starred', starred);
      });
    },

    // Check if localstorage is available
    checkCanStore: function() {
      var mod = 'modernizr';
      try {
        localStorage.setItem(mod, mod);
        localStorage.removeItem(mod);
        this.canStore = true;
        return true;
      }
      catch(e) {
        this.canStore = false;
        return false;
      }
    },

    // Save questions to local store
    save: function() {
      if (this.canStore) {
        localStorage.setItem(this.options.localStorageKey, JSON.stringify(this.questions));
      }
    },

    // Get questions to local store
    fetch: function() {
      var stored;

      if (this.canStore) {
        stored = localStorage.getItem(this.options.localStorageKey);
        if (stored) {
          return new App.prototype.QuestionsCollection(JSON.parse(stored));
        }
        else {
          return undefined;
        }
      }
      else {
        return undefined;
      }
    },

    // Destroy
    destroy: function() {
      if (this.canStore) {
        return localStorage.removeItem(this.options.localStorageKey);
      }
    },

    // Look to see if we need to update the local storage
    invalidateLocalStorage: function(recentData) {
      var invalidate = false;
      var current = JSON.parse(JSON.stringify(this.questions));

      if (_.size(current) != _.size(recentData) ||
        !_.isEqual(_.pluck(current, 'question'), _.pluck(recentData, 'question'))) {
        invalidate = true;
      }

      _.each(recentData, function(r, ri) {
        _.each(r.answers, function(a, ai) {
          if (a.answer !== current[ri].answers[ai].answer ||
            a.summary !== current[ri].answers[ai].summary) {
            invalidate = true;
          }
        });
      });

      if (invalidate) {
        this.questions = new App.prototype.QuestionsCollection(recentData);
        this.save();
      }
    }
  });

  // Models
  App.prototype.CandidateModel = Backbone.Model.extend({
  });
  App.prototype.QuestionModel = Backbone.Model.extend({
  });

  // Collections
  App.prototype.CandidatesCollection = Backbone.Collection.extend({
    model: App.prototype.CandidateModel
  });
  App.prototype.QuestionsCollection = Backbone.Collection.extend({
    model: App.prototype.QuestionModel
  });

  // Views
  App.prototype.ApplicationView = Ractive.extend({
  });
  App.prototype.FootnoteView = Ractive.extend({
    init: function() {
      this.on('removeStorage', function(e) {
        e.original.preventDefault();
        this.app.destroy();
      });
    }
  });
  App.prototype.CandidatesView = Ractive.extend({
    init: function() {
      // Sticky sidebar
      this.sidebar();

      // Handle starrring
      this.on('star', function(e) {
        e.original.preventDefault();
        var current = this.get(e.keypath + '.starred');
        this.set(e.keypath + '.starred', (current) ? false : true);
        this.app.aggregateCandidates();
        this.app.save();
      });

      // Read more
      this.on('readMore', function(e, parts) {
        e.original.preventDefault();
        var q = parts.split(',')[0];
        var a = parts.split(',')[1];
        var $answer = $(this.el).find('#answer-' + q + '-' + a);
        $answer.find('.read-more, .summary-text').fadeOut(function() {
          $answer.find('.answer-text').slideDown();
        });
      });

      // Slide
      this.on('slideTo', function(e, id) {
        e.original.preventDefault();
        var top = $(this.el).find('#question-' + id).offset().top;
        $('html, body').animate({ scrollTop: top - 15}, 750);
      });
    },

    // Sticky sidebar
    sidebar: function() {
      var $sidebar = $('.question-menu');
      var origW = $sidebar.width();

      $sidebar.stick_in_parent({
        offset_top: 10
      });

      // The width gets set to a specific value for some reason
      $sidebar.on("sticky_kit:stick", function(e) {
        $(this).width(origW);
      });
    }
  });
})(mpApps['minnpost-mpls-mayoral-questionnaire'], jQuery);