import React from 'react';
import DisciplineDTO from '../DTOs/DisciplineDTO';
import ClassEnrollmentDTO from '../DTOs/ClassEnrollmentDTO';
import ClassDTO from '../DTOs/ClassDTO';
import ActionButton from './ActionButton';

interface ClassDisplayProps {
  expandedTab: number;
  enrollments: ClassDTO[]; 
  expandedIndex: number | null;
  toggleCollapse: (index: number) => void;
  disciplines: DisciplineDTO[]; 
  navigate: (path: string) => void;
}

const ClassDisplayComponent: React.FC<ClassDisplayProps> = ({
  expandedTab,
  enrollments,
  expandedIndex,
  toggleCollapse,
  disciplines,
  navigate,
}) => {
  return (
    <div className={`${expandedTab === 0 ? "" : "hidden"}`}>
      <h2>Suas Turmas:</h2>
      {enrollments.map((enrollment, index) => (
        <div
          className={`class-display ${expandedIndex === index ? "expanded" : "collapsed"}`}
          key={index}
          onClick={() => toggleCollapse(index)}
        >
          <p>{disciplines[index].name}</p>
          {expandedIndex === index ? (
            <>
              <p>Sala: {enrollment.roomNumber}</p>
              <p>Horarios: {enrollment.classTimes}</p>
              <p>Turma: {enrollment.id}</p>
              <ActionButton
                onClick={() => navigate("/register")}
              >
                Mais detalhes
              </ActionButton>
            </>
          ) : (
            <p>
              {enrollment.roomNumber} | {enrollment.classTimes}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default ClassDisplayComponent;
