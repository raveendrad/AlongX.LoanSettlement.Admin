using AlongX.LoanSettlement.Admin.Helper;
using AlongX.LoanSettlement.Admin.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using System.Text.Json;
 




namespace AlongX.LoanSettlement.Admin.Controllers
{
    public class appControllerController : Controller
    {
        // GET: appController
        public ActionResult signin()
        {
            if (Request.Cookies["AlongXLoanProperty"] != null)
            {
                if (Convert.ToBoolean(Request.Cookies["AlongXLoanProperty"]["app_status"].ToString()) == true)
                {
                    return View("Dashboard");
                }
                else
                {
                    return RedirectToAction("app_expired", "app");
                }
            }
            AppPropertyModel app_properties = new AppPropertyModel();
            app_properties.app_name = ConfigurationManager.AppSettings["app_name"];
            app_properties.app_website = ConfigurationManager.AppSettings["app_website"];
            app_properties.app_version = ConfigurationManager.AppSettings["app_version"];
            app_properties.vendor = ConfigurationManager.AppSettings["vendor"];
            app_properties.vendor_website = ConfigurationManager.AppSettings["vendor_website"];
            app_properties.help_url = ConfigurationManager.AppSettings["help_url"];
            app_properties.api_url = ConfigurationManager.AppSettings["api_url"];
            app_properties.help_contact_number = ConfigurationManager.AppSettings["help_contact_number"];

            CreateCookies(app_properties, null, false);

            return View();
        }


        [HttpPost]
        public async Task<ActionResult> authenticate()
        {

            AuthorizedInfoModel authorizedInfoModel = new AuthorizedInfoModel();
            string login_id = Request.Form["login_id"];
            string password = StringFormatter.encrypt(Request.Form["password"]);
            bool isRememberMe = Request.Form["remember_me"] != null ? Convert.ToBoolean(Request.Form["remember_me"]) : false;


            string api_url = ConfigurationManager.AppSettings["api_url"];
            HttpClient client = new HttpClient();
            client.BaseAddress = new Uri(api_url);
            client.DefaultRequestHeaders.Accept.Clear();
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            //GET Method  
            var request = new CredentialsModel() { login_id = login_id, password = password };
            HttpResponseMessage response = await client.PostAsJsonAsync("v1/App/Authenticate", request);
            //var response = client.PostAsync("v1/App/Authenticate", new StringContent(
            // new JavaScriptSerializer().Serialize(request), Encoding.UTF8, "application/json")).Result;
            if (!response.IsSuccessStatusCode)
            {
                //User Access Blocked by the administrator
                TempData["FailedMessage"] = "Login Failed : Invalid Credentials. Please Refresh the page and try again with a valid credential.";
                return RedirectToAction("signin", "app");
            }
            else
            {
                authorizedInfoModel = JsonSerializer.Deserialize<AuthorizedInfoModel>(await response.Content.ReadAsStringAsync());
                authorizedInfoModel.login_id = login_id;
                if (!authorizedInfoModel.status)
                {
                    //App Access Blocked for the subscriber
                    TempData["FailedMessage"] = "Login Failed : " + authorizedInfoModel.message;
                    return RedirectToAction("signin", "app");
                }
                else if (!authorizedInfoModel.app_status)
                {
                    //App Access Blocked for the subscriber
                    TempData["FailedMessage"] = authorizedInfoModel.ServiceProviderMessage;
                    return RedirectToAction("app_expired", "app");
                }
                else
                {
                    //Everything good. authorize now 
                    CreateCookies(null, authorizedInfoModel, isRememberMe);

                    TempData["FailedMessage"] = "";
                    return RedirectToAction("dashboard");
                }
            }
        }

        public ActionResult dashboard()
        {
            if (Request.Cookies["AlongXLoanProperty"] != null)
            {
                if (Convert.ToBoolean(Request.Cookies["AlongXLoanProperty"]["app_status"].ToString()) == true)
                {
                    return View();
                }
                else
                {
                    return RedirectToAction("app_expired", "app");
                }
            }
            else
            {
                return RedirectToAction("signin", "app");
            }
        }

