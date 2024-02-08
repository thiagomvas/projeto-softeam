// utils.ts

import ClassDTO from "./DTOs/ClassDTO";
import DisciplineDTO from "./DTOs/DisciplineDTO";
import UserDTO from "./DTOs/UserDTO";

export function mapResponseToUserDTO(responseData: any): UserDTO {
  const userDTO: UserDTO = {
    id: responseData.id,
    fullname: responseData.fullname,
    email: responseData.email,
    password: responseData.password,
    phonenumber: responseData.phonenumber,
    address: responseData.address,
    role: responseData.role,
  };
  return userDTO;
}

export function mapResponseToClassDTO(responseData: any): ClassDTO {
  const classDTO: ClassDTO = {
    id: responseData.id,
    disciplineId: responseData.disciplineId,
    professorId: responseData.professorId,
    classTimes: responseData.classtimes,
    roomNumber: responseData.roomNumber
  };
  return classDTO;
}

export function mapResponseToDisciplineDTO(responseData: any): DisciplineDTO {
  const disciplineDTO: DisciplineDTO = {
    id: responseData.id,
    name: responseData.name,
    description: responseData.description,
    department: responseData.department,
  };
  return disciplineDTO;
}
