$(document).ready(function(){
  $.get("/articles",function(data){
    contentBuilder(data);
  })
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
    wrapper.append(button);
    $("#scraperBlock").prepend(wrapper);
  }
}

function noteBuilder(id){
  $("#commentBlock").empty();
  //append all previous notes here.


  let wrapper = $("<div>");
  wrapper.append("<h2>Title</h2>");
  wrapper.append("<input id='noteTitle' type='text' placeholder='Title' />");
  wrapper.append("<h2>Comment</h2>");
  wrapper.append("<textarea id='noteText' class='noteArea'></textarea>");
  let button = $("<button>").text("Submit");
  button.on("click",function(){
    //saves Notes
    $.ajax({
      url: "/api/notes",
      type: "POST",
      data: {
        id: id,
        title: $("#noteTitle").val(),
        text: $("#noteText").val()
      }
    }).then(function(data){
      $("#noteText").val("");
      $("#noteTitle").val("");
    });
  });
  wrapper.append(button);
  $("#commentBlock").prepend(wrapper);
}
