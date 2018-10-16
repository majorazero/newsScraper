$("#scrapeButton").on("click",function(){
  $.ajax({
    url: "/api/scrape",
    type: "POST",
    data: {
      url: $("#scrapeOption").val()
    }
  }).then(function(data){
    console.log(data);
  });
});
