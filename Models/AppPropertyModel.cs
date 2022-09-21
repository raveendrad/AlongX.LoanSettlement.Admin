using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AlongX.LoanSettlement.Admin.Models
{
    public class AppPropertyModel   
    {
        public string app_name { get; set; }
        public string app_website { get; set; }
        public string app_version { get; set; }
        public string vendor { get; set; }
        public string vendor_website { get; set; }
        public string help_url { get; set; }
        public string api_url { get; set; }
        public string help_contact_number { get; set; }
    }
}