import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import UserDTO from '../DTOs/UserDTO';


const UserPage: React.FC = () => {
  const location = useLocation();
  const [userDTO, setUserDTO] = useState<UserDTO | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Replace 'your-api-base-url' with the actual base URL of your API
        const response = await axios.get(`http://localhost:3001/api/data/users`, { headers: { Authorization: `${location.state.userId}` }});
        const responseData = response.data;
        console.log(responseData);

        // Map the response data to UserDTO
        const mappedUserDTO: UserDTO = {
          id: responseData.id,
          name: responseData.fullname,
          password: responseData.password,
          email: responseData.email,
          role: responseData.role,
          phonenumber: responseData.phonenumber,
          address: responseData.address,
        };

        // Set the UserDTO in the state
        setUserDTO(mappedUserDTO);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
  }, [location.state.userId]);

  return (
    <div>
      <h2>User Page</h2>
      {userDTO ? (
        <>
          <h3>User ID: {userDTO.id}</h3>
          <p>Name: {userDTO.name}</p>
          <p>Email: {userDTO.email}</p>
        </>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};

export default UserPage;
