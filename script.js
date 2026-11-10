
const studentForm = document.getElementById("studentForm");
const studentName = document.getElementById("studentName");
const studentCourse = document.getElementById("studentCourse");
const studentMarks = document.getElementById("studentMarks");
const studentList = document.getElementById("studentList");
const totalCount = document.getElementById("totalCount");
const searchInput = document.getElementById("searchInput");
const filterCourse = document.getElementById("filterCourse");
const emptyMessage = document.getElementById("emptyMessage");
const submitButton = document.getElementById("submitButton");

let students = JSON.parse(localStorage.getItem("students")) || [];
let editId = null;

function saveStudents() {
  localStorage.setItem("students", JSON.stringify(students));
}

function displayStudents() {
  studentList.innerHTML = "";

  const searchValue = searchInput.value.toLowerCase();
  const courseValue = filterCourse.value;

  const filteredStudents = students.filter((student) => {
    const matchesName = student.name.toLowerCase().includes(searchValue);
    const matchesCourse =
      courseValue === "All" || student.course === courseValue;

    return matchesName && matchesCourse;
  });

  filteredStudents.forEach((student) => {
    const studentCard = document.createElement("div");
    studentCard.className = "student-card";

    studentCard.innerHTML = `
      <div>
        <h3>${student.name}</h3>
        <p>Course: ${student.course}</p>
        <p>Marks: ${student.marks}/100</p>
      </div>

      <div class="actions">
        <button class="edit-btn" onclick="editStudent(${student.id})">
          Edit
        </button>

        <button class="delete-btn" onclick="deleteStudent(${student.id})">
          Delete
        </button>
      </div>
    `;

    studentList.appendChild(studentCard);
  });

  totalCount.textContent = students.length;

  emptyMessage.style.display =
    filteredStudents.length === 0 ? "block" : "none";
}

studentForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = studentName.value.trim();
  const course = studentCourse.value;
  const marks = Number(studentMarks.value);

  if (name === "" || course === "" || marks < 0 || marks > 100) {
    alert("Please enter valid student details.");
    return;
  }

  if (editId === null) {
    const newStudent = {
      id: Date.now(),
      name: name,
      course: course,
      marks: marks
    };

    students.push(newStudent);
  } else {
    students = students.map((student) => {
      if (student.id === editId) {
        return {
          ...student,
          name: name,
          course: course,
          marks: marks
        };
      }

      return student;
    });

    editId = null;
    submitButton.textContent = "Add Student";
  }

  saveStudents();
  displayStudents();
  studentForm.reset();
});

function editStudent(id) {
  const student = students.find((item) => item.id === id);

  if (student) {
    studentName.value = student.name;
    studentCourse.value = student.course;
    studentMarks.value = student.marks;

    editId = id;
    submitButton.textContent = "Update Student";
  }
}

function deleteStudent(id) {
  const confirmDelete = confirm("Are you sure you want to delete this student?");

  if (confirmDelete) {
    students = students.filter((student) => student.id !== id);

    saveStudents();
    displayStudents();
  }
}

searchInput.addEventListener("input", displayStudents);
filterCourse.addEventListener("change", displayStudents);

// Initial display
displayStudents();
