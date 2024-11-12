const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', withAuth, async (req, res) => {
    try {
        //get all posts to JOIN with user data
        const postData = await Post.findAll({
            where: {
                //use session ID
                user_id: req.session.user_id
            },
            attributes: [
                'id',
                'title',
                'created_at',
                'post_content',
            ],
            include: [
                {
                    model: Comment,
                    attributes: ['id', 'comment', 'post_id', 'user_id', 'created_at'],
                    include: {
                        model: User,
                        attributes: ['username']
                    }
                },
                {
                    model: User,
                    attributes: ['username'],
                },
            ],
        });

        //serialize data before passing to template
        const posts = postData.map((post) => post.get({ plain: true }));

        //pass serialized data and session flag into template
        res.render('dashboard', {
            posts,
            logged_in: req.session.logged_in
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/edit/:id', withAuth, (req, res) => {
    try {
        Post.findOne({
            where: {
                id: req.params.id
            },
            attributes: [
                'id',
                'title',
                'created_at',
                'post_content'
            ],
            include: [
                {
                    model: Comment,
                    attributes: ['id', 'comment', 'post_id', 'user_id', 'created_at'],
                    include: {
                        model: User,
                        attributes: ['username']
                    },
                },
            ],
        });

        const post = dbPostData.get({ plain: true });

        res.render('edit-post', {
            post,
            logged_in: true
        });
    }
    catch (err) {
        res.status(500).json(err);
    }
});

router.get('/create/', withAuth, (req, res) => {
    try {
        Post.findAll({
            where: {
            user_id: req.session.user_id
            },
            attributes: [
                'id',
                'title',
                'created_at',
                'post_content'
            ],
            include: [
                {
                    model: Comment,
                    attributes: ['id', 'comment', 'post_id', 'user_id', 'created_at'],
                    include: {
                        model: User,
                        attributes: ['username']
                    },
                },
            ],
        });

        const post = dbPostData.get({ plain: true });

        res.render('create-post', {
            post,
            logged_in: true
        });
    }
    catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;