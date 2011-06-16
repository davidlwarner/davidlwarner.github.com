$(window).load(function() {
  
  $('#main img').each(function (i) {
    $(this).click(function() {
      $(this).toggleClass('zoom');
      $(this).siblings('.about').each(function (p) {
        $(this).toggleClass('hide');
      });
    });
  });

  // Set up project nav
  hideAllProjects();
  showProject($('#projects section:first-child'));

  // Set up project nav clicking
  $('nav#work').find('a').each(function (a) {
    $(this).click(function () {
      if (!$(this).hasClass('on')) {
        $('nav#work a.on').removeClass('on');
        $(this).addClass('on');
        hideAllProjects();
        showProject($(this).attr('href'));
      }
      return false;
    })
  });
});

function hideAllProjects() {
  $('#projects').children().each(function (c) {
    $(this).hide();
  });
}

function showProject(p) {
  hideAllProjects();
  $(p).show();
}
