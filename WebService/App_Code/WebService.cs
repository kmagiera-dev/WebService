using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Data;

using System.Web.Script.Services;
using System.Data.SqlClient;
using System.Web.Configuration;
using System.Web.Script.Serialization;

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

    public List<Dictionary<string, object>> GetValues()
    {
        string connectionString = WebConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString;
        DataTable dt = new DataTable();
        SqlDataReader dr = null;
        using (SqlConnection conn = new SqlConnection(connectionString))
        {
            // Creating insert statement
            string query = string.Format(@"Select * from SensorsValues");
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

        List<Dictionary<string, object>> rows = new List<Dictionary<string, object>>();
        Dictionary<string, object> row;
        foreach (DataRow dataRow in dt.Rows)
        {
            row = new Dictionary<string, object>();
            foreach (DataColumn col in dt.Columns)
            {
                row.Add(col.ColumnName, dataRow[col]);
            }
            rows.Add(row);
        }

        return rows;
    }

    [WebMethod]
    [ScriptMethod(UseHttpGet = true, ResponseFormat = ResponseFormat.Json)]
    public void HelloWorld()
    {
        JavaScriptSerializer js = new JavaScriptSerializer();
        Context.Response.Clear();
        Context.Response.ContentType = "application/json";
        Context.Response.Write(js.Serialize(GetValues()));
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
