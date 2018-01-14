(function( $ ) {
	$.fn.singleSelectMultiValues = function(params) {
		var instance = this;
		instance.hide();
		
		var options = {};
		$.extend(options, {
			"text": "",
			"containerClass": "ssmv_container",
			"boxHolderClass": "ssmv_boxes",
			"boxClass": "ssmv_box",
			"boxTextClass": "ssmv_box_text",
			"boxRemoveClass": "ssmv_box_remove"
		}, params);
		console.log(options.text);
		
		
		var singleSelect = $("<select></select>").attr("class", instance.attr("class"));
		singleSelect.append($("<option selected value=''>" + options.text + "</option>"));
		instance.find("option").each(function() {
			var o = $("<option></option>");
			o.val($(this).val());
			o.text($(this).text());
			singleSelect.append(o);
		});

		var boxesHolder = options.boxesContainer;
		if (!boxesHolder) {
			boxesHolder = $("<div></div>").addClass(options.ssmv_boxes);
			var container = $("<div></div>").addClass(options.containerClass)
				.append(singleSelect)
				.append($("<div></div>")
					.append($("<div class='ssmv_label'>Selected:</div>"))
					.append(boxesHolder)
				);
			instance.after(container);
		} else {
			instance.after(singleSelect);
		}
		

		singleSelect.change(function(evt) {
			var v = $(this).val();
			var t = $(this).find(":selected").text();
			console.log(v);
			if (v == undefined || v == null || v === "") {
				return;
			}
			
			var arr = instance.val();
			var idx = arr.indexOf(v);
			if (idx < 0) {
				var closeBtn = $("<a></a>").addClass(options.boxRemoveClass)
					.append($('<svg height="10" stroke="currentColor" stroke-miterlimit="10" stroke-width="1.5" viewBox="0 0 10 10" width="10"> <line x1="0" x2="10" y1="0" y2="10"></line><line x1="0" x2="10" y1="10" y2="0"></line></svg>'));
				var box = $("<div></div>")
					.addClass(options.boxClass)
					.append($("<div>" + t + "</div>")
						.addClass(options.boxTextClass))
					.append(closeBtn);
				closeBtn.click(function() {
					box.remove();
					var arr = instance.val();
					arr.splice(arr.indexOf(v), 1);
					instance.val(arr);
				instance.trigger("change");
				});
				boxesHolder.append(box);
				arr.push(v);
				instance.val(arr);
				instance.trigger("change");
			}
			$(this).val(null);
		});
	};
}( jQuery ));
