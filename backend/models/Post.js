const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  author: { type: String, required: true },
  avatar: { type: String, required: true },
  tag: { type: String, default: 'Activity' },
  content: { type: String, required: true },
  image: { type: String, default: '' },
  reactions: {
    fire: { type: Number, default: 0 },
    strong: { type: Number, default: 0 },
    clap: { type: Number, default: 0 }
  },
  reactedUsers: {
    fire: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    strong: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    clap: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  },
  comments: [{
    author: String,
    text: String,
    time: { type: String, default: 'Just now' },
    createdAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', PostSchema);
