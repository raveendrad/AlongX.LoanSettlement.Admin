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
        url: api_url + 'http://localhost:51437/api/User?user_id=0',
        "bProcessing": true,
        "bServerSide": true,


        success: function (data) {
            $('#user-table').DataTable({
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

                    { 'data': 'login_id' },
                    { 'data': 'user_full_name' },
                    { 'data': 'role' },
                    {
                        "data": null, "user_id": "user_id",
                        'mRender': function (data, type, full, meta) {
                            var actionButtons = "";
                            actionButtons += "<input type='hidden' id='id_" + data.user_id + "' value='" + data.user_id + "'></input>";
                            actionButtons += "<input type='hidden' id='login_id_" + data.user_id + "' value='" + data.login_id + "'></input>";
                            actionButtons += "<input type='hidden' id='user_full_name_" + data.user_id + "' value='" + data.user_full_name + "'></input>";
                            actionButtons += "<input type='hidden' id='role_" + data.user_id + "' value='" + data.role + "'></input>";
                           



                            actionButtons += '<button data-toggle="dropdown" class="btn ripple btn-dark table-button"><i class="fa fa-ellipsis-h"></i></button>';
                            actionButtons += '<div class="dropdown-menu">';
                            actionButtons += '<a href="#" onclick="editDialog(' + data.user_id + ')"  class="dropdown-item" data-target="#save-item-modal" data-toggle="modal"><i class="fa fa-pen""></i>  View/Edit user</a>';
                            actionButtons += '<a href="#" onclick=" deleteItem(' + data.user_id + ')"  class="dropdown-item"><i class="fa fa-trash""></i>  Delete user</a>';
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

    var user_id = $("#user_id").val();
    var login_id = $("#login_id").val();
    var user_full_name = $("#user_full_name").val();
    var role = $("#role").val();
   

    var isValidationPassed = true;
    if (user_id.trim() == "") {
        isValidationPassed = false;
        validationFailed("user_id  is mandatory..", "save-item-modal-body");
        $("#loan_provider_name").focus();
    }

   else if (login_id.trim() == "") {
        isValidationPassed = false;
        validationFailed("login_id  is mandatory..", "save-item-modal-body");
        $("#loan_provider_name").focus();
    }
    else if (user_full_name == "") {
        isValidationPassed = false;
        validationFailed("user_full_name is mandatory..", "save-item-modal-body");
        $("#user_full_name").focus();
    }
    else if (role == "") {
        isValidationPassed = false;
        validationFailed("role is mandatory..", "save-item-modal-body");
        $("#role").focus();
    }
   
    if (isValidationPassed == true) {
        var requestData =
        {
            "user_id": user_id,
            "login_id": login_id,
            "user_full_name": user_full_name,
            "role": role,
           
        };
        var jsonData = JSON.stringify(requestData);
        $.ajax({

            url: 'http://localhost:51437/api/User',
            type: 'POST',
            dataType: 'json',
            data: jsonData,
            contentType: "application/json; charset=utf-8",
            beforeSend: function () {
            },
            success: function (result) {
                if (result.status === true) {
                    console.log(result);
                    success(result.message, "save-item-modal-body");
                    console.log(result);
                    showData();

                    if (user_id == 0) {
                        saveActivityLog("Added a new User", requestData);
                    }
                    else {
                        saveActivityLog("Updated the User entry", requestData);
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
                if (user_id == 0) {
                    resetSaveItemFields();
                }
            },
        });
    }

}

function editDialog(user_id) {

    resetSaveItemFields();
    $("#user_id").val(user_id);
    $("#login_id").val($("#login_id_" + user_id + "").val());
    $("#user_full_name").val($("#user_full_name_" + user_id + "").val());
    $("#role").val($("#role_" + user_id + "").val());
  
}
function deleteItem(id) {
    $.confirm({
        icon: 'fa fa-question',
        title: '!',
        content: '<b style="color:red;">Deleting !</b><br>Are your sure you want to delete this User?',
        type: 'purple',
        typeAnimated: false,
        buttons: {
            confirm: {
                text: 'Yes, Sure',
                btnClass: 'btn-purple',
                action: function () {
                    $.ajax({
                        url: api_url + 'http://localhost:51437/api/User?user_id=' + id + '',

                        type: 'DELETE',
                        dataType: 'json',
                        contentType: "application/json; charset=utf-8",
                        beforeSend: function () {
                        },
                        success: function (result) {
                            if (result.status === true) {

                                showData();
                            }
                            else {
                                error(result.message);
                            }
                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            stopLoader("#content_area");
                            alert("Error on deleting the selected User '<b>" + id + "'</b>. Please try again.");
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
    $("#user_id").val(0);
    $("#login_id").val("");
    $("#user_full_name").val("");
    $("#role").val("");
   
}
