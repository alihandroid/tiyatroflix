using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TiyatroFlix.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RemoveDirectorColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Director",
                table: "Plays");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Director",
                table: "Plays",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }
    }
}
