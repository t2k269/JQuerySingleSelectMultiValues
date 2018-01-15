(function( $ ) {
	$.fn.singleSelectMultiValues = function(params) {
		var instance = this;
		instance.hide();

		var id = instance[0].id;
		
		var options = {};
		$.extend(options, {
			"text": "",
			"containerClass": "ssmv_container",
			"boxHolderClass": "ssmv_boxes",
			"boxClass": "ssmv_box",
			"boxTextClass": "ssmv_box_text",
			"boxRemoveClass": "ssmv_box_remove"
		}, params);

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

		instance[0]._ssmv_boxes_holder = boxesHolder;
		instance[0]._ssmv_box_class = options.boxClass;
		if (!$.fn.ssmv_hooked_val) {
			var originVal = $.fn.val;
			$.fn.val = function(value) {
				var boxesHolder = this[0]._ssmv_boxes_holder;
				if (boxesHolder && value) {
					var boxClass = this[0]._ssmv_box_class;
					var id = this[0].id;
					var arr = value ? value : new Array();
					boxesHolder.find("." + boxClass + "[data-link=" + id + "]").each(function(idx) {
						var dataValue = $(this).attr("data-value");
						if (arr.indexOf(dataValue) < 0) 
							$(this).remove();
					});
				}
				return originVal.apply(this, arguments);
			};
			$.fn.ssmv_hooked_val = true;
		}	

		singleSelect.change(function(evt) {
			var v = $(this).val();
			var t = $(this).find(":selected").text();
			if (v == undefined || v == null || v === "") {
				return;
			}
			
			var arr = instance.val();
			if (arr == null)
				arr = new Array();
			var idx = arr.indexOf(v);
			if (idx < 0) {
				var closeBtn = $("<a></a>").addClass(options.boxRemoveClass)
					.append($('<svg height="10" stroke="currentColor" stroke-miterlimit="10" stroke-width="1.5" viewBox="0 0 10 10" width="10"> <line x1="0" x2="10" y1="0" y2="10"></line><line x1="0" x2="10" y1="10" y2="0"></line></svg>'));
				var box = $("<div></div>")
					.addClass(options.boxClass)
					.append($("<div>" + t + "</div>")
						.addClass(options.boxTextClass))
					.append(closeBtn)
					.attr("data-link", id)
					.attr("data-value", v)
					.attr("data-title", t);
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
