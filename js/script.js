$(window).load(function() {
  $(".coda-slider").each(function (t) {
    l_arrow = $.browser.mac() ? "◀" : "◄";
    $(this).codaSlider({
      dynamicArrowLeftText: l_arrow,
      dynamicArrowRightText: "►",
      crossLinking: false
    });
  });
  
  $('nav#work').find('li').each(function (c) {
    // Hide all but first
    anchor = $(this).children('a');

    if (c == 0) {
      currentProject = anchor.attr('href');
    } else {
      $(anchor.attr('href')).hide();
    }
    
    // Click handlers
    anchor.click(function () {
      clickId = $(this).attr('href');
      if (clickId != currentProject) {
        oldProject = currentProject;
        currentProject = clickId;
        $(oldProject).hide();
        $(currentProject).show();
        
        // Update nav
        $('nav#work a[href='+oldProject+']').removeClass('on');
        $('nav#work a[href='+currentProject+']').addClass('on');
      }
      return false;
    });
  });
});
