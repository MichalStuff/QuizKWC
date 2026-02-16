using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class SeederRepair : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Answers_BaseQuestions_BaseQuestionId",
                table: "Answers");

            migrationBuilder.DropForeignKey(
                name: "FK_Answers_SpecialQuestions_SpecialQuestionId",
                table: "Answers");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Answers",
                table: "Answers");

            migrationBuilder.DropIndex(
                name: "IX_Answers_BaseQuestionId",
                table: "Answers");

            migrationBuilder.DropColumn(
                name: "BaseQuestionId",
                table: "Answers");

            migrationBuilder.DropColumn(
                name: "Discriminator",
                table: "Answers");

            migrationBuilder.RenameTable(
                name: "Answers",
                newName: "SpecialAnswers");

            migrationBuilder.RenameIndex(
                name: "IX_Answers_SpecialQuestionId",
                table: "SpecialAnswers",
                newName: "IX_SpecialAnswers_SpecialQuestionId");

            migrationBuilder.AlterColumn<int>(
                name: "SpecialQuestionId",
                table: "SpecialAnswers",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "AnswerIndex",
                table: "SpecialAnswers",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddPrimaryKey(
                name: "PK_SpecialAnswers",
                table: "SpecialAnswers",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "BaseAnswers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    BaseQuestionId = table.Column<int>(type: "integer", nullable: false),
                    AnswerIndex = table.Column<int>(type: "integer", nullable: false),
                    Content = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BaseAnswers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BaseAnswers_BaseQuestions_BaseQuestionId",
                        column: x => x.BaseQuestionId,
                        principalTable: "BaseQuestions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_BaseAnswers_BaseQuestionId",
                table: "BaseAnswers",
                column: "BaseQuestionId");

            migrationBuilder.AddForeignKey(
                name: "FK_SpecialAnswers_SpecialQuestions_SpecialQuestionId",
                table: "SpecialAnswers",
                column: "SpecialQuestionId",
                principalTable: "SpecialQuestions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SpecialAnswers_SpecialQuestions_SpecialQuestionId",
                table: "SpecialAnswers");

            migrationBuilder.DropTable(
                name: "BaseAnswers");

            migrationBuilder.DropPrimaryKey(
                name: "PK_SpecialAnswers",
                table: "SpecialAnswers");

            migrationBuilder.DropColumn(
                name: "AnswerIndex",
                table: "SpecialAnswers");

            migrationBuilder.RenameTable(
                name: "SpecialAnswers",
                newName: "Answers");

            migrationBuilder.RenameIndex(
                name: "IX_SpecialAnswers_SpecialQuestionId",
                table: "Answers",
                newName: "IX_Answers_SpecialQuestionId");

            migrationBuilder.AlterColumn<int>(
                name: "SpecialQuestionId",
                table: "Answers",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AddColumn<int>(
                name: "BaseQuestionId",
                table: "Answers",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Discriminator",
                table: "Answers",
                type: "character varying(13)",
                maxLength: 13,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Answers",
                table: "Answers",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_Answers_BaseQuestionId",
                table: "Answers",
                column: "BaseQuestionId");

            migrationBuilder.AddForeignKey(
                name: "FK_Answers_BaseQuestions_BaseQuestionId",
                table: "Answers",
                column: "BaseQuestionId",
                principalTable: "BaseQuestions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Answers_SpecialQuestions_SpecialQuestionId",
                table: "Answers",
                column: "SpecialQuestionId",
                principalTable: "SpecialQuestions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
