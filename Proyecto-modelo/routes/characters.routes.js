const router = require("express").Router();

const alert = require("alert");
const isLoggedIn = require("../middleware/isLoggedIn");
const Character = require("../models/Character.model");
const User = require("../models/User.model");
const Api = require("../services/ApiHandler");
const CharactersAPI = new Api()

router.get('/characters',(req, res)=>{
    
    
    CharactersAPI
    .getAllCharacters()
    .then((allCharacters) => {
        console.log(allCharacters.data.results[0])
        res.render(`characters/list`, {characters: allCharacters.data.results} )
    
    })
    .catch(err => console.log(err));
    
    
    
})

router.post("/add-favorite", isLoggedIn ,(req, res) =>{
const query = { name, status, species, gender, image, apiId } = req.body
const idToCheck = req.body.apiId;
    Character.find({apiId: idToCheck})
	.then (charArray => {
		//comprobar si ese apiId ya esta en db characters
		if (charArray.length === 0) {
            Character
                .create(query)
                .then(result => {
                  User
                    .findByIdAndUpdate(req.user._id,{$push : {favorites : result._id}})
                    .then(()=>{
                        res.redirect("/characters")
                    })
                })
                .catch(err => console.log(err))
        } else {
			//Comprobar si ese apiId ya esta en User/favorites
			User
			.findByIdAndUpdate(req.user._id,{$push : {favorites : charArray[0]._id}})
			.then(()=>{
				res.redirect("/characters")
			})
		}
	}) 
})

// { field: { $nin: [ value1, value2, ..... , valueN ] } } ???

router.post("/delete-favorite",isLoggedIn,(req,res)=>{
    const {id} = req.body
    User.findByIdAndUpdate(req.user._id,{$pull : {favorites : id}})
    .then(()=>{
        res.redirect("/profile")
    })
    .catch(err => console.log(err))
})

module.exports = router;