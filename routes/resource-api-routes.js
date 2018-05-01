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

     app.get("/api/users", function (req, res) {
        db.User.findAll({}).then(function (dbUsers) {
            res.json(dbUsers);
        });
    });


     // Route for returning the public resources
     app.get("/api/public", function (req, res) {
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
             user.getSharedResources({
                 include: [db.User]
             }).then(function (dbResource) {
                 console.log(JSON.stringify(dbResource));
                 res.json(dbResource);
             })
         });
     });

     // Route for adding the user's resources
     app.post("/api/resources", function (req, res) {
         db.Resource.create({
             topic: req.body.topic,
             link: req.body.link,
             description: req.body.description,
             isPublic: req.body.isPublic,
             UserId: req.body.UserId
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
     app.put("/api/resources/:id", function (req, res) { 
         db.Resource.update(
             req.body, {
                 where: {
                     id: req.params.id
                 }
             }).then(function (dbResource) {
             res.json(dbResource);
         });
     });

     // Route for adding the shared resources
     app.post("/api/shared", function (req, res) {
         console.log("in shared post" + req.body.userToShareId + " resourceId: " + req.body.resourceId);
         db.User.findById(req.body.userToShareId).then(function (user) {
             user.addSharedResources([req.body.resourceId]).then(function (dbResource) {
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