function checkDataSourceValue(selected){
    
    // Dw we demand a generic ODBC Driver name?
    dataSource = selected.value;
    if (dataSource=='genericodbc'){
        $('#driver').show();
    }
    
}


function initCustomizations(){
    
    
    		//inject x list items into the grid
			var x = customizations.length;
			for (var i = 0; i<x; i++)
			{
				
				$("#grid").append('<li class="ui-widget-content"><b>' + customizations[i].customizationName + '</b><br>' + customizations[i].description + '</li>');
			}
           // Turn OL into a JQuery Selectable List 
            $( "#grid" ).selectable({
              stop: function() 
              {
                 //Empty the "You've Selected" list and then populate it with whatever customizations have been CTRL-Clicked
                  var result = $( "#select-result" ).empty();
                  $( ".ui-selected", this ).each(function() {
                   var index = $( "#grid li" ).index( this );
                   result.append( customizations[index].customizationName + '</span> <input class="selected" id="' + customizations[index].customizationName + '" value="' + customizations[index].customizationValue + '" <br><br>');
                   });
               }
    });

    
}

function generateTDC(){

    var vendor, dbclass, driver;
   
// First, assign vendor, class, driver to variables based on selection in drop-down box. 
   
   datasource =  $('#datasource option:selected').val();
    // normal selection
    if( datasource != "genericodbc"){
        vendor = datasource;
        dbclass= datasource;
        driver = datasource;
    }
    // Generic ODBC with no driver entered
    else if (datasource=='genericodbc' &&  $('#driver').val() == "Enter Driver Name Here"){
        alert("You must enter a driver name where it says 'Enter Driver Name Here'.");
        return;
    }
    // Generic ODBC with Driver
    else if (datasource=='genericodbc' &&  $('#driver').val() != "Enter Driver Name Here"){

        vendor = datasource;
        dbclass= datasource;
        driver = $('#driver').val();

    }

  // Next create a quick and dirty XML doc....  
      
    var xml ="<?xml version='1.0' encoding='utf-8' ?>\n<connection-customization class='" + dbclass + "' enabled='true' version='8.10'>\n<vendor name='" + vendor + "'/>\n<driver name='" + driver + "'/>\n";
        xml = xml + "<customizations>\n"
    
                // Loop through each input box in the "You've Selected" span, grab values, and drop into a <customization> element
                var selectedCustomizations = $( "#select-result input" );
                    selectedCustomizations.each( function() {
                            console.log(this.id , this.value);
                            xml = xml + "<customization name='" + this.id + "' value='" + this.value + "' />\n";
                });
    
        xml = xml + "</customizations>\n"
    xml = xml + "</connection-customization>" 
    
    
    console.log(xml);
    

   download('myVeryOwnTDC.tdc', xml);
    
    

    

}

  function download(filename, text) {
      
     //http://stackoverflow.com/questions/3665115/create-a-file-in-memory-for-user-to-download-not-through-server. Thanks.
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/xml;charset=utf-8,' + encodeURIComponent(text));
     element.setAttribute('download', filename);

    element.style.display = 'none';
     document.body.appendChild(element);

     element.click();

  document.body.removeChild(element);
}
