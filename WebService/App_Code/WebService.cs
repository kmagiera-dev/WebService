using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Data;

using System.Web.Script.Services;
using System.Data.SqlClient;
using System.Web.Configuration;

/// <summary>
/// Summary description for WebService
/// </summary>
[WebService(Namespace = "http://tempuri.org/")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
[System.ComponentModel.ToolboxItem(false)]
// To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
[System.Web.Script.Services.ScriptService]
public class WebService : System.Web.Services.WebService
{
    public WebService()
    {

        //Uncomment the following line if using designed components 
        //InitializeComponent(); 
    }

    [WebMethod]
    //[ScriptMethod(ResponseFormat = ResponseFormat.Json)]
    [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
    public object GetProducts()
    {
        string connectionString = WebConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString;
        DataTable dt = new DataTable();
        SqlDataReader dr = null;
        using (SqlConnection conn = new SqlConnection(connectionString))
        {
            // Creating insert statement
            string query = string.Format(@"Select * from DataValue");
            SqlCommand cmd = new SqlCommand();
            cmd.Connection = conn;
            cmd.CommandText = query;
            cmd.CommandType = CommandType.Text;
            conn.Open();

            dr = cmd.ExecuteReader();
            dt.Load(dr);
            conn.Close();
            cmd = null;
        }

        //create list of CityNames
        List<Value> value = new List<Value>();
        foreach (DataRow row in dt.Rows)
        {
            Value cn = new Value();
            cn.Id = (int)row["Id"];
            cn.Val = (int)row["Value"];
            value.Add(cn);
        }

        return value;
    }

    public class Value
    {

        public int Id
        {
            get;
            set;
        }

        public int Val
        {
            get;
            set;
        }

    }
}
