const express = require('express');
const path = require('path');
const hbs = require('hbs');
const methodOverride = require("method-override");
require("dotenv").config();

const {renderHome, renderFirstBlog,renderBlog, addProject, renderTestimonial, deleteProject,render404} = require ('./controller/controllers');
const app = express();
const PORT = 3300;
app.use('/assets', express.static(path.join(__dirname, "assets")))
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, "./views"));

hbs.registerPartials(__dirname + "/views/partials", function(err) {});

app.get('/', renderHome);

app.get("/blog", renderFirstBlog);

app.get("/project", renderBlog);
app.post("/project", addProject);

app.get("/testimonial", renderTestimonial);

app.delete("/project/:id", deleteProject);

app.get("*", render404)

app.listen(PORT,() => {
    console.log(`Server sedang berjalan di: ${PORT}`);
});