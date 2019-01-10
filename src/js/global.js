document.addEventListener("DOMContentLoaded", function() {
  // code...
  const whereAreWe = "here";
  console.log(whereAreWe);
});

$(document).ready(function () {
  $('a').each(function () {
    const ele = new RegExp(`/${window.location.host}/`);
    if (!ele.test(this.href)) {
      $(this).attr('target', '_blank');
    }
  });
});
