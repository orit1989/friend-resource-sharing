$(document).ready(function() {
    // This file just does a GET request to figure out which user is logged in
    // and updates the HTML on the page
    
    var resourcesList = $("tbody");
    var container = $("container");
  
    function createResourceRow(resourceData) {
      var newTr = $("<tr>");
      newTr.data(resourceData);
      newTr.append("<td>" + resourceData.firstName + ' ' + resourceData.lastName + "</td>");
      newTr.append("<td> " + resourceData.link + "</td>");
      newTr.append("<td> " + resourceData.description + "</td>");     
      return newTr;
    }
  
    // Function for retrieving public resources and getting them ready to be rendered to the page
    function getPublicResources() {
      $.get("/api/resources/public", function(data) {
        var rowsToAdd = [];
        for (var i = 0; i < data.length; i++) {
          rowsToAdd.push(createResourceRow(data[i]));
        }
        renderResourceList(rowsToAdd);
       });
    }
   
    // A function for rendering the list of authors to the page
    function renderResourceList(rows) {
      if (rows.length) {
        console.log(rows);
        resourcesList.prepend(rows);
      }
      else {
        renderEmpty();
      }
    }
  
    // Function for handling what to render when there are no resources
    function renderEmpty() {
      var alertDiv = $("<div>");
      alertDiv.addClass("alert alert-danger");
      alertDiv.text("Please create a resource.");
      container.append(alertDiv);
    }
  
  
    getPublicResources();
  
  });
  
  
  
  