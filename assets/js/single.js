var issueContainerEl = document.querySelector("#issues-container");
var limitWarningEl = document.querySelector("#limit-warning");
var repoNameEl = document.querySelector("#repo-name");

var getRepoName = function () {
  //grab repo name from query string
  var queryString = document.location.search;

  //if repo name exists, display repoName & Issues
  var repoName = queryString.split("=")[1];
  if(repoName){
  getRepoIssues(repoName);
  repoNameEl.textContent = repoName;
  //if repo doesnt exist, go redirect to index.html
  }else{
    location.replace("./index.html");
  }
}


var getRepoIssues = function (repo) {
  var apiURL = "https://api.github.com/repos/" + repo + "/issues?direction=asc";
  fetch(apiURL).then(function (response) {
    //if request was successful
    if (response.ok) {
      response.json().then(function (data) {
        //pass response data to dom function
        displayIssues(data);

        //check if api has paginated issues
        if (response.headers.get("Link")){
            displayWarning(repo);
        }
      });
    } else {
      location.replace("./index.html");
    }
  });
};
getRepoName();

var displayIssues = function (issues) {
    if(issues.length===0){
        issueContainerEl.textContent = "This repo has no open issues.";
        return;
    }
  for (var i = 0; i < issues.length; i++) {
    //create a link element to take users to the issue on Github
    var issuesEl = document.createElement("a");
    issuesEl.classList =
      "list-item flex-row justify-space-between align-center";
    issuesEl.setAttribute("href", issues[i].html_url);
    issuesEl.setAttribute("target", "_blank");

    //create span to hold the issue title
    var titleEl = document.createElement("span");
    titleEl.textContent = issues[i].title;

    //append to container
    issuesEl.appendChild(titleEl);

    //create a type element
    typeEl = document.createElement("span");

    //check if the issues is an actual issue or pull request
    if (issues[i].pull_request) {
      typeEl.textContent = "(Pull request)";
    } else {
      typeEl.textContent = "(Issue)";
    }
    //append to container
    issuesEl.appendChild(typeEl);
    issueContainerEl.appendChild(issuesEl);

  };
};


var displayWarning = function(repo){
    //add text to warning container
//add "a" element
var linkEl = document.createElement("a");
linkEl.textContent="See more issues on GitHub.com";
linkEl.setAttribute("href", 'https://github.com/' + repo + '/issues');
linkEl.setAttribute("target", "_blank");
limitWarningEl.appendChild(linkEl);
};
