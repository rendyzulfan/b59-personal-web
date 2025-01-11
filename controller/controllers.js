const {Sequelize, QueryTypes, where} = require("sequelize");
const bcrypt = require('bcrypt');
const config = require("../config/config");
const { types } = require("pg");
const {Project, User} = require("../models")
const env = process.env.NODE_ENV || "production";
const saltrounds = 10; 

const sequelize = new Sequelize(config[env]);
// HOME
function renderHome(req, res) {
  const user = req.session.user
  console.log("ini untuk renderhome:",user);
  res.render("index", {user})
}

// MY BLOG
let blogs = [];

function renderFirstBlog(req, res) {
  const {user} = req.session;
  
  res.render("blog", {user});
}

// PROJECT
let projects = [];

async function renderBlog(req, res) {
  const {user} = req.session;
  
  const query = `SELECT * FROM public."Projects"`;
  const projects = await sequelize.query(query, {type: QueryTypes.SELECT});
  
  console.log(projects);
  
  res.render("project", {projects: projects, user: user});
}

async function addProject(req, res) {

  const {projectName, description, fileUpload, nodeJs, nextJs, reactJs, typeScript, startDate, endDate} = req.body; 
      let checkbox = '';

      if (nodeJs != undefined) {
        checkbox += ` ${nodeJs} `;
      } 

      if (nextJs != undefined) {
        checkbox += ` ${nextJs} `;
      }
      
      if (reactJs != undefined) {
        checkbox += ` ${reactJs} `;
      }

      if (typeScript != undefined) {
        checkbox += ` ${typeScript} `;
      }

      // const image = "https://hips.hearstapps.com/hmg-prod/images/2025-tesla-cybertruck-3-672e75cce7814.jpg?crop=0.531xw:0.398xh;0.137xw,0.462xh&resize=640:*"

      const query = `INSERT INTO public."Projects"
      (title, content, image, technologies, "startDate", "endDate")
      VALUES
                    ('${projectName}', '${description}', '${fileUpload}', '${checkbox}', '${startDate}', '${endDate}');
      `

      const result = await sequelize.query(query, {type: QueryTypes.INSERT}) 

      console.log(result);

      res.redirect("/project");
}

function newProject(req, res) {
  const {user} = req.session;

  res.render("add-project", {newProject, user});
}

async function editProject(req, res) {
  const {id} = req.params;
  const {user} = req.session;

  const queryGetData = `SELECT * FROM public."Projects" WHERE id = ${id}`;
  const sqlGetData = await sequelize.query(queryGetData, {
    type: QueryTypes.SELECT,
  });

  const react = sqlGetData[0].technologies.includes("ReactJS");
  const node = sqlGetData[0].technologies.includes("NodeJS");
  const next = sqlGetData[0].technologies.includes("NextJS");
  const ts = sqlGetData[0].technologies.includes("TypeScript");

  console.log(sqlGetData);
  res.render("edit-project", {data: sqlGetData[0], user, react, node, next, ts});
}

async function updateProject(req, res) {
  const {id} = req.params;

  let {projectName, description, fileUpload, nodeJs, nextJs, reactJs, typeScript, startDate, endDate} = req.body;
  // console.log("ini request body:", projectName, description, fileUpload, nodeJs, nextJs, reactJs, typeScript, startDate, endDate);
  const gambar = req.query.img
  if(!fileUpload){
    fileUpload = gambar
  }
  let checkbox = '';

      if (nodeJs != undefined) {
        checkbox += ` ${nodeJs} `;
      } 

      if (nextJs != undefined) {
        checkbox += ` ${nextJs} `;
      }
      
      if (reactJs != undefined) {
        checkbox += ` ${reactJs} `;
      }

      if (typeScript != undefined) {
        checkbox += ` ${typeScript} `;
      }

    const query = `UPDATE public."Projects" SET title = '${projectName}', content = '${description}', image = '${fileUpload}', "startDate" = '${startDate}', "endDate" = '${endDate}', technologies = '${checkbox}' WHERE id = ${id}`
    
    const result = await sequelize.query(query, {type: QueryTypes.UPDATE});

    console.log(result);


    res.redirect(`/project`)
}

function authLogout (req, res) {
  req.session.user = null;

  res.redirect("/");
}

async function detailProject(req, res) {
  const {user} = req.session

  const {id} = req.params;

  const query = `SELECT * FROM public."Projects" WHERE id = ${id}`;
  const ress = await sequelize.query(query, { type: QueryTypes.SELECT });

  console.log(ress);

  res.render("detail-project", {data: ress[0]});
}

function renderTestimonial(req, res) {
  const {user} = req.session;

  res.render("testimonial", {user})
}

async function deleteProject(req, res) {
  const {id} = req.params;
  
  const query = `DELETE FROM public."Projects" WHERE id = ${id}`;
  await sequelize.query(query, { type: QueryTypes.DELETE });
  
  res.redirect("/project");
}

function render404(req, res) {
  res.send("Halaman ini tidak ada")
}

function renderLogin(req, res) {
  const user = req.session.user;
  
  if (user) {
    res.redirect("/")
  } else {
    res.render("auth-login");
  }
}

function renderRegister(req, res) {
  const user = req.session.user;
  if (user) {
    res.redirect("/")
  } else {
    res.render("auth-register");
  }
}

function contactForm(req, res) {
  const {user} = req.session;

  res.render("contactForm", {contactForm, user});
}

async function authRegister(req, res) {
  const {username, email, password} = req.body;

  const hashedPassword = await bcrypt.hash(password, saltrounds)

  await User.create({
    username, 
    email, 
    password: hashedPassword,
  });

  req.flash('success', 'Berhasil Mendaftar. Silahkan Login!');

  res.redirect("/login");
}

async function authLogin(req, res) {
  const {email, password} = req.body;

  // check if user exist
  const user = await User.findOne({
    where: {
      email: email,
    },
  }); 

  if(!user) {
    req.flash('error', 'User belum terdaftar!');
    return res.redirect('/login');
  }

  // check if password correct
  const isValidated = await bcrypt.compare(password, user.password);

  if(!isValidated) {
    req.flash('error', 'Password tidak sesuai');
    return res.redirect("/login");
  }

  let loggedInUser = user.toJSON();

  delete loggedInUser.password;

  req.session.user = loggedInUser ;

  console.log(loggedInUser);

  req.flash('success', 'Kamu Berhasil Login!');
  res.redirect('/');
}

module.exports = {
    renderLogin,
    renderRegister,
    detailProject,
    newProject,
    editProject,
    authLogout,
    authRegister,
    authLogin,
    renderHome,
    renderFirstBlog,
    renderBlog,
    addProject,
    renderTestimonial,
    updateProject,
    contactForm,
    deleteProject,
    render404,
};