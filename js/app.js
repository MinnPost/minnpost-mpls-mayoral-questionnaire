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

          // Make questions and answers if needed
          if (_.isUndefined(thisApp.questions)) {
            // Parse questions and answers
            _.each(questions, function(q, qi) {
              var qID = 'question-' + q.id;
              var sID = 'summary-' + q.id;
              q.answers = [];

              _.each(answers, function(a, ai) {
                var answer = {};
                answer.answer = a[qID];
                answer.summary = a[sID];

                _.each(a, function(c, ci) {
                  if (ci.indexOf('question') !== 0 || ci.indexOf('summary') !== 0) {
                    answer[ci] = c;
                  }
                });

                q.answers.push(answer);
              });

              questionsAnswers.push(q);
            });

            // Create collections container
            thisApp.questions = new App.prototype.QuestionsCollection(questionsAnswers);

            // Store locally
            thisApp.save();
          }

          // Aggregate the data
          thisApp.aggregateCandidates();

          // Create view
          thisApp.candidatesView = new App.prototype.CandidatesView({
            el: thisApp.$el.find('.content-container'),
            template: thisApp.template('template-candidates'),
            data: {
              candidates: thisApp.candidates,
              questions: thisApp.questions
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