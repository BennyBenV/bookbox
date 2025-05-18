const User = require("../models/User");

exports.followUser = async (req, res) => {
    const { username } = req.params;
    const followerId = req.user.id;

    try{
        const userToFollow = await User.findOne({username});
        if (!userToFollow) return res.status(404).json({message: "Utilisateur introuvable"});
        if (userToFollow._id.equals(followerId)) return res.status(400).json({message: "Impossible de se suivre soi-même"});

        const alreadyFollowing = userToFollow.followers.includes(followerId);
        if (alreadyFollowing) return res.status(400).json({message: "Déjà abonné"});

        userToFollow.followers.push(followerId);
        await userToFollow.save();

        await User.findByIdAndUpdate(followerId, {
            $addToSet: {following: userToFollow._id},
        });


        res.json({success: true, message: `Vous suivez ${username}` });
    }catch(err){
        console.error("followUser: ", err);
        res.status(500).json({message: "Erreur server" });
    }
};

exports.unfollowUser = async (req, res) => {
  const { username } = req.params;
  const followerId = req.user.id;

  try {
    const userToUnfollow = await User.findOne({ username });
    if (!userToUnfollow)
      return res.status(404).json({ message: "Utilisateur introuvable" });

    // ➤ Retire l'ID du suivi dans ma liste
    await User.findByIdAndUpdate(followerId, {
      $pull: { following: userToUnfollow._id },
    });

    // ➤ Retire mon ID de ses followers
    await User.findByIdAndUpdate(userToUnfollow._id, {
      $pull: { followers: followerId },
    });


    res.json({ success: true, message: `Vous ne suivez plus ${username}` });
  } catch (err) {
    console.error("unfollowUser:", err);
    res.status(500).json({ message: "Erreur server" });
  }
};

exports.getFollowers = async (req, res) => {
    try{
        const user = await User.findOne({username: req.params.username}).populate("followers", "username avater");
        if (!user) return res.status(404).json({message: "Utilisateur introuvable"});
        res.json({success: true, followers: user.followers});
    }catch(err){
        res.status(500).json({message: "Erreur serveur"});
    }
}

exports.getFollowing = async (req, res) => {
    try{
        const user = await User.findOne({ username: req.params.username }).populate("following", "username avatar");
        if (!user) return res.status(404).json({message: "Utilisateur introuvable"});
        res.json({success: true, following: user.following});
    }catch(err){
        res.status(500).json({message: "Erreur serveur"});
    }
}

exports.isFollowing = async (req, res) => {
  try {
    const targetUser = await User.findOne({ username: new RegExp(`^${req.params.username}$`, 'i') });
    if (!targetUser) return res.status(404).json({ success: false, message: "Utilisateur introuvable" });

    const me = await User.findById(req.user.id).select("following");

    
    const isFollowing = me.following.some(followedId =>
      followedId.toString() === targetUser._id.toString()
    );

    
    res.json({ success: true, following: isFollowing });
  } catch (err) {
    console.error("isFollowing error:", err);
    res.status(500).json({ success: false, message: "Erreur isFollowing" });
  }
};
