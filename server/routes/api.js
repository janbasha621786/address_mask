const express=require('express');
const router=express.Router();
const jwt=require('jsonwebtoken');
var mongoose=require('mongoose');
var User=require('../models/user')
var database=null;
// mongoose.connect('mongodb://localhost/test');
mongoose.connect('mongodb://addressmask:addressmask12@ds263989.mlab.com:63989/mailmask',{ useNewUrlParser: true },function (err,db) {
    if(!err) {
        console.log("DB Connected");
        database=db;
    }
})

function verifyToken(req,res,next) {
    if(!req.headers.authorization){
        return res.status(401).send('Unauthorized request');
    }
    var token=req.headers.authorization.split(' ')[1];
    if(token==null){
        return res.status(401).send('Unauthorized request');
    }
    var payload=jwt.verify(token,'secretKey')
    if(!payload){
        return res.status(401).send('Unauthorized request');
    }
    req.userId=payload.subject;
    next();
}

router.get('/',function (req,res) {
    res.send('From api route');
});

router.post('/register',function (req,res) {
    var userData=req.body;
    var user=new User(userData);
    user.save(function (err,registeredUser) {
        if(err) console.log("error");
        else{
            var payload={ subject : registeredUser._id }
            var token=jwt.sign(payload,'secretKey');
            res.status(200).send({token:token});
        }
    })
})

router.post('/login',function (req,res) {
    var userData=req.body;
    User.findOne({email:userData.email},function (err,user) {
        if(err) console.log(err)
        else{
            if(!user){
                res.status(401).send('Invalid email');
            }else{
                if(userData.password!=user.password){
                    res.status(401).send('Invalid Password');
                }else{
                    console.log("*****************")
                    var payload={subject:user._id};
                    var token=jwt.sign(payload,'secretKey');
                    res.status(200).send({token:token});
                }
            }
        }
    })
})

// router.post('/prodDetails',verifyToken,function (req,res) {
//     var product=req.body;
//     database.collection("products").insertOne(product,function (err,result) {
//         if(!err) res.json({success:true});
//         else res.json({success:false});
//     })
// })

// router.get('/getProducts',verifyToken,function (req,res) {
//     database.collection("products").find({quantities:{$gt:0}}).toArray(function (err,products) {
//         if(!err) res.json({products:products});
//         else console.log(err);
//     })
// })

// router.get('/getSales',verifyToken,function (req,res) {
//     database.collection("sales").find({}).toArray(function (err,sales) {
//         if(!err) res.json({sales:sales})
//         else res.json({error:err});
//     })
// })
// router.post('/getSalesFilter',verifyToken,function(req,res){
//     // console.log(req.body);
//     var min=req.body.min;
//     var max=req.body.max;
//     database.collection("sales").find({total_price: { $lte: max },total_price:{$gte:min}}).toArray(function (err,sales) {
//         if(!err) {
//             // console.log(sales)
//             res.json({sales: sales})
//         }
//         else res.json({error:err});
//     })
// })
// router.post('/getDateFilter',verifyToken,function (req,res) {
//     var start=req.body.start;
//     var end=req.body.end;
//     // console.log(req.body);
//     database.collection("sales").find({$or:[{time_stamp:start},{time_stamp: end}]}).toArray(function (err,sales) {
//         if(!err) {
//             console.log(sales)
//             res.json({sales: sales})
//         }
//         else res.json({error:err});
//     })
// })

//1536604200,
//1536517800, 10

// router.post('/saleDetails',verifyToken,function (req,res) {
//     var sale=req.body;
//     var time_stamp=new Date().setHours(0,0,0,0)/1000;
//     sale.time_stamp=time_stamp;

//     // var query={}
//
//     // })
//     // console.log()
//     var id =sale.product_id
//     var count=sale.p_quantity
//     // database.collection("products").find({_id:id}).toArray(function (err,products) {
//     //     if(!err) console.log(products)
//     //     else console.log(err);
//     // })
//     database.collection("products").update({name:sale.p_name},{$inc:{quantities: - count}},{ multi : true },function (err,result) {
//         if(!err) {
//             // console.log(result)
//             database.collection("sales").insertOne(sale, function (err, sale) {
//                 if (!err) res.json({id: sale.insertedId});
//                 else res.json({error: err});
//             })
//         }
//         else console.log(err);
//     })
//
// })

module.exports=router;

// router.get('/events',function (req,res) {
//     var events=[
//         {
//             "_id":1,
//             "name" : "Auto Expo",
//             "description" : "lorem ipsum",
//             "date":"2012-04-23T18:25:43.511Z"
//         },
//         {
//             "_id":2,
//             "name" : "Auto Expo",
//             "description" : "lorem ipsum",
//             "date":"2012-04-23T18:25:43.511Z"
//         },
//         {
//             "_id":3,
//             "name" : "Auto Expo",
//             "description" : "lorem ipsum",
//             "date":"2012-04-23T18:25:43.511Z"
//         }
//     ]
//     res.json(events);
// })

// router.get('/special',verifyToken,function (req,res) {
//     var events=[
//         {
//             "_id":1,
//             "name" : "Auto Expo",
//             "description" : "lorem ipsum",
//             "date":"2012-04-23T18:25:43.511Z"
//         },
//         {
//             "_id":2,
//             "name" : "Auto Expo",
//             "description" : "lorem ipsum",
//             "date":"2012-04-23T18:25:43.511Z"
//         },
//         {
//             "_id":3,
//             "name" : "Auto Expo",
//             "description" : "lorem ipsum",
//             "date":"2012-04-23T18:25:43.511Z"
//         }
//     ]
//
//     res.json(events);
// })

