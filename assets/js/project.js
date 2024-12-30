let projects = [];

const iconStack = {
  "Node JS": `   <img
                src="https://img.icons8.com/?size=100&id=FQlr_bFSqEdG&format=png&color=000000"
                alt="node js"
              />`,
  "React JS": ` <img
                src="https://img.icons8.com/?size=100&id=122637&format=png&color=000000"
                alt="react js"
              />`,

  "Next JS": `<img
                src="https://img.icons8.com/?size=100&id=yUdJlcKanVbh&format=png&color=000000"
                alt="next Js"
              />`,
  "TypeScript": `<img
                src="https://img.icons8.com/?size=100&id=cHBUT9SmrD2V&format=png&color=000000"
                alt="next Js"
              />`,
};

function addProject(e) {
  e.preventDefault();
  const projectName = document.getElementsByName("projectName")[0].value;
  const startDate = document.getElementsByName("startDate")[0];
  const endDate = document.getElementsByName("endDate")[0];
  const description = document.getElementsByName("description")[0].value;
  const imageInput = document.getElementById("fileUpload");
  const techs = document.querySelectorAll(
    '.checkbox div input[type="checkbox"]'
  );
  const techSelected = [];

  techs.forEach((tech) => {
    tech.checked ? techSelected.push(tech.value) : null;
  });
  const imageUrl = URL.createObjectURL(imageInput.files[0]);
  const duration = countDuration(startDate, endDate);
  const project = {
    projectName: projectName,
    duration: duration,
    startDate: startDate.value,
    endDate: endDate.value,
    description: description,
    techSelected: techSelected,
    imageUrl: imageUrl,
  };

  projects.push(project);
  renderProjects();
}

function countDuration(startDate, endDate) {
  const startValue = new Date(startDate.value);
  const endValue = new Date(endDate.value);
  const duration =
    (endValue.getTime() - startValue.getTime()) / (1000 * 3600 * 24);

  return duration;
}

function renderProjects() {
  const projectList = document.getElementById("projectList");
  projectList.innerHTML = "";
  let id = 0;

  projects.forEach((project) => {
    let techIcon = "";
    project.techSelected.forEach((tech) => {
      techIcon += iconStack[tech];
    });
    projectList.innerHTML += ` <div class="project-card" id="${id}" onclick="showDetail(${id})" >
            <img
              src="${project.imageUrl}"
              alt="project image"
            />
            <p class="title">${project.projectName}</p>
            <p class="duration">durasi : ${
              project.duration > 30
                ? Math.floor(project.duration / 30)
                : project.duration
            } ${project.duration > 30 ? "Bulan" : "Hari"}</p>
            <p class="content-card">
              ${project.description.substring(0, 45)}
            </p>

            <div class="icon-card">
            ${techIcon}
            
            </div>
            <div class="btn-card">
              <button class="btn-primary">edit</button>
              <button class="btn-primary">Delete</button>
            </div>
          </div>`;
    id++;
  });
}

function showDetail(id) {
  const project = projects[id];
  const detail = document.getElementById("detail");
  const formProject = document.getElementById("formProject");
  formProject.hidden = true;
  detail.hidden = false;

  let techIcon = "";
  project.techSelected.forEach((tech) => {
    techIcon += `<div>${iconStack[tech]}<p>${tech}</p></div>`;
  });

  const detailContent = document.getElementById("detailContent");
  detailContent.innerHTML = `
    <h1>${project.projectName}</h1>
            <figure class="detail-figure">
                <img src="${project.imageUrl}"
                    alt="project image">
                <div class="detail-project-layout">
                    <div>
                        <p>Duration</p>
                        <div class="detail-project">
                            <img src="https://img.icons8.com/?size=100&id=59758&format=png&color=000000" alt="calender">
                            <p>${project.startDate} - ${project.endDate}</p>
                        </div>
                        <div class="detail-project">
                            <img src="https://img.icons8.com/?size=100&id=70370&format=png&color=000000" alt="time">
                            <p>${
                              project.duration > 30
                                ? Math.floor(project.duration / 30)
                                : project.duration
                            } ${project.duration > 30 ? "Bulan" : "Hari"}</p>
                        </div>
                    </div>
                    <div>
                        <p>Technologies</p>
                        <div class="details-technologies">
                            ${techIcon}
                        </div>
                    </div>
                </div>
            </figure>
            <article class="detail-article">
                <p>${project.description}</p>
            </article>
  `;
}