import mongoose from 'mongoose';

const ProblemSchema = new mongoose.Schema({
    id: {
        type: String,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    problem: {
        type: String,
        required: true
    },
    img: {
        type: String,
        default: ''
    },
    answer: {
        type: String,
        default: ''
    }
});

const Problem = mongoose.model('Problem', ProblemSchema);

export default Problem;
