
const express = require('express');
const mongoose = require('mongoose');
const hbs = require('hbs');

const app = express();
const dbUrl = "mongodb+srv://admin:funny94Model@cluster0.9qeewa1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";


// middleware
// app.use(express.static('public'));
// app.use(express.json()); // json encoding = {"width": "32", "height" : "33"}
app.use(express.urlencoded()); // url encoding = width=33&height=33 (assuming POST)

app.set('view engine', 'hbs');
// app.set('views')

//use mongoose to connect to mongodb database

mongoose.connect(dbUrl).then(() => console.log("connected")).catch((error) => console.log("error"));


// create new customer schema with mongoose

const schema = mongoose.Schema;


// scehma for database

// create new schema object and set it to a variable

const newContactSchema = new schema({
    firstName: String,
    lastName: String,
    phoneNumber: String,
    email: String,
    street: String,
    city: String,
    state: String,
    zipCode: String,


})

// create new schema object and set it equal to a variable

const newMeasurementSchema = new schema({
    width: Number,
    height: Number,
    windowType: String,
    windowThickness: String,
    removal: String,
    quantity: Number,

})

const newQuoteSchema = new schema({
    contact: Object,
    measurements: Array,
})


// create a contact object with a mongoose model
// create a measurement object with a mongoose model

const contact = mongoose.model('Contact', newContactSchema);

const measurement = mongoose.model('Measurement', newMeasurementSchema);

const quote = mongoose.model('Quote', newQuoteSchema);

const newQuote = new quote();



// endpoint GET request for homepage - display home page html

app.get('/', (req, res) => {

    res.render('home');
});



// endoponit GET request for the add contact form - display html form at /addContact

app.get('/addContact', async (req, res) => {

    // search db for all contacts and set to a variable

    let all = await contact.find();
    res.render('addContact', { all })

});



// endpoint POST requst for the add contact form on submission - retrieve all data from form input fields

app.post('/addContact', (req, res) => {



    // create new contact object and save to variable

    const newContact = new contact({

        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
        street: req.body.street,
        city: req.body.city,
        state: req.body.state,
        zipCode: req.body.zipCode,


    })



    //save new contact to mongodb database

    newContact.save().then((post) => console.log("new contact added to database:", post))
        .catch((error) => console.log("error adding contact to database:", error));



    newQuote.contact = newContact;

    res.render('addContactSuccess', { newContact: newContact })



});






// endpoint GET request for the add measurements form - display html form at /addMeasurements

app.get('/addMeasurements', (req, res) => {

    res.render('addMeasurements');

})


// initialize list array, totalQty and totalSqFt variables
let list = [];
let totalQty = 0;
let totalSqFt = 0;



// endpoint for the add measurments form - retrieve body data from html form at the submit post request

app.post('/addMeasurements', (req, res) => {

    // create new measurment object and save to variable

    let newMeasurement = new measurement({
        width: req.body.width,
        height: req.body.height,
        windowType: req.body.windowType,
        windowThickness: req.body.windowThickness,
        removal: req.body.removal,
        quantity: req.body.quantity,

    })





    // push object into an array names list
    // intialize totalQty to the current measurement object quantity plus current value of totalQty, 0
    // set totalSqFt equal to the current measurement object width and height, then divide by 144 to get sq ft
    // set totalSqFt equal to totalSqFt multiplied by the totalQty
    list.push(newMeasurement);
    console.log(list);
    totalQty = newMeasurement.quantity;
    totalSqFt = (newMeasurement.width * newMeasurement.height) / 144;
    totalSqFt = totalSqFt * totalQty;

    newQuote.measurements = list;
    console.log(newQuote);



    // for loop to loop through the list array
    for (let i = 0; i < list.length - 1; i = i + 1) {

        // set a variable num equal to current object quantity
        // set a variable w to the current object width
        // set a variable h to the current object height

        let num = list[i].quantity;
        let w = list[i].width;
        let h = list[i].height;

        // test logs
        console.log(w);
        console.log(h);
        console.log(w * h);


        //set totalQty variable to totalqty + num variable or the current objects quantity property
        totalQty = totalQty + num;


        // set a temp variable equal to the current object width and height divided by 144
        // set a temp sqft variable to the temp multiplied by the num variable
        // set total sq ft equal to totalsqft plus the tempsqft variable

        let temp = ((w * h) / 144);
        console.log(temp);

        let tempSqFt = temp * num;
        console.log(tempSqFt);

        totalSqFt = totalSqFt + tempSqFt;
        console.log(totalSqFt);

    }


    // parse float totalSqFt
    // set totalSqFt to ta fixed decimal amount 4
    totalSqFt = parseFloat(totalSqFt);
    totalSqFt = totalSqFt.toFixed(4);

    // loop through list
    // grab width and height and multiply then divide by 144 save to variable
    // multiply width * height variable with quantity and set to variable
    // set totalsqft variable to itself plus new variable


    res.render('addMeasurements', { list: list, totalSqFt, totalQty });

});



app.get('/confirmQuote', (req, res) => {



    res.render('confirmQuote', { list: list, totalSqFt, totalQty, newQuote: newQuote })

});

app.post('/confirmQuote', (req, res) => {

    newQuote.save().then((post) => console.log("Quote added to database", post)

    )
});





// all contacts dropdown endpoint

app.get('/allContacts', async (req, res) => {

    console.log(await contact.find());
    let all = await contact.find();

    res.render('allContacts', { all: all })

});


// app listening on local hosst port 3000

app.listen(3000, (req, res) => {

    console.log("server running on 3000");

});




