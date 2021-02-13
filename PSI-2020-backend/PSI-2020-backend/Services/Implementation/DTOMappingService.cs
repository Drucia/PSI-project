using PSI_2020_backend.Models.Database;
using PSI_2020_backend.Models.DTO;
using PSI_2020_backend.Services.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PSI_2020_backend.Services.Implementation
{
    public class DTOMappingService : IDTOMappingService
    {
        public Specialization MapToSpecialization(SpecializationDTO specializationDTO)
        {
            return new Specialization()
            {
                Name = specializationDTO.Name,
                EngName = specializationDTO.EngName,
                ShortName = specializationDTO.ShortName
            };
        }

        public Field MapToField(FieldDTO fieldDTO)
        {
            return new Field()
            {
                Name = fieldDTO.Name,
                EngName = fieldDTO.EngName,
                ShortName = fieldDTO.ShortName,
                Specializations = fieldDTO.Specializations?.Select(spec => MapToSpecialization(spec)).ToList()
            };
        }

        public Course MapToCourse(CourseDTO courseDTO)
        {
            return new Course()
            {
                Name = courseDTO.Name,
                EngName = courseDTO.Name,
                Semester = courseDTO.Semester,
                SumHoursForExercises = courseDTO.SumHoursForExercises,
                SumHoursForLaboratories = courseDTO.SumHoursForLaboratories,
                SumHoursForLectures = courseDTO.SumHoursForLectures,
                SumHoursForProjects = courseDTO.SumHoursForProjects,
                SumHoursForSeminaries = courseDTO.SumHoursForSeminaries,
                SubjectCard = courseDTO.SubjectCard != null ? MapToSubjectCard(courseDTO.SubjectCard) : null
            };
        }

        public SubjectCard MapToSubjectCard(SubjectCardDTO subjectCardDTO)
        {
            return new SubjectCard()
            {
                Aims = subjectCardDTO.Aims,
                AimsEng = subjectCardDTO.AimsEng,
                Bibliography = subjectCardDTO.Bibliography,
                BibliographyEng = subjectCardDTO.BibliographyEng,
                IsDone = subjectCardDTO.IsDone,
                Number = subjectCardDTO.Number,
                Prerequisites = subjectCardDTO.Prerequisites,
                PrerequisitesEng = subjectCardDTO.PrerequisitesEng,
                Tools = subjectCardDTO.Tools,
                ToolsEng = subjectCardDTO.ToolsEng,
                Professors = subjectCardDTO.Professors,
                Exercises = subjectCardDTO.Exercises?.Select(ex => MapToProgram(ex)).ToList(),
                Laboratories = subjectCardDTO.Laboratories?.Select(ex => MapToProgram(ex)).ToList(),
                Lectures = subjectCardDTO.Lectures?.Select(ex => MapToProgram(ex)).ToList(),
                Projects = subjectCardDTO.Projects?.Select(ex => MapToProgram(ex)).ToList(),
                Seminaries = subjectCardDTO.Seminaries?.Select(ex => MapToProgram(ex)).ToList(),
                LearningEffects = subjectCardDTO.LearningEffects?.Select(ex => MapToLearningEffect(ex)).ToList()
            };
        }

        public Models.Database.Program MapToProgram(ProgramDTO programDTO)
        {
            return new Models.Database.Program()
            {
                EngSubject = programDTO.EngSubject,
                Hours = programDTO.Hours,
                Subject = programDTO.Subject
            };
        }

        public LearningEffect MapToLearningEffect(LearningEffectDTO learningEffectDTO)
        {
            return new LearningEffect()
            {
                Category = learningEffectDTO.Category,
                Description = learningEffectDTO.Description,
                DescriptionEng = learningEffectDTO.DescriptionEng,
                Code = learningEffectDTO.Code
            };
        }
    }
}
