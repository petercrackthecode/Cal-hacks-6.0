
(function($) {

	var	$window = $(window),
		$body = $('body'),
		$main = $('#main');

	// Breakpoints.
		breakpoints({
			xlarge:   [ '1281px',  '1680px' ],
			large:    [ '981px',   '1280px' ],
			medium:   [ '737px',   '980px'  ],
			small:    [ '481px',   '736px'  ],
			xsmall:   [ '361px',   '480px'  ],
			xxsmall:  [ null,      '360px'  ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});
		

		let $analyze= $('#analyze');

		const handleResults = (results) => {

		}

		$('#analyze').on('submit', function(event) {
			var accessToken = 'ya29.c.Kl6pBzSC_bRj0T0SITGaY_UZNHhh7Z39vQCkx7Z67ZxRdWXciKvk1kgHveqMh53p1MAcvkoOHT_9ZkL5XrZ0spgq3VtGwEfUnv8kqW46fLh8yo2vyHWxOZRitZ9cTAiU';

			event.preventDefault();

			fetch("https://automl.googleapis.com/v1beta1/projects/795970644708/locations/us-central1/models/TCN490914349615939584:predict", {
				body: JSON.stringify({
						payload: { textSnippet: { content: $('#text-area').val(), mime_type: "text/plain" }}
				}),
				headers: {
					Authorization: "Bearer " + accessToken,
					"Content-Type": "application/json"
				},
				method: "POST"
			}).then(res => res.json()).then(res => {
				var results = res.payload.map(item => [item.displayName, item.classification.score]).sort((a, b) => a[1] > b[1])
				console.log(results)
				handleResults(results)
			}).catch(err => console.log(err));
		});

	// Nav.
		var $nav = $('#nav');

		if ($nav.length > 0) {

			// Shrink effect.
				$main
					.scrollex({
						mode: 'top',
						enter: function() {
							$nav.addClass('alt');
						},
						leave: function() {
							$nav.removeClass('alt');
						},
					});

			// Links.
				var $nav_a = $nav.find('a');

				$nav_a
					.scrolly({
						speed: 1000,
						offset: function() { return $nav.height(); }
					})
					.on('click', function() {

						var $this = $(this);

						// External link? Bail.
							if ($this.attr('href').charAt(0) != '#')
								return;

						// Deactivate all links.
							$nav_a
								.removeClass('active')
								.removeClass('active-locked');

						// Activate link *and* lock it (so Scrollex doesn't try to activate other links as we're scrolling to this one's section).
							$this
								.addClass('active')
								.addClass('active-locked');

					})
					.each(function() {

						var	$this = $(this),
							id = $this.attr('href'),
							$section = $(id);

						// No section for this link? Bail.
							if ($section.length < 1)
								return;

						// Scrollex.
							$section.scrollex({
								mode: 'middle',
								initialize: function() {

									// Deactivate section.
										if (browser.canUse('transition'))
											$section.addClass('inactive');

								},
								enter: function() {

									// Activate section.
										$section.removeClass('inactive');

									// No locked links? Deactivate all links and activate this section's one.
										if ($nav_a.filter('.active-locked').length == 0) {

											$nav_a.removeClass('active');
											$this.addClass('active');

										}

									// Otherwise, if this section's link is the one that's locked, unlock it.
										else if ($this.hasClass('active-locked'))
											$this.removeClass('active-locked');

								}
							});

					});

		}

	// Scrolly.
		$('.scrolly').scrolly({
			speed: 1000
		});

})(jQuery);