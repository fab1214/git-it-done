var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#username");
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTermEl = document.querySelector("#repo-search-term");
//create function to execute when button submission event is triggered
var formSubmitHandler = function (event) {
  event.preventDefault();
  //assign username input to a variable
  var username = nameInputEl.value.trim();
  //if username has value, pass to getUserRepos function to generate URL
  if (username) {
    getUserRepos(username);
    //clear input after value is captured
    nameInputEl.value = "";
  } else {
    alert("Please enter a GitHub username");
  }
};

//create event for button submission and pass formSubmitHandler function as parameter
userFormEl.addEventListener("submit", formSubmitHandler);

var getUserRepos = function (user) {
  //format url to include all users
  var apiUrl = "https://api.github.com/users/" + user + "/repos";

  //make API request to the url
  fetch(apiUrl)
    .then(function (response) {
      //request was successful
      if (response.ok) {
        response.json().then(function (data) {
          displayRepos(data, user);
        });
      } else {
        alert("Error: GitHub User Not Found");
      }
    })
    .catch(function (error) {
      //Notice this 'catch' getting chained onto the end of the 'then() method
      alert("Unable to connect to GitHub");
    });
};
var displayRepos = function (repos, searchTerm) {
  // check if api returned any repos
  if (repos.length === 0) {
    repoContainerEl.textContent = "No repositories found.";
    return;
  }
  console.log(repos);
  console.log(searchTerm);
  //clear old content
  repoContainerEl.textContent = "";
  repoSearchTermEl.textContent = searchTerm;
  //loop through repos
  for (var i = 0; i < repos.length; i++) {
    var repoName = repos[i].owner.login + "/" + repos[i].name;

    //create container for each repo
    var repoEl = document.createElement("a");
    repoEl.classList =
      "list-item flex-row justify-content-space-between align-center";
    repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName);
    //create a span element to hold repository name
    var titleEl = document.createElement("span");
    titleEl.textContent = repoName;

    //append login & repo name to container
    repoEl.appendChild(titleEl);

    // create a status element
    var statusEl = document.createElement("span");
    statusEl.classList = "flex-row align-center";

    // check if current repo has issues or not
    if (repos[i].open_issues_count > 0) {
      statusEl.innerHTML =
        "<i class='fas fa-times status-icon icon-danger'></i>" +
        repos[i].open_issues_count +
        " issue(s)";
    } else {
      statusEl.innerHTML =
        "<i class='fas fa-check-square status-icon icon-success'></i>";
    }
    // append to container
    repoEl.appendChild(statusEl);
    //append container to the DOM
    repoContainerEl.appendChild(repoEl);
  }
};
