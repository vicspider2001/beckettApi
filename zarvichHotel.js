var express = require('express');
var zarvich = express();
var dotenv = require('dotenv');
var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
dotenv.config();
var MongoUrl = "mongodb+srv://beckettUser:testbeckettUser@cluster0.plig8.mongodb.net/theBeckett?retryWrites=true&w=majority";
var cors = require('cors')
const bodyparser = require('body-parser');
const res = require('express/lib/response');
var port = process.env.PORT || 1400;
var db;



zarvich.use(bodyparser.urlencoded({extended:true}));
zarvich.use(bodyparser.json());
zarvich.use(cors());
zarvich.use(express());


zarvich.get('/',(re,res)=>{
    res.send("This is root page")
})

//return all roomtypes
zarvich.get('/rooms', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={roomtype_id:Number(req.query.id)}
    }
//return roomtypes wrt facilities
    else if(req.query.facility){
        var facility = Number(req.query.facility)
        query={'facilies.facility_id':Number(req.query.facility)}
    }

//return roomtypes wrt roomType_Id
    else if (req.query.details){
        var details= Number(req.query.details)
        query={'roomtype_id':Number(req.query.details)}
    }




    db.collection('hoteldata').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

//return all hotel bookings
zarvich.get('/bookings', (req,res) => {
    db.collection('reservations').find().toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})


// post bookings to reservation database 
zarvich.post('/bookNow',(req,res)=>{
	console.log(req.body);
	db.collection('reservations').insert(req.body,(err,result)=>{
		if(err) throw err;
		res.send("Reservation Placed")
	})
})
//Delete bookings in Reservation (Note the Query)
zarvich.delete('/delBooking',(req,res)=>{
    var query = req.query.id
    db.collection('reservations').deleteOne({id:query},(err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})

zarvich.post('/roomitems',(req,res) => {
    console.log(req.body);
    db.collection('BookedRooms').find({roommenu_id:{$in:req.body}}).toArray((err,result) => {
         if(err) throw err;
        res.send(result)
    })
        
})


//Delete pictures in Home Page carousel
zarvich.delete('/homepixdel',(req,res)=>{
     var query = req.query.gallery_id
    db.collection('homePageGallery').deleteOne({gallery_id:query},(err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})
//post pictures to home page carousel
zarvich.post('/homepix',(req,res)=>{
	console.log(req.body);
	db.collection('homePageGallery').insertOne(req.body,(err,result)=>{
		if(err) throw err;
		res.send("Reservation Placed")
	})
})

// return all blogs
zarvich.get('/Getblog', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={roomtype_id:Number(req.query.id)}
    }

    //return a single blog
    else if(req.query.OneBlog){
        var OneBlog = (req.query.OneBlog)
        query={'_id':(OneBlog)}
    }


    
    db.collection('blog').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})


//Get Blog Comments
zarvich.get('/GetblogComments', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={roomtype_id:Number(req.query.id)}
    }

    //return a Comment by ID
    else if (req.query.ActiveComment){
        var ActiveComment= (req.query.ActiveComment)
        query={_id:(req.query.ActiveComment)}
    }

        
    db.collection('blogComments').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})


//Delete blog
zarvich.delete('/delBlog/:id',(req,resp)=>{
    console.log(req.params.id);
    db.collection('blog').deleteOne(
        {_id: (req.params.id)},(err,result)=>{
        if(err) throw err;
        resp.send(result)
    })
    
})


//Update blog Comments
zarvich.post('/updateComments',(req,res)=>{
	console.log(req.body);
	db.collection('approvedComments').insert(req.body,(err,result)=>{
		if(err) throw err;
		res.send("Blog Posted")
	})
})

//Delete comment
zarvich.delete('/deleteComment/:id',(req,resp)=>{
    console.log(req.params.id);
    db.collection('blogComments').deleteOne(
        {_id: (req.params.id)},(err,result)=>{
        if(err) throw err;
        resp.send(result)
    })
    
})

// post blog to database 
zarvich.post('/blogPost',(req,res)=>{
	console.log(req.body);
	db.collection('blog').insert(req.body,(err,result)=>{
		if(err) throw err;
		res.send("Blog Posted")
	})
})

// return all approved blogs
zarvich.get('/GetApprovedComments', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={roomtype_id:Number(req.query.id)}
    }

    //return a single blog
    else if(req.query.OneApproved){
        var OneApproved = (req.query.OneApproved)
        query={'id':(OneApproved)}
    }


    
    db.collection('approvedComments').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

// post comments to database 
zarvich.post('/commentPost',(req,res)=>{
	console.log(req.body);
	db.collection('blogComments').insert(req.body,(err,result)=>{
		if(err) throw err;
		res.send("Blog Posted")
	})
})


//Put homecarousel images
zarvich.put('/carousel/:id',(req,res)=>{
    console.log(req.params.id);
    var id = Number(req.params.id)
    db.collection('carousel').updateOne(
        {gallery_id:id},
        {
            $set: {
                    image1:req.body.image1,
                    image2:req.body.image2,
                    image3:req.body.image3,
                    image4:req.body.image4,
                    image5:req.body.image5,
                    image6:req.body.image6,
                    image7:req.body.image7
                    
            }
        },
        
    )
    res.send('data updated')      
  
})

