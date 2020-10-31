$(document).ready(function(){
    $("a.qlcv-task-template").click(function(){
          var taskId = $(this).attr("hhhh");
          $("div#"+taskId).slideToggle();
    });
  });