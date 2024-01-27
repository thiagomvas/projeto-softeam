import ClassDTO from "../DTOs/ClassDTO";

interface MyClassComponentProps {
    classDto: ClassDTO;
  }
  
  const ClassItemDisplay: React.FC<MyClassComponentProps> = ({ classDto }) => {
    return (
      <div>
        {classDto.id} - {classDto.name}
      </div>
    );
  };

  export default ClassItemDisplay;