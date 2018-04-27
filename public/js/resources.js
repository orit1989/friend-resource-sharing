
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
  