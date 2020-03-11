const PORT = process.env.PORT || 3001;

const express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  cors = require('cors'),
  admin = require('firebase-admin');

var serviceAccount = require("./testfluvip-firebase-adminsdk-gec6l-fca8887682.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://testfluvip.firebaseio.com'
})

const db = admin.firestore();

app.use(cors());
app.use(express.json())
app.use(bodyParser.urlencoded({extended: true}))

var dataUsers = [],
  dataPets = []

/** USER API SECTION */

/**
 * Obtiene todos los usuarios registrados
 */
app.get('/getusersList/', async (req,res) =>{
  var dataUserList = []
  db.collection('users').get()
  .then(snapshot => {
    snapshot.forEach(doc => {
      dataUserList.push([
        doc.id,
        doc.data()
      ])
    });
    return res.send(dataUserList)
  })
  .catch(err => {
    console.log('Error getting documents', err);
  });
  
});

/**
 * Obtiene un usuario en específico por su ID
 */
app.post('/getuser/',(req,res)=>{
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Methods', 'POST');
  res.header("Access-Control-Allow-Headers", "accept, content-type");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  res.header("Access-Control-Max-Age", "1728000");
  db.collection('users').doc(req.body.uidUser).get()
  .then(doc => {
    if (!doc.exists) {
      console.log('No such document!');
    } else {
      console.log('Document data:', doc.data());
      return res.send(doc.data())
    }
  })
  .catch(err => {
    console.log('Error getting document', err);
  });
  
})

app.post('/getuserpets/',(req,res)=>{
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Methods', 'POST');
  res.header("Access-Control-Allow-Headers", "accept, content-type");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  res.header("Access-Control-Max-Age", "1728000");
  var dataUserPetList = []
  db.collection('pets').where('owner', '==', req.body.uidUser).get()
  .then(snapshot => {
    
    if (snapshot.empty) {
      console.log('No matching documents.');
      return res.send('No matching documents.');
    }

    snapshot.forEach(doc => {
      dataUserPetList.push([
        doc.id,
        doc.data()
      ])
    });
    return res.send(dataUserPetList)
  })
  .catch(err => {
    console.log('Error getting documents', err);
  });
})

app.post('/updateuser/',(req,res)=>{
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Methods', 'POST');
  res.header("Access-Control-Allow-Headers", "accept, content-type");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  res.header("Access-Control-Max-Age", "1728000");

  if(req.body.name != '' && req.body.name != undefined){
    db.collection('users').doc(req.body.uidUser).update({
      name: req.body.name
    });
  }

  if(req.body.lastName != '' && req.body.lastName != undefined){
    db.collection('users').doc(req.body.uidUser).update({
      lastName: req.body.lastName
    });
  }

  if(req.body.email != '' && req.body.email != undefined){
    db.collection('users').doc(req.body.uidUser).update({
      email: req.body.email
    });
  }
  
  if(req.body.cellphone != '' && req.body.cellphone != undefined){
    db.collection('users').doc(req.body.uidUser).update({
      cellphone: req.body.cellphone
    });
  }
  
  return res.sendStatus(200)
})
  
app.post('/adduser/',(req,res)=>{
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Methods', 'POST');
  res.header("Access-Control-Allow-Headers", "accept, content-type");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  res.header("Access-Control-Max-Age", "1728000");
  
  const newUser = {
    name: req.body.name,
    lastName: req.body.lastname,
    email: req.body.email,
    cellphone: req.body.cellphone
  }

  db.collection('users').add(newUser);
  return res.sendStatus(200)
}) 

/** END USER API SECTION */

/** PETS API SECTION */
app.get('/getpets/', async (req,res) =>{
  dataPets = []
  db.collection('pets').get()
  .then(snapshot => {
    if (snapshot.empty) {
      console.log('No matching documents.');
      return;
    }
    
    snapshot.forEach(doc => {
      dataPets.push([
        doc.id,
        doc.data()
      ])
    });
    return res.send(dataPets)
  })
  .catch(err => {
    console.log('Error getting documents', err);
  });
});

app.post('/addpet/',(req,res)=>{
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Methods', 'POST');
  res.header("Access-Control-Allow-Headers", "accept, content-type");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  res.header("Access-Control-Max-Age", "1728000");
  
  const newPet = {
    name: req.body.name,
    race: req.body.race,
    typeOfFood: req.body.typeOfFood,
    specie: req.body.specie,
    deseases: req.body.deseases,
    owner: req.body.owner,
    cares: req.body.cares
  }

  db.collection('pets').add(newPet);
  return res.sendStatus(200)
}) 

/**
 * Obtiene una mascota en específica por su ID
 */
app.post('/getpet/',(req,res)=>{
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Methods', 'POST');
  res.header("Access-Control-Allow-Headers", "accept, content-type");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  res.header("Access-Control-Max-Age", "1728000");
  db.collection('pets').doc(req.body.uidPet).get()
  .then(doc => {
    if (!doc.exists) {
      console.log('No such document!');
    } else {
      console.log('Document data:', doc.data());
      return res.send(doc.data())
    }
  })
  .catch(err => {
    console.log('Error getting document', err);
  });
  
})

/**
 * Actualizar una mascota por una ID específica
 */
app.post('/updatepet/',(req,res)=>{
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Methods', 'POST');
  res.header("Access-Control-Allow-Headers", "accept, content-type");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  res.header("Access-Control-Max-Age", "1728000");
  
  if(req.body.race != '' && req.body.race != undefined){
    db.collection('pets').doc(req.body.uidPet).update({
      name: req.body.name,
      race: req.body.race,
      owner: req.body.owner,
      typeOfFood: req.body.typeOfFood,

    });
  
  
    if(req.body.deseases != '' && req.body.deseases != undefined){
      
      db.collection('pets').doc(req.body.uidPet).update({
        deseases: req.body.deseases,
        specie: req.body.specie
      });
    }
  }
  return res.sendStatus(200)
});


/** END PETS API SECTION */

app.listen(PORT,()=>{
  console.log('server on port',PORT)
})
  