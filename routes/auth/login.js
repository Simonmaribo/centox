// Imports
const config = require('../../config.json');
const router = require('express').Router();
const DiscordOauth2 = require("discord-oauth2");

// Export route
module.exports = (db) => {
    
    // Utils
    const user = require('../../server/user')(db);
    const auth = require('../../server/auth')(db);

    // Create rate limiter
    const rateLimiter = require('../../server/utils/rateLimiter')(2 * 60 * 1000, 5, "For mange anmodninger. Prøv igen senere.")

    // Create OAuth2
    const oauth = new DiscordOauth2({
        clientId: config.discord.client_id,
        clientSecret: config.discord.client_secret,
        redirectUri: config.discord.redirect_uri
    })
    

    router.get('/', rateLimiter, auth.forwardAuthentication, async (req, res) => {
        // https://discord.com/oauth2/authorize?client_id=982719567690350633&redirect_uri=http://localhost:80/login&response_type=code&scope=identify&prompt=none
        if(!req.query.code) return res.status(401).json({
            message: 'No code.'
        });

        oauth.tokenRequest({
            code: req.query.code,
            scope: "identify",
            grantType: 'authorization_code'
        })
        .then((response) => {
            oauth.getUser(response.access_token)
            .then(async (response) => {
                // Check if user exists and create if not.
                if(await user.exists(response.id)){
                    await user.updateDiscord(response.id, {
                        username: `${response.username}#${response.discriminator}`,
                        avatar: `https://cdn.discordapp.com/avatars/${response.id}/${response.avatar}.png`,
                    }).then(async () => await user.loginToUser(response.id, req, (response) => {
                        if(response.status == 200) return res.status(response.status).cookie("access_token", response.data.token, {
                            maxAge: 1000*3600*24*7,
                            httpOnly: true,
                            secure: config.env === "production"
                        }).json({ message: response.message })    
                        return res.status(response.status).json({ message: response.message })
                    }));
                } else {
                    await user.createNew({
                        id: response.id,
                        username: `${response.username}#${response.discriminator}`,
                        avatar: `https://cdn.discordapp.com/avatars/${response.id}/${response.avatar}.png`,
                    }).then(async () => await user.loginToUser(response.id, req, (response) => {
                        if(response.status == 200) return res.status(response.status).cookie("access_token", response.data.token, {
                            maxAge: 1000*3600*24*7,
                            httpOnly: true,
                            secure: config.env === "production"
                        }).json({ message: response.message })    
                        return res.status(response.status).json({ message: response.message })     
                    }))
                }
            })
        })
        .catch((err) => {
            return res.status(404).json({
                status: 404,
                message: "Koden findes ikke.",
            })     
        })

    })

    return router;
}