const { User } = require('../models');

module.exports = {

    getUsers(req, res) {
        User.find()
            .then((users) => res.json(users))
            .catch((err) => res.status(500).json(err));
    },

    getSingleUser(req, res) {
        User.findOne({ _id: req.params.userId })
            .select('-__v')
            .populate('thoughts')
            .populate('friends')
            .then((user) =>
            !user
                ? user.status(404).json({
                message: 'No user found with that ID'
            })
            : res.json(user)
            )
            .catch((err) => res.status(500).json (err));
    },

    createUser(req, res) {
        User.create(req.body)
        .then((user) => res.json('User created')
        )
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        })
    },
    updateUser(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $set: req.body },
            { runValidators: true, new: true },
        ) 
        .then((user) => 
        !user
            ? res.status(404).json({
            messsage: 'No user with this ID!'
        })
        : res.json({ message: 'User updated' })
        )
        .catch((err) => {
            console.log(err);
            res.status(500).json(err); 
        });
    },

    deleteUser(req, res) {
        User.findOneAndRemove({ _id: req.params.userId})
        .then((user) =>
        !user
        ? res.status(404).json({ message: 'No user with this ID' })
        : res.json({ message: 'User deleted'})
        )
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        })
    },

    deleteUserAndThoughts(req, res) {
        User.findOneAndDelete({ _id: req.params.userId })
        .then((user) =>
        !user
        ? res.status(404).json({ message: 'No user with this ID' })
        : Thought.deleteMany({ id: { $in: user.thoughts } })
        )
        then(() => res.json({ message: 'User and associate thoughts deleted'}))
        .catch((err) => res.status(500).json(err));
    },

    addFriend(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $addToSet: { friends: req.params.friendId } },
            { new: true },
        )
        .then((user) => 
        !user
            ? res.status(404).json({
            message: 'No user with this ID'
        })
        : res.json(user)
        )
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
    },

    deleteFriend(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $pull: { friends: req.params.friendId } },
            { new: true },
        )
        .then((user) => 
        !user
            ? res.status(404).json({
            message: 'No user with this ID'
        })
        : res.json(user)
        )
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
    }
}