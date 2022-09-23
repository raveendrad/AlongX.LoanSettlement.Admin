var api_url = "";
$(document).ready(function () {
    api_url = $("#hfApiUrl").val();

    showData();

    //getCompanyAccountList();
    //showExpenditureSummary();

    //$("#btnSave").click(function () {
    //    saveItem();
    //});
   
});

function showData() {
    $.ajax({
        type: "GET",
        dataType: "json",
        url: api_url + 'http://localhost:51437/api/Customer?customer_id=0',
        "bProcessing": true,
        "bServerSide": true,
        //beforeSend: function () {
        //    runLoader("#content_area", "Loading Outlets...");
        //},
        
        success: function (data) {
            //stopLoader("#content_area");
            //$("#customer-id-table").show();
            $('#customer_table').DataTable({
                destroy: true,
                data: data,
                "order": [],
                dom: 'Bftip',
                buttons: [
                    'copyHtml5',
                    'excelHtml5',
                    'csvHtml5',
                    'pdfHtml5',
                ],
                columns: [
                   
                    { 'data': 'name' },
                    { 'data': 'gender' },
                    { 'data': 'mobile_number' },
                    { 'data': 'full_address' },
                    { 'data': 'occupation' },
                    { 'data': 'state' },
                    { 'data': 'your_earning_per_month' },
                    {
                        "data": null, "customer_id": "customer_id",
                        'mRender': function (data, type, full, meta) {
                            var actionButtons = ""; 
                            //actionButtons += "<input type='hidden' id='id_" + data.customer_id + "' value='" + data.customer_id + "'></input>";
                            //actionButtons += "<input type='hidden' id='locality_" + customer_id + "' value='" + data.locality + "'></input>";
                            //actionButtons += "<input type='hidden' id='name_" + data.customer_id + "' value='" + data.name + "'></input>";
                            //actionButtons += "<input type='hidden' id='full_address_" + data.customer_id + "' value='" + data.full_address + "'></input>";
                            //actionButtons += "<input type='hidden' id='manager_" + data.customer_id + "' value='" + data.manager + "'></input>";
                            //actionButtons += "<input type='hidden' id='contact_number_" + data.customer_id + "' value='" + data.contact_number + "'></input>";

                            //~/assets/img/outlet_icon.png
                            //debugger;

                            actionButtons += '<button data-toggle="dropdown" class="btn ripple btn-dark table-button"><i class="fa fa-ellipsis-h"></i></button>';
                            actionButtons += '<div class="dropdown-menu">';
                            //actionButtons += '<a href="#"  class="dropdown-item" data-target="#save-item-modal" data-toggle="modal"><i class="fa fa-pen""></i>  View/Edit customer</a>';
                            actionButtons += '<a href="#" onclick=" deleteItem(' + data.customer_id + ')"  class="dropdown-item"><i class="fa fa-trash""></i>  Delete customer</a>';
                            //actionButtons += '<a href="#"  class="dropdown-item"><i class="fa fa-folder""></i>  Open Folder</a>';
                            actionButtons += '</div>';
                            return actionButtons;
                        }
                    }
                ],
                "columnDefs": [{
                    "targets": 'no-sort',
                    "orderable": false,
                } 
                ]
            });
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            //stopLoader("#content_area");
            error("Error on listing outlets. Please try again.");
        },
        complete: function () {
            //stopLoader("#content_area");
        }
    });
}
/*function saveItem() {
    var id = $("#id").val();
    if (id == 0) {
        if (!isUserActionAuthorized("create", "outlet")) {
            validationFailed("You are NOT authorized to perform this operation.");
            return false;
        }
    }
    if (id > 0) {
        if (!isUserActionAuthorized("edit", "outlet")) {
            validationFailed("You are NOT authorized to perform this operation.");
            return false;
        }
    }
    var name = $("#name").val();
    var locality = $("#locality").val();
    var full_address = $("#full_address").val();
    var manager = $("#manager").val();
    var contact_number = $("#contact_number").val();

    var isValidationPassed = true;
    if (name.trim() == "") {
        isValidationPassed = false;
        validationFailed("Outlet Name is mandatory..", "save-item-modal-body");
        $("#name").focus();
    }
    else if (locality == "") {
        isValidationPassed = false;
        validationFailed("Locality is mandatory..", "save-item-modal-body");
        $("#locality").focus();
    }
    else if (full_address == "") {
        isValidationPassed = false;
        validationFailed("Full Address is mandatory..", "save-item-modal-body");
        $("#full_address").focus();
    }
    else if (manager == "") {
        isValidationPassed = false;
        validationFailed("Manager Name is mandatory..", "save-item-modal-body");
        $("#manager").focus();
    }
    else if (contact_number == "") {
        isValidationPassed = false;
        validationFailed("Contact Number is mandatory..", "save-item-modal-body");
        $("#contact_number").focus();
    }

    if (isValidationPassed == true) {
        var requestData =
        {
            "id": id,
            "name": name,
            "locality": locality,
            "full_address": full_address,
            "manager": manager,
            "contact_number": contact_number
        };
        var jsonData = JSON.stringify(requestData);
        $.ajax({
            url: api_url + '/Outlet',
            type: 'POST',
            dataType: 'json',
            data: jsonData,
            contentType: "application/json; charset=utf-8",
            beforeSend: function () {
                runLoader("#save-item-modal-body", "Saving...");
            },
            success: function (result) {
                stopLoader("#save-item-modal-body");
                if (result.status === true) {
                    success(result.message, "save-item-modal-body");
                    showData();
                    //Silent Activity Log
                    if (id == 0) {
                        saveActivityLog("Added a new outlet", requestData);
                    }
                    else {
                        saveActivityLog("Updated the outlet entry", requestData);
                    }
                }
                else {
                    error(result.message, "save-item-modal-body");
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                stopLoader("#save-item-modal-body");
                error("Error on saving outlet. Please try again.", "save-item-modal-body");
            },
            complete: function () {
                stopLoader("#save-item-modal-body");
                if (id == 0) {
                    resetSaveItemFields();
                }
            },
        });
    }

}

function editDialog(id) {
    if (!isUserActionAuthorized("read", "outlets")) {
        validationFailed("You are NOT authorized to perform this operation.");
        return false;
    }
    resetSaveItemFields();
    $("#id").val(id);
    $("#name").val($("#name_" + id + "").val());
    $("#locality").val($("#locality_" + id + "").val());
    $("#full_address").val($("#full_address_" + id + "").val());
    $("#manager").val($("#manager_" + id + "").val());
    $("#contact_number").val($("#contact_number_" + id + "").val());
}*/
function deleteItem(id) {
    $.confirm({
        icon: 'fa fa-question',
        title:  '!',
        content: '<b style="color:red;">Deleting !</b><br>Are your sure you want to delete this outlet?',
        type: 'purple',
        typeAnimated: false,
        buttons: {
            confirm: {
                text: 'Yes, Sure',
                btnClass: 'btn-purple',
                action: function () {
                    $.ajax({
                        url: api_url + 'http://localhost:51437/api/Customer?customer_id=' + id + '',
                        type: 'DELETE',
                        dataType: 'json',
                        contentType: "application/json; charset=utf-8",
                        beforeSend: function () {
                           // runLoader("#content_area", "Deleting '<b>" + name + "'</b>...");
                        },
                        success: function (result) {
                           // stopLoader("#content_area");
                            if (result.status === true) {
                                //alert("Successfully deleted the selected customer '<b>" + id + "'");
                                
                                showData();
                                //saveActivityLog("Deleted the outlet - '" + name + "'", name);
                            }
                            else {
                                error(result.message);
                            }
                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            stopLoader("#content_area");
                            alert("Error on deleting the selected customer '<b>" + id + "'</b>. Please try again.");
                        },
                        complete: function () {
                            stopLoader("#content_area");
                        },
                    });
                }
            },
            cancel: function () {
            }
        }
    });
}
function resetSaveItemFields() {
    $("#name").val("");
    $("#gender").val("");
    $("#mobile_number").val("");
    $("#full_address").val("");
    $("#occupation").val("");
    $("#state").val("");
    $("#your_earning_per_month").val("");
    
}
function indent_load() {

    window.location.href = "http://localhost:44313/Indent/Indent";
}