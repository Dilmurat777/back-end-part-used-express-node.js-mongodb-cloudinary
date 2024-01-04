import fs from 'node:fs';

//get all users
export const getAllUsers = (req, res) => {
  fs.readFile('data/users.json', 'utf8', (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        message: err.message,
      });
    }

    try {
      let jsonData = JSON.parse(data);

      //find by gender
      if (req.query.gender) {
        jsonData = jsonData.filter((item) => item.gender === req.query.gender);
      }

      //find by name
      if (req.query.name) {
        jsonData = jsonData.filter((item) => item.name.startsWith(req.query.name));
      }

      //limit && page
      if (req.query.limit && req.query.page) {
        let limit = req.query.limit;
        let page = req.query.page;
        jsonData = jsonData.filter(
          (item, idx) => idx >= page * limit - limit && idx < page * limit,
        );
      } else if (req.query.limit) {
        jsonData = jsonData.slice(0, req.query.limit);
      }

      //filter by asc && desc
      if (req.query.sort === 'age' && req.query.age) {
        const order = req.query.age.toLowerCase() === 'asc' ? 1 : -1;
        jsonData.sort((a, b) => a.age - b.age);
      }

      //find by email
      if (req.query.email) {
        data = data.filter((item) => item.email.startsWith(req.query.email));
      }
      res.json(jsonData);
    } catch (err) {
      console.error('Ошибка при разборе JSON:', err);
    }
  });
};

//find by id
export const getOneUser = (req, res) => {
  fs.readFile('data/users.json', 'utf8', (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        message: err.message,
      });
    }
    try {
      let jsonData = JSON.parse(data);
      const user = jsonData.find((item) => item.id == req.params.id);
      if (!user) {
        throw new Error('Пользователь не найден');
      }
      res.json(user);
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  });
};

//create one user
export const createOneUser = (req, res) => {
  fs.readFile('data/users.json', 'utf8', (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        message: err.message,
      });
    }
    try {
      let jsonData = JSON.parse(data);
      let newData = [...jsonData, req.body];
      fs.writeFile('data/users.json', JSON.stringify(newData), () => {
        res.json(req.body);
      });
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  });
};

//update one user
export const updateOneUser = (req, res) => {
  fs.readFile('data/users.json', 'utf8', (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        message: err.message,
      });
    }
    try {
      let jsonData = JSON.parse(data);
      let newData = jsonData.map((item) => {
        if (item.id == req.params.id) {
          return { ...item, ...req.body };
        } else {
          return item;
        }
      });
      fs.writeFile('data/users.json', JSON.stringify(newData), () => {
        res.json(newData);
      });
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  });
};

//delete one user

export const deleteOneUser = (req, res) => {
  fs.readFile('data/users.json', 'utf8', (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        error: err.message, 
      });
    }
    try {
      let jsonData = JSON.parse(data);
      let newData = jsonData.filter((item) => item.id !== parseInt(req.params.id))
      fs.writeFile('data/users.json', JSON.stringify(newData), (err) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            error: err.message, 
          });
        }
        res.json(newData);
      });
    } catch (err) {
      res.status(500).json({
        error: err.message, 
      });
    }
  });
};

