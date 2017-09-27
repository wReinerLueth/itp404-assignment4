let reposTemplate = $('#repos-template').html();
let renderRepos = Handlebars.compile(reposTemplate);

let repoTemplate = $('#repo-template').html();
let renderRepo = Handlebars.compile(repoTemplate);

let repoList = [];
let searchList = [];
let username = "";
let created = "";
let repoName = "";

$('#search-button').on('click', function() {
  repoList = [];
  let username = $('textarea').val();

  searchList.push(username);

  getRepoInfo(username);

  $.ajax({
    type: 'GET',
    url: 'http://localhost:3000/api/searches'
  }).then(function(response) {
    // $.each(response, function(i){
      // if(typeof searchList[i] != 'undefined'){
        $('#search-list').append(`
          <li class="searches">
            ${username}
          </li>
        `)
      // }
    // })
  });
});

function getRepoInfo(username) {
  $.ajax({
    type: 'GET',
    url: 'http://api.github.com/users/'+username+'/repos'
  }).then(function(response) {
    $.each(response, function(i){
      created = response[i].created_at;
      repoName = response[i].name;

      $.ajax({
        type: 'post',
        url: 'http://localhost:3000/api/searches',
        data: {
          term: repoName,
          createdAt: created
        }
      }).then(function(response) {
        repoList.push(response);
        renderRepoList();
      });
    });
  });
}

function renderRepoList() {
  let reposHTML = renderRepos({
    repos: repoList
  });
  $('div#repo-display').html(reposHTML);
}
