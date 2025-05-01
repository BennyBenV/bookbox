const Review = require("../models/Review");

exports.getReviewsByBook = async (req, res) =>{
    try{
        const { olid } = req.params;
        const reviews = await Review.find({olid}).sort({createdAt: -1}).populate("userId", "username avatar");
        res.json(reviews.map(r => ({
            rating : r.rating,
            review : r.review,
            user: r.userId?.username || "Anonymous",
            avatar: r.userId?.avatar || "/uploads/avatars/default.jpg",
            createdAt : r.createdAt
        })));
    }catch(err){
        res.status(500).json({message: "Erreur getReviewsByBook"});
    }
}

exports.createOrUpdateReview = async (req,res) => {
    try{
        const {olid, rating, review} = req.body;
        const existing = await Review.findOne({ userId: req.user.id, olid});

        if(existing){
            existing.rating = rating;
            existing.review = review;
            await existing.save();
            return res.json(existing);
        }

        const newReview = await Review.create({
            userId: req.user.id,
            olid,
            rating,
            review,
        });
        
        res.status(201).json(newReview);
    }catch(err){
        res.status(500).json({message: "Erreur createOrUpdateReview"});
    }
}

exports.getAverageRating = async (req,res) => {
    const {olid} = req.params;

    try{
        //Récupère tous les livres ayant ce même OLID
        const reviews = await Review.find({olid, rating: {$gt: 0} });

        if (reviews.length === 0 ){
            return res.json({average: null, count: 0});
        }
        const total = reviews.reduce((sum,b) => sum + b.rating, 0);
        const average = total / reviews.length;

        res.json({ average: Number(average.toFixed(2)), count: reviews.length });
    }catch(error){
        console.error("Erreur calcul moyenne note : ", error);
        res.status(500).json({ message : "Erreur lors du calcul de la moyenne." })
    }
}
