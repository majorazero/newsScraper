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
  for(let i = 0; i < data.length; i++){
    let wrapper = $("<div>").addClass("scrapedArticles");
    let link = $("<a>").attr("href","http://www.latimes.com"+data[i].link);
    link.append("<h3>"+data[i].title+"</h3>");
    wrapper.append(link);
    wrapper.append("<h4>By: "+data[i].author+"</h4>");
    wrapper.append("<h5>"+data[i].blurb+"</h5>");
    let button = $("<button>").text("Show Notes");
    button.on("click",function(){
      //noteBuilder();
    });
    wrapper.append(button);
    $("#scraperBlock").prepend(wrapper);
  }
}
