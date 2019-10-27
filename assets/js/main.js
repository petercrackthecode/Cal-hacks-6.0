(function($) {
  var $window = $(window),
    $body = $("body"),
    $main = $("#main");

  // Breakpoints.
  breakpoints({
    xlarge: ["1281px", "1680px"],
    large: ["981px", "1280px"],
    medium: ["737px", "980px"],
    small: ["481px", "736px"],
    xsmall: ["361px", "480px"],
    xxsmall: [null, "360px"]
  });

  // Play initial animations on page load.
  $window.on("load", function() {
    window.setTimeout(function() {
      $body.removeClass("is-preload");
    }, 100);
  });

  let $analyze = $("#analyze");

  const handleResults = results => {
    const readableResults = results.map(item => [item[0], item[1] * 100]);
    readableResults.forEach(item => {
      $("#table-analysis").append(
        "<tr><td>" +
          item[0] +
          "</td><td>" +
          Math.round(item[1] * 100) / 100 +
          "%</td></tr>"
      );
    });

    const getRandomColor = () => {
      let letters = "0123456789ABCDEF";
      let color = "#";

      while (color === "#" || color === "#FFFFFF") {
        color = "#";
        for (let index = 0; index < 6; index++) {
          color += letters[Math.floor(Math.random() * 15)];
        }
      }

      return color;
    };

    const w = 1000;
	const h = 200;
	const yScale= 30;
	const xScale= 50;
    (function() {
      let svg = d3
        .select("strong")
        .append("svg")
        .attr("width", w + 'px')
		.attr("height", h + 'px');
		

	  console.log('d3.select("strong")= ', d3.select('strong'));
	  console.log(svg, " working?");

        d3
        .selectAll("rect")
        .data(readableResults)
        .enter()
        .append("rect")
        .attr("x", (d, i) => i * xScale)
        .attr("y", (d, i) => (d[1] > 1) ? h - yScale * d[1] : h - 1)
        .attr("width", 25)
        .attr("height", (d, i) => d[1] * 10000)
        .attr("fill", 'navy');

      let rect= svg
        .selectAll("text")
        .data(readableResults)
        .enter()
        .append("text")
        .text(data => data[0])
        .attr("x", (data, i) => i * xScale)
        .attr("y", (data, i) => (data[1] > 1) ? h - yScale * data[1] - 5 : h - 1)
        .attr("font-size", "10px")
        .attr("color", "navy");

	  console.log("Hi there", rect);
    })();
  };

  $("#analyze").on("submit", function(event) {
    var accessToken =
      "ya29.c.Kl6pBzfXomVh-eB3cfyJK40zCP7_HbRP_tgCKQZn_6M8tc6clWlA1kseK6w2Da1vtNWE2cP7kZLDqO8PUygydj8TDD9LthBi5Jll1kAjjSrCp7ggt1Cde7-Gpge8C4Nj";

    event.preventDefault();

    $('#table-analysis').html('<tr><th style="text-align: center; padding-top: 10px;">Candidate</th><th style="text-align: center">Agreement score</th></tr>')

    fetch(
      "https://automl.googleapis.com/v1beta1/projects/795970644708/locations/us-central1/models/TCN490914349615939584:predict",
      {
        body: JSON.stringify({
          payload: {
            textSnippet: {
              content: $("#text-area").val(),
              mime_type: "text/plain"
            }
          }
        }),
        headers: {
          Authorization: "Bearer " + accessToken,
          "Content-Type": "application/json"
        },
        method: "POST"
      }
    )
      .then(res => res.json())
      .then(res => {
        var results = res.payload
          .map(item => [item.displayName, item.classification.score])
          .sort((a, b) => a[1] > b[1]);
				console.log(results);
				handleResults(results);
				$([document.documentElement, document.body]).animate({
					scrollTop: $("#first").offset().top
				}, 1000)
      })
      .catch(err => console.log(err));
  });

  // Nav.
  var $nav = $("#nav");

  if ($nav.length > 0) {
    // Shrink effect.
    $main.scrollex({
      mode: "top",
      enter: function() {
        $nav.addClass("alt");
      },
      leave: function() {
        $nav.removeClass("alt");
      }
    });

    // Links.
    var $nav_a = $nav.find("a");

    $nav_a
      .scrolly({
        speed: 1000,
        offset: function() {
          return $nav.height();
        }
      })
      .on("click", function() {
        var $this = $(this);

        // External link? Bail.
        if ($this.attr("href").charAt(0) != "#") return;

        // Deactivate all links.
        $nav_a.removeClass("active").removeClass("active-locked");

        // Activate link *and* lock it (so Scrollex doesn't try to activate other links as we're scrolling to this one's section).
        $this.addClass("active").addClass("active-locked");
      })
      .each(function() {
        var $this = $(this),
          id = $this.attr("href"),
          $section = $(id);

        // No section for this link? Bail.
        if ($section.length < 1) return;

        // Scrollex.
        $section.scrollex({
          mode: "middle",
          initialize: function() {
            // Deactivate section.
            if (browser.canUse("transition")) $section.addClass("inactive");
          },
          enter: function() {
            // Activate section.
            $section.removeClass("inactive");

            // No locked links? Deactivate all links and activate this section's one.
            if ($nav_a.filter(".active-locked").length == 0) {
              $nav_a.removeClass("active");
              $this.addClass("active");
            }

            // Otherwise, if this section's link is the one that's locked, unlock it.
            else if ($this.hasClass("active-locked"))
              $this.removeClass("active-locked");
          }
        });
      });
  }

  // Scrolly.
  $(".scrolly").scrolly({
    speed: 1000
  });
})(jQuery);
