const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const bcrypt = require('bcrypt');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: false}));

const UserModel = require('../models/user');
const JournalModel = require('../models/journal');
const GoalsModel = require('../models/goals');
const ChallengeModel = require('../models/challenges');

router.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false
}));


router.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'signup.html'));
});


router.post('/signup', async (req, res) => {
  const { name, username, email, password } = req.body;
  //console.log(email,password);
  try{
    const hashedPassword = await bcrypt.hash(password,10);
    const temp = await UserModel.create({name, username, email, password: hashedPassword});
            if(temp){
              console.log('User signed up successfully');
              res.send('<script>alert("User signed up successfully"); window.location.href = "/login";</script>');
            }
            else{
                res.redirect('./signup')
            }
  }
  catch(error){
    console.error('Error signing up user:', error);
    res.status(500).send('Internal Server Error');
  }
  
});


router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'login.html'));
});


router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  //console.log(email, password);
  try {
      const user = await UserModel.findOne({ email });
      //console.log(user);
      if (user) {
          bcrypt.compare(password, user.password, async (err, result) => {
              //console.log(result);
              if (result) {
                  console.log('Login successful');
                  req.session.userId = user._id;
                  res.redirect('/home'); 
              } else {
                  console.log('Invalid password');
                  res.status(401).send('<script>alert("Invalid email or password"); window.location.href = "/login";</script>');
              }
          });
      } else {
          console.log('Invalid email');
          res.status(401).send('<script>alert("Invalid email or password"); window.location.href = "/login";</script>');
      }
  } catch (error) {
      console.error('Error while querying the database:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});


router.get('/home', (req,res) =>{
  res.sendFile(path.join(__dirname, '..', 'public', 'home.html'));
});


router.get('/journal', async (req, res) => {
  try {
    const userId = req.session.userId;
    const journalEntries = await JournalModel.find({ userId }).sort({ date: -1 });
    res.render('journal', { entries: journalEntries });
  } catch (error) {
    console.error('Error fetching challenges:', error);
    res.status(500).send('Internal Server Error');
  }
});


router.post('/journal', async (req, res) => {
  const { date, title, content } = req.body;
  const userId = req.session.userId; 
  
  try {
    const journalEntry = await JournalModel.create({ userId, date, title, content });
    
    if (journalEntry) {
      res.send('<script>alert("journal entry logged");window.location.href = "/journal";</script>');
    } else {
      res.send('<script>alert("Error in creating journal entry"); window.location.href = "/journal";</script>');
    }
  } catch (error) {
    console.error('Error creating journal entry:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/goals', async (req,res) =>{
  try {
    const userId = req.session.userId;
    const goalEntries = await GoalsModel.find({ userId }).sort({ date: -1 });
    res.render('goals', { goals: goalEntries });
  } catch (error) {
    console.error('Error fetching challenges:', error);
    res.status(500).send('Internal Server Error');
  }
});


router.post('/update-goal/:id/complete', async (req, res) => {
  const goalId = req.params.id;
  
  try {
    const goal = await GoalsModel.findById(goalId);
    if (!goal) {
      return res.status(404).send('Goal not found');
    }
    goal.completed = true;
    await goal.save();
    res.redirect('/goals');
  } catch (error) {
    console.error('Error updating goal:', error);
    res.status(500).send('Internal Server Error');
  }
});


router.post('/goals', async (req, res) => {
  const { goal, deadline } = req.body;
  const userId = req.session.userId; 
  
  try {
    const goalEntry = await GoalsModel.create({ userId, goal, deadline });
    
    if (goalEntry) {
      res.send('<script>alert("goal entry logged");window.location.href = "/goals";</script>');
    } else {
      res.send('<script>alert("Error in creating goal entry"); window.location.href = "/goals";</script>');
    }
  } catch (error) {
    console.error('Error creating goal entry:', error);
    res.status(500).send('Internal Server Error');
  }
});


router.get('/goals/:id/edit', async (req, res) => {
  try {
      const goal = await GoalsModel.findById(req.params.id);
      res.render('editgoal', { goal });
  } catch (error) {
      console.error('Error fetching goal:', error);
      res.status(500).send('Internal Server Error');
  }
});


router.post('/goals/:id/edit', async (req, res) => {
  const { goal, deadline } = req.body;
  try {
      await GoalsModel.findByIdAndUpdate(req.params.id, { goal, deadline });
      res.redirect('/goals');
  } catch (error) {
      console.error('Error updating goal:', error);
      res.status(500).send('Internal Server Error');
  }
});


router.post('/goals/:id/delete', async (req, res) => {
  try {
      await GoalsModel.findByIdAndDelete(req.params.id);
      res.redirect('/goals');
  } catch (error) {
      console.error('Error deleting goal:', error);
      res.status(500).send('Internal Server Error');
  }
});


router.get('/profile', async (req,res) =>{
  try {
    const userId = req.session.userId;
    const users = await UserModel.find({ userId });
    res.render('profile', { user: users });
  } catch (error) {
    console.error('Error fetching challenges:', error);
    res.status(500).send('Internal Server Error');
  }
});


router.get('/challenges', async (req, res) => {
  try {
    const challengesData = await ChallengeModel.find();
    res.render('challenges', { challenges: challengesData });
  } catch (error) {
    console.error('Error fetching challenges:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;