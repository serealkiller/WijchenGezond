var cb;
var exports = module.exports = {};
var A = require('./../models/mongooseSchemas').A;
var G = require('./../models/mongooseSchemas').G;
var HC = require('./../models/mongooseSchemas').HC;
var SC = require('./../models/mongooseSchemas').SC;

var resp = function (message, data) {
    return {
        message : message,
        data : data
    }
}

exports.createActiviteit = function (gegevens, callback) {
    var slaActiviteitOp = function (newActiviteit) {
        newActiviteit.save(function (error, data) {
            if (error) {
                console.log(error);
                callback(resp("Er is iets misgegeaan.", gegevens));
            } else {
                callback(resp("De activiteit is succesvol opgeslagen.", data));
                console.log(data);
            }
        });
    }
    var maakActiviteit = function () {
        var newActiviteit = new A();
        newActiviteit.naam = gegevens.naam;
        newActiviteit.creatorId = gegevens.creatorId;
        newActiviteit.subCategorieId = gegevens.subCategorieId;
        newActiviteit.doorloopTijd = gegevens.doorloopTijd;
        newActiviteit.intensiteit = gegevens.intensiteit;
        newActiviteit.puntenPerDeelnemer = gegevens.puntenPerDeelnemer;
        newActiviteit.groep = gegevens.groep;
        newActiviteit.omschrijving = gegevens.omschrijving;
        newActiviteit.gesloten = false;
        newActiviteit.deelnemers = gegevens.deelnemers;
        if (gegevens.doorloopTijd === 'eenmalig') {
            newActiviteit.eenmalig = gegevens.eenmalig;
        } else {
            newActiviteit.wekelijks = gegevens.dagen;
        }
        if (gegevens.groep) {
            newActiviteit.minPers = gegevens.minPers;
            newActiviteit.maxPers = gegevens.maxPers;
        } else {
            newActiviteit.minPers = 1;
            newActiviteit.maxPers = 1;
        }
        newActiviteit.verzamelPlaats = gegevens.verzamelPlaats;
        console.log(newActiviteit);
        slaActiviteitOp(newActiviteit);
    }
    var valideerIntensiteit = function () {
        if (gegevens.intensiteit === "beginner" || gegevens.intensiteit === "gevorderd" || gegevens.intensiteit === "expert") {
            maakActiviteit();
        } else {
            callback(resp("De gegeven intensiteit is niet valide.", gegevens));
        }
    }
    var valideerDoorloopTijd = function () {
        if (gegevens.doorloopTijd === "eenmalig" || gegevens.doorloopTijd === "wekelijks") {
            valideerIntensiteit();
        } else {
            callback(resp("De gegeven doorloop tijd is niet valide.", gegevens));
        }
    }
    var valideerSubCategorieId = function () {
        SC.find({_id : gegevens.subCategorieId}, function (error, data) {
            if (error) {
                console.log(error);
                callback(resp("De gegeven subCategorie bestaat niet.", gegevens));
            } else {
                if (data[0]) {
                    valideerDoorloopTijd();
                } else {
                    callback(resp("De gegeven subCategorie bestaat niet.", gegevens));
                }
            }
        });
    }
    var valideerCreatorId = function () {
        G.find({_id : gegevens.creatorId}, function (error, data) {
            if (error) {
                console.log(error);
                callback(resp("De gegeven gebruiker bestaat niet.", gegevens));
            } else {
                if (data[0]) {
                    valideerSubCategorieId();
                } else {
                    callback(resp("De gegeven gebruiker bestaat niet.", gegevens));
                }
            }
        });
    }
    var valideerNaam = function () {
        if (gegevens.naam.length > 4) {
            valideerCreatorId();
        } else {
            callback(resp("De gegeven naam is niet valide.", gegevens));
        }
    }
    var valideerVelden = function () {
        if (gegevens.naam && gegevens.creatorId && gegevens.subCategorieId && gegevens.intensiteit && gegevens.doorloopTijd && gegevens.minPers && gegevens.maxPers && gegevens.puntenPerDeelnemer) {
            valideerNaam();
        } else {
            callback(resp("Niet alle verplichte velden zijn gegeven.", gegevens));
        }
    }
    valideerVelden();
};

exports.getActiviteit = function (_id, callback) {
    A.find({_id : _id}, function (error, data) {
        if (error) {
            console.log(error);
            callback(resp("De gezochte avtiviteit kan niet gevonden worden.", _id));
        } else {
            if (data[0]) {
                callback(resp("De gezochte avtiviteit is gevonden.", data));
            } else {
                callback(resp("De gezochte avtiviteit kan niet gevonden worden.", _id));  
            }
        }
    });
};

