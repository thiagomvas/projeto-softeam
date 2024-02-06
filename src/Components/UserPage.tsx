import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import UserDTO from "../DTOs/UserDTO";

import "../Styles/UserPage.css";
import { mapResponseToClassDTO, mapResponseToDisciplineDTO, mapResponseToUserDTO } from "../utils";
import ClassDTO from "../DTOs/ClassDTO";
import DisciplineDTO from "../DTOs/DisciplineDTO";

const UserPage: React.FC = () => {
  const location = useLocation();
  const [userDTO, setUserDTO] = useState<UserDTO | null>(null);
  const [enrollments, setEnrollments] = useState<ClassDTO[]>([]);
  const [disciplines, setDisciplines] = useState<DisciplineDTO[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/data/users`,
          { headers: { Authorization: `${location.state.token}` } }
        );
        const responseData = response.data;
        const mappedUserDTO: UserDTO = mapResponseToUserDTO(responseData);

        setUserDTO(mappedUserDTO);

        const enrollmentsResponse = await axios.get(
          `http://localhost:3001/api/data/userenrollments/${mappedUserDTO.id}`
        );
        const enrollmentsData = enrollmentsResponse.data;
        
        const mappedEnrollments = enrollmentsData.map((enrollment: any) => mapResponseToClassDTO(enrollment));


        const fetchDisciplines = mappedEnrollments.map(async (enrollment: { disciplineId: any; }) => {
          const disciplineResponse = await axios.get(
            `http://localhost:3001/api/data/discipline/${enrollment.disciplineId}`
          );
          const disciplineData = disciplineResponse.data;
          return mapResponseToDisciplineDTO(disciplineData);
        });
  
        const loadedDisciplines = await Promise.all(fetchDisciplines);
        setDisciplines(loadedDisciplines);
        setEnrollments(mappedEnrollments);

      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, [location.state.userId]);

  return (
    <div>
      {userDTO ? (
        <>
          <h1>Olá, {userDTO.fullname}!</h1>

          <h2>Suas Turmas:</h2>
          <div>
            {enrollments.map((enrollment, index) => (
              <div className="class-display" key={index}>
                <p>{enrollment.disciplineId} | {disciplines[index].name}</p>
                <p>{enrollment.roomNumber} | {enrollment.classTimes}</p>
                </div>
            ))}
          </div>
        </>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};

export default UserPage;
