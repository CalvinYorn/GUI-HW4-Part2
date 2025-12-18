/**
 * @file script-part2.js
 * By: Calvin Yorn
 * - jQuery UI Tabs and Sliders - HW4 Part 2
*/
// set up validation and sliders when page loads
$(document).ready(function() {
    
    // initialize tabs
    $("#tabs").tabs();
    
    // counter for tab ids
    let tableCount = 0;
    
    // flag to prevent recursive updates during two-way binding
    let isUpdatingFromSlider = false;
    let isUpdatingFromInput = false;
    
    // validate the form
    $("#table-form").validate({
        
        // rules for each input
        rules: {
            minRow: {
                required: true,
                number: true,
                min: -50,
                max: 50
            },
            maxRow: {
                required: true,
                number: true,
                min: -50,
                max: 50
            },
            minCol: {
                required: true,
                number: true,
                min: -50,
                max: 50
            },
            maxCol: {
                required: true,
                number: true,
                min: -50,
                max: 50
            }
        },
        
        // error messages
        messages: {
            minRow: {
                required: "please enter the minimum row value.",
                number: "the minimum row must be a valid number.",
                min: "the minimum row must be greater than or equal to -50.",
                max: "the minimum row must be less than or equal to 50."
            },
            maxRow: {
                required: "please enter the maximum row value.",
                number: "the maximum row must be a valid number.",
                min: "the maximum row must be greater than or equal to -50.",
                max: "the maximum row must be less than or equal to 50."
            },
            minCol: {
                required: "please enter the minimum column value.",
                number: "the minimum column must be a valid number.",
                min: "the minimum column must be greater than or equal to -50.",
                max: "the minimum column must be less than or equal to 50."
            },
            maxCol: {
                required: "please enter the maximum column value.",
                number: "the maximum column must be a valid number.",
                min: "the maximum column must be greater than or equal to -50.",
                max: "the maximum column must be less than or equal to 50."
            }
        },
        
        // error placement
        errorPlacement: function(error, element) {
            error.addClass("error-label");
            error.insertAfter(element.next('small'));
        },
        
        // highlight error inputs
        highlight: function(element) {
            $(element).addClass("error-input");
        },
        
        // unhighlight corrected inputs
        unhighlight: function(element) {
            $(element).removeClass("error-input");
        }
    });
    
    // initialize sliders with two-way binding
    initializeSliders();
    
    // handle form submission
    $("#table-form").on("submit", function(e) {
        e.preventDefault();
        
        // check if basic validation passed
        if ($("#table-form").valid()) {
            
            // get values
            let minRow = parseInt($("#minRow").val());
            let maxRow = parseInt($("#maxRow").val());
            let minCol = parseInt($("#minCol").val());
            let maxCol = parseInt($("#maxCol").val());
            
            let hasError = false;
            
            // clear previous errors
            $(".custom-error-label").remove();
            
            // check row range
            if (minRow > maxRow) {
                hasError = true;
                let error = $('<label class="error-label custom-error-label">the minimum row must be less than or equal to the maximum row.</label>');
                error.insertAfter($("#minRow").next('small'));
            }
            
            // check column range
            if (minCol > maxCol) {
                hasError = true;
                let error = $('<label class="error-label custom-error-label">the minimum column must be less than or equal to the maximum column.</label>');
                error.insertAfter($("#minCol").next('small'));
            }
            
            // prevent submit on error
            if (hasError) {
                e.preventDefault();
                return false;
            }
            
            // create new tab
            createNewTab();
        }
    });
    
    // initialize sliders with two-way binding
    function initializeSliders() {
        
        // initialize min row slider
        $("#minRowSlider").slider({
            min: -50,
            max: 50,
            value: 0,
            slide: function(event, ui) {
                isUpdatingFromSlider = true;
                $("#minRow").val(ui.value);
                $("#minRowValue").text(ui.value);
                updateTable();
                isUpdatingFromSlider = false;
            }
        });
        
        // initialize max row slider
        $("#maxRowSlider").slider({
            min: -50,
            max: 50,
            value: 10,
            slide: function(event, ui) {
                isUpdatingFromSlider = true;
                $("#maxRow").val(ui.value);
                $("#maxRowValue").text(ui.value);
                updateTable();
                isUpdatingFromSlider = false;
            }
        });
        
        // initialize min column slider
        $("#minColSlider").slider({
            min: -50,
            max: 50,
            value: 0,
            slide: function(event, ui) {
                isUpdatingFromSlider = true;
                $("#minCol").val(ui.value);
                $("#minColValue").text(ui.value);
                updateTable();
                isUpdatingFromSlider = false;
            }
        });
        
        // initialize max column slider
        $("#maxColSlider").slider({
            min: -50,
            max: 50,
            value: 10,
            slide: function(event, ui) {
                isUpdatingFromSlider = true;
                $("#maxCol").val(ui.value);
                $("#maxColValue").text(ui.value);
                updateTable();
                isUpdatingFromSlider = false;
            }
        });
        
        // set initial display values
        $("#minRowValue").text(0);
        $("#maxRowValue").text(10);
        $("#minColValue").text(0);
        $("#maxColValue").text(10);
        
        // handle input field changes - update sliders and table dynamically
        $("#minRow, #maxRow, #minCol, #maxCol").on("input", function() {
            if (!isUpdatingFromSlider) {
                isUpdatingFromInput = true;
                syncSliderToInput();
                updateTable();
                isUpdatingFromInput = false;
            }
        });
    }
    
    // synchronize sliders with input values
    function syncSliderToInput() {
        let minRowVal = parseInt($("#minRow").val()) || 0;
        let maxRowVal = parseInt($("#maxRow").val()) || 10;
        let minColVal = parseInt($("#minCol").val()) || 0;
        let maxColVal = parseInt($("#maxCol").val()) || 10;
        
        // clamp values to range
        minRowVal = Math.max(-50, Math.min(50, minRowVal));
        maxRowVal = Math.max(-50, Math.min(50, maxRowVal));
        minColVal = Math.max(-50, Math.min(50, minColVal));
        maxColVal = Math.max(-50, Math.min(50, maxColVal));
        
        // update sliders
        $("#minRowSlider").slider("value", minRowVal);
        $("#maxRowSlider").slider("value", maxRowVal);
        $("#minColSlider").slider("value", minColVal);
        $("#maxColSlider").slider("value", maxColVal);
        
        // update display
        $("#minRowValue").text(minRowVal);
        $("#maxRowValue").text(maxRowVal);
        $("#minColValue").text(minColVal);
        $("#maxColValue").text(maxColVal);
    }
    
    // update table dynamically when sliders or inputs change
    function updateTable() {
        
        // get values
        let minRow = parseInt($("#minRow").val());
        let maxRow = parseInt($("#maxRow").val());
        let minCol = parseInt($("#minCol").val());
        let maxCol = parseInt($("#maxCol").val());
        
        // validate values
        if (isNaN(minRow) || isNaN(maxRow) || isNaN(minCol) || isNaN(maxCol)) {
            return;
        }
        
        // check ranges
        if (minRow > maxRow || minCol > maxCol) {
            return;
        }
        
        // build and display table
        let tableHtml = buildTableHtml(minRow, maxRow, minCol, maxCol);
        
        // display in main container
        $("#table-container").html(tableHtml);
    }
    
    // create new tab with table
    function createNewTab() {
        
        // increment counter
        tableCount++;
        
        // get values
        let minRow = parseInt($("#minRow").val());
        let maxRow = parseInt($("#maxRow").val());
        let minCol = parseInt($("#minCol").val());
        let maxCol = parseInt($("#maxCol").val());
        
        // create tab label
        let tabLabel = '[' + minRow + ', ' + maxRow + ', ' + minCol + ', ' + maxCol + ']';
        let tabId = 'table-tab-' + tableCount;
        
        // build table html
        let tableHtml = buildTableHtml(minRow, maxRow, minCol, maxCol);
        
        // create tab panel
        let tabPanel = '<div id="' + tabId + '">' + tableHtml + '</div>';
        
        // add panel to tabs
        $("#tabs").append(tabPanel);
        
        // create tab in tab list (with delete button)
        let tabListItem = '<li><a href="#' + tabId + '">' + tabLabel + 
                          ' <span class="tab-delete-btn" data-tab-id="' + tabId + '" title="delete this tab">✕</span></a></li>';
        
        // add tab to list
        $("#tabs > ul").append(tabListItem);
        
        // refresh tabs widget
        $("#tabs").tabs("refresh");
        
        // switch to new tab
        $("#tabs").tabs("option", "active", $("#tabs").tabs("length") - 1);
        
        // attach delete handlers
        attachDeleteHandlers();
    }
    
    // build table html
    function buildTableHtml(minRow, maxRow, minCol, maxCol) {
        
        // build header
        let headerCells = '<th>×</th>';
        
        // add column headers
        for (let col = minCol; col <= maxCol; col++) {
            headerCells += '<th>' + col + '</th>';
        }
        
        // build rows
        let bodyRows = '';
        
        // loop through rows
        for (let row = minRow; row <= maxRow; row++) {
            
            // add row header
            bodyRows += '<tr><th>' + row + '</th>';
            
            // add cells for each column
            for (let col = minCol; col <= maxCol; col++) {
                bodyRows += '<td>' + (row * col) + '</td>';
            }
            
            // close row
            bodyRows += '</tr>';
        }
        
        // create table
        let html = '<div class="table-responsive">';
        html += '<table class="table table-bordered table-striped table-sm mx-auto w-auto text-center">';
        html += '<thead><tr>' + headerCells + '</tr></thead>';
        html += '<tbody>' + bodyRows + '</tbody>';
        html += '</table></div>';
        
        return html;
    }
    
    // attach delete handlers
    function attachDeleteHandlers() {
        
        // on delete click
        $(".tab-delete-btn").off("click").on("click", function(e) {
            e.preventDefault();
            
            // get id
            let tabId = $(this).data("tab-id");
            
            // delete tab
            deleteTab(tabId);
        });
    }
    
    // delete a tab
    function deleteTab(tabId) {
        
        // find tab index
        let tabIndex = $("#tabs > ul > li").index($('a[href="#' + tabId + '"]').parent());
        
        // protect first tab
        if (tabIndex === 0) {
            alert("cannot delete the data entry tab!");
            return;
        }
        
        // remove from tabs
        $("#tabs").tabs("remove", tabIndex);
        
        // remove from dom
        $("#" + tabId).remove();
    }
    
    // delete all tabs
    function deleteAllTabs() {
        
        // remove all except first
        while ($("#tabs").tabs("length") > 1) {
            // removes the last tab
            $("#tabs").tabs("remove", $("#tabs").tabs("length") - 1);
        }
        
        // remove panel divs
        $("div[id^='table-tab-']").remove();
    }
    
    // delete button handlers
    $("#deleteAllTabsBtn").on("click", function() {
        
        // check if there are tables
        if ($("#tabs").tabs("length") > 1) {
            
            // ask for confirmation
            if (confirm("delete all generated table tabs?")) {
                deleteAllTabs();
            }
        } else {
            alert("no tables to delete!");
        }
    });
});

