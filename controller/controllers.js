const {Sequelize, QueryTypes} = require("sequelize");
const config = require("../config/config.json");
const { types } = require("pg");

const sequelize = new Sequelize(config.development);
// HOME
function renderHome(req, res) {
    res.render("index")
}

// MY BLOG
let blogs = [];

function renderFirstBlog(req, res) {
    res.render("blog");
}

// PROJECT
let projects = [];

async function renderBlog(req, res) {
    const query = `SELECT * FROM public."Projects"`;
    const projects = await sequelize.query(query, {type: QueryTypes.SELECT});

    console.log(projects);
    res.render("project", {projects: projects});
}

async function addProject(req, res) {
    // const {projectName, startDate, endDate, description, nodeJs, nextJs, reactJs, typeScript, fileUpload} = req.body;
    // let techSelected = '';

    // if (nodeJs) {
    //     techSelected += ' (NodeJs) ';
    // } 
    // if (nextJs) {
    //     techSelected += ' (NextJS) ';
    // } 
    // if (reactJs) {
    //     techSelected += ' (ReactJS) ';
    // } 
    // if (typeScript) {
    //     techSelected += ' (TypeScript) ';
    // }

    // const project = {   
    //     projectName: projectName,
    //     startDate: startDate,
    //     endDate: endDate,
    //     description: description,
    //     technologies: techSelected,
    //     imageFile: fileUpload,
    //   };
      const {projectName, description, fileUpload, nodeJs, nextJs, reactJs, typeScript} = req.body; 
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

      const image = "https://hips.hearstapps.com/hmg-prod/images/2025-tesla-cybertruck-3-672e75cce7814.jpg?crop=0.531xw:0.398xh;0.137xw,0.462xh&resize=640:*"

      const query = `INSERT INTO public."Projects"
                    (title, content, image, technologies)
                    VALUES
                    ('${projectName}', '${description}', '${fileUpload}', '${checkbox}')
      `

      const result = await sequelize.query(query, {type: QueryTypes.INSERT}) 

      console.log(result);

    //   projects.push(project);

    //   console.log(projects);
      
      res.redirect("project");
}

function renderTestimonial(req, res) {
    res.render("testimonial")
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

module.exports = {
    renderHome,
    renderFirstBlog,
    renderBlog,
    addProject,
    renderTestimonial,
    deleteProject,
    render404,
};