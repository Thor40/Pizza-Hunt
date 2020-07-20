const { Schema, model } = require('mongoose');
const moment = require('moment');

const PizzaSchema = new Schema ({
    PizzaName: {
        type: String,
        required: true,
        trim: true
    },
    createdBy: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        // get this value and format it with moment.js
        get: (createdAtVal) => moment(createdAtVal).format('MMM DD, YY [at] hh:mm a')
    },
    size: {
        type: String,
        required: true,
        enum: ['Personal', 'Small', 'Medium', 'Large', 'Extra Large'],
        default: 'Large'
    },
    toppings: [],
    comments: [
        {
            // references Comment model and uses it as the object ID
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
    },
    {
        // allows the use of the virtual below in this Schema
        toJSON: {
            virtuals: true,
            getters: true
        },
        // this virtual returns, so we dont need the ID
        id: false
    }
);

// get total count of comments and replies on retrieval
PizzaSchema.virtual('commentCount').get(function() {
    return this.comments.reduce((total, comment) => total + comment.replies.length + 1, 0);
});

// create the Pizza model using the PizzaSchema
const Pizza = model('Pizza', PizzaSchema);

// export the Pizza model
module.exports = Pizza;