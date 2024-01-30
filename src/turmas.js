const sqlite3 = require('sqlite3').verbose();
            const db = new sqlite3.Database('src/database.db');

            const tableBody = document.getElementById("turmaBody");

            const query = 'SELECT * FROM classes INNER JOIN user_classes ON classes.id = user_classes.classid INNER JOIN users ON users.id = user_classes.userId WHERE users.username = "thiago"';

            db.all(query, [], (err, rows) => {
                if (err) {
                    throw err;
                }

                rows.forEach((row) => {
                    const newrow = tableBody.insertRow();

                    const columns = ["id", "componente", "professor", "horario", "local"];

                    columns.forEach((column) => {
                        const cell = newrow.insertCell();
                        if (column === "professor") {
                            const professorId = row[column];
                            const professorQuery = 'SELECT name FROM professors WHERE id = ?';

                            db.get(professorQuery, [professorId], (err, professorRow) => {
                                if (err) {
                                    throw err;
                                }

                                cell.textContent = professorRow ? professorRow.name : 'N/A';
                            });
                        } else {
                            cell.textContent = row[column];
                        }
                    });
                });
            });