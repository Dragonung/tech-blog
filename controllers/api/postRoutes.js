const router = require('express').Router();
const { Post, User, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

router.get('/', async (req, res) => {
    try {
        const postData = await Post.findAll({
            attributes:
                ['id',
                    'title',
                    'created_at',
                    'post',
                ],
            order: [['created_at', 'DESC']],
        });

        const post = postData.get({ plain: true });
        if (!postData) {
            res
                .status(400)
                .json({ message: 'Wrong email/password. Try again' });
        }
    } catch (err) {
        res.status(400).json(err);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const postData = await Post.findbyPk(req.params.id, {
            attributes: [
                'id',
                'title',
                'created_at',
                'post',
            ],
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.post('/', withAuth, async (req, res) => {
    try {
        const newPost = await Post.create({
            ...req.body,
            user_id: req.session.user_id
        });

        res.status(200).json(newPost);
    } catch (err) {
        res.status(400).json(err);
    }
});

router.put('/:id', withAuth, async (req, res) => {
    try {
        const updatePost = await Post.update({
            title: req.body.title,
            post: req.body.post
        });

        if (!updatePost) {
            res.status(404).json({ message: 'No post found with this id.' });
            return;
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

router.delete('/:id', withAuth, async (req, res) => {
    try {
        const postData = await Post.destroy({
            where: {
                id: req.params.id,
                user_id: req.session.user_id,
            },
        });

        if (!postData) {
            res.status(404).json({ message: 'No post found with this id.' });
            return;
        }

        res.status(200).json(postData);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;