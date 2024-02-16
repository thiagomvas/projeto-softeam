import React, { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";
import { mapResponseToClassDTO, mapResponseToDisciplineDTO, mapResponseToUserDTO } from "./utils";
import ClassDTO from "./DTOs/ClassDTO";
import DisciplineDTO from "./DTOs/DisciplineDTO";
import UserDTO from './DTOs/UserDTO';
import axios from 'axios';


const TurmasComponent: React.FC = () => {
  const location = useLocation();
  const [disciplines, setDisciplines] = useState<DisciplineDTO[]>([]);
  const [classesByDiscipline, setClassesByDiscipline] = useState<{ [key: string]: ClassDTO[] }>({});
  const [participantsByClass, setParticipantsByClass] = useState<{ [key: string]: UserDTO[] }>({});
  const [professorName, setProfessorName] = useState<string>("");


  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Buscando disciplinas...");
        const response = await axios.get(`http://localhost:3001/api/data/discipline`);
        const disciplinesData = response.data;
        console.log("Disciplinas recebidas:", disciplinesData);

        const mappedDisciplines: DisciplineDTO[] = disciplinesData.map((disciplineData: any) =>
          mapResponseToDisciplineDTO(disciplineData)
        );

        setDisciplines(mappedDisciplines);

        mappedDisciplines.forEach((discipline) => {
          fetchProfessor(discipline.id);
        });

        const fetchClassesAndParticipants = mappedDisciplines.map(async (discipline: DisciplineDTO) => {
          console.log('buscando classes');
          const classesResponse = await axios.get(`http://localhost:3001/api/data/classDiscilpine/${discipline.id}`);
          const classesData = classesResponse.data;
          console.log(`Classes para disciplina ${discipline.id}:`, classesData);

          // Verifique se classesData é um array antes de mapeá-lo
          if (Array.isArray(classesData)) {
            const mappedClasses: ClassDTO[] = classesData.map((classData: any) =>
              mapResponseToClassDTO(classData)
            );

            const fetchParticipantsbyDiscipline = mappedDisciplines.map(async (discipline: DisciplineDTO) => {
              console.log("buscando participantes");
              const participantsResponse = await axios.get(`http://localhost:3001/api/data/participant/${discipline.id}`);
              const participantsData = participantsResponse.data;
              console.log(`Participantes para classe ${discipline.id}:`, participantsData);

              const mappedParticipants: UserDTO[] = participantsData.map((participantData: any) =>
                mapResponseToUserDTO(participantData)
              );

              return { [discipline.id]: mappedParticipants };
            });

            const loadedParticipantsByClass = await Promise.all(fetchParticipantsbyDiscipline);
            const mergedParticipantsByClass = Object.assign({}, ...loadedParticipantsByClass);
            setParticipantsByClass((prevParticipants) => ({
              ...prevParticipants,
              ...mergedParticipantsByClass
            }));

            return { [discipline.id]: mappedClasses };
          } else {
            console.error("Erro: classesData não é um array.");
            return {};
          }
        });

        const loadedClassesByDiscipline = await Promise.all(fetchClassesAndParticipants);
        const mergedClassesByDiscipline = Object.assign({}, ...loadedClassesByDiscipline);
        setClassesByDiscipline(mergedClassesByDiscipline);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };


    const fetchProfessor = async (disciplineId: string) => {
      try {
        const response = await axios.get(`http://localhost:3001/api/data/professor/${disciplineId}`);
        const professorData = response.data;
        if (professorData && professorData.length > 0) {
          const { professor_name } = professorData[0]; 
          setProfessorName(professor_name);
        } else {
          console.error("Error fetching professor data: professor not found");
        }
      } catch (error) {
        console.error("Error fetching professor data:", error);
      }
    };


    fetchData();
    fetchProfessor("disciplineId");
  }, [location]); 
  
  return (
    <div>
      {disciplines.map((discipline) => (
        <div key={discipline.id }>
          <h1>Turma de {discipline.name}</h1>
          <div>
            {classesByDiscipline[discipline.id]?.map((classItem) => (
              <div key={classItem.id}>
                <p>Professor: {professorName}</p>
                <p>Horário:{ classItem.classTimes}</p>
                <p>Sala: {classItem.roomNumber}</p>
                <p>Departamento: {discipline.department}</p>
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