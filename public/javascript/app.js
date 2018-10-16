$(document).ready(function(){
  $.get("/articles",function(data){
    contentBuilder(data);
  });
});

$("#homeButton").on("click",function(){
  $.get("/articles",function(data){
    contentBuilder(data);
  });
});

$("#showFavorites").on("click",function(){
  $.get("/favorites",function(data){
    $("#scraperBlock").empty();
    contentBuilder(data);
  });
});

$("#scrapeButton").on("click",function(){
  $.ajax({
    url: "/api/scrape",
    type: "POST",
    data: {
      url: $("#scrapeOption").val()
    }
  }).then(function(data){
    let newTopic = $("#scrapeOption").val().replace("http://www.latimes.com/","").replace("/","");
    newTopic = newTopic.charAt(0).toUpperCase()+newTopic.substring(1);
    if(newTopic === ""){
      newTopic = "Home";
    }
    $("#currentPage").text(newTopic);
    $.ajax({
      url: "/articles",
      type: "GET"
    }).then(function(data){
      contentBuilder(data);
    });
  });
});


function contentBuilder(data){
  console.log(data);
  for(let i = 0; i < data.length; i++){
    let wrapper = $("<div>").addClass("scrapedArticles");
    let link = $("<a>").attr("href","http://www.latimes.com"+data[i].link);
    link.append("<h3>"+data[i].title+"</h3>");
    wrapper.append(link);
    wrapper.append("<h4>By: "+data[i].author+"</h4>");
    wrapper.append("<h5>"+data[i].blurb+"</h5>");
    let button = $("<button>").text("Show Notes").attr("data-id",data[i]._id);
    button.on("click",function(){
      noteBuilder($(this).attr("data-id"));
    });

    let favButton =$("<button>").attr("data-id",data[i]._id);
    favButton.attr("data-saved",data[i].saved);
    if(data[i].saved === false){
      favButton.text("Favorite");
    }
    else{
      favButton.text("Unfavorite");
    }
    favButton.on("click",function(){
      //update a value in model to be true
      $.ajax({
        type: "PUT",
        url: "/favorite",
        data:{
          id: $(this).attr("data-id"),
          saved: $(this).attr("data-saved")
        }
      }).then(function(data){
        console.log(data);
        location.reload();
      });
    });
    wrapper.append(favButton);

    wrapper.append(button);
    $("#scraperBlock").prepend(wrapper);
  }
}

function noteBuilder(id){
  $("#commentBlock").empty();
  //append all previous notes here.
  $.get("/articles/"+id,function(data){
    for(let i = 0; i < data.notes.length; i++){
      let notesWrap = $("<div>").addClass("noBlo");
      $(notesWrap).append(`<h2>${data.notes[i].title}</h2>`);
      $(notesWrap).append(`<h3>${data.notes[i].text}</h3>`);
      $("#commentBlock").append(notesWrap);
    }
    console.log(data);

    let wrapper = $("<div>");
    wrapper.append("<h2>Permenantly Etch Your Inane Opinions Here!</h2>");
    wrapper.append("<h3>Title</h3>");
    wrapper.append("<input id='noteTitle' type='text' placeholder='Title' />");
    wrapper.append("<h3>Comment</h3>");
    wrapper.append("<textarea id='noteText' class='noteArea'></textarea>");
    let button = $("<button>").text("Submit");
    button.attr("data-id",data._id);
    button.on("click",function(){
      let artId = $(this).attr("data-id");
      //saves Notes
      $.ajax({
        url: "/api/notes",
        type: "POST",
        data: {
          //article id
          id: id,
          title: $("#noteTitle").val(),
          text: $("#noteText").val()
        }
      }).then(function(data){
        $("#noteText").val("");
        $("#noteTitle").val("");
        noteBuilder(artId);
      });
    });
    wrapper.append(button);
    $("#commentBlock").prepend(wrapper);
  });
}
