const {OAuth2Client} = require('google-auth-library');

const getUser = async (token) => {
    let CLIENT_ID = process.env.CLIENT_ID
    const client = new OAuth2Client(CLIENT_ID);
    
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID
    });
    
    const response = ticket.getPayload();
  
    if (response.iss !== 'accounts.google.com' && response.aud !== CLIENT_ID)
      return res.status(400).json({ status: 'error', error: 'Bad Request' });
  
    const user = {
      id: response.sub,
      email: response.email,
      image: response.picture,
      first_name: response.given_name,
      last_name: response.family_name,
    };
  
    return user
  }

exports.getUser = getUser;