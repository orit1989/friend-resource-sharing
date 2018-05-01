$(document).ready(function () {
  // This file just does a GET request to figure out which user is logged in
  // and updates the HTML on the page

  var user;
  var userId;

  $.get("/api/user_data").then(function (data) {
    $(".dropdown-toggle").text("Welcome, " + data.firstName);
    $(".dropdown-toggle").append("<b class='caret'></b>");
    window.sessionStorage.setItem("user", JSON.stringify(data));
     user = data;
     userId = user.id;
    getResources(userId);
    getUsers();
  });

  user = JSON.parse(window.sessionStorage.getItem("user"));
  userId = user.id;

  var resourcesList = $("#myTable-body");
  var userList = $("#sharedTable-body");
  var container = $("container");

  function createResourceRow(resourceData) {
    var newTr = $("<tr id='" + resourceData.id + "'>");
    var checkbox = $("<input>");
    checkbox.attr("type", "checkbox");
    checkbox.addClass("checkThis");
    checkbox.attr("data-id", resourceData.id);
    newTr.data(resourceData);
    var editButton = '<p data-placement="top" data-toggle="tooltip" title="Edit"><button ' + 'value="' + resourceData.id + '" class="edit btn btn-primary btn-xs" data-title="Edit" data-toggle="modal" data-target="#edit"><span class="glyphicon glyphicon-pencil"></span></button></p>';
    var deleteButton = '<p data-placement="top" data-toggle="tooltip" title="Delete"> <button ' + 'value="' + resourceData.id + '" class="delete btn btn-danger btn-xs" data-title="Delete" data-toggle="modal" data-target="#delete"><span class="glyphicon glyphicon-trash"></span></button></p>';
    newTr.append($("<td>").append(checkbox));
    newTr.append("<td class='topic'>" + resourceData.topic + "</td>");
    newTr.append("<td class='link'><a target='_blank' href='" + resourceData.link + "'>" + resourceData.link + "</a></td>");
    newTr.append("<td class='description'> " + resourceData.description + "</td>");
    newTr.append($("<td>").append(resourceData.isPublic));
    newTr.append($("<td>").append(editButton));
    newTr.append($("<td>").append(deleteButton));
    return newTr;
  }

  function createUserRow(userData) {
    var id = userData.id;
    if (id != userId) {
      var newTr = $("<tr>");
      var button = $("<button>");
      button.text("Share");
      button.attr("id", "saveShared");
      button.attr("data-id", id);
      newTr.data(userData);
      newTr.append($("<td>").append(button));
      newTr.append("<td>" + userData.firstName + "</td>");
      newTr.append("<td> " + userData.lastName + "</td>");
      newTr.append("<td> " + userData.email + "</td>");
      return newTr;
    }
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
    let resourceId = $(this).val();
    $("#" + resourceId).remove();
    $.ajax({
        method: "DELETE",
        url: "/api/resources/" + resourceId
      })
      .then(function (res) {
        window.location.href = "/resources";
      })
  })

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

  function getUsers(userId) {
    $.get("/api/users/", function (data) {
      var rowsToAdd = [];
      for (var i = 0; i < data.length; i++) {
          rowsToAdd.push(createUserRow(data[i]));
      }
      renderUserList(rowsToAdd);
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
      resourcesList.prepend(rows);
    } else {
      renderEmpty();
    }
  }

  function renderUserList(rows) {
    if (rows.length) {
      userList.prepend(rows);
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

  // Adding an event listener for when the form is submitted
  $(document).on("click", "#save", handleNewResource);
  $(document).on("click", "#saveShared", handleNewShare);

  function handleNewResource(event) {
    event.preventDefault();

    var topicInput = $("#topic");
    var linkInput = $("#link");
    var descriptionInput = $("#description");
    var isPublicInput = $('#public').is(":checked");
    var resourceId = $(".resourceForm").data("resource-id") || null;

    // Constructing a newPost object to hand to the database
    var newResource = {
      topic: topicInput.val().trim(),
      link: linkInput.val().trim(),
      description: descriptionInput.val().trim(),
      isPublic: isPublicInput,
      UserId: userId,
      resourceId: resourceId
    };

    if (editedResource) {
      updateResource(newResource);
    } else {
      submitResource(newResource);
    }

  }

  function handleNewShare(event) {
    event.preventDefault();

    var newShare = {
      userToShareId: $(this).attr("data-id"),
    };

    $("#myTable-body :checked").each(function (index) {
      newShare.resourceId = $(this).attr("data-id");
      submitShare(newShare);
    });

  }

  function submitResource(resource) {
    $.post("/api/resources", resource, function () {
      window.location.href = "/resources";
    });
  }


  function submitShare(share) {
    $.post("/api/shared", share, function () {
      window.location.href = "/resources";
    });
  }

  // Using Handlebars
  // getHBResources(userId);


});