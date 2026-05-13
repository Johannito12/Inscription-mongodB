require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const bcrypt = require('bcrypt')



const app = express()
const port = process.env.PORT || 5500

// Middleware
// ⚠️ Retirer express.static pour éviter le conflit avec la route GET /
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public'))) // styles, images, etc.
//connection a Atlas
mongoose.connect(process.env.MONGO_URI)
console.log(process.env.MONGO_URI)
const db = mongoose.connection
db.once('open', () => console.log("Connecté à la base de données"))

const userSchema = new mongoose.Schema({
    First_name: String,
    Last_name:  String,
    Email:      String,
    Password:   String
})

const User = mongoose.model('User', userSchema)

// Route GET → sert le formulaire
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Logine.html'))
})

// Route POST → reçoit les données du formulaire
app.post('/post', async (req, res) => {
    try {
        const { First_name, Last_name, Email, Password } = req.body

        const hashedPassword = await bcrypt.hash(Password, 10)

        const user = new User({ First_name, Last_name, Email, Password: hashedPassword })
        await user.save()

        console.log("Utilisateur enregistré :", user)
        res.send("Inscription réussie !")
    } catch (err) {
        console.error(err)
        res.status(500).send("Erreur lors de l'enregistrement.")
    }
})

app.listen(port, () => console.log(`Serveur lancé sur http://localhost:${port}`))
