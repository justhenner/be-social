const { User, Thought, reactionSchema } = require('../models');
const mongoose = require('mongoose');

module.exports = {
    getThoughts(req, res) {
        Thought.find()
        .then((thoughts) => res.json(thoughts))
        .catch((err) => res.status(500).json(err));
    },

    getSingleThought(req, res) {
        Thought.findOne({ _id: req.params.thoughtId })
        .then((thought) =>
        !thought
        ? res.status(404).json({ message: 'No thought with that ID'})
        : res.json(thought)
        )
        .catch((err) => res.status(500).json(err));
    },

    createThought(req, res) {
        Thought.create(req.body)
        .then((thought) => {
            return User.findOneAndUpdate(
                { _id: req.body.userId },
                { $addToSet: { thoughts: thought._id } },
                { new: true },
            );
        })
        .then((user) => 
        !user 
        ? res.status(404).json({
            message: 'Thought created, but no user with that ID', 
        })
        : res.json('Created the thought!')
        )
        .catch((err) => {
            console.log(err); 
            res.status(500).json(err);
        })
    },

    updateThought(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $set: req.body }, 
            { new: true },
        )
        .then((thought) =>
        !thought 
        ? res.status(404).json({
            message: 'No thought with this ID'
        })
        : res.json(thought)
        )
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
    },

    deleteThought(req, res) {
        Thought.findOneAndRemove({ _id: req.params.thoughtId })
        .then((thought) =>
        !thought? res.status(404).json({ message: 'No thought with this ID' })
        : User.findOneAndUpdate(
            { thoughts: req.params.thoughtId },
            { $pull: { thoughts: req.params.thoughtId } },
            { new: true },
        ))
        .then((user) =>
        !user
        ? res.status(404).json({
            message: 'Thought created but no user this ID', 
        })
        : res.json({ message: 'Thought successfully deleted' })
        )
        .catch((err) => res.status(500).json(err));
    },

    createReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $addToSet: { reactions: req.body } },
            { new: true }
        )
        .then((thought) =>
        !thought? res.status(404).json({
            message: 'Reaction created, but no thought found with that ID'
        })
        : res.json({ message: 'Reaction created!' })
        )
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
    },

    deleteReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId }, 
            { $pull: { reactions: { _id: req.body.reaction_id} } },
            { new: true }
        )
        .then((thought) =>
        !thought
        ? res.status(404).json({
            message: 'Reaction created, but no thought found with that ID',
        })
        : res.json({ message: 'Reaction successfully deleted!' })
        )
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
    }
}