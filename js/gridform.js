/* jshint undef: true, unused: true, esversion: 6 */
/* globals Drupal, jQuery */
(function($) {
  "use strict";
  var renumber_grid_elements_current = 0;

  Drupal.behaviors.gridform = {
    attach: function(context, settings) {
      $(".add-row", context).click(function(event) {
        event.preventDefault();
        window.forms_add_row(this, settings);
      });

      $(".del-row", context).click(function(event) {
        event.preventDefault();
        window.forms_del_row(this, settings);
      });

      // Destroy chosen in ".tablegrid_default_new_row" rows.
      $(".tablegrid_default_new_row select", context).removeClass("chosen-processed");
      $(".tablegrid_default_new_row .chosen-container", context).remove();
    }
  };

  window.renumber_grid_elements = function (tbody) {
    tbody.find("tr").not(".skip-tablegrid-row").each(function(i) {
      renumber_grid_elements_current = i;
      $(this).find("div.form-item").each(function() {
        var input = $(this),
          input_id = input.attr("id");
        if (!input_id) {
          return;
        }

        var reg_id = new RegExp("-\\d+-", "i");
        var new_input_id = input_id.replace(reg_id, "-" + renumber_grid_elements_current + "-");
        if (new_input_id && new_input_id !== input_id) {
          input.attr("id", new_input_id);
        }
      });

      $(this).find(":input").each(function() {
        var input = $(this),
          name = input.attr("name"),
          type = input.attr("type"),
          name_parts, new_name;
        if (!name) {
          return;
        }

        if (type === "file") {
          name_parts = name.match(/^files\[(.*)_(\d+)_(.*)\]$/);
        } else {
          name_parts = name.match(/^(.*)\[(\d+)\]\[(.*)\]$/);
        }
        if (!name_parts) {
          return;
        }

        if (type === "file") {
          new_name = "files[" + name_parts[1] + "_" + renumber_grid_elements_current + "_" + name_parts[3] + "]";
        } else {
          new_name = name_parts[1] + "[" + renumber_grid_elements_current + "][" + name_parts[3] + "]";
        }

        input.attr("name", new_name);
        var input_id = input.attr("id");
        if (!input_id) {
          return;
        }
        var reg_id = new RegExp("-" + name_parts[2] + "-", "i");
        var new_input_id = input_id.replace(reg_id, "-" + renumber_grid_elements_current + "-");
        if (new_input_id && new_input_id !== input_id) {
          input.attr("id", new_input_id);
        }
      });

      if ($(this).find(".line-number").length > 0) {
        $(this).find(".line-number").text(renumber_grid_elements_current + 1);
      }
    });
    tbody.trigger("gridform-updated");
  };

  window.forms_add_row = function (button, settings) {
    $(button).parent().find("tr.tablegrid_default_new_row").each(function(i) {
      var row = $(this),
        zebra_class = (row.parent().find("tr").length % 2) ? "odd" : "even";
      row.before("<tr class=\"" + zebra_class + "\">" + row.html() + "</tr>");
      var new_row = row.prev();
      new_row.find(":input").removeAttr("disabled");
      new_row.find(".form-disabled").removeClass("form-disabled");

      // Destroy chosen in ".tablegrid_default_new_row" rows.
      new_row.find("select").removeClass("chosen-processed");
      new_row.find(".chosen-container").remove();

      Drupal.attachBehaviors(new_row, settings);
      window.renumber_grid_elements(row.parent());
    });
  };

  window.forms_del_row = function (button) {
    var jDIV = $(button).parent();
    jDIV.find("input.grid_select_check:checkbox").each(function(i) {
      var checkbox = $(this);
      if (checkbox.prop("checked")) {
        checkbox.parent().parent().remove();
      }
    });
    window.renumber_grid_elements(jDIV.find("tbody"));
  };

  /**
   * Reset gridform data, set row count equal to data row count, and fills in data
   *
   * @param table
   *  jQuery Gridform table reference
   * @param data
   *  Object Data to fill with
   */
  window.forms_set_rows = function (table, data) {
    var tbody = table.children("tbody");
    // Delete all rows.
    tbody.find("tr:not(.tablegrid_default_new_row)").remove();
    var default_row = tbody.find("tr.tablegrid_default_new_row");
    // Add row for each data row.
    var ii = 0;
    for (var i in data) {
      ii++;
      var new_row = default_row.clone().show();
      new_row.find(":input").removeAttr("disabled");
      new_row.find(".form-disabled").removeClass("form-disabled");
      new_row.attr("class", ii % 2 ? "odd" : "even");
      // Fill in values.
      var ji = 0;
      for (var j in data[i]) {
        ji++;
        new_row.find("td:eq(" + ji + ") :input").val(data[i][j]);
      }
      default_row.before(new_row);
    }
    window.renumber_grid_elements(tbody);
  };
})(jQuery);
