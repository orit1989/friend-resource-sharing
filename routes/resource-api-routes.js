 var db = require("../models");

 module.exports = function (app) {

     app.get("/api/resources/:userId", function (req, res) {
         db.Resource.findAll({
             //  include: [db.User],
             where: {
                 userId: req.params.userId,
             }
         }).then(function (dbResource) {
             res.json(dbResource);
         });
     });

     // Route for returning the public resources
     app.get("/api/resources/public", function (req, res) {
         db.Resource.findAll({
             where: {
                 isPublic: true
             }
         }).then(function (dbResource) {
             res.json(dbResource);
         });
     });

     // Route for returning the shared resources
     app.get("/api/resources/:userId/shared", function (req, res) {
         db.User.findById(req.params.userId).then(function (user) {
             user.getSharedResources().then(function (dbResource) {
                 res.json(dbResource);
             })
         });
     });

     // Route for adding the user's resources
     app.post("/api/resources", function (req, res) {
         console.log(req.body);
         db.Resource.create({
             topic: req.body.topic,
             link: req.body.link,
             description: req.body.description,
             isPublic: req.body.isPublic,
             UserId: JSON.parse(req.body.UserId).id
         }).then(function (result) {
             res.json(result)
         })
     });

     // DELETE route for deleting resources
     app.delete("/api/resources/:id", function (req, res) {
         db.Resource.destroy({
             where: {
                 id: req.params.id
             }
         }).then(function (dbResource) {
             res.json(dbResource);
         });
     });

     // PUT route for updating posts
     app.put("/api/resources", function (req, res) {
         db.Resource.update(
             req.body, {
                 where: {
                     id: req.body.id
                 }
             }).then(function (dbResource) {
             res.json(dbResource);
         });
     });

     // Route for adding the shared resources
     app.post("/api/resources/:id/shared", function (req, res) {
         db.User.findById(req.params.id).then(function (user) {
             user.addResources([req.body.resouceId]).then(function (dbResource) {
                 res.json(dbResource);
             })
         });
     });

     // Route for deleting the shared resources
     app.delete("/api/resources/:id/shared", function (req, res) {
         db.User.findById(req.params.id).then(function (user) {
             user.removeResources([req.body.resouceId]).then(function (dbResource) {
                 res.json(dbResource);
             })
         });
     });

 }