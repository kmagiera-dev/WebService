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
using System.Collections.Specialized;

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

    public string GetValues()
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

        return new JavaScriptSerializer().Serialize(
            dt.Rows.Cast<DataRow>()
            .Select(row => row.Table.Columns.Cast<DataColumn>()
            .ToDictionary(col => col.ColumnName, col => row[col.ColumnName]))
            .ToList()
        );
    }

    public string ReadStatuses(string SeriesNr)
    {
        string connectionString = WebConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString;
        DataTable dt = new DataTable();
        SqlDataReader dr = null;
        using (SqlConnection conn = new SqlConnection(connectionString))
        {
            // Creating insert statement
            string query = string.Format(@"Select tv.Date, sv.SensorStatus from TimeValue As tv INNER JOIN StatusValue AS sv ON tv.SensorId  = sv.Id WHERE sv.SensorType = {0}",
                SeriesNr);
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
        return new JavaScriptSerializer().Serialize(
            dt.Rows.Cast<DataRow>()
            .Select(row => row.Table.Columns.Cast<DataColumn>()
            .ToDictionary(col => col.ColumnName, col => row[col.ColumnName]))
            .ToList()
        );
    }

    [WebMethod]
    [ScriptMethod(UseHttpGet = true, ResponseFormat = ResponseFormat.Json)]
    public void GetStatuses(string Id)
    {
        JavaScriptSerializer js = new JavaScriptSerializer();
        Context.Response.Clear();
        Context.Response.ContentType = "application/json";
        Context.Response.Write(ReadStatuses(Id));
    }

    [WebMethod]
    [ScriptMethod(UseHttpGet = true, ResponseFormat = ResponseFormat.Json)]
    public void HelloWorld()
    {
        JavaScriptSerializer js = new JavaScriptSerializer();
        Context.Response.Clear();
        Context.Response.ContentType = "application/json";
        Context.Response.Write(GetValues());
    }
}
