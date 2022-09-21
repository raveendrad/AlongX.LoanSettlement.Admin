var api_url = "";
$(document).ready(function () {
    api_url = $("#hfApiUrl").val();
    getBanner();

});

       
function getBanner() {
    if (!isUserActionAuthorized("read", "banner")) {
        validationFailed("You are NOT authorized to perform this operation.");
        return false;
    }
    $.ajax({
        url: api_url + '/Banner/GetBannerByOrganization?organizationId=' + organizationId + '',
        type: 'GET',
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        beforeSend: function () {
            $("#image_list").empty();
            runLoader("#image_list", "Loading Banner...");
        },
        success: function (result) {
            stopLoader("#image_list");
            var imagelist = "";
            var imageCount = 1;
            result.forEach(function (item, index) {
                imagelist = "<h6 style=\"background-color:#e4e3ef; padding:5px;\">Banner # " + imageCount + " <span banner-id=\"" + item.bannerId +"\" class=\"fa fa-window-close delete_banner\" style=\"float:right; color:red; cursor:pointer; font-size:20px;\"></span></h6>";
                imagelist += "<img src='" + item.image + "' style=\"width:100%; border:3px solid #e4e3ef; margin-top:-8px;\" >";
                imagelist += "<br><br>";
                $("#image_list").append(imagelist);
                imageCount++;
            });

            $(".delete_banner").each(function () {
                $(this).click(function () {
                    var bannerIdToDelete = $(this).attr("banner-id");
                    deleteBanner(bannerIdToDelete);
                });
            });
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            stopLoader("#image_list");
            error("Error on loading banner. Please try again.");
        },
        complete: function () {
            stopLoader("#image_list");
        },
    });
}

function deleteBanner(id) {
    if (!isUserActionAuthorized("delete", "banners")) {
        validationFailed("You are NOT authorized to perform this operation.");
        return false;
    }
    $.confirm({
        icon: 'fa fa-question',
        title: 'Banner # ' + id + '',
        content: '<b style="color:red;">Deleting !</b><br>Are your sure you want to delete this banner (# ' + id +')?',
        type: 'purple',
        typeAnimated: false,
        buttons: {
            confirm: {
                text: 'Yes, Sure',
                btnClass: 'btn-purple',
                action: function () {
                    $.ajax({
                        url: api_url + '/Banner/DeleteBanner?organizationId=' + organizationId + '&bannerId=' + id + '',
                        type: 'DELETE',
                        dataType: 'json',
                        contentType: "application/json; charset=utf-8",
                        beforeSend: function () {
                            runLoader("#content_area", "Deleting Banner...");
                        },
                        success: function (result) {
                            stopLoader("#content_area");
                            if (result.status === true) {
                                success("Successfully deleted the banner # '<b>" + id + "'");
                                saveActivityLog("Deleted the banner", id);
                                getBanner();
                            }
                            else {
                                error(result.message);
                            }
                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            stopLoader("#content_area");
                            error("Error on deleting banner '<b># " + id + "</b>'. Please try again.");
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