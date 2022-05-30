const router = require("express").Router();
const user = require("../../backend/mongo/models/user/user");
const guild = require("../../backend/mongo/models/guild/guild");

router.get("/", async (req, res) => {

    if(req.query.guild_id){
        return res.redirect(`/guild/${req.query.guild_id}`)
    }
  
    let user_fetched;
    let new_user = (data) => { 
       user_fetched = data;
    };
  
    if(req.isAuthenticated()){
      await req.client.getRESTUser(req.user.id).then((e) => new_user(e));
    }

});

module.exports = router;