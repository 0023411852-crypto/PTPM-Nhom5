using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

using Microsoft.EntityFrameworkCore.Infrastructure;

namespace CloudService.Infrastructure.Migrations
{
    [DbContext(typeof(Data.ApplicationDbContext))]
    [Migration("20260822100000_AddRequestedServiceToPartnerRequests")]
    public partial class AddRequestedServiceToPartnerRequests : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "RequestedService",
                table: "PartnerRequests",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RequestedService",
                table: "PartnerRequests");
        }
    }
}
