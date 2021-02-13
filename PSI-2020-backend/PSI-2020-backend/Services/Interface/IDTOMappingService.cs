using PSI_2020_backend.Models.Database;
using PSI_2020_backend.Models.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PSI_2020_backend.Services.Interface
{
    public interface IDTOMappingService
    {
        Specialization MapToSpecialization(SpecializationDTO specializationDTO);
        Field MapToField(FieldDTO fieldDTO);
        Course MapToCourse(CourseDTO courseDTO);
        SubjectCard MapToSubjectCard(SubjectCardDTO subjectCardDTO);
        Models.Database.Program MapToProgram(ProgramDTO programDTO);
        LearningEffect MapToLearningEffect(LearningEffectDTO learningEffectDTO);
    }
}
