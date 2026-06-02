using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class UpdateStockPrecisionAndUserDetail : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "IdentityRole",
                keyColumn: "Id",
                keyValue: "988af31a-79f6-4fb3-926d-c31bff84e98c");

            migrationBuilder.DeleteData(
                table: "IdentityRole",
                keyColumn: "Id",
                keyValue: "ba5e2bd7-ae84-4883-b1e7-9551a79739c5");

            migrationBuilder.InsertData(
                table: "IdentityRole",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "a0aefc06-8d88-49c3-a57c-e79349567662", "e6f6cd6c-1477-4411-aec2-d714b7c7d538", "Admin", "ADMIN" },
                    { "c68465fe-a295-4b6d-b8e5-54d155a2c664", "f1867c30-593c-4b6b-90b6-66ed863fac03", "User", "USER" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "IdentityRole",
                keyColumn: "Id",
                keyValue: "a0aefc06-8d88-49c3-a57c-e79349567662");

            migrationBuilder.DeleteData(
                table: "IdentityRole",
                keyColumn: "Id",
                keyValue: "c68465fe-a295-4b6d-b8e5-54d155a2c664");

            migrationBuilder.InsertData(
                table: "IdentityRole",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "988af31a-79f6-4fb3-926d-c31bff84e98c", "4833dddb-a569-45bd-8e79-ee2fed5f52f2", "User", "USER" },
                    { "ba5e2bd7-ae84-4883-b1e7-9551a79739c5", "45075d46-8aed-457f-9c65-35c5284202eb", "Admin", "ADMIN" }
                });
        }
    }
}
