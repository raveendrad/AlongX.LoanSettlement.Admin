var api_url = "";
$(document).ready(function () {
    api_url = $("#hfApiUrl").val();

    showData();

   

    $("#btnSave").click(function () {
        save();
    });

});

function showData() {
    $.ajax({
        type: "GET",
        dataType: "json",
        url: api_url + 'http://localhost:51437/api/LoanProvider?loan_provider_id=0',
        "bProcessing": true,
        "bServerSide": true,
       

        success: function (data) {
            $('#loan-provider-table').DataTable({
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

                    { 'data': 'loan_provider_name' },
                    { 'data': 'loan_platform' },
                    { 'data': 'mobile_number' },
                    { 'data': 'additional_discount_to_settlement' },
                    { 'data': 'special_comments' },
                    {
                        "data": null, "loan_provider_id": "loan_provider_id",
                        'mRender': function (data, type, full, meta) {
                            var actionButtons = "";
                            actionButtons += "<input type='hidden' id='id_" + data.loan_provider_id + "' value='" + data.loan_provider_id + "'></input>";
                            actionButtons += "<input type='hidden' id='loan_provider_name_" + data.loan_provider_id + "' value='" + data.loan_provider_name + "'></input>";
                            actionButtons += "<input type='hidden' id='loan_platform_" + data.loan_provider_id + "' value='" + data.loan_platform + "'></input>";
                            actionButtons += "<input type='hidden' id='mobile_number_" + data.loan_provider_id + "' value='" + data.mobile_number + "'></input>";
                            actionButtons += "<input type='hidden' id='additional_discount_to_settlement_" + data.loan_provider_id + "' value='" + data.additional_discount_to_settlement + "'></input>";
                            actionButtons += "<input type='hidden' id='special_comments_" + data.loan_provider_id + "' value='" + data.special_comments + "'></input>";

                           

                            actionButtons += '<button data-toggle="dropdown" class="btn ripple btn-dark table-button"><i class="fa fa-ellipsis-h"></i></button>';
                            actionButtons += '<div class="dropdown-menu">';
                            actionButtons += '<a href="#" onclick="editDialog(' + data.loan_provider_id + ')"  class="dropdown-item" data-target="#save-item-modal" data-toggle="modal"><i class="fa fa-pen""></i>  View/Edit loanprovider</a>';
                            actionButtons += '<a href="#" onclick=" deleteItem(' + data.loan_provider_id + ')"  class="dropdown-item"><i class="fa fa-trash""></i>  Delete customer</a>';
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
            error("Error on listing outlets. Please try again.");
        },
        complete: function () {
        }
    });
}
function save() {

    var loan_provider_id = $("#loan_provider_id").val();


    var loan_provider_name = $("#loan_provider_name").val();
    var loan_platform = $("#loan_platform").val();
    var mobile_number = $("#mobile_number").val();
    var additional_discount_to_settlement = $("#additional_discount_to_settlement").val();
    var special_comments = $("#special_comments").val();

    var isValidationPassed = true;
    if (loan_provider_name.trim() == "") {
        isValidationPassed = false;
        validationFailed("LoanProvider Name is mandatory..", "save-item-modal-body");
        $("#loan_provider_name").focus();
    }
    else if (loan_platform == "") {
        isValidationPassed = false;
        validationFailed("loan_platform is mandatory..", "save-item-modal-body");
        $("#loan_platform").focus();
    }
    else if (mobile_number == "") {
        isValidationPassed = false;
        validationFailed("mobile_number is mandatory..", "save-item-modal-body");
        $("#mobile_number").focus();
    }
    else if (additional_discount_to_settlement == "") {
        isValidationPassed = false;
        validationFailed("Additional Discount is mandatory..", "save-item-modal-body");
        $("#additional_discount_to_settlement").focus();
    }
    else if (special_comments == "") {
        isValidationPassed = false;
        validationFailed("special_comments is mandatory..", "save-item-modal-body");
        $("#special_comments").focus();
    }

    if (isValidationPassed == true) {
        var requestData =
        {
            "loan_provider_id": loan_provider_id,
            "loan_provider_name": loan_provider_name,
            "loan_platform": loan_platform,
            "mobile_number": mobile_number,
            "additional_discount_to_settlement": additional_discount_to_settlement,
            "special_comments": special_comments
        };
        var jsonData = JSON.stringify(requestData);
        $.ajax({

            url: 'http://localhost:51437/api/LoanProvider',
            type: 'POST',
            dataType: 'json',
            data: jsonData,
            contentType: "application/json; charset=utf-8",
            beforeSend: function () {
                /* runLoader("#save-item-modal-body", "Saving...");*/
            },
            success: function (result) {
                /* stopLoader("#save-item-modal-body");*/
                if (result.status === true) {
                    console.log(result);
                    /* alert('data saved');*/
                    success(result.message, "save-item-modal-body");
                    console.log(result);
                    showData();

                    //Silent Activity Log
                    if (loan_provider_id == 0) {
                        saveActivityLog("Added a new LoanProvider", requestData);
                    }
                    else {
                        saveActivityLog("Updated the LoanProvider entry", requestData);
                    }
                }
                else {
                    error(result.message, "save-item-modal-body");
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                stopLoader("#save-item-modal-body");
                error("Error on saving loanprovider. Please try again.", "save-item-modal-body");
            },
            complete: function () {
                stopLoader("#save-item-modal-body");
                if (loan_provider_id == 0) {
                    resetSaveItemFields();
                }
            },
        });
    }

}

function editDialog(loan_provider_id) {

    resetSaveItemFields();
    $("#loan_provider_id").val(loan_provider_id);
    $("#loan_provider_name").val($("#loan_provider_name_" + loan_provider_id + "").val());
    $("#loan_platform").val($("#loan_platform_" + loan_provider_id + "").val());
    $("#mobile_number").val($("#mobile_number_" + loan_provider_id + "").val());
    $("#additional_discount_to_settlement").val($("#additional_discount_to_settlement_" + loan_provider_id + "").val());
    $("#special_comments").val($("#special_comments_" + loan_provider_id + "").val());
}
function deleteItem(id) {
    $.confirm({
        icon: 'fa fa-question',
        title: '!',
        content: '<b style="color:red;">Deleting !</b><br>Are your sure you want to delete this loanprovider?',
        type: 'purple',
        typeAnimated: false,
        buttons: {
            confirm: {
                text: 'Yes, Sure',
                btnClass: 'btn-purple',
                action: function () {
                    $.ajax({
                        url: api_url + 'http://localhost:51437/api/LoanProvider?loan_provider_id=' + id + '',

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
                            alert("Error on deleting the selected loanprovider '<b>" + id    + "'</b>. Please try again.");
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
    $("#loan_provider_id").val(0);
    $("#loan_provider_name").val("");
    $("#loan_platform").val("");
    $("#mobile_number").val("");
    $("#additional_discount_to_settlement").val("");
    $("#special_comments").val("");
}
