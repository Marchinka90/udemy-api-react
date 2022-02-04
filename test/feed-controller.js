const expect = require('chai').expect;
const sinon = require('sinon');
const mongoose = require('mongoose');

const User = require('../models/user');
const FeedController = require('../controllers/feed');

describe('Feed Controller', function() {
    before(function(done) {
        mongoose.connect('mongodb://localhost:27017/messages')
        .then(result => {
            const user = new User({
                email: 'test@test.com',
                password: ' tester',
                name: 'Test',
                posts: [],
                _id: '61f8010f477b1d5dbf20d479'
            });
            return user.save()
        })
        .then(() => {
            done();
        });
    });

    it('should add a created post to the posts of the creator', function(done) {
        const req = {
            body: {
                title: 'Test Post',
                content: 'A Test Post'
            },
            file: {
                path: 'abc'
            },
            userId: '61f8010f477b1d5dbf20d479'
        };
        const res = { status: function() {
            return this;
        }, json: function() {}};

        FeedController.createPost(req, res, () => {}).then(savedUser => {
            expect(savedUser).to.have.property('posts');
            expect(savedUser.posts).to.have.length(1);
            done();
        });
    });

    after(function(done) {
        User.deleteMany({})
        .then(() => {
            return mongoose.disconnect();
        })
        .then(() => {
            done();
        });
    })
});