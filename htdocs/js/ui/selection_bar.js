RCloud.UI.selection_bar = (function() {

    var $partial_indicator,
        $selection_checkbox,
        $dropdown_toggle,
        $delete_button,
        $cell_selection;

    var reset = function() {
        $selection_checkbox.prop('checked', false);
        $partial_indicator.hide();
    };

    var result = {
        init: function() {

            var $selection_bar = $(RCloud.UI.panel_loader.load_snippet('selection-bar-snippet'));
            $partial_indicator = $selection_bar.find('.cell-selection span');
            $selection_checkbox = $selection_bar.find('.cell-selection input[type="checkbox"]');
            $dropdown_toggle = $selection_bar.find('.dropdown-toggle');
            $delete_button = $selection_bar.find('#selection-bar-delete');
            $cell_selection = $selection_bar.find('.cell-selection');

            $selection_bar
                .find('.btn-default input[type="checkbox"]').click(function(e) {
                    e.stopPropagation();

                    if(!shell.notebook.controller.cell_count()) {
                        e.preventDefault();
                        return;
                    }

                    if($(this).is(':checked')) {
                        shell.notebook.controller.select_all_cells();
                    } else {
                        shell.notebook.controller.clear_all_selected_cells();
                    }
                })
                .end()
                .find('a[data-action]').click(function() {
                    shell.notebook.controller[$(this).attr('data-action')]();
                })
                .end()
                .find('#selection-bar-delete').click(function() {
                    shell.notebook.controller.remove_selected_cells();
                })
                .end();

            $selection_bar.find('div[type="button"].cell-selection').click(function(e) {
                $(this).find('input').trigger('click');
            });
            
            $('#' + $selection_bar.attr('id')).replaceWith($selection_bar);
        },  
        update: function(cells) {

            var cell_count = cells.length,
                selected_count = _.filter(cells, function(cell) { return cell.is_selected(); }).length;

            $selection_checkbox.prop({
                'checked' : selected_count === cell_count && cell_count != 0,
                'disabled' : cell_count === 0
            });

            _.each([$delete_button, $dropdown_toggle, $cell_selection], function(el) { 
                el[cell_count ? 'removeClass' : 'addClass']('disabled');  
            });

            $partial_indicator[selected_count !== cell_count && selected_count !== 0 ? 'show' : 'hide']();     

        },
        hide: function() {
            $('#selection-bar').hide();
            reset();
        },
        show: function() {
            $('#selection-bar').show();
            reset();
        }
    };
    return result;

})();