jQuery(function(){
		//Auto set all tab indexes on form elements
         $("tr.tablegrid_default_new_row").each( function( i ){
                //make all inputs disabled
                $( this ).hide(  ).find( ":input" ).attr( 'disabled', true );
         });

    }
);

var renumber_grid_elements_current = 0;
		 
function renumber_grid_elements(tbody){
	tbody.find("tr").each(function(i){
		renumber_grid_elements_current = i;
		$(this).find("div.form-item").each( function() {
			input = $( this )
			
			input_id = input.attr( 'id' );
			if (!input_id) {
				return;
			}
			
			var reg_id = new RegExp("", "i");
			reg_id.compile("-\\d+-", "i");
			new_input_id = input_id.replace( reg_id, '-' + renumber_grid_elements_current + '-');
			if (new_input_id && new_input_id!=input_id) {
				input.attr( 'id', new_input_id);
			}
		});
		$(this).find(":input").each( function() {
			input = $( this )
			name = input.attr( 'name' );
			if (!name) {
				return;
			}
			//name_parts = name.match( /^(.*)\[(\d+)\]\[([^\]]+)\]$/  );
			name_parts = name.match( /^(.*)\[(\d+)\](.*)$/  );
			if (!name_parts) {
				return;
			}
			var new_name = name_parts[1] + '[' + renumber_grid_elements_current + '][' + name_parts[3] + ']';
			input.attr( 'name', new_name );
			input_id = input.attr( 'id' );
			if (!input_id) {
				return;
			}
			var reg_id = new RegExp("", "i");
			reg_id.compile("-" + name_parts[2] + "-", "i");
			new_input_id = input_id.replace( reg_id, '-' + renumber_grid_elements_current + '-');
			if (new_input_id && new_input_id!=input_id) {
				input.attr( 'id', new_input_id);
			}
		});
	});
}

function forms_add_row( button ) {
    $( button ).parent(  ).find( "tr.tablegrid_default_new_row" ).each( function(i){
            row = $(this);
            zebra_class = ( row.parent().find('tr').length % 2) ? 'odd' : 'even';
            row.before( '<tr class="' + zebra_class + '">' + row.html( ) + '</tr>' );
            row.prev(  ).find( ":input" ).removeAttr( 'disabled' );
			renumber_grid_elements(row.parent());
        }
    );
    return false;
}

function forms_del_row( button ) {
	jDIV = $( button ).parent();
    jDIV.find( "input.grid_select_check:checkbox" ).each( 
        function( i ) {
			checkbox = $( this);
			if ( checkbox.attr( 'checked' ) ) {
				checkbox.parent().parent().remove();
			}
        }
    );
	renumber_grid_elements(jDIV.find("tbody"));
    return false;
}
