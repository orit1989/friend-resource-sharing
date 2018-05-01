$(document).ready(function() {
    // This file just does a GET request to figure out which user is logged in
    // and updates the HTML on the page
    
    $.get("/api/user_data").then(function(data) {
      $(".dropdown-toggle").text("Welcome, " + data.firstName);
      $(".dropdown-toggle").append("<b class='caret'></b>");
      window.sessionStorage.setItem("user", JSON.stringify(data));
    });
  
    var user = JSON.parse(window.sessionStorage.getItem("user"));
    var userId = user.id; 
    var friendsList = $("#friends-table");
    var publicList = $("#public-table");
    var container = $("container");
  
    function createFriendsRow(resourceData) {
      var newTr = $("<tr>");
      newTr.append($("<td>").append(resourceData.User.firstName)); 
      newTr.append($("<td>").append(resourceData.User.lastName)); 
      newTr.append($("<td>").append(resourceData.topic));
      newTr.append("<td class='link'><a target='_blank' href='" + resourceData.link + "'>" + resourceData.link + "</a></td>");
      newTr.append($("<td>").append(resourceData.description));    
      return newTr;
    }

    function createPublicRow(resourceData) {
      var newTr = $("<tr>");
      newTr.append($("<td>").append(resourceData.topic)); 
      newTr.append("<td class='link'><a target='_blank' href='" + resourceData.link + "'>" + resourceData.link + "</a></td>");
      newTr.append($("<td>").append(resourceData.description));    
      return newTr;
    }


    // Function for retrieving shared resources and getting them ready to be rendered to the page
    function getFriendsResources(userId) {
      $.get("/api/resources/" + userId + "/shared", function(data) {
        var rowsToAdd = [];
        for (var i = 0; i < data.length; i++) {
          rowsToAdd.push(createFriendsRow(data[i]));
        }
        renderFriendsList(rowsToAdd);
       });
    }

    function getPublicResources() {

        $.get("/api/public", function(data) {
        var rowsToAdd = [];
        for (var i = 0; i < data.length; i++) {
          rowsToAdd.push(createPublicRow(data[i]));
        };

        renderPublicList(rowsToAdd);
       });
    }
  
    // A function for rendering the list of authors to the page
    function renderFriendsList(rows) {
      if (rows.length) {
        friendsList.prepend(rows);
      }
      else {
        renderFriendsEmpty();
      }
    }

    function renderPublicList(rows) {
      if (rows.length) {
        publicList.prepend(rows);
      }
      else {
        renderPublicEmpty();
      }
    }
  
    // Function for handling what to render when there are no resources
    function renderFriendsEmpty() {
      var alertDiv = $("<div>");
      alertDiv.addClass("alert alert-danger");
      alertDiv.text("No Friends Resources to display.");
      container.append(alertDiv);
    }


    // Function for handling what to render when there are no resources
    function renderPublicEmpty() {
      var alertDiv = $("<div>");
      alertDiv.addClass("alert alert-danger");
      alertDiv.text("No Public Resources to display.");
      container.append(alertDiv);
    }
  
    getFriendsResources(userId);
    getPublicResources();
  
  });
  
  
  
  