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
        thisApp.candidates = new App.prototype.CandidatesCollection({

        });

        thisApp.candidatesView = new App.prototype.CandidatesView({
          el: thisApp.$el.find('.content-container'),
          template: thisApp.template('template-candidates'),
          data: thisApp.candidates
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