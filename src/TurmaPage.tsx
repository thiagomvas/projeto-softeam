//turmapage.tsx

import React, { useState, useEffect } from 'react';
import sqlite3 from 'sqlite3';

interface Turma {
  id: number;
  componente: string;
  professor: string;
  horario: string;
  local: string;
  nome: string;
}

const TurmasComponent: React.FC = () => {

  const [turmasData, setTurmasData] = useState<Turma[]>([]);


  useEffect(() => {
    const fetchDataFromDatabase = async () => {
      const db = new sqlite3.Database('src/database.db');

      const query = `
      SELECT classes.id, disciplines.name AS componente, users.fullname AS nome, 
      classes.classtimes AS horario, classes.RoomNumber AS local 
      FROM classes 
      INNER JOIN user_classes ON classes.id = user_classes.classid 
      INNER JOIN users ON users.id = user_classes.userId 
      INNER JOIN disciplines ON classes.disciplineId = disciplines.id 
      WHERE users.username = "thiago"
    `;

      const rows: unknown[] = await new Promise((resolve, reject) => {
        db.all(query, [], (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows);
        });
      });

      const typedRows: Turma[] = rows as Turma[];

      const newData = await Promise.all(
        typedRows.map(async (row) => {
          const professor = await getProfessorName(db, row.nome);
          return {
            id: row.id,
            componente: row.componente,
            professor: professor || 'N/A',
            horario: row.horario,
            local: row.local,
            nome: row.nome, 
          };
        })
      );

      setTurmasData(newData);
      db.close();
      
    };

    fetchDataFromDatabase();
  }, []);

  const getProfessorName = async (db: any, professorId: any): Promise<string | null> => {
    const professorQuery = 'SELECT name FROM professors WHERE id = ?';
    return new Promise((resolve, reject) => {
      db.get(professorQuery, [professorId], (err: any, professorRow: { name: string | null }) => {
        if (err) {
          reject(err);
        }
        resolve(professorRow ? professorRow.name : null);
      });
    });
  };

  return (
    <div>
      <h1>Turmas do Semestre</h1>
      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Componente Curricular</th>
            <th>Professor</th>
            <th>Horário</th>
            <th>Local</th>
          </tr>
        </thead>
        <tbody>
          {turmasData.map((turma) => (
            <tr key={turma.id}>
              <td>{turma.id}</td>
              <td>{turma.componente}</td>
              <td>{turma.professor}</td>
              <td>{turma.horario}</td>
              <td>{turma.local}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TurmasComponent;

