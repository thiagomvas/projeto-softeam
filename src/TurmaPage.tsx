import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useLocation } from "react-router-dom";
import { mapResponseToClassDTO, mapResponseToDisciplineDTO, mapResponseToUserDTO } from "./utils";
import ClassDTO from "./DTOs/ClassDTO";
import DisciplineDTO from "./DTOs/DisciplineDTO";
import UserDTO from './DTOs/UserDTO';

const TurmasComponent: React.FC = () => {
  const location = useLocation();
  const [classesByDiscipline, setClassesByDiscipline] = useState<{ [key: string]: ClassDTO[] }>({});
  const [participantsByClass, setParticipantsByClass] = useState<{ [key: string]: UserDTO[] }>({});
  const [disciplines, setDisciplines] = useState<DisciplineDTO[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const disciplinesResponse = await axios.get(
          `http://localhost:3001/api/data/disciplines`,
          { headers: { Authorization: `${location.state.token}` } }
        );
        const disciplinesData = disciplinesResponse.data;
        const mappedDisciplines: DisciplineDTO[] = disciplinesData.map((disciplineData: any) =>
          mapResponseToDisciplineDTO(disciplineData)
        );
  
        setDisciplines(mappedDisciplines);
  
        const fetchClassesAndParticipants = mappedDisciplines.map(async (discipline: DisciplineDTO) => {
          const classesResponse = await axios.get(
            `http://localhost:3001/api/data/classes/${discipline.id}`
          );
          const classesData = classesResponse.data;
          const mappedClasses: ClassDTO[] = classesData.map((classData: any) =>
            mapResponseToClassDTO(classData)
          );
  
          const fetchParticipantsByClass = mappedClasses.map(async (classItem: ClassDTO) => {
            const participantsResponse = await axios.get(
              `http://localhost:3001/api/data/participants/${classItem.id}`
            );
            const participantsData = participantsResponse.data;
            const mappedParticipants: UserDTO[] = participantsData.map((participantData: any) =>
              mapResponseToUserDTO(participantData)
            );
  
            return { [classItem.id]: mappedParticipants };
          });
  
          const loadedParticipantsByClass = await Promise.all(fetchParticipantsByClass);
          const mergedParticipantsByClass = Object.assign({}, ...loadedParticipantsByClass);
          setParticipantsByClass((prevParticipants) => ({
            ...prevParticipants,
            ...mergedParticipantsByClass
          }));
  
          return { [discipline.id]: mappedClasses };
        });
  
        const loadedClassesByDiscipline = await Promise.all(fetchClassesAndParticipants);
        const mergedClassesByDiscipline = Object.assign({}, ...loadedClassesByDiscipline);
        setClassesByDiscipline(mergedClassesByDiscipline);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, [location.state.token]);
  

  return (
    <div>
      {disciplines.map((discipline) => (
        <div key={discipline.id}>
          <h1>Turmas de {discipline.name}</h1>
          <div>
          {classesByDiscipline[discipline.id]?.map((classItem) => (
                <div key={classItem.id}>
                  <p>Id:{classItem.id}</p>
                  <p>Professor:{classItem.professorId}</p>
                  <p>Horário:{classItem.classTimes}</p>
                  <p>Sala:{classItem.roomNumber}</p>
                  <p>Departamento:{discipline.department}</p>
                </div>
              ))}
          </div>
          <h1>Participantes</h1>
          <table>
            <thead>
              <tr>
                <th>Id</th>
                <th>Nome</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {participantsByClass[discipline.id]?.map((participant) => (
                <tr key={participant.id}>
                  <td>{participant.id}</td>
                  <td>{participant.fullname}</td>
                  <td>{participant.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default TurmasComponent;
