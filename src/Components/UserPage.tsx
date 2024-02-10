import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import UserDTO from "../DTOs/UserDTO";

import "../Styles/UserPage.css";
import {
  mapResponseToClassDTO,
  mapResponseToDisciplineDTO,
  mapResponseToUserDTO,
} from "../utils";
import ClassDTO from "../DTOs/ClassDTO";
import DisciplineDTO from "../DTOs/DisciplineDTO";
import ClassDisplayComponent from "./ClassDisplayComponent";
import SettingsComponent from "./UserSettingsComponent";
import ActionButton from "./ActionButton";

const UserPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userDTO, setUserDTO] = useState<UserDTO | null>(null);
  const [enrollments, setEnrollments] = useState<ClassDTO[]>([]);
  const [disciplines, setDisciplines] = useState<DisciplineDTO[]>([]);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [expandedTab, setExpandedTab] = useState<number>(0);

  const toggleCollapse = (index: number) => {
    setExpandedIndex((prevIndex) => (prevIndex === index ? null : index));
  };

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

        const mappedEnrollments = enrollmentsData.map((enrollment: any) =>
          mapResponseToClassDTO(enrollment)
        );

        const fetchDisciplines = mappedEnrollments.map(
          async (enrollment: { disciplineId: any }) => {
            const disciplineResponse = await axios.get(
              `http://localhost:3001/api/data/discipline/${enrollment.disciplineId}`
            );
            const disciplineData = disciplineResponse.data;
            return mapResponseToDisciplineDTO(disciplineData);
          }
        );

        const loadedDisciplines = await Promise.all(fetchDisciplines);
        setDisciplines(loadedDisciplines);
        setEnrollments(mappedEnrollments);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
      console.log(expandedTab);
    };

    fetchData();
  }, [location.state.userId]);

  return (
    <div>
      {userDTO ? (
        <>
          <h1>Olá, {userDTO.fullname}!</h1>

          <div className="tab-buttons">
            <ActionButton onClick={() => setExpandedTab(0)}>
              Turmas
            </ActionButton>
            <ActionButton onClick={() => setExpandedTab(1)}>
              Configurações
            </ActionButton>
          </div>

          <ClassDisplayComponent
            expandedTab={expandedTab}
            enrollments={enrollments}
            expandedIndex={expandedIndex}
            toggleCollapse={toggleCollapse}
            disciplines={disciplines}
            navigate={navigate}
          />
          <div className={`${expandedTab === 1 ? "" : "hidden"}`}>
            <SettingsComponent user={userDTO} onUpdateUser={() => {console.log("Hello world!!!!!!!1")}} />
          </div>
        </>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};

export default UserPage;
