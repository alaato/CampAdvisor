if(process.env.NODE_ENV !== 'production')
{
  require('dotenv').config();
}


const express = require('express');
const flash = require('connect-flash');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsmate = require('ejs-mate');
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError')
const campRoute = require('./routes/camproute');
const reveiwRoute = require('./routes/reveiws');
const session = require('express-session')
const passport = require('passport')
const localStrategy = require('passport-local')
const user = require('./models/users')
const authRoute = require('./routes/auth'),
helmet = require('helmet'),
scriptUrl = require('./directives')
const MongoStore = require('connect-mongo');



main().catch(err => console.log(err));

async function main() {
    
        console.log("connected to database");
        await mongoose.connect(process.env.Db_url);
}



app.engine('ejs', ejsmate)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')


app.use(express.static( "public" ) );
app.use(methodOverride('_method'))
app.use(express.urlencoded({extended : true}))

const store = MongoStore.create({
  mongoUrl: process.env.Db_url,
  touchAfter: 24 * 60 * 60,
  crypto: {
      secret: 'thisshouldbeabettersecret!'
  }
});
store.on('error', err => console.log(err));

app.use(session({
  httpOnly: true,
  store: store,
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7
  }

}))
app.use(flash());
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        "script-src": ["'self'", ...scriptUrl],
        'img-src' : ["'self'",
         "https://res.cloudinary.com/dnmkjdwgf/",
         "data:"
        ]
      },
    },
  })
);

app.use(passport.initialize())
app.use(passport.session())

passport.use(new localStrategy(user.authenticate()))
passport.serializeUser(user.serializeUser())
passport.deserializeUser(user.deserializeUser())

app.use((req, res, next) => {
  res.locals.isLoggedIn = req.isAuthenticated();
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success')
  res.locals.error = req.flash('error')
  next();
})

app.use(authRoute);
app.use('/campgrounds', campRoute)
app.use('/campgrounds/:id/review', reveiwRoute)

app.get('/', (req, res)=>
{
    res.render('campgrounds/home')
})

app.all('*', (req, res, next)=>{
  next(new ExpressError('Not found unfortunely',404))
})

app.use((err,req, res, next)=>
{
  console.log(err.message)
  switch (err.status) {
    case 400:
      res.status(400).render('Partials/error', {err});
      break;
    case 401:
      res.status(401).send('Unauthorized');
      break;
    case 404:
      res.status(404).render('Partials/error', {err})
      break;
    default:
      err.message = 'something went wrong'
      res.status(500).render('Partials/error', {err});
      break;
  }

})

app.listen(3000, ()=>
{
    console.log('app is listening')
})