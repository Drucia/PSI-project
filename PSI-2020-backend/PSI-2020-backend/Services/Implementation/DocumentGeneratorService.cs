using ClosedXML.Excel;
using PSI_2020_backend.Models.Database;
using PSI_2020_backend.Services.Interface;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace PSI_2020_backend.Services.Implementation
{
    public class DocumentGeneratorService : IDocumentGeneratorService
    {
        public async Task<byte[]> GenerateSubjectCard(Course course)
        {
            using (var workbook = new XLWorkbook())
            {
                var subjectCard = course.SubjectCard;

                var worksheet = workbook.Worksheets.Add("Karta przedmiotu");
                var currentRow = 1;
                worksheet.Cell(currentRow, 1).Value = "Karta przedmiotu";

                currentRow++;
                worksheet.Cell(currentRow, 1).Value = "Nazwa w języku polskim";
                worksheet.Cell(currentRow, 2).Value = course.Name;

                currentRow++;
                worksheet.Cell(currentRow, 1).Value = "Nazwa w języku angielskim";
                worksheet.Cell(currentRow, 2).Value = course.EngName;

                currentRow++;
                worksheet.Cell(currentRow, 1).Value = "Semestr";
                worksheet.Cell(currentRow, 2).Value = course.Semester;

                currentRow++;
                currentRow++;
                worksheet.Cell(currentRow, 2).Value = "Wykład";
                worksheet.Cell(currentRow, 3).Value = "Ćwiczenia";
                worksheet.Cell(currentRow, 4).Value = "Laboratorium";
                worksheet.Cell(currentRow, 5).Value = "Projekt";
                worksheet.Cell(currentRow, 6).Value = "Seminarium";

                currentRow++;
                worksheet.Cell(currentRow, 1).Value = "Liczba godzin zajęć zorganizowanych w Uczelni (ZZU)";
                worksheet.Cell(currentRow, 2).Value = course.SumHoursForLectures;
                worksheet.Cell(currentRow, 3).Value = course.SumHoursForExercises;
                worksheet.Cell(currentRow, 4).Value = course.SumHoursForLaboratories;
                worksheet.Cell(currentRow, 5).Value = course.SumHoursForProjects;
                worksheet.Cell(currentRow, 6).Value = course.SumHoursForSeminaries;

                if (subjectCard != null)
                {
                    currentRow++;
                    currentRow++;
                    worksheet.Cell(currentRow, 1).Value = "Wymagania wstępne w zakresie wiedzy, umiejętności i innych kompetencji";
                    worksheet.Cell(currentRow, 2).Value = subjectCard.Prerequisites;
                    currentRow++;
                    worksheet.Cell(currentRow, 1).Value = "Wymagania wstępne w zakresie wiedzy, umiejętności i innych kompetencji (eng)";
                    worksheet.Cell(currentRow, 2).Value = subjectCard.PrerequisitesEng;

                    currentRow++;
                    currentRow++;
                    worksheet.Cell(currentRow, 1).Value = "Cele przedmiotu";
                    worksheet.Cell(currentRow, 2).Value = subjectCard.Aims;
                    currentRow++;
                    worksheet.Cell(currentRow, 1).Value = "Cele przedmiotu (eng)";
                    worksheet.Cell(currentRow, 2).Value = subjectCard.AimsEng;

                    if (subjectCard.LearningEffects != null)
                    {
                        currentRow++;
                        currentRow++;
                        worksheet.Cell(currentRow, 1).Value = "Przedmiotowe efekty kształcenia";
                        currentRow++;
                        worksheet.Cell(currentRow, 1).Value = "Kategoria";
                        worksheet.Cell(currentRow, 2).Value = "Opis";
                        foreach (var learningEffect in subjectCard.LearningEffects)
                        {
                            currentRow++;
                            worksheet.Cell(currentRow, 1).Value = learningEffect.Category.ToString();
                            worksheet.Cell(currentRow, 2).Value = learningEffect.Description;
                        }

                        currentRow++;
                        currentRow++;
                        worksheet.Cell(currentRow, 1).Value = "Przedmiotowe efekty kształcenia (eng)";
                        currentRow++;
                        worksheet.Cell(currentRow, 1).Value = "Category";
                        worksheet.Cell(currentRow, 2).Value = "Description";
                        foreach (var learningEffect in subjectCard.LearningEffects)
                        {
                            currentRow++;
                            worksheet.Cell(currentRow, 1).Value = learningEffect.Category.ToString();
                            worksheet.Cell(currentRow, 2).Value = learningEffect.DescriptionEng;
                        }
                    }

                    if (subjectCard.Lectures != null)
                    {
                        currentRow++;
                        currentRow++;
                        worksheet.Cell(currentRow, 1).Value = "Treści programowe";
                        currentRow++;
                        worksheet.Cell(currentRow, 1).Value = "Forma zajęć - wykład";
                        worksheet.Cell(currentRow, 3).Value = "Liczba godzin";
                        var sum = 0;
                        foreach (var program in subjectCard.Lectures)
                        {
                            currentRow++;
                            worksheet.Cell(currentRow, 1).Value = program.Subject;
                            worksheet.Cell(currentRow, 2).Value = program.EngSubject;
                            worksheet.Cell(currentRow, 3).Value = program.Hours;
                            sum += program.Hours;
                        }
                        currentRow++;
                        worksheet.Cell(currentRow, 2).Value = "Suma godzin";
                        worksheet.Cell(currentRow, 3).Value = sum;
                    }

                    if (subjectCard.Exercises != null)
                    {
                        currentRow++;
                        currentRow++;
                        worksheet.Cell(currentRow, 1).Value = "Treści programowe";
                        currentRow++;
                        worksheet.Cell(currentRow, 1).Value = "Forma zajęć - ćwiczenia";
                        worksheet.Cell(currentRow, 3).Value = "Liczba godzin";
                        var sum = 0;
                        foreach (var program in subjectCard.Exercises)
                        {
                            currentRow++;
                            worksheet.Cell(currentRow, 1).Value = program.Subject;
                            worksheet.Cell(currentRow, 2).Value = program.EngSubject;
                            worksheet.Cell(currentRow, 3).Value = program.Hours;
                            sum += program.Hours;
                        }
                        currentRow++;
                        worksheet.Cell(currentRow, 2).Value = "Suma godzin";
                        worksheet.Cell(currentRow, 3).Value = sum;
                    }

                    if (subjectCard.Laboratories != null)
                    {
                        currentRow++;
                        currentRow++;
                        worksheet.Cell(currentRow, 1).Value = "Treści programowe";
                        currentRow++;
                        worksheet.Cell(currentRow, 1).Value = "Forma zajęć - laboratorium";
                        worksheet.Cell(currentRow, 3).Value = "Liczba godzin";
                        var sum = 0;
                        foreach (var program in subjectCard.Laboratories)
                        {
                            currentRow++;
                            worksheet.Cell(currentRow, 1).Value = program.Subject;
                            worksheet.Cell(currentRow, 2).Value = program.EngSubject;
                            worksheet.Cell(currentRow, 3).Value = program.Hours;
                            sum += program.Hours;
                        }
                        currentRow++;
                        worksheet.Cell(currentRow, 2).Value = "Suma godzin";
                        worksheet.Cell(currentRow, 3).Value = sum;
                    }

                    if (subjectCard.Projects != null)
                    {
                        currentRow++;
                        currentRow++;
                        worksheet.Cell(currentRow, 1).Value = "Treści programowe";
                        currentRow++;
                        worksheet.Cell(currentRow, 1).Value = "Forma zajęć - projekt";
                        worksheet.Cell(currentRow, 3).Value = "Liczba godzin";
                        var sum = 0;
                        foreach (var program in subjectCard.Projects)
                        {
                            currentRow++;
                            worksheet.Cell(currentRow, 1).Value = program.Subject;
                            worksheet.Cell(currentRow, 2).Value = program.EngSubject;
                            worksheet.Cell(currentRow, 3).Value = program.Hours;
                            sum += program.Hours;
                        }
                        currentRow++;
                        worksheet.Cell(currentRow, 2).Value = "Suma godzin";
                        worksheet.Cell(currentRow, 3).Value = sum;
                    }

                    if (subjectCard.Seminaries != null)
                    {
                        currentRow++;
                        currentRow++;
                        worksheet.Cell(currentRow, 1).Value = "Treści programowe";
                        currentRow++;
                        worksheet.Cell(currentRow, 1).Value = "Forma zajęć - seminarium";
                        worksheet.Cell(currentRow, 3).Value = "Liczba godzin";
                        var sum = 0;
                        foreach (var program in subjectCard.Seminaries)
                        {
                            currentRow++;
                            worksheet.Cell(currentRow, 1).Value = program.Subject;
                            worksheet.Cell(currentRow, 2).Value = program.EngSubject;
                            worksheet.Cell(currentRow, 3).Value = program.Hours;
                            sum += program.Hours;
                        }
                        currentRow++;
                        worksheet.Cell(currentRow, 2).Value = "Suma godzin";
                        worksheet.Cell(currentRow, 3).Value = sum;
                    }

                    currentRow++;
                    currentRow++;
                    worksheet.Cell(currentRow, 1).Value = "Stosowane narzędzia dydaktyczne";
                    worksheet.Cell(currentRow, 2).Value = subjectCard.Tools;
                    currentRow++;
                    worksheet.Cell(currentRow, 1).Value = "Stosowane narzędzia dydaktyczne (eng)";
                    worksheet.Cell(currentRow, 2).Value = subjectCard.ToolsEng;

                    currentRow++;
                    currentRow++;
                    worksheet.Cell(currentRow, 1).Value = "Literatura";
                    worksheet.Cell(currentRow, 2).Value = subjectCard.Bibliography;
                    currentRow++;
                    worksheet.Cell(currentRow, 1).Value = "Literatura (eng)";
                    worksheet.Cell(currentRow, 2).Value = subjectCard.BibliographyEng;
                }

                using (var stream = new MemoryStream())
                {
                    workbook.SaveAs(stream);
                    var content = stream.ToArray();

                    return content;
                }
            }
        }
    }
}
