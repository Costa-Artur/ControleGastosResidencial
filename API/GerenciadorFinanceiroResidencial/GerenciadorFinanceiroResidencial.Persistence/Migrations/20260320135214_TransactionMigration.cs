using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace GerenciadorFinanceiroResidencial.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class TransactionMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("c60109c8-9e21-4e32-8930-75d9e7d2b8a1"));

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("e0ec4138-9ff6-4dc7-baa8-d6c069bf34cf"));

            migrationBuilder.DeleteData(
                table: "Persons",
                keyColumn: "Id",
                keyValue: new Guid("cd539e90-9e8c-4002-a005-f1d0adbbc2df"));

            migrationBuilder.DeleteData(
                table: "Persons",
                keyColumn: "Id",
                keyValue: new Guid("daaafb00-298e-43db-b67e-592314389e82"));

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "Categories",
                type: "character varying(400)",
                maxLength: 400,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.CreateTable(
                name: "Transactions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Description = table.Column<string>(type: "character varying(400)", maxLength: 400, nullable: false),
                    Amount = table.Column<decimal>(type: "numeric", nullable: false),
                    TransactionType = table.Column<int>(type: "integer", nullable: false),
                    CategoryId = table.Column<Guid>(type: "uuid", nullable: false),
                    PersonId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Transactions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Transactions_Categories_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "Categories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Transactions_Persons_PersonId",
                        column: x => x.PersonId,
                        principalTable: "Persons",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.InsertData(
                table: "Categories",
                columns: new[] { "Id", "Description", "Purpose" },
                values: new object[,]
                {
                    { new Guid("3f75cf24-63a9-4f40-b6d7-5ec3fbb4fd63"), "Salário", 1 },
                    { new Guid("c0f3fd7a-f3a7-45aa-a6f1-94f690772f15"), "Aluguel", 2 }
                });

            migrationBuilder.InsertData(
                table: "Persons",
                columns: new[] { "Id", "Age", "Name" },
                values: new object[,]
                {
                    { new Guid("0ce7f8c7-1ad7-4f70-a170-a2dd111f0c77"), 21, "Jane Doe" },
                    { new Guid("d5f0f16c-5b4e-4902-a98f-c7df1db6f2d1"), 20, "John Doe" }
                });

            migrationBuilder.InsertData(
                table: "Transactions",
                columns: new[] { "Id", "Amount", "CategoryId", "Description", "PersonId", "TransactionType" },
                values: new object[,]
                {
                    { new Guid("275fa615-6416-4b78-9c43-00c555287587"), 3000m, new Guid("c0f3fd7a-f3a7-45aa-a6f1-94f690772f15"), "Aluguel de Junho", new Guid("0ce7f8c7-1ad7-4f70-a170-a2dd111f0c77"), 2 },
                    { new Guid("711bb67e-ae84-4c6f-816d-52b14978dcd1"), 5000m, new Guid("3f75cf24-63a9-4f40-b6d7-5ec3fbb4fd63"), "Salário de Junho", new Guid("d5f0f16c-5b4e-4902-a98f-c7df1db6f2d1"), 1 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Transactions_CategoryId",
                table: "Transactions",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_Transactions_PersonId",
                table: "Transactions",
                column: "PersonId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Transactions");

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("3f75cf24-63a9-4f40-b6d7-5ec3fbb4fd63"));

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("c0f3fd7a-f3a7-45aa-a6f1-94f690772f15"));

            migrationBuilder.DeleteData(
                table: "Persons",
                keyColumn: "Id",
                keyValue: new Guid("0ce7f8c7-1ad7-4f70-a170-a2dd111f0c77"));

            migrationBuilder.DeleteData(
                table: "Persons",
                keyColumn: "Id",
                keyValue: new Guid("d5f0f16c-5b4e-4902-a98f-c7df1db6f2d1"));

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "Categories",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(400)",
                oldMaxLength: 400);

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
    }
}
