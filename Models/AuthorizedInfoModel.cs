using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AlongX.LoanSettlement.Admin.Models
{
    public class AuthorizedInfoModel
    {
        public long organizationId { get; set; }
        public string business_name { get; set; }
        public string ContactName { get; set; }
        public string PhoneNumber { get; set; }
        public string EmailAddress { get; set; }
        public string Image { get; set; }
        public string Location { get; set; }
        public string OrgType { get; set; }
        public string OpenTime { get; set; }
        public string CloseTime { get; set; }
        public bool app_status { get; set; }
        public string ServiceProviderMessage { get; set; }
        public long role_id { get; set; }
        public string role_name { get; set; }
        public string role_description { get; set; }
        public bool is_active { get; set; }
        public string full_name { get; set; }
        public string login_id { get; set; }
        public string thumbnail_name { get; set; }
        public string user_email { get; set; }
        public string user_mobile { get; set; }
        public string last_login { get; set; }
        public bool status { get; set; }
        public string message { get; set; }
        public string api_url { get; set; }

        public string view_start_date { get; set; }
        public string view_end_date { get; set; }

    }
}