using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CloudService.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdatePromotionServicePlans : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Promotions_ServicePlans_ServicePlanId",
                table: "Promotions");

            migrationBuilder.DropIndex(
                name: "IX_Promotions_ServicePlanId",
                table: "Promotions");

            migrationBuilder.DropColumn(
                name: "ServicePlanId",
                table: "Promotions");

            migrationBuilder.CreateTable(
                name: "PromotionServicePlans",
                columns: table => new
                {
                    PromotionsId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ServicePlansId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PromotionServicePlans", x => new { x.PromotionsId, x.ServicePlansId });
                    table.ForeignKey(
                        name: "FK_PromotionServicePlans_Promotions_PromotionsId",
                        column: x => x.PromotionsId,
                        principalTable: "Promotions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PromotionServicePlans_ServicePlans_ServicePlansId",
                        column: x => x.ServicePlansId,
                        principalTable: "ServicePlans",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PromotionServicePlans_ServicePlansId",
                table: "PromotionServicePlans",
                column: "ServicePlansId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PromotionServicePlans");

            migrationBuilder.AddColumn<Guid>(
                name: "ServicePlanId",
                table: "Promotions",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Promotions_ServicePlanId",
                table: "Promotions",
                column: "ServicePlanId");

            migrationBuilder.AddForeignKey(
                name: "FK_Promotions_ServicePlans_ServicePlanId",
                table: "Promotions",
                column: "ServicePlanId",
                principalTable: "ServicePlans",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
