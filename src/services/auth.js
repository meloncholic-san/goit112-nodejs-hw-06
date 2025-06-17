import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import crypto from 'node:crypto'
import { UserCollection } from '../models/users.js';
import { SessionCollection } from '../models/session.js';
export const registerUser = async (payload) => {

    const user = await UserCollection.findOne({email:payload.email});
    if (user !== null) {
        throw new createHttpError.Conflict('Email is already in use');
    }
    payload.password = await bcrypt.hash(payload.password, 10);

  return UserCollection.create(payload);
};


export const loginUser = async(email, password) => {
    const user = await UserCollection.findOne({email});
    if (!user) {
       throw new createHttpError.Unauthorized('Email or password is incorrect');
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
    throw new createHttpError.Unauthorized('Email or password is incorrect');
  }

    await SessionCollection.deleteOne({ userId: user._id });

    return SessionCollection.create({
        userId: user._id,
        accessToken: crypto.randomBytes(30).toString('base64'),
        refreshToken: crypto.randomBytes(30).toString('base64'),
        accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
        refreshTokenValidUntil: new Date(Date.now() + 24 * 60 * 30 * 60 * 1000),
    });
}

export const logoutUser = async(sessionId) => {
    return await SessionCollection.findOneAndDelete({_id:sessionId});
}

export const refreshSession = async (sessionId, refreshToken) => {
    const session = await SessionCollection.findOne({ _id: sessionId });

    if (!session) {
        throw new createHttpError.Unauthorized('Session not found');
    }

    if (session.refreshToken !== refreshToken) {
        throw new createHttpError.Unauthorized('Refresh token is invalid');
    }

    if (session.refreshTokenValidUntil < new Date()) {
        throw new createHttpError.Unauthorized('Refresh token is expired');
    }
      await SessionCollection.deleteOne({ _id: session._id });

    return SessionCollection.create({
        userId: session.userId,
        accessToken: crypto.randomBytes(30).toString('base64'),
        refreshToken: crypto.randomBytes(30).toString('base64'),
        accessTokenValidUntil: new Date(Date.now() + 10 * 60 * 1000),
        refreshTokenValidUntil: new Date(Date.now() + 24 * 60 *30 * 60 * 1000),
    });
}