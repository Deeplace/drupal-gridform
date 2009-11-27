jQuery(function(){
		//Auto set all tab indexes on form elements
         $("tr.tablegrid_default_new_row").each( function( i ){
                //make all inputs disabled
                $( this ).hide(  ).find( ":input" ).attr( 'disabled', true );
         });

    }
);

function forms_add_row( button ) {
    $( button ).parent(  ).find( "tr.tablegrid_default_new_row" ).each( function(i){
            row = $(this);
            zebra_class = ( row.parent().find('tr').length % 2) ? 'odd' : 'even';
            row.before( '<tr class="' + zebra_class + '">' + row.html( ) + '</tr>' );
            row.prev(  ).find( ":input" ).removeAttr( 'disabled' );
        }
    );
    return false;
}

function forms_del_row( button ) {
    $( button ).parent( ).find( "input.grid_select_check:checkbox" ).each( 
        function( i ) {
			if ( $( this).attr( 'checked' ) ) {
				$( this ).parent(  ).parent(  ).remove(  );
			}
        }
    );
    return false;
}
