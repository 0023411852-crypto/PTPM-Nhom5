using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CloudService.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddThumbnailToArticle : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // migrationBuilder.AddColumn<string>(
            //     name: "ThumbnailUrl",
            //     table: "NewsArticles",
            //     type: "nvarchar(max)",
            //     nullable: false,
            //     defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ThumbnailUrl",
                table: "NewsArticles");
        }
    }
}
