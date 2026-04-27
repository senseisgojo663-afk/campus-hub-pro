const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// Get all posts
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new post
router.post('/', async (req, res) => {
    const post = new Post({
        author: req.body.author,
        initials: req.body.initials,
        category: req.body.category,
        body: req.body.body,
        sessionId: req.body.sessionId || ''
    });

    try {
        const newPost = await post.save();

        // Broadcast to ALL connected users in the global room
        const io = req.app.get('io');
        io.to('global_room').emit('new_post_notification', {
            author: newPost.author,
            category: newPost.category,
            body: newPost.body,
            posterSessionId: newPost.sessionId
        });

        res.status(201).json(newPost);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Someone clicked "I can help!" - notify the poster via Socket.io
router.post('/:id/help', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        const io = req.app.get('io');

        // Emit notification to the room of the original poster's sessionId
        if (post.sessionId) {
            io.to(`session:${post.sessionId}`).emit('help_notification', {
                postBody: post.body,
                helperName: req.body.helperName || 'Someone',
                category: post.category
            });
        }

        // Delete post after help offered
        await Post.findByIdAndDelete(req.params.id);
        res.json({ message: 'Help offered and post resolved' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete a post
router.delete('/:id', async (req, res) => {
    try {
        await Post.findByIdAndDelete(req.params.id);
        res.json({ message: 'Post deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
