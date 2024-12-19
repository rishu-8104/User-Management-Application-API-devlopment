const express = require('express');
const { Sequelize, DataTypes, Op } = require('sequelize');

// Database setup
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.db',
});

// Model definitions
const User = sequelize.define('User', {
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  timestamps: false,
});

const Address = sequelize.define('Address', {
  street: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  timestamps: false,
});

// Relationship
User.hasMany(Address);
Address.belongsTo(User);

// Express setup
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
// Search  (HTTP GET)
app.get('/api/users', async (req, res) => {
    try {
      const { firstName, lastName, city } = req.query;
  
      const whereClause = {
        [Op.and]: [
          firstName && { firstName },
          lastName && { lastName },
        ],
      };
  
      if (city) {
        whereClause[Op.and].push({ '$Addresses.city$': city });
      }
  
      const users = await User.findAll({
        where: whereClause,
        include: [
          {
            model: Address,
            attributes: ['street', 'city'],
          },
        ],
      });
  
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  

// Add (HTTP POST)
app.post('/api/users', async (req, res) => {
  try {
    const { firstName, lastName, address } = req.body;

    // Create user and associated address
    const newUser = await User.create(
      {
        firstName,
        lastName,
        Addresses: [address], // Use the association to create the address
      },
      {
        include: Address, // Include the Address model in the creation process
      }
    );

    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Modify (HTTP UPDATE)
app.put('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, address } = req.body;

    const user = await User.findByPk(id, {
      include: Address, // Include the Address model
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user fields
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;

    // Update address fields
    if (address) {
      if (address.street) user.Addresses[0].street = address.street;
      if (address.city) user.Addresses[0].city = address.city;
    }

    // Save changes
    await user.save();

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete (HTTP DELETE)
app.delete('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      include: Address, // Include the Address model
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Destroy associated address first
    await user.Addresses[0].destroy();

    // Destroy user
    await user.destroy();

    res.json({ message: 'User and associated address deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Database synchronization (creates tables if not exists)
sequelize.sync().then(() => {
  // Start server
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
