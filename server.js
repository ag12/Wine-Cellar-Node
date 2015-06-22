(function(){
    "use strict"
    // call the packages we need
    var express = require("express"),
        mongoose   = require("mongoose"),
        bodyParser = require("body-parser"),
        Wine = require('./Wine'),
        app = express();

    // for parsing application/json
    app.use(bodyParser.json());

    // for parsing application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: true }));

    var port = process.env.PORT || 8080,        // set our port
        router = express.Router();

    router.use(function (req, res, next) {
        console.log("Server is called on: " + req.originalUrl);
        next();
    });
    router.get("/", function(req, res){
        res.send(200);
    });



    function getWineFromBody (req) {
        var wine = new Wine(),
            body = req.body;

        if (body) {
            wine.id = body.id;
            wine.name = body.name;
        }
        return wine;
    }
    router.route("/wines")
        .post(function (req, res) {
            // create a new instance of the Wine model
            var wine = new Wine(),
                body = req.body;

            if (body) {
                wine.id = body.id;
                wine.name = body.name;
                wine.grapes = body.grapes;
                wine.country = body.country;
                wine.region = body.region;
                wine.year = body.year;
                wine.picture = body.picture;
                wine.description = body.description;
            }
            wine.save(function (err) {
                if (err) {
                    res.send(err);
                } else {
                    res.json({message : "Wine created", status: 200});
                }
            });
        })
        .get(function (req, res) {
            Wine.find(function (err, wines) {
                if(err) {
                    res.send(err);
                } else {
                    res.json(wines);
                }
            });
        });

    router.route('/wines/:wine_id')
        .get(function (req, res) {
            Wine.findById(req.params.wine_id, function (err, wine) {
                if (err) {
                    console.log("Problem getting wine by id")
                    res.send(err);
                } else {
                    res.json({message : "Wine get by id", status: 200, wine: wine});
                }
            });
        })
        .put(function (req, res) {
            Wine.findById(req.params.wine_id, function (err, wine) {
                if (err) {
                    res.send(err);
                } else {
                    var body = req.body;
                    if (body) {
                        wine.id = body.id || wine.id;
                        wine.name = body.name || wine.name;
                        wine.grapes = body.grapes || wine.grapes;
                        wine.country = body.country || wine.country;
                        wine.region = body.region || wine.region;
                        wine.year = body.year || wine.year;
                        wine.picture = body.picture || wine.picture;
                        wine.description = body.description || wine.description;
                    }
                    wine.save(function (err) {
                        if (err) {
                            res.send(err);
                        } else {
                            res.json({message : "Wine updated", status: 200});
                        }
                    });
                }
            });
        })
        .delete(function (req, res) {
            Wine.remove({ _id: req.params.wine_id },
                function (err, wine) {
                    if (err) {
                        res.send(err);
                    } else {
                        res.json({message : "Wine deleted", status: 200});
                    }
                });
        });



    router.route('/wine/:wine_name')
        .get(function (req, res) {
            Wine.find({name: req.params.wine_name}, function (err, wine) {
                if (err) {
                    res.send(err);
                } else {
                    res.json({message : "Wine get ny name", status: 200, wine: wine});
                }
            });
        });


    app.use("/api", router);
    app.listen(port);

    console.log("Server runs on port: " + port);

    //DATABASE
    mongoose.connection.on("error", console.error.bind(console, "connection error:"));
    mongoose.connection.once("open", function () {
        console.log("connection to database open: yay");
    });
    mongoose.connect("mongodb://localhost/wine"); // connect to our database

})();
