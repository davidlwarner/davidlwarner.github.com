$(window).load(function() {
  
  // panelNum = 0;
  // 
  // $('.panel-container').each(function (c) {
  //   l_arrow = $.browser.mac() ? "◀" : "◄";
  //   panelNum++;
  //   $(this)
  //     .before('<div class="pager" id="nav'+panelNum+'"></div><div class="arrows"><a href="#" class="prev" id="prev'+panelNum+'">'+l_arrow+'</a><a href="#" class="next" id="next'+panelNum+'">►</a></div>')
  //     .cycle({
  //       fx: 'scrollHorz',
  //       timeout: 0,
  //       next: '#next'+panelNum,
  //       prev: '#prev'+panelNum,
  //       pager: '#nav'+panelNum
  //     })
  //     .touchwipe({
  //       wipeLeft: function() {
  //         $(this).cycle("next");
  //       },
  //       wipeRight: function() {
  //         $(this).cycle("prev");
  //       }
  //     });
  // });
  

  // Set up project panels
  l_arrow = $.browser.mac() ? "◀" : "◄";
  $('.panel-container').each(function (p) {
    // Make full width
    var panelContainer = $(this);
    var panelInner = panelContainer.children()[0];
    var currentPanel = 0;
    var totalPanels = panelContainer.find('.panel').length;
    var panelWidth = panelContainer.width();
    
    // make container width of all panels
    panelContainer.width(panelWidth * totalPanels);
  
    // create panel nav
    panelContainer.before('<a href="#" class="prev">'+l_arrow+'</a><a href="#" class="next">►</a>');
    
    goToPanel = function (n, container) {
      container.css('left', -(panelWidth*n));
    };
    
    panelContainer.siblings('.next').click(function () {
      currentPanel = (currentPanel < (totalPanels-1)) ? currentPanel+1 : 0;
      goToPanel(currentPanel, panelContainer);
      return false;
    });
    panelContainer.siblings('.prev').click(function () {
      currentPanel = (currentPanel == 0) ? (totalPanels-1) : (currentPanel-1);
      goToPanel(currentPanel, panelContainer);
      return false;
    });
  });
  
  $('.panel img').each(function (i) {
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

// $(window).load(function() {
//   $(".coda-slider").each(function (t) {
//     l_arrow = $.browser.mac() ? "◀" : "◄";
//     $(this).codaSlider({
//       dynamicArrowLeftText: l_arrow,
//       dynamicArrowRightText: "►",
//       crossLinking: false
//     });
//   });
//   
//   $('nav#work').find('li').each(function (c) {
//     // Hide all but first
//     anchor = $(this).children('a');
// 
//     if (c == 0) {
//       currentProject = anchor.attr('href');
//     } else {
//       $(anchor.attr('href')).hide();
//     }
//     
//     // Click handlers
//     anchor.click(function () {
//       clickId = $(this).attr('href');
//       if (clickId != currentProject) {
//         oldProject = currentProject;
//         currentProject = clickId;
//         $(oldProject).hide();
//         $(currentProject).show();
//         
//         // Update nav
//         $('nav#work a[href='+oldProject+']').removeClass('on');
//         $('nav#work a[href='+currentProject+']').addClass('on');
//       }
//       return false;
//     });
//   });
//   
//   // click it
//   $('.panel img').each(function (i) {
//     $(this).click(function() {
//       $(this).toggleClass('zoom');
//       $(this).siblings('.about').each(function (p) {
//         $(this).toggleClass('hide');
//       });
//     });
//   });
// });
