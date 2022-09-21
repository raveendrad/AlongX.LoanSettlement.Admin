using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AlongX.LoanSettlement.Admin.Models
{
    public class CompanyModel
    {
        public long organizationId { get; set; }
        public string name { get; set; }
        public string ContactName { get; set; }
        public string PhoneNumber { get; set; }
        public string EmailAddress { get; set; }
        public string image { get; set; }
        public string Location { get; set; }
        public string OrgType { get; set; }
        public string OpenTime { get; set; }
        public string CloseTime { get; set; }
        public string GSTINNumber { get; set; }

    }
}