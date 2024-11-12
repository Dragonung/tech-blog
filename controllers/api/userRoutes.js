const router = require('express').Router();
const { User, Post, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// GET /api/users
router.get('/', async (req, res) => {
    //access User model and run .findAll()
    try {
        const userData = await User.findAll({
            attributes: { exclude: ['password'] }
        });

        if(!userData){
            res
            .status(400)
            .json({ message: 'Wrong email/password. Try again' });
        }
    } catch (err){
        res.status(400).json(err);
    }
});

// GET /api/users/1
router.get('/:id', async (req, res) => {
    try {
        const userData = await User.findOne({ where: { email: req.body.email }});

        if(!userData) {
            res
                .status(400)
                .json({ message: 'Wrong email/password. Try again' });
            return;
        }

        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.logged_in = true;

            res.json({ user: userData, message: 'Logged in' });
        });

    } catch (err){
        res.status(400).json(err);
    }
});

// POST /api/users
router.post('/', async (req, res) => {
    try {
        const userData = await User.create(req.body);

        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.logged_in = true;
            
            res.status(200).json(userData);
        });
    } catch (err){
        res.status(400)
    }
});

// LOGIN
router.post('/login', async (req, res) => {
    try {
      const userData = await User.findOne({ where: { email: req.body.email } });
  
      if (!userData) {
        res
          .status(400)
          .json({ message: 'Incorrect email or password, please try again' });
        return;
      }
  
      const validPassword = await userData.checkPassword(req.body.password);
  
      if (!validPassword) {
        res
          .status(400)
          .json({ message: 'Incorrect email or password, please try again' });
        return;
      }
  
      req.session.save(() => {
        req.session.user_id = userData.id;
        req.session.logged_in = true;
        
        res.json({ user: userData, message: 'You are now logged in.' });
      });
    } catch (err) {
        res.status(400).json(err);
      }
});

// LOGOUT
router.post('/logout', (req, res) => {
    if (req.session.logged_in) {
        req.session.destroy(() => {
            res.status(204).end();
        });
    } else {
        res.status(404).end();
    }
});

module.exports = router;