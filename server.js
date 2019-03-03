var express = require("express")
var Joi = require("joi")
var pug = require("pug")
var classDefs = require("./ClassDefs.js")

app = express()

app.use(express.urlencoded({
	extended: true
}))
app.use(express.json())
app.use(express.static("./public"))

app.set("views", "./views")
app.set("view engine", "pug")

app.locals.map = new classDefs.Mapper()

app.get("/home", (req, res) => {
	res.render("home", {
		courses: app.locals.map.courses,
		students: app.locals.map.students
	})
})

app.get("/course", (req, res) => {
	res.render("course", {
		message: " "
	})
})

app.post("/course", (req, res) => {
	if (req.body.action === "add") {
		try {
			const schema = {
				id: Joi.number().min(1000).max(1999).required(),
				name: Joi.string().required(),
				action: Joi.string()
			}
			const result = Joi.validate(req.body, schema)
			
			if (result.error) {
				throw result.error
			} else {
				let newCourse = new classDefs.Course(req.body.id, req.body.name)
				app.locals.map.addNewCourse(newCourse)
				res.render("course", {
					message: "Course Sucessfully added."
				})
			}
		} catch (error) {
			res.render("course", {
				message: error.message
			})
		}
	} else if (req.body.action === "delete") {
		try {
			message = app.locals.map.deleteExistingCourse(req.body.id)
			res.render("course", {
				message: message
			})
		} catch (error) {
			res.render("course", {
				message: error.message
			})
		}
	} else if (req.body.action === "view") {
		try {
			let course = app.locals.map.getCourse(req.body.id)
			res.render("viewcourse", {
				course: course
			}) 
		} catch (error) {
			res.render("course", {
				message: error.message
			})
		}
	} else if (req.body.action === "activate") {
		try {
			const schema = {
				id: Joi.number().min(1000).max(1999).required(),
				name: Joi.string().allow('').optional(),
				action: Joi.string()
			}
			const result = Joi.validate(req.body, schema)

			if (result.error) {
				throw result.error
			} else {
				app.locals.map.activateExistingCourse(req.body.id)
				res.render("course", {
					message: "Course Activated"
				})
			}
		} catch (error) {
			res.render("course", {
				message: error.message
			})   
		}
	} else if (req.body.action === "deactivate") {
		try {
			const schema = {
				id: Joi.number().min(1000).max(1999).required(),
				name: Joi.string().allow('').optional(),
				action: Joi.string()
			}
			const result = Joi.validate(req.body, schema)

			if (result.error) {
				throw result.error
			} else {
				app.locals.map.deactivateExistingCourse(req.body.id)
				res.render("course", {
					message: "Course Deactivated"
				})
			}
		} catch (error) {
			res.render("course", {
				message: error.message
			})
		}
	} else {
		res.render("course", {
			message: "Invalid Action"
		})
	}
})

app.get("/viewcourse/:id", (req, res) => {
	try {
		let course = app.locals.map.getCourse(req.params.id)
		res.render("viewcourse", {
			course: course
		})
	} catch (error) {
		res.render("course", {
			message: error.message
		})
	}
})

app.get("/student", (req, res) => {
	res.render("student", {
		message: " "
	})
})

app.post("/student", (req, res) => {
	if (req.body.action === "add") {
		try {
			const schema = {
				id: Joi.number().min(3000).required(),
				fname: Joi.string().required(),
				lname: Joi.string().required(),
				action: Joi.string()
			}
			const result = Joi.validate(req.body, schema)
			
			if (result.error) {
				throw result.error
			} else {
				let newStudent = new classDefs.Student(req.body.id, req.body.fname, req.body.lname)
				app.locals.map.addNewStudent(newStudent)
				res.render("student", {
					message: "Student Sucessfully added."
				})
			}
		} catch (error) {
			res.render("student", {
				message: error.message
			})
		}
	} else if (req.body.action === "delete") {
		try {
			let message = app.locals.map.deleteExistingStudent(req.body.id)
			res.render("student", {
				message: message
			})
		} catch (error) {
			res.render("student", {
				message: error.message
			})
		}
	} else if (req.body.action === "view") {
		try {
			let student = app.locals.map.getStudent(req.body.id)
			res.render("viewstudent", {
				student: student
			})
		} catch (error) {
			res.render("student", {
				message: error.message
			})
		}
	} else {
		res.render("student", {
			message: "Invalid Action"
		})
	}
})

app.get("/viewstudent/:id", (req, res) => {
	try {
		let student = app.locals.map.getStudent(req.params.id)
		res.render("viewstudent", {
			student: student
		})
	} catch (error) {
		res.render("student", {
			message: error.message
		})
	}
})

app.get("/map", (req, res) => {
	res.render("map", {
		message: " "
	})
})

app.post("/map", (req, res) => {
	if (req.body.action === "createmapping") {
		try {
			const schema = {
				course_id: Joi.number().min(1000).max(1999).required(),
				student_id: Joi.number().min(3000).required(),
				action: Joi.string()
			}

			const result = Joi.validate(req.body, schema)

			if (result.error) {
				throw result.error
			} else {
				app.locals.map.addStudentCourseMapping(req.body)
				res.render("map", {
					message: "Student Enrolled to Course"
				})
			}
		} catch (error) {
			res.render("map", {
				message: error.message
			})
		}
	} else if (req.body.action === "deletemapping") {
		try {
			const schema = {
				course_id: Joi.number().min(1000).max(1999).required(),
				student_id: Joi.number().min(3000).required(),
				action: Joi.string()
			}
			const result = Joi.validate(req.body, schema)

			if (result.error) {
				throw result.error
			} else {
				app.locals.map.deleteStudentCourseMapping(req.body)
				res.render("map", {
					message: "Student deregistered to Course."
				})
			}
		} catch (error) {
			res.render("map", {
				message: error.message
			})
		}
	} else {
		res.render("map", {
			message: "Invalid Action"
		})
	}
})


app.listen(3000)