//Update Roomtypes details
zarvich.put('/roomsupdate/:id',(req,res)=>{
    console.log(req.params.id);
    var id = Number(req.params.id)
    db.collection('hoteldata').updateOne(
        {roomtype_id:id},
        {
            $set: {
                    roomtype_Name:req.body.roomtype_Name,
                    room_images:req.body.room_images,
                    room_rate:req.body.room_rate,
                    Description:req.body.Description,
                    Extras1:req.body.Extras1,
                    Extras2:req.body.Extras2,
                    Extras3:req.body.Extras3,
                    Extras4:req.body.Extras4,
                    Extras5:req.body.Extras5,
                    Extras6:req.body.Extras6,
                    Extras7:req.body.Extras7,
                    Extras8:req.body.Extras8,
                    facility1:req.body.facility1,
                    facility_Image2:req.body.facility_Image2,
                    facilty_description3:req.body.facilty_description3,
                    facility2:req.body.facilty2,
                    facility_Image3:req.body.facility_Image3,
                    facilty_description4:req.body.facilty_description4,
                    facilty3:req.body.facilty3,
                    facility_Image4:req.body.facility_Image4,
                    facilty_description5:req.body.facilty_description5,
                    facilty4:req.body.facilty4,
                    facility_Image5:req.body.facility_Image5,
                    facilty_description6:req.body.facilty_description6,
                    facilty5:req.body.facilty5,
                    facility_Image6:req.body.facility_Image6,
                    facilty_description7:req.body.facilty_description7,
                    gallery1:req.body.gallery1,
                    gallery2:req.body.gallery2, 
                    gallery3:req.body.gallery3,     
                    gallery4:req.body.gallery4,
                    gallery5:req.body.gallery5,
                    gallery6:req.body.gallery6
                    
            }
        },
        
    )
    res.send('data updated')      
  
})


//return all home page carousel
zarvich.get('/homegallery', (req,res) => {
    db.collection('homePageGallery').find().toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

//return all home page carousel
zarvich.get('/youtube', (req,res) => {
    db.collection('youtube').find().toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

// post bookings to reservation database 
zarvich.post('/contact',(req,res)=>{
	console.log(req.body);
	db.collection('contactform').insert(req.body,(err,result)=>{
		if(err) throw err;
		res.send("message Sent")
	})
})

// post bookings to reservation database 
zarvich.get('/contactus', (req,res) => {
    db.collection('contactform').find().toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})


//return all home page Images
zarvich.get('/homecarousel', (req,res) => {
    db.collection('homepagecarousel').find().toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})



//return all room page gallery
zarvich.get('/roomgallery', (req,res) => {
    db.collection('roomtypeGallery').find().toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

//Delete pictures in room Page Gallery
zarvich.delete('/roompixdel',(req,res)=>{
    var query = req.query.image_id
   db.collection('roomtypeGallery').deleteOne({image_id:query},(err,result)=>{
       if(err) throw err;
       res.send(result)
   })
})
//post pictures to room page Gallery
zarvich.post('/roompix',(req,res)=>{
   console.log(req.body);
   db.collection('roomtypeGallery').insertOne(req.body,(err,result)=>{
       if(err) throw err;
       res.send("Reservation Placed")
   })
})


//return all hotel gallery
zarvich.get('/hotelpics', (req,res) => {
    db.collection('HotelPix').find().toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

//Update hotel gallery
zarvich.put('/galupdt/:id',(req,res)=>{
    console.log(req.params.id);
    var id = Number(req.params.id)
    db.collection('HotelPix').updateOne(
        {hotelp_id:id},
        {
            $set: {
                    hotelix:req.body.hotelpix
                    
            }
        },
        
    )
    res.send('data updated')      
  
})

//Delete pictures in hotel Gallery
zarvich.delete('/delhotelpics',(req,res)=>{
    var query = req.query.hotelp_id
   db.collection('HotelPix').deleteOne({hotelp_id:query},(err,result)=>{
       if(err) throw err;
       res.send(result)
   })
})

//post pictures to hotel Gallery
zarvich.post('/addhotelpics',(req,res)=>{
   console.log(req.body);
   db.collection('HotelPix').insertOne(req.body,(err,result)=>{
       if(err) throw err;
       res.send("Reservation Placed")
   })
})


zarvich.post('/addnewsletter',(req,res)=>{
    console.log(req.body);
    db.collection('newsletter').insertOne(req.body,(err,result)=>{
        if(err) throw err;
        res.send("email added")
    })
 })
 
 zarvich.get('/allnewsletter', (req,res) => {
    db.collection('newsletter').find().toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

// return all facilities (Param)
zarvich.get('/amenities',(req,res) => {
    var query = {};
    console.log(req.query.facilities)
    if(req.query.facilities){
        query={facility_id:Number(req.query.facilities)}
    }


 // return all facilities wrt roomID (Query Param)
    else if(req.query.RoomID){
        var RoomID = (req.query.RoomID)
        query={"roomtype_id":Number(req.query.RoomID)}
    }

db.collection('roomFacility').find(query).toArray((err,result) => {
    if(err) throw err;
    res.send(result)
    })
})



MongoClient.connect(MongoUrl, (err,client) => {
    if(err) console.log("error while connecting");
    db = client.db('theBeckett');
    zarvich.listen(port,()=>{
        console.log(`listening on port ${port}`)
    })
})
