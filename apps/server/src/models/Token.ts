import { Schema, model } from 'mongoose';

const TokenSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'user'
  },
  token: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    /**
     * Expiry in seconds, if expired, the model.find()
     * will return null and the
     */
    expires: 60
  }
});

const TokenModel = model('token', TokenSchema);

export default TokenModel;
