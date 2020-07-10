(function ($) {
  $(document).ready(function () {
    var current = window.location.pathname;
    $('#block-pricing ul li a').each(function () {
      var item = this.pathname;
      if (current == item) {
        $(this).addClass("is-active");
      }
    });
  });
}(jQuery));