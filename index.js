const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hqbzo.mongodb.net/swe?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const BasicCollection = client.db('swe').collection('basic')
const NoticeCollection = client.db('swe').collection('notice');
const ResearchCollection = client.db('swe').collection('research');
const UsersCollection = client.db('swe').collection('users');


//crate a single notice
// post
// /create-notice
// {
//     "title": "Eid holiday notice als",
//     "description": "school is off from next thursday"
// }
app.post('/create-notice', async (req, res) => {
    const newNotice = req.body;
    const result = await NoticeCollection.insertOne(newNotice);
    res.send(result);
});

//get all notice
// get
// /all-notice
app.get('/all-notice', async (req, res) => {
    const query = {};
    const options = {
        sort: { _id: -1 } // Sort by _id in descending order
    };
    const result = await NoticeCollection.find(query, options).toArray();
    res.send(result);
});


//crate a single research
// post
// /create-research
// {
//     "title": "Ensemble Ml Designing for the very first time",
//     "description": "this research is all about system Designing and extra things"
// }
app.post('/create-research', async (req, res) => {
    const newResearch = req.body;
    const result = await ResearchCollection.insertOne(newResearch);
    res.send(result);
});

//get all research
// get
// /all-research
app.get('/all-research', async (req, res) => {
    const query = {};
    const options = {
        sort: { _id: -1 } // Sort by _id in descending order
    };
    const result = await ResearchCollection.find(query, options).toArray();
    res.send(result);
})

//create a single user
// post
// /registration-user
// {
//     "email": "marufmurshed9255@gmail.com",
//     "password": "123xx",
//     "role": "teacher"
// }
app.post('/registration-user', async (req, res) => {
    const user = req.body;
    const result = await UsersCollection.insertOne(user);
    console.log(result);

    let respondMessage = {
        success: true,
        email: user.email,
        role: user.role
    }

    if (result.acknowledged == true) {
        res.send(respondMessage);
    } else {
        res.send({ success: false });
    }
});

// logged in of a user
// post
// /login-user
// {
//     "email": "junechakma@gmail.com",
//     "password": "123xx"
// }
app.post('/login-user', async (req, res) => {
    const userInfo = req.body;
    const resultEmail = await UsersCollection.findOne({ email: userInfo.email })

    let resultPassword;
    if (resultEmail.password == userInfo.password) {
        resultPassword = true;
    }

    const result = {
        success: resultPassword,
        email: resultEmail.email,
        role: resultEmail.role
    }
    res.send(result);
});


// get all users
// get
// /all-users
app.get('/all-users', async (req, res) => {
    const query = {};
    const result = await UsersCollection.find(query).toArray();
    res.send(result);
})


//delete a single user
// /users/:id
// users/66718ccc6effacb16dd3bc74
app.delete('/users/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) }
    const result = await UsersCollection.deleteOne(query);
    if (result.acknowledged == true) {
        res.send({ message: "user deleted successfully" });
    }
})

//delete a single notice
// /notice/:id
// notice/66718ccc6effacb16dd3bc74
app.delete('/notice/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) }
    const result = await NoticeCollection.deleteOne(query);
    if (result.acknowledged == true) {
        res.send({ message: "notice deleted successfully" });
    }
})

//delete a single research
// /research/:id
// research/66718ccc6effacb16dd3bc74
app.delete('/research/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) }
    const result = await ResearchCollection.deleteOne(query);
    if (result.acknowledged == true) {
        res.send({ message: "research deleted successfully" });
    }
})

//finished here























// app.post('/user-login', async (req, res) => {
//     const user = req.body;
//     const result = await UsersCollection.insertOne(user);
//     res.send(result);
// });

// //

// app.delete('/users/:id', async (req, res) => {
//     const id = req.params.id;
//     const query = { _id: new ObjectId(id) }
//     const result = await UsersCollection.deleteOne(query);
//     res.send(result);
// })

// app.get('/emptimeacceptordeny', async (req, res) => {
//     const email = req.query.email;
//     const query = { accept: false };
//     const filter = { email: email }
//     const result = await UsersCollection.find(filter).toArray();
//     const result1 = result[0];
//     const result2 = result1.restaurantnamecode;
//     const result3 = { restaurantcode: result2, accept: false };
//     const result5 = await EmployeeTimesCollection.find(result3).toArray();
//     res.send(result5);
// })

// app.get('/emptotaltime', async (req, res) => {
//     const email = req.query.email;
//     // const filter = { 'accept': true }
//     const query = { email: email };
//     const result = await EmployeeTimesCollection.find(query).toArray();
//     res.send(result);
// })

// app.get('/emptotaltimebymanager', async (req, res) => {
//     const email = req.query.email;
//     const query = { email };
//     const result = await UsersCollection.find(query).toArray();
//     const result1 = (result[0]).restaurantnamecode;
//     const filter = { 'restaurantcode': result1 }
//     const result2 = await EmployeeTimesCollection.find(filter).toArray();
//     // console.log(result2)
//     res.send(result2);
// })


// app.patch('/empaccept/:id', async (req, res) => {
//     const id = req.params.id;
//     const filter = { _id: new ObjectId(id) };
//     const options = { upsert: true };
//     const updateDoc = {
//         $set: {
//             accept: true
//         }
//     }
//     const result = await EmployeeTimesCollection.updateOne(filter, updateDoc, options)
//     res.send(result)
// })

// app.post('/employeetimerecord', async (req, res) => {
//     const record = req.body;
//     const result = await EmployeeTimesCollection.insertOne(record);
//     res.send(result);
// })


// app.get('/employeeprofile/:id', async (req, res) => {
//     const id = req.params.id;
//     const filter = { _id: new ObjectId(id) }
//     const result = await UsersCollection.findOne(filter)
//     const result2 = await EmployeeTimesCollection.find({ email: result.email }).toArray()
//     res.send(result2)
// })

// app.get('/users/employee/:email', async (req, res) => {
//     const email = req.params.email;
//     const query = { email }
//     const user = await UsersCollection.findOne(query);
//     res.send({ isEmployee: user?.userType === 'employee' })
// })

// app.get('/users/manager/:email', async (req, res) => {
//     const email = req.params.email;
//     const query = { email };
//     const user = await UsersCollection.findOne(query);
//     res.send({ isManager: user?.userType === 'manager' })
// })

// app.get('/users/admin/:email', async (req, res) => {
//     const email = req.params.email;
//     const query = { email };
//     const user = await UsersCollection.findOne(query);
//     res.send({ isAdmin: user?.userType === 'admin' })
// })

app.get('/', (req, res) => {
    res.send('Software Engineering Site is running successfully!')
})

app.listen(port, () => {
    console.log(`Software Engineering Site is running successfully! on port ${port}`)
})