$(document).ready(function() {
  
    // Function for creating a new list row for resources
    function createResourceRow(resourceData) {
      var newTr = $("<tr>");
      newTr.data("resource", resourceData);
      newTr.append("<td>" + resourceData.firstName + ' ' + resourceData.lastName + "</td>");
      newTr.append("<td> " + resourceData.link + "</td>");
      newTr.append("<td> " + resourceData.description + "</td>");     
      return newTr;
    }
  
    // Function for retrieving  resources and getting them ready to be rendered to the page
    function getResources(userId) {
      $.get("/api/resources/:userId", function(data) {
        var rowsToAdd = [];
        for (var i = 0; i < data.length; i++) {
          rowsToAdd.push(createResourceRow(data[i]));
        }
        renderResourceList(rowsToAdd);
       });
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

    // Function for retrieving shared resources and getting them ready to be rendered to the page
    function getSharedResources(userId) {
      $.get("/api/resources/:userId/shared", function(data) {
        var rowsToAdd = [];
        for (var i = 0; i < data.length; i++) {
          rowsToAdd.push(createResourceRow(data[i]));
        }
        renderResourceList(rowsToAdd);
       });
    }

  });

  function renderResourceList(rows) {
    resourceList.children().not(":last").remove();
    resourceContainer.children(".alert").remove();
    if (rows.length) {
      console.log(rows);
      authorList.prepend(rows);
    }
    else {
      renderEmpty();
    }
  };

    // Function for handling what to render when there are no authors
    function renderEmpty() {
      var alertDiv = $("<div>");
      alertDiv.addClass("alert alert-danger");
      alertDiv.text("You must create an Resource before you can create a Post.");
      resourceContainer.append(alertDiv);
    }
  
    // Function for handling what happens when the delete button is pressed
    function handleDeleteButtonPress() {
      var listItemData = $(this).parent("td").parent("tr").data("author");
      var id = listItemData.id;
      $.ajax({
        method: "DELETE",
        url: "/api/resources/" + id
      })
        .then(getResources);
    }
});
  