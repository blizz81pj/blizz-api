using Microsoft.EntityFrameworkCore;
using MySql.Data.MySqlClient;
using MySql.EntityFrameworkCore.Infrastructure;
using System;
using System.Collections.Generic;

namespace BeerStuff.DataAccess.Entities.BeerNetContext
{
    public partial class BeerNetContext
    {
        public static Action<DbContextOptionsBuilder> BuildConnection(
            string connectionString)
        {
            void BuildConnection(DbContextOptionsBuilder builder) => builder.UseMySQL(
                FixSqlConnectionString(connectionString));

            return BuildConnection;
        }

        internal static string FixSqlConnectionString(string connectionString)
        {
            if (string.IsNullOrWhiteSpace(connectionString))
            {
                return string.Empty;
            }

            try
            {
                return new MySqlConnectionStringBuilder(connectionString).ConnectionString;
            }
            catch (KeyNotFoundException)
            {
                return string.Empty;
            }
            catch (FormatException)
            {
                return string.Empty;
            }
            catch (ArgumentException)
            {
                return string.Empty;
            }
        }
    }
}
