using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CloudService.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddUniqueIndexesForCustomerServiceAndReview : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Create unique index on CustomerService.OrderId to prevent duplicate services for the same order
            migrationBuilder.CreateIndex(
                name: "IX_CustomerServices_OrderId",
                table: "CustomerServices",
                column: "OrderId",
                unique: true);

            // Create filtered unique index on CustomerReview.OrderId to prevent duplicate reviews for the same order
            // Only applies when OrderId is not null (allowing reviews without orders)
            migrationBuilder.CreateIndex(
                name: "IX_CustomerReviews_OrderId",
                table: "CustomerReviews",
                column: "OrderId",
                unique: true,
                filter: "[OrderId] IS NOT NULL");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_CustomerReviews_OrderId",
                table: "CustomerReviews");

            migrationBuilder.DropIndex(
                name: "IX_CustomerServices_OrderId",
                table: "CustomerServices");
        }
    }
}