        public void CreateCookies(AppPropertyModel appProperties = null, AuthorizedInfoModel authorizedInfo = null, bool isRememberMe = false)
        {
            DateTime cookieLifeTime = new DateTime();

            if (appProperties != null)
            {
                HttpCookie cookieAppProps = new HttpCookie("AlongXLoanPropertyAppInfo");
                cookieAppProps["app_name"] = appProperties.app_name;
                cookieAppProps["app_website"] = appProperties.app_website;
                cookieAppProps["app_version"] = appProperties.app_version;
                cookieAppProps["vendor"] = appProperties.vendor;
                cookieAppProps["vendor_website"] = appProperties.vendor_website;
                cookieAppProps["help_url"] = appProperties.help_url;
                cookieAppProps["api_url"] = appProperties.api_url;
                cookieAppProps["help_contact_number"] = appProperties.help_contact_number;

                if (isRememberMe)
                {
                    cookieLifeTime = DateTime.Now.AddHours(Convert.ToInt32(ConfigurationManager.AppSettings["rememberMeCookiesLifeTimeHour"]));
                }
                else
                {
                    cookieLifeTime = DateTime.Now.AddHours(Convert.ToInt32(ConfigurationManager.AppSettings["defaultCookiesLifeTimeHour"]));
                }

                cookieAppProps.Expires = cookieLifeTime;
                Response.Cookies.Add(cookieAppProps);
            }
            if (authorizedInfo != null)
            {
                HttpCookie cookieAuthorizedInfo = new HttpCookie("AlongXLoanProperty");
                cookieAuthorizedInfo["organization_id"] = authorizedInfo.organizationId.ToString();
                cookieAuthorizedInfo["business_name"] = authorizedInfo.business_name;
                cookieAuthorizedInfo["business_address"] = authorizedInfo.Location;
                cookieAuthorizedInfo["logo_url"] = authorizedInfo.Image;
                cookieAuthorizedInfo["business_email"] = authorizedInfo.EmailAddress;
                cookieAuthorizedInfo["business_mobile"] = authorizedInfo.PhoneNumber;
                cookieAuthorizedInfo["contact_name"] = authorizedInfo.ContactName;
                cookieAuthorizedInfo["app_status"] = authorizedInfo.app_status.ToString();
                cookieAuthorizedInfo["service_provider_message"] = authorizedInfo.ServiceProviderMessage;
                cookieAuthorizedInfo["role_id"] = authorizedInfo.role_id.ToString();
                cookieAuthorizedInfo["role_name"] = authorizedInfo.role_name;
                cookieAuthorizedInfo["role_description"] = authorizedInfo.role_description;// StringFormatter.Base64Encode(authorizedInfo.role_description); 
                cookieAuthorizedInfo["is_active"] = authorizedInfo.is_active.ToString();
                cookieAuthorizedInfo["login_id"] = authorizedInfo.login_id;
                cookieAuthorizedInfo["full_name"] = authorizedInfo.full_name;
                cookieAuthorizedInfo["thumbnail_name"] = authorizedInfo.thumbnail_name;
                cookieAuthorizedInfo["user_email"] = authorizedInfo.user_email;
                cookieAuthorizedInfo["user_mobile"] = authorizedInfo.user_mobile;
                cookieAuthorizedInfo["last_login"] = authorizedInfo.last_login;
                cookieAuthorizedInfo["status"] = authorizedInfo.status.ToString();
                cookieAuthorizedInfo["message"] = authorizedInfo.message;

                cookieAuthorizedInfo["view_start_date"] = DateTime.Now.AddMonths(-1).ToString("yyyy-MM-ddThh:mm");
                cookieAuthorizedInfo["view_end_date"] = DateTime.Now.ToString("yyyy-MM-ddThh:mm");


                cookieAuthorizedInfo["expiry_datetime"] = DateTime.Now.AddHours(8).ToString();

                cookieAuthorizedInfo["app_name"] = ConfigurationManager.AppSettings["app_name"];
                cookieAuthorizedInfo["app_website"] = ConfigurationManager.AppSettings["app_website"];
                cookieAuthorizedInfo["app_version"] = ConfigurationManager.AppSettings["app_version"];
                cookieAuthorizedInfo["vendor"] = ConfigurationManager.AppSettings["vendor"];
                cookieAuthorizedInfo["vendor_website"] = ConfigurationManager.AppSettings["vendor_website"];
                cookieAuthorizedInfo["help_url"] = ConfigurationManager.AppSettings["help_url"];
                cookieAuthorizedInfo["api_url"] = ConfigurationManager.AppSettings["api_url"];
                cookieAuthorizedInfo["help_contact_number"] = ConfigurationManager.AppSettings["help_contact_number"];


                if (isRememberMe)
                {
                    cookieLifeTime = DateTime.Now.AddHours(Convert.ToInt32(ConfigurationManager.AppSettings["rememberMeCookiesLifeTimeHour"]));
                }
                else
                {
                    cookieLifeTime = DateTime.Now.AddHours(Convert.ToInt32(ConfigurationManager.AppSettings["defaultCookiesLifeTimeHour"]));
                }

                cookieAuthorizedInfo.Expires = cookieLifeTime;
                Response.Cookies.Add(cookieAuthorizedInfo);
            }


        }
        public ActionResult signout()
        {
            //Clear Cookies
            if (Request.Cookies["AlongXLoanPropertyAppInfo"] != null)
            {
                HttpCookie cookieAppProps = Request.Cookies["AlongXLoanPropertyAppInfo"];
                cookieAppProps.Expires = DateTime.Now.AddHours(-8);
                cookieAppProps.Value = null;
                Response.Cookies.Add(cookieAppProps);
            }
            if (Request.Cookies["AlongXLoanProperty"] != null)
            {
                HttpCookie cookieAuthorizedInfo = Request.Cookies["AlongXLoanProperty"];
                cookieAuthorizedInfo.Expires = DateTime.Now.AddHours(-168);
                cookieAuthorizedInfo.Value = null;
                Response.Cookies.Add(cookieAuthorizedInfo);
            }
            return RedirectToAction("signin", "app");
        }
        public ActionResult app_expired()
        {
            return View();
        }
        public ActionResult my_profile()
        {
            if (Request.Cookies["AlongXLoanProperty"] != null)
            {
                if (Convert.ToBoolean(Request.Cookies["AlongXLoanProperty"]["app_status"].ToString()) == true)
                {
                    return View();
                }
                else
                {
                    return RedirectToAction("app_expired", "app");
                }
            }
            else
            {
                return RedirectToAction("signin", "app");
            }
        }
        public ActionResult notifications()
        {
            if (Request.Cookies["AlongXLoanProperty"] != null)
            {
                if (Convert.ToBoolean(Request.Cookies["AlongXLoanProperty"]["app_status"].ToString()) == true)
                {
                    return View();
                }
                else
                {
                    return RedirectToAction("app_expired", "app");
                }
            }
            else
            {
                return RedirectToAction("signin", "app");
            }
        }
        public ActionResult action_unauthorized(string operation = "Operation")
        {
            if (Request.Cookies["AlongXLoanProperty"] != null)
            {
                if (Convert.ToBoolean(Request.Cookies["AlongXLoanProperty"]["app_status"].ToString()) == true)
                {
                    ViewBag.Operation = operation;
                    return View();
                }
                else
                {
                    return RedirectToAction("app_expired", "app");
                }
            }
            else
            {
                return RedirectToAction("signin", "app");
            }
        }
        public ActionResult my_activity_log()
        {
            if (Request.Cookies["AlongXLoanProperty"] != null)
            {
                if (Convert.ToBoolean(Request.Cookies["AlongXLoanProperty"]["app_status"].ToString()) == true)
                {
                    return View();
                }
                else
                {
                    return RedirectToAction("app_expired", "app");
                }
            }
            else
            {
                return RedirectToAction("signin", "app");
            }
        }

    }
}