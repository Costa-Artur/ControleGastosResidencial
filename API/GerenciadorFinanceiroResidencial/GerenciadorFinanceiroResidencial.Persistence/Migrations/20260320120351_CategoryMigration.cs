using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace GerenciadorFinanceiroResidencial.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class CategoryMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Persons",
                keyColumn: "Id",
                keyValue: new Guid("6a878c14-0db2-4f99-8603-bd133b383c32"));

            migrationBuilder.DeleteData(
                table: "Persons",
                keyColumn: "Id",
                keyValue: new Guid("e17e5930-af50-4b6c-b4d7-98f5227c495e"));

            migrationBuilder.CreateTable(
                name: "Categories",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    Purpose = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Categories", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "Categories",
                columns: new[] { "Id", "Description", "Purpose" },
                values: new object[,]
                {
                    { new Guid("c60109c8-9e21-4e32-8930-75d9e7d2b8a1"), "Salário", 1 },
                    { new Guid("e0ec4138-9ff6-4dc7-baa8-d6c069bf34cf"), "Aluguel", 2 }
                });

            migrationBuilder.InsertData(
                table: "Persons",
                columns: new[] { "Id", "Age", "Name" },
                values: new object[,]
                {
                    { new Guid("cd539e90-9e8c-4002-a005-f1d0adbbc2df"), 20, "John Doe" },
                    { new Guid("daaafb00-298e-43db-b67e-592314389e82"), 21, "Jane Doe" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Categories");

            migrationBuilder.DeleteData(
                table: "Persons",
                keyColumn: "Id",
                keyValue: new Guid("cd539e90-9e8c-4002-a005-f1d0adbbc2df"));

            migrationBuilder.DeleteData(
                table: "Persons",
                keyColumn: "Id",
                keyValue: new Guid("daaafb00-298e-43db-b67e-592314389e82"));

            migrationBuilder.InsertData(
                table: "Persons",
                columns: new[] { "Id", "Age", "Name" },
                values: new object[,]
                {
                    { new Guid("6a878c14-0db2-4f99-8603-bd133b383c32"), 21, "Jane Doe" },
                    { new Guid("e17e5930-af50-4b6c-b4d7-98f5227c495e"), 20, "John Doe" }
                });
        }
    }
}
