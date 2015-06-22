(function(){
    "use strict"
    // call the packages we need
    var mongoose   = require("mongoose"),
        Schema = mongoose.Schema,
        WineSchema = new Schema({
            Id:  { type: Number},
            name: String,
            grapes: String,
            country: String,
            region: String,
            year: String,
            picture: String,
            description: String
        });
    module.exports = mongoose.model("Wine", WineSchema);
})();
