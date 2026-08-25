using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

using Microsoft.EntityFrameworkCore.Infrastructure;

namespace CloudService.Infrastructure.Migrations
{
    [DbContext(typeof(Data.ApplicationDbContext))]
    [Migration("20260822103000_AddServiceCategoryDetailContent")]
    public partial class AddServiceCategoryDetailContent : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "DetailTitle",
                table: "ServiceCategories",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "FeaturesJson",
                table: "ServiceCategories",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "[]");

            migrationBuilder.AddColumn<string>(
                name: "Icon",
                table: "ServiceCategories",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "dns");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(name: "DetailTitle", table: "ServiceCategories");
            migrationBuilder.DropColumn(name: "FeaturesJson", table: "ServiceCategories");
            migrationBuilder.DropColumn(name: "Icon", table: "ServiceCategories");
        }
    }
}
