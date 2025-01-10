const express = require('express');
const session = require('express-session');
const path = require('path');
const hbs = require('hbs');
const flash = require('express-flash');
const methodOverride = require("method-override");
require("dotenv").config();

const {
    renderLogin, 
    renderRegister, 
    authRegister, 
    authLogout,
    detailProject, 
    newProject, 
    editProject,
    authLogin, 
    renderHome, 
    renderFirstBlog, 
    renderBlog, addProject, 
    renderTestimonial, 
    contactForm, 
    deleteProject, 
    render404,
    updateProject,
} = require ('./controller/controllers');
const app = express();
const PORT = 5500;
const { formatDateToWIB, getRelativeTime } = require("./assets/js/time");
const { sendAlert } = require('./utils/alert');
app.use('/assets', express.static(path.join(__dirname, "assets")))
app.use(express.json());

app.use(session({
    name: "my-session",
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: true,
}))

app.use(flash());
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, "./views"));

hbs.registerHelper("formatDateToWIB", formatDateToWIB);
hbs.registerHelper("getRelativeTime", getRelativeTime);
hbs.registerPartials(__dirname + "/views/partials", function(err) {});
hbs.registerHelper("equal", (a, b) => {
    return a === b;
});
hbs.registerHelper("sendAlert", sendAlert)

app.get('/login', renderLogin);
app.get('/register', renderRegister);
app.get('/logout', authLogout);

app.post('/login', authLogin);
app.post('/register', authRegister);

app.get('/', renderHome);
app.get("/blog", renderFirstBlog);

app.get("/project", renderBlog);
app.post("/project", addProject);

app.get("/add-project", newProject);

app.get("/edit-project/:id", editProject);
app.patch("/update-project/:id", updateProject);

app.get("/detail-project/:id", detailProject);

app.get("/testimonial", renderTestimonial);

app.get("/contactForm", contactForm);

app.delete("/project/:id", deleteProject);

app.get("*", render404)

app.listen(PORT,() => {
    console.log(`Server sedang berjalan di: ${PORT}`);
});