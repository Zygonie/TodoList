var port = process.env.PORT || 8080;

var development = {
    facebook: {
        CallbackURL: "",
        clientID: "",
        clientSecret: ""
    },  
    google: {
        returnURL: 'http://localhost:'+ port +'/auth/google/return',
        realm: 'http://localhost:' + port + '/'
        },
    env : global.process.env.NODE_ENV || 'development'
};

var production = {
    facebook: {
        CallbackURL: "",
        clientID: "",
        clientSecret: ""
    },  
    google: {
        returnURL: '',
        realm: ''
        },
    env : global.process.env.NODE_ENV || 'production'
};

exports.Config = global.process.env.NODE_ENV === 'production' ? production : development;