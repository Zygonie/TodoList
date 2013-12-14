var development = {
    facebook: {
        CallbackURL: "",
        clientID: "",
        clientSecret: ""
    },  
    google: {
        returnURL: 'http://localhost:8080/auth/google/return',
        realm: 'http://localhost:8080/'
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