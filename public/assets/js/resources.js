$(document).ready(function () {
  // This file just does a GET request to figure out which user is logged in
  // and updates the HTML on the page

  $.get("/api/user_data").then(function (data) {
    // console.log(data);
    $(".dropdown-toggle").text("Welcome, " + data.firstName);
    $(".dropdown-toggle").append("<b class='caret'></b>");
    window.sessionStorage.setItem("user", JSON.stringify(data));
  });

  var user = JSON.parse(window.sessionStorage.getItem("user"));
  var userId = user.id;
  var resourcesList = $("tbody");
  var container = $("container");

  function createResourceRow(resourceData) {
    var newTr = $("<tr id='" + resourceData.id + "'>");
    newTr.data(resourceData);
    var editButton = '<p data-placement="top" data-toggle="tooltip" title="Edit"><button ' + 'value="' + resourceData.id + '" class="edit btn btn-primary btn-xs" data-title="Edit" data-toggle="modal" data-target="#edit"><span class="glyphicon glyphicon-pencil"></span></button></p>';
    var deleteButton = '<p data-placement="top" data-toggle="tooltip" title="Delete"> <button ' + 'value="' + resourceData.id + '" class="delete btn btn-danger btn-xs" data-title="Delete" data-toggle="modal" data-target="#delete"><span class="glyphicon glyphicon-trash"></span></button></p>';
    newTr.append("<td>" + '<input type="checkbox" class="checkthis" />' + "</td>");
    newTr.append("<td class='topic'>" + resourceData.topic + "</td>");
    newTr.append("<td class='link'><a target='_blank' href='" + resourceData.link + "'>" + resourceData.link + "</a></td>");
    newTr.append("<td class='description'> " + resourceData.description + "</td>");
    newTr.append("<td> " + resourceData.isPublic + "</td>");
    newTr.append("<td> " + editButton + "</td>");
    newTr.append("<td> " + deleteButton + "</td>");

    return newTr;
  }

  var editedResource;
  $(document).on("click", ".edit", function () {
    editedResource = true;
    let resourceId = $(this).val();
    let topic = $("#" + resourceId).find(".topic").text();
    let link = $("#" + resourceId).find(".link").text();
    let description = $("#" + resourceId).find(".description").text();
    $(".resourceForm").attr("data-resource-id", resourceId);
    $("#topic").attr("value", topic);
    $("#link").attr("value", link);
    $("#description").text(description);
  })

  function updateResource(resource) {
    $.ajax({
        method: "PUT",
        url: "/api/resources/" + resource.resourceId,
        data: resource
      })
      .then(function (res) {
        window.location.href = "/resources";
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  $(document).on("click", ".delete", function () {
     $(this).parent().parent().remove();
  })

  // function deleteResource() {
  //   var listItemData = $(this).parent("td").parent("tr").data("resource");
  //   var id = listItemData.id;
  //   $.ajax({
  //       method: "DELETE",
  //       url: "/api/resources/" + resource.resourceId
  //     })
  //     .then(function (res) {
  //       window.location.href = "/resources";
  //     })
  // }

  // Function for retrieving  resources and getting them ready to be rendered to the page
  function getResources(userId) {
    $.get("/api/resources/" + userId, function (data) {
      var rowsToAdd = [];
      for (var i = 0; i < data.length; i++) {
        rowsToAdd.push(createResourceRow(data[i]));
      }
      renderResourceList(rowsToAdd);
    });

  }

  function getHBResources(userId) {
    $.get("/api/resources/" + userId, function (req, res) {
      var hbsObject = {
        resources: req.data
      };
      res.render("resources", hbsObject);
    });
  }


  function renderResourceList(rows) {
    if (rows.length) {
      // console.log(rows);
      resourcesList.prepend(rows);
    } else {
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

  
  var topicInput = $("#topic");
  var linkInput = $("#link");
  var descriptionInput = $("#description");

  // Adding an event listener for when the form is submitted
  $("#save").on("click", handleNewResource);

  function handleNewResource(event) {
    event.preventDefault();

    var resourceId = $(".resourceForm").data("resource-id") || null;

    // Constructing a newPost object to hand to the database
    var newResource = {
      topic: topicInput.val().trim(),
      link: linkInput.val().trim(),
      description: descriptionInput.val().trim(),
      isPublic: "false",
      UserId: userId,
      resourceId: resourceId
    };
    console.log('editedResource: ', editedResource);
    if (editedResource) {
      updateResource(newResource);
    } else {
      submitResource(newResource);
    }

  }

  function submitResource(resource) {
    $.post("/api/resources", resource, function () {
      window.location.href = "/resources";
    });
  }
 

  //Not using handlebars
  getResources(userId);

  // Using Handlebars
  // getHBResources(userId);


});