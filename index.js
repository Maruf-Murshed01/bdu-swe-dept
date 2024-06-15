const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hqbzo.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const UsersCollection = client.db('QamlaWorkingTab').collection('users')
const EmployeeTimesCollection = client.db('QamlaWorkingTab').collection('employeetimes')

const totalWorkHourFunc = function (x, y) {
    const timestamp1 = x;
    const timestamp2 = y;

    const date1 = new Date(timestamp1);
    const date2 = new Date(timestamp2);

    const timeDifference = Math.abs(date1 - date2);
    const formattedDifference = new Date(timeDifference).toISOString()

    return formattedDifference;
}


app.post('/users', async (req, res) => {
    const user = req.body;
    const result = await UsersCollection.insertOne(user);
    res.send(result);
});

app.get('/users', async (req, res) => {
    const query = {};
    const result = await UsersCollection.find(query).toArray();
    res.send(result);
})

app.delete('/users/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) }
    const result = await UsersCollection.deleteOne(query);
    res.send(result);
})

app.get('/emptimeacceptordeny', async (req, res) => {
    const email = req.query.email;
    const query = { accept: false };
    const filter = { email: email }
    const result = await UsersCollection.find(filter).toArray();
    const result1 = result[0];
    const result2 = result1.restaurantnamecode;
    const result3 = { restaurantcode: result2, accept: false };
    const result5 = await EmployeeTimesCollection.find(result3).toArray();
    res.send(result5);
})

app.get('/emptotaltime', async (req, res) => {
    const email = req.query.email;
    // const filter = { 'accept': true }
    const query = { email: email };
    const result = await EmployeeTimesCollection.find(query).toArray();
    res.send(result);
})

app.get('/emptotaltimebymanager', async (req, res) => {
    const email = req.query.email;
    const query = { email };
    const result = await UsersCollection.find(query).toArray();
    const result1 = (result[0]).restaurantnamecode;
    const filter = { 'restaurantcode': result1 }
    const result2 = await EmployeeTimesCollection.find(filter).toArray();
    // console.log(result2)
    res.send(result2);
})


app.patch('/empaccept/:id', async (req, res) => {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };
    const options = { upsert: true };
    const updateDoc = {
        $set: {
            accept: true
        }
    }
    const result = await EmployeeTimesCollection.updateOne(filter, updateDoc, options)
    res.send(result)
})

app.post('/employeetimerecord', async (req, res) => {
    const record = req.body;
    const result = await EmployeeTimesCollection.insertOne(record);
    res.send(result);
})

// app.patch('/endtime/:id', async (req, res) => {
//     const { breaktime, endy, totalWorkTime, newbreakformat, neattime, totalbreaktime } = req.body;
//     // console.log(reqbo)
//     const id = req.params.id;
//     const filter = { _id: new ObjectId(id) }
//     const options = { upsert: true }
//     const updateDoc = {
//         $set: {
//             endy: endy,
//             // breaktime: breaktime,
//             totalworktime: totalWorkTime,
//             newbreakformat: newbreakformat,
//             neattime: neattime,
//             totalbreaktime: totalbreaktime
//         }
//     }
//     const result = await EmployeeTimesCollection.updateOne(filter, updateDoc, options)
//     res.send(result)
// })


app.patch('/endtime/:id', async (req, res) => {
    const { endy, breakhour, breakminute, totalBreakTime, totalworkhour, neattime } = req.body;
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) }
    const options = { upsert: true }
    const updateDoc = {
        $set: {
            endy: endy,
            breakhour: breakhour,
            breakminute: breakminute,
            totalBreakTime: totalBreakTime,
            totalworkhour: totalworkhour,
            neattime: neattime
        }
    }
    const result = await EmployeeTimesCollection.updateOne(filter, updateDoc, options)
    res.send(result)
})


app.get('/employeeprofile/:id', async (req, res) => {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) }
    const result = await UsersCollection.findOne(filter)
    const result2 = await EmployeeTimesCollection.find({ email: result.email }).toArray()
    res.send(result2)
})

app.get('/users/employee/:email', async (req, res) => {
    const email = req.params.email;
    const query = { email }
    const user = await UsersCollection.findOne(query);
    res.send({ isEmployee: user?.userType === 'employee' })
})

app.get('/users/manager/:email', async (req, res) => {
    const email = req.params.email;
    const query = { email };
    const user = await UsersCollection.findOne(query);
    res.send({ isManager: user?.userType === 'manager' })
})

app.get('/users/admin/:email', async (req, res) => {
    const email = req.params.email;
    const query = { email };
    const user = await UsersCollection.findOne(query);
    res.send({ isAdmin: user?.userType === 'admin' })
})

app.get('/', (req, res) => {
    res.send('Qamla working Tab is running successfully!')
})

app.listen(port, () => {
    console.log(`Qamla Working Tab is is running successfully on port ${port}`)
})