exports.getActiviteiten = function (callback) {
    var acts;
    var stuurActs = function () {
        var alleActs = [];
        for (i = 0; i < acts.length; i += 1) {
            alleActs[i] = {
                act : acts[i],
                creator : acts[i].creator,
                subCategorie : acts[i].subCategorie,
                deelnemers : acts[i].deelNemersGevuld,
                aantalDeelnemers : acts[i].setAantalDeelnemers,
                dagen : acts[i].dagen,
                datum : acts[i].datum
            }
            console.log(acts[i]);
        }

        callback(resp("Hierbij de activiteiten", alleActs));
    }
    var setDagNamen = function () {
        var i, x, dagen;
        for (i = 0; i < acts.length; i += 1) {
            dagen = [];
            if (acts[i].doorloopTijd === "eenmalig") {
                acts[i].datum = new Date(acts[i].eenmalig.beginTijd);
                acts[i].dagen = [{
                    dagNaam : acts[i].eenmalig.beginTijd[0]+acts[i].eenmalig.beginTijd[1]+acts[i].eenmalig.beginTijd[2],
                    beginTijd : acts[i].eenmalig.beginTijd[16] + acts[i].eenmalig.beginTijd[17] + acts[i].eenmalig.beginTijd[18] + acts[i].eenmalig.beginTijd[19] + acts[i].eenmalig.beginTijd[20]
                }];
            } else if (acts[i].doorloopTijd === "wekelijks") {
                acts[i].datum = new Date(acts[i].wekelijks[0].beginTijd);
                for (x = 0; x < acts[i].wekelijks.length; x += 1) {
                    dagen[x] = {
                        dagNaam : acts[i].wekelijks[x].beginTijd[0]+acts[i].wekelijks[x].beginTijd[1]+acts[i].wekelijks[x].beginTijd[2],
                        beginTijd : acts[i].wekelijks[x].beginTijd[16] + acts[i].wekelijks[x].beginTijd[17] + acts[i].wekelijks[x].beginTijd[18] + acts[i].wekelijks[x].beginTijd[19] + acts[i].wekelijks[x].beginTijd[20]
                    }
                }
                acts[i].dagen = dagen;
            }
        }
        stuurActs();
    }
    var setAantalDeelnemers = function () {
        var i;
        for (i = 0; i < acts.length; i += 1) {
            acts[i].setAantalDeelnemers = acts[i].deelnemers.length + "/" + acts[i].maxPers;
        }
        setDagNamen();
    }
    var voegSubCategorieenToe = function () {
        var i;
        var validateKlaar = acts.length - 1;
        var voegSubCategorieToe = function (nummer) {
            SC.find({_id : acts[nummer].subCategorieId}, function (error, res) {
                acts[nummer].subCategorie = res[0];
                if (nummer === validateKlaar) {
                    setAantalDeelnemers();
                }
            });
        }
        for (i = 0; i < acts.length; i += 1) {
            voegSubCategorieToe(i);
        }
    }
    var voegDeelnemersToe = function () {
        var i, x;
        var validateKlaar = acts.length - 1;

        var voegDeelnemerToe = function (nummerI) {
            console.log(nummerI);
            var dn = acts[nummerI].deelnemers;
            var validateKlaar = dn.length - 1;
            var i;
            var gevuldeDeelnemers = [];

            var voegToe = function (nummerX) {
                G.find({_id : dn[nummerX]}, function (error, res) {
                    gevuldeDeelnemers[nummerX] = res;
                    if (nummerX === validateKlaar) {
                        acts[nummerI].deelNemersGevuld = gevuldeDeelnemers;
                    }
                    if (nummerI === acts.length - 1) {
                        voegSubCategorieenToe();
                    }
                });
            }
            if (dn.length === 0) {
                if (nummerI === acts.length - 1) {
                        voegSubCategorieenToe();
                }
            } else {
                for (i = 0; i < dn.length; i += 1) {
                    voegToe(i);
                }
            }
        }

        for (i = 0; i < acts.length; i += 1) {
            voegDeelnemerToe(i);
        }
    }
    var voegMakersToe = function () {
        var i;
        var validateKlaar = acts.length - 1;
        var voegMakerToe = function (nummer) {
            G.find({_id : acts[nummer].creatorId}, function (error, res) {
                acts[nummer].creator = res[0];
                if (nummer === validateKlaar) {
                    voegDeelnemersToe();
                }
            });
        }
        for (i = 0; i < acts.length; i += 1) {
            voegMakerToe(i);
        }
    }
    var getActs = function () {
        A.find(function (error, data) {
            if (error) {
                console.log(error);
                callback(resp("De gezochte avtiviteiten kunnen niet gevonden worden.", false));
            } else {
                if (data.length > 0) {
                    acts = data;
                    voegMakersToe();
                } else {
                    callback(resp("Er zijn 0 activiteiten.", false));
                }
            }
        });
    }
    getActs();
};

