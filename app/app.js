$(document).ready(function(){
    console.log('YES');

    var _id;

    $("#scrape").on('click', function(){

      $.get("/scrape", function(){
      })
      .done(function(){
        window.location = "/";
      })
      .fail(function(err){
        alert(JSON.stringify(err));
      });

    });

    $("#inner").on('click', '.saved', function(){
      _id = $(this).attr('data-id');

      $.post("/saved/" + _id, function(){
        console.log('saved');
      })
      .done(function(){
        window.location = "/";
      })
      .fail(function(err){
        alert(JSON.stringify(err));
      });

    });

    $("#inner").on('click', '.unsaved', function(){
      _id = $(this).attr('data-id');

      $.post("/unsaved/" + _id, function(){
        console.log('unsaved');
      })
      .done(function(){
        window.location = "/saved";
      })
      .fail(function(err){
        alert(JSON.stringify(err));
      });

    });

    $("#inner").on('click', 'p', function(){
      console.log('clicked p');
      _id = $(this).attr('data-id');
      console.log(_id);

      $.get("/notes/" + _id, function(){
        console.log('notes');
      })
      .done(function(data){
        console.log(data);
        $("#title").text(data.title);
        $("#resultsModal").modal("toggle");

        $(".note-body").remove();
        $(".delete-button").remove();

        for(var i = 0; i < data.notes.length; i++){
          var newDiv = $("<div>").text(data.notes[i].body);
          newDiv.attr('class', 'note-body');
          var newButton = $("<button>").text('Delete');
          newButton.attr('class', 'delete-button');
          newButton.attr('data-id', data.notes[i]._id);

          $("#modal-insert").append(newDiv);
          $("#modal-insert").append(newButton);
        }

      })
      .fail(function(err){
        console.log(err);
      });

    });

    $(".container-fluid").on('click', ".delete-button", function(){
      _id = $(this).attr('data-id');

      $.post("/delete/" + _id, function(){
        console.log('deleting');
      })
      .then(function(){
        location.reload();
      })
      .fail(function(err){
        alert(JSON.stringify(err));
      });

    });

    $(".container-fluid").on('click', '#submitNote', function(event){
      event.preventDefault();

      var note = {
        text: $("#inputNote").val()
      }

      $.post("/notes/" + _id, note)
      .then(function(){
        location.reload();
      })
      .fail(function(err){
        alert(JSON.stringify(err));
      });

    });

});
