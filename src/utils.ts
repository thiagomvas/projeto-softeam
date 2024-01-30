import UserDTO from "./DTOs/UserDTO";


export function mapResponseToUserDTO (responseData: any): UserDTO {
    return {
      id: responseData.id,
      name: responseData.name,
      password: responseData.password,
      email: responseData.email,
      role: responseData.role,
      phonenumber: responseData.phonenumber,
      address: responseData.address,
    };
  };

  export default mapResponseToUserDTO;