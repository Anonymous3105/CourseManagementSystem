class Course {
    constructor(id, name) {
        this.id = id
        this.name = name
        this._active_status = false
        this.student_list = []

        if (typeof this.count == "undefined") {
            this.count = 0
        } else {
            this.count += 1
        }
    }

    activateCourse() {
        if (this.student_list.length < 5) {
            throw new Error("Less than 5 students registered for course. Cannot Activate.")
        } else {
            this._active_status = true
        }
    }

    deactivateCourse() {
        this._active_status = false
    }

    addStudent(id) {
        if (this._active_status == false) {
            if (id in this.student_list) {
                throw new Error("Student already enrolled in course")
            } else {
                this.student_list.push(id)
            }
        } else {
            throw new Error("Student not added. Course is already active.")
        }
    }

    removeStudent(id) {
        if (this._active_status = false) {
            if (id in this.student_list) {
                this.student_list.pop(id)
            } else {
                throw new Error("Student not registered to course.")
            }
        } else {
            throw new Error("Course is active. Cannot remove.")
        }
    }
}

class Student {
    constructor(id, fname, lname) {
        this.id = id
        this.fname = fname
        this.lname = lname
        this.course_list = []

        if (typeof this.count == "undefined") {
            this.count = 0
        } else {
            this.count += 1
        }
    }

    addCourse(id) {
        if (id in this.course_list) {
            throw new Error("Course Already Enrolled")
        } else {
            this.course_list.push(id)
        }
    }

    removeCourse(id) {
        if (id in this.course_list) {
            this.course_list.pop(id)
            throw new Error("Course " + id + "removed.")
        } else {
            throw new Error("Not enrolled in course.")
        }
    }
}

class Mapper {
    constructor() {
        this.courses = [
            new Course(1001, "Physics"),
            new Course(1002, "Chemistry"),
            new Course(1003, "Maths")
        ]
        this.students = [
            new Student(3001, "John", "Doe"),
            new Student(3002, "Jane", "Doe"),
            new Student(3003, "Ram", "Verma")
        ]
    }

    isCoursePresent(id) {
        return this.courses.some((value) => {
            return(value.id == id)
        });
    }

    isStudentPresent(id) {
        return this.students.some((value) => {
            return(value.id == id)
        });
    }

    getCourse(id){
        if (this.isCoursePresent(id)) {
            return (this.courses.filter((value) => {
                return(value.id == id)
            })[0])
        } else {
            throw new Error("Course doesn't exist")
        }
    }

    getStudent(id){
        if (this.isStudentPresent(id)) {
            return (this.students.filter((value) => {
                return(value.id == id)
            })[0])
        } else {
            throw new Error("Student doesn't exist")
        }
    }

    addNewCourse(course) {
        if (this.isCoursePresent(course.id)) {
            throw new Error("Course already exists.")
        } else {
            this.courses.push(new Course(course.id, course.name))
        }
    }

    deleteExistingCourse(id) {
        if (this.isCoursePresent(id)) {
            let changedStuds = []
            for (let i = 0; i < this.students.length; i++) {
                const stud = this.students[i];
                if (id in stud.course_list) {
                    stud.course_list.pop(id)
                    changedStuds.push(stud.id)
                }
            }
            this.courses = this.courses.filter((value) => {
                return(value.id != id)
            });

            if (changedStuds.length) {
                return ("Course deleted. Changed courseslist of students with ids: " + changedStuds)
            } else {
                return ("Course deleted. No students were enrolled.")
            }
        } else {
            throw new Error("Course doesn't exists.")
        }
    }

    addNewStudent(student) {
        if (this.isStudentPresent(student.id)) {
            throw new Error("Student already exists.")
        } else {
            this.students.push(new Student(student.id, student.fname, student.lname))
        }
    }

    deleteExistingStudent(id) {
        if (this.isStudentPresent(id)) {
            let changedCourses = []
            for (let i = 0; i < this.courses.length; i++) {
                const course = this.courses[i];
                if (id in course.student_list) {
                    course.student_list.pop(id)
                    changedCourses.push(course.id)
                }
            }
            this.students = this.students.filter((value) => {
                return(value.id !== id)
            });

            if (changedCourses.length) {
                return ("Student deleted. Changed studentlist of courses with ids: " + changedCourses)
            } else {
                return ("Student deleted. No courses were enrolled by the student.")
            }
        } else {
            throw new Error("Student doesn't exists.")
        }
    }

    addStudentCourseMapping(mapping) {
        let course = this.getCourse(mapping.course_id)
        let student = this.getStudent(mapping.student_id)
        
        if (course._active_status) {
            course.addStudent(mapping.student_id)
            student.addCourse(mapping.course_id)
        }
    }

    deleteStudentCourseMapping(mapping) {

        let course = this.getCourse(mapping.course_id)
        let student = this.getStudent(mapping.student_id)

        if (course._active_status) {
            course.deleteStudent(mapping.student_id)
            student.deleteCourse(mapping.course_id)
        }
    }

    activateExistingCourse(id) {
        this.getCourse(id).activateCourse()
    }

    deactivateExistingCourse(id) {
        this.getCourse(id).deactivateCourse()
    }

}



exports.Course = Course
exports.Student = Student
exports.Mapper = Mapper