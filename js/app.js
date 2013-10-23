/**
 * Main app logic for: minnpost-mpls-mayoral-questionnaire
 */
(function(App, $, undefined) {
  _.extend(App.prototype, {
    // Start function that starts the application.
    start: function() {
      var thisApp = this;
      var templates = ['template-application', 'template-footnote', 'template-candidates', 'template-loading'];

      this.getTemplates(templates).done(function() {
        // Render the container and "static" templates.
        thisApp.applicationView = new Ractive({
          el: thisApp.$el,
          template: thisApp.template('template-application')
        });
        thisApp.footnoteView = new Ractive({
          el: thisApp.$el.find('.footnote-container'),
          template: thisApp.template('template-footnote')
        });

        // Get data.  Can't seem to find a way to use mustache and nested
        // loops to be able to reference question ids, so that means
        // we repeat data into a question collection
        thisApp.getLocalData(['questions_answers']).done(function(data) {
          var questionsAnswers = [];
          answers = data['2013 Mayoral Questionnaire'].answers;
          questions = data['2013 Mayoral Questionnaire'].questions;

          // Parse questions and answers
          _.each(questions, function(q, qi) {
            var qID = 'question-' + q.id;
            q.answers = [];

            _.each(answers, function(r, ri) {
              var answer = {};
              answer.answer = r[qID];

              _.each(r, function(c, ci) {
                if (ci.indexOf('question') !== 0) {
                  answer[ci] = c;
                }
              });

              q.answers.push(answer);
            });

            questionsAnswers.push(q);
          });

          // Create collections container
          thisApp.questions = new App.prototype.QuestionsCollection(questionsAnswers);
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
  App.prototype.CandidatesView = Ractive.extend({
    init: function() {

      // Handle starrring
      this.on('star', function(e) {
        var current = this.get(e.keypath + '.starred');
        this.set(e.keypath + '.starred', (current) ? false : true);
        this.app.aggregateCandidates();
      });
    }
  });
})(mpApps['minnpost-mpls-mayoral-questionnaire'], jQuery);