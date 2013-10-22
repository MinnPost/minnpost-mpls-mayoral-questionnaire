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

        // Get data
        thisApp.getLocalData(['questions_answers']).done(function(data) {
          var questions = {};
          data = data['2013 Mayoral Questionnaire'];

          // Create collections container
          thisApp.candidates = new App.prototype.CandidatesCollection();

          // Parse out the data
          _.each(data, function(r, i) {
            // The first row is the questions
            if (i === 0) {
              _.each(r, function(c, n) {
                if (n.indexOf('q') === 0) {
                  questions[n] = c;
                }
              });
            }
          });
          _.each(data, function(r, i) {
            var candidate;
            var answers = {};

            // Now add each candidate and data
            if (i > 0) {
              candidate = new App.prototype.CandidateModel({});

              _.each(r, function(c, n) {
                if (n.indexOf('q') !== 0) {
                  candidate.set(n, c);
                }
                else {
                  answers[n] = {
                    answer: c,
                    question: questions[n]
                  };
                }
              });

              candidate.set('answers', answers);
              thisApp.candidates.add(candidate);
            }
          });
          console.log(thisApp.candidates);
          // Create view
          thisApp.candidatesView = new App.prototype.CandidatesView({
            el: thisApp.$el.find('.content-container'),
            template: thisApp.template('template-candidates'),
            data: {
              candidates: thisApp.candidates
            },
            adaptors: [ 'Backbone' ]
          });
        });
      });
    }
  });

  // Models
  App.prototype.CandidateModel = Backbone.Model.extend({

  });

  // Collections
  App.prototype.CandidatesCollection = Backbone.Collection.extend({
    model: App.prototype.CandidateModel
  });

  // Views
  App.prototype.CandidatesView = Ractive.extend({
    init: function() {
    }
  });
})(mpApps['minnpost-mpls-mayoral-questionnaire'], jQuery);