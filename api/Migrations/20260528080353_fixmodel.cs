using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class fixmodel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "IdentityRole",
                keyColumn: "Id",
                keyValue: "06ac14f3-f7a0-4670-8583-99a046396885");

            migrationBuilder.DeleteData(
                table: "IdentityRole",
                keyColumn: "Id",
                keyValue: "3438efc9-06db-48ba-9f0b-715dab03f076");

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
                    { "06ac14f3-f7a0-4670-8583-99a046396885", "01334308-3d75-41d9-aec8-487e9cb963bf", "Admin", "ADMIN" },
                    { "3438efc9-06db-48ba-9f0b-715dab03f076", "f110032b-4e7f-4f69-9420-266875b0044d", "User", "USER" }
                });
        }
    }
}
