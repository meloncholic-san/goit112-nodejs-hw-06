import createHttpError from 'http-errors';
import { registerUser, loginUser, logoutUser, refreshSession, requestResetPassword, resetPassword} from '../services/auth.js';

export const registerUserCtrl = async (req, res) => {
  const user = await registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
};


export const loginUserCtrl = async (req, res) => {
    const session = await loginUser(req.body.email, req.body.password);


    
    res.cookie('sessionId', session._id, {
        httpOnly: true,
        expire: session.refreshTokenValidUntil,
    });

    res.cookie('refreshToken', session.refreshToken, {
        httpOnly: true,
        expire: session.refreshTokenValidUntil,
    });


    res.status(200).json({
        status: 200,
        message: 'Successfully login a user!',
        accessToken: session.accessToken,
    });
}

export const logoutUserCtrl = async(req,res) => {
    const { sessionId } = req.cookies;
    if (typeof sessionId === 'string') {
        await logoutUser(sessionId);
    }

    res.clearCookie('sessionId');
    res.clearCookie('refreshToken');

    res.status(204).end();
}


export const refreshTokenCtrl = async(req, res) => {
    const {sessionId, refreshToken} = req.cookies;
    const session = await refreshSession(sessionId, refreshToken);

    res.cookie('sessionId', session._id, {
        httpOnly: true,
        expire: session.refreshTokenValidUntil,
    });

    res.cookie('refreshToken', session.refreshToken, {
        httpOnly: true,
        expire: session.refreshTokenValidUntil,
    });

    res.json({
        status: 200,
        message: 'Refresh completed successfully',
        data: {
        accessToken: session.accessToken,
        },
    });
}

export const requestSendResetEmailCtrl = async (req, res) => {
    const { email } = req.body;
    const result = await requestResetPassword(email);
    
    res.json({ status: 200, message: 'Reset password email sent successfully' });
}   


export const resetPasswordCtrl  = async (req, res) => {
    const {password, token} = req.body;
    console.log(password, token);
    await resetPassword(password, token);
    res.send({ status: 200, message: 'Password reset successfully', data: {} });
}