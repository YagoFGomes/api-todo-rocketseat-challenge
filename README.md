# This project is a todo frontend app and is part of a challenge by Rocketseat 🚀

This API, built using Fastify, Prisma, and tested with Vitest and Supertest, provides a comprehensive task management solution. It allows users to create, edit, mark as complete, filter, and delete tasks efficiently. The integration of Fastify ensures optimal performance, while Prisma offers robust database management. Vitest and Supertest contribute to a reliable, well-tested application, ensuring a seamless user experience for managing tasks.

# Installation
Clone the project repository:
```bash
  git clone https://github.com/YagoFGomes/api-todo-rocketseat-challenge.git
```
## Run the docker-compose file:
```bash
  docker-compose -f docker-composer.dev.yml up -d
```

## Task object anatomy
```bash
  {
    "id": uuid,
    "title": string,
    "description": string,
    "completed_at": datetime | null,
    "created_at": datetime,
    "updated_at": datetime
  }
```

## Usage
To use the API, you will need to send requests to the following endpoints:

### Create task

```bash
  POST /tasks
```
Required json body
```bash
  {
      "title": "string",
      "description": "string"
  }
```

Return status: 201 Created


### Get all tasks
```bash
  GET /tasks
```
Return
```bash
{
   "tasks": [
      {task object}
   ]
}
```
Return status: 200 OK


### Filter tasks
```bash
  GET /tasks?title=title_task
  # or
  GET /tasks?description=task_description
  # or
  GET /tasks?title=title_task&description=task_description
```
Return status: 200 OK
```bash
{
   "tasks": [
      {task object},
      {task object}
   ]
}  
```


### Edit task
```bash
  PUT /tasks/:id_task
``` 
Required json body 
```bash
   {
      "title": "Title changed",
      "description": "Description changed"
  }
```
Return status: 200 OK
```bash
 {
  "tasks": [
    {
      "id": uuid,
      "title": "Title changed",
      "description": "Description changed",
      "completed_at": null,
      "created_at": datetime,
      "updated_at": datetime
    }
  ]
}
```

### Complete task
```bash
  PATCH /tasks/:id_task/completed
``` 

Return status: 200 OK
```bash
 {
  "tasks": [
    {
      "id": uuid,
      "title": string,
      "description": string,
      "completed_at": datetime, <-- save datetime 
      "created_at": datetime,
      "updated_at": datetime
    }
  ]
}
```

### Uncomplete task
```bash
  PATCH /tasks/:id_task/uncompleted
``` 

Return status: 200 OK
```bash
 {
  "tasks": [
    {
      "id": uuid,
      "title": string,
      "description": string,
      "completed_at": null, <-- return to null
      "created_at": datetime,
      "updated_at": datetime
    }
  ]
}
```

### Delete task
```bash
  DELETE /tasks/:id_task
``` 
Return status: 200 OK

### Testing
The API is tested using Vitest and Supertest. To run the tests, simply run the following command:

```bash
  npm run test
``` 