exports.voegDeelnemerToe = function (gegevens, callback) {
    var act;
    var slaActOp = function() {
        act.save(function(error, data) {
            if (error) {
                console.log(error);
                callback(resp("Het toegevoegen aan de activiteit is mislukt.", gegevens));
            } else {
                callback(resp("Je bent toegevoegd aan de activiteit.", data));
            }
        });
    }
    var voegDeelnemerToeActiviteit = function() {
        act.deelnemers.push(gegevens._id);
        slaActOp();
    }
    var checkOfAlDeelnemer = function () {
        var i;
        for (i = 0; i < act.deelnemers.length; i += 1) {
            if (gegevens._id === act.deelnemers[i]) {
                callback(resp("Je doet al mee aan deze activiteit.", gegevens));
                return;
            }
        }
        voegDeelnemerToeActiviteit();
    }
    var valideerAct = function () {
        if (!act.groep) {
            callback(resp("De opgegeven activiteit is geen groepsactiviteit.", gegevens));
        } else if (act.deelnemers.length >= act.maxPers) {
            callback(resp("De opgegeven activiteit is al vol.", gegevens));
        } else {
            checkOfAlDeelnemer();
        }
    }
    var valideerActiviteit = function () {
        A.find({_id : gegevens.activiteitId}, function (error, data) {
            if (error) {
                console.log(error);
                callback(resp("De opgegeven activiteit bestaat niet.", gegevens));
            } else {
                if (data[0]) {
                    act = data[0];
                    valideerAct();
                } else {
                    callback(resp("De opgegeven activiteit bestaat niet.", gegevens));
                }
            }
        });
    }
    var valideerGebruiker = function () {
        G.find({_id : gegevens._id}, function (error, data) {
            if (error) {
                console.log(error);
                callback(resp("De opgegeven gebruiker bestaat niet.", gegevens));
            } else {
                if (data[0]) {
                    valideerActiviteit();
                } else {
                    callback(resp("De opgegeven gebruiker bestaat niet.", gegevens));
                }
            }
        });
    }
    var valideerVelden = function () {
        if (gegevens.activiteitId && gegevens._id) {
            valideerGebruiker();
        } else {
            callback(resp("Niet alle verplichte velden zijn gegeven.", gegevens));
        }
    }
    valideerVelden();
}

exports.verwijderDeelnemer = function (gegevens, callback) {
    var act;
    var slaActOp = function() {
        act.save(function(error, data) {
            if (error) {
                console.log(error);
                callback(resp("Het verwijderen uit de activiteit is mislukt.", gegevens));
            } else {
                callback(resp("Je bent verwijderd uit de activiteit.", data));
            }
        });
    }
    var checkOfDeelnemerEnVerwijder = function () {
        var i;
        for (i = 0; i < act.deelnemers.length; i += 1) {
            if (act.deelnemers[i] === gegevens._id) {
                act.deelnemers.splice(i,1);
            }
        }
        slaActOp();
    }
    var valideerActiviteit = function () {
        A.find({_id : gegevens.activiteitId}, function (error, data) {
            if (error) {
                console.log(error);
                callback(resp("De opgegeven activiteit bestaat niet.", gegevens));
            } else {
                if (data[0]) {
                    act = data[0];
                    checkOfDeelnemerEnVerwijder();
                } else {
                    callback(resp("De opgegeven activiteit bestaat niet.", gegevens));
                }
            }
        });
    }
    var valideerGebruiker = function () {
        G.find({_id : gegevens._id}, function (error, data) {
            if (error) {
                console.log(error);
                callback(resp("De opgegeven gebruiker bestaat niet.", gegevens));
            } else {
                if (data[0]) {
                    valideerActiviteit();
                } else {
                    callback(resp("De opgegeven gebruiker bestaat niet.", gegevens));
                }
            }
        });
    }
    var valideerVelden = function () {
        if (gegevens.activiteitId && gegevens._id) {
            valideerGebruiker();
        } else {
            callback(resp("Niet alle verplichte velden zijn gegeven.", gegevens));
        }
    }
    valideerVelden();
}

exports.filterActiviteiten = function () {
    var actsEenmalig;
    var actsWekelijks;
    var slaActiviteitenOp = function () {

    }
    var slaMeterOp = function () {

    }
    var updateMeter = function () {

    }
    var berekenNieuweData = function () {

    }
    var filterActs = function () {

    }
    var getActiviteiten = function () {
        A.find(function (error, data) {
            if (error) {
                console.log(error);
                callback(resp("Er is een error opgetreden.", false));
            } else {
                filterActs(data);
            }
        });
    }
}
