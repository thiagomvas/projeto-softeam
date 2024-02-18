import React, { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";
import { mapResponseToClassDTO, mapResponseToDisciplineDTO, mapResponseToUserDTO } from "./utils";
import ClassDTO from "./DTOs/ClassDTO";
import DisciplineDTO from "./DTOs/DisciplineDTO";
import UserDTO from './DTOs/UserDTO';
import axios from 'axios';
import './turmaPage.css';

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

        const fetchDisciplineData = mappedDisciplines.map(async (discipline) => {
          fetchProfessor(discipline.id);

          console.log('buscando classes');
          const classesResponse = await axios.get(`http://localhost:3001/api/data/classDiscilpine/${discipline.id}`);
          const classesData = classesResponse.data;
          console.log(`Classes para disciplina ${discipline.id}:`, classesData);

          if (Array.isArray(classesData)) {
            const mappedClasses: ClassDTO[] = classesData.map((classData: any) =>
              mapResponseToClassDTO(classData)
            );

            setClassesByDiscipline(prevState => ({
              ...prevState,
              [discipline.id]: mappedClasses
            }));

            console.log("buscando participantes");
            const participantsResponse = await axios.get(`http://localhost:3001/api/data/participant/${discipline.id}`);
            const participantsData = participantsResponse.data;
            console.log(`Participantes para classe ${discipline.id}:`, participantsData);

            const mappedParticipants: UserDTO[] = participantsData.map((participantData: any) =>
              mapResponseToUserDTO(participantData)
            );

            setParticipantsByClass(prevState => ({
              ...prevState,
              [discipline.id]: mappedParticipants
            }));
          } else {
            console.error("Erro: classesData não é um array.");
          }
        });

        await Promise.all(fetchDisciplineData);
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
  }, [location]);

  return (
    <div>
      {disciplines.map((discipline) => {
        if (discipline.id === location.state.disciplineId) {
          return (
            <div key={discipline.id}>
              <h1 id='h1-primeiro'>Turma de {discipline.name}</h1>
              <div>
                {classesByDiscipline[discipline.id]?.map((classItem) => (
                  <div key={classItem.id}>
                    <p>Professor: {professorName}</p>
                    <p>Horário: {classItem.classTimes}</p>
                    <p>Sala: {classItem.roomNumber}</p>
                    <p>Departamento: {discipline.department}</p>
                  </div>
                ))}
              </div>
              <h1 id='h1-segundo'>Participantes</h1>
              <table>
                <thead>
                  <tr>
                    <th>Id</th>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>Numero</th>
                  </tr>
                </thead>
                <tbody>
                  {participantsByClass[discipline.id]?.map((participant) => (
                    <tr key={participant.id}>
                      <td>{participant.id}</td>
                      <td>{participant.fullname}</td>
                      <td>{participant.email}</td>
                      <td>{participant.phonenumber}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        } else {
          return null;
        }
      })}
    </div>
  );
};

export default TurmasComponent;
