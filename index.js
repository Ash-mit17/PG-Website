require('dotenv').config()
const express=require("express")
const bodyParser=require("body-parser")
const ejs=require("ejs")
const app=express()

app.use(bodyParser.urlencoded({extended:true}))
app.set('view engine', 'ejs');
app.use(express.static("public"));


const mongoose=require("mongoose");

mongoose.connect(process.env.Address,{useNewUrlParser:true})
    .then(async ()=>{console.log("connected with database")})

const Schema= mongoose.Schema({
    name:{
        type:String,
        required:[true,'Must provide name'],
        maxlength:[20,'should not be more than 20 words']
    },
    rating:{
        type:Number,
        required:[true,'Must provide rating']
    },
    review:{
        type:String,
        required:[true,'Must provide review']
    }
})

const Review= mongoose.model("review",Schema);


app.get("/",async (req,res)=>{
    await Review.find({rating:{$gt:3.9}}).sort({rating:-1})
    .then(async (found)=>{
        // console.log(found);
        var namearray=[];
        var ratingarray=[];
        var reviewarray=[];
        await found.forEach(element => {
            namearray.push(element.name);
            ratingarray.push(element.rating);
            reviewarray.push(element.review);
        });
        // console.log(namearray,ratingarray,reviewarray);
        res.render("home",{names:namearray,rates:ratingarray,reviews:reviewarray});
    })
})

app.post("/",async (req,res)=>{
    let userName=req.body.name;
    let userRating=req.body.rating;
    let userReview=req.body.message;
    const item = new Review({
        name:userName,
        rating:userRating,
        review:userReview
    });
    await item.save();
    await Review.find({rating:{$gt:3.0}}).sort({rating:-1})
    .then(async (found)=>{
        var namearray1=[];
        var ratingarray1=[];
        var reviewarray1=[];
        await found.forEach(element => {
            namearray1.push(element.name);
            ratingarray1.push(element.rating);
            reviewarray1.push(element.review);
        });
        res.render("home",{names:namearray1,rates:ratingarray1,reviews:reviewarray1});
    })
})

app.listen(3000,(req,res)=>{
    console.log("Server live on port 3000");
})