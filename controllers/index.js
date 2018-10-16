module.exports = function(app){
  require("./scraperAPIRoutes")(app);
  require("./htmlRoutes")(app);
};
