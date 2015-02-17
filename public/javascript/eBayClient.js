var _baseUrl = 'http://localhost:3000/';

function validate(){
	var pass = $('input[name=password]').val();
	var confrm = $('input[name=confirm]').val();
	var email = $('input[name=email]').val();
	var zip = $('input[name=zipcode]').val();
	alert('In validate');
	
	if(allnumeric(zip)){
		if(ValidateEmail(email)){
			if(pass == confrm){
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	} else {
		return false;
	}
}

function validZip(){
	var zip = $('input[name=zipcode]').val();
	var numbers = /^[0-9]+$/;
	if(zip !== "" || zip !== undefined || zip !== null){
		if(zip.match(numbers)){ 
			alert('True');
			return true;  
		} else {  
			alert('ZIP code must have numeric characters only');
			$('input[name=zipcode]').focus();
			return false;  
		}  
	} else {
		return true;
	}
}

function allnumeric(uzip){
	var numbers = /^[0-9]+$/;  
	if(uzip.match(numbers)){ 
		alert('True');
		return true;  
	} else {  
		alert('ZIP code must have numeric characters only');
		$('input[name=zipcode]').focus();
		return false;  
	}  
}

function ValidateEmail(uemail){ 
	var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;  
	if(uemail.match(mailformat)){  
		return true;  
	} else {  
		alert("You have entered an invalid email address!"); 
		$('input[name=email]').focus();
		return false;  
	}  
}

function chk(){
	var bid = $('input[name=bid_price]').val();
	var price = $('.price-new]').val();
	if(bid <= price){
		alert('Less');
		return false;
	} else {
		return true;
	}
}

function deleteData(id,tableName){
	alert("deletedata");
	var finalURL = baseURL + "delete";
	sendAjaxRequest(finalURL,id,tableName);
}

function sendAjaxRequest(finalURL,id,tableName)
{
	$.ajax({
        url:finalURL,
        type:'POST',
        data:{"id": id,"tableName": tableName},
        success: function(result) {
        	
        },
        error: function(jqXHR, textStatus, errorThrown) {
        	alert('error ' + textStatus + " " + errorThrown);
        }
    });
}

function client(){
	var p_id = $('#product_id').val();
	var p_title = $('#product_title').val();
	var p_aid = $('#a_id').val();
	var bid_price = $('input[name=bid_price]').val();
	alert("p_id : " + p_id);
	alert("p_title : " + p_title);
	
	$.ajax({
        url:_baseUrl + 'bid',
        type:'POST',
        data:{"bid_val": bid_price},
        success: function(result) {
        	alert('placed bid');
        },
        error: function(jqXHR, textStatus, errorThrown) {
        	alert('error ' + textStatus + " " + errorThrown);
        }
    });
}
