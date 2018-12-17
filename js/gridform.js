(function($) {
  'use strict';
  var renumber_grid_elements_current = 0;

  Drupal.behaviors.gridform = {
    attach: function(context, settings) {
      $('.add-row', context).click(function(event) {
        event.preventDefault();
        forms_add_row(this);
      });

      $('.del-row', context).click(function(event) {
        event.preventDefault();
        forms_del_row(this);
      });
    }
  };

  window.renumber_grid_elements = function (tbody) {
    tbody.find("tr").not('.skip-tablegrid-row').each(function(i) {
      renumber_grid_elements_current = i;
      $(this).find("div.form-item").each(function() {
        var input = $(this),
          input_id = input.attr('id');
        if (!input_id) {
          return;
        }

        var reg_id = new RegExp("", "i");
        reg_id.compile("-\\d+-", "i");
        var new_input_id = input_id.replace(reg_id, '-' + renumber_grid_elements_current + '-');
        if (new_input_id && new_input_id !== input_id) {
          input.attr('id', new_input_id);
        }
      });

      $(this).find(":input").each(function() {
        var input = $(this),
          name = input.attr('name'),
          type = input.attr('type');
        if (!name) {
          return;
        }

        if (type == 'file') {
          var name_parts = name.match(/^files\[(.*)_(\d+)_(.*)\]$/);
        } else {
          var name_parts = name.match(/^(.*)\[(\d+)\]\[(.*)\]$/);
        }
        if (!name_parts) {
          return;
        }

        if (type == 'file') {
          var new_name = 'files[' + name_parts[1] + '_' + renumber_grid_elements_current + '_' + name_parts[3] + ']';
        } else {
          var new_name = name_parts[1] + '[' + renumber_grid_elements_current + '][' + name_parts[3] + ']';
        }

        input.attr('name', new_name);
        var input_id = input.attr('id');
        if (!input_id) {
          return;
        }
        var reg_id = new RegExp("", "i");
        reg_id.compile("-" + name_parts[2] + "-", "i");
        var new_input_id = input_id.replace(reg_id, '-' + renumber_grid_elements_current + '-');
        if (new_input_id && new_input_id !== input_id) {
          input.attr('id', new_input_id);
        }
      });

      if ($(this).find('.line-number').length > 0) {
        $(this).find('.line-number').text(renumber_grid_elements_current + 1);
      }
    });
  }

  window.forms_add_row = function (button) {
    $(button).parent().find("tr.tablegrid_default_new_row").each(function(i) {
      var row = $(this),
        zebra_class = (row.parent().find('tr').length % 2) ? 'odd' : 'even';
      row.before('<tr class="' + zebra_class + '">' + row.html() + '</tr>');
      row.prev().find(":input").removeAttr('disabled').trigger("qcombobox_init");
      row.prev().find(".form-disabled").removeClass('form-disabled');
      renumber_grid_elements(row.parent());

    });
  };

  window.forms_del_row = function (button) {
    var jDIV = $(button).parent();
    jDIV.find("input.grid_select_check:checkbox").each(function(i) {
      var checkbox = $(this);
      if (checkbox.prop('checked')) {
        checkbox.parent().parent().remove();
      }
    });
    renumber_grid_elements(jDIV.find("tbody"));
  };

  /**
   * Reset gridform data, set row count equal to data row count, and fills in data
   *
   * @param jQuery table
   *  Gridform table reference
   * @param object data
   *  Data to fill with
   */
  window.forms_set_rows = function (table, data) {
    var tbody = table.children('tbody');
    //del all rows
    tbody.find('tr:not(.tablegrid_default_new_row)').remove();
    var default_row = tbody.find('tr.tablegrid_default_new_row');
    //add row for each data row
    var ii = 0;
    for (var i in data) {
      ii++;
      var new_row = default_row.clone().show();
      new_row.find(':input').removeAttr('disabled');
      new_row.find('.form-disabled').removeClass('form-disabled');
      new_row.attr('class', ii % 2 ? 'odd' : 'even');
      //fill in values
      var ji = 0;
      for (var j in data[i]) {
        ji++;
        new_row.find('td:eq(' + ji + ') :input').val(data[i][j]);
      }
      default_row.before(new_row);
    }
    renumber_grid_elements(tbody);
  };
})(jQuery);